import { NextResponse } from "next/server";
import { AchievementEngineService } from "@/services/AchievementEngineService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = "user_demo", lessonId, courseId } = body;

    if (!lessonId) {
      return NextResponse.json({ error: "lessonId is required" }, { status: 400 });
    }

    const result = AchievementEngineService.processEvent(userId, "video", lessonId, { courseId });
    const updatedStats = AchievementEngineService.getUserStats(userId);

    return NextResponse.json({
      success: true,
      xpAwarded: result.xpAwarded,
      newlyUnlockedBadges: result.newlyUnlockedBadges,
      stats: updatedStats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
