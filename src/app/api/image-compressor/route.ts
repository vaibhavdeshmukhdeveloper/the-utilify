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
    const quality = parseInt(formData.get("quality") as string) || 80;

    let compressedBuffer: Buffer;
    const extension = file.name.split('.').pop()?.toLowerCase();
    const contentType = file.type || "";
    let outputType = contentType;

    if (extension === 'png' || contentType === 'image/png') {
      compressedBuffer = await sharp(buffer)
        .png({ quality, compressionLevel: 9 })
        .toBuffer();
      outputType = "image/png";
    } else if (extension === 'webp' || contentType === 'image/webp') {
      compressedBuffer = await sharp(buffer)
        .webp({ quality })
        .toBuffer();
      outputType = "image/webp";
    } else {
      // Default to jpeg/jpg/etc.
      compressedBuffer = await sharp(buffer)
        .jpeg({ quality })
        .toBuffer();
      outputType = "image/jpeg";
    }

    return new NextResponse(compressedBuffer as any, {
      headers: {
        "Content-Type": outputType,
        "Content-Disposition": `attachment; filename="compressed_${file.name}"`,
      },
    });
  } catch (error: any) {
    console.error("Compression error:", error);
    return NextResponse.json({ error: "Failed to compress image" }, { status: 500 });
  }
}

