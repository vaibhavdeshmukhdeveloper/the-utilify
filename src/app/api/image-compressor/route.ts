import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawQuality = parseInt(formData.get("quality") as string, 10);
    const quality = Math.min(100, Math.max(1, isNaN(rawQuality) ? 80 : rawQuality));
    const requestedFormat = ((formData.get("format") as string) || "").toLowerCase();

    let compressedBuffer: Buffer;
    const extension = file.name.split('.').pop()?.toLowerCase();
    const contentType = file.type || "";
    let outputType = contentType;

    if (requestedFormat === "png" || (!requestedFormat && (extension === 'png' || contentType === 'image/png'))) {
      compressedBuffer = await sharp(buffer)
        .png({ quality, compressionLevel: 9, palette: quality < 100 })
        .toBuffer();
      outputType = "image/png";
    } else if (requestedFormat === "webp" || (!requestedFormat && (extension === 'webp' || contentType === 'image/webp'))) {
      compressedBuffer = await sharp(buffer)
        .webp({ quality })
        .toBuffer();
      outputType = "image/webp";
    } else {
      // Default to jpeg/jpg/etc.
      compressedBuffer = await sharp(buffer)
        .flatten({ background: "#ffffff" })
        .jpeg({ quality })
        .toBuffer();
      outputType = "image/jpeg";
    }

    const cleanName = (file.name || "image").replace(/[\r\n\t]/g, "");
    const fullFilename = `compressed_${cleanName}`;
    const asciiFilename = fullFilename.replace(/[^\x20-\x7E]/g, "_").replace(/"/g, "") || "compressed_image";
    const encodedFilename = encodeURIComponent(fullFilename);

    return new NextResponse(compressedBuffer as any, {
      headers: {
        "Content-Type": outputType,
        "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error: any) {
    console.error("Compression error:", error);
    return NextResponse.json({ error: "Failed to compress image" }, { status: 500 });
  }
}

