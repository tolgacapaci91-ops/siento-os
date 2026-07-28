"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Lock, Play, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { courseRepository } from "@/repositories";
import { Course, Lesson } from "@/types/database";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const resolvedParams = use(params);
  const [course, setCourse] = useState<(Course & { lessons?: Lesson[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    courseRepository.getById(resolvedParams.courseId).then((data) => {
      setCourse(data);
      setIsLoading(false);
    });
  }, [resolvedParams.courseId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">Eğitim bilgileri yükleniyor...</div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-300">Eğitim bulunamadı.</h3>
        <Link href="/courses">
          <Button variant="outline">Eğitimlere Dön</Button>
        </Link>
      </div>
    );
  }

  const lessons = course.lessons || [];

  return (
    <div className="space-y-6">
      <Link href="/courses" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400">
        <ArrowLeft className="w-4 h-4" /> Tüm Eğitimlere Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center">
            {course.cover_image ? (
              <Image src={course.cover_image} alt={course.title} fill className="object-cover" />
            ) : (
              <BookOpen className="w-16 h-16 text-slate-600" />
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="primary">{course.category}</Badge>
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                {course.level}
              </Badge>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{course.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{course.description}</p>
          </div>

          {/* Lessons Syllabus Playlist */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200">Eğitim Müfredatı ({lessons.length} Ders)</h3>

            {lessons.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                Bu eğitime henüz ders eklenmedi.
              </div>
            ) : (
              <div className="space-y-2">
                {lessons.map((lsn, idx) => {
                  const isLocked = lsn.is_locked === true;
                  return (
                    <Card
                      key={lsn.id}
                      className={`p-4 flex items-center justify-between ${isLocked ? "opacity-60 bg-slate-900/30" : "hover:border-indigo-500/50"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${isLocked ? "bg-slate-800 text-slate-500" : "bg-indigo-500/10 text-indigo-400"
                            }`}
                        >
                          {isLocked ? <Lock className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                            Ders {lsn.order_index || idx + 1}: {lsn.title}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {Math.round((lsn.duration_seconds || 600) / 60)} dakika
                          </span>
                        </div>
                      </div>

                      {isLocked ? (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Önceki Dersi Tamamlayın
                        </span>
                      ) : (
                        <Link href={`/courses/${course.id}/lesson/${lsn.id}`}>
                          <Button variant="primary" size="sm" leftIcon={<Play className="w-3.5 h-3.5" />}>
                            İzle
                          </Button>
                        </Link>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">Eğitmen Bilgisi</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">
                TA
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-200">{course.instructor?.name || "Tolga Çapacı"}</h5>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{course.instructor?.title || "Lead Instructor"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
