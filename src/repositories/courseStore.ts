"use client";

import { Course } from "@/types/database";
import { MOCK_COURSES } from "@/repositories/mockData";

const COURSES_STORAGE_KEY = "sientoops_video_courses";

export function getStoredCourses(): Course[] {
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

export function saveStoredCourse(course: Course): Course[] {
  const current = getStoredCourses();
  const updated = [course, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteStoredCourse(id: string): Course[] {
  const current = getStoredCourses();
  const updated = current.filter((c) => c.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
