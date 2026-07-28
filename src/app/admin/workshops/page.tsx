"use client";

import React, { useState, useEffect } from "react";
import { Terminal, Plus, Search, Trash2, Edit3, ExternalLink, Code2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Workshop } from "@/types/database";
import { workshopRepository, categoryRepository, CategoryItem } from "@/repositories";
import Editor from "@monaco-editor/react";

const SUPPORTED_LANGUAGES = [
  "html", "css", "javascript", "typescript", "json", "python", "sql", "shell", "php", "java", "csharp", "go", "rust", "cpp"
];

export default function AdminWorkshopsPage() {
  const [search, setSearch] = useState("");
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("YouTube Kanalı");
  const [difficulty, setDifficulty] = useState<"Kolay" | "Orta" | "Zor">("Orta");
  const [repoUrl, setRepoUrl] = useState("");
  const [codeContent, setCodeContent] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("typescript");
  const [fileAttachmentUrl, setFileAttachmentUrl] = useState("");

  // Edit Modal State
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<"Kolay" | "Orta" | "Zor">("Orta");
  const [editRepoUrl, setEditRepoUrl] = useState("");
  const [editCodeContent, setEditCodeContent] = useState("");
  const [editCodeLanguage, setEditCodeLanguage] = useState("typescript");
  const [editFileAttachmentUrl, setEditFileAttachmentUrl] = useState("");

  const refreshData = async () => {
    const [wList, cList] = await Promise.all([
      workshopRepository.getAll(),
      categoryRepository.getAll(),
    ]);
    setWorkshops(wList);
    setCategories(cList);
    if (cList.length > 0 && !category) {
      setCategory(cList[0].name);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredWorkshops = workshops.filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase())
  );

  const resetAddForm = () => {
    setTitle("");
    setDescription("");
    setRepoUrl("");
    setCodeContent("");
    setCodeLanguage("typescript");
    setFileAttachmentUrl("");
    setDifficulty("Orta");
  };

  const handleAddWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await workshopRepository.create({
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      description: description || "Pratik lab senaryosu ve kod repoları.",
      category: (category as any) || "YouTube Kanalı",
      difficulty: difficulty,
      estimated_hours: 3,
      tags: ["lab", "code"],
      repo_url: repoUrl || "",
      code_content: codeContent,
      code_language: codeLanguage,
      file_attachments: fileAttachmentUrl ? [{ name: "Lab Dosyası", url: fileAttachmentUrl, type: "file" }] : [],
      cover_image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
      is_favorite: false,
      created_at: new Date().toISOString(),
    });

    resetAddForm();
    setIsAddModalOpen(false);
    await refreshData();
  };

  const openEditModal = (w: Workshop) => {
    setEditingWorkshop(w);
    setEditTitle(w.title);
    setEditDescription(w.description || "");
    setEditCategory(w.category);
    setEditDifficulty(w.difficulty || "Orta");
    setEditRepoUrl(w.repo_url || "");
    setEditCodeContent(w.code_content || "");
    setEditCodeLanguage(w.code_language || "typescript");
    setEditFileAttachmentUrl(w.file_attachments?.[0]?.url || "");
  };

  const handleUpdateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop || !editTitle) return;

    await workshopRepository.update(editingWorkshop.id, {
      title: editTitle,
      description: editDescription,
      category: editCategory as any,
      difficulty: editDifficulty,
      repo_url: editRepoUrl,
      code_content: editCodeContent,
      code_language: editCodeLanguage,
      file_attachments: editFileAttachmentUrl ? [{ name: "Lab Dosyası", url: editFileAttachmentUrl, type: "file" }] : [],
    });

    setEditingWorkshop(null);
    await refreshData();
  };

  const handleDeleteWorkshop = async (id: string) => {
    await workshopRepository.delete(id);
    await refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Workshop & Laboratuvar Yönetimi
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gelecek vizyonlu profesyonel kod laboratuvarları ve uygulama ortamları oluşturun.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            resetAddForm();
            setIsAddModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Yeni Lab Ekle
        </Button>
      </div>

      {/* Search Bar */}
      <div className="w-full md:w-80">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Workshop başlığı ile ara..."
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Workshop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.map((w) => (
          <Card key={w.id} className="p-5 space-y-3 flex flex-col justify-between group hover:border-emerald-500/50 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-2">
                  <Badge variant="success">{w.category}</Badge>
                  {w.code_content && (
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                      <Code2 className="w-3 h-3 mr-1 inline-block" /> {w.code_language}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(w)} className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-500" title="Düzenle">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteWorkshop(w.id)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400" title="Sil">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{w.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{w.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-amber-500">{w.difficulty} Seviye</span>
              {w.repo_url && (
                <a href={w.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  <ExternalLink className="w-3.5 h-3.5" /> Link
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE WORKSHOP MODAL */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Yeni Laboratuvar (Workshop) Ekle">
        <form onSubmit={handleAddWorkshop} className="space-y-5 max-w-4xl mx-auto w-[85vw] max-h-[80vh] overflow-y-auto px-2 pb-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Program / Lab Başlığı *" value={title} onChange={(e) => setTitle(e.target.value)} required />
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Zorluk Seviyesi</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori *</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500" required>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <Input label="Harici Link / Dosya Bağlantısı (İsteğe Bağlı)" value={fileAttachmentUrl} onChange={(e) => setFileAttachmentUrl(e.target.value)} placeholder="https://..." />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Laboratuvar Açıklaması</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500" placeholder="Öğrenciler laboratuvarda ne yapacak?" />
          </div>

          <div className="border border-slate-700 rounded-xl overflow-hidden bg-[#1e1e1e]">
            <div className="bg-slate-900 p-3 flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400">Laboratuvar Kodu (IDE)</span>
              <select value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value)} className="bg-slate-800 text-xs text-white border border-slate-700 rounded-md px-2 py-1">
                {SUPPORTED_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="h-64 md:h-80 w-full relative">
              <Editor
                height="100%"
                language={codeLanguage}
                theme="vs-dark"
                value={codeContent}
                onChange={(val) => setCodeContent(val || "")}
                options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 } }}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800/60 mt-4">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>İptal</Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-500">Laboratuvarı Oluştur</Button>
          </div>
        </form>
      </Modal>

      {/* EDIT WORKSHOP MODAL */}
      <Modal isOpen={!!editingWorkshop} onClose={() => setEditingWorkshop(null)} title="Laboratuvarı Düzenle">
        <form onSubmit={handleUpdateWorkshop} className="space-y-5 max-w-4xl mx-auto w-[85vw] max-h-[80vh] overflow-y-auto px-2 pb-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Program / Lab Başlığı *" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Zorluk Seviyesi</label>
              <select value={editDifficulty} onChange={(e) => setEditDifficulty(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
                <option value="Kolay">Kolay</option>
                <option value="Orta">Orta</option>
                <option value="Zor">Zor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori *</label>
              <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500" required>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <Input label="Harici Link / Dosya Bağlantısı (İsteğe Bağlı)" value={editFileAttachmentUrl} onChange={(e) => setEditFileAttachmentUrl(e.target.value)} placeholder="https://..." />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Laboratuvar Açıklaması</label>
            <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full p-3 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="border border-slate-700 rounded-xl overflow-hidden bg-[#1e1e1e]">
            <div className="bg-slate-900 p-3 flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400">Laboratuvar Kodu (IDE)</span>
              <select value={editCodeLanguage} onChange={(e) => setEditCodeLanguage(e.target.value)} className="bg-slate-800 text-xs text-white border border-slate-700 rounded-md px-2 py-1">
                {SUPPORTED_LANGUAGES.map(lang => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="h-64 md:h-80 w-full relative">
              <Editor
                height="100%"
                language={editCodeLanguage}
                theme="vs-dark"
                value={editCodeContent}
                onChange={(val) => setEditCodeContent(val || "")}
                options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 16 } }}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800/60 mt-4">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditingWorkshop(null)}>İptal</Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-500">Değişiklikleri Kaydet</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
