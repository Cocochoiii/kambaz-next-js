"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useIsFaculty } from "@/app/(Kambaz)/Account/roles";
import * as quizzesClient from "../client";
import { totalPoints, availability, fmtDate } from "../helpers";
import { TopInfoRow, Instructions, LockNotice } from "../QuizChrome";

function Row({ label, value }: any) {
    return (
        <div className="d-flex py-1 border-bottom">
            <div className="text-end pe-3 fw-semibold flex-shrink-0" style={{ width: 240 }}>{label}</div>
            <div>{value}</div>
        </div>
    );
}

// Quiz Details screen: faculty see a summary and actions (Preview/Edit/Publish);
// a student sees Start and the score of their last attempt.
export default function QuizDetails() {
    const { cid, qid } = useParams<{ cid: string; qid: string }>();
    const router = useRouter();
    const isFaculty = useIsFaculty();
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const [quiz, setQuiz] = useState<any>(null);
    const [last, setLast] = useState<any>(null);
    const [count, setCount] = useState(0);

    const load = async () => {
        const q = await quizzesClient.getQuiz(qid).catch(() => null);
        setQuiz(q);
        if (!isFaculty && currentUser?._id) {
            const a = await quizzesClient.getAttempts(qid, currentUser._id).catch(() => null);
            setLast(a?.last || null); setCount(a?.count || 0);
        }
    };
    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid, isFaculty, currentUser?._id]);
    if (!quiz) return <div className="p-4 text-muted">Loading…</div>;

    const points = totalPoints(quiz);
    const published = quiz.published !== false;
    const publish = async () => { const u = { ...quiz, published: !published }; await quizzesClient.updateQuiz(u); setQuiz(u); };
    const av = availability(quiz);
    const locked = av.state !== "available";
    const maxAttempts = quiz.multipleAttempts ? Number(quiz.howManyAttempts) || 1 : 1;
    const canTake = !locked && count < maxAttempts;

    if (isFaculty) {
        return (
            <div className="p-4" style={{ maxWidth: 900 }}>
                <div className="d-flex justify-content-center gap-2 border-bottom pb-3 mb-3">
                    <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}>Preview</Button>
                    <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>Edit</Button>
                    <Button variant="outline-secondary" onClick={publish}>{published ? "Unpublish" : "Publish"}</Button>
                </div>
                <h3 className="mb-0">{quiz.title}</h3>
                <TopInfoRow quiz={quiz} />
                <Instructions quiz={quiz} />
                <Row label="Quiz Type" value={quiz.quizType || "Graded Quiz"} />
                <Row label="Points" value={points} />
                <Row label="Assignment Group" value={quiz.assignmentGroup || "Quizzes"} />
                <Row label="Shuffle Answers" value={quiz.shuffleAnswers === false ? "No" : "Yes"} />
                <Row label="Time Limit" value={quiz.hasTimeLimit === false ? "None" : `${quiz.timeLimit ?? 20} Minutes`} />
                <Row label="Multiple Attempts" value={quiz.multipleAttempts ? "Yes" : "No"} />
                <Row label="How Many Attempts" value={quiz.multipleAttempts ? (quiz.howManyAttempts || 1) : 1} />
                <Row label="Show Correct Answers" value={quiz.showCorrectAnswers ? "Yes" : "No"} />
                <Row label="Access Code" value={quiz.accessCode || "—"} />
                <Row label="One Question at a Time" value={quiz.oneQuestionAtATime === false ? "No" : "Yes"} />
                <Row label="Webcam Required" value={quiz.webcamRequired ? "Yes" : "No"} />
                <Row label="Lock Questions After Answering" value={quiz.lockQuestionsAfterAnswering ? "Yes" : "No"} />
                <Row label="Due Date" value={fmtDate(quiz.dueDate) || "—"} />
                <Row label="Available Date" value={fmtDate(quiz.availableDate) || "—"} />
                <Row label="Until Date" value={fmtDate(quiz.untilDate) || "—"} />
            </div>
        );
    }

    return (
        <div className="p-4" style={{ maxWidth: 820 }}>
            <h3 className="mb-0">{quiz.title}</h3>
            <TopInfoRow quiz={quiz} />
            <Instructions quiz={quiz} />
            {locked && <LockNotice quiz={quiz} />}
            {last && (
                <div className="my-2">
                    <div>Score for this quiz: <strong>{last.score}</strong> out of {points}</div>
                    <div className="text-muted small">Submitted {new Date(last.submittedAt).toLocaleString()}</div>
                </div>
            )}
            <div className="mt-2 d-flex gap-2">
                {canTake && (
                    <Button variant="dark" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}>
                        {last ? "Take Again" : "Take the Quiz"}
                    </Button>
                )}
                {last && (
                    <Button variant="outline-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take?review=1`)}>
                        View Last Attempt
                    </Button>
                )}
                {!canTake && !last && !locked && <span className="text-muted">You have used all {maxAttempts} attempt(s).</span>}
            </div>
        </div>
    );
}
