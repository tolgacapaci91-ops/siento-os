"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { SlidersHorizontal, BookOpen, Award, Terminal, FileText, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CourseProgressWidget } from "@/components/dashboard/CourseProgressWidget";
import { WeeklyActivityWidget } from "@/components/dashboard/WeeklyActivityWidget";
import { RecentCoursesWidget } from "@/components/dashboard/RecentCoursesWidget";
import { RecentPDFsWidget } from "@/components/dashboard/RecentPDFsWidget";
import { WidgetCustomizerModal, WidgetOption } from "@/components/dashboard/WidgetCustomizerModal";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";
import { BadgeCelebrationModal } from "@/components/ui/BadgeCelebrationModal";

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, celebrationBadge, closeCelebrationModal } = useAchievementEngine(user?.id || "user_demo");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const [widgets, setWidgets] = useState<WidgetOption[]>([
    { id: "progress", label: "Devam Eden Eğitim Paneli", description: "Mevcut aktif kursunuzu ve kalan sürenizi gösterir.", enabled: true },
    { id: "activity", label: "Haftalık Öğrenme Grafiği", description: "Günlük çalışma dakikalarınızı Recharts üzerinde analiz eder.", enabled: true },
    { id: "courses", label: "Son Eklenen Eğitimler", description: "En güncel yayınlanan kurs kartlarını listeler.", enabled: true },
    { id: "pdfs", label: "PDF Dokümanları", description: "Önemli ders materyali dokümanlarını gösterir.", enabled: true },
  ]);

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const isWidgetEnabled = (id: string) => widgets.find((w) => w.id === id)?.enabled ?? true;

  return (
    <div className="space-y-6">
      {/* Celebration Modal Component */}
      <BadgeCelebrationModal badge={celebrationBadge} onClose={closeCelebrationModal} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Merhaba, {user?.name || "Kullanıcı"} 👋
            </h1>
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs shadow-md">
              Level {stats?.level || 1}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Bugün öğrenme yolculuğuna kaldığın yerden devam et. Toplam <strong className="text-amber-500">{stats?.totalXp || 0} XP</strong> kazandın!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCustomizerOpen(true)}
            leftIcon={<SlidersHorizontal className="w-4 h-4 text-indigo-500" />}
          >
            Widget&apos;ları Özelleştir
          </Button>
        </div>
      </div>

      {/* Live Gamification Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl glass-panel flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-amber-500">{stats?.totalXp || 0} XP</span>
            <span className="text-[11px] text-slate-500 block">Toplam XP Puanı</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{stats?.completedCoursesCount || 0} Kurs</span>
            <span className="text-[11px] text-slate-500 block">Tamamlanan Kurs</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{stats?.earnedBadges.length || 0} Rozet</span>
            <span className="text-[11px] text-slate-500 block">Kazanılan Rozet</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{stats?.completedWorkshopsCount || 0} Workshop</span>
            <span className="text-[11px] text-slate-500 block">Tamamlanan Lab</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{stats?.readDocumentsCount || 0} Doküman</span>
            <span className="text-[11px] text-slate-500 block">Okunan PDF</span>
          </div>
        </div>
      </div>

      {/* Son Kazanılan Rozet Widget Banner */}
      {stats?.recentBadge && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-transparent border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2 rounded-xl bg-slate-900 border border-amber-500/40">
              {stats.recentBadge.badge.icon || "🏅"}
            </div>
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" /> Son Kazanılan Rozet
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {stats.recentBadge.badge.name}
              </h4>
              <p className="text-xs text-slate-400">
                {stats.recentBadge.badge.description}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            +{stats.recentBadge.badge.xp_reward || 50} XP
          </span>
        </div>
      )}

      {/* Widget Grid */}
      <div className="space-y-6">
        {isWidgetEnabled("progress") && <CourseProgressWidget />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {isWidgetEnabled("activity") && <WeeklyActivityWidget />}
            {isWidgetEnabled("courses") && <RecentCoursesWidget />}
          </div>

          <div className="space-y-6">
            {isWidgetEnabled("pdfs") && <RecentPDFsWidget />}
          </div>
        </div>
      </div>

      <WidgetCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        widgets={widgets}
        onToggleWidget={toggleWidget}
      />
    </div>
  );
}
