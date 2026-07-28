import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { AchievementEngineService } from "@/services/AchievementEngineService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, quizId, answers } = body; 
    // answers = { "q_1": "a", "q_2": "c" }

    const db = readDb();
    if (!db.quizzes) db.quizzes = [];
    if (!db.questions) db.questions = [];
    if (!db.quiz_results) db.quiz_results = [];
    if (!db.lesson_progress) db.lesson_progress = [];
    if (!db.course_progress) db.course_progress = [];
    
    const quiz = db.quizzes.find((q) => q.id === quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Sınav bulunamadı" }, { status: 404 });
    }

    const questions = db.questions.filter((q) => q.quiz_id === quizId);
    if (questions.length === 0) {
      return NextResponse.json({ error: "Sınavda soru yok" }, { status: 400 });
    }

    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_option_id) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.min_pass_score;

    // Save result
    db.quiz_results.push({
      id: `qr_${Date.now()}`,
      user_id: userId,
      quiz_id: quizId,
      course_id: quiz.course_id,
      score,
      passed,
      created_at: new Date().toISOString()
    });

    // Handle consequences
    if (passed) {
      // Reward XP / Badges via Achievement Engine
      // Wait, we need to mark course as fully completed if not already.
      const cp = db.course_progress.find(c => c.course_id === quiz.course_id && c.user_id === userId);
      if (cp) {
        cp.is_completed = true;
      }
      writeDb(db);
    } else {
      // PENALTY: Reset course progress!
      // The user requested: "80 puanı geçemezse tekrardan izlemesini isteyeceğiz"
      db.lesson_progress = db.lesson_progress.filter(
        (lp) => !(lp.course_id === quiz.course_id && lp.user_id === userId)
      );
      db.course_progress = db.course_progress.filter(
        (cp) => !(cp.course_id === quiz.course_id && cp.user_id === userId)
      );
      writeDb(db);
    }

    return NextResponse.json({ 
      data: {
        score,
        passed,
        minPassScore: quiz.min_pass_score
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
