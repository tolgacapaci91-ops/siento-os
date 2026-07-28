"use client";

import React, { useState } from "react";
import { Maximize2, Download, FileX } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Document } from "@/types/database";

interface DocumentReaderModalProps {
  document: Document | null;
  onClose: () => void;
  onRead?: (id: string, category?: string) => Promise<any>;
}

export function DocumentReaderModal({ document, onClose, onRead }: DocumentReaderModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isReadCompleted, setIsReadCompleted] = useState(false);

  if (!document) return null;

  const handleRead = async () => {
    if (!onRead || isReadCompleted) return;
    setIsReading(true);
    await onRead(document.id, document.category);
    setIsReadCompleted(true);
    setIsReading(false);
  };

  return (
    <Modal
      isOpen={!!document}
      onClose={() => {
        onClose();
        setIsFullscreen(false);
        setHasError(false);
        setIsReadCompleted(false);
      }}
      title={document.title}
      maxWidth={isFullscreen ? "4xl" : "2xl"}
    >
      <div className="space-y-4">
        {/* PDF Reader Toolbar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
              {document.category}
            </span>
            <span>
              {document.page_count || 1} Sayfa • {document.file_size_mb || 0.1} MB
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isReadCompleted ? "primary" : "outline"}
              size="sm"
              onClick={handleRead}
              disabled={isReading || isReadCompleted}
              className={isReadCompleted ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white" : "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"}
            >
              {isReading ? "İşleniyor..." : isReadCompleted ? "Okundu ✅" : "Okudum"}
            </Button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Tam Ekran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Canvas Container */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
          {!hasError && document.file_url ? (
            <iframe
              src={`${document.file_url}#toolbar=0`}
              className="w-full h-full rounded-lg"
              title={document.title}
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <FileX className="w-12 h-12 text-rose-500 mx-auto" />
              <h4 className="text-base font-bold text-slate-200">PDF Dosyası Açılamadı</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Yüklenen PDF dosyası sunucuda bulunamadı veya geçersiz dosya yolu:{" "}
                <code className="text-amber-400 block mt-1">{document.file_url}</code>
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 font-mono">
            {document.file_url}
          </span>
          <a href={document.file_url} download target="_blank" rel="noreferrer">
            <Button
              variant="primary"
              size="sm"
              className="bg-amber-600 hover:bg-amber-500 border-amber-500/30"
              leftIcon={<Download className="w-4 h-4" />}
            >
              İndir ({document.file_size_mb || 0.1} MB)
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}
