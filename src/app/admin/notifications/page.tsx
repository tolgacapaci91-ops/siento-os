"use client";

import React, { useState } from "react";
import { Send, Bell, Loader2, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning" | "system">("info");
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMsg("");

    try {
      const res = await fetch("/api/v1/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, type }),
      });

      if (res.ok) {
        setStatusMsg("Bildirim başarıyla tüm kullanıcılara gönderildi.");
        setTitle("");
        setMessage("");
        setType("info");
        setTimeout(() => setStatusMsg(""), 3000);
      } else {
        setStatusMsg("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Gönderim hatası.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Bildirim Merkezi
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Buradan sistemdeki tüm öğrencilere anlık bildirim ve duyurular gönderebilirsiniz.
          </p>
        </div>
      </div>

      <Card className="p-6">
        {statusMsg && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Bildirim Türü
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { id: "info", icon: Info, label: "Bilgi", color: "text-blue-500" },
                { id: "success", icon: CheckCircle2, label: "Başarılı", color: "text-emerald-500" },
                { id: "warning", icon: AlertTriangle, label: "Uyarı", color: "text-amber-500" },
                { id: "system", icon: Bell, label: "Sistem", color: "text-indigo-500" },
              ].map((t) => (
                <label
                  key={t.id}
                  className={`
                    flex flex-col items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                    ${type === t.id 
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 ring-1 ring-indigo-500" 
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}
                  `}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t.id}
                    checked={type === t.id}
                    onChange={(e) => setType(e.target.value as any)}
                    className="sr-only"
                  />
                  <t.icon className={`w-6 h-6 ${t.color}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Bildirim Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all dark:text-white"
              placeholder="Örn: Hafta Sonu Bakım Çalışması veya Yeni Kurs Yayında!"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Bildirim Mesajı / İçeriği
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none dark:text-white"
              placeholder="Kullanıcılara iletmek istediğiniz detaylı metin..."
              required
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Tüm Öğrencilere Gönder
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
