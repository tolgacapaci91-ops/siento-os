"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Trophy, Lock } from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { LessonVideoPlayer, LessonNotesTab, QuizTaker } from "@/components/classroom";
import { courseRepository, lessonRepository } from "@/repositories";
import { Course, Lesson } from "@/types/database";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAchievementEngine } from "@/hooks/useAchievementEngine";
import { BadgeCelebrationModal } from "@/components/ui/BadgeCelebrationModal";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

export default function LessonClassroomPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLessonId, setActiveLessonId] = useState<string>(resolvedParams.lessonId);
  const [isCompleted, setIsCompleted] = useState(false);

  const { completeLesson, celebrationBadge, closeCelebrationModal } = useAchievementEngine(user?.id);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"lesson" | "quiz">("lesson");
  const [courseCompleted, setCourseCompleted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const crs = await courseRepository.getById(resolvedParams.courseId);
      if (crs) {
        setCourse(crs);
        const lsnList = await lessonRepository.getByCourseId(crs.id);
        
        // Sort lessons by order_index just in case
        lsnList.sort((a, b) => a.order_index - b.order_index);
        setLessons(lsnList);

        if (lsnList.length > 0 && !activeLessonId) {
          setActiveLessonId(lsnList[0].id);
        }

        // Fetch user progress for this course
        const userIdToFetch = user?.id || "user_demo";
        try {
          const res = await fetch(`/api/v1/progress/course/${crs.id}?userId=${userIdToFetch}`);
          if (!res.ok) return;
          const json = await res.json();
          if (json && json.data && json.data.completedLessons) {
            setCompletedLessonIds(json.data.completedLessons);
            
            // Check if active lesson is already completed
            if (json.data.completedLessons.includes(activeLessonId)) {
              setIsCompleted(true);
            }
            
            // Check if course is fully completed (to automatically show quiz or success)
            if (lsnList.length > 0 && json.data.completedLessons.length >= lsnList.length) {
              setCourseCompleted(true);
            }
          }
        } catch (err) {
          console.error("Failed to fetch course progress", err);
        }
      }
    };
    
    loadData();
  }, [resolvedParams.courseId, resolvedParams.lessonId, activeLessonId, user]);

  const currentLesson = activeTab === "lesson" ? (lessons.find((l) => l.id === activeLessonId) || lessons[0]) : null;

  const handleCompleteLesson = async () => {
    if (!currentLesson || !course) return;
    setIsCompleted(true);
    await completeLesson(currentLesson.id, course.id);
  };

  const getEmbedUrl = (lesson?: Lesson) => {
    if (!lesson || !lesson.youtube_url) return "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
    let vid = lesson.video_id || lesson.youtube_url;
    if (vid.includes("v=")) vid = vid.split("v=")[1]?.split("&")[0] || vid;
    else if (vid.includes("youtu.be/")) vid = vid.split("youtu.be/")[1]?.split("?")[0] || vid;
    return `https://www.youtube-nocookie.com/embed/${vid}`;
  };

  const handleVideoEnd = async () => {
    if (!currentLesson || !course || isCompleted) return;
    setIsCompleted(true);
    setCompletedLessonIds((prev) => {
      const next = [...prev, currentLesson.id];
      // Automatically unlock quiz if this was the last lesson
      if (next.length >= lessons.length) {
        setCourseCompleted(true);
        setActiveTab("quiz"); // Auto-switch to quiz when course finishes!
      }
      return next;
    });
    await completeLesson(currentLesson.id, course.id);
  };

  const goToNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === activeLessonId);
    if (currentIndex < lessons.length - 1) {
      const nextLsn = lessons[currentIndex + 1];
      setActiveLessonId(nextLsn.id);
      setIsCompleted(completedLessonIds.includes(nextLsn.id));
    }
  };

  const goToPreviousLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === activeLessonId);
    if (currentIndex > 0) {
      const prevLsn = lessons[currentIndex - 1];
      setActiveLessonId(prevLsn.id);
      setIsCompleted(completedLessonIds.includes(prevLsn.id));
    }
  };

  // Helper to determine if a lesson is locked
  const isLessonLocked = (index: number) => {
    if (index === 0) return false; // First lesson always unlocked
    const previousLesson = lessons[index - 1];
    return !completedLessonIds.includes(previousLesson.id);
  };

  const isAllLessonsCompleted = lessons.length > 0 && completedLessonIds.length >= lessons.length;

  return (
    <div className="space-y-6">
      {/* Confetti Celebration Modal */}
      <BadgeCelebrationModal badge={celebrationBadge} onClose={closeCelebrationModal} />

      {/* Top Breadcrumb & Progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/80">
        <div>
          <Link href={`/courses/${resolvedParams.courseId}`} className="inline-flex items-center gap-1 text-xs text-indigo-500 font-semibold mb-1 hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> {course?.title || "Kurs Detayına Dön"}
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {activeTab === "quiz" ? "Değerlendirme Sınavı" : (currentLesson?.title || "Ders İzleme")}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {isCompleted ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-lg text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Ders Tamamlandı
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg text-sm font-semibold">
              Devam Ediyor...
            </div>
          )}
          <div className="w-40 hidden md:block">
            <Progress value={isCompleted ? 100 : 50} showPercentage />
          </div>
        </div>
      </div>

      {/* Classroom Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Syllabus Playlist */}
        <Card className="p-4 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Ders Listesi ({lessons.length})</h4>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {lessons.map((lsn, idx) => {
              const isSelected = activeTab === "lesson" && lsn.id === activeLessonId;
              const locked = isLessonLocked(idx);
              const completed = completedLessonIds.includes(lsn.id);

              return (
                <button
                  key={lsn.id}
                  disabled={locked}
                  onClick={() => {
                    setActiveTab("lesson");
                    setActiveLessonId(lsn.id);
                    setIsCompleted(completed);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all border text-xs flex items-center justify-between ${
                    isSelected
                      ? "bg-indigo-600/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold"
                      : locked
                      ? "bg-slate-100/50 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-800/50 text-slate-400 cursor-not-allowed opacity-60"
                      : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      {locked && <Lock className="w-3 h-3 text-slate-400" />}
                      {idx + 1}. {lsn.title}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 ml-4">
                      {Math.round((lsn.duration_seconds || 600) / 60)} dk
                    </div>
                  </div>
                  {completed && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </button>
              );
            })}

            {/* Quiz Tab Button */}
            <button
              disabled={!isAllLessonsCompleted}
              onClick={() => setActiveTab("quiz")}
              className={`w-full text-left p-3 mt-4 rounded-xl transition-all border text-xs flex items-center justify-between ${
                activeTab === "quiz"
                  ? "bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-400 font-bold"
                  : !isAllLessonsCompleted
                  ? "bg-slate-100/50 dark:bg-slate-800/20 border-slate-200/50 dark:border-slate-800/50 text-slate-400 cursor-not-allowed opacity-60"
                  : "bg-slate-50 dark:bg-slate-900/40 border-amber-500/30 text-amber-600 dark:text-amber-500 hover:border-amber-500/50 shadow-sm"
              }`}
            >
              <div className="font-semibold flex items-center gap-2">
                {!isAllLessonsCompleted ? <Lock className="w-3 h-3" /> : <Trophy className="w-4 h-4" />}
                🏆 Değerlendirme Sınavı
              </div>
            </button>
          </div>
        </Card>

        {/* Right: Video Player or Quiz */}
        <div className="lg:col-span-2 space-y-4">
          {activeTab === "lesson" && currentLesson ? (
            <>
              <LessonVideoPlayer 
                embedUrl={getEmbedUrl(currentLesson)} 
                isCompleted={isCompleted}
                onVideoEnd={handleVideoEnd}
                onPrevious={lessons.findIndex(l => l.id === activeLessonId) > 0 ? goToPreviousLesson : undefined}
                onNext={
                  lessons.findIndex(l => l.id === activeLessonId) < lessons.length - 1 
                    ? goToNextLesson 
                    : undefined // Or navigate to quiz if completed
                }
              />
              <LessonNotesTab
                lessonDescription={currentLesson?.description}
                courseDescription={course?.description}
              />
            </>
          ) : (
            <QuizTaker
              courseId={course?.id || ""}
              userId={user?.id || "user_demo"}
              onPassed={() => {
                setCourseCompleted(true);
                router.push("/academy/courses"); // Redirect to courses list
              }}
              onFailed={() => {
                window.location.reload(); // Refresh to reset progress entirely
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
