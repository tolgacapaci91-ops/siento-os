"use client";

import React from "react";
import Link from "next/link";
import { Play, Clock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useCourses } from "@/hooks/useCourses";

export function CourseProgressWidget() {
  const { courses } = useCourses();
  const currentCourse = courses[0];

  if (!currentCourse) {
    return (
      <Card className="relative overflow-hidden bg-slate-900/40 border-slate-800 p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <BookOpen className="w-8 h-8 text-slate-600" />
          <h4 className="text-sm font-bold text-slate-300">Henüz aktif bir eğitiminiz bulunmuyor.</h4>
          <p className="text-xs text-slate-500">Admin panelinden eklenecek eğitimlere buradan devam edebilirsiniz.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-900/40 dark:to-slate-900/60 border-indigo-500/20 dark:border-indigo-500/30">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
              Devam Eden Eğitim
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 1. Ders / {currentCourse.lessons_count || 1}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {currentCourse.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {currentCourse.description}
          </p>

          <div className="pt-2 max-w-md">
            <Progress value={20} showPercentage />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full md:w-auto">
          <Link href={`/courses/${currentCourse.id}`}>
            <Button variant="primary" leftIcon={<Play className="w-4 h-4 fill-current" />}>
              Derse Devam Et
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
