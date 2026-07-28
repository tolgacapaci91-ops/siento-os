"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { Card } from "@/components/ui/Card";
import { TrendingUp, Calendar } from "lucide-react";

const ACTIVITY_DATA = [
  { day: "Pzt", minutes: 45 },
  { day: "Sal", minutes: 90 },
  { day: "Çar", minutes: 60 },
  { day: "Per", minutes: 120 },
  { day: "Cum", minutes: 80 },
  { day: "Cmt", minutes: 150 },
  { day: "Paz", minutes: 110 },
];

export function WeeklyActivityWidget() {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Haftalık Öğrenme İlerlemesi
            </h4>
            <p className="text-xs text-slate-500">Son 7 günde toplam 655 dakika çalışma</p>
          </div>
        </div>
        <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> Bu Hafta
        </span>
      </div>

      <div className="w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ACTIVITY_DATA}>
            <defs>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: "rgba(99, 102, 241, 0.3)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorMinutes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
