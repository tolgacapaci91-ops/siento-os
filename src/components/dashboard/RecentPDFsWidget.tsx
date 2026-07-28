"use client";

import React from "react";
import Link from "next/link";
import { FileText, Download, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useDocuments } from "@/hooks/useDocuments";

export function RecentPDFsWidget() {
  const { documents } = useDocuments();

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <FileText className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            PDF Dokümanları
          </h4>
        </div>
        <Link
          href="/documents"
          className="text-xs text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
        >
          <span>Tümünü Gör</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/60">
          Henüz yüklenmiş doküman bulunmuyor.
        </div>
      ) : (
        <div className="space-y-2.5">
          {documents.slice(0, 2).map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {doc.title}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="warning" size="sm">
                      {doc.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400">
                      {doc.page_count} Sayfa • {doc.file_size_mb} MB
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/documents">
                <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
