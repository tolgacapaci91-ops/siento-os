import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { Lesson } from "@/types/database";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const course = db.courses.find((c) => c.id === id || c.slug === id);
    const courseId = course ? course.id : id;

    const lessons = db.lessons
      .filter((l) => l.course_id === courseId)
      .sort((a, b) => a.order_index - b.order_index);

    return NextResponse.json({ data: lessons });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, youtube_url, duration_seconds } = body;

    const db = readDb();
    const course = db.courses.find((c) => c.id === id || c.slug === id);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const existingLessons = db.lessons.filter((l) => l.course_id === course.id);
    const newOrderIndex = existingLessons.length + 1;

    let vid = youtube_url || "";
    if (vid.includes("v=")) {
      vid = vid.split("v=")[1]?.split("&")[0] || vid;
    } else if (vid.includes("youtu.be/")) {
      vid = vid.split("youtu.be/")[1]?.split("?")[0] || vid;
    }

    const newLesson: Lesson = {
      id: `lsn_${Date.now()}`,
      course_id: course.id,
      title: title || `Ders ${newOrderIndex}`,
      description: description || "",
      video_provider: "youtube",
      video_id: vid,
      youtube_url: youtube_url || "",
      duration_seconds: duration_seconds || 600,
      order_index: newOrderIndex,
      is_locked: false,
    };

    db.lessons.push(newLesson);

    // Update course metadata
    course.lessons_count = existingLessons.length + 1;
    course.duration_minutes = Math.round(
      [...existingLessons, newLesson].reduce((acc, l) => acc + l.duration_seconds, 0) / 60
    );

    writeDb(db);
    return NextResponse.json({ data: newLesson }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
