"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Sun, Moon, LogOut, Settings, Shield, Award, Bot, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import { AIAssistantDrawer } from "@/components/ai/AIAssistantDrawer";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-navbar h-16 px-4 md:px-6 flex items-center justify-between">
        {/* Left Search Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs md:text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-all w-48 md:w-72"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left truncate">Arama yapın...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 rounded border border-slate-300 dark:border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAIOpen(!isAIOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors text-xs font-medium"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Siento AI</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Temayı Değiştir"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Bildirimler"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.name}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[110px]">
                  {user?.email}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline-block" />
            </button>

            {/* Profile Dropdown Content */}
            {isProfileMenuOpen && (
              <div
                onClick={() => setIsProfileMenuOpen(false)}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 text-xs space-y-1"
              >
                <div className="px-3 py-2 border-b border-slate-200/60 dark:border-slate-800/80">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Profil & Ayarlar</span>
                </Link>
                <Link
                  href="/profile?tab=security"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Şifre & Güvenlik</span>
                </Link>
                <Link
                  href="/profile?tab=badges"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Rozetlerim</span>
                </Link>
                <Link
                  href="/favorites"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-rose-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  <span>Favorilerim</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Oturumu Kapat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <AIAssistantDrawer isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
}
