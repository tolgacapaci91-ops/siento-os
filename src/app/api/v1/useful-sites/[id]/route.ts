import { NextResponse } from "next/server";
import { readDb, writeDb, addAuditLog } from "@/lib/db";

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    const body = await req.json();
    const { title, description, url } = body;

    const db = readDb();
    if (!db.useful_sites) db.useful_sites = [];

    const index = db.useful_sites.findIndex(s => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const updatedSite = {
      ...db.useful_sites[index],
      title: title !== undefined ? title.trim() : db.useful_sites[index].title,
      description: description !== undefined ? description.trim() : db.useful_sites[index].description,
      url: url !== undefined ? url.trim() : db.useful_sites[index].url,
    };

    db.useful_sites[index] = updatedSite;
    writeDb(db);

    addAuditLog(
      "Admin", 
      "Faydalı Site Güncellendi", 
      "UsefulSite", 
      id
    );

    return NextResponse.json({ data: updatedSite });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    const db = readDb();
    
    if (!db.useful_sites) db.useful_sites = [];

    const index = db.useful_sites.findIndex(s => s.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    db.useful_sites.splice(index, 1);
    writeDb(db);

    addAuditLog(
      "Admin", 
      "Faydalı Site Silindi", 
      "UsefulSite", 
      id
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
