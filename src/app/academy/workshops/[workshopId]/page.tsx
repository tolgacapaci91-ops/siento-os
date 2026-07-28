"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Terminal, Play, Download, Copy, CheckCircle2,
  Clock, FileArchive, Layers, Info, XCircle, Maximize, Minimize
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { workshopRepository } from "@/repositories";
import { Workshop } from "@/types/database";

// Import Syntax Highlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Import Sandpack
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";

export default function WorkshopDetailPage() {
  const { workshopId } = useParams();
  const router = useRouter();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const data = await workshopRepository.getById(workshopId as string);
        setWorkshop(data);
      } catch (err) {
        console.error("Failed to load workshop", err);
      } finally {
        setLoading(false);
      }
    };
    if (workshopId) fetchWorkshop();
  }, [workshopId]);

  const handleCopyCode = async () => {
    if (!workshop?.code_content) return;
    try {
      await navigator.clipboard.writeText(workshop.code_content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">Laboratuvar ortamı yükleniyor...</p>
      </div>
    );
  }

  if (!workshop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Terminal className="w-16 h-16 text-slate-700" />
        <h2 className="text-xl font-bold text-slate-300">Laboratuvar bulunamadı.</h2>
        <Button variant="outline" onClick={() => router.push("/academy/workshops")}>
          Geri Dön
        </Button>
      </div>
    );
  }

  const hasFiles = workshop.file_attachments && workshop.file_attachments.length > 0;

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="text-slate-400 hover:text-slate-100"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Laboratuvarlara Dön
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="success">
            {workshop.category}
          </Badge>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500">
            {workshop.difficulty || "Orta"} Seviye
          </Badge>
        </div>
      </div>

      {/* Hero Section (Only show if there is NO code to execute directly) */}
      {!workshop.code_content && (
        <Card className="p-8 border-slate-800 bg-slate-900/40 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Terminal className="w-64 h-64 text-emerald-500" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
              {workshop.title}
            </h1>
            <p className="text-base text-slate-400 max-w-3xl leading-relaxed whitespace-pre-wrap">
              {workshop.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>~{workshop.estimated_hours} Saat</span>
            </div>
            

            {/* File Downloads */}
            {hasFiles && workshop.file_attachments && (
              <a href={workshop.file_attachments[0].url} target="_blank" rel="noreferrer">
                <Button 
                  variant="outline" 
                  className="border-slate-700 hover:bg-slate-800 text-slate-300"
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Dosyaları İndir
                </Button>
              </a>
            )}
          </div>
        </div>
      </Card>
    )}

      {/* Direct Application Execution (No Toggles) */}
      {workshop.code_content ? (
        (() => {
          const isReact = workshop.code_language === 'typescript' || workshop.code_language === 'javascript' || workshop.code_language === 'react';
          const templateName: "react" | "static" = isReact ? "react" : "static";
          const filesConfig: any = isReact ? {
            "/App.js": workshop.code_content,
            "/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SientoOps Lab Runner</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { margin: 0; padding: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif; background-color: #0f111a; color: white; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
          } : {
            "/index.html": workshop.code_content
          };

          const setupConfig = isReact ? {
            dependencies: { "lucide-react": "latest" }
          } : undefined;

          return (
            <div ref={containerRef} className={`rounded-2xl overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-500 bg-[#0f111a] ${isFullscreen ? 'h-screen w-screen rounded-none border-none' : 'h-[900px]'}`}>
              <div className="bg-slate-900/80 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 w-1/3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="w-1/3 flex justify-center">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> LIVE LAB ENVIRONMENT
                  </span>
                </div>
                <div className="w-1/3 flex justify-end">
                  <button 
                    onClick={toggleFullscreen} 
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold"
                    title={isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran Yap"}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    {isFullscreen ? "Küçült" : "Tam Ekran"}
                  </button>
                </div>
              </div>
              
              <SandpackProvider
                template={templateName}
                theme="dark"
                files={filesConfig}
                customSetup={setupConfig}
              >
                <div className="h-full w-full bg-[#0f111a]">
                  <SandpackPreview 
                    showNavigator={false} 
                    showRefreshButton={true} 
                    showOpenInCodeSandbox={false}
                    style={{ height: "100%", minHeight: "800px" }}
                  />
                </div>
              </SandpackProvider>
            </div>
          );
        })()
      ) : null}

      {/* Footer Info Box */}
      {!workshop.code_content && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            Bu laboratuvar ortamı SientoOps tarafından pratik becerilerinizi geliştirmeniz için hazırlanmıştır. Geliştirdiğiniz React uygulamalarını <strong>"Programı Aç"</strong> diyerek anında tarayıcıda derleyebilir ve önizleyebilirsiniz.
          </p>
        </div>
      )}

    </div>
  );
}
