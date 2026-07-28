import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const course = db.courses.find((c) => c.id === id || c.slug === id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    const lessons = db.lessons
      .filter((l) => l.course_id === course.id)
      .sort((a, b) => a.order_index - b.order_index);

    return NextResponse.json({ data: { ...course, lessons } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();

    let updatedCourse = null;
    db.courses = db.courses.map((c) => {
      if (c.id === id || c.slug === id) {
        updatedCourse = { ...c, ...body };
        return updatedCourse;
      }
      return c;
    });

    if (!updatedCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    writeDb(db);
    return NextResponse.json({ data: updatedCourse });
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
    const target = db.courses.find((c) => c.id === id || c.slug === id);
    if (target) {
      db.courses = db.courses.filter((c) => c.id !== target.id);
      db.lessons = db.lessons.filter((l) => l.course_id !== target.id);
      writeDb(db);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
