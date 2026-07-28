"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, FileQuestion } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface QuizManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
}

interface OptionData {
  id: string;
  text: string;
}

interface QuestionData {
  id: string;
  text: string;
  options: OptionData[];
  correct_option_id: string;
}

export function QuizManagerModal({ isOpen, onClose, courseId, courseTitle }: QuizManagerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("Değerlendirme Sınavı");
  const [minPassScore, setMinPassScore] = useState(80);
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    if (isOpen && courseId) {
      fetchQuizData();
    }
  }, [isOpen, courseId]);

  const fetchQuizData = async () => {
    try {
      const res = await fetch(`/api/v1/quizzes/course/${courseId}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.data && json.data.quiz) {
        setTitle(json.data.quiz.title);
        setMinPassScore(json.data.quiz.min_pass_score);
        setQuestions(json.data.questions || []);
      } else {
        // Reset if no quiz
        setTitle("Değerlendirme Sınavı");
        setMinPassScore(80);
        setQuestions([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addQuestion = () => {
    const newId = `tmp_${Date.now()}`;
    setQuestions([
      ...questions,
      {
        id: newId,
        text: "",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correct_option_id: "a",
      },
    ]);
  };

  const removeQuestion = (qIndex: number) => {
    setQuestions(questions.filter((_, idx) => idx !== qIndex));
  };

  const updateQuestionText = (qIndex: number, text: string) => {
    const newQ = [...questions];
    newQ[qIndex].text = text;
    setQuestions(newQ);
  };

  const updateOptionText = (qIndex: number, optIndex: number, text: string) => {
    const newQ = [...questions];
    newQ[qIndex].options[optIndex].text = text;
    setQuestions(newQ);
  };

  const updateCorrectOption = (qIndex: number, optId: string) => {
    const newQ = [...questions];
    newQ[qIndex].correct_option_id = optId;
    setQuestions(newQ);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/quizzes/course/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          min_pass_score: minPassScore,
          questions,
        }),
      });

      if (res.ok) {
        alert("Sınav başarıyla kaydedildi.");
        onClose();
      } else {
        alert("Sınav kaydedilirken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Sınav Yönetimi: ${courseTitle}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Sınav Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Geçme Notu (Baraj)"
            type="number"
            min={0}
            max={100}
            value={minPassScore.toString()}
            onChange={(e) => setMinPassScore(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-indigo-500" />
            Sorular ({questions.length})
          </h4>
          <Button variant="outline" size="sm" onClick={addQuestion} leftIcon={<Plus className="w-4 h-4" />}>
            Soru Ekle
          </Button>
        </div>

        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
          {questions.map((q, qIndex) => (
            <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 relative">
              <button
                onClick={() => removeQuestion(qIndex)}
                className="absolute top-4 right-4 text-rose-400 hover:text-rose-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <Input
                label={`Soru ${qIndex + 1}`}
                value={q.text}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                placeholder="Örn: Hangi seçenek doğrudur?"
              />

              <div className="space-y-2 pl-4 border-l-2 border-indigo-500/30">
                {q.options.map((opt, optIndex) => (
                  <div key={opt.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`correct_opt_${q.id}`}
                      checked={q.correct_option_id === opt.id}
                      onChange={() => updateCorrectOption(qIndex, opt.id)}
                      className="w-4 h-4 accent-indigo-500"
                      title="Doğru cevap olarak işaretle"
                    />
                    <span className="text-xs font-bold text-slate-500 uppercase">{opt.id})</span>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOptionText(qIndex, optIndex, e.target.value)}
                      placeholder={`${opt.id.toUpperCase()} şıkkı metni...`}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-8 text-sm text-slate-500">
              Henüz soru eklenmemiş. Lütfen "Soru Ekle" butonuna tıklayın.
            </div>
          )}
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isLoading} leftIcon={<Save className="w-4 h-4" />}>
            {isLoading ? "Kaydediliyor..." : "Sınavı Kaydet"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
