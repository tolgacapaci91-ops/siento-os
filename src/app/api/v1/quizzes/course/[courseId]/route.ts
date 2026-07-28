import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { Quiz, Question } from "@/types/database";

export async function GET(req: Request, props: { params: Promise<{ courseId: string }> }) {
  try {
    const params = await props.params;
    const courseId = params.courseId;
    const db = readDb();
    
    const quiz = (db.quizzes || []).find((q) => q.course_id === courseId);
    if (!quiz) {
      return NextResponse.json({ data: null });
    }

    const questions = (db.questions || []).filter((q) => q.quiz_id === quiz.id);

    return NextResponse.json({ 
      data: {
        quiz,
        questions
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ courseId: string }> }) {
  try {
    const params = await props.params;
    const courseId = params.courseId;
    const body = await req.json();
    const { title, min_pass_score, questions } = body;

    const db = readDb();
    if (!db.quizzes) db.quizzes = [];
    if (!db.questions) db.questions = [];
    
    // Upsert Quiz
    let quiz = db.quizzes.find((q) => q.course_id === courseId);
    if (quiz) {
      quiz.title = title || quiz.title;
      quiz.min_pass_score = min_pass_score !== undefined ? min_pass_score : quiz.min_pass_score;
    } else {
      quiz = {
        id: `quiz_${Date.now()}`,
        course_id: courseId,
        title: title || "Değerlendirme Sınavı",
        min_pass_score: min_pass_score || 80,
      };
      db.quizzes.push(quiz);
    }

    // Update Questions (replace all for simplicity)
    db.questions = db.questions.filter((q) => q.quiz_id !== quiz.id);
    
    if (questions && Array.isArray(questions)) {
      questions.forEach((qData: any, idx: number) => {
        db.questions.push({
          id: `q_${Date.now()}_${idx}`,
          quiz_id: quiz.id,
          text: qData.text,
          options: qData.options,
          correct_option_id: qData.correct_option_id
        });
      });
    }

    writeDb(db);

    const savedQuestions = db.questions.filter((q) => q.quiz_id === quiz.id);

    return NextResponse.json({ 
      data: {
        quiz,
        questions: savedQuestions
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
