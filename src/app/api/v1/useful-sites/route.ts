import { NextResponse } from "next/server";
import { readDb, writeDb, addAuditLog, addNotification } from "@/lib/db";
import { UsefulSite } from "@/types/database";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ data: db.useful_sites || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, url } = body;

    if (!title || !description || !url) {
      return NextResponse.json({ error: "Title, description and url are required" }, { status: 400 });
    }

    const db = readDb();
    
    const newSite: UsefulSite = {
      id: `site_${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      created_at: new Date().toISOString()
    };

    if (!db.useful_sites) {
      db.useful_sites = [];
    }

    db.useful_sites.unshift(newSite); // Add to the top
    writeDb(db);

    // Audit Log Ekle
    addAuditLog(
      "Admin", 
      "Yeni Faydalı Site Eklendi", 
      "UsefulSite", 
      newSite.id
    );

    // Otomatik Bildirim Gönder
    addNotification(
      "Yeni Bir Site Keşfedildi",
      `"Faydalı Siteler" sayfasına yeni bir harici kaynak eklendi: ${newSite.title}`,
      "success",
      `/useful-sites`
    );

    return NextResponse.json({ data: newSite }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
