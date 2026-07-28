"use client";

import { useState, useEffect, useCallback } from "react";
import { Course } from "@/types/database";
import { courseRepository } from "@/repositories";

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    const data = await courseRepository.getAll();
    setCourses(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const toggleFavorite = (id: string) => {
    setCourses((prev) => {
      const newItems = prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      );
      
      const favoriteIds = newItems.filter(d => d.is_favorite).map(d => d.id);
      localStorage.setItem("siento_fav_courses", JSON.stringify(favoriteIds));
      
      return newItems;
    });
  };

  useEffect(() => {
    if (courses.length > 0) {
      const savedFavs = localStorage.getItem("siento_fav_courses");
      if (savedFavs) {
        try {
          const favoriteIds = JSON.parse(savedFavs);
          setCourses(prev => prev.map(item => ({
            ...item,
            is_favorite: favoriteIds.includes(item.id) || item.is_favorite
          })));
        } catch (e) {}
      }
    }
  }, [courses.length > 0]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tümü" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    courses: filteredCourses,
    allCourses: courses,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    reloadCourses: loadCourses,
    toggleFavorite,
  };
}
