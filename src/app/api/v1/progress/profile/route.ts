import { NextResponse } from "next/server";
import { AchievementEngineService } from "@/services/AchievementEngineService";

export async function POST(req: Request) {
  try {
    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const { xpAwarded, newlyUnlockedBadges } = AchievementEngineService.processEvent(
      userId,
      "profile_update",
      action
    );

    const stats = AchievementEngineService.getUserStats(userId);

    return NextResponse.json({
      success: true,
      xpAwarded,
      newlyUnlockedBadges,
      stats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
