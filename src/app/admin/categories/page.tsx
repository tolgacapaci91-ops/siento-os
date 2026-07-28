"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, Search, Trash2, Edit3, Tag, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { categoryRepository, CategoryItem } from "@/repositories";

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  
  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");

  // Edit Modal State
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [editName, setEditName] = useState("");

  const refreshCategories = async () => {
    const list = await categoryRepository.getAll();
    setCategories(list);
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await categoryRepository.create(name.trim());
    setName("");
    setIsAddModalOpen(false);
    await refreshCategories();
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setEditName(cat.name);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;
    await categoryRepository.update(editingCategory.id, editName.trim());
    setEditingCategory(null);
    await refreshCategories();
  };

  const handleDelete = async (id: string) => {
    await categoryRepository.delete(id);
    await refreshCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Kategori Yönetimi (Ortak Kütüphane)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hem Video Eğitimleri hem de PDF Dokümanları için geçerli ortak kategorileri yönetin.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Yeni Kategori Oluştur
        </Button>
      </div>

      <div className="w-full md:w-80">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kategori adı ile ara..."
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <Card key={cat.id} className="p-5 flex items-center justify-between space-x-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{cat.name}</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Slug: /{cat.slug}</p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
                <span className="text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Ortak Kategori (Aktif)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditModal(cat)}
                className="p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-500 hover:text-indigo-400 transition-colors"
                title="Kategoriyi Düzenle"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                title="Kategoriyi Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni Ortak Kategori Ekle"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            label="Kategori Adı *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: React Native, Flutter, Kubernetes..."
            required
          />
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Kategoriyi Oluştur
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT CATEGORY MODAL */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        title="Ortak Kategoriyi Düzenle"
      >
        <form onSubmit={handleUpdateCategory} className="space-y-4">
          <Input
            label="Kategori Adı *"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Örn: YouTube Kanalı, Mobil Geliştirme..."
            required
          />
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditingCategory(null)}>
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
