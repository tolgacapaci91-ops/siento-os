"use client";

import React from "react";
import { CheckCircle2, Circle, Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { User } from "@/types/database";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";

import { useRouter } from "next/navigation";

interface ProfileCompletionWidgetProps {
  user: User | null;
}

export function ProfileCompletionWidget({ user }: ProfileCompletionWidgetProps) {
  const { stats } = useAchievementEngine(user?.id);
  const router = useRouter();

  const tasks = [
    {
      id: "avatar",
      title: "Profil Resmi Ekle",
      isCompleted: !!user?.avatar_url && !user.avatar_url.includes("default"),
      actionLabel: "Yukarı çık",
    },
    {
      id: "title",
      title: "Ünvan Ekle",
      isCompleted: !!user?.title && user.title.trim() !== "",
      actionLabel: "Git",
    },
    {
      id: "bio",
      title: "Biyografi Ekle",
      isCompleted: !!user?.bio && user.bio.trim() !== "",
      actionLabel: "Git",
    },
    {
      id: "first_lesson",
      title: "İlk Derse Başla",
      isCompleted: (stats?.completedLessonsCount || 0) > 0,
      actionLabel: "Derse Git",
    },
  ];

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);
  const isFullyCompleted = progressPercent === 100;

  const handleTaskClick = (taskId: string, isCompleted: boolean) => {
    if (isCompleted) return;

    if (taskId === "bio" || taskId === "title") {
      router.push("/academy/profile?tab=info");
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }, 100);
    } else if (taskId === "first_lesson") {
      router.push("/academy/courses");
    } else if (taskId === "avatar") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Card className="p-5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-900/20 dark:to-slate-900/40 border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" /> Profil Tamamlama
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isFullyCompleted
              ? "Tebrikler! Profilini başarıyla tamamladın."
              : "Profilini %100 yaparak özel rozetleri kazan."}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            %{progressPercent}
          </span>
        </div>
      </div>

      <Progress value={progressPercent} className="h-2 mb-5" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => handleTaskClick(task.id, task.isCompleted)}
            className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
              task.isCompleted
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 cursor-default"
                : "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-700/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {task.isCompleted ? (
                <CheckCircle2 className="w-4 h-4 fill-current text-emerald-500/20" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span className="text-xs font-semibold">{task.title}</span>
            </div>
            {!task.isCompleted && (
              <span className="text-[10px] font-bold text-indigo-500 opacity-70 group-hover:opacity-100">
                {task.actionLabel}
              </span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
