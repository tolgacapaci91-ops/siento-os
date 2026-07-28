"use client";

import React, { useState, useMemo } from "react";
import { FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { useDocuments } from "@/hooks/useDocuments";
import { Document } from "@/types/database";
import { DocumentCard, DocumentReaderModal } from "@/components/documents";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";
import { BadgeCelebrationModal } from "@/components/ui/BadgeCelebrationModal";
import { useAuth } from "@/contexts/AuthContext";

export default function DocumentsPage() {
  const {
    documents,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    toggleFavorite,
  } = useDocuments();

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const { user } = useAuth();
  const { readDocument, celebrationBadge, closeCelebrationModal } = useAchievementEngine(user?.id);

  // ONLY show categories that actually have documents attached to them!
  const activeCategories = useMemo(() => {
    const docCats = Array.from(new Set(documents.map((d) => d.category))).filter(Boolean);
    if (docCats.length === 0) return [];
    return ["Tümü", ...docCats];
  }, [documents]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              PDF Dokümanları & Kılavuzlar
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Rehberler ve çalışma dokümanları.
          </p>
        </div>

        {documents.length > 0 && (
          <div className="w-full md:w-72">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Dokümanlarda ara..."
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
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Document Grid or Empty State */}
      {documents.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">Henüz doküman bulunmuyor.</h3>
          <p className="text-xs text-slate-500">
            Admin panelinden yüklenecek PDF rehberleri burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onToggleFavorite={toggleFavorite}
              onRead={setSelectedDoc}
            />
          ))}
        </div>
      )}

      {/* PDF Viewer Reader Modal */}
      <DocumentReaderModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onRead={readDocument}
      />

      <BadgeCelebrationModal
        badge={celebrationBadge}
        onClose={closeCelebrationModal}
      />
    </div>
  );
}
