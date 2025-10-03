"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as client from "../../client";
import QuizRunner from "../../components/QuizRunner";
import "../../quiz-styles.css";

export default function QuizPreviewPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
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
            title: q.title
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
      <div className="container-fluid px-4" style={{ maxWidth: '1000px' }}>
        {/* Preview Header */}
        <div className="alert alert-info d-flex justify-content-between align-items-center mb-4"
             style={{
               backgroundColor: '#fff3cd',
               borderColor: '#ffc107',
               borderLeft: '3px solid #ffc107',
               color: '#856404'
             }}>
          <div>
            <strong>⚠ This is a preview of the published version of the quiz</strong>
          </div>
          <button
              className="btn btn-sm"
              style={{
                backgroundColor: 'white',
                border: '1px solid #856404',
                color: '#856404',
                padding: '4px 12px'
              }}
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
          >
            Keep Editing This Quiz
          </button>
        </div>

        {/* Quiz Runner */}
        <QuizRunner quiz={quizData} mode="preview" />

        {/* Navigation Buttons */}
        <div className="d-flex gap-2 mt-4">
          <button
              className="btn btn-canvas-secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
            Back to Details
          </button>
          <button
              className="btn btn-canvas-secondary"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
            Edit Quiz
          </button>
        </div>
      </div>
  );
}