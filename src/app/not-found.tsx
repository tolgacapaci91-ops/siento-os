import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center space-y-4 border border-rose-500/30">
        <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 w-fit mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">404</h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Sayfa Bulunamadı</h2>
        <p className="text-xs text-slate-500">
          Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak erişilemiyor olabilir.
        </p>
        <div className="pt-2">
          <Link href="/dashboard">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Dashboard&apos;a Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
