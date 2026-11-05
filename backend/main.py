import os
import io
import re
import json
import zipfile
import asyncio
import tempfile
import threading
import ipaddress
from urllib.parse import quote, urlparse
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image
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
rembg_lock = threading.Lock()

def get_rembg_session(model_name: str):
    global rembg_sessions
    with rembg_lock:
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

def format_content_disposition(filename: str) -> str:
    """
    Safely formats Content-Disposition header conforming to RFC 6266 and RFC 5987.
    Prevents 'latin-1' codec UnicodeEncodeError crashes when uploaded filenames
    contain unicode characters, dashes (–, —), accents, or emojis.
    """
    clean_name = re.sub(r'[\r\n\t]', '', filename or "file")
    # Sanitize surrogate pairs or invalid unicode
    clean_name = clean_name.encode("utf-8", errors="replace").decode("utf-8")
    # ASCII fallback with non-ASCII characters replaced by '_'
    ascii_name = re.sub(r'[^\x20-\x7E]', '_', clean_name).replace('"', '').strip()
    if not ascii_name:
        ascii_name = "download"
    # RFC 5987 UTF-8 percent-encoded name for modern browsers
    encoded_name = quote(clean_name, encoding="utf-8", errors="replace")
    return f'attachment; filename="{ascii_name}"; filename*=UTF-8\'\'{encoded_name}'

def parse_ranges(range_str: str, max_pages: int) -> List[int]:
    """
    Parses a user page range string (e.g. "1-3, 5, 8-10" or "all") into 0-indexed page numbers.
    """
    if not range_str:
        return []
    if range_str.strip().lower() == "all":
        return list(range(max_pages))
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
                # Reject completely out-of-bounds ranges instead of clamping onto final/first page
                if start >= max_pages or end < 0 or min(start, end) >= max_pages or max(start, end) < 0:
                    continue
                # Clip partial overlap bounds
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

    # Deduplicate page indices while preserving order
    seen = set()
    unique_pages = []
    for p in pages:
        if p not in seen:
            seen.add(p)
            unique_pages.append(p)
    return unique_pages

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Utilify Backend Services"}

@app.post("/image/remove-bg")
async def remove_background(
    file: UploadFile = File(...),
    post_process: bool = Form(False),
    model: str = Form("isnet-general-use")
):
    """
    Removes the background from an uploaded image using deep learning neural network models.
    Supports isnet-general-use (default high-fidelity), silueta, u2net, u2net_human_seg, and u2net_cloth_seg.
    """
    if not (file.content_type or "").lower().startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # Read uploaded image bytes
        file_bytes = await file.read()
        
        valid_models = ["isnet-general-use", "silueta", "u2net", "u2net_human_seg", "u2net_cloth_seg"]
        target_model = model if model in valid_models else "isnet-general-use"
        
        print(f"Utilizing AI background removal model ({target_model}, post_process={post_process}).")

        def _process_remove_bg() -> bytes:
            session = get_rembg_session(target_model)
            from rembg import remove
            output_bytes = remove(
                file_bytes,
                session=session,
                alpha_matting=False,
                post_process_mask=post_process
            )
            output_buffer = io.BytesIO()
            with Image.open(io.BytesIO(output_bytes)) as output_image:
                output_image.save(output_buffer, format="PNG")
            return output_buffer.getvalue()

        png_bytes = await asyncio.to_thread(_process_remove_bg)
        
        raw_filename = file.filename or "image.png"
        filename = f"no-bg-{raw_filename}"
        if not filename.lower().endswith(".png"):
            filename = filename.rsplit(".", 1)[0] + ".png"

        return Response(
            content=png_bytes,
            media_type="image/png",
            headers={"Content-Disposition": format_content_disposition(filename)}
        )
    except Exception as e:
        print(f"Background removal crash: {e}")
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")

@app.post("/pdf/to-image")
async def pdf_to_image(
    file: UploadFile = File(...),
    format: str = Form("png")
):
    """
    Converts PDF pages into individual high-resolution PNG or JPG images packed inside a ZIP.
    """
    if (file.content_type or "").lower() != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    try:
        pdf_bytes = await file.read()
        is_jpg = (format or "png").strip().lower() in ("jpg", "jpeg")
        pymupdf_fmt = "jpeg" if is_jpg else "png"
        ext = "jpg" if is_jpg else "png"

        def _process_pdf_to_image() -> bytes:
            import fitz
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            try:
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                    for page_num in range(len(doc)):
                        page = doc[page_num]
                        # Render page at 2x resolution (150 DPI approx) for clear text
                        pix = page.get_pixmap(dpi=150)
                        img_data = pix.tobytes(pymupdf_fmt)
                        img_filename = f"page_{page_num + 1}.{ext}"
                        zip_file.writestr(img_filename, img_data)
                return zip_buffer.getvalue()
            finally:
                doc.close()

        zip_bytes = await asyncio.to_thread(_process_pdf_to_image)
        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={"Content-Disposition": format_content_disposition("images.zip")}
        )
    except Exception as e:
        print(f"PDF to Image crash: {e}")
        raise HTTPException(status_code=500, detail=f"PDF to image conversion failed: {str(e)}")

