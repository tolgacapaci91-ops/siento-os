import { readDb, writeDb } from "@/lib/db";
import { Badge, UserBadge, XpLog, CourseProgress, LessonProgress } from "@/types/database";

export interface UserGamificationStats {
  userId: string;
  totalXp: number;
  level: number;
  completedLessonsCount: number;
  completedCoursesCount: number;
  readDocumentsCount: number;
  completedWorkshopsCount: number;
  earnedBadges: { badge: Badge; awardedAt: string }[];
  recentBadge: { badge: Badge; awardedAt: string } | null;
}

export class AchievementEngineService {
  /**
   * Calculates Level based on XP curve: Level = Math.floor(Math.sqrt(totalXp / 50)) + 1
   */
  public static calculateLevel(totalXp: number): number {
    if (totalXp <= 0) return 1;
    return Math.floor(Math.sqrt(totalXp / 50)) + 1;
  }

  /**
   * Main Achievement Engine Processor
   * Call whenever a user completes a lesson, document, workshop, or course.
   */
  public static processEvent(
    userId: string,
    eventType: "video" | "pdf" | "workshop" | "profile_update",
    entityId: string,
    extraData?: { courseId?: string; category?: string }
  ): { xpAwarded: number; newlyUnlockedBadges: Badge[] } {
    const db = readDb();
    let xpAwarded = 0;
    const newlyUnlockedBadges: Badge[] = [];

    // Step 1: Base XP Award Rules
    // Video = 20 XP, PDF = 10 XP, Workshop = 50 XP
    if (eventType === "video") {
      const existingLessonProg = db.lesson_progress.find(
        (lp) => lp.user_id === userId && lp.lesson_id === entityId && lp.is_completed
      );
      if (!existingLessonProg) {
        db.lesson_progress.push({
          id: `lp_${Date.now()}`,
          user_id: userId,
          lesson_id: entityId,
          course_id: extraData?.courseId || "",
          is_completed: true,
          completed_at: new Date().toISOString(),
        });
        xpAwarded += 20;
        db.xp_logs.push({
          id: `xp_${Date.now()}_1`,
          user_id: userId,
          points: 20,
          source_type: "video",
          source_id: entityId,
          description: "Video ders tamamlama bonusu",
          created_at: new Date().toISOString(),
        });
      }
    } else if (eventType === "pdf") {
      xpAwarded += 10;
      db.xp_logs.push({
        id: `xp_${Date.now()}_2`,
        user_id: userId,
        points: 10,
        source_type: "pdf",
        source_id: entityId,
        description: "PDF doküman okuma bonusu",
        created_at: new Date().toISOString(),
      });
    } else if (eventType === "workshop") {
      xpAwarded += 50;
      db.xp_logs.push({
        id: `xp_${Date.now()}_3`,
        user_id: userId,
        points: 50,
        source_type: "workshop",
        source_id: entityId,
        description: "Workshop lab görevi tamamlandı",
        created_at: new Date().toISOString(),
      });
    } else if (eventType === "profile_update") {
      const action = extraData?.category || entityId; // "avatar" or "bio"
      
      const existingProfileXp = db.xp_logs.find(
        (xp) => xp.user_id === userId && xp.source_type === "profile_update" && xp.source_id === action
      );
      
      if (!existingProfileXp) {
        let points = 50;
        let description = "";
        
        if (action === "avatar") {
          points = 100;
          description = "İlk kez profil resmi yükleme bonusu";
        } else if (action === "bio") {
          description = "İlk kez biyografi ekleme bonusu";
        } else if (action === "title") {
          description = "İlk kez ünvan ekleme bonusu";
        }

        xpAwarded += points;
        db.xp_logs.push({
          id: `xp_${Date.now()}_4`,
          user_id: userId,
          points: points,
          source_type: "profile_update",
          source_id: action,
          description: description,
          created_at: new Date().toISOString(),
        });
      }
    }

    // Step 2: Evaluate Course Progress if courseId is available
    if (extraData?.courseId) {
      const courseLessons = db.lessons.filter((l) => l.course_id === extraData.courseId);
      const completedUserLessons = db.lesson_progress.filter(
        (lp) => lp.course_id === extraData.courseId && lp.user_id === userId && lp.is_completed
      );

      const isCourseCompleted =
        courseLessons.length > 0 && completedUserLessons.length >= courseLessons.length;

      let cProgress = db.course_progress.find(
        (cp) => cp.course_id === extraData.courseId && cp.user_id === userId
      );

      if (!cProgress) {
        cProgress = {
          id: `cp_${Date.now()}`,
          user_id: userId,
          course_id: extraData.courseId,
          completed_lessons: completedUserLessons.map((lp) => lp.lesson_id),
          percentage: Math.round((completedUserLessons.length / courseLessons.length) * 100),
          is_completed: isCourseCompleted,
          updated_at: new Date().toISOString(),
        };
        db.course_progress.push(cProgress);
      } else {
        cProgress.completed_lessons = completedUserLessons.map((lp) => lp.lesson_id);
        cProgress.percentage = Math.round(
          (completedUserLessons.length / courseLessons.length) * 100
        );
        cProgress.is_completed = isCourseCompleted;
        cProgress.updated_at = new Date().toISOString();
      }
    }

    // Step 3: Evaluate All Badge Rules for User
    const userEarnedBadgeIds = new Set(
      db.user_badges.filter((ub) => ub.user_id === userId).map((ub) => ub.badge_id)
    );

    const userCompletedLessons = db.lesson_progress.filter(
      (lp) => lp.user_id === userId && lp.is_completed
    ).length;

    const userCompletedCourses = db.course_progress.filter(
      (cp) => cp.user_id === userId && cp.is_completed
    ).length;

    const userPdfReads = db.xp_logs.filter(
      (xp) => xp.user_id === userId && xp.source_type === "pdf"
    ).length;

    const userWorkshopsCount = db.xp_logs.filter(
      (xp) => xp.user_id === userId && xp.source_type === "workshop"
    ).length;

    for (const badge of db.badges) {
      if (userEarnedBadgeIds.has(badge.id)) continue; // Already unlocked

      let unlockConditionMet = false;

      switch (badge.rule_type) {
        case "lessons_completed":
          unlockConditionMet = userCompletedLessons >= (badge.target_value || 1);
          break;
        case "documents_read":
          unlockConditionMet = userPdfReads >= (badge.target_value || 1);
          break;
        case "workshops_completed":
          unlockConditionMet = userWorkshopsCount >= (badge.target_value || 1);
          break;
        case "course_completion":
          if (badge.target_id) {
            const specificCourseProg = db.course_progress.find(
              (cp) => cp.course_id === badge.target_id && cp.user_id === userId && cp.is_completed
            );
            unlockConditionMet = !!specificCourseProg;
          } else {
            unlockConditionMet = userCompletedCourses >= (badge.target_value || 1);
          }
          break;
        case "category_completion":
          if (badge.target_id) {
            const catCourses = db.courses.filter((c) => c.category === badge.target_id);
            const catCompletedCourses = db.course_progress.filter(
              (cp) =>
                cp.user_id === userId &&
                cp.is_completed &&
                catCourses.some((cc) => cc.id === cp.course_id)
            );
            unlockConditionMet =
              catCourses.length > 0 && catCompletedCourses.length >= catCourses.length;
          }
          break;
        case "profile_update":
          if (badge.target_id) {
            const hasProfileUpdate = db.xp_logs.some(
              (xp) => xp.user_id === userId && xp.source_type === "profile_update" && xp.source_id === badge.target_id
            );
            unlockConditionMet = hasProfileUpdate;
          }
          break;
        case "first_course":
        case "first_login":
          unlockConditionMet = true;
          break;
        default:
          break;
      }

      if (unlockConditionMet) {
        // Unlock Badge!
        db.user_badges.push({
          id: `ub_${Date.now()}_${badge.id}`,
          user_id: userId,
          badge_id: badge.id,
          awarded_at: new Date().toISOString(),
        });

        badge.earned_count = (badge.earned_count || 0) + 1;

        // Reward Badge Bonus XP if any
        if (badge.xp_reward) {
          xpAwarded += badge.xp_reward;
          db.xp_logs.push({
            id: `xp_${Date.now()}_b_${badge.id}`,
            user_id: userId,
            points: badge.xp_reward,
            source_type: "badge",
            source_id: badge.id,
            description: `${badge.name} rozeti ödülü`,
            created_at: new Date().toISOString(),
          });
        }

        newlyUnlockedBadges.push(badge);
      }
    }

    writeDb(db);
    return { xpAwarded, newlyUnlockedBadges };
  }

