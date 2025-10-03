"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { listQuizzes, createQuiz, deleteQuiz, publishQuiz, lastAttempt } from "./client";

export default function QuizzesListPage() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const data = await listQuizzes(cid);
      if (!isFaculty && currentUser) {
        const attempts = await Promise.all(data.map((q: any) => lastAttempt(q._id).catch(() => null)));
        setQuizzes(data.map((q: any, i: number) => ({ ...q, lastScore: attempts[i]?.score ?? null })));
      } else {
        setQuizzes(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [cid, currentUser]);

  const handleAdd = async () => {
    try {
      const defaults = {
        title: "New Quiz",
        description: "",
        type: "Graded Quiz",
        points: 0,
        assignmentGroup: "Quizzes",
        shuffleAnswers: true,
        timeLimit: 20,
        multipleAttempts: false,
        allowedAttempts: 1,
        showCorrectAnswers: "Immediately",
        accessCode: "",
        oneQuestionAtATime: true,
        webcamRequired: false,
        lockQuestionsAfterAnswering: false,
        dueDate: null,
        availableDate: null,
        untilDate: null,
        published: false,
      };
      const q = await createQuiz(cid!, defaults);
      router.push(`/Courses/${cid}/Quizzes/${q._id}/edit`);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (qid: string, published: boolean) => {
    try {
      const updated = await publishQuiz(qid, !published);
      setQuizzes(quizzes.map((q) => (q._id === qid ? updated : q)));
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (qid: string) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await deleteQuiz(qid);
      setQuizzes(quizzes.filter((q) => q._id !== qid));
    } catch (err) {
      console.error(err);
    }
  };

  const availability = (q: any) => {
    if (!q.published) return "Unpublished";
    const now = new Date();
    const a = q.availableDate ? new Date(q.availableDate) : null;
    const u = q.untilDate ? new Date(q.untilDate) : null;
    if (a && now < a) return `Not available until ${a.toLocaleDateString()}`;
    if (u && now > u) return "Closed";
    return "Available";
  };

  return (
      <div className="container mt-4" id="wd-quizzes-list">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Quizzes</h3>
          {isFaculty && <button className="btn btn-danger" onClick={handleAdd}>+ Quiz</button>}
        </div>

        {loading ? <div>Loading…</div> :
            quizzes.length === 0 ? (
                <div className="alert alert-info">No quizzes available. {isFaculty && "Click + Quiz to create one."}</div>
            ) : (
                <div className="list-group">
                  {quizzes.map((q) => (
                      <div key={q._id} className="list-group-item d-flex justify-content-between">
                        <div className="flex-grow-1">
                          <h5 className="mb-1">
                            <a className="text-decoration-none" style={{ color: "#0374B5", cursor: "pointer" }} onClick={() => router.push(`/Courses/${cid}/Quizzes/${q._id}`)}>{q.title}</a>
                          </h5>
                          <div className="small text-muted">
                            <span className="me-3"><strong>{availability(q)}</strong></span>
                            {q.dueDate && <span className="me-3">Due {new Date(q.dueDate).toLocaleDateString()}</span>}
                            <span className="me-3">{q.points || 0} pts</span>
                            <span className="me-3">{q.questionCount ?? 0} questions</span>
                            {(!isFaculty && q.lastScore != null) && <span><strong>Score: {q.lastScore}/{q.points || 0}</strong></span>}
                          </div>
                        </div>

                        {isFaculty && (
                            <div className="d-flex align-items-center">
                              <button className="btn btn-link text-decoration-none me-2" style={{ fontSize: "1.5rem" }} title={q.published ? "Unpublish" : "Publish"} onClick={() => togglePublish(q._id, q.published)}>
                                {q.published ? "✅" : "🚫"}
                              </button>
                              <div className="dropdown">
                                <button className="btn btn-link p-0" data-bs-toggle="dropdown"><span style={{fontSize:"1.25rem"}}>⋯</span></button>
                                <ul className="dropdown-menu">
                                  <li><button className="dropdown-item" onClick={() => router.push(`/Courses/${cid}/Quizzes/${q._id}/edit`)}>Edit</button></li>
                                  <li><button className="dropdown-item text-danger" onClick={() => remove(q._id)}>Delete</button></li>
                                  <li><button className="dropdown-item" onClick={() => togglePublish(q._id, q.published)}>{q.published ? "Unpublish" : "Publish"}</button></li>
                                </ul>
                              </div>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
            )}
      </div>
  );
}