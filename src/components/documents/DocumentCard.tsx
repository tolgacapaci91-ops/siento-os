"use client";

import React from "react";
import { FileText, Heart, Eye, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Document } from "@/types/database";

interface DocumentCardProps {
  document: Document;
  onToggleFavorite: (id: string) => void;
  onRead: (doc: Document) => void;
}

export const DocumentCard = React.memo(function DocumentCard({
  document,
  onToggleFavorite,
  onRead,
}: DocumentCardProps) {
  return (
    <Card hoverable className="flex flex-col justify-between p-5 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleFavorite(document.id)}
              className={`p-2 rounded-full border transition-colors ${
                document.is_favorite
                  ? "bg-rose-500 text-white border-rose-500"
                  : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${document.is_favorite ? "fill-current" : ""}`} />
            </button>
            <Badge variant="warning">{document.category}</Badge>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-400 transition-colors">
          {document.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
          {document.description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          {document.page_count} Sayfa • {document.file_size_mb} MB
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRead(document)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Oku
          </Button>
          <a href={document.file_url} download target="_blank" rel="noreferrer">
            <Button
              variant="primary"
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 border-amber-500/30 shadow-amber-500/20"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              İndir
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
});
