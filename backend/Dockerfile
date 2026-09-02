FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PyMuPDF, OpenCV, pycairo, and ONNX Runtime (libgomp1)
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    pkg-config \
    python3-dev \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the rembg model so it's baked into the image, preventing runtime download timeouts
ENV U2NET_HOME=/app/.u2net
RUN python -c "from rembg import new_session; [new_session(m) for m in ['isnet-general-use', 'silueta', 'u2net', 'u2net_human_seg', 'u2net_cloth_seg']]"
RUN chmod -R 777 /app/.u2net

# Install Playwright Chromium and all required OS system dependencies
RUN playwright install --with-deps chromium

COPY . .

# Create temp directory
RUN mkdir -p temp_processing

EXPOSE 8000

CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
