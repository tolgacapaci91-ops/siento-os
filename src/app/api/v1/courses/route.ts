import { NextResponse } from "next/server";
import { readDb, writeDb, addNotification } from "@/lib/db";
import { Course } from "@/types/database";

export async function GET() {
  const db = readDb();
  return NextResponse.json({ data: db.courses });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, category, cover_image, level, youtubeUrl } = body;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const db = readDb();

    // Auto-register category if not present
    if (category) {
      const catName = category.trim();
      const existingCat = db.categories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      );
      if (!existingCat) {
        db.categories.push({
          id: `cat_${Date.now()}`,
          name: catName,
          slug: catName.toLowerCase().replace(/\s+/g, "-"),
        });
      }
    }

    const newCourse: Course = {
      id: `course_${Date.now()}`,
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description || "SientoOps Eğitim İçeriği.",
      cover_image: cover_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
      category: category || "Genel",
      level: level || "Orta Seviye",
      duration_minutes: 45,
      lessons_count: 0,
      rating: 5.0,
      version_tag: "v1.0",
      is_published: true,
      is_featured: false,
      instructor: {
        name: "Tolga Çapacı",
        avatar: "/avatars/tolga.jpg",
        title: "Founder | Educator",
      },
      created_at: new Date().toISOString(),
    };

    db.courses.unshift(newCourse);

    // If initial YouTube URL provided, automatically create Lesson 1
    if (youtubeUrl && typeof youtubeUrl === "string" && youtubeUrl.trim().length > 0) {
      let vid = youtubeUrl.trim();
      if (vid.includes("v=")) {
        vid = vid.split("v=")[1]?.split("&")[0] || vid;
      } else if (vid.includes("youtu.be/")) {
        vid = vid.split("youtu.be/")[1]?.split("?")[0] || vid;
      }

      db.lessons.push({
        id: `lsn_${Date.now()}`,
        course_id: newCourse.id,
        title: title.trim(),
        description: `${title} - Tanıtım ve Kurulum Dersi`,
        video_provider: "youtube",
        video_id: vid,
        youtube_url: youtubeUrl.trim(),
        duration_seconds: 900,
        order_index: 1,
        is_locked: false,
      });

      newCourse.lessons_count = 1;
      newCourse.duration_minutes = 15;
    }

    writeDb(db);

    // Otomatik Bildirim Gönder
    addNotification(
      "Yeni Eğitim Yayınlandı",
      `Platforma yeni bir eğitim eklendi: ${newCourse.title}`,
      "success",
      `/courses`
    );

    return NextResponse.json({ data: newCourse }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
