"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// How much of the points an answer earns, from 0 to 1. Multiple choice can
// have many correct options and gives partial credit.
const fractionOf = (q: any, given: any): number => {
    if (q.type === "TRUE_FALSE") return typeof given === "boolean" && given === !!q.correctAnswer ? 1 : 0;
    if (q.type === "FILL_BLANK") {
        const n = (s: any) => String(s ?? "").trim().toLowerCase();
        return given != null && String(given).length > 0 && (q.answers || []).some((a: string) => n(a) === n(given)) ? 1 : 0;
    }
    const correct = (q.choices || []).filter((c: any) => c.correct).map((c: any) => c._id);
    const sel = Array.isArray(given) ? given : given != null ? [given] : [];
    if (correct.length === 0) return 0;
    const cc = sel.filter((id: string) => correct.includes(id)).length;
    const wc = sel.filter((id: string) => !correct.includes(id)).length;
    return Math.max(0, Math.min(1, (cc - wc) / correct.length));
};

const scoreOf = (questions: any[], answers: Record<string, any>) =>
    Math.round(questions.reduce((s, q) => s + fractionOf(q, answers[q._id]) * (Number(q.points) || 0), 0) * 100) / 100;

const correctText = (q: any): string => {
    if (q.type === "TRUE_FALSE") return q.correctAnswer ? "True" : "False";
    if (q.type === "FILL_BLANK") return (q.answers || []).join(", ");
    return (q.choices || []).filter((c: any) => c.correct).map((c: any) => c.text).join(", ");
};

function QuestionCard({ q, index, total, value, onChange, locked, fraction, showCorrect, choiceOrder }: any) {
    const multi = (q.choices || []).filter((c: any) => c.correct).length > 1;
    const selected: string[] = Array.isArray(value) ? value : value != null ? [value] : [];
    const toggle = (id: string) => {
        if (locked) return;
        if (multi) {
            const s = new Set(selected);
            if (s.has(id)) s.delete(id); else s.add(id);
            onChange([...s]);
        } else {
            onChange([id]);
        }
    };
    const mark = locked ? fraction >= 1 : null;
    const border = mark === true ? "#198754" : mark === false ? "#dc3545" : "#dee2e6";
    const ordered = (choiceOrder || (q.choices || []).map((_: any, i: number) => i)).map((i: number) => (q.choices || [])[i]).filter(Boolean);
    return (
        <div className="border rounded p-3 mb-3" style={{ borderColor: border }}>
            <div className="d-flex justify-content-between">
                <div className="fw-semibold">Question {index + 1} <span className="text-muted small">of {total}</span></div>
                <div className="d-flex align-items-center gap-2">
                    <span className="text-muted small">{Number(q.points) || 0} pts</span>
                    {mark === true && <FaCheck className="text-success" />}
                    {mark === false && <FaTimes className="text-danger" />}
                </div>
            </div>
            {q.title && <div className="fw-semibold mt-1">{q.title}</div>}
            {q.question && <div className="mt-1" dangerouslySetInnerHTML={{ __html: q.question }} />}
            <div className="mt-2">
                {q.type === "TRUE_FALSE" && (
                    <>
                        <Form.Check type="radio" name={`ans-${q._id}`} label="True" disabled={locked}
                            checked={value === true} onChange={() => !locked && onChange(true)} />
                        <Form.Check type="radio" name={`ans-${q._id}`} label="False" disabled={locked}
                            checked={value === false} onChange={() => !locked && onChange(false)} />
                    </>
                )}
                {q.type === "FILL_BLANK" && (
                    <Form.Control disabled={locked} value={value || ""} placeholder="Your answer"
                        onChange={(e) => onChange(e.target.value)} style={{ maxWidth: 360 }} />
                )}
                {(q.type === "MULTIPLE_CHOICE" || !q.type) && ordered.map((c: any) => (
                    <Form.Check key={c._id} type={multi ? "checkbox" : "radio"} name={`ans-${q._id}`} disabled={locked}
                        label={<span dangerouslySetInnerHTML={{ __html: c.text || "" }} />}
                        checked={selected.includes(c._id)} onChange={() => toggle(c._id)} />
                ))}
            </div>
            {locked && showCorrect && mark === false && (
                <div className="small text-success mt-2">Correct answer: {correctText(q)}</div>
            )}
        </div>
    );
}

