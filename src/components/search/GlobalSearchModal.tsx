"use client";

import React from "react";
import Link from "next/link";
import { Search, BookOpen, Terminal, FileText, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useSearch } from "@/hooks/useSearch";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const { query, setQuery, results } = useSearch();

  const getIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case "workshop":
        return <Terminal className="w-4 h-4 text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="flex flex-col gap-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kurslar, Workshop'lar, PDF'ler veya Ayarlar içinde ara... (Cmd+K)"
            className="w-full h-12 pl-11 pr-4 bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="min-h-[220px] max-h-[360px] overflow-y-auto space-y-2">
          {query.trim().length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center gap-2">
              <Search className="w-8 h-8 opacity-30" />
              <span>Aramak istediğiniz terimi yazın. Hızlı erişim için <b>Cmd+K</b> tuşlarını kullanabilirsiniz.</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              &quot;{query}&quot; ile eşleşen sonuç bulunamadı.
            </div>
          ) : (
            results.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-indigo-500/20 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800/80">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-500">{item.subtitle}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </Link>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
