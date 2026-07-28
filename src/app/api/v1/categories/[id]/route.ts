import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = readDb();
    let updatedCat = null;

    db.categories = db.categories.map((c) => {
      if (c.id === id) {
        const oldName = c.name;
        const newName = name.trim();
        const newSlug = newName.toLowerCase().replace(/\s+/g, "-");
        updatedCat = { ...c, name: newName, slug: newSlug };

        // Cascade category name update to courses, documents, workshops!
        db.courses = db.courses.map((crs) =>
          crs.category === oldName ? { ...crs, category: newName } : crs
        );
        db.documents = db.documents.map((doc) =>
          doc.category === oldName ? { ...doc, category: newName } : doc
        );
        db.workshops = db.workshops.map((wks) =>
          wks.category === oldName ? { ...wks, category: newName } : wks
        );

        return updatedCat;
      }
      return c;
    });

    if (!updatedCat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    writeDb(db);
    return NextResponse.json({ data: updatedCat });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    db.categories = db.categories.filter((c) => c.id !== id);
    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
