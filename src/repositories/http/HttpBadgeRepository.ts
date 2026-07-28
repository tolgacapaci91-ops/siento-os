import { IBadgeRepository } from "../interfaces";
import { Badge, UserBadge } from "@/types/database";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export class HttpBadgeRepository implements IBadgeRepository {
  async getAll(): Promise<{ data: Badge[]; user_badges: UserBadge[] }> {
    const res = await fetch(`${API_BASE}/badges`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch badges");
    return res.json();
  }

  async create(badge: Partial<Badge>): Promise<Badge> {
    const res = await fetch(`${API_BASE}/badges`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(badge),
    });
    if (!res.ok) throw new Error("Failed to create badge");
    const json = await res.json();
    return json.data;
  }

  async update(id: string, badge: Partial<Badge>): Promise<Badge> {
    const res = await fetch(`${API_BASE}/badges/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(badge),
    });
    if (!res.ok) throw new Error("Failed to update badge");
    const json = await res.json();
    return json.data;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/badges/${id}`, { method: "DELETE" });
    return res.ok;
  }
}
