import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

export async function GET() {
  try {
    const db = readDb();

    return NextResponse.json({
      success: true,
      data: {
        users: db.users?.length || 0,
        courses: db.courses?.length || 0,
        pdfs: db.documents?.length || 0,
        workshops: db.workshops?.length || 0,
        audit_logs: db.audit_logs?.slice(0, 10) || [], // Return latest 10 logs
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Veritabanı okunamadı" }, { status: 500 });
  }
}
