import { NextResponse } from "next/server";
import { readDb, writeDb, addNotification } from "@/lib/db";
import { Document } from "@/types/database";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ data: db.documents });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, file_url, file_size_mb, page_count } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = readDb();

    // Auto register category if not present
    if (category) {
      const catName = category.trim();
      const existingCat = db.categories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      );
      if (!existingCat) {
        db.categories.push({
          id: `cat_${Date.now()}`,
          name: catName,
          slug: catName.toLowerCase().replace(/\s+/g, "-"),
        });
      }
    }

    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      title: title.trim(),
      description: description || `${category || "Genel"} dokümanı.`,
      file_url: file_url || "/docs/sample.pdf",
      file_size_mb: file_size_mb || 3.5,
      page_count: page_count || 12,
      category: category || "Genel",
      is_downloadable: true,
      download_count: 0,
      created_at: new Date().toISOString(),
    };

    db.documents.unshift(newDoc);
    writeDb(db);

    // Otomatik Bildirim Gönder
    addNotification(
      "Yeni Doküman Eklendi",
      `Kütüphaneye yeni bir PDF dokümanı eklendi: ${newDoc.title}`,
      "info",
      `/documents`
    );

    return NextResponse.json({ data: newDoc }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
