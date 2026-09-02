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
| `/image/remove-bg` | `POST` | `rembg[cpu]` ONNX | Removes image background via deep learning neural networks (`isnet-general-use`, `silueta`, `u2net`, `u2net_human_seg`, `u2net_cloth_seg`) |
| `/pdf/to-image` | `POST` | PyMuPDF (`fitz`) + `zipfile` | Converts PDF pages into 150 DPI (2x) PNGs packed into a `.zip` archive |
| `/pdf/split` | `POST` | PyMuPDF (`fitz`) | Extracts selected page ranges (e.g. `1-3, 5, 8-10`) into a new PDF |
| `/pdf/merge` | `POST` | PyMuPDF (`fitz`) | Combines multiple PDF files sequentially into a single PDF |
| `/pdf/html-to-pdf` | `POST` | Playwright Chromium | Renders styled HTML/Markdown to pixel-perfect A4 PDF with 1cm print margins |
| `/api/ratings` | `GET` | Firestore / Cache | Fetches authentic community rating statistics (`ratingValue`, `reviewCount`) for a tool or all tools |
| `/api/rate` | `POST` | Firestore / Cache | Records genuine user rating (1-5 stars) using atomic increments (`firestore.Increment`) |

---

## 3. Background Removal Pipeline

1. **AI Neural Network Engine (`rembg` with ONNX Runtime):**
   - Directly executes state-of-the-art salient object and foreground segmentation models.
   - Default model: `isnet-general-use` (IS-Net), delivering superior sub-pixel boundary detection for complex contours, fine text, transparent gaps/holes, hair strands, and product edges.
   - Pre-loads default model asynchronously at startup during FastAPI lifespan to eliminate cold-start latency.
   - Optional models supported: `silueta` (ultra-fast mobile), `u2net` (general balanced), `u2net_human_seg` (people/portraits), and `u2net_cloth_seg` (clothing & apparel).
   - In-memory single-session management with explicit garbage collection (`gc.collect()`) prevents container OOM on Google Cloud Run.

---

## 4. Community Ratings Persistence (Google Cloud Firestore)

1. **Storage Layer:**
   - Ratings are stored in Google Cloud Firestore (Native Mode, Always-Free Tier) in the `ratings` collection with document ID = `tool_slug`.
   - On Google Cloud Run, `firestore.Client()` authenticates seamlessly via Google Application Default Credentials (ADC) without requiring explicit API keys.
   - In local development or when Firestore is unreachable, falls back to in-memory / local JSON caching (`_resolve_ratings_file()`).
2. **Concurrency Safety:**
   - `submit_rating` uses atomic increments (`firestore.Increment(rating)` and `firestore.Increment(1)`) with `merge=True` to prevent race conditions during high concurrent traffic.
3. **Data Integrity Policy:**
   - Only 100% genuine user votes are stored. Fabricated or pre-seeded baseline reviews are strictly prohibited.

---

## 5. Unicode Filename Encoding (RFC 5987 / RFC 6266)

- Starlette and Uvicorn enforce `latin-1` byte encoding for HTTP response headers per RFC 7230.
- When users upload images or PDFs with non-ASCII characters (e.g., en-dashes `\u2013`, em-dashes, accents, or Asian characters), placing raw strings in `Content-Disposition` throws `UnicodeEncodeError`.
- All file download endpoints must format headers through `format_content_disposition(filename: str)`:
  - Sanitizes a safe ASCII fallback: `filename="download.png"`
  - Encodes the true UTF-8 filename: `filename*=UTF-8''...`
- Frontend `@/lib/api.ts` parses `filename*` parameters to restore genuine filenames on the client side.

---

## 6. Cloud Run Deployment & Cost Optimization

1. **Dynamic Port Binding (`PORT`):**
   - Cloud Run injects the `PORT` environment variable at runtime.
   - The container CMD in `Dockerfile` must use dynamic shell expansion:
     ```dockerfile
     CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
     ```
2. **Artifact Registry Cost Control:**
   - Cloud Run source deployments build ~3 GB Docker images on each push to `main`.
   - To keep Google Cloud costs at $0, configure a 2-rule automated Cleanup Policy in Google Cloud Console Artifact Registry (`cloud-run-source-deploy`):
     - **Rule 1 (Keep Recent):** Keep most recent versions (Keep count: 2).
     - **Rule 2 (Delete Stale):** Conditional delete (Any tag state, older than 7 days).

---

## 7. Local Development & Testing

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

