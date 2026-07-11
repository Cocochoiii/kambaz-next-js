"use client";

import { useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import { totalPoints } from "../../helpers";
import QuestionEditor from "./QuestionEditor";

const typeLabel = (t: string) =>
    t === "TRUE_FALSE" ? "True/False" : t === "FILL_BLANK" ? "Fill in the Blank" : "Multiple Choice";

// A fresh multiple-choice question (the default type).
const blankQuestion = () => ({
    _id: uuid(),
    type: "MULTIPLE_CHOICE",
    title: "New Question",
    points: 1,
    question: "",
    choices: [
        { _id: uuid(), text: "", correct: true },
        { _id: uuid(), text: "", correct: false },
    ],
    correctAnswer: true,
    answers: [""],
});

export default function QuestionsTab({ quiz, setQuiz }: any) {
    const questions: any[] = Array.isArray(quiz.questions) ? quiz.questions : [];
    const [editingId, setEditingId] = useState<string | null>(null);

    const setQuestions = (qs: any[]) =>
        setQuiz((prev: any) => ({ ...prev, questions: qs, points: qs.reduce((s, q) => s + (Number(q.points) || 0), 0) }));

    const addQuestion = () => {
        // New questions appear as a preview card; click Edit to edit them.
        setQuestions([...questions, blankQuestion()]);
    };
    const saveQuestion = (updated: any) => {
        setQuestions(questions.map((q) => (q._id === updated._id ? updated : q)));
        setEditingId(null);
    };
    const removeQuestion = (id: string) => setQuestions(questions.filter((q) => q._id !== id));

    return (
        <div>
            <div className="text-muted mb-3">Points {totalPoints(quiz)}</div>

            {questions.length === 0 && <div className="text-muted mb-3">No questions yet.</div>}

            {questions.map((q) => (
                <div key={q._id} className="border rounded mb-3">
                    {editingId === q._id ? (
                        <QuestionEditor question={q} onSave={saveQuestion} onCancel={() => setEditingId(null)} />
                    ) : (
                        <div className="p-3">
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="fw-semibold">
                                    {q.title} <span className="text-muted small">· {typeLabel(q.type)}</span>
                                </div>
                                <div className="d-flex gap-2 align-items-center">
                                    <span className="text-muted small">{Number(q.points) || 0} pts</span>
                                    <Button size="sm" variant="outline-secondary" onClick={() => setEditingId(q._id)}>Edit</Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => removeQuestion(q._id)}>Delete</Button>
                                </div>
                            </div>
                            {q.question && <div className="mt-2" dangerouslySetInnerHTML={{ __html: q.question }} />}
                        </div>
                    )}
                </div>
            ))}

            <div className="text-center">
                <Button variant="outline-secondary" onClick={addQuestion}>+ New Question</Button>
            </div>
        </div>
    );
}
