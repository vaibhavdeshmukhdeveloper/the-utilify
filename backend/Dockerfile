FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PyMuPDF, OpenCV, and pycairo compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    pkg-config \
    python3-dev \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create temp directory
RUN mkdir -p temp_processing

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
