"use client";
import { useEffect, useMemo, useState } from "react";

type Mode = "preview" | "take";

export default function QuizRunner({
                                       quiz,
                                       mode,
                                       onSubmitAnswers,
                                       serverAttempt
                                   }: {
    quiz: any;
    mode: Mode;
    onSubmitAnswers?: (answers: any[]) => void;
    serverAttempt?: any;
}) {
    const [answers, setAnswers] = useState<any>({});
    const [result, setResult] = useState<any>(null);
    const [index, setIndex] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

    const runtimeQuiz = useMemo(() => {
        const q = { ...quiz, questions: (quiz.questions || []).map((x: any) => ({ ...x })) };
        if (q.shuffleAnswers) {
            q.questions = q.questions.map((x: any) =>
                x.type === "MCQ" ? { ...x, choices: shuffleArray(x.choices || []) } : x
            );
        }
        return q;
    }, [quiz]);

    useEffect(() => {
        if (!quiz.timeLimit || quiz.timeLimit <= 0) return;
        setSecondsLeft(quiz.timeLimit * 60);
        const id = setInterval(() => {
            setSecondsLeft((s) => {
                if (s == null) return s;
                if (s <= 1) { clearInterval(id); submit(); return 0; }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [quiz.timeLimit]);

    const setAnswer = (qid: string, patch: any) =>
        setAnswers((prev: any) => ({ ...prev, [qid]: { ...(prev[qid] || {}), ...patch } }));

    const normalizeForServer = () => runtimeQuiz.questions.map((q: any) => {
        const a = answers[q._id] || {};
        if (q.type === "MCQ") return { questionId: q._id, choiceId: a.choiceId || "" };
        if (q.type === "TF") return { questionId: q._id, boolean: !!a.boolean };
        return { questionId: q._id, text: a.text || "" };
    });

    const localGrade = () => {
        let awarded = 0;
        let total = 0;
        const rows = runtimeQuiz.questions.map((q: any) => {
            total += Number(q.points) || 0;
            const a = answers[q._id] || {};
            let ok = false;
            if (q.type === "MCQ") ok = a.choiceId === q.correctChoiceId;
            else if (q.type === "TF") ok = Boolean(a.boolean) === Boolean(q.correctBoolean);
            else {
                const you = (a.text || "").toString().trim().toLowerCase();
                ok = (q.correctAnswers || []).map((s: string) => s.trim().toLowerCase()).includes(you);
            }
            if (ok) awarded += Number(q.points) || 0;
            return { qid: q._id, ok, your: a };
        });
        return { total, awarded, rows };
    };

    const submit = async () => {
        if (mode === "preview") {
            const g = localGrade();
            setResult({ awarded: g.awarded, total: g.total, rows: g.rows });
        } else {
            onSubmitAnswers?.(normalizeForServer());
        }
    };

    const oneAtATime = !!quiz.oneQuestionAtATime;
    const locked = !!quiz.lockQuestionsAfterAnswering;

    const goNext = () => setIndex((i) => Math.min(i + 1, runtimeQuiz.questions.length - 1));
    const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

    useEffect(() => {
        if (!locked || !oneAtATime) return;
        const qid = runtimeQuiz.questions[index]?._id;
        if (qid && answers[qid]) goNext();
    }, [answers, locked, oneAtATime, index]);

    const showQuestions = oneAtATime ? [runtimeQuiz.questions[index]].filter(Boolean) : runtimeQuiz.questions;
    const review = mode === "take" ? serverAttempt : result;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{runtimeQuiz.title || ""}</h4>
                <div className="small text-muted">
                    {runtimeQuiz.points} pts • {runtimeQuiz.questions.length} Questions
                    {secondsLeft != null && <span className="ms-3 fw-bold">⏱ {formatTime(secondsLeft)}</span>}
                </div>
            </div>

            {showQuestions.map((q: any, idx: number) => {
                const absoluteIndex = oneAtATime ? index : idx;
                const r = getRowStatus(review, q);
                return (
                    <div key={q._id} className={`border rounded p-3 mb-3 ${r?.correct === true ? "border-success bg-light" : r?.correct === false ? "border-danger bg-light" : ""}`}>
                        <div className="d-flex justify-content-between">
                            <div><b>Question {absoluteIndex + 1}</b> • {q.points} pts</div>
                            <div className="text-uppercase small text-muted">{q.type}</div>
                        </div>
                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: q.prompt }} />

                        {q.type === "MCQ" && (
                            <div className="mt-3">
                                {(q.choices || []).map((c: any) => (
                                    <div key={c._id} className="form-check mb-2">
                                        <input className="form-check-input" type="radio" name={q._id} disabled={!!review} checked={(answers[q._id]?.choiceId) === c._id} onChange={() => setAnswer(q._id, { choiceId: c._id })} />
                                        <label className="form-check-label">{c.text}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {q.type === "TF" && (
                            <div className="mt-3">
                                <div className="form-check mb-2">
                                    <input className="form-check-input" type="radio" name={q._id} disabled={!!review} checked={answers[q._id]?.boolean === true} onChange={() => setAnswer(q._id, { boolean: true })} />
                                    <label className="form-check-label">True</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name={q._id} disabled={!!review} checked={answers[q._id]?.boolean === false} onChange={() => setAnswer(q._id, { boolean: false })} />
                                    <label className="form-check-label">False</label>
                                </div>
                            </div>
                        )}

                        {q.type === "FILL" && (
                            <input className="form-control mt-3" placeholder="Your answer" disabled={!!review} value={answers[q._id]?.text || ""} onChange={(e) => setAnswer(q._id, { text: e.target.value })} />
                        )}

                        {r && (
                            <div className={`mt-2 fw-bold ${r.correct ? "text-success" : "text-danger"}`}>
                                {r.correct ? "✅ Correct" : "❌ Incorrect"}
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="d-flex gap-2 mb-3">
                {oneAtATime && (
                    <>
                        <button className="btn btn-outline-secondary" disabled={index === 0 || (locked && !!review)} onClick={goPrev}>Previous</button>
                        <button className="btn btn-outline-secondary" disabled={index >= runtimeQuiz.questions.length - 1} onClick={goNext}>Next</button>
                    </>
                )}
                {!review && <button className="btn btn-danger" onClick={submit}>{mode === "preview" ? "Preview Submit" : "Submit Quiz"}</button>}
            </div>

            {result && (
                <div className="alert alert-info mt-3">
                    <h5 className="mb-0"><strong>Score: {result.awarded}/{result.total}</strong></h5>
                </div>
            )}
            {serverAttempt && (
                <div className="alert alert-info mt-3">
                    <h5 className="mb-0"><strong>Score: {serverAttempt.score}/{quiz.points}</strong></h5>
                    <p className="mb-0">Attempt #{serverAttempt.attemptNumber}</p>
                </div>
            )}
        </div>
    );
}

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
}

function getRowStatus(review: any, q: any) {
    if (!review) return null;
    if (review.rows) {
        const r = review.rows.find((x: any) => x.qid === q._id);
        return r ? { correct: r.ok, your: r.your?.choiceId ?? r.your?.text ?? r.your?.boolean } : null;
    }
    if (review.answers) {
        const a = review.answers.find((x: any) => x.question?._id === q._id);
        if (!a) return null;
        let correct = false;
        if (a.question.type === "TRUE_FALSE") correct = (a.question.correctAnswer ? "true" : "false") === String(a.answer);
        if (a.question.type === "MULTIPLE_CHOICE") correct = (a.question.choices || []).some((c: any) => c.correct && c._id === a.answer);
        if (a.question.type === "FILL_BLANK") {
            const you = (a.answer || "").toString().trim().toLowerCase();
            correct = (a.question.correctAnswers || []).some((s: string) => s.trim().toLowerCase() === you);
        }
        return { correct, your: a.answer };
    }
    return null;
}