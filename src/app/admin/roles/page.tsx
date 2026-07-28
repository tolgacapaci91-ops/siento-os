"use client";

import React from "react";
import { Key, Check, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const PERMISSIONS = [
  { id: "p1", name: "Eğitimleri Görüntüleme", student: true, instructor: true, admin: true },
  { id: "p2", name: "Ders İçeriklerini İzleme", student: true, instructor: true, admin: true },
  { id: "p3", name: "PDF İndirme", student: true, instructor: true, admin: true },
  { id: "p4", name: "Eğitim Oluşturma & Düzenleme", student: false, instructor: true, admin: true },
  { id: "p5", name: "Kullanıcı Yönetimi & Silme", student: false, instructor: false, admin: true },
  { id: "p6", name: "Sistem Audit Loglarını İnceleme", student: false, instructor: false, admin: true },
  { id: "p7", name: "Laravel API Yapılandırması", student: false, instructor: false, admin: true },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Key className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Rol & İzin Yönetimi (RBAC)
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Role-Based Access Control matrisi ile platform izinlerini yapılandırın.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 space-y-2 border-indigo-500/30">
          <Badge variant="primary">Öğrenci (Student)</Badge>
          <p className="text-xs text-slate-400">
            Eğitim kataloğuna erişim, videoları izleme ve PDF materyallerini indirme yetkisi.
          </p>
        </Card>
        <Card className="p-4 space-y-2 border-emerald-500/30">
          <Badge variant="success">Eğitmen (Instructor)</Badge>
          <p className="text-xs text-slate-400">
            Kendi eğitimlerini ve workshop materyallerini ekleme, müfredat güncelleme yetkisi.
          </p>
        </Card>
        <Card className="p-4 space-y-2 border-amber-500/30">
          <Badge variant="warning">Yönetici (Admin)</Badge>
          <p className="text-xs text-slate-400">
            Platform genelindeki tüm yetkiler, kullanıcı ve rol yönetimi, audit logları.
          </p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">İzin Tanımı</th>
                <th className="py-3 px-4 text-center">Student</th>
                <th className="py-3 px-4 text-center">Instructor</th>
                <th className="py-3 px-4 text-center">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80 text-xs">
              {PERMISSIONS.map((p) => (
                <tr key={p.id} className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{p.name}</td>
                  <td className="py-3.5 px-4 text-center">
                    {p.student ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-rose-500/50 inline" />}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {p.instructor ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-rose-500/50 inline" />}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {p.admin ? <Check className="w-4 h-4 text-emerald-400 inline" /> : <X className="w-4 h-4 text-rose-500/50 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