// mode: "take" (student) | "preview" (faculty, local) | "review" (read-only)
export default function QuizRunner({ quiz, mode, initialAnswers, showCorrect, onSubmit }: any) {
    const base: any[] = Array.isArray(quiz.questions) ? quiz.questions : [];
    const review = mode === "review";
    const locked = review;

    // Shuffle once for this attempt, so the order does not change on each render.
    const layout = useMemo(() => {
        let order = base.map((_, i) => i);
        if (!review && quiz.shuffleQuestions) order = shuffle(order);
        const choiceOrder: Record<string, number[]> = {};
        base.forEach((q) => {
            let cs = (q.choices || []).map((_: any, i: number) => i);
            if (!review && quiz.shuffleAnswers) cs = shuffle(cs);
            choiceOrder[q._id] = cs;
        });
        return { order, choiceOrder };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const questions = layout.order.map((i) => base[i]);
    const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers || {});
    const [idx, setIdx] = useState(0);
    const [busy, setBusy] = useState(false);
    const oneAtATime = quiz.oneQuestionAtATime !== false;

    const hasTimer = mode === "take" && quiz.hasTimeLimit !== false && Number(quiz.timeLimit) > 0;
    const [remaining, setRemaining] = useState(hasTimer ? Number(quiz.timeLimit) * 60 : 0);
    const startRef = useRef<number>(Date.now());
    const submitRef = useRef<() => void>(() => {});

    const setAns = (qid: string, val: any) => { if (!locked && !busy) setAnswers((a) => ({ ...a, [qid]: val })); };

    const doSubmit = async () => {
        if (busy || locked) return;
        setBusy(true);
        const arr = questions.map((q) => ({ questionId: q._id, answer: answers[q._id] ?? null }));
        const meta = { timeTaken: Math.round((Date.now() - startRef.current) / 1000) };
        if (onSubmit) await onSubmit(arr, meta, scoreOf(base, answers));
        // After submit, the parent page shows the results.
    };
    submitRef.current = doSubmit;

    useEffect(() => {
        if (!hasTimer) return;
        const t = setInterval(() => {
            setRemaining((r) => { if (r <= 1) { clearInterval(t); submitRef.current(); return 0; } return r - 1; });
        }, 1000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (questions.length === 0) return <div className="text-muted">This quiz has no questions yet.</div>;

    const mmss = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
    const shown = oneAtATime ? [questions[idx]] : questions;

    return (
        <div>
            {hasTimer && <div className="text-muted small mb-2">Time remaining: <span className="fw-semibold">{mmss}</span></div>}

            {shown.map((q) => (
                <QuestionCard key={q._id} q={q} index={questions.indexOf(q)} total={questions.length}
                    value={answers[q._id]} onChange={(v: any) => setAns(q._id, v)} locked={locked}
                    fraction={locked ? fractionOf(q, answers[q._id]) : null} showCorrect={showCorrect}
                    choiceOrder={layout.choiceOrder[q._id]} />
            ))}

            {oneAtATime && (
                <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                    <Button size="sm" variant="outline-secondary" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>Prev</Button>
                    <Button size="sm" variant="outline-secondary" disabled={idx === questions.length - 1} onClick={() => setIdx((i) => Math.min(questions.length - 1, i + 1))}>Next</Button>
                    <span className="mx-2 text-muted small">Jump to:</span>
                    {questions.map((q, i) => (
                        <Button key={q._id} size="sm" variant={i === idx ? "dark" : "outline-secondary"} style={{ minWidth: 34 }} onClick={() => setIdx(i)}>
                            {i + 1}{locked ? (fractionOf(q, answers[q._id]) >= 1 ? " ✓" : " ✗") : ""}
                        </Button>
                    ))}
                </div>
            )}

            {!locked && (
                <div className="mt-3">
                    <Button variant="dark" disabled={busy} onClick={doSubmit}>Submit Quiz</Button>
                </div>
            )}
        </div>
    );
}
