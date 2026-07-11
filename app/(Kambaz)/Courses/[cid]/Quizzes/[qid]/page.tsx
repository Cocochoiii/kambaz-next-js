"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useIsFaculty } from "@/app/(Kambaz)/Account/roles";
import * as quizzesClient from "../client";
import { totalPoints, questionCount, fmtDate } from "../helpers";

// One row in the faculty properties summary.
function Row({ label, value }: any) {
    return (
        <div className="d-flex py-1 border-bottom">
            <div className="text-end pe-3 fw-semibold flex-shrink-0" style={{ width: 240 }}>{label}</div>
            <div>{value}</div>
        </div>
    );
}

export default function QuizDetails() {
    const { cid, qid } = useParams<{ cid: string; qid: string }>();
    const router = useRouter();
    const isFaculty = useIsFaculty();
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const [quiz, setQuiz] = useState<any>(null);
    const [attempt, setAttempt] = useState<any>(null);
    const [attemptCount, setAttemptCount] = useState(0);

    const load = async () => {
        const q = await quizzesClient.getQuiz(qid).catch(() => null);
        setQuiz(q);
        if (!isFaculty && currentUser?._id) {
            const a = await quizzesClient.getAttempts(qid, currentUser._id).catch(() => null);
            setAttempt(a?.last || null);
            setAttemptCount(a?.count || 0);
        }
    };
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid, isFaculty, currentUser?._id]);

    if (!quiz) return <div className="p-4 text-muted">Loading…</div>;

    const published = quiz.published !== false;
    const publish = async () => {
        const updated = { ...quiz, published: !published };
        await quizzesClient.updateQuiz(updated);
        setQuiz(updated);
    };

    const maxAttempts = quiz.multipleAttempts ? Number(quiz.howManyAttempts) || 1 : 1;
    const canTake = attemptCount < maxAttempts;

    return (
        <div className="p-4" style={{ maxWidth: 900 }}>
            {isFaculty ? (
                <>
                    <div className="d-flex justify-content-center gap-2 border-bottom pb-3 mb-3">
                        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}>Preview</Button>
                        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>Edit</Button>
                        <Button variant={published ? "outline-success" : "success"} onClick={publish}>
                            {published ? "Unpublish" : "Publish"}
                        </Button>
                    </div>
                    <h3 className="mb-3">{quiz.title}</h3>
                    <Row label="Quiz Type" value={quiz.quizType || "Graded Quiz"} />
                    <Row label="Points" value={totalPoints(quiz)} />
                    <Row label="Assignment Group" value={quiz.assignmentGroup || "Quizzes"} />
                    <Row label="Shuffle Answers" value={quiz.shuffleAnswers === false ? "No" : "Yes"} />
                    <Row label="Time Limit" value={`${quiz.timeLimit ?? 20} Minutes`} />
                    <Row label="Multiple Attempts" value={quiz.multipleAttempts ? "Yes" : "No"} />
                    <Row label="How Many Attempts" value={quiz.multipleAttempts ? (quiz.howManyAttempts || 1) : 1} />
                    <Row label="Show Correct Answers" value={quiz.showCorrectAnswers || "—"} />
                    <Row label="Access Code" value={quiz.accessCode || "—"} />
                    <Row label="One Question at a Time" value={quiz.oneQuestionAtATime === false ? "No" : "Yes"} />
                    <Row label="Webcam Required" value={quiz.webcamRequired ? "Yes" : "No"} />
                    <Row label="Lock Questions After Answering" value={quiz.lockQuestionsAfterAnswering ? "Yes" : "No"} />
                    <Row label="Due Date" value={fmtDate(quiz.dueDate) || "—"} />
                    <Row label="Available Date" value={fmtDate(quiz.availableDate) || "—"} />
                    <Row label="Until Date" value={fmtDate(quiz.untilDate) || "—"} />
                </>
            ) : (
                <div className="text-center">
                    <h3 className="mb-2">{quiz.title}</h3>
                    <div className="text-muted mb-3">
                        {totalPoints(quiz)} pts · {questionCount(quiz)} questions
                        {quiz.dueDate && <> · Due {fmtDate(quiz.dueDate)}</>}
                    </div>
                    {attempt && (
                        <div className="alert alert-info d-inline-block">
                            Your last score: <strong>{attempt.score}</strong> / {totalPoints(quiz)}
                            <div className="small text-muted">Attempt {attempt.attemptNumber} of {maxAttempts}</div>
                        </div>
                    )}
                    <div className="mt-2">
                        {canTake ? (
                            <Button size="lg" style={{ backgroundColor: "#d32f2f", border: "none" }}
                                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}>
                                {attempt ? "Take Again" : "Take the Quiz"}
                            </Button>
                        ) : (
                            <>
                                <div className="text-muted mb-2">You have used all {maxAttempts} attempt(s).</div>
                                <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take?review=1`)}>
                                    View Last Attempt
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
