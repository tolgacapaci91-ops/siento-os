"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/types/database";
import { UserGamificationStats } from "@/services/AchievementEngineService";

export function useAchievementEngine(userId: string = "user_demo") {
  const [stats, setStats] = useState<UserGamificationStats | null>(null);
  const [unlockedBadgeQueue, setUnlockedBadgeQueue] = useState<Badge[]>([]);
  const [currentCelebrationBadge, setCurrentCelebrationBadge] = useState<Badge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/user/stats?userId=${userId}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch user stats", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleNewlyUnlockedBadges = (badges: Badge[]) => {
    if (badges && badges.length > 0) {
      setUnlockedBadgeQueue((prev) => [...prev, ...badges]);
      if (!currentCelebrationBadge) {
        setCurrentCelebrationBadge(badges[0]);
      }
    }
  };

  const closeCelebrationModal = () => {
    setCurrentCelebrationBadge(null);
    setUnlockedBadgeQueue((prev) => {
      const nextQueue = prev.slice(1);
      if (nextQueue.length > 0) {
        setCurrentCelebrationBadge(nextQueue[0]);
      }
      return nextQueue;
    });
  };

  const completeLesson = async (lessonId: string, courseId?: string) => {
    try {
      const res = await fetch("/api/v1/progress/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, lessonId, courseId }),
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.stats);
        handleNewlyUnlockedBadges(json.newlyUnlockedBadges);
        return json;
      }
    } catch (err) {
      console.error("Error completing lesson", err);
    }
  };

  const readDocument = async (documentId: string, category?: string) => {
    try {
      const res = await fetch("/api/v1/progress/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, documentId, category }),
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.stats);
        handleNewlyUnlockedBadges(json.newlyUnlockedBadges);
        return json;
      }
    } catch (err) {
      console.error("Error reading document", err);
    }
  };

  const completeWorkshop = async (workshopId: string, category?: string) => {
    try {
      const res = await fetch("/api/v1/progress/workshop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, workshopId, category }),
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.stats);
        handleNewlyUnlockedBadges(json.newlyUnlockedBadges);
        return json;
      }
    } catch (err) {
      console.error("Error completing workshop", err);
    }
  };

  const updateProfile = async (action: "avatar" | "bio" | "title") => {
    try {
      const res = await fetch("/api/v1/progress/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        const json = await res.json();
        setStats(json.stats);
        handleNewlyUnlockedBadges(json.newlyUnlockedBadges);
        return json;
      }
    } catch (err) {
      console.error(`Error updating profile gamification (${action})`, err);
    }
  };

  return {
    stats,
    isLoading,
    refreshStats: fetchStats,
    completeLesson,
    readDocument,
    completeWorkshop,
    updateProfile,
    celebrationBadge: currentCelebrationBadge,
    closeCelebrationModal,
  };
}
