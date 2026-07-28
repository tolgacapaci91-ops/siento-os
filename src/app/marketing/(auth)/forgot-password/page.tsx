"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <Card className="p-8 space-y-6 shadow-2xl border-indigo-500/30">
      <div className="flex flex-col items-center text-center space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Şifremi Unuttum
        </h1>
        <p className="text-xs text-slate-500">
          E-posta adresinizi girin, sıfırlama bağlantısını gönderelim.
        </p>
      </div>

      {isSent ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center space-y-2">
          <p className="font-semibold">Sıfırlama Bağlantısı Gönderildi!</p>
          <p className="text-slate-400">{email} adresine e-posta gönderdik.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="E-Posta Adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
          <Button type="submit" variant="primary" className="w-full" leftIcon={<Send className="w-4 h-4" />}>
            Bağlantı Gönder
          </Button>
        </form>
      )}

      <div className="text-center pt-2">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
          <ArrowLeft className="w-3.5 h-3.5" /> Giriş Ekranına Dön
        </Link>
      </div>
    </Card>
  );
}
