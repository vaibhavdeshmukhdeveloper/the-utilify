import os
import io
import zipfile
import asyncio
from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from PIL import Image, ImageDraw, ImageChops
from pydantic import BaseModel

# Set custom U2NET_HOME directory inside our project to prevent ephemeral runtime downloads
# and make it easily cacheable/bakeable in Docker.
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
os.environ["U2NET_HOME"] = os.path.join(BACKEND_DIR, ".u2net")

# Limit ONNX Runtime threading and disable active thread spinning to prevent
# container hangs, deadlocks, and cgroup CPU throttling in resource-constrained hosting (e.g. Railway)
# Allow overriding via environment variables (e.g. on Google Cloud Run)
if "OMP_NUM_THREADS" not in os.environ:
    os.environ["OMP_NUM_THREADS"] = "1"
if "OMP_WAIT_POLICY" not in os.environ:
    os.environ["OMP_WAIT_POLICY"] = "PASSIVE"

# Global dictionary to cache loaded model sessions for low latency
rembg_sessions = {}

def get_rembg_session(model_name: str):
    global rembg_sessions
    if model_name not in rembg_sessions:
        from rembg import new_session
        print(f"Loading AI background removal model ({model_name})...")
        
        # To avoid OOM in memory-constrained environments (e.g. Cloud Run),
        # keep at most one model session loaded in RAM at a time.
        if len(rembg_sessions) >= 1:
            print("Clearing cached sessions from memory...")
            rembg_sessions.clear()
            import gc
            gc.collect()
            
        rembg_sessions[model_name] = new_session(model_name)
        print(f"Model {model_name} loaded successfully!")
    return rembg_sessions[model_name]

# Asynchronously pre-load default high-fidelity model in the background so it doesn't block startup
async def preload_models():
    def load():
        try:
            get_rembg_session("isnet-general-use")
        except Exception as e:
            print(f"Failed to pre-load default isnet-general-use model: {e}")
    await asyncio.to_thread(load)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: trigger model pre-loading asynchronously
    asyncio.create_task(preload_models())
    yield

