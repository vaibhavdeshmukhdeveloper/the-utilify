# Backend Architecture & Agent Guidelines (`/backend`)

This directory contains the FastAPI microservices backend for **The Utilify**, containerized with Docker and auto-deployed to **Google Cloud Run**.

---

## 1. Core Principles & Memory Architecture

1. **Strict In-Memory Processing (Zero Retention):**
   - User uploaded files (`UploadFile`) must NEVER be written to persistent storage or local disks.
   - Use `io.BytesIO()` streams for image manipulation (PIL), PDF operations (PyMuPDF `fitz`), and archive packaging (`zipfile`).
   - Discard all binary data from memory immediately upon streaming the `Response` or `StreamingResponse`.

2. **Resource & Threading Constraints:**
   - On containerized deployments (Google Cloud Run), ONNX Runtime multi-threading can cause CPU thread spinning, deadlocks, or OOM crashes.
   - Keep `os.environ["OMP_NUM_THREADS"] = "1"` and `os.environ["OMP_WAIT_POLICY"] = "PASSIVE"`.
   - Maintain at most one active `rembg` model session in memory at a time. When switching sessions, clear `rembg_sessions` and explicitly trigger garbage collection (`gc.collect()`).
   - Model weights directory is pinned to `BACKEND_DIR/.u2net` to prevent unpinned runtime downloads and facilitate container caching.

3. **CORS & Security:**
   - CORS middleware configured with `allow_origins=["*"]`, `allow_methods=["*"]`, `allow_headers=["*"]`, and `expose_headers=["Content-Disposition"]`.
   - Validate MIME types and file extensions before processing and return standard HTTP 400/413/422/500 status codes with descriptive error details.

---

## 2. Microservice Endpoints

| Endpoint | Method | Engine | Description |
| :--- | :--- | :--- | :--- |
| `/health` or `/` | `GET` | FastAPI | Health check verifying backend status |
| `/image/remove-bg` | `POST` | PIL Floodfill + `rembg[cpu]` ONNX | Removes image background via instant solid floodfill or AI neural network (`isnet-general-use`, `silueta`, `u2net`, `u2net_human_seg`, `u2net_cloth_seg`) |
| `/pdf/to-image` | `POST` | PyMuPDF (`fitz`) + `zipfile` | Converts PDF pages into 150 DPI (2x) PNGs packed into a `.zip` archive |
| `/pdf/split` | `POST` | PyMuPDF (`fitz`) | Extracts selected page ranges (e.g. `1-3, 5, 8-10`) into a new PDF |
| `/pdf/merge` | `POST` | PyMuPDF (`fitz`) | Combines multiple PDF files sequentially into a single PDF |
| `/pdf/html-to-pdf` | `POST` | Playwright Chromium | Renders styled HTML/Markdown to pixel-perfect A4 PDF with 1cm print margins |

---

## 3. Background Removal Pipeline

1. **Pre-flight Mathematical Solid Background Detector (`clean_solid_background`):**
   - Samples the 4 corner pixels of the input image.
   - If all 4 corners have matching colors (within Euclidean color distance threshold), executes an instant corner-based flood fill mask.
   - Bypasses heavy neural network execution for solid vector graphics, logos, and product shots with flat backdrops (sub-10ms response time).
2. **AI Neural Network Fallback:**
   - For complex scenes and photographs, delegates to ONNX runtime session (`rembg.remove()`).
   - Default model: `isnet-general-use`.
   - Pre-loads default model asynchronously at startup during FastAPI lifespan to eliminate cold-start latency.

---

## 4. Local Development & Testing

- **Run Backend Locally:**
  ```powershell
  cd backend
  python -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt
  playwright install chromium
  uvicorn main:app --reload --port 8000
  ```
  *(Or execute `.\run_backend.ps1` from the repository root)*

- **Docker Build & Local Testing:**
  ```bash
  docker build -t utilify-backend ./backend
  docker run -p 8000:8000 utilify-backend
  ```
