import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET(req: Request, props: { params: Promise<{ courseId: string }> }) {
  try {
    const params = await props.params;
    const courseId = params.courseId;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_demo";

    const db = readDb();
    
    // Find all completed lessons for this user in this course
    const completedLessons = (db.lesson_progress || [])
      .filter((lp) => lp.course_id === courseId && lp.user_id === userId && lp.is_completed)
      .map((lp) => lp.lesson_id);

    return NextResponse.json({ 
      data: {
        completedLessons
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
