import { NextResponse } from "next/server";
import { readDb, writeDb, addNotification } from "@/lib/db";
import { CategoryItem } from "@/types/database";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ data: db.categories });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const db = readDb();
    const existing = db.categories.find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (existing) {
      return NextResponse.json({ data: existing });
    }

    const newCat: CategoryItem = {
      id: `cat_${Date.now()}`,
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
    };

    db.categories.push(newCat);
    writeDb(db);

    // Otomatik Bildirim Gönder
    addNotification(
      "Yeni Kategori Eklendi",
      `Platforma yeni bir kategori eklendi: ${newCat.name}`,
      "info",
      `/courses` // Yönlendirme için örnek
    );

    return NextResponse.json({ data: newCat }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
