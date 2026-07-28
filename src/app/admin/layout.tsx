"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Key,
  BookOpen,
  Terminal,
  FileText,
  Award,
  BarChart3,
  Settings,
  FolderTree,
  ArrowLeft,
  Globe,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navDashboard = { label: "Dashboard", href: "/dashboard", icon: BarChart3 };

  const contentGroup = [
    { label: "Eğitimler", href: "/admin/courses", icon: BookOpen },
    { label: "Dokümanlar (PDF)", href: "/admin/documents", icon: FileText },
    { label: "Workshoplar", href: "/admin/workshops", icon: Terminal },
    { label: "Kategoriler", href: "/admin/categories", icon: FolderTree },
    { label: "Faydalı Siteler", href: "/admin/useful-sites", icon: Globe },
  ];

  const platformGroup = [
    { label: "Kullanıcı Yönetimi", href: "/admin/users", icon: Users },
    { label: "Rol & İzinler", href: "/admin/roles", icon: ShieldCheck },
    { label: "Rozet Yönetimi", href: "/admin/badges", icon: Award },
    { label: "Ayarlar", href: "/admin/settings", icon: Settings },
    { label: "Bildirim Gönder", href: "/admin/notifications", icon: Bell },
  ];

  const academyHostUrl = "/academy/dashboard";

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Admin Sidebar */}
      <aside className="w-64 glass-sidebar p-4 sticky top-0 h-screen flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-amber-500/20">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-slate-100">Admin Panel</h2>
              <span className="text-[10px] text-amber-500 font-semibold uppercase">SientoOps System</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-4">
            {/* Dashboard Link */}
            <Link
              href={navDashboard.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                pathname === navDashboard.href
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{navDashboard.label}</span>
            </Link>

            {/* Content Management Group */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                İçerik Yönetimi
              </div>
              {contentGroup.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      isActive
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Platform Management Group */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Platform & Sistem
              </div>
              {platformGroup.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      isActive
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <a
            href={academyHostUrl}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kullanıcı Paneline Dön</span>
          </a>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">{children}</main>
    </div>
  );
}
