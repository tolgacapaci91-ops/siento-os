import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();
    
    const index = db.workshops.findIndex(w => w.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
    }
    
    db.workshops[index] = { ...db.workshops[index], ...body };
    writeDb(db);
    
    return NextResponse.json({ data: db.workshops[index] });
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
    db.workshops = db.workshops.filter((w) => w.id !== id);
    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
