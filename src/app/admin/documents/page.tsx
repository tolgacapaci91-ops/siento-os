"use client";

import React, { useState, useEffect } from "react";
import { FileText, Plus, Search, Trash2, Edit3, UploadCloud, Download, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Document } from "@/types/database";
import { documentRepository, categoryRepository, CategoryItem } from "@/repositories";

export default function AdminDocumentsPage() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickCategoryModalOpen, setIsQuickCategoryModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCatName, setNewCatName] = useState("");

  // Add Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Edit Form State
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);

  const refreshData = async () => {
    const [cats, docsList] = await Promise.all([
      categoryRepository.getAll(),
      documentRepository.getAll(),
    ]);
    setCategories(cats);
    if (cats.length > 0 && !category) {
      setCategory(cats[0].name);
    }
    setDocuments(docsList);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedFile) {
      alert("Lütfen başlık ve PDF dosyası seçiniz!");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload real PDF file to /api/v1/upload
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Dosya sunucuya yüklenemedi");
      }

      const uploadJson = await uploadRes.json();
      const { file_url, file_size_mb } = uploadJson.data;

      // Step 2: Create document record with real file_url
      await documentRepository.create({
        title,
        description: `${category} PDF dokümanı`,
        category: category || "Genel",
        file_url: file_url,
        file_size_mb: file_size_mb || parseFloat((selectedFile.size / (1024 * 1024)).toFixed(1)),
        page_count: 15,
        download_count: 0,
        is_favorite: false,
        is_downloadable: true,
        created_at: new Date().toISOString(),
      });

      setTitle("");
      setSelectedFile(null);
      setIsAddModalOpen(false);
      await refreshData();
    } catch (err: any) {
      alert(err.message || "PDF yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const openEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditCategory(doc.category);
    setEditSelectedFile(null);
  };

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc || !editTitle) return;

    setIsUploading(true);
    try {
      let file_url = editingDoc.file_url;
      let file_size_mb = editingDoc.file_size_mb;

      if (editSelectedFile) {
        const formData = new FormData();
        formData.append("file", editSelectedFile);

        const uploadRes = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          file_url = uploadJson.data.file_url;
          file_size_mb = uploadJson.data.file_size_mb;
        }
      }

      await documentRepository.update(editingDoc.id, {
        title: editTitle,
        category: editCategory,
        file_url,
        file_size_mb,
      });

      setEditingDoc(null);
      await refreshData();
    } catch (err: any) {
      alert("Doküman güncellenirken hata oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await categoryRepository.create(newCatName.trim());
    setNewCatName("");
    setIsQuickCategoryModalOpen(false);
    await refreshData();
  };

  const handleDeleteDocument = async (id: string) => {
    await documentRepository.delete(id);
    await refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Doküman Yönetimi (PDF)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kütüphaneye yeni PDF rehberleri ve çalışma dokümanları yükleyin ve düzenleyin.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-500"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          PDF Ekle
        </Button>
      </div>

      {/* Search Bar */}
      <div className="w-full md:w-80">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="PDF dokümanı ile ara..."
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Documents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="warning">{doc.category}</Badge>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(doc)}
                    className="p-1.5 rounded-lg hover:bg-amber-500/20 text-amber-500"
                    title="Düzenle"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{doc.title}</h3>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono line-clamp-1">{doc.file_url}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{doc.page_count} Sayfa • {doc.file_size_mb} MB</span>
              <div className="flex items-center gap-2 text-amber-500 font-bold">
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> {doc.download_count}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ADD PDF MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="PDF Dokümanı Yükle"
      >
        <form onSubmit={handleAddDocument} className="space-y-4">
          <Input
            label="PDF Başlığı *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: PostgreSQL Performance & Sharding Guide"
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Kategori *
              </label>
              <button
                type="button"
                onClick={() => setIsQuickCategoryModalOpen(true)}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Yeni Kategori Oluştur
              </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              PDF Dosyası *
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-900/50">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                required
              />
              <label htmlFor="pdf-upload" className="cursor-pointer space-y-2 block">
                <UploadCloud className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-200">
                  {selectedFile ? (
                    <span className="text-amber-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  ) : (
                    "PDF dosyanızı seçin"
                  )}
                </div>
                <div className="text-[10px] text-slate-500">Geçerli PDF formatı</div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isUploading}
              className="bg-amber-600 hover:bg-amber-500"
            >
              {isUploading ? "Yükleniyor..." : "Yükle ve Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT PDF MODAL */}
      <Modal
        isOpen={!!editingDoc}
        onClose={() => setEditingDoc(null)}
        title="PDF Dokümanını Düzenle"
      >
        <form onSubmit={handleUpdateDocument} className="space-y-4">
          <Input
            label="PDF Başlığı *"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kategori *
            </label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Yeni PDF Dosyası (İsteğe Bağlı Değiştirme)
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-900/50">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="edit-pdf-upload"
                onChange={(e) => setEditSelectedFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="edit-pdf-upload" className="cursor-pointer space-y-1 block">
                <UploadCloud className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-200">
                  {editSelectedFile ? (
                    <span className="text-amber-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> {editSelectedFile.name}
                    </span>
                  ) : (
                    "Mevcut PDF'i değiştirmek için yeni dosya seçin"
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditingDoc(null)}>
              İptal
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={isUploading}
              className="bg-amber-600 hover:bg-amber-500"
            >
              {isUploading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* QUICK CREATE CATEGORY MODAL */}
      <Modal
        isOpen={isQuickCategoryModalOpen}
        onClose={() => setIsQuickCategoryModalOpen(false)}
        title="Yeni Kategori Oluştur"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="Kategori Adı *"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Örn: React Native, Docker, Cyber Security..."
            required
          />
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsQuickCategoryModalOpen(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Kategoriyi Ekle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
