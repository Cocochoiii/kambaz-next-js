"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as client from "../../client";
import QuizRunner from "../../components/QuizRunner";

export default function QuizPreviewPage() {
  const { qid } = useParams<{ qid: string }>();
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await client.getQuiz(qid!);
        const questions = (data.questions || []).map((q: any) => {
          const transformed: any = {
            _id: q._id,
            prompt: q.prompt,
            points: q.points,
          };
          if (q.type === "MULTIPLE_CHOICE") {
            transformed.type = "MCQ";
            transformed.choices = q.choices || [];
            const correct = (q.choices || []).find((c: any) => c.correct);
            if (correct) transformed.correctChoiceId = correct._id;
          } else if (q.type === "TRUE_FALSE") {
            transformed.type = "TF";
            transformed.correctBoolean = q.correctAnswer;
          } else if (q.type === "FILL_BLANK") {
            transformed.type = "FILL";
            transformed.correctAnswers = q.correctAnswers || [];
          }
          return transformed;
        });
        setQuizData({ ...data.quiz, _id: qid, questions });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [qid]);

  if (!quizData) return <div className="container mt-4">Loading preview…</div>;

  return (
      <div className="container mt-4">
        <QuizRunner quiz={quizData} mode="preview" />
      </div>
  );
}