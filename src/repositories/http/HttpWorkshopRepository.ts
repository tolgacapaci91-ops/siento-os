import { IWorkshopRepository } from "../interfaces";
import { Workshop } from "@/types/database";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export class HttpWorkshopRepository implements IWorkshopRepository {
  async getAll(): Promise<Workshop[]> {
    const res = await fetch(`${API_BASE}/workshops`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch workshops");
    const json = await res.json();
    return json.data || [];
  }

  async getById(id: string): Promise<Workshop | null> {
    const workshops = await this.getAll();
    return workshops.find((w) => w.id === id) || null;
  }

  async create(data: Partial<Workshop>): Promise<Workshop> {
    const res = await fetch(`${API_BASE}/workshops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create workshop");
    const json = await res.json();
    return json.data;
  }

  async update(id: string, data: Partial<Workshop>): Promise<Workshop> {
    const res = await fetch(`${API_BASE}/workshops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update workshop");
    const json = await res.json();
    return json.data;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/workshops/${id}`, { method: "DELETE" });
    return res.ok;
  }
}
