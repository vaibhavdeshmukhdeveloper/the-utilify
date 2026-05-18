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

    if (extension === 'png') {
      compressedBuffer = await sharp(buffer)
        .png({ quality, compressionLevel: 9 })
        .toBuffer();
    } else {
      // Default to jpeg/webp/etc.
      compressedBuffer = await sharp(buffer)
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
    }

    return new NextResponse(compressedBuffer as any, {
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": `attachment; filename="compressed_${file.name}"`,
      },
    });
  } catch (error: any) {
    console.error("Compression error:", error);
    return NextResponse.json({ error: "Failed to compress image" }, { status: 500 });
  }
}
