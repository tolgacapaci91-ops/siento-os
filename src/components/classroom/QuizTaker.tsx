"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QuizTakerProps {
  courseId: string;
  userId: string;
  onPassed: () => void;
  onFailed: () => void;
}

export function QuizTaker({ courseId, userId, onPassed, onFailed }: QuizTakerProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchQuiz();
  }, [courseId]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`/api/v1/quizzes/course/${courseId}`);
      const json = await res.json();
      if (json.data && json.data.quiz) {
        setQuiz(json.data.quiz);
        setQuestions(json.data.questions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qId: string, optId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Lütfen tüm soruları cevaplayın!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/quizzes/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          quizId: quiz.id,
          answers,
        }),
      });

      const json = await res.json();
      if (json.data) {
        setResult(json.data);
        if (json.data.passed) {
          onPassed();
        }
      } else {
        alert("Sınav değerlendirilirken hata oluştu.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Sınav yükleniyor...</div>;
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl flex flex-col items-center gap-4">
        <Award className="w-12 h-12 text-indigo-400" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Eğitim Tamamlandı!</h3>
        <p className="text-slate-500 text-sm max-w-md">
          Bu eğitim için henüz bir bitirme sınavı tanımlanmamış. Sertifikanızı ve rozetinizi almak için hazırsınız.
        </p>
        <Button variant="primary" onClick={onPassed}>Kapat</Button>
      </div>
    );
  }

  if (result) {
    return (
      <div className={`p-8 rounded-2xl border flex flex-col items-center text-center gap-4 ${
        result.passed 
          ? "bg-emerald-500/10 border-emerald-500/30" 
          : "bg-rose-500/10 border-rose-500/30"
      }`}>
        {result.passed ? (
          <CheckCircle className="w-16 h-16 text-emerald-500 mb-2" />
        ) : (
          <XCircle className="w-16 h-16 text-rose-500 mb-2" />
        )}
        
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {result.passed ? "Tebrikler, Sınavı Geçtiniz!" : "Sınavı Geçemediniz!"}
        </h3>
        
        <div className="text-4xl font-black my-4 text-slate-900 dark:text-white">
          {result.score} <span className="text-lg font-medium text-slate-500">/ 100</span>
        </div>

        <p className="text-slate-600 dark:text-slate-300 max-w-md mb-6">
          {result.passed 
            ? "Eğitim sürecini ve bitirme sınavını başarıyla tamamladınız. Artık yeni eğitimlere geçebilirsiniz." 
            : `Geçme barajı ${result.minPassScore} puan. Bilgilerinizin kalıcı olması için tüm eğitim videolarını tekrar izlemeniz gerekmektedir. İlerlemeniz sıfırlandı.`}
        </p>

        {result.passed ? (
          <Button variant="primary" onClick={onPassed}>Kapat</Button>
        ) : (
          <Button variant="outline" className="border-rose-500 text-rose-500 hover:bg-rose-500/10" onClick={onFailed}>
            Eğitime Baştan Başla
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-indigo-500" />
          {quiz.title}
        </h2>
        <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Bu sınavı geçmek için en az <strong>{quiz.min_pass_score}</strong> puan almalısınız. Başarısız olursanız eğitim ilerlemeniz sıfırlanır!
        </p>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q.id} className="space-y-4">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              <span className="text-indigo-500 mr-2">{idx + 1}.</span> {q.text}
            </h4>
            <div className="space-y-2 pl-6">
              {q.options.map((opt: any) => (
                <label 
                  key={opt.id} 
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    answers[q.id] === opt.id 
                      ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => handleSelectOption(q.id, opt.id)}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className="text-sm font-bold text-slate-400 uppercase w-6">{opt.id})</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={isSubmitting || Object.keys(answers).length < questions.length}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? "Hesaplanıyor..." : "Sınavı Bitir ve Değerlendir"}
        </Button>
      </div>
    </div>
  );
}
