import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const type = formData.get("type") as string;
    const folder = type === "image" ? "images" : "documents";

    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${safeName}`;
    const fileSizeMb = parseFloat((file.size / (1024 * 1024)).toFixed(2));

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
