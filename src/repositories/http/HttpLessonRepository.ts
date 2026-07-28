import { ILessonRepository } from "../interfaces";
import { Lesson } from "@/types/database";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export class HttpLessonRepository implements ILessonRepository {
  async getByCourseId(courseId: string): Promise<Lesson[]> {
    const res = await fetch(`${API_BASE}/courses/${courseId}/lessons`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  }

  async create(courseId: string, data: Partial<Lesson>): Promise<Lesson> {
    const res = await fetch(`${API_BASE}/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create lesson");
    const json = await res.json();
    return json.data;
  }

  async update(id: string, data: Partial<Lesson>): Promise<Lesson> {
    const res = await fetch(`${API_BASE}/lessons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update lesson");
    const json = await res.json();
    return json.data;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/lessons/${id}`, { method: "DELETE" });
    return res.ok;
  }
}
