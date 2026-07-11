"use client";

import { fmtDate, totalPoints, questionCount, availability } from "./helpers";

export const formatTimeTaken = (sec?: number): string => {
    if (sec == null) return "—";
    if (sec < 60) return `${sec} seconds`;
    const m = Math.round(sec / 60);
    return `${m} minute${m === 1 ? "" : "s"}`;
};

// Due / Points / Questions and Available / Time Limit, with thin rules.
export function TopInfoRow({ quiz }: any) {
    const tl = quiz.hasTimeLimit === false ? "None" : `${quiz.timeLimit ?? 20} Minutes`;
    return (
        <div className="border-top border-bottom py-2 my-3 small">
            <div className="mb-1">
                <span className="fw-semibold">Due</span> <span className="text-secondary">{fmtDate(quiz.dueDate) || "—"}</span>
                <span className="ms-3 fw-semibold">Points</span> <span className="text-secondary">{totalPoints(quiz)}</span>
                <span className="ms-3 fw-semibold">Questions</span> <span className="text-secondary">{questionCount(quiz)}</span>
            </div>
            <div>
                <span className="fw-semibold">Available</span>{" "}
                <span className="text-secondary">{fmtDate(quiz.availableDate) || "—"} - {fmtDate(quiz.untilDate) || "—"}</span>
                <span className="ms-3 fw-semibold">Time Limit</span> <span className="text-secondary">{tl}</span>
            </div>
        </div>
    );
}

export function Instructions({ quiz }: any) {
    if (!quiz.description) return null;
    return (
        <div className="mb-3">
            <h5 className="mb-2">Instructions</h5>
            <div dangerouslySetInnerHTML={{ __html: quiz.description }} />
        </div>
    );
}

export function LockNotice({ quiz }: any) {
    const av = availability(quiz);
    if (av.state === "closed") return <div className="text-muted my-2">This quiz was locked {fmtDate(quiz.untilDate)}.</div>;
    if (av.state === "notyet") return <div className="text-muted my-2">This quiz is not available until {fmtDate(quiz.availableDate)}.</div>;
    return null;
}

export function AttemptHistory({ attempts, points }: any) {
    if (!attempts || attempts.length === 0) return null;
    const last = attempts[attempts.length - 1];
    return (
        <div className="mb-3">
            <h5 className="mb-2">Attempt History</h5>
            <table className="table">
                <thead><tr><th></th><th>Attempt</th><th>Time</th><th>Score</th></tr></thead>
                <tbody>
                    {attempts.map((a: any, i: number) => (
                        <tr key={a._id}>
                            <td>{i === attempts.length - 1 ? <strong>LATEST</strong> : ""}</td>
                            <td>Attempt {a.attemptNumber}</td>
                            <td>{formatTimeTaken(a.timeTaken)}</td>
                            <td>{a.score} out of {points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>Score for this quiz: <strong>{last.score}</strong> out of {points}</div>
            <div className="text-muted small">Submitted {new Date(last.submittedAt).toLocaleString()}</div>
            {last.timeTaken != null && <div className="text-muted small">This attempt took {formatTimeTaken(last.timeTaken)}.</div>}
        </div>
    );
}

export function SubmissionDetails({ last, best, points }: any) {
    if (!last) return null;
    return (
        <div className="border rounded p-3">
            <div className="fw-semibold border-bottom pb-2 mb-2">Submission Details:</div>
            <div className="mb-2"><span className="fw-semibold">Time:</span> {formatTimeTaken(last.timeTaken)}</div>
            <div className="mb-2"><span className="fw-semibold">Current Score:</span> {last.score} out of {points}</div>
            <div><span className="fw-semibold">Kept Score:</span> {best} out of {points}</div>
        </div>
    );
}
