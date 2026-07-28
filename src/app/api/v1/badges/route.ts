import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { Badge } from "@/types/database";

export async function GET() {
  try {
    const db = readDb();

    // Dynamically calculate real earned count from user_badges table
    const badgesWithRealCounts = db.badges.map((b) => {
      const realEarnedCount = db.user_badges.filter((ub) => ub.badge_id === b.id).length;
      return {
        ...b,
        earned_count: realEarnedCount,
      };
    });

    return NextResponse.json({
      data: badgesWithRealCounts,
      user_badges: db.user_badges,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, icon, color, tier, rule_type, target_id, target_value, xp_reward } = body;

    if (!name || !rule_type) {
      return NextResponse.json({ error: "Name and rule_type are required" }, { status: 400 });
    }

    const db = readDb();
    const newBadge: Badge = {
      id: `bdg_${Date.now()}`,
      name: name.trim(),
      description: description || "",
      icon: icon || "🏅",
      color: color || "Altın",
      tier: tier || "bronz",
      rule_type: rule_type,
      target_id: target_id || undefined,
      target_value: target_value ? Number(target_value) : 1,
      xp_reward: xp_reward ? Number(xp_reward) : 50,
      earned_count: 0,
      created_at: new Date().toISOString(),
    };

    db.badges.push(newBadge);
    writeDb(db);

    return NextResponse.json({ data: newBadge }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
