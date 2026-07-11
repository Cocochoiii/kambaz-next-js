"use client";

import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import RichText from "../../RichText";

// Multiple choice: any number of choices, one marked correct via radio.
function MultipleChoice({ q, set }: any) {
    const choices = q.choices || [];
    const update = (cs: any[]) => set({ choices: cs });
    const addChoice = () => update([...choices, { _id: uuid(), text: "", correct: choices.length === 0 }]);
    const removeChoice = (id: string) => update(choices.filter((c: any) => c._id !== id));
    const toggleCorrect = (id: string) => update(choices.map((c: any) => (c._id === id ? { ...c, correct: !c.correct } : c)));
    const setText = (id: string, text: string) => update(choices.map((c: any) => (c._id === id ? { ...c, text } : c)));
    return (
        <div>
            <Form.Label>Answers (check the correct one(s))</Form.Label>
            {choices.map((c: any) => (
                <div key={c._id} className="d-flex align-items-center gap-2 mb-2">
                    <Form.Check type="checkbox" title="Correct answer"
                        checked={!!c.correct} onChange={() => toggleCorrect(c._id)} />
                    <Form.Control as="textarea" rows={1} value={c.text} placeholder="Answer text"
                        onChange={(e) => setText(c._id, e.target.value)} />
                    <Button size="sm" variant="outline-danger" onClick={() => removeChoice(c._id)}>Remove</Button>
                </div>
            ))}
            <Button size="sm" variant="outline-secondary" onClick={addChoice}>+ Add Another Answer</Button>
        </div>
    );
}

// True/false: correct answer is a boolean.
function TrueFalse({ q, set }: any) {
    return (
        <div>
            <Form.Label>Correct Answer</Form.Label>
            <Form.Check type="radio" name={`tf-${q._id}`} label="True"
                checked={q.correctAnswer === true} onChange={() => set({ correctAnswer: true })} />
            <Form.Check type="radio" name={`tf-${q._id}`} label="False"
                checked={q.correctAnswer === false} onChange={() => set({ correctAnswer: false })} />
        </div>
    );
}

// Fill in the blank: any number of acceptable answers (case-insensitive).
function FillBlank({ q, set }: any) {
    const answers = q.answers || [];
    const update = (a: string[]) => set({ answers: a });
    const addAnswer = () => update([...answers, ""]);
    const removeAnswer = (i: number) => update(answers.filter((_: any, idx: number) => idx !== i));
    const setAnswer = (i: number, val: string) => update(answers.map((a: string, idx: number) => (idx === i ? val : a)));
    return (
        <div>
            <Form.Label>Possible Correct Answers (case-insensitive)</Form.Label>
            {answers.map((a: string, i: number) => (
                <div key={i} className="d-flex align-items-center gap-2 mb-2">
                    <Form.Control as="textarea" rows={1} value={a} placeholder="Possible answer"
                        onChange={(e) => setAnswer(i, e.target.value)} />
                    <Button size="sm" variant="outline-danger" onClick={() => removeAnswer(i)}>Remove</Button>
                </div>
            ))}
            <Button size="sm" variant="outline-secondary" onClick={addAnswer}>+ Add Another Answer</Button>
        </div>
    );
}

export default function QuestionEditor({ question, onSave, onCancel }: any) {
    // Work on a copy so Cancel discards changes.
    const [q, setQ] = useState<any>({
        ...question,
        choices: question.choices ? question.choices.map((c: any) => ({ ...c })) : [],
        answers: question.answers ? [...question.answers] : [],
    });
    const set = (patch: any) => setQ((p: any) => ({ ...p, ...patch }));

    const changeType = (type: string) => {
        setQ((p: any) => {
            const next = { ...p, type };
            if (type === "MULTIPLE_CHOICE" && (!next.choices || next.choices.length === 0))
                next.choices = [{ _id: uuid(), text: "", correct: true }, { _id: uuid(), text: "", correct: false }];
            if (type === "TRUE_FALSE" && typeof next.correctAnswer !== "boolean") next.correctAnswer = true;
            if (type === "FILL_BLANK" && (!next.answers || next.answers.length === 0)) next.answers = [""];
            return next;
        });
    };

    return (
        <div className="p-3">
            <div className="row g-3 mb-2">
                <div className="col-md-7">
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={q.title || ""} onChange={(e) => set({ title: e.target.value })} />
                </div>
                <div className="col-md-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select value={q.type} onChange={(e) => changeType(e.target.value)}>
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TRUE_FALSE">True/False</option>
                        <option value="FILL_BLANK">Fill in the Blank</option>
                    </Form.Select>
                </div>
                <div className="col-md-2">
                    <Form.Label>Points</Form.Label>
                    <Form.Control type="number" value={q.points ?? 0} onChange={(e) => set({ points: Number(e.target.value) })} />
                </div>
            </div>

            <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <RichText value={q.question} onChange={(v: string) => set({ question: v })} minHeight={120} />
            </Form.Group>

            {q.type === "MULTIPLE_CHOICE" && <MultipleChoice q={q} set={set} />}
            {q.type === "TRUE_FALSE" && <TrueFalse q={q} set={set} />}
            {q.type === "FILL_BLANK" && <FillBlank q={q} set={set} />}

            <hr />
            <div className="d-flex gap-2">
                <Button variant="light" className="border" onClick={onCancel}>Cancel</Button>
                <Button variant="danger" onClick={() => onSave(q)}>Update Question</Button>
            </div>
        </div>
    );
}
