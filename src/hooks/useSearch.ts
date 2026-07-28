"use client";

import { useState, useEffect } from "react";
import { courseRepository, workshopRepository, documentRepository } from "@/repositories";
import { Course, Workshop, Document } from "@/types/database";

export interface SearchResultItem {
  id: string;
  type: "course" | "workshop" | "document" | "setting";
  title: string;
  subtitle: string;
  url: string;
}

export function useSearch() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const [courses, setCourses] = useState<Course[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    Promise.all([
      courseRepository.getAll(),
      workshopRepository.getAll(),
      documentRepository.getAll(),
    ]).then(([cList, wList, dList]) => {
      setCourses(cList);
      setWorkshops(wList);
      setDocuments(dList);
    });
  }, []);

  const results: SearchResultItem[] = [];

  if (query.trim().length > 0) {
    const q = query.toLowerCase();

    // Live Courses search using deterministic course.id
    courses.forEach((c) => {
      if (c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) {
        results.push({
          id: c.id,
          type: "course",
          title: c.title,
          subtitle: `Eğitim • ${c.category} • ${c.level}`,
          url: `/courses/${c.id}`,
        });
      }
    });

    // Live Workshops search
    workshops.forEach((w) => {
      if (w.title.toLowerCase().includes(q) || w.category.toLowerCase().includes(q)) {
        results.push({
          id: w.id,
          type: "workshop",
          title: w.title,
          subtitle: `Workshop • ${w.category} • ${w.difficulty}`,
          url: `/workshops`,
        });
      }
    });

    // Live Documents search
    documents.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) {
        results.push({
          id: d.id,
          type: "document",
          title: d.title,
          subtitle: `PDF Doküman • ${d.category} • ${d.page_count} Sayfa`,
          url: `/documents`,
        });
      }
    });
  }

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    results,
  };
}
