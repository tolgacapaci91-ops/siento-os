"use client";

import React, { useState } from "react";
import { Settings, Server, Database, Activity, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [apiUrl, setApiUrl] = useState("https://api.sientoops.com/v1");
  const [dbStatus, setDbStatus] = useState("Connected (PostgreSQL 16)");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Sistem Ayarları
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Laravel 12 API uç noktaları, PostgreSQL veritabanı ve mimari parametreler.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" /> Laravel API Bağlantısı
          </h3>
          <Input
            label="Backend API Base URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" /> PostgreSQL Veritabanı Durumu
          </h3>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Veritabanı Bağlantısı:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {dbStatus}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button variant="primary" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            {saved ? "Ayarlar Kaydedildi!" : "Sistem Ayarlarını Kaydet"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
