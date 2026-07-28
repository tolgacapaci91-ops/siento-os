"use client";

import React, { useEffect } from "react";
import { Badge } from "@/types/database";
import { Button } from "@/components/ui/Button";
import { Sparkles, Trophy, CheckCircle2 } from "lucide-react";

interface BadgeCelebrationModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({ badge, onClose }) => {
  useEffect(() => {
    if (!badge) return;

    // Dynamic Confetti Particle Generation
    const createConfetti = () => {
      const colors = ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#8b5cf6"];
      const container = document.getElementById("confetti-container");
      if (!container) return;

      container.innerHTML = "";
      for (let i = 0; i < 40; i++) {
        const p = document.createElement("div");
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const size = Math.random() * 8 + 4;
        const duration = Math.random() * 2 + 1.5;

        p.style.position = "absolute";
        p.style.left = `${left}%`;
        p.style.top = "-10px";
        p.style.width = `${size}px`;
        p.style.height = `${size * 1.5}px`;
        p.style.backgroundColor = color;
        p.style.borderRadius = "2px";
        p.style.transform = `rotate(${Math.random() * 360}deg)`;
        p.style.opacity = "0.9";
        p.style.animation = `fall ${duration}s ease-in infinite`;

        container.appendChild(p);
      }
    };

    createConfetti();
  }, [badge]);

  if (!badge) return null;

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case "diamond":
        return "from-cyan-500 via-blue-500 to-indigo-600";
      case "platin":
        return "from-slate-300 via-slate-100 to-slate-400";
      case "altin":
        return "from-amber-400 via-yellow-500 to-amber-600";
      case "gumus":
        return "from-slate-400 via-slate-300 to-slate-500";
      case "bronz":
      default:
        return "from-orange-400 via-amber-600 to-orange-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Confetti Container */}
      <div id="confetti-container" className="absolute inset-0 pointer-events-none overflow-hidden" />

      {/* Celebration Card */}
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl shadow-amber-500/20 text-center space-y-6 overflow-hidden">
        {/* Glow Ring Background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />

        {/* Header */}
        <div className="relative space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Yeni Rozet Unlocked!
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            🎉 Tebrikler!
          </h2>
          <p className="text-xs text-slate-300">
            Platformdaki kararlı ilerlemeniz yeni bir başarı açtı!
          </p>
        </div>

        {/* Animated Badge Icon Container */}
        <div className="relative my-4 flex justify-center">
          <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${getTierGradient(badge.tier)} p-1 shadow-xl shadow-amber-500/30 transform hover:scale-105 transition-transform duration-300`}>
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center space-y-1">
              <span className="text-5xl animate-bounce">{badge.icon || "🏅"}</span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{badge.tier}</span>
            </div>
          </div>
        </div>

        {/* Badge Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-amber-300">{badge.name}</h3>
          <p className="text-xs text-slate-300 leading-relaxed px-4">{badge.description}</p>
          {badge.xp_reward && (
            <div className="inline-flex items-center gap-1 mt-2 text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
              <Trophy className="w-3.5 h-3.5" /> +{badge.xp_reward} XP Kazanıldı!
            </div>
          )}
        </div>

        {/* Devam Et Action */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold shadow-lg shadow-amber-500/25"
            leftIcon={<CheckCircle2 className="w-5 h-5" />}
          >
            Devam Et
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
