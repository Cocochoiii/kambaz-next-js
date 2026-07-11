"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import * as quizzesClient from "../../client";
import { totalPoints, availability } from "../../helpers";
import QuizRunner from "../../QuizRunner";
import { TopInfoRow, Instructions, LockNotice, AttemptHistory, SubmissionDetails } from "../../QuizChrome";

// Student quiz taking. Submitting stores an attempt (graded on the server).
// A student can retake up to the limit and only sees the last attempt.
export default function QuizTake() {
    const { cid, qid } = useParams<{ cid: string; qid: string }>();
    const router = useRouter();
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const [quiz, setQuiz] = useState<any>(null);
    const [count, setCount] = useState(0);
    const [last, setLast] = useState<any>(null);
    const [best, setBest] = useState(0);
    const [attempts, setAttempts] = useState<any[]>([]);
    const [reviewing, setReviewing] = useState(false);
    const [codeOk, setCodeOk] = useState(false);
    const [codeInput, setCodeInput] = useState("");

    const load = async () => {
        const q = await quizzesClient.getQuiz(qid).catch(() => null);
        setQuiz(q);
        if (currentUser?._id) {
            const a = await quizzesClient.getAttempts(qid, currentUser._id).catch(() => null);
            setCount(a?.count || 0); setLast(a?.last || null); setBest(a?.best || 0); setAttempts(a?.attempts || []);
        }
    };
    useEffect(() => {
        load();
        if (new URLSearchParams(window.location.search).get("review") === "1") setReviewing(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qid, currentUser?._id]);

    if (!quiz) return <div className="p-4 text-muted">Loading…</div>;

    const points = totalPoints(quiz);
    const av = availability(quiz);
    const locked = av.state !== "available";
    const maxAttempts = quiz.multipleAttempts ? Number(quiz.howManyAttempts) || 1 : 1;
    const exhausted = count >= maxAttempts;
    const showCorrect = !!quiz.showCorrectAnswers;
    const hasResults = !!last;
    const lastAnswersMap = last ? Object.fromEntries((last.answers || []).map((x: any) => [x.questionId, x.answer])) : {};
    const accessNeeded = !!quiz.accessCode && !codeOk;
    const wantResults = reviewing || exhausted || (locked && hasResults);
    const canStart = !locked && !exhausted;

    const onSubmit = async (arr: any[], meta: any) => {
        const res = await quizzesClient.submitAttempt(qid, { user: currentUser?._id, answers: arr, timeTaken: meta?.timeTaken || 0 }).catch(() => null);
        await load();
        setReviewing(true);
        return res ? { score: res.score } : null;
    };

    const header = (
        <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="mb-0">{quiz.title}</h3>
            <Button variant="link" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>Back to Details</Button>
        </div>
    );

    if (wantResults && hasResults) {
        return (
            <div className="p-4">
                {header}
                <div className="row">
                    <div className="col-lg-8">
                        <TopInfoRow quiz={quiz} />
                        <Instructions quiz={quiz} />
                        {locked && <LockNotice quiz={quiz} />}
                        <AttemptHistory attempts={attempts} points={points} />
                        <QuizRunner quiz={quiz} mode="review" initialAnswers={lastAnswersMap} showCorrect={showCorrect} />
                        {canStart && <div className="mt-3"><Button variant="dark" onClick={() => setReviewing(false)}>Take Again</Button></div>}
                    </div>
                    <div className="col-lg-4">
                        <SubmissionDetails last={last} best={best} points={points} />
                    </div>
                </div>
            </div>
        );
    }

    if (locked) {
        return (
            <div className="p-4">
                {header}
                <TopInfoRow quiz={quiz} />
                <Instructions quiz={quiz} />
                <LockNotice quiz={quiz} />
            </div>
        );
    }

    if (accessNeeded) {
        return (
            <div className="p-4">
                {header}
                <TopInfoRow quiz={quiz} />
                <div style={{ maxWidth: 360 }}>
                    <div className="mb-2">This quiz requires an access code.</div>
                    <Form.Control value={codeInput} onChange={(e) => setCodeInput(e.target.value)} placeholder="Access code" />
                    <Button variant="dark" className="mt-2" onClick={() => setCodeOk(codeInput === quiz.accessCode)}>Enter</Button>
                    {codeInput && codeInput !== quiz.accessCode && <div className="text-danger small mt-1">Incorrect code.</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            {header}
            <div className="d-flex justify-content-between align-items-center">
                <div className="text-muted small">Attempt {count + 1} of {maxAttempts}</div>
                {hasResults && <Button size="sm" variant="outline-secondary" onClick={() => setReviewing(true)}>Review last attempt</Button>}
            </div>
            <TopInfoRow quiz={quiz} />
            <Instructions quiz={quiz} />
            <QuizRunner quiz={quiz} mode="take" onSubmit={onSubmit} showCorrect={showCorrect} />
        </div>
    );
}
