"use client";

import React, { useState, useEffect } from "react";
import { Award, Lock, CheckCircle2, Zap, Trophy, ShieldAlert } from "lucide-react";
import { badgeRepository } from "@/repositories";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/types/database";

export function ProfileBadgesTab() {
  const { user } = useAuth();
  const { stats, isLoading } = useAchievementEngine(user?.id);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);

  useEffect(() => {
    badgeRepository.getAll().then((res) => {
      setAllBadges(res.data);
    });
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-500">Rozetler yükleniyor...</div>;
  }

  const earnedBadgeIds = new Set(stats?.earnedBadges.map((eb) => eb.badge.id) || []);

  const getTierColorClass = (tier: string) => {
    switch (tier) {
      case "diamond":
        return "border-cyan-500/50 bg-cyan-500/10 text-cyan-400";
      case "platin":
        return "border-slate-300/50 bg-slate-400/10 text-slate-200";
      case "altin":
        return "border-amber-500/50 bg-amber-500/10 text-amber-400";
      case "gumus":
        return "border-slate-400/50 bg-slate-400/10 text-slate-300";
      case "bronz":
      default:
        return "border-orange-500/50 bg-orange-500/10 text-orange-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Level & XP Overview Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
            L{stats?.level || 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Gamification Seviyeniz</h3>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs">
                {stats?.totalXp || 0} XP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Level {stats?.level || 1} seviyesindesiniz. Sonraki seviye için ders izlemeye ve lab tamamlamaya devam edin!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center">
          <div>
            <span className="text-lg font-black text-emerald-400">{stats?.earnedBadges.length || 0}</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Açılan Rozet</span>
          </div>
          <div>
            <span className="text-lg font-black text-amber-400">{allBadges.length - (stats?.earnedBadges.length || 0)}</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Kilitli</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" /> Başarı Rozetleri ({allBadges.length})
          </h4>
          <span className="text-xs text-slate-500">
            Kazanılan: {stats?.earnedBadges.length || 0} / {allBadges.length}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const isUnlocked = earnedBadgeIds.has(badge.id);
            const userBadgeEntry = stats?.earnedBadges.find((eb) => eb.badge.id === badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isUnlocked
                    ? "bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5 text-slate-100"
                    : "bg-slate-950/40 border-slate-800/60 opacity-60 grayscale"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getTierColorClass(badge.tier)}`}>
                      {badge.tier}
                    </span>
                    {isUnlocked ? (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Kazanıldı
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Kilitli
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="text-3xl p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      {badge.icon || "🏅"}
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-slate-100">{badge.name}</h5>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                        <Zap className="w-3 h-3 fill-emerald-400" /> +{badge.xp_reward || 50} XP Ödülü
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                {isUnlocked && userBadgeEntry && (
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center font-mono">
                    <span>Kazanılma Tarihi:</span>
                    <span className="text-amber-400">
                      {new Date(userBadgeEntry.awardedAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
