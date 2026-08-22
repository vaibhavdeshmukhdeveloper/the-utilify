# Backend Architecture & Agent Guidelines (`/backend`)

This directory contains the FastAPI microservices backend for **The Utilify**, containerized with Docker and auto-deployed to **Google Cloud Run**.

---

## 1. Core Principles

1. **Strict In-Memory Processing (Zero Retention):**
   - User uploaded files (`UploadFile`) must NEVER be saved to persistent disk.
   - Use `io.BytesIO()` streams for image manipulation (PIL), PDF operations (PyMuPDF `fitz`), and archive packaging (`zipfile`).
   - Discard all binary data from memory immediately upon streaming the `Response` or `StreamingResponse`.

2. **Resource & Threading Constraints:**
   - On low-resource container deployments (e.g. Cloud Run, Railway), ONNX Runtime multi-threading can cause CPU deadlocks or OOM crashes.
   - Keep `os.environ["OMP_NUM_THREADS"] = "1"` and `os.environ["OMP_WAIT_POLICY"] = "PASSIVE"`.
   - Maintain at most one active `rembg` model session in memory at a time; explicitly run garbage collection (`gc.collect()`) when switching sessions.

3. **CORS & Security:**
   - Allow requests from `https://www.theutilify.com`, `https://theutilify.com`, and `http://localhost:3000`.
   - Limit file upload sizes where applicable (e.g. 10MB–25MB max) and return standard HTTP 400/413/422 status codes on errors.

---

## 2. Key Microservice Endpoints

| Endpoint | Method | Engine | Description |
| :--- | :--- | :--- | :--- |
| `/api/remove-bg` | `POST` | `rembg[cpu]` (ISNet/U2Net) | Removes image backgrounds and returns transparent PNG |
| `/api/pdf-to-image` | `POST` | PyMuPDF (`fitz`) | Converts PDF pages to 2x resolution PNGs inside a `.zip` |
| `/api/split-pdf` | `POST` | PyMuPDF (`fitz`) | Extracts selected page ranges into a separate PDF |
| `/api/merge-pdf` | `POST` | PyMuPDF (`fitz`) | Combines multiple PDF files sequentially into a single PDF |
| `/api/markdown-to-pdf` | `POST` | Playwright Chromium | Renders styled HTML/Markdown to pixel-perfect A4 PDF |

---

## 3. Local Development & Testing

- **Run Backend Locally:**
  ```powershell
  cd backend
  python -m venv venv
  .\venv\Scripts\activate
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
  ```
- **Docker Build & Verification:**
  ```bash
  docker build -t utilify-backend ./backend
  docker run -p 8000:8000 utilify-backend
  ```
