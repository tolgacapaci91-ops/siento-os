import { NextResponse } from "next/server";
import { readDb, writeDb, addAuditLog } from "@/lib/db";
import { NotificationItem } from "@/types/database";

export async function GET(req: Request) {
  try {
    const db = readDb();
    
    // We get the user_id from query params or headers (simulating auth)
    // For now, let's just assume we return all notifications
    // The frontend will filter out the ones read by this user.
    
    return NextResponse.json({ data: db.notifications || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, type } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Başlık ve mesaj zorunludur" }, { status: 400 });
    }

    const db = readDb();
    
    const newNotification: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: "all", // Broadcasting to all users
      title: title.trim(),
      message: message.trim(),
      type: type || "info",
      is_read: false,
      read_by: [],
      created_at: new Date().toISOString()
    };

    if (!db.notifications) {
      db.notifications = [];
    }

    db.notifications.unshift(newNotification);
    writeDb(db);

    addAuditLog("Admin", "Tüm kullanıcılara yeni bildirim gönderildi", "Notification", newNotification.id);

    return NextResponse.json({ data: newNotification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
