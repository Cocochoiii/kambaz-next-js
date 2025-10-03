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
  const [accessCode, setAccessCode] = useState("");
  const [codeVerified, setCodeVerified] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      alert("You must be logged in to take a quiz");
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
      return;
    }

    const load = async () => {
      try {
        const data = await client.getQuiz(qid!);
        if (data.quiz.accessCode && data.quiz.accessCode.trim()) {
          setQuizData(data.quiz);
          return;
        }
        setCodeVerified(true);
        const questions = (data.questions || []).map((q: any) => {
          const transformed: any = { _id: q._id, prompt: q.prompt, points: q.points };
          if (q.type === "MULTIPLE_CHOICE") {
            transformed.type = "MCQ";
            transformed.choices = q.choices || [];
          } else if (q.type === "TRUE_FALSE") {
            transformed.type = "TF";
          } else if (q.type === "FILL_BLANK") {
            transformed.type = "FILL";
          }
          return transformed;
        });
        setQuizData({ ...data.quiz, _id: qid, questions });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [qid, currentUser]);

  const verifyCode = async () => {
    if (accessCode.trim() === quizData.accessCode.trim()) {
      try {
        const data = await client.getQuiz(qid!);
        const questions = (data.questions || []).map((q: any) => {
          const transformed: any = { _id: q._id, prompt: q.prompt, points: q.points };
          if (q.type === "MULTIPLE_CHOICE") {
            transformed.type = "MCQ";
            transformed.choices = q.choices || [];
          } else if (q.type === "TRUE_FALSE") {
            transformed.type = "TF";
          } else if (q.type === "FILL_BLANK") {
            transformed.type = "FILL";
          }
          return transformed;
        });
        setQuizData({ ...quizData, questions });
        setCodeVerified(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Incorrect access code");
    }
  };

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

  if (!codeVerified && quizData.accessCode) {
    return (
        <div className="container mt-4">
          <div className="card" style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div className="card-body">
              <h4 className="card-title">Access Code Required</h4>
              <p>This quiz requires an access code to begin.</p>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Enter access code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
              </div>
              <button className="btn btn-danger" onClick={verifyCode}>Submit</button>
              <button className="btn btn-secondary ms-2" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>Cancel</button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="container mt-4">
        <QuizRunner quiz={quizData} mode="take" onSubmitAnswers={handleSubmit} serverAttempt={attempt} />
        {attempt && (
            <div className="mt-4">
              <button className="btn btn-primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>Back to Quiz Details</button>
            </div>
        )}
      </div>
  );
}