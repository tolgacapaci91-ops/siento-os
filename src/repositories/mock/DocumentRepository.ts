import { IDocumentRepository } from "../interfaces";
import { Document } from "@/types/database";
import { MOCK_DOCUMENTS } from "../mockData";

const DOCS_STORAGE_KEY = "sientoops_pdf_documents";

export class MockDocumentRepository implements IDocumentRepository {
  private getStored(): Document[] {
    if (typeof window === "undefined") return MOCK_DOCUMENTS;
    const stored = localStorage.getItem(DOCS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(MOCK_DOCUMENTS));
      return MOCK_DOCUMENTS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_DOCUMENTS;
    }
  }

  private save(docs: Document[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
    }
  }

  async getAll(): Promise<Document[]> {
    return this.getStored();
  }

  async getById(id: string): Promise<Document | null> {
    const docs = this.getStored();
    return docs.find((d) => d.id === id) || null;
  }

  async create(data: Omit<Document, "id">): Promise<Document> {
    const docs = this.getStored();
    const newDoc: Document = {
      ...data,
      id: `doc_${Date.now()}`,
    };
    const updated = [newDoc, ...docs];
    this.save(updated);
    return newDoc;
  }

  async update(id: string, data: Partial<Document>): Promise<Document> {
    const docs = this.getStored();
    let updatedDoc: Document | null = null;
    const updated = docs.map((d) => {
      if (d.id === id) {
        updatedDoc = { ...d, ...data };
        return updatedDoc;
      }
      return d;
    });
    this.save(updated);
    if (!updatedDoc) throw new Error("Document not found");
    return updatedDoc;
  }

  async delete(id: string): Promise<boolean> {
    const docs = this.getStored();
    const updated = docs.filter((d) => d.id !== id);
    this.save(updated);
    return true;
  }
}
