"use client";

import React from "react";
import Link from "next/link";
import { Layers, PlaySquare, Camera, MessageSquare, Briefcase } from "lucide-react";

export function MarketingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                SientoOps
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-6">
              Modern bulut mimarisi ve full stack geliştirici eğitim platformu. Sıfırdan profesyonelliğe uzanan yolculuğunuzda yanınızdayız.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <PlaySquare className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Group 1 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Özellikler</Link></li>
              <li><Link href="#education" className="text-sm text-slate-400 hover:text-white transition-colors">Eğitimler</Link></li>
              <li><Link href="#workshops" className="text-sm text-slate-400 hover:text-white transition-colors">Workshoplar</Link></li>
              <li><Link href="#pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Fiyatlandırma</Link></li>
            </ul>
          </div>

          {/* Links Group 2 */}
          <div>
            <h4 className="text-white font-semibold mb-6">Kurumsal</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">Hakkımızda</Link></li>
              <li><Link href="/blog" className="text-sm text-slate-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">İletişim</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} SientoOps Platform. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-500">Sistem Durumu: <span className="text-emerald-500 font-semibold">Tüm Sistemler Aktif</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
