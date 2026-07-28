"use client";

import React from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export function ProfilePreferencesTab() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Görünüm Teması
          </h4>
          <p className="text-xs text-slate-500">Koyu veya açık görünüm modunu ayarlayın.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          leftIcon={theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        >
          {theme === "dark" ? "Koyu Mod" : "Açık Mod"}
        </Button>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button variant="danger" onClick={logout} leftIcon={<LogOut className="w-4 h-4" />}>
          Oturumu Kapat
        </Button>
      </div>
    </div>
  );
}
