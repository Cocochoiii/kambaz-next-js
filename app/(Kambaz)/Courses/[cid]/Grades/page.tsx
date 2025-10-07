// app/(Kambaz)/Courses/[cid]/Grades/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { releaseGrades, updateGrade } from "./reducer";
import {
    FaPrint,
    FaCheckCircle,
    FaFileExport,
    FaPencilAlt,
    FaEyeSlash,
    FaSearch,
} from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import GradeEditor from "./GradeEditor";
import * as db from "../../../Database";
import "./grades.css";

// fetch quizzes (fallback when store isn't populated)
import axios from "axios";
import { HTTP_SERVER } from "@/app/env";

type Kind = "assignment" | "quiz" | "exam";
type GradeItem = {
    _id: string;
    title: string;
    points: number;
    dueDate: string | null;
    kind: Kind;
    groupLabel: string; // "Assignments" | "Quizzes" | "Exams"
};

export default function Grades() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();

    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const { assignments } = useSelector((s: any) => s.assignmentsReducer);
    const { grades } = useSelector((s: any) => s.gradesReducer);
    const { enrollments } = useSelector((s: any) => s.enrollmentsReducer);
    const { courses } = useSelector((s: any) => s.coursesReducer);

    // If you have a quizzes reducer, we use it; otherwise we fetch.
    const quizzesState = useSelector((s: any) => s.quizzesReducer || {});
    const quizzesFromStore = quizzesState.quizzes || [];
    const [quizzesFromServer, setQuizzesFromServer] = useState<any[]>([]);
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { data } = await axios.get(
                    `${HTTP_SERVER}/api/courses/${cid}/quizzes`,
                    { withCredentials: true }
                );
                if (mounted) setQuizzesFromServer(Array.isArray(data) ? data : []);
            } catch {
                setQuizzesFromServer([]);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [cid]);

    const quizzes: any[] =
        quizzesFromStore?.length > 0 ? quizzesFromStore : quizzesFromServer;

    const users = db.users;
    const currentCourse = courses.find((c: any) => c._id === cid);

    // UI state (Canvas-like toolbar)
    const [arrangeBy, setArrangeBy] = useState("Due Date");
    const [filterKind, setFilterKind] = useState<"ALL" | Kind>("ALL");
    const [query, setQuery] = useState("");
    const [showEditor, setShowEditor] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

    const isFaculty = currentUser?.role === "FACULTY";

    /** Build combined gradebook (Assignments + Quizzes/Exams) */
    const courseItems: GradeItem[] = useMemo(() => {
        // Assignments
        const assn: GradeItem[] = (assignments || [])
            .filter((a: any) => a.course === cid)
            .map((a: any) => ({
                _id: a._id,
                title: a.title,
                points: Number(a.points || 100),
                dueDate: a.dueDate || null,
                kind: "assignment" as const,
                groupLabel: "Assignments",
            }));

        // Quizzes (+ detect Exams by title or group)
        const qz: GradeItem[] = (quizzes || [])
            .filter((q: any) =>
                isFaculty ? q.course === cid : q.course === cid && q.published
            )
            .map((q: any) => {
                const group = String(q.assignmentGroup || "").toLowerCase();
                const isExam =
                    group === "exams" ||
                    /exam/i.test(q.title || "") ||
                    /midterm|final/i.test(q.title || "");
                return {
                    _id: q._id,
                    title: q.title,
                    points: Number(q.points || 0),
                    dueDate: q.dueDate || null,
                    kind: isExam ? ("exam" as const) : ("quiz" as const),
                    groupLabel: isExam ? "Exams" : "Quizzes",
                };
            });

        const merged = [...assn, ...qz];

        // Filtering (chips)
        const filtered =
            filterKind === "ALL" ? merged : merged.filter((i) => i.kind === filterKind);

        // Search by title
        const searched = query.trim()
            ? filtered.filter((i) =>
                i.title.toLowerCase().includes(query.trim().toLowerCase())
            )
            : filtered;

        // Sorting
        const sorted = [...searched].sort((a, b) => {
            switch (arrangeBy) {
                case "Title":
                    return a.title.localeCompare(b.title);
                case "Points":
                    return b.points - a.points;
                case "Module":
                    return 0;
                case "Due Date":
                default: {
                    const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                    const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                    return ad - bd;
                }
            }
        });

        return sorted;
    }, [assignments, quizzes, arrangeBy, filterKind, query, cid, isFaculty]);

    // Group for Canvas-like section headers
    const groupedItems = useMemo(() => {
        return courseItems.reduce<Record<string, GradeItem[]>>((acc, it) => {
            acc[it.groupLabel] = acc[it.groupLabel] || [];
            acc[it.groupLabel].push(it);
            return acc;
        }, {});
    }, [courseItems]);

    // Faculty: enrolled students
    const enrolledStudents = useMemo(
        () =>
            isFaculty
                ? db.users.filter(
                    (u: any) =>
                        u.role === "STUDENT" &&
                        enrollments.some((e: any) => e.user === u._id && e.course === cid)
                )
                : [],
        [isFaculty, enrollments, cid]
    );

    // Grades to show (students see only released)
    const relevantGrades = useMemo(
        () =>
            grades.filter((g: any) =>
                isFaculty
                    ? g.course === cid
                    : g.course === cid && g.student === currentUser._id && g.released
            ),
        [grades, isFaculty, cid, currentUser?._id]
    );

    /** Weights (Assignments + Quizzes + Exams) */
    const getGradeWeights = () => {
        switch (cid) {
            case "CS5610":
                return { Assignments: 0.4, Quizzes: 0.2, Exams: 0.2, Project: 0.15, Participation: 0.05 };
            case "CS5800":
                return { Assignments: 0.35, Quizzes: 0.15, Exams: 0.5 };
            case "CS5004":
                return { Assignments: 0.3, Quizzes: 0.1, Exams: 0.35, Project: 0.15 };
            case "CS5200":
                return { Assignments: 0.25, Quizzes: 0.1, Exams: 0.3, Project: 0.2 };
            case "CS6620":
                return { Assignments: 0.2, Quizzes: 0.1, Exams: 0.25, Project: 0.2 };
            case "CS6510":
                return { Assignments: 0.15, Quizzes: 0.1, Exams: 0.2, Project: 0.25 };
            default:
                return { Assignments: 0.5, Quizzes: 0.1, Exams: 0.4 };
        }
    };
    const gradeWeights = getGradeWeights();

    const getGradeForItem = (itemId: string, studentId?: string) =>
        relevantGrades.find(
            (g: any) =>
                g.assignment === itemId &&
                (studentId ? g.student === studentId : g.student === currentUser._id)
        );

    const calculateTotalGrade = (studentId?: string) => {
        const buckets: Record<"Assignments" | "Quizzes" | "Exams", { earned: number; possible: number }> = {
            Assignments: { earned: 0, possible: 0 },
            Quizzes: { earned: 0, possible: 0 },
            Exams: { earned: 0, possible: 0 },
        };

        courseItems.forEach((it) => {
            const g = relevantGrades.find(
                (gr: any) =>
                    gr.assignment === it._id && (studentId ? gr.student === studentId : true)
            );
            if (g && g.score != null) {
                const bucket =
                    it.kind === "assignment" ? "Assignments" : it.kind === "quiz" ? "Quizzes" : "Exams";
                buckets[bucket].earned += Number(g.score);
                buckets[bucket].possible += Number(it.points || 0);
            }
        });

        const pct = (b: { earned: number; possible: number }) =>
            b.possible > 0 ? b.earned / b.possible : 0;

        const totalPct =
            (gradeWeights.Assignments ?? 0) * pct(buckets.Assignments) +
            (gradeWeights.Quizzes ?? 0) * pct(buckets.Quizzes) +
            (gradeWeights.Exams ?? 0) * pct(buckets.Exams);

        const percentage = (totalPct * 100) || 0;

        const letter = (p: number) => {
            if (p >= 93) return "A";
            if (p >= 90) return "A-";
            if (p >= 87) return "B+";
            if (p >= 83) return "B";
            if (p >= 80) return "B-";
            if (p >= 77) return "C+";
            if (p >= 73) return "C";
            if (p >= 70) return "C-";
            if (p >= 67) return "D+";
            if (p >= 63) return "D";
            if (p >= 60) return "D-";
            return "F";
        };

        return { percentage: percentage.toFixed(2), letter: letter(percentage) };
    };

    const handleReleaseGrades = () => {
        if (window.confirm("Release all grades for this course?")) {
            dispatch(releaseGrades(cid));
            alert("Grades have been released successfully!");
        }
    };
    const handleEditGrade = (studentId: string, assignmentId: string) => {
        setSelectedStudent(studentId);
        setSelectedAssignment(assignmentId);
        setShowEditor(true);
    };
    const handleSaveGrade = (score: number) => {
        dispatch(
            updateGrade({
                studentId: selectedStudent!,
                assignmentId: selectedAssignment!,
                courseId: cid,
                score,
                submitted: new Date().toISOString(),
            })
        );
        setShowEditor(false);
    };

    const { percentage, letter } = calculateTotalGrade(isFaculty ? null : currentUser._id);
    const hasUnreleasedGrades = grades.some((g: any) => g.course === cid && !g.released);

    return (
        <div id="wd-grades">
            {/* Header */}
            <div className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h2 className="mb-1" style={{ fontWeight: 300, fontSize: "2rem" }}>
                            {!isFaculty
                                ? `Grades for ${currentUser?.firstName} ${currentUser?.lastName}`
                                : "Student Grades"}
                        </h2>
                        <div className="text-muted small">{currentCourse?.number} {currentCourse?.name}</div>
                    </div>
                    <div className="d-flex gap-2">
                        {!isFaculty && (
                            <button className="btn btn-outline-secondary">
                                <FaPrint className="me-2" />
                                Print Grades
                            </button>
                        )}
                        {isFaculty && (
                            <>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => alert("Tip: click a score cell to edit")}
                                >
                                    <FaPencilAlt className="me-2" />
                                    Edit Grades
                                </button>
                                <button
                                    className={`btn ${hasUnreleasedGrades ? "btn-danger" : "btn-success"}`}
                                    onClick={handleReleaseGrades}
                                >
                                    <FaCheckCircle className="me-2" />
                                    {hasUnreleasedGrades ? "Release Grades" : "Grades Released"}
                                </button>
                                <button className="btn btn-primary">
                                    <FaFileExport className="me-2" />
                                    Export
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Canvas-like toolbar */}
            <div className="bg-light p-3 mb-3 border rounded d-flex flex-wrap gap-2 align-items-end">
                <div className="btn-group" role="group" aria-label="filters">
                    <button
                        className={`chip ${filterKind === "ALL" ? "chip-active" : ""}`}
                        onClick={() => setFilterKind("ALL")}
                    >
                        All
                    </button>
                    <button
                        className={`chip ${filterKind === "assignment" ? "chip-active" : ""}`}
                        onClick={() => setFilterKind("assignment")}
                    >
                        Assignments
                    </button>
                    <button
                        className={`chip ${filterKind === "quiz" ? "chip-active" : ""}`}
                        onClick={() => setFilterKind("quiz")}
                    >
                        Quizzes
                    </button>
                    <button
                        className={`chip ${filterKind === "exam" ? "chip-active" : ""}`}
                        onClick={() => setFilterKind("exam")}
                    >
                        Exams
                    </button>
                </div>

                <div className="ms-auto d-flex align-items-center gap-2 flex-wrap">
                    <div className="searchbox">
                        <FaSearch className="me-2" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by title…"
                        />
                    </div>
                    <div className="d-flex align-items-end gap-2">
                        <div>
                            <label className="form-label fw-bold small mb-1">Arrange By</label>
                            <select
                                className="form-select"
                                value={arrangeBy}
                                onChange={(e) => setArrangeBy(e.target.value)}
                            >
                                <option>Due Date</option>
                                <option>Title</option>
                                <option>Points</option>
                                <option>Module</option>
                            </select>
                        </div>
                        <div className="legend d-none d-md-flex">
                            <span className="pill pill-assn">Assignment</span>
                            <span className="pill pill-quiz">Quiz</span>
                            <span className="pill pill-exam">Exam</span>
                            <span className="pill pill-muted"><FaEyeSlash className="me-1" />Muted</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student view (grouped like Canvas) */}
            {!isFaculty && (
                <div className="row">
                    <div className="col-md-8">
                        <div className="bg-white">
                            {Object.keys(groupedItems).length === 0 && (
                                <div className="p-4 text-center text-muted">No graded work yet.</div>
                            )}

                            {Object.entries(groupedItems).map(([group, list]) => {
                                // per-section subtotal for student
                                const subtotal = list.reduce(
                                    (acc, item) => {
                                        const g = getGradeForItem(item._id);
                                        if (g && g.score != null) {
                                            acc.earned += Number(g.score);
                                            acc.possible += Number(item.points || 0);
                                        }
                                        return acc;
                                    },
                                    { earned: 0, possible: 0 }
                                );
                                return (
                                    <div key={group} className="section mb-4">
                                        <div className="section-header">
                                            <div className="fw-semibold">{group}</div>
                                            <div className="text-muted small">
                                                {subtotal.possible > 0
                                                    ? `${subtotal.earned} / ${subtotal.possible} pts`
                                                    : "—"}
                                            </div>
                                        </div>

                                        <table className="table">
                                            <thead>
                                            <tr>
                                                <th style={{ width: "38%" }}>Name</th>
                                                <th style={{ width: "18%" }}>Due</th>
                                                <th style={{ width: "18%" }}>Submitted</th>
                                                <th style={{ width: "10%" }}>Status</th>
                                                <th style={{ width: "16%" }} className="text-end">Score</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {list.map((item) => {
                                                const grade = getGradeForItem(item._id);
                                                const submitted = grade?.submitted;
                                                const score = grade?.score;
                                                const released = grade?.released;

                                                return (
                                                    <tr key={item._id}>
                                                        <td>
                                                            <a
                                                                href="#"
                                                                className="text-primary text-decoration-none fw-semibold"
                                                                onClick={(e) => e.preventDefault()}
                                                                title={item.title}
                                                            >
                                                                {item.title}
                                                            </a>
                                                            <div className="text-muted small">
                                  <span
                                      className={`pill ${
                                          item.kind === "assignment"
                                              ? "pill-assn"
                                              : item.kind === "quiz"
                                                  ? "pill-quiz"
                                                  : "pill-exam"
                                      }`}
                                  >
                                    {item.groupLabel.slice(0, -1)}
                                  </span>
                                                            </div>
                                                        </td>
                                                        <td className="text-nowrap">
                                                            {item.dueDate
                                                                ? `${new Date(item.dueDate).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })} by 11:59pm`
                                                                : "—"}
                                                        </td>
                                                        <td>
                                                            {submitted ? (
                                                                <span title={new Date(submitted).toLocaleString()}>
                                    {new Date(submitted).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}{" "}
                                                                    at<br />
                                                                    {new Date(submitted).toLocaleTimeString("en-US", {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    })}
                                  </span>
                                                            ) : (
                                                                <span className="text-muted">-</span>
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            {submitted ? (
                                                                <div
                                                                    className="rounded-circle bg-primary d-inline-block"
                                                                    style={{ width: 8, height: 8 }}
                                                                    title="Submitted"
                                                                />
                                                            ) : (
                                                                <span className="text-muted">-</span>
                                                            )}
                                                        </td>
                                                        <td className="text-end">
                                                            {released && score != null ? (
                                                                <div className="d-flex align-items-center justify-content-end gap-2">
                                                                    <strong>
                                                                        {score} / {item.points}
                                                                    </strong>
                                                                    <div className="progress gradebar">
                                                                        <div
                                                                            className="progress-bar"
                                                                            style={{
                                                                                width: `${Math.min(
                                                                                    100,
                                                                                    (score / Math.max(1, item.points)) * 100
                                                                                )}%`,
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <BsThreeDots className="text-muted" />
                                                                </div>
                                                            ) : !released && submitted ? (
                                                                <span className="text-muted">
                                    <span className="pill pill-muted">
                                      <FaEyeSlash className="me-1" />
                                      Muted
                                    </span>
                                  </span>
                                                            ) : (
                                                                <span className="text-muted">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right summary */}
                    <div className="col-md-4">
                        <div className="bg-white p-3 border rounded">
                            <div className="text-end mb-3">
                                <h4 className="mb-1">Total: {percentage}% ({letter})</h4>
                            </div>
                            <div className="d-grid gap-2 mb-4">
                                <button className="btn btn-outline-secondary text-start">
                                    📊 Show Saved "What-If" Scores
                                </button>
                                <button className="btn btn-outline-secondary text-start">
                                    Show All Details
                                </button>
                            </div>
                            <h6 className="mb-2">Assignments are weighted by group</h6>
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Group</th>
                                    <th className="text-end">Weight</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr><td>Assignments</td><td className="text-end">{(gradeWeights.Assignments ?? 0) * 100}%</td></tr>
                                <tr><td>Quizzes</td><td className="text-end">{(gradeWeights.Quizzes ?? 0) * 100}%</td></tr>
                                <tr><td>Exams</td><td className="text-end">{(gradeWeights.Exams ?? 0) * 100}%</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Faculty grid (unchanged behavior, clearer labels) */}
            {isFaculty && (
                <div className="bg-white border rounded p-0 overflow-auto">
                    <table className="table table-hover table-bordered mb-0">
                        <thead className="sticky-top bg-light">
                        <tr>
                            <th className="bg-light" style={{ minWidth: 200 }}>Student</th>
                            {courseItems.map((it) => (
                                <th
                                    key={it._id}
                                    className="text-center"
                                    style={{ minWidth: 140 }}
                                    title={`${it.title} • ${it.points} pts • ${it.groupLabel}`}
                                >
                                    <div className="text-truncate">{it.title}</div>
                                    <small className="text-muted">
                                        {it.points} pts · {it.groupLabel}
                                    </small>
                                </th>
                            ))}
                            <th className="text-center bg-light">Total</th>
                        </tr>
                        </thead>
                        <tbody>
                        {enrolledStudents.map((student: any) => {
                            const studentTotal = calculateTotalGrade(student._id);
                            return (
                                <tr key={student._id}>
                                    <td className="bg-light">
                                        <strong>{student.firstName} {student.lastName}</strong>
                                        <div className="text-muted small">{student._id}</div>
                                    </td>
                                    {courseItems.map((it) => {
                                        const grade = grades.find(
                                            (g: any) =>
                                                g.course === cid && g.assignment === it._id && g.student === student._id
                                        );
                                        return (
                                            <td
                                                key={it._id}
                                                className="text-center grade-cell"
                                                onClick={() => handleEditGrade(student._id, it._id)}
                                                title="Click to edit"
                                            >
                                                {grade?.score != null ? (
                                                    <div>
                                                        <span className="fw-bold">{grade.score}</span>
                                                        {!grade.released && <FaEyeSlash className="text-warning ms-1 small" />}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="text-center bg-light">
                                        <strong>{studentTotal.percentage}%</strong>
                                        <div className="small text-muted">{studentTotal.letter}</div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Editor modal */}
            {showEditor && (
                <GradeEditor
                    show={showEditor}
                    onClose={() => setShowEditor(false)}
                    onSave={handleSaveGrade}
                    studentId={selectedStudent}
                    assignmentId={selectedAssignment}
                    currentGrade={
                        grades.find(
                            (g: any) => g.assignment === selectedAssignment && g.student === selectedStudent
                        )?.score
                    }
                    maxPoints={
                        courseItems.find((a) => a._id === selectedAssignment)?.points || 100
                    }
                />
            )}
        </div>
    );
}
