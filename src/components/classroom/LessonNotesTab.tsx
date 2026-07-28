"use client";

import React, { useState, useEffect } from "react";
import { FileText, MessageSquare, Save } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";

interface LessonNotesTabProps {
  lessonDescription?: string;
  courseDescription?: string;
}

export function LessonNotesTab({
  lessonDescription = "",
  courseDescription = "",
}: LessonNotesTabProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [userNote, setUserNote] = useState("");
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  const displayDescription =
    lessonDescription?.trim() || courseDescription?.trim() || "Bu ders için ek açıklama girilmemiştir.";

  const handleSaveNote = () => {
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2000);
  };

  return (
    <Card className="p-5 space-y-4">
      <Tabs
        items={[
          { id: "description", label: "Ders Açıklaması", icon: <FileText className="w-4 h-4" /> },
          { id: "notes", label: "Notlarım", icon: <MessageSquare className="w-4 h-4" /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "description" && (
        <div className="text-xs md:text-sm text-slate-800 dark:text-slate-200 space-y-2 leading-relaxed font-medium">
          <p className="whitespace-pre-line">{displayDescription}</p>
        </div>
      )}

      {activeTab === "notes" && (
        <div className="space-y-3">
          <textarea
            rows={4}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Bu ders için kendi çalışma notlarınızı buraya yazabilirsiniz..."
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={handleSaveNote} leftIcon={<Save className="w-3.5 h-3.5" />}>
              {isNoteSaved ? "Not Kaydedildi!" : "Notu Kaydet"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
