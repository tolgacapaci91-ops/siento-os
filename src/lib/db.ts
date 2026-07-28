import fs from "fs";
import path from "path";
import {
  Course,
  Lesson,
  Document,
  Workshop,
  CategoryItem,
  User,
  Badge,
  UserBadge,
  XpLog,
  CourseProgress,
  LessonProgress,
  UsefulSite,
  AuditLog,
  NotificationItem,
  Quiz,
  Question,
  QuizResult,
} from "@/types/database";

export interface DatabaseSchema {
  categories: CategoryItem[];
  courses: Course[];
  course_sections: any[];
  lessons: Lesson[];
  documents: Document[];
  workshops: Workshop[];
  users: User[];
  badges: Badge[];
  user_badges: UserBadge[];
  xp_logs: XpLog[];
  course_progress: CourseProgress[];
  lesson_progress: LessonProgress[];
  useful_sites: UsefulSite[];
  audit_logs: AuditLog[];
  notifications: NotificationItem[];
  quizzes: Quiz[];
  questions: Question[];
  quiz_results: QuizResult[];
}

const DB_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "db.json");

const INITIAL_DB: DatabaseSchema = {
  categories: [],
  courses: [],
  course_sections: [],
  lessons: [],
  documents: [],
  workshops: [],
  users: [],
  badges: [],
  user_badges: [],
  xp_logs: [],
  course_progress: [],
  lesson_progress: [],
  useful_sites: [],
  audit_logs: [],
  notifications: [],
  quizzes: [],
  questions: [],
  quiz_results: [],
};

function ensureDbExists(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf-8");
    return INITIAL_DB;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      categories: parsed.categories || [],
      courses: parsed.courses || [],
      course_sections: parsed.course_sections || [],
      lessons: parsed.lessons || [],
      documents: parsed.documents || [],
      workshops: parsed.workshops || [],
      users: parsed.users || [],
      badges: parsed.badges || [],
      user_badges: parsed.user_badges || [],
      xp_logs: parsed.xp_logs || [],
      course_progress: parsed.course_progress || [],
      lesson_progress: parsed.lesson_progress || [],
      useful_sites: parsed.useful_sites || [],
      audit_logs: parsed.audit_logs || [],
      notifications: parsed.notifications || [],
      quizzes: parsed.quizzes || [],
      questions: parsed.questions || [],
      quiz_results: parsed.quiz_results || [],
    };
  } catch (err) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf-8");
    return INITIAL_DB;
  }
}

export function readDb(): DatabaseSchema {
  return ensureDbExists();
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function addAuditLog(
  user_name: string,
  action: string,
  entity_type: string,
  entity_id: string,
  ip_address: string = "127.0.0.1"
) {
  const db = readDb();
  if (!db.audit_logs) db.audit_logs = [];
  
  db.audit_logs.unshift({
    id: `audit_${Date.now()}`,
    user_id: "system", // We can use actual user ID if auth is connected
    user_name,
    action,
    entity_type,
    entity_id,
    ip_address,
    user_agent: "Mozilla/5.0 System",
    created_at: new Date().toISOString()
  });

  // Keep only the latest 100 logs
  if (db.audit_logs.length > 100) {
    db.audit_logs = db.audit_logs.slice(0, 100);
  }

  writeDb(db);
}

export function addNotification(
  title: string,
  message: string,
  type: "info" | "success" | "warning" | "system" = "info",
  action_url?: string
) {
  const db = readDb();
  if (!db.notifications) db.notifications = [];
  
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    user_id: "all",
    title,
    message,
    type,
    is_read: false,
    read_by: [],
    action_url,
    created_at: new Date().toISOString()
  });

  writeDb(db);
}
