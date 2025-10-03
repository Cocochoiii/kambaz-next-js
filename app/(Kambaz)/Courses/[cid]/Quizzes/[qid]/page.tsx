"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as client from "../client";

export default function QuizDetailsPage() {
  const { cid, qid } = useParams<{ cid: string; qid: string }>();
  const router = useRouter();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [lastAttempt, setLastAttempt] = useState<any>(null);

  const load = async () => {
    try {
      const data = await client.getQuiz(qid);
      setQuiz(data.quiz);
      setQuestions(data.questions);
      if (!isFaculty && currentUser) {
        const att = await client.lastAttempt(qid);
        setLastAttempt(att);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, [qid, currentUser]);

  if (!quiz) return <div className="container mt-4">Loading…</div>;

  const attemptsAllowed = quiz.multipleAttempts ? quiz.allowedAttempts : 1;
  const attemptsUsed = lastAttempt?.attemptNumber ?? 0;
  const canTake = quiz.published && attemptsUsed < attemptsAllowed;

  return (
      <div className="container mt-4" id="wd-quiz-details">
        <h3 className="mb-3">{quiz.title}</h3>
        {quiz.description && <div className="mb-3" dangerouslySetInnerHTML={{ __html: quiz.description }} />}

        <div className="mb-3">
          <strong>Type:</strong> {quiz.type}<br/>
          <strong>Points:</strong> {quiz.points || 0}<br/>
          <strong>Assignment Group:</strong> {quiz.assignmentGroup}<br/>
          <strong>Shuffle Answers:</strong> {quiz.shuffleAnswers ? "Yes" : "No"}<br/>
          <strong>Time Limit:</strong> {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "None"}<br/>
          <strong>Multiple Attempts:</strong> {quiz.multipleAttempts ? `Yes (${quiz.allowedAttempts})` : "No"}<br/>
          <strong>One Question at a Time:</strong> {quiz.oneQuestionAtATime ? "Yes" : "No"}<br/>
          <strong>Due:</strong> {quiz.dueDate ? new Date(quiz.dueDate).toLocaleString() : "None"}<br/>
          <strong>Available From:</strong> {quiz.availableDate ? new Date(quiz.availableDate).toLocaleString() : "—"}<br/>
          <strong>Available Until:</strong> {quiz.untilDate ? new Date(quiz.untilDate).toLocaleString() : "—"}<br/>
          <strong>Questions:</strong> {questions.length}
        </div>

        <div className="mb-4">
          {isFaculty ? (
              <>
                <button className="btn btn-outline-secondary me-2" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}>Preview</button>
                <button className="btn btn-danger" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>Edit</button>
              </>
          ) : (
              <button className="btn btn-danger" disabled={!canTake} onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}>
                {canTake ? "Start Quiz" : "No more attempts"}
              </button>
          )}
        </div>

        {!isFaculty && lastAttempt && (
            <div className="mb-4">
              <div className="alert alert-info">
                <strong>Your last attempt:</strong><br/>
                Score: {lastAttempt.score}/{quiz.points} • Attempt #{lastAttempt.attemptNumber}<br/>
                Submitted: {new Date(lastAttempt.createdAt).toLocaleString()}
              </div>
              <div className="list-group">
                {lastAttempt.answers.map((a: any, i: number) => {
                  const q = a.question;
                  const ok =
                      (q.type === "MULTIPLE_CHOICE" && q.choices?.find((c:any)=>c.correct)?._id === a.answer) ||
                      (q.type === "TRUE_FALSE" && String(q.correctAnswer) === String(a.answer)) ||
                      (q.type === "FILL_BLANK" && (q.correctAnswers||[]).map((s:string)=>s.trim().toLowerCase()).includes(String(a.answer||"").trim().toLowerCase()));
                  return (
                      <div key={i} className={`list-group-item ${ok ? "border-success bg-light" : "border-danger bg-light"}`}>
                        <div className="d-flex justify-content-between">
                          <div><b>Question {i+1}</b> • {q.points} pts</div>
                          <div className="fw-bold">{ok ? "✅ Correct" : "❌ Incorrect"}</div>
                        </div>
                        <div className="mt-1" dangerouslySetInnerHTML={{ __html: q.prompt }} />
                      </div>
                  );
                })}
              </div>
            </div>
        )}
      </div>
  );
}