@app.post("/pdf/split")
async def split_pdf(
    file: UploadFile = File(...),
    page_ranges: Optional[str] = Form(None),
    pages: Optional[str] = Form(None)
):
    """
    Splits a PDF by extracting specific page ranges or packaging all individual pages into a ZIP archive.
    """
    if (file.content_type or "").lower() != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    effective_ranges = (page_ranges or pages or "all").strip()

    try:
        pdf_bytes = await file.read()
        raw_filename = file.filename or "document.pdf"
        base_name = os.path.splitext(raw_filename)[0]

        def _process_split_pdf():
            import fitz
            src_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            try:
                max_pages = len(src_doc)
                if max_pages == 0:
                    raise HTTPException(status_code=400, detail="The uploaded PDF contains no pages.")

                # Case 1: Split every page into individual PDF files bundled in a ZIP
                if effective_ranges.lower() == "all":
                    zip_buffer = io.BytesIO()
                    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                        for p in range(max_pages):
                            single_doc = fitz.open()
                            try:
                                single_doc.insert_pdf(src_doc, from_page=p, to_page=p)
                                pdf_buf = io.BytesIO()
                                single_doc.save(pdf_buf)
                                zip_file.writestr(f"{base_name}_page_{p + 1}.pdf", pdf_buf.getvalue())
                            finally:
                                single_doc.close()

                    return (
                        zip_buffer.getvalue(),
                        "application/zip",
                        f"{base_name}_split_pages.zip",
                    )

                # Case 2: Extract specific page ranges into a single merged PDF
                pages_to_extract = parse_ranges(effective_ranges, max_pages)
                if not pages_to_extract:
                    raise HTTPException(status_code=400, detail="Invalid page ranges provided.")
                    
                dest_doc = fitz.open()
                try:
                    for p in pages_to_extract:
                        dest_doc.insert_pdf(src_doc, from_page=p, to_page=p)
                        
                    output_buffer = io.BytesIO()
                    dest_doc.save(output_buffer)
                    return (
                        output_buffer.getvalue(),
                        "application/pdf",
                        f"split-{raw_filename}",
                    )
                finally:
                    dest_doc.close()
            finally:
                src_doc.close()

        content_bytes, media_type, disp_filename = await asyncio.to_thread(_process_split_pdf)
        return Response(
            content=content_bytes,
            media_type=media_type,
            headers={"Content-Disposition": format_content_disposition(disp_filename)}
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
        if (file.content_type or "").lower() != "application/pdf" and not (file.filename or "").lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"File {file.filename or 'unknown'} is not a PDF.")

    try:
        file_payloads = []
        for file in files:
            file_payloads.append(await file.read())

        def _process_merge_pdf() -> bytes:
            import fitz
            dest_doc = fitz.open()
            try:
                for file_bytes in file_payloads:
                    src_doc = fitz.open(stream=file_bytes, filetype="pdf")
                    try:
                        dest_doc.insert_pdf(src_doc)
                    finally:
                        src_doc.close()
                output_buffer = io.BytesIO()
                dest_doc.save(output_buffer)
                return output_buffer.getvalue()
            finally:
                dest_doc.close()

        merged_bytes = await asyncio.to_thread(_process_merge_pdf)
        return Response(
            content=merged_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": format_content_disposition("merged.pdf")}
        )
    except Exception as e:
        print(f"Merge PDF crash: {e}")
        raise HTTPException(status_code=500, detail=f"PDF merging failed: {str(e)}")

class HtmlRequest(BaseModel):
    html: str

def _is_blocked_url(url: str, resource_type: str = "", is_navigation: bool = False) -> bool:
    """
    Blocks SSRF, local file access, data: frame navigations, and cloud metadata endpoints.
    """
    if not url:
        return True
    lower_url = url.strip().lower()
    if lower_url.startswith("about:blank"):
        return False
    if lower_url.startswith("data:"):
        if is_navigation or resource_type in ("document", "iframe", "sub_frame", "frame"):
            return True
        return False
    if not (lower_url.startswith("http://") or lower_url.startswith("https://")):
        return True

    try:
        parsed = urlparse(lower_url)
        host = (parsed.hostname or "").strip("[]").lower()
        if not host:
            return True
        if host in (
            "localhost",
            "metadata.google.internal",
            "metadata",
            "169.254.169.254",
            "0.0.0.0",
            "127.0.0.1",
            "::1",
            "::",
        ) or host.endswith(".internal") or host.endswith(".local"):
            return True
        try:
            ip = ipaddress.ip_address(host)
            if (
                ip.is_private
                or ip.is_loopback
                or ip.is_link_local
                or ip.is_multicast
                or ip.is_reserved
                or ip.is_unspecified
            ):
                return True
        except ValueError:
            pass
    except Exception:
        return True

    return False

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
            try:
                page = await browser.new_page()

                async def _intercept_route(route):
                    req = route.request
                    if _is_blocked_url(req.url, req.resource_type, req.is_navigation_request()):
                        await route.abort("accessdenied")
                    else:
                        await route.continue_()

                await page.route("**/*", _intercept_route)
                
                # Load the styled HTML content and wait for it to be parsed completely
                await page.set_content(request.html, wait_until="networkidle")
                
                # Print to A4 PDF with exact 1cm margins matching Puppeteer style
                pdf_bytes = await page.pdf(
                    format="A4",
                    print_background=True,
                    margin={"top": "1cm", "right": "1cm", "bottom": "1cm", "left": "1cm"}
                )
            finally:
                await browser.close()
            
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": format_content_disposition("document.pdf")}
        )
    except Exception as e:
        print(f"HTML to PDF crash: {e}")
        raise HTTPException(status_code=500, detail=f"HTML to PDF conversion failed: {str(e)}")

