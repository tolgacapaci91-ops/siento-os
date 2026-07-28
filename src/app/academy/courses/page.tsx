"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Search, Star, Clock, Play, Heart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCourses } from "@/hooks/useCourses";

export default function CoursesPage() {
  const {
    courses,
    allCourses,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite,
  } = useCourses();

  // ONLY show categories that actually have courses attached to them!
  const activeCategories = useMemo(() => {
    const courseCats = Array.from(new Set(allCourses.map((c) => c.category))).filter(Boolean);
    if (courseCats.length === 0) return [];
    return ["Tümü", ...courseCats];
  }, [allCourses]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Eğitimler & Kurslar
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Admin paneli üzerinden yayınlanan video eğitimler ve müfredatlar.
          </p>
        </div>

        {allCourses.length > 0 && (
          <div className="w-full md:w-72">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kurslarda ara..."
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
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Course Cards Grid or Empty State */}
      {courses.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">Henüz eğitim bulunmuyor.</h3>
          <p className="text-xs text-slate-500">
            Admin panelinden oluşturulacak yeni eğitimler burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((crs) => (
            <Card key={crs.id} hoverable className="flex flex-col justify-between p-4 group">
              <div>
                <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-slate-800 flex items-center justify-center">
                  {crs.cover_image ? (
                    <Image
                      src={crs.cover_image}
                      alt={crs.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <BookOpen className="w-12 h-12 text-slate-600" />
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="primary">{crs.category}</Badge>
                    <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white border-white/20">
                      {crs.version_tag || "v1.0"}
                    </Badge>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(crs.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-900/60 transition-colors z-10"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        crs.is_favorite ? "fill-rose-500 text-rose-500" : "text-white"
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">
                  {crs.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {crs.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {crs.duration_minutes || 45} dk • {crs.lessons_count || 1} Ders
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {crs.rating || 5.0}
                  </span>
                </div>

                <Link href={`/courses/${crs.id}`} className="block">
                  <Button variant="primary" className="w-full" leftIcon={<Play className="w-4 h-4 fill-current" />}>
                    Eğitime Başla
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
