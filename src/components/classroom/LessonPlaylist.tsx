"use client";

import React from "react";
import { CheckCircle2, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface LessonPlaylistProps {
  playlist: LessonItem[];
  activeLessonId: string;
  onSelectLesson: (id: string) => void;
  completedCount: number;
  totalCount: number;
}

export const LessonPlaylist = React.memo(function LessonPlaylist({
  playlist,
  activeLessonId,
  onSelectLesson,
  completedCount,
  totalCount,
}: LessonPlaylistProps) {
  return (
    <Card className="lg:col-span-1 p-4 flex flex-col justify-between max-h-[600px] overflow-hidden">
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 pb-3 border-b border-slate-200/60 dark:border-slate-800">
          Ders Müfredatı ({completedCount}/{totalCount} Tamamlandı)
        </h3>

        <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1">
          {playlist.map((lesson) => {
            const isActive = lesson.id === activeLessonId;
            return (
              <button
                key={lesson.id}
                disabled={lesson.isLocked}
                onClick={() => onSelectLesson(lesson.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25"
                    : lesson.isLocked
                    ? "bg-slate-100/40 dark:bg-slate-900/20 border-slate-200/40 dark:border-slate-800/40 opacity-50 cursor-not-allowed text-slate-400"
                    : "bg-slate-100/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {lesson.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : lesson.isLocked ? (
                    <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <Play className="w-4 h-4 text-indigo-400 flex-shrink-0 fill-current" />
                  )}
                  <span className="truncate font-medium">{lesson.title}</span>
                </div>
                <span className="text-[10px] opacity-70 ml-2">{lesson.duration}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
});
