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

    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const oldName = db.users[idx].name;
    const oldAvatar = db.users[idx].avatar_url;

    db.users[idx] = {
      ...db.users[idx],
      ...body,
      updated_at: new Date().toISOString(),
    };

    if (body.name || body.avatar_url) {
      db.courses = db.courses.map((course) => {
        if (course.instructor && course.instructor.name === oldName) {
          course.instructor.name = body.name || oldName;
          course.instructor.avatar = body.avatar_url || course.instructor.avatar;
        }
        return course;
      });
    }

    writeDb(db);
    return NextResponse.json({ data: db.users[idx] });
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

    db.users = db.users.filter((u) => u.id !== id);
    writeDb(db);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
