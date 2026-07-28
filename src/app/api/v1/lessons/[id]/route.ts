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

    let updatedLesson = null;
    db.lessons = db.lessons.map((l) => {
      if (l.id === id) {
        updatedLesson = { ...l, ...body };
        return updatedLesson;
      }
      return l;
    });

    if (!updatedLesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    writeDb(db);
    return NextResponse.json({ data: updatedLesson });
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
    const target = db.lessons.find((l) => l.id === id);
    if (target) {
      db.lessons = db.lessons.filter((l) => l.id !== id);
      const remaining = db.lessons.filter((l) => l.course_id === target.course_id);
      const course = db.courses.find((c) => c.id === target.course_id);
      if (course) {
        course.lessons_count = remaining.length;
        course.duration_minutes = Math.round(
          remaining.reduce((acc, l) => acc + l.duration_seconds, 0) / 60
        );
      }
      writeDb(db);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
