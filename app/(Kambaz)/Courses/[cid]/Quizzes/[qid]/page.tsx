"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import * as client from "../client";
import "../quiz-styles.css";

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

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    const d = new Date(date);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[d.getMonth()];
    const day = d.getDate();
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    return `${month} ${day} at ${time}`;
  };

  return (
      <div className="container-fluid px-4" style={{ maxWidth: '1000px' }}>
        {/* Header with actions */}
        <div className="d-flex justify-content-end gap-2 mb-3 mt-3">
          {isFaculty ? (
              <>
                <button
                    className="btn btn-canvas-secondary"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}
                >
                  Preview
                </button>
                <button
                    className="btn btn-canvas-secondary"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
                >
                  <FaEdit className="me-1" style={{ fontSize: '14px' }} /> Edit
                </button>
              </>
          ) : (
              <button
                  className="btn btn-canvas-primary"
                  disabled={!canTake}
                  onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
                  style={{
                    backgroundColor: canTake ? '#D01A19' : '#6c757d',
                    opacity: canTake ? 1 : 0.6
                  }}
              >
                {canTake ? "Start Quiz" : "No more attempts"}
              </button>
          )}
        </div>

        {/* Quiz Details Box */}
        <div className="quiz-details-container">
          <h2 className="quiz-title">{quiz.title}</h2>

          {/* Details Table */}
          <table className="quiz-details-table">
            <tbody>
            <tr>
              <td className="label-cell">Quiz Type</td>
              <td>{quiz.type}</td>
            </tr>
            <tr>
              <td className="label-cell">Points</td>
              <td>{quiz.points || 0}</td>
            </tr>
            <tr>
              <td className="label-cell">Assignment Group</td>
              <td>{quiz.assignmentGroup?.toUpperCase() || "QUIZZES"}</td>
            </tr>
            <tr>
              <td className="label-cell">Shuffle Answers</td>
              <td>{quiz.shuffleAnswers ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="label-cell">Time Limit</td>
              <td>{quiz.timeLimit ? `${quiz.timeLimit} Minutes` : "No Time Limit"}</td>
            </tr>
            <tr>
              <td className="label-cell">Multiple Attempts</td>
              <td>{quiz.multipleAttempts ? "Yes" : "No"}</td>
            </tr>
            {quiz.multipleAttempts && (
                <tr>
                  <td className="label-cell">How Many Attempts</td>
                  <td>{quiz.allowedAttempts}</td>
                </tr>
            )}
            <tr>
              <td className="label-cell">View Responses</td>
              <td>Always</td>
            </tr>
            <tr>
              <td className="label-cell">Show Correct Answers</td>
              <td>{quiz.showCorrectAnswers}</td>
            </tr>
            <tr>
              <td className="label-cell">One Question at a Time</td>
              <td>{quiz.oneQuestionAtATime ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="label-cell">Require Respondus LockDown Browser</td>
              <td>No</td>
            </tr>
            <tr>
              <td className="label-cell">Required to View Quiz Results</td>
              <td>No</td>
            </tr>
            <tr>
              <td className="label-cell">Webcam Required</td>
              <td>{quiz.webcamRequired ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="label-cell">Lock Questions After Answering</td>
              <td>{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
            </tr>
            </tbody>
          </table>

          {/* Due Dates Section */}
          <div className="mt-5">
            <table className="table table-bordered quiz-due-dates-table">
              <thead>
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available from</th>
                <th>Until</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{quiz.dueDate ? formatDate(quiz.dueDate) : "—"}</td>
                <td>Everyone</td>
                <td>{quiz.availableDate ? formatDate(quiz.availableDate) : "—"}</td>
                <td>{quiz.untilDate ? formatDate(quiz.untilDate) : "—"}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Student View - Last Attempt Info */}
        {!isFaculty && lastAttempt && (
            <div className="mt-4">
              <div className="card quiz-attempt-card">
                <div className="card-header quiz-attempt-header">
                  <h5 className="mb-0">Your Last Attempt</h5>
                </div>
                <div className="card-body">
                  <table className="attempt-info-table">
                    <tbody>
                    <tr>
                      <td className="pe-4"><strong>Score:</strong></td>
                      <td>{lastAttempt.score}/{quiz.points} points</td>
                    </tr>
                    <tr>
                      <td className="pe-4"><strong>Attempt:</strong></td>
                      <td>#{lastAttempt.attemptNumber} of {attemptsAllowed}</td>
                    </tr>
                    <tr>
                      <td className="pe-4"><strong>Submitted:</strong></td>
                      <td>{new Date(lastAttempt.createdAt).toLocaleString()}</td>
                    </tr>
                    </tbody>
                  </table>

                  {quiz.showCorrectAnswers === "Immediately" && (
                      <div className="mt-4">
                        <h6 className="mb-3">Review Your Answers</h6>
                        <div className="list-group quiz-review-list">
                          {lastAttempt.answers.map((a: any, i: number) => {
                            const q = a.question;
                            const isCorrect =
                                (q.type === "MULTIPLE_CHOICE" && q.choices?.find((c:any)=>c.correct)?._id === a.answer) ||
                                (q.type === "TRUE_FALSE" && String(q.correctAnswer) === String(a.answer)) ||
                                (q.type === "FILL_BLANK" && (q.correctAnswers||[]).map((s:string)=>s.trim().toLowerCase()).includes(String(a.answer||"").trim().toLowerCase()));

                            return (
                                <div key={i} className={`list-group-item quiz-review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                      <h6 className="mb-2">Question {i + 1}</h6>
                                      <div className="question-text" dangerouslySetInnerHTML={{ __html: q.prompt }} />
                                      <div className="mt-2">
                                        <strong>Your answer:</strong> {
                                        q.type === "MULTIPLE_CHOICE" ?
                                            q.choices?.find((c: any) => c._id === a.answer)?.text || "No answer" :
                                            String(a.answer || "No answer")
                                      }
                                      </div>
                                    </div>
                                    <div className="text-end">
                                      <div className="mb-1">
                                        <span className="badge bg-secondary">{q.points} pts</span>
                                      </div>
                                      <div>
                                        {isCorrect ?
                                            <span className="text-success">✓ Correct</span> :
                                            <span className="text-danger">✗ Incorrect</span>
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            );
                          })}
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}