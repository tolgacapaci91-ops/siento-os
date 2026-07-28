import { ICategoryRepository } from "../interfaces";
import { CategoryItem, DEFAULT_CATEGORIES } from "../categoryStore";

const CATEGORIES_STORAGE_KEY = "sientoops_common_categories";

export class MockCategoryRepository implements ICategoryRepository {
  private getStored(): CategoryItem[] {
    if (typeof window === "undefined") return DEFAULT_CATEGORIES;
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  private save(categories: CategoryItem[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    }
  }

  async getAll(): Promise<CategoryItem[]> {
    return this.getStored();
  }

  async create(name: string): Promise<CategoryItem> {
    const categories = this.getStored();
    const newCat: CategoryItem = {
      id: `cat_${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    };
    const updated = [...categories, newCat];
    this.save(updated);
    return newCat;
  }

  async update(id: string, name: string): Promise<CategoryItem> {
    const categories = this.getStored();
    let updatedCat: CategoryItem = { id, name, slug: name.toLowerCase().replace(/\s+/g, "-") };
    const updated = categories.map((c) => {
      if (c.id === id) {
        updatedCat = { ...c, name, slug: name.toLowerCase().replace(/\s+/g, "-") };
        return updatedCat;
      }
      return c;
    });
    this.save(updated);
    return updatedCat;
  }

  async delete(id: string): Promise<boolean> {
    const categories = this.getStored();
    const updated = categories.filter((c) => c.id !== id);
    this.save(updated);
    return true;
  }
}
