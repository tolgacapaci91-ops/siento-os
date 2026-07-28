"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProgressTracker } from "@/components/certificates/ProgressTracker";
import { CertificateCard } from "@/components/certificates/CertificateCard";
import { ShieldCheck } from "lucide-react";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";

export default function CertificatesPage() {
  const { user } = useAuth();
  const { stats } = useAchievementEngine(user?.id);

  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({
    videos: 0,
    pdfs: 0,
    workshops: 0,
  });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await fetch("/api/v1/stats/totals");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setTotals({
              videos: json.data.videos || 0,
              pdfs: json.data.pdfs || 0,
              workshops: json.data.workshops || 0,
            });
          }
        }
      } catch (error) {
        console.error("Sertifika için toplam veri çekilemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotals();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500" />
      </div>
    );
  }

  // Current user completed amounts
  const completedVideos = stats?.completedLessonsCount || 0;
  const completedPdfs = stats?.readDocumentsCount || 0;
  const completedWorkshops = stats?.completedWorkshopsCount || 0;

  // We consider all required items. (In a real scenario, total courses/lessons might be filtered to active ones)
  // Let's protect against empty database where totals could be 0
  const isEverythingCompleted = 
    totals.videos > 0 &&
    completedVideos >= totals.videos &&
    completedPdfs >= totals.pdfs;

  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shadow-sm shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Sertifikalarım
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Eğitim yolculuğunuzdaki başarılarınızı taçlandırın.
          </p>
        </div>
      </div>

      {!isEverythingCompleted ? (
        <ProgressTracker
          totalVideos={totals.videos}
          completedVideos={completedVideos}
          totalPdfs={totals.pdfs}
          completedPdfs={completedPdfs}
        />
      ) : (
        <CertificateCard 
          userName={user?.name || "Kullanıcı Adı"} 
          issueDate={today} 
        />
      )}
    </div>
  );
}
