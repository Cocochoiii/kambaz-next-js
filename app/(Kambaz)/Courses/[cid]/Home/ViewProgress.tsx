"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { FaChartLine, FaCheck } from "react-icons/fa6";
import { fetchCourseProgress, type CourseProgress } from "./client";
// use the same DB helper you already use in Grades to list users
import * as db from "../../../Database";

type Student = { _id: string; firstName: string; lastName: string };

function statusBadge(s: "Locked" | "Unlocked" | "In Progress" | "Complete") {
    const cls =
        s === "Complete"
            ? "text-success"
            : s === "In Progress"
                ? "text-primary"
                : s === "Unlocked"
                    ? "text-secondary"
                    : "text-muted";
    return <span className={`fw-semibold ${cls}`}>{s}{s === "Complete" ? " ✓" : ""}</span>;
}

export default function ViewProgress() {
    const { cid } = useParams<{ cid: string }>();
    const { enrollments } = useSelector((s: any) => s.enrollmentsReducer);
    const { currentUser } = useSelector((s: any) => s.accountReducer);

    // faculty only button (Canvas does this)
    const isFaculty = (currentUser?.role ?? "").toUpperCase() === "FACULTY";

    const students: Student[] = useMemo(() => {
        // enrolled students for this course (same approach used in Grades)
        const ids = new Set(
            enrollments.filter((e: any) => e.course === cid).map((e: any) => e.user)
        );
        return db.users
            .filter((u: any) => u.role === "STUDENT" && ids.has(u._id))
            .map((u: any) => ({ _id: u._id, firstName: u.firstName, lastName: u.lastName }))
            .sort((a, b) =>
                `${a.lastName}, ${a.firstName}`.localeCompare(`${b.lastName}, ${b.firstName}`)
            );
    }, [cid, enrollments]);

    const [open, setOpen] = useState(false);
    const [activeStudent, setActiveStudent] = useState<string | null>(students[0]?._id ?? null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<CourseProgress | null>(null);

    const activeStudentName = useMemo(() => {
        const s = students.find((x) => x._id === activeStudent);
        return s ? `${s.firstName} ${s.lastName}` : "";
    }, [students, activeStudent]);

    const load = async (sid: string | null) => {
        setLoading(true);
        try {
            const p = await fetchCourseProgress(cid, sid ?? undefined);
            setData(p);
        } catch {
            setData({ overallPercent: 0, modules: [] });
        } finally {
            setLoading(false);
        }
    };

    // first open -> load first student
    const onOpen = async () => {
        setOpen(true);
        if (activeStudent) await load(activeStudent);
    };

    // switching student loads fresh progress
    useEffect(() => {
        if (!open || !activeStudent) return;
        load(activeStudent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStudent]);

    if (!isFaculty) return null;

    return (
        <>
            {/* Toolbar button (styled already by your CSS via id) */}
            <button id="wd-home-view-progress" className="btn" onClick={onOpen}>
                <FaChartLine className="me-2" />
                View Progress
            </button>

            {!open ? null : (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,.35)" }}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title m-0">Student Progress</h5>
                                <button className="btn-close" onClick={() => setOpen(false)} />
                            </div>

                            <div className="modal-body p-0">
                                <div className="d-flex" style={{ minHeight: 420 }}>
                                    {/* MAIN: Module progress */}
                                    <div className="flex-fill p-4">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h5 className="m-0">
                                                Module Progress for{" "}
                                                <span className="text-primary fw-bold">{activeStudentName}</span>
                                            </h5>
                                            <div className="small text-muted">
                                                Overall: <span className="fw-semibold">
                          {Math.round(data?.overallPercent ?? 0)}%
                        </span>
                                            </div>
                                        </div>

                                        {loading && (
                                            <div className="text-center py-5">
                                                <div className="spinner-border" role="status" />
                                            </div>
                                        )}

                                        {!loading && (
                                            <div className="vstack gap-3">
                                                {(data?.modules ?? []).map((m) => (
                                                    <div key={m._id} className="card border-1">
                                                        <div className="card-body d-flex align-items-center justify-content-between">
                                                            <div className="fw-semibold">{m.title}</div>

                                                            {/* right side status like Canvas */}
                                                            <div className="text-end">
                                                                {statusBadge((m as any).status)}
                                                                <div className="progress mt-2" style={{ height: 6, width: 220 }}>
                                                                    <div
                                                                        className="progress-bar"
                                                                        style={{ width: `${Math.round(m.percent)}%` }}
                                                                        aria-valuenow={Math.round(m.percent)}
                                                                        aria-valuemin={0}
                                                                        aria-valuemax={100}
                                                                    />
                                                                </div>
                                                                <div className="small text-muted">
                                                                    {m.completed}/{m.total} items
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* child list (optional, simple list of remaining count) */}
                                                        {(m as any).remainingCount > 0 && (
                                                            <div className="card-footer bg-white">
                                <span className="small text-muted">
                                  Items to complete below
                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                {(data?.modules?.length ?? 0) === 0 && (
                                                    <div className="text-muted">No modules found for this course.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT: Student list (Canvas style) */}
                                    <aside
                                        className="border-start"
                                        style={{ width: 300, background: "#fff" }}
                                        aria-label="Student Progress List"
                                    >
                                        <div className="p-3 border-bottom fw-bold">STUDENT PROGRESS</div>
                                        <div className="list-group list-group-flush" style={{ maxHeight: 540, overflow: "auto" }}>
                                            {students.map((s) => {
                                                const active = s._id === activeStudent;
                                                return (
                                                    <button
                                                        key={s._id}
                                                        className={`list-group-item list-group-item-action text-start ${active ? "active" : ""}`}
                                                        onClick={() => setActiveStudent(s._id)}
                                                    >
                                                        {s.firstName} {s.lastName}
                                                    </button>
                                                );
                                            })}
                                            {students.length === 0 && (
                                                <div className="p-3 text-muted">No enrolled students.</div>
                                            )}
                                        </div>
                                    </aside>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={() => setOpen(false)}>
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
