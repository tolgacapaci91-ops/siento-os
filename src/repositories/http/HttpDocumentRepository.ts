import { IDocumentRepository } from "../interfaces";
import { Document } from "@/types/database";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export class HttpDocumentRepository implements IDocumentRepository {
  async getAll(): Promise<Document[]> {
    const res = await fetch(`${API_BASE}/documents`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch documents");
    const json = await res.json();
    return json.data || [];
  }

  async getById(id: string): Promise<Document | null> {
    const docs = await this.getAll();
    return docs.find((d) => d.id === id) || null;
  }

  async create(data: Partial<Document>): Promise<Document> {
    const res = await fetch(`${API_BASE}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create document");
    const json = await res.json();
    return json.data;
  }

  async update(id: string, data: Partial<Document>): Promise<Document> {
    throw new Error("Update not supported");
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/documents/${id}`, { method: "DELETE" });
    return res.ok;
  }
}