  /**
   * Get User Gamification Summary
   */
  public static getUserStats(userId: string): UserGamificationStats {
    const db = readDb();

    const xpLogs = db.xp_logs.filter((xp) => xp.user_id === userId);
    const totalXp = xpLogs.reduce((acc, curr) => acc + curr.points, 0);
    const level = this.calculateLevel(totalXp);

    const completedLessonsCount = db.lesson_progress.filter(
      (lp) => lp.user_id === userId && lp.is_completed
    ).length;

    const completedCoursesCount = db.course_progress.filter(
      (cp) => cp.user_id === userId && cp.is_completed
    ).length;

    const readDocumentsCount = xpLogs.filter((xp) => xp.source_type === "pdf").length;
    const completedWorkshopsCount = xpLogs.filter((xp) => xp.source_type === "workshop").length;

    const userBadgeLogs = db.user_badges.filter((ub) => ub.user_id === userId);
    const earnedBadges = userBadgeLogs
      .map((ub) => {
        const badge = db.badges.find((b) => b.id === ub.badge_id);
        return badge ? { badge, awardedAt: ub.awarded_at } : null;
      })
      .filter((item): item is { badge: Badge; awardedAt: string } => item !== null);

    const recentBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;

    return {
      userId,
      totalXp,
      level,
      completedLessonsCount,
      completedCoursesCount,
      readDocumentsCount,
      completedWorkshopsCount,
      earnedBadges,
      recentBadge,
    };
  }
}
