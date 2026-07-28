"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Video, CheckCircle, PlaySquare, Edit3, ListOrdered, Award, ShieldCheck, FileQuestion } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge as UiBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { QuizManagerModal } from "@/components/forms/QuizManagerModal";
import { Course, Lesson, Badge } from "@/types/database";
import { courseRepository, categoryRepository, lessonRepository, badgeRepository, CategoryItem } from "@/repositories";

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Add Course Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuickCategoryModalOpen, setIsQuickCategoryModalOpen] = useState(false);

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLevel, setEditLevel] = useState("Orta Seviye");
  const [editBadgeId, setEditBadgeId] = useState("");
  const [editCertEnabled, setEditCertEnabled] = useState(true);
  const [editCoverImage, setEditCoverImage] = useState("");

  // Lesson Management Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<Course | null>(null);
  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);

  // Quiz Management Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<Course | null>(null);

  // Add Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [certEnabled, setCertEnabled] = useState(true);
  const [coverImage, setCoverImage] = useState("");

  // Lesson Form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonYoutubeUrl, setLessonYoutubeUrl] = useState("");
  const [newCatName, setNewCatName] = useState("");

  const refreshData = async () => {
    const [cats, crsList, bdgData] = await Promise.all([
      categoryRepository.getAll(),
      courseRepository.getAll(),
      badgeRepository.getAll(),
    ]);
    setCategories(cats);
    setBadges(bdgData.data);
    if (cats.length > 0 && !category) {
      setCategory(cats[0].name);
    }
    setCourses(crsList);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    try {
      const res = await fetch("/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        const url = json.data.file_url;
        if (isEdit) {
          setEditCoverImage(url);
        } else {
          setCoverImage(url);
        }
      } else {
        alert("Görsel yüklenemedi.");
      }
    } catch (err) {
      console.error(err);
      alert("Bir hata oluştu.");
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await courseRepository.create({
      title,
      description: description || "SientoOps Video Eğitimi.",
      category: category || "Genel",
      youtubeUrl: youtubeUrl || undefined,
      badge_id: badgeId || undefined,
      certificate_enabled: certEnabled,
      cover_image: coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    } as any);

    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setBadgeId("");
    setCoverImage("");
    setIsAddModalOpen(false);
    await refreshData();
  };

  const openEditCourseModal = (course: Course) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditDescription(course.description || "");
    setEditCategory(course.category);
    setEditLevel(course.level || "Orta Seviye");
    setEditBadgeId(course.badge_id || "");
    setEditCertEnabled(course.certificate_enabled !== false);
    setEditCoverImage(course.cover_image || "");
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editTitle) return;

    await courseRepository.update(editingCourse.id, {
      title: editTitle,
      description: editDescription,
      category: editCategory,
      level: editLevel as any,
      badge_id: editBadgeId || undefined,
      certificate_enabled: editCertEnabled,
      cover_image: editCoverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    } as any);

    setEditingCourse(null);
    await refreshData();
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await categoryRepository.create(newCatName.trim());
    setNewCatName("");
    setIsQuickCategoryModalOpen(false);
    await refreshData();
  };

  const handleDeleteCourse = async (id: string) => {
    await courseRepository.delete(id);
    await refreshData();
  };

  const openLessonManager = async (course: Course) => {
    setSelectedCourseForLesson(course);
    const lsnList = await lessonRepository.getByCourseId(course.id);
    setCourseLessons(lsnList);
    setIsLessonModalOpen(true);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForLesson || !lessonTitle) return;

    await lessonRepository.create(selectedCourseForLesson.id, {
      title: lessonTitle,
      description: lessonDescription,
      youtube_url: lessonYoutubeUrl,
      duration_seconds: 900,
    });

    setLessonTitle("");
    setLessonDescription("");
    setLessonYoutubeUrl("");
    
    const updatedLsns = await lessonRepository.getByCourseId(selectedCourseForLesson.id);
    setCourseLessons(updatedLsns);
    await refreshData();
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!selectedCourseForLesson) return;
    await lessonRepository.delete(lessonId);
    const updatedLsns = await lessonRepository.getByCourseId(selectedCourseForLesson.id);
    setCourseLessons(updatedLsns);
    await refreshData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-indigo-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Eğitim Yönetimi
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Platforma yeni video ders içerikleri ekleyin, tamamlanma rozetlerini ve sertifikaları bağlayın.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Eğitim Ekle
        </Button>
      </div>

      {/* Search Bar */}
      <div className="w-full md:w-80">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Eğitim başlığı ile ara..."
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((c) => {
          const boundBadge = badges.find((b) => b.id === c.badge_id);
          return (
            <Card key={c.id} className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <UiBadge variant="primary">{c.category}</UiBadge>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditCourseModal(c)}
                      className="p-1.5 rounded-lg hover:bg-indigo-500/20 text-indigo-500"
                      title="Eğitimi Düzenle"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
                      title="Eğitimi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{c.description}</p>

                {/* Bound Badge Banner */}
                {boundBadge && (
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Ödül Rozeti: {boundBadge.name} ({boundBadge.icon})</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-indigo-500 dark:text-indigo-400 font-semibold">
                    <ListOrdered className="w-3.5 h-3.5" /> {c.lessons_count || 0} Ders
                  </span>
                  <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Yayında
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => openLessonManager(c)}
                    leftIcon={<Edit3 className="w-3.5 h-3.5 text-indigo-500" />}
                  >
                    Dersleri Yönet
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-slate-50 dark:bg-slate-900 border-indigo-500/20 hover:border-indigo-500/50"
                    onClick={() => {
                      setSelectedCourseForQuiz(c);
                      setIsQuizModalOpen(true);
                    }}
                    leftIcon={<FileQuestion className="w-3.5 h-3.5 text-amber-500" />}
                  >
                    Sınav/Test Yönetimi
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE COURSE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Video Eğitim Ekle"
      >
        <form onSubmit={handleAddCourse} className="space-y-4">
          <Input
            label="Eğitim Başlığı *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Örn: YouTube Hesabı Açma & Kanal Kurulumu"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kapak Resmi (İsteğe Bağlı)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 transition-colors">
                  <span className="text-xs text-slate-400">
                    {coverImage ? "Görsel Yüklendi ✅" : "Bilgisayardan Seç..."}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, false)}
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Önerilen Ölçü: <strong>1280x720 px</strong> (16:9) - JPG, PNG veya WEBP.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Açıklama *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="Ders hakkında kısa bilgi..."
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Kategori *
              </label>
              <button
                type="button"
                onClick={() => setIsQuickCategoryModalOpen(true)}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Yeni Kategori Oluştur
              </button>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
            <label className="block text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1">
              <Award className="w-4 h-4" /> Tamamlanınca Verilecek Rozet (İsteğe Bağlı)
            </label>
            <select
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="">Rozet Bağlama (Yok)</option>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.icon} {b.name} ({b.tier.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">Sertifika Etkin (Certificate Enabled)</span>
            </div>
            <input
              type="checkbox"
              checked={certEnabled}
              onChange={(e) => setCertEnabled(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
            />
          </div>

          <Input
            label="İlk Ders YouTube Video URL *"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            leftIcon={<PlaySquare className="w-4 h-4 text-red-500" />}
            required
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT COURSE MODAL */}
      <Modal
        isOpen={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        title="Video Eğitimi Düzenle"
      >
        <form onSubmit={handleUpdateCourse} className="space-y-4">
          <Input
            label="Eğitim Başlığı *"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kapak Resmi (İsteğe Bağlı)
            </label>
            <div className="flex items-center gap-3">
              {editCoverImage && (
                <img src={editCoverImage} alt="Cover" className="w-12 h-12 rounded-lg object-cover" />
              )}
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 transition-colors">
                  <span className="text-xs text-slate-400">
                    {editCoverImage ? "Görseli Değiştir..." : "Bilgisayardan Seç..."}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, true)}
                />
              </label>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Önerilen Ölçü: <strong>1280x720 px</strong> (16:9) - JPG, PNG veya WEBP.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Açıklama
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kategori *
            </label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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
            <label className="block text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1">
              <Award className="w-4 h-4" /> Tamamlanınca Verilecek Rozet
            </label>
            <select
              value={editBadgeId}
              onChange={(e) => setEditBadgeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
            >
              <option value="">Rozet Bağlama (Yok)</option>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.icon} {b.name} ({b.tier.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">Sertifika Etkin (Certificate Enabled)</span>
            </div>
            <input
              type="checkbox"
              checked={editCertEnabled}
              onChange={(e) => setEditCertEnabled(e.target.checked)}
              className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Zorluk Seviyesi
            </label>
            <select
              value={editLevel}
              onChange={(e) => setEditLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Başlangıç">Başlangıç Seviyesi</option>
              <option value="Orta Seviye">Orta Seviye</option>
              <option value="İleri Seviye">İleri Seviye</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditingCourse(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Değişiklikleri Kaydet
            </Button>
          </div>
        </form>
      </Modal>

      {/* LESSON MANAGEMENT MODAL */}
      <Modal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        title={`Ders Yönetimi: ${selectedCourseForLesson?.title}`}
      >
        <div className="space-y-6">
          {/* Add Lesson Form */}
          <form onSubmit={handleAddLesson} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Yeni Ders Ekle
            </h4>
            <Input
              label="Ders Başlığı *"
              value={lessonTitle}
              onChange={(e) => setLessonTitle(e.target.value)}
              placeholder="Örn: Ders 2: Kanal Doğrulama ve Ayarlar"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ders Açıklaması
              </label>
              <textarea
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                rows={2}
                placeholder="Bu derste öğrenilecek konular..."
                className="w-full p-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Input
              label="YouTube Video URL *"
              value={lessonYoutubeUrl}
              onChange={(e) => setLessonYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" type="submit">
                Dersi Ekle
              </Button>
            </div>
          </form>

          {/* Existing Lessons List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <h4 className="text-xs font-bold text-slate-300">Mevcut Dersler ({courseLessons.length})</h4>
            {courseLessons.map((lsn, idx) => (
              <div key={lsn.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-200">
                    {idx + 1}. {lsn.title}
                  </span>
                  <span className="block text-[10px] text-slate-500">{lsn.youtube_url}</span>
                </div>
                <button
                  onClick={() => handleDeleteLesson(lsn.id)}
                  className="p-1 rounded text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
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
            placeholder="Örn: YouTube Kanalı, System Design, React..."
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

      {/* QUIZ MANAGEMENT MODAL */}
      {selectedCourseForQuiz && (
        <QuizManagerModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          courseId={selectedCourseForQuiz.id}
          courseTitle={selectedCourseForQuiz.title}
        />
      )}
    </div>
  );
}
