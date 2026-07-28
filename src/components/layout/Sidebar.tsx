"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Terminal,
  BookOpen,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  Heart,
  Award,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Workshop", href: "/workshops", icon: Terminal },
    { label: "Eğitimler", href: "/courses", icon: BookOpen },
    { label: "PDF Dokümanları", href: "/documents", icon: FileText },
    { label: "Faydalı Siteler", href: "/useful-sites", icon: Globe },
  ];

  const personalNavItems = [
    { label: "Favorilerim", href: "/favorites", icon: Heart },
    { label: "Rozetlerim", href: "/profile?tab=badges", icon: Award },
    { label: "Sertifikalarım", href: "/certificates", icon: ShieldCheck },
  ];

  const isAdmin = user?.role === "admin";

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 h-screen glass-sidebar transition-all duration-300 flex flex-col justify-between p-4",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div>
        {/* Logo Header */}
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-200/60 dark:border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                  SientoOps
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Academy
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-4 border-t border-slate-200/60 dark:border-slate-800/80" />

        {/* Personal Navigation Items */}
        <nav className="space-y-1.5">
          {personalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500")} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
