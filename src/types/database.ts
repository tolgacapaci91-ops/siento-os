/**
 * Complete Database Entity Models & TypeScript Types
 * Designed for PostgreSQL & Laravel 12 JWT Backend Compatibility
 */

export type RoleSlug = "admin" | "instructor" | "student" | "moderator" | "support";

export type PermissionSlug =
  | "course.create"
  | "course.edit"
  | "course.delete"
  | "course.view"
  | "pdf.upload"
  | "pdf.download"
  | "workshop.manage"
  | "user.manage"
  | "role.assign"
  | "badge.manage"
  | "system.settings"
  | "audit.view";

export interface User {
  id: string;
  uuid: string;
  name: string;
  email: string;
  avatar_url: string;
  role: RoleSlug;
  title?: string;
  bio?: string;
  status: "active" | "suspended" | "pending";
  password?: string;
  organization_id?: string;
  xp?: number;
  level?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  category: string;
  level: "Başlangıç" | "Orta Seviye" | "İleri Seviye";
  duration_minutes: number;
  lessons_count: number;
  rating: number;
  version_tag: string;
  is_published: boolean;
  is_featured: boolean;
  is_favorite?: boolean;
  certificate_enabled?: boolean;
  badge_id?: string;
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
  organization_id?: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_provider: "youtube" | "s3";
  video_id: string;
  youtube_url?: string;
  duration_seconds: number;
  order_index: number;
  is_locked?: boolean;
  pdf_document_id?: string;
  pdf_document_title?: string;
  is_completed?: boolean;
}

export interface Workshop {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image: string;
  category: string;
  repo_url?: string;
  file_url?: string;
  
  // New Lab Ecosystem Fields
  code_content?: string;
  code_language?: string;
  file_attachments?: { name: string; url: string; type: string }[];
  execution_command?: string;
  is_local_app?: boolean;

  difficulty: "Kolay" | "Orta" | "Zor";
  estimated_hours: number;
  is_favorite?: boolean;
  tags: string[];
  organization_id?: string;
  created_at: string;
}

export interface UsefulSite {
  id: string;
  title: string;
  description: string;
  url: string;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_size_mb: number;
  page_count: number;
  category: string;
  is_downloadable: boolean;
  is_favorite?: boolean;
  download_count: number;
  organization_id?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "system";
  is_read: boolean; // Deprecated or mapped to read_by locally
  read_by?: string[]; // Array of user IDs who have read this
  action_url?: string;
  created_at: string;
}

export type BadgeRuleType =
  | "course_completion"
  | "category_completion"
  | "lessons_completed"
  | "hours_watched"
  | "documents_read"
  | "workshops_completed"
  | "first_login"
  | "first_course"
  | "daily_streak"
  | "profile_update"
  | "manual";

export type BadgeTier = "bronz" | "gumus" | "altin" | "platin" | "diamond";
export type BadgeColor = "Altın" | "Gümüş" | "Bronz" | "Mavi" | "Mor" | "Yeşil" | "Kırmızı";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: BadgeColor;
  tier: BadgeTier;
  rule_type: BadgeRuleType;
  target_id?: string; // Course ID or Category Name if specific
  target_value?: number; // X count (e.g. 5 lessons, 10 PDFs, 100 hours)
  xp_reward?: number;
  earned_count?: number;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_at: string;
}

export interface XpLog {
  id: string;
  user_id: string;
  points: number;
  source_type: "video" | "pdf" | "workshop" | "daily_streak" | "badge" | "profile_update";
  source_id: string;
  description: string;
  created_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  completed_lessons: string[];
  percentage: number;
  is_completed: boolean;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  is_completed: boolean;
  completed_at: string;
}

export interface UserProgress {
  user_id: string;
  course_id: string;
  completed_lessons: string[];
  last_watched_lesson_id: string;
  progress_percent: number;
  total_minutes_spent: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  min_pass_score: number;
}

export interface Question {
  id: string;
  quiz_id: string;
  text: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  quiz_id: string;
  course_id: string;
  score: number;
  passed: boolean;
  created_at: string;
}
