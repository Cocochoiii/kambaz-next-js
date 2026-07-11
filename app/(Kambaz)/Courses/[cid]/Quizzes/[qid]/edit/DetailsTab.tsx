"use client";

import { Form } from "react-bootstrap";
import RichText from "../../RichText";
import { totalPoints } from "../../helpers";

// Convert a stored date string to a value the datetime-local input accepts.
const toLocal = (d?: string) => {
    if (!d) return "";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d.length >= 16 ? d.slice(0, 16) : d;
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
};

export default function DetailsTab({ quiz, set }: any) {
    return (
        <div style={{ maxWidth: 820 }}>
            <Form.Group className="mb-3">
                <Form.Label>Quiz Name</Form.Label>
                <Form.Control value={quiz.title || ""} onChange={(e) => set({ title: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Quiz Instructions / Description</Form.Label>
                <RichText value={quiz.description} onChange={(v: string) => set({ description: v })} minHeight={140} />
            </Form.Group>

            <div className="row g-3">
                <div className="col-md-6">
                    <Form.Label>Quiz Type</Form.Label>
                    <Form.Select value={quiz.quizType || "Graded Quiz"} onChange={(e) => set({ quizType: e.target.value })}>
                        <option>Graded Quiz</option>
                        <option>Practice Quiz</option>
                        <option>Graded Survey</option>
                        <option>Ungraded Survey</option>
                    </Form.Select>
                </div>
                <div className="col-md-6">
                    <Form.Label>Assignment Group</Form.Label>
                    <Form.Select value={quiz.assignmentGroup || "Quizzes"} onChange={(e) => set({ assignmentGroup: e.target.value })}>
                        <option>Quizzes</option>
                        <option>Exams</option>
                        <option>Assignments</option>
                        <option>Project</option>
                    </Form.Select>
                </div>
                <div className="col-md-6">
                    <Form.Label>Points</Form.Label>
                    <Form.Control type="number" value={totalPoints(quiz)} readOnly disabled />
                    <div className="form-text">Sum of all question points.</div>
                </div>
                <div className="col-md-6">
                    <Form.Label>Access Code</Form.Label>
                    <Form.Control value={quiz.accessCode || ""} placeholder="(blank)" onChange={(e) => set({ accessCode: e.target.value })} />
                </div>
            </div>

            <div className="mt-3">
                <Form.Check type="checkbox" label="Shuffle Answers"
                    checked={quiz.shuffleAnswers !== false} onChange={(e) => set({ shuffleAnswers: e.target.checked })} />
                <Form.Check type="checkbox" label="Shuffle Questions"
                    checked={!!quiz.shuffleQuestions} onChange={(e) => set({ shuffleQuestions: e.target.checked })} />

                <div className="d-flex align-items-center gap-2 my-2">
                    <Form.Check type="checkbox" label="Time Limit"
                        checked={quiz.hasTimeLimit !== false} onChange={(e) => set({ hasTimeLimit: e.target.checked })} />
                    <Form.Control type="number" style={{ width: 110 }} value={quiz.timeLimit ?? 20}
                        onChange={(e) => set({ timeLimit: Number(e.target.value) })} />
                    <span className="text-muted">Minutes</span>
                </div>

                <Form.Check type="checkbox" label="Allow Multiple Attempts"
                    checked={!!quiz.multipleAttempts} onChange={(e) => set({ multipleAttempts: e.target.checked })} />
                {quiz.multipleAttempts && (
                    <div className="d-flex align-items-center gap-2 my-2">
                        <Form.Label className="mb-0">How Many Attempts</Form.Label>
                        <Form.Control type="number" min={1} style={{ width: 100 }} value={quiz.howManyAttempts ?? 1}
                            onChange={(e) => set({ howManyAttempts: Number(e.target.value) })} />
                    </div>
                )}

                <Form.Check type="checkbox" label="Show Correct Answers"
                    checked={!!quiz.showCorrectAnswers}
                    onChange={(e) => set({ showCorrectAnswers: e.target.checked ? "Immediately" : "" })} />
                <Form.Check type="checkbox" label="One Question at a Time"
                    checked={quiz.oneQuestionAtATime !== false} onChange={(e) => set({ oneQuestionAtATime: e.target.checked })} />
                <Form.Check type="checkbox" label="Webcam Required"
                    checked={!!quiz.webcamRequired} onChange={(e) => set({ webcamRequired: e.target.checked })} />
                <Form.Check type="checkbox" label="Lock Questions After Answering"
                    checked={!!quiz.lockQuestionsAfterAnswering} onChange={(e) => set({ lockQuestionsAfterAnswering: e.target.checked })} />
            </div>

            <div className="row g-3 mt-2">
                <div className="col-md-4">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control type="datetime-local" value={toLocal(quiz.dueDate)} onChange={(e) => set({ dueDate: e.target.value })} />
                </div>
                <div className="col-md-4">
                    <Form.Label>Available Date</Form.Label>
                    <Form.Control type="datetime-local" value={toLocal(quiz.availableDate)} onChange={(e) => set({ availableDate: e.target.value })} />
                </div>
                <div className="col-md-4">
                    <Form.Label>Until Date</Form.Label>
                    <Form.Control type="datetime-local" value={toLocal(quiz.untilDate)} onChange={(e) => set({ untilDate: e.target.value })} />
                </div>
            </div>
        </div>
    );
}
