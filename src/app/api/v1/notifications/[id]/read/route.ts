import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const id = params.id;
    
    // Simulate user context (in a real app, this comes from a session/token)
    // We expect the client to send their user_id in the body. If not provided, we use a default.
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || "user_simulated_123";

    const db = readDb();
    if (!db.notifications) db.notifications = [];

    const index = db.notifications.findIndex(n => n.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Bildirim bulunamadı" }, { status: 404 });
    }

    // Initialize array if it doesn't exist
    if (!db.notifications[index].read_by) {
      db.notifications[index].read_by = [];
    }

    // Add user to read list if not already there
    if (!db.notifications[index].read_by.includes(userId)) {
      db.notifications[index].read_by.push(userId);
      writeDb(db);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
