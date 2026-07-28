"use client";

import { Document } from "@/types/database";
import { MOCK_DOCUMENTS } from "@/repositories/mockData";

const DOCS_STORAGE_KEY = "sientoops_pdf_documents";

export function getStoredDocuments(): Document[] {
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

export function saveStoredDocument(doc: Document): Document[] {
  const current = getStoredDocuments();
  const updated = [doc, ...current];
  if (typeof window !== "undefined") {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function deleteStoredDocument(id: string): Document[] {
  const current = getStoredDocuments();
  const updated = current.filter((d) => d.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}
