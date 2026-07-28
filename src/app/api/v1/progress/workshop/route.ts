import { NextResponse } from "next/server";
import { AchievementEngineService } from "@/services/AchievementEngineService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = "user_demo", workshopId, category } = body;

    if (!workshopId) {
      return NextResponse.json({ error: "workshopId is required" }, { status: 400 });
    }

    const result = AchievementEngineService.processEvent(userId, "workshop", workshopId, { category });
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
