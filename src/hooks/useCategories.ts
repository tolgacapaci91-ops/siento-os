"use client";

import { useState, useEffect, useCallback } from "react";
import { categoryRepository, CategoryItem } from "@/repositories";

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoryRepository.getAll();
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    reloadCategories: loadCategories,
  };
}
