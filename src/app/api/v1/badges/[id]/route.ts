import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const db = readDb();

    let updatedBadge = null;

    db.badges = db.badges.map((b) => {
      if (b.id === id) {
        updatedBadge = {
          ...b,
          ...body,
          target_value: body.target_value ? Number(body.target_value) : b.target_value,
          xp_reward: body.xp_reward ? Number(body.xp_reward) : b.xp_reward,
        };
        return updatedBadge;
      }
      return b;
    });

    if (!updatedBadge) {
      return NextResponse.json({ error: "Badge not found" }, { status: 404 });
    }

    writeDb(db);
    return NextResponse.json({ data: updatedBadge });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();

    db.badges = db.badges.filter((b) => b.id !== id);
    db.user_badges = db.user_badges.filter((ub) => ub.badge_id !== id);

    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
