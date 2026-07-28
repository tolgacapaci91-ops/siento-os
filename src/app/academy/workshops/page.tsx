"use client";

import React, { useMemo } from "react";
import { Terminal, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useWorkshops } from "@/hooks/useWorkshops";
import { WorkshopCard } from "@/components/workshops";

export default function WorkshopsPage() {
  const {
    workshops,
    allWorkshops,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite,
  } = useWorkshops();

  // ONLY show categories that actually have workshops attached to them!
  const activeCategories = useMemo(() => {
    const wksCats = Array.from(new Set(allWorkshops.map((w) => w.category))).filter(Boolean);
    if (wksCats.length === 0) return [];
    return ["Tümü", ...wksCats];
  }, [allWorkshops]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-500" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Workshop & Laboratuvarlar
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Uygulamalı pratik senaryolar ve kod repoları.
          </p>
        </div>

        {allWorkshops.length > 0 && (
          <div className="w-full md:w-72">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Workshop ara..."
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        )}
      </div>

      {/* Dynamic Category Chips - Render ONLY if active categories exist */}
      {activeCategories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {activeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Workshop Cards Grid or Empty State */}
      {workshops.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Terminal className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">Henüz workshop bulunmuyor.</h3>
          <p className="text-xs text-slate-500">
            Admin panelinden eklenecek laboratuvarlar burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((wks) => (
            <WorkshopCard
              key={wks.id}
              workshop={wks}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
