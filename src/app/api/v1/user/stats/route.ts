import { NextResponse } from "next/server";
import { AchievementEngineService } from "@/services/AchievementEngineService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "user_demo";

    const stats = AchievementEngineService.getUserStats(userId);
    return NextResponse.json({ data: stats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
