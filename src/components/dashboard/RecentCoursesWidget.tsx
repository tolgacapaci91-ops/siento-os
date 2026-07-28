"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Star, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useCourses } from "@/hooks/useCourses";

export function RecentCoursesWidget() {
  const { courses } = useCourses();

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Son Eklenen Eğitimler
          </h4>
        </div>
        <Link
          href="/courses"
          className="text-xs text-indigo-500 hover:text-indigo-400 font-medium flex items-center gap-1"
        >
          <span>Tümünü Gör</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/60">
          Henüz yayınlanmış bir eğitim bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.slice(0, 2).map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <div className="group relative rounded-xl overflow-hidden border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-3 hover:border-indigo-500/40 transition-all">
                <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3 bg-slate-800 flex items-center justify-center">
                  {course.cover_image ? (
                    <Image
                      src={course.cover_image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-slate-600" />
                  )}
                  <Badge variant="primary" className="absolute top-2 left-2">
                    {course.category}
                  </Badge>
                </div>

                <h5 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {course.title}
                </h5>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration_minutes || 45} dk
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-current" /> {course.rating || 5.0}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
