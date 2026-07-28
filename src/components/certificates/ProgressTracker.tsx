import React from "react";
import { Card } from "@/components/ui/Card";
import { Target, CheckCircle2, PlaySquare, FileText } from "lucide-react";

interface ProgressTrackerProps {
  totalVideos: number;
  completedVideos: number;
  totalPdfs: number;
  completedPdfs: number;
}

export function ProgressTracker({
  totalVideos,
  completedVideos,
  totalPdfs,
  completedPdfs,
}: ProgressTrackerProps) {
  const totalItems = totalVideos + totalPdfs;
  const totalCompleted = completedVideos + completedPdfs;
  
  // Calculate percentage, maxing at 100% just in case of data inconsistencies
  const progressPercent = totalItems > 0 ? Math.min(100, Math.round((totalCompleted / totalItems) * 100)) : 0;

  const remainingVideos = Math.max(0, totalVideos - completedVideos);
  const remainingPdfs = Math.max(0, totalPdfs - completedPdfs);

  // Helper for sentence building
  const missingTextParts = [];
  if (remainingVideos > 0) missingTextParts.push(`${remainingVideos} Video Ders`);
  if (remainingPdfs > 0) missingTextParts.push(`${remainingPdfs} PDF Dokümanı`);
  
  const missingSentence = missingTextParts.length > 0 
    ? `Daha ${missingTextParts.join(", ")}'nız kaldı.`
    : "Tüm eğitimleri tamamladınız!";

  return (
    <Card className="p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-100">Sertifikanıza Çok Yaklaştınız!</h2>
          </div>
          <p className="text-slate-400 font-medium">
            Sertifikanızı almaya hak kazanmak için tüm eğitim materyallerini tamamlamanız gerekmektedir.
          </p>
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {missingSentence}
          </div>
        </div>

        {/* Circular Progress or Large percentage */}
        <div className="shrink-0 flex items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-white/5 shadow-inner">
          <div className="text-center">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-1">
              %{progressPercent}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tamamlandı</div>
          </div>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="mt-8">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2 px-1">
          <span>Genel İlerleme</span>
          <span>{totalCompleted} / {totalItems} Görev</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <PlaySquare className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Videolar</span>
            <span className="text-sm font-bold text-slate-200">{completedVideos} / {totalVideos}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">PDF'ler</span>
            <span className="text-sm font-bold text-slate-200">{completedPdfs} / {totalPdfs}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
