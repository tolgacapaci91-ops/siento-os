import { ICourseRepository } from "../interfaces";
import { Course, Lesson } from "@/types/database";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export class HttpCourseRepository implements ICourseRepository {
  async getAll(): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/courses`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch courses");
    const json = await res.json();
    return json.data || [];
  }

  async getById(id: string): Promise<(Course & { lessons?: Lesson[] }) | null> {
    const res = await fetch(`${API_BASE}/courses/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  }

  async create(data: Partial<Course> & { youtubeUrl?: string }): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create course");
    const json = await res.json();
    return json.data;
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update course");
    const json = await res.json();
    return json.data;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" });
    return res.ok;
  }
}
