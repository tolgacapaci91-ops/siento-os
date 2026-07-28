import { ICourseRepository } from "../interfaces";
import { Course } from "@/types/database";
import { MOCK_COURSES } from "../mockData";

const COURSES_STORAGE_KEY = "sientoops_video_courses";

export class MockCourseRepository implements ICourseRepository {
  private getStored(): Course[] {
    if (typeof window === "undefined") return MOCK_COURSES;
    const stored = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(MOCK_COURSES));
      return MOCK_COURSES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_COURSES;
    }
  }

  private save(courses: Course[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
    }
  }

  async getAll(): Promise<Course[]> {
    return this.getStored();
  }

  async getById(id: string): Promise<Course | null> {
    const courses = this.getStored();
    return courses.find((c) => c.id === id) || null;
  }

  async create(data: Omit<Course, "id">): Promise<Course> {
    const courses = this.getStored();
    const newCourse: Course = {
      ...data,
      id: `course_${Date.now()}`,
    };
    const updated = [newCourse, ...courses];
    this.save(updated);
    return newCourse;
  }

  async update(id: string, data: Partial<Course>): Promise<Course> {
    const courses = this.getStored();
    let updatedCourse: Course | null = null;
    const updated = courses.map((c) => {
      if (c.id === id) {
        updatedCourse = { ...c, ...data };
        return updatedCourse;
      }
      return c;
    });
    this.save(updated);
    if (!updatedCourse) throw new Error("Course not found");
    return updatedCourse;
  }

  async delete(id: string): Promise<boolean> {
    const courses = this.getStored();
    const updated = courses.filter((c) => c.id !== id);
    this.save(updated);
    return true;
  }
}