app = FastAPI(
    title="Utilify Backend Services",
    description="High-performance document and image processing APIs.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration matching frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

def parse_ranges(range_str: str, max_pages: int) -> List[int]:
    """
    Parses a user page range string (e.g. "1-3, 5, 8-10") into 0-indexed page numbers.
    """
    pages = []
    for part in range_str.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            try:
                start_str, end_str = part.split("-", 1)
                start = int(start_str.strip()) - 1
                end = int(end_str.strip()) - 1
                # Clip bounds
                start = max(0, min(start, max_pages - 1))
                end = max(0, min(end, max_pages - 1))
                if start <= end:
                    pages.extend(range(start, end + 1))
                else:
                    pages.extend(range(start, end - 1, -1))
            except ValueError:
                continue
        else:
            try:
                p = int(part) - 1
                if 0 <= p < max_pages:
                    pages.append(p)
            except ValueError:
                continue
    return pages

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Utilify Backend Services"}

def clean_solid_background(img: Image.Image, tolerance: int = 20) -> Image.Image:
    """
    Detects if the image has a solid flat background by checking if the 4 corners
    have matching colors. If yes, performs a corner-based flood fill to make the
    background perfectly transparent, preserving internal matching pixels.
    """
    try:
        img = img.convert("RGBA")
        w, h = img.size
        
        corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
        c_colors = [img.getpixel(p) for p in corners]
        
        def color_dist(c1, c2):
            return sum((a - b) ** 2 for a, b in zip(c1[:3], c2[:3])) ** 0.5
            
        first_color = c_colors[0]
        is_solid = True
        for c in c_colors[1:]:
            if color_dist(first_color, c) > 15:
                is_solid = False
                break
                
        if not is_solid:
            return None
            
        mask = Image.new("L", (w, h), 255)
        ref_img = img.convert("RGB")
        temp_ref = ref_img.copy()
        
        fill_color = (0, 255, 0)
        if color_dist(first_color, (0, 255, 0)) < 50:
            fill_color = (255, 0, 0)
            
        for start_point in corners:
            ImageDraw.floodfill(
                temp_ref,
                xy=start_point,
                value=fill_color,
                thresh=tolerance
            )
            
        temp_pixels = temp_ref.load()
        mask_pixels = mask.load()
        
        for y in range(h):
            for x in range(w):
                if temp_pixels[x, y] == fill_color:
                    mask_pixels[x, y] = 0
                    
        r, g, b, a = img.split()
        new_a = ImageChops.darker(a, mask)
        
        return Image.merge("RGBA", (r, g, b, new_a))
    except Exception as e:
        print(f"Solid background detector error: {e}")
        return None

@app.post("/image/remove-bg")
async def remove_background(
    file: UploadFile = File(...),
    post_process: bool = Form(False),
    model: str = Form("isnet-general-use")
):
    """
    Removes the background from an uploaded image.
    Uses an instant high-fidelity floodfill cutout if a flat background is detected,
    otherwise falls back to the high-fidelity AI neural network model.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # Read uploaded image bytes
        file_bytes = await file.read()
        input_image = Image.open(io.BytesIO(file_bytes))
        
        # Keep original format if possible, otherwise save as transparent PNG
        output_buffer = io.BytesIO()
        
        # Pre-flight check: use fast mathematical flood-fill for flat graphics/vector backgrounds
        solid_cutout = clean_solid_background(input_image)
        if solid_cutout is not None:
            print("Solid flat background detected! Utilizing instant high-fidelity floodfill cutout.")
            solid_cutout.save(output_buffer, format="PNG")
        else:
            # Fallback to AI-based neural network model for photographs/complex backgrounds
            valid_models = ["isnet-general-use", "silueta", "u2net", "u2net_human_seg", "u2net_cloth_seg"]
            target_model = model if model in valid_models else "isnet-general-use"
            
            print(f"Complex scene detected. Utilizing global AI background removal model ({target_model}, post_process={post_process}).")
            session = get_rembg_session(target_model)
            from rembg import remove
            output_bytes = remove(
                file_bytes,
                session=session,
                alpha_matting=False,
                post_process_mask=post_process
            )
            output_image = Image.open(io.BytesIO(output_bytes))
            output_image.save(output_buffer, format="PNG")
            
        output_buffer.seek(0)
        
        filename = f"no-bg-{file.filename}"
        if not filename.endswith(".png"):
            filename = filename.rsplit(".", 1)[0] + ".png"

        return Response(
            content=output_buffer.getvalue(),
            media_type="image/png",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except Exception as e:
        print(f"Background removal crash: {e}")
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")

@app.post("/pdf/to-image")
async def pdf_to_image(file: UploadFile = File(...)):
    """
    Converts PDF pages into individual high-resolution PNG images packed inside a ZIP.
    """
    if file.content_type != "application/pdf" and not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    try:
        pdf_bytes = await file.read()
        import fitz
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for page_num in range(len(doc)):
                page = doc[page_num]
                # Render page at 2x resolution (150 DPI approx) for clear text
                pix = page.get_pixmap(dpi=150)
                img_data = pix.tobytes("png")
                
                img_filename = f"page_{page_num + 1}.png"
                zip_file.writestr(img_filename, img_data)
        
        zip_buffer.seek(0)
        return Response(
            content=zip_buffer.getvalue(),
            media_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="images.zip"'}
        )
    except Exception as e:
        print(f"PDF to Image crash: {e}")
        raise HTTPException(status_code=500, detail=f"PDF to image conversion failed: {str(e)}")

@app.post("/pdf/split")
async def split_pdf(file: UploadFile = File(...), page_ranges: str = Form(...)):
    """
    Splits a PDF by extracting specific page ranges or indexes.
    """
    if file.content_type != "application/pdf" and not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    try:
        pdf_bytes = await file.read()
        import fitz
        src_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        max_pages = len(src_doc)
        
        pages_to_extract = parse_ranges(page_ranges, max_pages)
        if not pages_to_extract:
            raise HTTPException(status_code=400, detail="Invalid page ranges provided.")
            
        dest_doc = fitz.open()
        for p in pages_to_extract:
            dest_doc.insert_pdf(src_doc, from_page=p, to_page=p)
            
        output_buffer = io.BytesIO()
        dest_doc.save(output_buffer)
        output_buffer.seek(0)
        
        filename = f"split-{file.filename}"
        return Response(
            content=output_buffer.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Split PDF crash: {e}")
        raise HTTPException(status_code=500, detail=f"PDF splitting failed: {str(e)}")

@app.post("/pdf/merge")
async def merge_pdf(files: List[UploadFile] = File(...)):
    """
    Merges multiple PDF documents in the order they are uploaded into a single PDF.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    for file in files:
        if file.content_type != "application/pdf" and not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF.")

    try:
        import fitz
        dest_doc = fitz.open()
        for file in files:
            file_bytes = await file.read()
            src_doc = fitz.open(stream=file_bytes, filetype="pdf")
            dest_doc.insert_pdf(src_doc)
            
        output_buffer = io.BytesIO()
        dest_doc.save(output_buffer)
        output_buffer.seek(0)
        
        return Response(
            content=output_buffer.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="merged.pdf"'}
        )
    except Exception as e:
        print(f"Merge PDF crash: {e}")
        raise HTTPException(status_code=500, detail=f"PDF merging failed: {str(e)}")

class HtmlRequest(BaseModel):
    html: str

@app.post("/pdf/html-to-pdf")
async def html_to_pdf(request: HtmlRequest):
    """
    Converts compiled HTML with styles directly to a PDF in-memory.
    Uses headless Playwright Chromium for 100% pixel-perfect browser-level rendering.
    """
    try:
        from playwright.async_api import async_playwright
        async with async_playwright() as p:
            # Launch headless chromium with no-sandbox sandbox parameters for Docker compatibility
            browser = await p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox"]
            )
            page = await browser.new_page()
            
            # Load the styled HTML content and wait for it to be parsed completely
            await page.set_content(request.html, wait_until="networkidle")
            
            # Print to A4 PDF with exact 1cm margins matching Puppeteer style
            pdf_bytes = await page.pdf(
                format="A4",
                print_background=True,
                margin={"top": "1cm", "right": "1cm", "bottom": "1cm", "left": "1cm"}
            )
            
            await browser.close()
            
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="document.pdf"'}
        )
    except Exception as e:
        print(f"HTML to PDF crash: {e}")
        raise HTTPException(status_code=500, detail=f"HTML to PDF conversion failed: {str(e)}")

