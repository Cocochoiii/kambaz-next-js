// app/(Kambaz)/Courses/[cid]/Grades/GradeEditor.tsx

"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

interface GradeEditorProps {
    show: boolean;
    onClose: () => void;
    onSave: (score: number) => void;
    studentId: string | null;
    assignmentId: string | null;
    currentGrade?: number;
    maxPoints: number;
}

export default function GradeEditor({
                                        show,
                                        onClose,
                                        onSave,
                                        studentId,
                                        assignmentId,
                                        currentGrade,
                                        maxPoints
                                    }: GradeEditorProps) {
    const [score, setScore] = useState<string>(currentGrade?.toString() || "0");
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setScore(currentGrade?.toString() || "0");
        setError("");
    }, [currentGrade]);

    const handleSubmit = () => {
        const numScore = parseFloat(score);

        // Validation
        if (isNaN(numScore)) {
            setError("Please enter a valid number");
            return;
        }

        if (numScore < 0) {
            setError("Score cannot be negative");
            return;
        }

        if (numScore > maxPoints) {
            setError(`Score cannot exceed ${maxPoints} points`);
            return;
        }

        onSave(numScore);
        onClose();
    };

    const handleScoreChange = (value: string) => {
        setScore(value);
        setError("");
    };

    const percentage = score ? ((parseFloat(score) / maxPoints) * 100).toFixed(2) : "0.00";

    // Determine letter grade
    const getLetterGrade = (percent: number) => {
        if (percent >= 93) return 'A';
        if (percent >= 90) return 'A-';
        if (percent >= 87) return 'B+';
        if (percent >= 83) return 'B';
        if (percent >= 80) return 'B-';
        if (percent >= 77) return 'C+';
        if (percent >= 73) return 'C';
        if (percent >= 70) return 'C-';
        if (percent >= 67) return 'D+';
        if (percent >= 63) return 'D';
        if (percent >= 60) return 'D-';
        return 'F';
    };

    const letterGrade = getLetterGrade(parseFloat(percentage));

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Grade</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label fw-bold">Score</label>
                    <div className="input-group">
                        <input
                            type="number"
                            className={`form-control ${error ? 'is-invalid' : ''}`}
                            value={score}
                            onChange={(e) => handleScoreChange(e.target.value)}
                            min={0}
                            max={maxPoints}
                            step={0.5}
                        />
                        <span className="input-group-text">/ {maxPoints}</span>
                    </div>
                    {error && (
                        <div className="invalid-feedback d-block">
                            {error}
                        </div>
                    )}
                    <div className="mt-2 d-flex justify-content-between">
                        <small className="text-muted">
                            Percentage: <strong>{percentage}%</strong>
                        </small>
                        <small className="text-muted">
                            Letter Grade: <strong>{letterGrade}</strong>
                        </small>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Grade Comment (Optional)</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add feedback for the student..."
                    />
                </div>

                <div className="alert alert-info">
                    <small>
                        <strong>Note:</strong> Changes will be saved immediately and will be visible to the student once grades are released.
                    </small>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!!error || score === ""}
                >
                    Save Grade
                </Button>
            </Modal.Footer>
        </Modal>
    );
}