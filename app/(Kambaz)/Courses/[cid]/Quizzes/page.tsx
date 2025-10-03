"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaEllipsisV, FaCaretDown, FaRocket, FaTimes } from "react-icons/fa";
import { listQuizzes, createQuiz, deleteQuiz, publishQuiz, lastAttempt } from "./client";
import "./quiz-styles.css";

export default function QuizzesListPage() {
  const { cid } = useParams<{ cid: string }>();
  const router = useRouter();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSection, setExpandedSection] = useState(true);

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
        title: "Unnamed Quiz",
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
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteQuiz(qid);
      setQuizzes(quizzes.filter((q) => q._id !== qid));
    } catch (err) {
      console.error(err);
    }
  };

  const availability = (q: any) => {
    if (!q.published && isFaculty) return <span style={{ fontWeight: 'normal' }}>Not Published</span>;
    const now = new Date();
    const a = q.availableDate ? new Date(q.availableDate) : null;
    const u = q.untilDate ? new Date(q.untilDate) : null;
    if (u && now > u) return <span style={{ fontWeight: 'bold' }}>Closed</span>;
    if (a && now < a) {
      const dateStr = a.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const timeStr = a.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
      return <span>Not available until {dateStr} at {timeStr}</span>;
    }
    return <span style={{ fontWeight: 'bold' }}>Available</span>;
  };

  const formatDueDate = (date: string | null) => {
    if (!date) return "Multiple Dates";
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    return `${dateStr} at ${timeStr}`;
  };

  const filteredQuizzes = quizzes.filter(q =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="container-fluid px-4" id="wd-quizzes">
        <h2 className="mb-4" style={{ fontSize: '1.75rem', fontWeight: '400' }}>Quizzes</h2>

        {/* Search and Actions Bar */}
        <div className="d-flex gap-3 mb-4 align-items-center">
          <div className="position-relative" style={{ maxWidth: "300px" }}>
            <input
                type="text"
                className="form-control"
                placeholder="Search for Quiz"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingRight: searchTerm ? "30px" : "12px",
                  borderRadius: "3px",
                  border: "1px solid #c7cdd1"
                }}
            />
            {searchTerm && (
                <button
                    className="btn btn-link position-absolute"
                    onClick={() => setSearchTerm("")}
                    style={{
                      right: "5px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "0 5px",
                      color: "#6c757d"
                    }}
                >
                  <FaTimes />
                </button>
            )}
          </div>
          <div className="ms-auto d-flex gap-2">
            {isFaculty && (
                <>
                  <button
                      className="btn"
                      style={{
                        backgroundColor: "#D01A19",
                        color: "white",
                        padding: "8px 20px",
                        border: "none",
                        borderRadius: "3px",
                        fontWeight: "400",
                        fontSize: "14px"
                      }}
                      onClick={handleAdd}
                  >
                    <span style={{ fontSize: "16px", marginRight: "4px" }}>+</span> Quiz
                  </button>
                  <button
                      className="btn"
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #c7cdd1",
                        backgroundColor: "white",
                        borderRadius: "3px"
                      }}
                  >
                    <FaEllipsisV style={{ color: "#2D3B45" }} />
                  </button>
                </>
            )}
          </div>
        </div>

        {/* Quizzes List */}
        {loading ? (
            <div className="text-center py-4">Loading quizzes...</div>
        ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              {searchTerm ? "No quizzes found matching your search" :
                  (isFaculty ? "No quizzes yet. Click '+ Quiz' to create one." : "No quizzes available")}
            </div>
        ) : (
            <div style={{
              border: "1px solid #dee2e6",
              borderRadius: "3px",
              backgroundColor: "white",
              overflow: "hidden"
            }}>
              {/* Assignment Quizzes Header */}
              <div
                  className="px-3 py-2 d-flex align-items-center"
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #dee2e6",
                    cursor: "pointer",
                    userSelect: "none"
                  }}
                  onClick={() => setExpandedSection(!expandedSection)}
              >
                <FaCaretDown
                    className="me-2"
                    style={{
                      transform: expandedSection ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.2s",
                      fontSize: "14px"
                    }}
                />
                <strong style={{ fontSize: "14px", fontWeight: "600" }}>Assignment Quizzes</strong>
              </div>

              {/* Quiz Items */}
              {expandedSection && (
                  <div>
                    {filteredQuizzes.map((q, index) => (
                        <div
                            key={q._id}
                            className="px-3 py-3 d-flex align-items-center quiz-list-item"
                            style={{
                              borderBottom: index < filteredQuizzes.length - 1 ? "1px solid #dee2e6" : "none",
                              borderLeft: "3px solid #28a745",
                              backgroundColor: "white",
                              transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                        >
                          {/* Icon */}
                          <div className="me-3">
                            <FaRocket style={{ color: "#6c757d", fontSize: "18px" }} />
                          </div>

                          {/* Quiz Content */}
                          <div className="flex-grow-1">
                            <div className="mb-1">
                              <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push(`/Courses/${cid}/Quizzes/${q._id}`);
                                  }}
                                  style={{
                                    color: "#0374B5",
                                    textDecoration: "none",
                                    fontSize: "16px",
                                    fontWeight: "500"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                              >
                                {q.title}
                              </a>
                            </div>
                            <div className="small" style={{ color: "#6c757d", fontSize: "13px" }}>
                              {availability(q)}
                              {" | "}
                              <span style={{ fontWeight: 'bold' }}>Due</span> {formatDueDate(q.dueDate)}
                              {" | "}
                              {q.points || 0} pts
                              {" | "}
                              {q.questionCount ?? 0} Questions
                              {!isFaculty && q.lastScore != null && (
                                  <>
                                    {" | "}
                                    <span style={{ fontWeight: '500' }}>
                                      Score: {q.lastScore}/{q.points || 0}
                                    </span>
                                  </>
                              )}
                            </div>
                          </div>

                          {/* Right Actions */}
                          <div className="d-flex align-items-center gap-3">
                            {/* Publish Status */}
                            <div
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  backgroundColor: q.published ? "#28a745" : "#6c757d",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: isFaculty ? "pointer" : "default",
                                  transition: "all 0.2s"
                                }}
                                onClick={() => isFaculty && togglePublish(q._id, q.published)}
                                title={isFaculty ? (q.published ? "Click to unpublish" : "Click to publish") : ""}
                                onMouseEnter={(e) => {
                                  if (isFaculty) {
                                    e.currentTarget.style.transform = "scale(1.1)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                              <FaCheckCircle style={{ color: "white", fontSize: "16px" }} />
                            </div>

                            {/* Three Dots Menu */}
                            {isFaculty && (
                                <div className="dropdown">
                                  <button
                                      className="btn btn-link p-0 text-muted"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      style={{ fontSize: "18px" }}
                                  >
                                    <FaEllipsisV />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                      <button
                                          className="dropdown-item"
                                          onClick={() => router.push(`/Courses/${cid}/Quizzes/${q._id}/edit`)}
                                      >
                                        Edit
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                          className="dropdown-item"
                                          onClick={() => remove(q._id)}
                                      >
                                        Delete
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                          className="dropdown-item"
                                          onClick={() => togglePublish(q._id, q.published)}
                                      >
                                        {q.published ? "Unpublish" : "Publish"}
                                      </button>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                      <button className="dropdown-item disabled" disabled>
                                        Copy
                                      </button>
                                    </li>
                                    <li>
                                      <button className="dropdown-item disabled" disabled>
                                        Sort
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                            )}
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}
      </div>
  );
}