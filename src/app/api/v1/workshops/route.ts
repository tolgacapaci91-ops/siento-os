import { NextResponse } from "next/server";
import { readDb, writeDb, addNotification } from "@/lib/db";
import { Workshop } from "@/types/database";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ data: db.workshops });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, repo_url, cover_image, difficulty, estimated_hours, code_content, code_language, file_attachments } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = readDb();

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

    const newWorkshop: Workshop = {
      id: `wks_${Date.now()}`,
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description || "Pratik lab senaryosu.",
      category: category || "System Design",
      cover_image: cover_image || "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
      repo_url: repo_url || "https://github.com/sientoops",
      difficulty: difficulty || "Orta",
      estimated_hours: estimated_hours || 4,
      code_content: code_content || "",
      code_language: code_language || "typescript",
      file_attachments: file_attachments || [],
      tags: ["lab"],
      created_at: new Date().toISOString(),
    };

    db.workshops.unshift(newWorkshop);
    writeDb(db);

    // Otomatik Bildirim Gönder
    addNotification(
      "Yeni Laboratuvar Eklendi",
      `Platforma yeni bir Workshop/Laboratuvar ortamı eklendi: ${newWorkshop.title}`,
      "success",
      `/workshops`
    );

    return NextResponse.json({ data: newWorkshop }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
