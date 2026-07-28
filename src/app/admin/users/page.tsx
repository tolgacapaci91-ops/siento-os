"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Plus, Mail, Calendar, Edit3, Trash2, Key, CheckCircle, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { User, RoleSlug } from "@/types/database";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add User Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<RoleSlug>("student");
  const [newPassword, setNewPassword] = useState("Siento2026!");

  // Edit User Form state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<RoleSlug>("student");
  const [editStatus, setEditStatus] = useState<"active" | "suspended" | "pending">("active");
  const [editPassword, setEditPassword] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/users", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      const res = await fetch("/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          role: newRole,
          password: newPassword || "123456",
          status: "active",
        }),
      });

      if (res.ok) {
        setNewName("");
        setNewEmail("");
        setNewPassword("Siento2026!");
        setIsAddModalOpen(false);
        await fetchUsers();
      } else {
        try {
          const errJson = await res.json();
          alert(errJson.error || "Kullanıcı eklenemedi");
        } catch {
          alert("Kullanıcı eklenirken sunucu hatası oluştu.");
        }
      }
    } catch (err) {
      console.error("User add error", err);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditPassword(user.password || "");
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName || !editEmail) return;

    try {
      const res = await fetch(`/api/v1/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          status: editStatus,
          password: editPassword,
        }),
      });

      if (res.ok) {
        setEditingUser(null);
        await fetchUsers();
      }
    } catch (err) {
      console.error("User update error", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/v1/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("User delete error", err);
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "20 Temmuz 2026";
    if (isoStr.includes("Temmuz") || isoStr.includes("Bugün")) return isoStr;
    try {
      return new Date(isoStr).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Kullanıcı Yönetimi
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Platformdaki öğrenci, eğitmen ve yönetici hesaplarını oluşturun ve yetkilerini yönetin.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Yeni Kullanıcı Ekle
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim veya e-posta ile ara..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Toplam Kullanıcı: <span className="font-bold text-slate-200">{filteredUsers.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Kullanıcı</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Durum</th>
                <th className="py-3 px-4">İlk Şifre</th>
                <th className="py-3 px-4">Kayıt Tarihi</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/80 text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{u.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === "admin" ? "warning" : u.role === "instructor" ? "secondary" : "primary"}>
                      {u.role.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${u.status === "active" ? "text-emerald-400" : "text-rose-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                      {u.status === "active" ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-amber-400 flex items-center gap-1 w-fit">
                      <Key className="w-3 h-3" /> {u.password || "••••••••"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" /> {formatDate(u.created_at)}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-400"
                        title="Kullanıcıyı Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400"
                        title="Kullanıcıyı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD USER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni Kullanıcı Oluştur"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Ad Soyad *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Örn: Caner Yılmaz"
            required
          />

          <Input
            type="email"
            label="E-Posta Adresi *"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Örn: caner@sientoops.com"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rol *</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as RoleSlug)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="student">Öğrenci (STUDENT)</option>
              <option value="instructor">Eğitmen (INSTRUCTOR)</option>
              <option value="admin">Yönetici (ADMIN)</option>
            </select>
          </div>

          <Input
            label="İlk Kullanacağı Şifre *"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Örn: Siento2026!"
            leftIcon={<Key className="w-4 h-4 text-amber-400" />}
            required
          />

          <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            💡 <strong>Not:</strong> Belirlediğiniz ilk şifre ile kullanıcı sisteme giriş yapabilir, daha sonra profil ayarlarından kendi şifresini değiştirebilir.
          </p>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Kullanıcı Oluştur
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Kullanıcı Bilgilerini Düzenle"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <Input
            label="Ad Soyad *"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <Input
            type="email"
            label="E-Posta Adresi *"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Rol *</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as RoleSlug)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="student">Öğrenci (STUDENT)</option>
                <option value="instructor">Eğitmen (INSTRUCTOR)</option>
                <option value="admin">Yönetici (ADMIN)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hesap Durumu *</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="active">Aktif (Active)</option>
                <option value="suspended">Pasif / Asıya Alındı</option>
              </select>
            </div>
          </div>

          <Input
            label="Şifreyi Güncelle (İsteğe Bağlı)"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            placeholder="Şifreyi sıfırlamak için yazın..."
            leftIcon={<Key className="w-4 h-4 text-amber-400" />}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditingUser(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Değişiklikleri Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
