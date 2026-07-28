"use client";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [];

const CATEGORY_STORAGE_KEY = "sientoops_common_categories";

export function getStoredCategories(): CategoryItem[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  const stored = localStorage.getItem(CATEGORY_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveStoredCategory(name: string): CategoryItem[] {
  const categories = getStoredCategories();
  const newCat: CategoryItem = {
    id: `cat_${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
  };
  const updated = [...categories, newCat];
  if (typeof window !== "undefined") {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
