"use client";

import { useState, useEffect, useCallback } from "react";
import { Document } from "@/types/database";
import { documentRepository } from "@/repositories";

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    const data = await documentRepository.getAll();
    setDocuments(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const toggleFavorite = (id: string) => {
    setDocuments((prev) => {
      const newDocs = prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      );
      
      // Save favorite IDs to localStorage
      const favoriteIds = newDocs.filter(d => d.is_favorite).map(d => d.id);
      localStorage.setItem("siento_fav_documents", JSON.stringify(favoriteIds));
      
      return newDocs;
    });
  };

  // Sync with localStorage on load
  useEffect(() => {
    if (documents.length > 0) {
      const savedFavs = localStorage.getItem("siento_fav_documents");
      if (savedFavs) {
        try {
          const favoriteIds = JSON.parse(savedFavs);
          setDocuments(prev => prev.map(doc => ({
            ...doc,
            is_favorite: favoriteIds.includes(doc.id) || doc.is_favorite
          })));
        } catch (e) {}
      }
    }
  }, [documents.length > 0]);

  const filteredDocuments = documents.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tümü" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite,
    reloadDocuments: loadDocuments,
  };
}
