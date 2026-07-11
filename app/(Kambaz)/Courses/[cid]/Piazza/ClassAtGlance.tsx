"use client";

import { useState } from "react";
import {
    FaCheckCircle, FaRegFileAlt, FaChartBar, FaUserGraduate,
    FaAppleAlt, FaUsers, FaUniversity, FaBell,
} from "react-icons/fa";

// Class at a Glance (CGS). Both roles see the same six required counts; faculty
// also get a clickable "Needs your attention" + License Status, students get a
// welcome banner. onShowUnanswered filters the post list to unanswered questions.
export default function ClassAtGlance({
    isInstructor, onShowUnanswered, unread, unanswered, unansweredFollowups,
    totalPosts, totalContributions, instructorResponses, studentResponses, studentsEnrolled,
}: any) {
    const [showWelcome, setShowWelcome] = useState(true);

    // Green "all caught up" when zero, otherwise a count (optionally clickable).
    const caught = (count: number, zeroText: string, someText: string, onClick?: () => void) => {
        const clickable = !!onClick && count > 0;
        return (
            <div className="flex-fill border rounded p-3 text-center"
                role={clickable ? "button" : undefined}
                onClick={clickable ? onClick : undefined}
                style={{ background: count === 0 ? "#e6f4ea" : "#fff", minWidth: 200, cursor: clickable ? "pointer" : "default" }}>
                {count === 0 ? (
                    <>
                        <FaCheckCircle className="text-success mb-1" size={22} />
                        <div className="fw-bold">All caught up</div>
                        <div className="text-muted small">{zeroText}</div>
                    </>
                ) : (
                    <>
                        <div className="fw-bold fs-4">{count}</div>
                        <div className="text-muted small">{someText}{clickable ? " ›" : ""}</div>
                    </>
                )}
            </div>
        );
    };

    const stat = (icon: any, value: number, label: string) => (
        <div className="flex-fill border rounded p-3" style={{ minWidth: 200 }}>
            <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary fs-4">{icon}</span>
                <span className="fw-bold fs-3">{value}</span>
            </div>
            <div className="text-muted mt-1">{label}</div>
        </div>
    );

    const responses = (title: string, value: number, label: string, icon: any) => (
        <div className="flex-fill border rounded p-3" style={{ minWidth: 220 }}>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="fw-semibold">{title}</div>
                    <div className="fw-bold fs-3">{value}</div>
                    <div className="text-muted small">{label}</div>
                </div>
                <span className="text-secondary fs-2">{icon}</span>
            </div>
        </div>
    );

    const attention = unanswered + unansweredFollowups;

    return (
        <div className="p-4">
            <h4 className="mb-3">Class at a Glance</h4>

            {/* Faculty: action-oriented card (click to review unanswered) */}
            {isInstructor && (
                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center"
                    role={attention > 0 ? "button" : undefined}
                    onClick={attention > 0 ? onShowUnanswered : undefined}
                    style={{ maxWidth: 660, background: attention > 0 ? "#fff3cd" : "#e6f4ea", cursor: attention > 0 ? "pointer" : "default" }}>
                    <div>
                        <div className="fw-semibold">Needs your attention</div>
                        <div className="text-muted small">
                            {attention > 0
                                ? `${unanswered} unanswered questions · ${unansweredFollowups} unresolved followups — click to review`
                                : "Nothing needs your attention right now"}
                        </div>
                    </div>
                    <FaBell className="text-secondary fs-2" />
                </div>
            )}

            {/* Unread / unanswered / unanswered followups */}
            <div className="d-flex flex-wrap gap-3 mb-3">
                {caught(unread, "No unread posts", "unread posts")}
                {caught(unanswered, "No unanswered questions", "unanswered questions", isInstructor ? onShowUnanswered : undefined)}
                {caught(unansweredFollowups, "No unanswered followups", "unanswered followups")}
            </div>

            {/* Totals */}
            <div className="d-flex flex-wrap gap-3 mb-3">
                {stat(<FaRegFileAlt />, totalPosts, "Total Posts")}
                {stat(<FaChartBar />, totalContributions, "Total Contributions")}
                {stat(<FaUserGraduate />, studentsEnrolled, "Students Enrolled")}
            </div>

            {/* Instructor vs student responses */}
            <div className="d-flex flex-wrap gap-3 mb-3">
                {responses("Instructor Engagement", instructorResponses, "instructor responses", <FaAppleAlt />)}
                {responses("Student Participation", studentResponses, "student responses", <FaUsers />)}
            </div>

            {/* Faculty-only card */}
            {isInstructor && (
                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center" style={{ maxWidth: 660 }}>
                    <div>
                        <div className="fw-semibold">License Status</div>
                        <div className="text-muted small">active instructor license</div>
                    </div>
                    <FaUniversity className="text-secondary fs-2" />
                </div>
            )}

            {/* Student-only welcome banner */}
            {!isInstructor && showWelcome && (
                <div className="border rounded p-3 position-relative" style={{ maxWidth: 660, background: "#f8f9fa" }}>
                    <button className="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onClick={() => setShowWelcome(false)} />
                    <div className="fw-bold mb-1">Hey Students!</div>
                    <div className="text-muted small">
                        Welcome to Pazza for this course. Use New Post to ask a question or share a note,
                        filter by folder, and join follow-up discussions. Your posts, answers, and replies are saved automatically.
                    </div>
                </div>
            )}
        </div>
    );
}
