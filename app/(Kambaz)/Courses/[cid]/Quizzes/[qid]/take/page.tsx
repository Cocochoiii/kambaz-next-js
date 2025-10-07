"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../../client";
import QuizRunner from "../../components/QuizRunner";

export default function QuizTakePage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
  const { currentUser } = useSelector((s: any) => s.accountReducer);

  const [quizData, setQuizData] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);

  useEffect(() => {
    // Require login
    if (!currentUser) {
      alert("You must be logged in to take a quiz");
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
      return;
    }

    const load = async () => {
      try {
        const data = await client.getQuiz(qid!);

        // Build the QuizRunner-friendly question shape (no access-code gating)
        const questions = (data.questions || []).map((q: any) => {
          const base: any = { _id: q._id, prompt: q.prompt, points: q.points };
          if (q.type === "MULTIPLE_CHOICE") {
            base.type = "MCQ";
            base.choices = q.choices || [];
          } else if (q.type === "TRUE_FALSE") {
            base.type = "TF";
          } else if (q.type === "FILL_BLANK") {
            base.type = "FILL";
          }
          return base;
        });

        setQuizData({ ...data.quiz, _id: qid, questions });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [qid, currentUser, cid, router]);

  const handleSubmit = async (answers: any[]) => {
    try {
      const submittedAttempt = await client.submitAttempt(qid!, answers);
      setAttempt(submittedAttempt);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("You must be logged in to submit a quiz");
        router.push(`/Account/Signin`);
      } else {
        alert("Error submitting quiz: " + (err.response?.data?.error || err.message));
      }
    }
  };

  if (!quizData) return <div className="container mt-4">Loading quiz…</div>;

  return (
      <div className="container mt-4">
        <QuizRunner
            quiz={quizData}
            mode="take"
            onSubmitAnswers={handleSubmit}
            serverAttempt={attempt}
        />
        {attempt && (
            <div className="mt-4">
              <button
                  className="btn btn-primary"
                  onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}
              >
                Back to Quiz Details
              </button>
            </div>
        )}
      </div>
  );
}
