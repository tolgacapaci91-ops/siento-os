"use client";

import React, { useState, useEffect } from "react";
import { Award, Plus, Search, Trash2, Edit3, Trophy, Flame, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge as UiBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Badge, BadgeRuleType, BadgeTier, BadgeColor } from "@/types/database";
import { badgeRepository, courseRepository, categoryRepository, CategoryItem } from "@/repositories";
import { Course } from "@/types/database";

export default function AdminBadgesPage() {
  const [search, setSearch] = useState("");
  const [badges, setBadges] = useState<Badge[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Add Badge Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🏅");
  const [color, setColor] = useState<BadgeColor>("Altın");
  const [tier, setTier] = useState<BadgeTier>("bronz");
  const [ruleType, setRuleType] = useState<BadgeRuleType>("lessons_completed");
  const [targetId, setTargetId] = useState("");
  const [targetValue, setTargetValue] = useState(1);
  const [xpReward, setXpReward] = useState(50);

  // Edit Badge Modal State
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIcon, setEditIcon] = useState("🏅");
  const [editColor, setEditColor] = useState<BadgeColor>("Altın");
  const [editTier, setEditTier] = useState<BadgeTier>("bronz");
  const [editRuleType, setEditRuleType] = useState<BadgeRuleType>("lessons_completed");
  const [editTargetId, setEditTargetId] = useState("");
  const [editTargetValue, setEditTargetValue] = useState(1);
  const [editXpReward, setEditXpReward] = useState(50);

  const refreshData = async () => {
    const [badgeData, crsList, catList] = await Promise.all([
      badgeRepository.getAll(),
      courseRepository.getAll(),
      categoryRepository.getAll(),
    ]);
    setBadges(badgeData.data);
    setCourses(crsList);
    setCategories(catList);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredBadges = badges.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Analytics computation
  const earnedBadgesOnly = badges.filter((b) => (b.earned_count || 0) > 0);
  const sortedByEarned = [...earnedBadgesOnly].sort((a, b) => (b.earned_count || 0) - (a.earned_count || 0));
  const mostEarnedBadge = sortedByEarned[0] || null;
  const rarestBadge = sortedByEarned.length > 0 ? sortedByEarned[sortedByEarned.length - 1] : null;

  const handleAddBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    await badgeRepository.create({
      name,
      description,
      icon,
      color,
      tier,
      rule_type: ruleType,
      target_id: targetId || undefined,
      target_value: Number(targetValue),
      xp_reward: Number(xpReward),
    });

    setName("");
    setDescription("");
    setIsAddModalOpen(false);
    await refreshData();
  };

  const openEditModal = (b: Badge) => {
    setEditingBadge(b);
    setEditName(b.name);
    setEditDescription(b.description || "");
    setEditIcon(b.icon || "🏅");
    setEditColor(b.color);
    setEditTier(b.tier);
    setEditRuleType(b.rule_type);
    setEditTargetId(b.target_id || "");
    setEditTargetValue(b.target_value || 1);
    setEditXpReward(b.xp_reward || 50);
  };

  const handleUpdateBadge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBadge || !editName) return;

    await badgeRepository.update(editingBadge.id, {
      name: editName,
      description: editDescription,
      icon: editIcon,
      color: editColor,
      tier: editTier,
      rule_type: editRuleType,
      target_id: editTargetId || undefined,
      target_value: Number(editTargetValue),
      xp_reward: Number(editXpReward),
    });

    setEditingBadge(null);
    await refreshData();
  };

  const handleDeleteBadge = async (id: string) => {
    await badgeRepository.delete(id);
    await refreshData();
  };

  const getRuleLabel = (b: Badge) => {
    switch (b.rule_type) {
      case "course_completion":
        return `Kurs Tamamlama (${b.target_id ? "Belirli Kurs" : "Genel"})`;
      case "category_completion":
        return `Kategori Tamamlama (${b.target_id || "Tüm Kategori"})`;
      case "lessons_completed":
        return `${b.target_value} Ders Tamamlama`;
      case "documents_read":
        return `${b.target_value} PDF Okuma`;
      case "workshops_completed":
        return `${b.target_value} Workshop Bitirme`;
      case "first_course":
        return "İlk Kurs Başlangıcı";
      case "first_login":
        return "İlk Giriş Ödülü";
      case "manual":
      default:
        return "Manuel Dağıtım";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-500" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Rozet & Achievement Engine Yönetimi
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kullanıcılar ilerledikçe otomatik verilecek rozet kurallarını ve XP ödüllerini tanımlayın.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-500"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Yeni Rozet Oluştur
        </Button>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mostEarnedBadge ? (
          <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-3xl">
              {mostEarnedBadge.icon || "🏅"}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Trophy className="w-4 h-4" /> En Çok Kazanılan Rozet
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                {mostEarnedBadge.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mostEarnedBadge.earned_count || 0} kullanıcı tarafından kazanıldı
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-4 flex items-center gap-4 bg-slate-900/40 border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-800 text-3xl">🏅</div>
            <div>
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> En Çok Kazanılan Rozet
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Henüz kazanılan rozet yok. Öğrenciler eğitim tamamladıkça burada görüntülenecek.
              </p>
            </div>
          </Card>
        )}

        {rarestBadge ? (
          <Card className="p-4 flex items-center gap-4 bg-gradient-to-r from-cyan-500/10 to-transparent border-cyan-500/30">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-3xl">
              {rarestBadge.icon || "💎"}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Flame className="w-4 h-4" /> En Nadir Rozet
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                {rarestBadge.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sadece {rarestBadge.earned_count || 0} kişi açabildi ({rarestBadge.tier.toUpperCase()})
              </p>
            </div>
          </Card>
        ) : (
          <Card className="p-4 flex items-center gap-4 bg-slate-900/40 border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-800 text-3xl">💎</div>
            <div>
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> En Nadir Rozet
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Kullanıcılar hedefleri tamamladıkça nadirlik istatistikleri burada hesaplanacak.
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Search Bar */}
      <div className="w-full md:w-80">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rozet adı ile ara..."
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((b) => (
          <Card key={b.id} className="p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <UiBadge variant="primary">{b.tier.toUpperCase()}</UiBadge>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1.5 rounded-lg hover:bg-purple-500/20 text-purple-400"
                    title="Düzenle"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBadge(b.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-4xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  {b.icon || "🏅"}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{b.name}</h3>
                  <span className="text-[11px] font-mono text-purple-500 dark:text-purple-400">
                    +{b.xp_reward || 50} XP Ödülü
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{b.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Verilme Kuralı:</span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">{getRuleLabel(b)}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Kazanılma Sayısı:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{b.earned_count || 0} Kişi</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CREATE BADGE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni Rozet ve Kural Oluştur"
      >
        <form onSubmit={handleAddBadge} className="space-y-4">
          <Input
            label="Rozet Adı *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Örn: YouTube Başlangıç, Docker Master..."
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Açıklama *
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rozetin verilme şartı ve açıklaması..."
              className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rozet İkonu (Emoji / PNG) *"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="🏅"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Seviye Tier *
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as BadgeTier)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="bronz">Bronz</option>
                <option value="gumus">Gümüş</option>
                <option value="altin">Altın</option>
                <option value="platin">Platin</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tema Rengi
              </label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value as BadgeColor)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Altın">Altın</option>
                <option value="Gümüş">Gümüş</option>
                <option value="Bronz">Bronz</option>
                <option value="Mavi">Mavi</option>
                <option value="Mor">Mor</option>
                <option value="Yeşil">Yeşil</option>
              </select>
            </div>

            <Input
              label="XP Ödülü *"
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              placeholder="50"
              required
            />
          </div>

          {/* TRIGGER RULE SELECTION */}
          <div>
            <label className="block text-xs font-bold text-purple-400 mb-1.5 uppercase tracking-wider">
              🎯 Verilme Kuralı (Trigger) *
            </label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value as BadgeRuleType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/50 text-xs text-slate-200 focus:outline-none focus:border-purple-400 font-semibold"
            >
              <option value="course_completion">Bir Kurs Tamamlanınca</option>
              <option value="category_completion">Bir Kategori Tamamlanınca</option>
              <option value="lessons_completed">X Adet Ders Tamamlanınca</option>
              <option value="documents_read">X PDF Okununca</option>
              <option value="workshops_completed">X Workshop Bitince</option>
              <option value="first_course">İlk Kurs Başlangıcında</option>
              <option value="manual">Manuel Dağıtım</option>
            </select>
          </div>

          {/* Conditional Target Inputs */}
          {ruleType === "course_completion" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hedef Kurs Seçin (İsteğe Bağlı - Boş ise herhangi bir kurs)
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="">Herhangi bir kurs tamamlanınca</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {ruleType === "category_completion" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hedef Kategori Seçin *
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(ruleType === "lessons_completed" ||
            ruleType === "documents_read" ||
            ruleType === "workshops_completed") && (
            <Input
              label="Gerekli Adet (Hedef Sayı) *"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              placeholder="1"
              required
            />
          )}

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-purple-600 hover:bg-purple-500">
              Rozeti Kaydet ve Aktifleştir
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT BADGE MODAL */}
      <Modal
        isOpen={!!editingBadge}
        onClose={() => setEditingBadge(null)}
        title="Rozet Düzenle"
      >
        <form onSubmit={handleUpdateBadge} className="space-y-4">
          <Input
            label="Rozet Adı *"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Açıklama
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rozet İkonu *"
              value={editIcon}
              onChange={(e) => setEditIcon(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Seviye Tier *
              </label>
              <select
                value={editTier}
                onChange={(e) => setEditTier(e.target.value as BadgeTier)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="bronz">Bronz</option>
                <option value="gumus">Gümüş</option>
                <option value="altin">Altın</option>
                <option value="platin">Platin</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setEditingBadge(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-purple-600 hover:bg-purple-500">
              Değişiklikleri Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