class RateRequest(BaseModel):
    tool: str
    rating: int

ratings_db = {}

@app.get("/api/ratings")
async def get_ratings(tool: str = None):
    """
    Returns authentic community ratings for a specific tool or all tools.
    """
    if tool:
        normalized = tool.strip("/").split("?")[0]
        data = ratings_db.get(normalized, {"sum": 0, "count": 0})
        val = round(data["sum"] / data["count"], 1) if data["count"] > 0 else 0.0
        return {
            "tool": normalized,
            "ratingValue": val,
            "reviewCount": data["count"]
        }
    
    summary = {}
    for k, v in ratings_db.items():
        summary[k] = {
            "ratingValue": round(v["sum"] / v["count"], 1) if v["count"] > 0 else 0.0,
            "reviewCount": v["count"]
        }
    return summary

@app.post("/api/rate")
async def submit_rating(req: RateRequest):
    """
    Submits a genuine user rating (1-5 stars) for a tool.
    """
    if req.rating < 1 or req.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")
    
    normalized = req.tool.strip("/").split("?")[0]
    if normalized not in ratings_db:
        ratings_db[normalized] = {"sum": 0, "count": 0}
    
    ratings_db[normalized]["sum"] += req.rating
    ratings_db[normalized]["count"] += 1
    
    data = ratings_db[normalized]
    val = round(data["sum"] / data["count"], 1)
    return {
        "success": True,
        "tool": normalized,
        "ratingValue": val,
        "reviewCount": data["count"]
    }

if __name__ == "__main__":
    import uvicorn
    # Start on port 8000 matching frontend NEXT_PUBLIC_API_URL
    uvicorn.run(app, host="0.0.0.0", port=8000)

