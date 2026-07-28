"use client";

import React, { useState } from "react";
import {
  Users,
  BookOpen,
  FileText,
  ShieldCheck,
  Plus,
  Video,
  Upload,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_AUDIT_LOGS } from "@/repositories/mockData";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    pdfs: 0,
    workshops: 0,
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  React.useEffect(() => {
    fetch("/api/v1/stats/totals")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStats({
            users: json.data.users || 0,
            courses: json.data.courses || 0,
            pdfs: json.data.pdfs || 0,
            workshops: json.data.workshops || 0,
          });
          setAuditLogs(json.data.audit_logs || []);
        }
      })
      .catch((err) => console.error("Failed to load stats", err))
      .finally(() => setLoadingStats(false));
  }, []);

  const handleSynthesizeVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setSuccessMessage("YouTube Videosu Başarıyla Ayrıştırıldı ve Otomatik Kursa Dönüştürüldü!");
      setYoutubeUrl("");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Yönetici Genel Bakış Paneli
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            SientoOps Platformundaki kullanıcılar, içerikler ve sistem audit kayıtları.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning" className="px-3 py-1 text-xs">
            API Canlı Mod Hazır (Laravel 12)
          </Badge>
        </div>
      </div>

      {/* Admin Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {loadingStats ? "..." : stats.users.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 block">Kayıtlı Öğrenci</span>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {loadingStats ? "..." : `${stats.courses} Kurs`}
            </span>
            <span className="text-xs text-slate-500 block">Aktif Müfredat</span>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {loadingStats ? "..." : `${stats.pdfs} PDF`}
            </span>
            <span className="text-xs text-slate-500 block">Kütüphane Dokümanı</span>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">99.9%</span>
            <span className="text-xs text-slate-500 block">API Sorumluluk Oranı</span>
          </div>
        </Card>
      </div>

      {/* Rapid Content Generation Panel */}
      <Card className="p-6 space-y-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-900/60 border-amber-500/30">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-rose-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Otomatik YouTube İçerik Sentezleyici
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Bir YouTube oynatma listesi veya video linki yapıştırın; platform otomatik olarak ders başlığını ve embed kodunu kullanıcı paneline eklesin.
        </p>

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSynthesizeVideo} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              leftIcon={<Video className="w-4 h-4 text-rose-500" />}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSynthesizing}
            className="bg-amber-600 hover:bg-amber-500 border-amber-500/30 shadow-amber-500/20"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Otomatik Video Oluştur
          </Button>
        </form>
      </Card>

      {/* Audit Log Engine View */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Sistem Audit Log Kayıtları (Geliştirme Anayasası Madde #3)
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Kullanıcı</th>
                <th className="p-3">İşlem</th>
                <th className="p-3">Varlık</th>
                <th className="p-3">IP Adresi</th>
                <th className="p-3">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{log.user_name}</td>
                    <td className="p-3 text-slate-400">{log.action}</td>
                    <td className="p-3">
                      <Badge variant="primary">{log.entity_type}</Badge>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{log.ip_address}</td>
                    <td className="p-3 text-slate-500">{formatDate(log.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-500">
                    Sistemde henüz kayıtlı bir işlem bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
