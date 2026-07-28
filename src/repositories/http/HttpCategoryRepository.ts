import { ICategoryRepository } from "../interfaces";
import { CategoryItem } from "../categoryStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export class HttpCategoryRepository implements ICategoryRepository {
  async getAll(): Promise<CategoryItem[]> {
    const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return json.data || [];
  }

  async create(name: string): Promise<CategoryItem> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create category");
    const json = await res.json();
    return json.data;
  }

  async update(id: string, name: string): Promise<CategoryItem> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to update category");
    const json = await res.json();
    return json.data;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: "DELETE" });
    return res.ok;
  }
}
