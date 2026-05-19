import io
import zipfile
from typing import List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from PIL import Image
from pydantic import BaseModel
import fitz  # PyMuPDF
from rembg import new_session, remove
from xhtml2pdf import pisa

app = FastAPI(
    title="Utilify Backend Services",
    description="High-performance document and image processing APIs.",
    version="1.0.0"
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

# Global rembg session management as requested for low latency
# Switches background removal engine to silueta for memory efficiency on cloud servers
print("Initializing global AI background removal model (silueta)...")
rembg_session = new_session("silueta")
print("AI Model loaded successfully!")

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

@app.post("/image/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    """
    Removes the background from an uploaded image using the rembg AI engine.
    Uses 'isnet-general-use' session, disabled alpha_matting, and enabled post_process_mask.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # Read uploaded image bytes
        file_bytes = await file.read()
        input_image = Image.open(io.BytesIO(file_bytes))
        
        # Keep original format if possible, otherwise save as transparent PNG
        output_buffer = io.BytesIO()
        
        # Run background removal using the global session
        # Fine-tuned parameters: alpha_matting=False to avoid artifacts, post_process_mask=True for hole filling
        output_bytes = remove(
            file_bytes,
            session=rembg_session,
            alpha_matting=False,
            post_process_mask=True
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
        raise HTTPException(status_code=500, detail=f"AI Background removal failed: {str(e)}")

@app.post("/pdf/pdf-to-image")
async def pdf_to_image(file: UploadFile = File(...)):
    """
    Converts PDF pages into individual high-resolution PNG images packed inside a ZIP.
    """
    if file.content_type != "application/pdf" and not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    try:
        pdf_bytes = await file.read()
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

@app.post("/pdf/split-pdf")
async def split_pdf(file: UploadFile = File(...), page_ranges: str = Form(...)):
    """
    Splits a PDF by extracting specific page ranges or indexes.
    """
    if file.content_type != "application/pdf" and not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a PDF.")

    try:
        pdf_bytes = await file.read()
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

@app.post("/pdf/merge-pdf")
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
    Uses xhtml2pdf to completely run without Puppeteer/headless browser.
    """
    try:
        pdf_buffer = io.BytesIO()
        # Create PDF from HTML string
        pisa_status = pisa.CreatePDF(request.html, dest=pdf_buffer)
        
        if pisa_status.err:
            raise HTTPException(status_code=500, detail="PDF generation failed during rendering")
            
        pdf_buffer.seek(0)
        return Response(
            content=pdf_buffer.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="document.pdf"'}
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"HTML to PDF crash: {e}")
        raise HTTPException(status_code=500, detail=f"HTML to PDF conversion failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Start on port 8000 matching frontend NEXT_PUBLIC_API_URL
    uvicorn.run(app, host="0.0.0.0", port=8000)
