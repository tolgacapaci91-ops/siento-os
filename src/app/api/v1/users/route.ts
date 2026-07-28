import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { User } from "@/types/database";

export async function GET() {
  try {
    const db = readDb();
    return NextResponse.json({ data: db.users || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, password, status = "active" } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const db = readDb();

    // Check duplicate email
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var" }, { status: 400 });
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      uuid: `uuid_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar_url: "/avatars/default.jpg",
      role: role || "student",
      status: status || "active",
      password: password || "123456",
      xp: 0,
      level: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.users.unshift(newUser);
    writeDb(db);

    return NextResponse.json({ data: newUser }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
