import { Course, Document, Workshop, Lesson, Badge, UserBadge } from "@/types/database";
import { CategoryItem } from "./categoryStore";

export interface ICourseRepository {
  getAll(): Promise<Course[]>;
  getById(id: string): Promise<(Course & { lessons?: Lesson[] }) | null>;
  create(course: Partial<Course> & { youtubeUrl?: string }): Promise<Course>;
  update(id: string, course: Partial<Course>): Promise<Course>;
  delete(id: string): Promise<boolean>;
}

export interface ILessonRepository {
  getByCourseId(courseId: string): Promise<Lesson[]>;
  create(courseId: string, lesson: Partial<Lesson>): Promise<Lesson>;
  update(id: string, lesson: Partial<Lesson>): Promise<Lesson>;
  delete(id: string): Promise<boolean>;
}

export interface IDocumentRepository {
  getAll(): Promise<Document[]>;
  getById(id: string): Promise<Document | null>;
  create(document: Partial<Document>): Promise<Document>;
  update(id: string, document: Partial<Document>): Promise<Document>;
  delete(id: string): Promise<boolean>;
}

export interface IWorkshopRepository {
  getAll(): Promise<Workshop[]>;
  getById(id: string): Promise<Workshop | null>;
  create(workshop: Partial<Workshop>): Promise<Workshop>;
  update(id: string, workshop: Partial<Workshop>): Promise<Workshop>;
  delete(id: string): Promise<boolean>;
}

export interface ICategoryRepository {
  getAll(): Promise<CategoryItem[]>;
  create(name: string): Promise<CategoryItem>;
  update(id: string, name: string): Promise<CategoryItem>;
  delete(id: string): Promise<boolean>;
}

export interface IBadgeRepository {
  getAll(): Promise<{ data: Badge[]; user_badges: UserBadge[] }>;
  create(badge: Partial<Badge>): Promise<Badge>;
  update(id: string, badge: Partial<Badge>): Promise<Badge>;
  delete(id: string): Promise<boolean>;
}
