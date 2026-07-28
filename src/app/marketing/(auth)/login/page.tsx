"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, Mail, Lock, LogIn } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("tolga@sientoops.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      const isProduction = typeof window !== "undefined" && window.location.hostname.includes("sientoops.com");
      
      if (email.includes("admin")) {
        window.location.href = isProduction
          ? "https://admin.sientoops.com/dashboard"
          : "http://admin.localhost:3000/dashboard";
      } else {
        window.location.href = isProduction
          ? "https://academy.sientoops.com/dashboard"
          : "http://academy.localhost:3000/dashboard";
      }
    }
  };

  return (
    <Card className="p-8 space-y-6 shadow-2xl border-indigo-500/30">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          SientoOps Platform & Academy
        </h1>
        <p className="text-xs text-slate-500">
          Giriş yapın ve hesabınıza erişin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          label="E-Posta Adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />
        <Input
          type="password"
          label="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
            <input type="checkbox" className="rounded border-slate-700 bg-slate-900 text-indigo-500" defaultChecked />
            <span>Beni Hatırla</span>
          </label>
          <Link href="/forgot-password" className="text-indigo-500 hover:underline">
            Şifremi Unuttum?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<LogIn className="w-4 h-4" />}
        >
          Giriş Yap
        </Button>
      </form>
    </Card>
  );
}
