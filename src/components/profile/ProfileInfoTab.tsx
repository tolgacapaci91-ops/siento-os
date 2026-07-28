"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ProfileInfoTabProps {
  initialName?: string;
  initialTitle?: string;
  initialBio?: string;
  onSave: (data: { name: string; title: string; bio: string }) => void;
}

export function ProfileInfoTab({
  initialName = "",
  initialTitle = "",
  initialBio = "",
  onSave,
}: ProfileInfoTabProps) {
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);
  const [bio, setBio] = useState(initialBio);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = () => {
    onSave({ name, title, bio });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-xl">
      <Input label="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Unvan" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Biyografi
        </label>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-3 text-sm rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>
      <Button variant="primary" onClick={handleSubmit} leftIcon={<Save className="w-4 h-4" />}>
        {isSaved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}
      </Button>
    </div>
  );
}