class RateRequest(BaseModel):
    tool: str
    rating: int

def _resolve_ratings_file() -> str:
    local_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ratings_db.json")
    if os.path.exists(local_path):
        return local_path
    try:
        # Check if local directory is writable by touching the file
        with open(local_path, "a", encoding="utf-8") as f:
            pass
        return local_path
    except Exception:
        # Fallback to system temp directory if local filesystem is read-only
        return os.path.join(tempfile.gettempdir(), "utilify_ratings_db.json")

# Initialize Google Cloud Firestore client for permanent ratings storage
firestore_db = None
try:
    from google.cloud import firestore
    # On Google Cloud Run, firestore.Client() automatically authenticates via ADC
    firestore_db = firestore.Client()
    print("Google Cloud Firestore client initialized successfully!")
except Exception as e:
    print(f"Firestore client initialization skipped or running locally: {e}")
    firestore_db = None

RATINGS_FILE = _resolve_ratings_file()
ratings_db = {}

def load_ratings():
    global ratings_db
    # 1. Try fetching persistent authentic ratings from Google Cloud Firestore
    if firestore_db is not None:
        try:
            docs = firestore_db.collection("ratings").stream()
            loaded = {}
            for doc in docs:
                data = doc.to_dict() or {}
                loaded[doc.id] = {
                    "sum": int(data.get("sum", 0)),
                    "count": int(data.get("count", 0)),
                }
            ratings_db.update(loaded)
            return
        except Exception as e:
            print(f"Failed to fetch ratings from Firestore: {e}")

    # 2. Fallback to local cache file if Firestore is unavailable
    try:
        if os.path.exists(RATINGS_FILE):
            with open(RATINGS_FILE, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    ratings_db = json.loads(content)
    except Exception as e:
        print(f"Failed to load ratings from {RATINGS_FILE}: {e}")

def save_ratings():
    try:
        with open(RATINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(ratings_db, f, indent=2)
    except Exception as e:
        print(f"Failed to save ratings to {RATINGS_FILE}: {e}")

load_ratings()

@app.get("/api/ratings")
async def get_ratings(tool: str = None):
    """
    Returns authentic community ratings for a specific tool or all tools.
    """
    if tool:
        normalized = tool.strip("/").split("?")[0]
        # Query Firestore directly for real-time accuracy if available
        if firestore_db is not None:
            try:
                doc = firestore_db.collection("ratings").document(normalized).get()
                if doc.exists:
                    data = doc.to_dict() or {}
                    cnt = int(data.get("count", 0))
                    val = round(data.get("sum", 0) / cnt, 1) if cnt > 0 else 0.0
                    return {
                        "tool": normalized,
                        "ratingValue": val,
                        "reviewCount": cnt
                    }
                else:
                    return {
                        "tool": normalized,
                        "ratingValue": 0.0,
                        "reviewCount": 0
                    }
            except Exception as e:
                print(f"Firestore single-tool query error: {e}")

        load_ratings()
        data = ratings_db.get(normalized, {"sum": 0, "count": 0})
        val = round(data["sum"] / data["count"], 1) if data["count"] > 0 else 0.0
        return {
            "tool": normalized,
            "ratingValue": val,
            "reviewCount": data["count"]
        }
    
    load_ratings()
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
    Submits a genuine user rating (1-5 stars) for a tool and persists it to Firestore.
    """
    if req.rating < 1 or req.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5.")
    
    normalized = req.tool.strip("/").split("?")[0]

    # 1. Permanently record genuine rating in Google Cloud Firestore using atomic increments
    if firestore_db is not None:
        try:
            from google.cloud import firestore
            doc_ref = firestore_db.collection("ratings").document(normalized)
            doc_ref.set({
                "sum": firestore.Increment(req.rating),
                "count": firestore.Increment(1),
                "last_updated": firestore.SERVER_TIMESTAMP
            }, merge=True)
        except Exception as e:
            print(f"Failed to persist rating to Firestore: {e}")

    # 2. Update local in-memory fallback cache
    load_ratings()
    if normalized not in ratings_db:
        ratings_db[normalized] = {"sum": 0, "count": 0}
    ratings_db[normalized]["sum"] += req.rating
    ratings_db[normalized]["count"] += 1
    save_ratings()
    
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
    # Start on port provided by Cloud Run / environment or default to 8000
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

