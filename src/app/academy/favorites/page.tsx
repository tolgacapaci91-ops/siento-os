"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, BookOpen, Terminal, Clock, Star, Play } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { useCourses } from "@/hooks/useCourses";
import { useWorkshops } from "@/hooks/useWorkshops";
import { DocumentCard, DocumentReaderModal } from "@/components/documents";
import { WorkshopCard } from "@/components/workshops";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Document } from "@/types/database";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";
import { BadgeCelebrationModal } from "@/components/ui/BadgeCelebrationModal";
import { useAuth } from "@/contexts/AuthContext";

export default function FavoritesPage() {
  const { documents, toggleFavorite: toggleFavDoc } = useDocuments();
  const { courses, toggleFavorite: toggleFavCourse } = useCourses();
  const { workshops, toggleFavorite: toggleFavWorkshop } = useWorkshops();
  
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  
  const { user } = useAuth();
  const { readDocument, celebrationBadge, closeCelebrationModal } = useAchievementEngine(user?.id);

  const favoriteDocuments = useMemo(() => documents.filter((doc) => doc.is_favorite), [documents]);
  const favoriteCourses = useMemo(() => courses.filter((c) => c.is_favorite), [courses]);
  const favoriteWorkshops = useMemo(() => workshops.filter((w) => w.is_favorite), [workshops]);

  const totalFavorites = favoriteDocuments.length + favoriteCourses.length + favoriteWorkshops.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Favorilerim
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Kaydettiğiniz tüm eğitim, workshop ve dokümanlara buradan hızlıca ulaşabilirsiniz. Toplam {totalFavorites} içerik.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {/* COURSES SECTION */}
        {favoriteCourses.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Favori Eğitimler</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-500">
                {favoriteCourses.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteCourses.map((crs) => (
                <Card key={crs.id} hoverable className="flex flex-col justify-between p-4 group">
                  <div>
                    <div className="relative h-48 w-full rounded-xl overflow-hidden mb-4 bg-slate-800 flex items-center justify-center">
                      {crs.cover_image ? (
                        <Image src={crs.cover_image} alt={crs.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <BookOpen className="w-12 h-12 text-slate-600" />
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="primary">{crs.category}</Badge>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); toggleFavCourse(crs.id); }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 hover:bg-slate-900/60 transition-colors z-10"
                      >
                        <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">{crs.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">{crs.description}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80 space-y-3">
                    <Link href={`/courses/${crs.id}`} className="block">
                      <Button variant="primary" className="w-full" leftIcon={<Play className="w-4 h-4 fill-current" />}>Eğitime Başla</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* WORKSHOPS SECTION */}
        {favoriteWorkshops.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Favori Workshoplar</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-500">
                {favoriteWorkshops.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteWorkshops.map((wks) => (
                <WorkshopCard key={wks.id} workshop={wks} onToggleFavorite={toggleFavWorkshop} />
              ))}
            </div>
          </section>
        )}

        {/* DOCUMENTS SECTION */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Favori Dokümanlar</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-500">
              {favoriteDocuments.length}
            </span>
          </div>

          {favoriteDocuments.length === 0 ? (
            <div className="p-8 text-center bg-slate-100 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              <p className="text-sm text-slate-500">Henüz favorilerinize eklediğiniz bir doküman bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} onToggleFavorite={toggleFavDoc} onRead={setSelectedDoc} />
              ))}
            </div>
          )}
        </section>

        {totalFavorites === 0 && favoriteDocuments.length === 0 && (
           <div className="p-8 text-center bg-slate-100 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
             <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
             <p className="text-sm text-slate-500">Listeniz tamamen boş. Herhangi bir eğitim, workshop veya doküman favorilerinize eklenmemiş.</p>
           </div>
        )}
      </div>

      <DocumentReaderModal document={selectedDoc} onClose={() => setSelectedDoc(null)} onRead={readDocument} />
      <BadgeCelebrationModal badge={celebrationBadge} onClose={closeCelebrationModal} />
    </div>
  );
}
