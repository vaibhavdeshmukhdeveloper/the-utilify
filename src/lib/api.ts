let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Guarantee the URL starts with http:// or https:// (prevents relative path resolution)
if (!rawApiUrl.startsWith("http://") && !rawApiUrl.startsWith("https://")) {
  rawApiUrl = `https://${rawApiUrl}`;
}

const API_BASE_URL = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;

export async function uploadToBackend(endpoint: string, files: File[], extraData?: Record<string, string>) {
  const formData = new FormData();
  
  if (files.length === 1) {
    formData.append("file", files[0]);
  } else {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  if (extraData) {
    Object.entries(extraData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(errorData.detail || "Upload failed");
  }

  // Handle file response (blob)
  const blob = await response.blob();
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = "processed_file";
  
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) filename = match[1];
  }

  const url = window.URL.createObjectURL(blob);
  return { url, filename };
}
