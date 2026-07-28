import { NextResponse } from "next/server";

let fs: any = null;
let path: any = null;

try {
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    fs = eval('require("fs")');
    path = eval('require("path")');
  }
} catch (e) {
  // Not in Node.js environment
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const type = formData.get("type") as string;
    const folder = type === "image" ? "images" : "documents";
    
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));
    
    const publicUrl = `/uploads/${folder}/${safeName}`;

    if (!fs) {
      // In Edge/Cloudflare Workers environment, mock the upload since we don't have disk access
      // In a real app, this should upload to Cloudflare R2, AWS S3, etc.
      return NextResponse.json({
        data: {
          file_url: publicUrl,
          file_name: safeName,
          file_size_mb: fileSizeMb || 0.1,
          simulated: true, // indicate it's a mocked upload
        },
      });
    }

    // Node.js environment - write to disk
    const bytes = await file.arrayBuffer();
    // Use globalThis.Buffer instead of implicit Buffer to be safe in Edge configs
    const buffer = typeof Buffer !== "undefined" ? Buffer.from(bytes) : new Uint8Array(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      data: {
        file_url: publicUrl,
        file_name: safeName,
        file_size_mb: fileSizeMb || 0.1,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
