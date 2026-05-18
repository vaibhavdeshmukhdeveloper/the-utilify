import { NextRequest, NextResponse } from "next/server";
import { marked } from "marked";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const markdown = formData.get("markdown") as string;
    const file = formData.get("file") as File;
    const theme = (formData.get("theme") as string || "default").toLowerCase();

    let content = markdown;
    if (file) {
      content = await file.text();
    }

    if (!content) {
      return NextResponse.json({ error: "No markdown content provided" }, { status: 400 });
    }

    const htmlContent = await marked(content);
    
    // Choose custom stylesheet matching chosen theme
    let stylesheet = "";
    let pageBackground = "#ffffff";

    if (theme === "academic") {
      stylesheet = `
        body { font-family: "Times New Roman", Times, Georgia, serif; line-height: 1.8; padding: 50px; color: #000; }
        p { text-align: justify; text-indent: 0.5in; margin-bottom: 1.2em; }
        h1, h2, h3, h4 { font-family: "Times New Roman", Times, Georgia, serif; color: #000; font-weight: bold; text-align: center; margin-top: 1.8em; }
        h1 { font-size: 1.8em; margin-bottom: 1.2em; text-transform: uppercase; }
        h2 { font-size: 1.4em; text-align: left; border-bottom: 1px solid #000; padding-bottom: 0.2em; }
        h3 { font-size: 1.2em; text-align: left; font-style: italic; }
        blockquote { margin: 1.5em 2em; border-left: none; font-style: italic; text-align: justify; }
        code { background: #f4f4f4; padding: 2px 4px; font-family: monospace; }
        pre { background: #f4f4f4; padding: 15px; border: 1px solid #ccc; font-family: monospace; margin: 1.5em 0; overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; border-top: 2px solid #000; border-bottom: 2px solid #000; margin: 2em 0; }
        th, td { padding: 10px; border: none; text-align: left; font-family: "Times New Roman", Times, serif; }
        th { border-bottom: 1px solid #000; font-weight: bold; }
      `;
    } else if (theme === "developer") {
      pageBackground = "#09090b";
      stylesheet = `
        body { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1.6; padding: 40px; color: #a1a1aa; background-color: #09090b; }
        h1, h2, h3, h4 { color: #f4f4f5; font-weight: bold; margin-top: 1.8em; }
        h1 { font-size: 1.8em; border-bottom: 1px solid #27272a; padding-bottom: 0.5em; }
        h2 { font-size: 1.4em; border-bottom: 1px solid #27272a; padding-bottom: 0.5em; }
        h3 { font-size: 1.2em; }
        a { color: #10b981; text-decoration: none; }
        code { background: #18181b; padding: 2px 4px; border-radius: 4px; color: #10b981; }
        pre { background: #18181b; padding: 16px; border-radius: 8px; border: 1px solid #27272a; font-family: monospace; overflow-x: auto; }
        blockquote { border-left: 3px solid #10b981; padding-left: 16px; color: #71717a; font-style: italic; }
        table { width: 100%; border: 1px solid #27272a; border-collapse: collapse; margin: 2em 0; }
        th, td { border: 1px solid #27272a; padding: 10px 12px; text-align: left; }
        th { background-color: #18181b; color: #f4f4f5; }
      `;
    } else if (theme === "editorial") {
      stylesheet = `
        body { font-family: Georgia, Garamond, serif; line-height: 1.6; padding: 45px; color: #2c2520; }
        h1, h2, h3, h4 { font-family: Garamond, Georgia, serif; color: #1a0f08; font-weight: normal; margin-top: 1.6em; }
        h1 { font-size: 2.4em; border-bottom: 1px dashed #d2c4b9; padding-bottom: 0.4em; margin-bottom: 1em; text-align: center; }
        h2 { font-size: 1.8em; border-bottom: 1px solid #f0e9e4; padding-bottom: 0.2em; }
        h3 { font-size: 1.4em; font-style: italic; }
        a { color: #8c6239; text-decoration: underline; }
        code { background: #faf8f5; padding: 2px 4px; border-radius: 4px; color: #8c6239; font-family: monospace; }
        pre { background: #faf8f5; padding: 15px; border-radius: 6px; border: 1px solid #e3dac9; overflow-x: auto; }
        blockquote { border-left: 3px solid #8c6239; padding-left: 20px; color: #6a5749; font-style: italic; }
        table { width: 100%; border-collapse: collapse; margin: 2em 0; }
        th, td { border-bottom: 1px solid #e3dac9; padding: 12px 10px; text-align: left; }
        th { background-color: #faf8f5; color: #8c6239; font-variant: small-caps; font-weight: bold; }
      `;
    } else {
      // Modern Clean (default)
      stylesheet = `
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; padding: 40px; color: #1f2937; }
        h1, h2, h3, h4 { color: #111827; font-weight: 800; margin-top: 1.6em; margin-bottom: 0.6em; }
        h1 { font-size: 2.25em; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.3em; }
        h2 { font-size: 1.75em; border-bottom: 1px solid #f3f4f6; padding-bottom: 0.3em; }
        h3 { font-size: 1.35em; }
        a { color: #3b82f6; text-decoration: none; }
        code { background: #f3f4f6; padding: 3px 6px; border-radius: 6px; font-family: ui-monospace, monospace; font-size: 0.9em; }
        pre { background: #f3f4f6; padding: 16px; border-radius: 12px; overflow-x: auto; margin: 1.5em 0; }
        blockquote { border-left: 4px solid #3b82f6; padding-left: 16px; color: #4b5563; font-style: italic; margin: 1.5em 0; }
        table { border-collapse: collapse; width: 100%; margin: 2em 0; }
        th, td { border: 1px solid #e5e7eb; padding: 12px 16px; text-align: left; }
        th { background-color: #f9fafb; font-weight: bold; }
      `;
    }

    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${stylesheet}
            body { background-color: ${pageBackground}; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(styledHtml, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "1cm", right: "1cm", bottom: "1cm", left: "1cm" },
    });

    await browser.close();

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="document.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Markdown to PDF error:", error);
    return NextResponse.json({ error: "Failed to convert Markdown to PDF" }, { status: 500 });
  }
}
