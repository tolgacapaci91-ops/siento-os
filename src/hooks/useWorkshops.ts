"use client";

import { useState, useEffect, useCallback } from "react";
import { Workshop } from "@/types/database";
import { workshopRepository } from "@/repositories";

export function useWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

  const loadWorkshops = useCallback(async () => {
    setIsLoading(true);
    const data = await workshopRepository.getAll();
    setWorkshops(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadWorkshops();
  }, [loadWorkshops]);

  const toggleFavorite = (id: string) => {
    setWorkshops((prev) => {
      const newItems = prev.map((item) =>
        item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
      );
      
      const favoriteIds = newItems.filter(d => d.is_favorite).map(d => d.id);
      localStorage.setItem("siento_fav_workshops", JSON.stringify(favoriteIds));
      
      return newItems;
    });
  };

  useEffect(() => {
    if (workshops.length > 0) {
      const savedFavs = localStorage.getItem("siento_fav_workshops");
      if (savedFavs) {
        try {
          const favoriteIds = JSON.parse(savedFavs);
          setWorkshops(prev => prev.map(item => ({
            ...item,
            is_favorite: favoriteIds.includes(item.id) || item.is_favorite
          })));
        } catch (e) {}
      }
    }
  }, [workshops.length > 0]);

  const filteredWorkshops = workshops.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tümü" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    workshops: filteredWorkshops,
    allWorkshops: workshops,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite,
    reloadWorkshops: loadWorkshops,
  };
}
