"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

interface QuizModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (quiz: any) => void;
    quiz: any;
    editMode: boolean;
}

export default function QuizModal({
                                      show,
                                      onClose,
                                      onSave,
                                      quiz,
                                      editMode
                                  }: QuizModalProps) {
    const [formData, setFormData] = useState({
        _id: "",
        title: "",
        status: "Open",
        dueDate: "",
        points: 0,
        questions: 0,
        timeLimit: 20,
        attempts: 1,
        description: "",
        availableFrom: "",
        availableUntil: "",
    });

    useEffect(() => {
        if (quiz) {
            setFormData({
                _id: quiz._id || "",
                title: quiz.title || "",
                status: quiz.status || "Open",
                dueDate: quiz.dueDate || "",
                points: quiz.points || 0,
                questions: quiz.questions || 0,
                timeLimit: quiz.timeLimit || 20,
                attempts: quiz.attempts || 1,
                description: quiz.description || "",
                availableFrom: quiz.availableFrom || "",
                availableUntil: quiz.availableUntil || "",
            });
        }
    }, [quiz]);

    const handleSubmit = () => {
        if (formData.title && formData.dueDate) {
            onSave(formData);
            // Clear form after save
            setFormData({
                _id: "",
                title: "",
                status: "Open",
                dueDate: "",
                points: 0,
                questions: 0,
                timeLimit: 20,
                attempts: 1,
                description: "",
                availableFrom: "",
                availableUntil: "",
            });
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {editMode ? "Edit Quiz" : "Add Quiz"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="quiz-title" className="form-label">
                        Title <span className="text-danger">*</span>
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="quiz-title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter quiz title"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="quiz-description" className="form-label">
                        Description
                    </label>
                    <textarea
                        className="form-control"
                        id="quiz-description"
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Enter quiz instructions..."
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="quiz-status" className="form-label">
                            Status
                        </label>
                        <select
                            className="form-select"
                            id="quiz-status"
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value })
                            }
                        >
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="quiz-due-date" className="form-label">
                            Due Date <span className="text-danger">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="quiz-due-date"
                            value={formData.dueDate}
                            onChange={(e) =>
                                setFormData({ ...formData, dueDate: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="quiz-points" className="form-label">
                            Points
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="quiz-points"
                            value={formData.points}
                            onChange={(e) =>
                                setFormData({ ...formData, points: parseInt(e.target.value) || 0 })
                            }
                            min="0"
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="quiz-questions" className="form-label">
                            Questions
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="quiz-questions"
                            value={formData.questions}
                            onChange={(e) =>
                                setFormData({ ...formData, questions: parseInt(e.target.value) || 0 })
                            }
                            min="0"
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="quiz-time-limit" className="form-label">
                            Time Limit (minutes)
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="quiz-time-limit"
                            value={formData.timeLimit}
                            onChange={(e) =>
                                setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 20 })
                            }
                            min="0"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="quiz-attempts" className="form-label">
                            Allowed Attempts
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="quiz-attempts"
                            value={formData.attempts}
                            onChange={(e) =>
                                setFormData({ ...formData, attempts: parseInt(e.target.value) || 1 })
                            }
                            min="1"
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="quiz-available-from" className="form-label">
                            Available From
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="quiz-available-from"
                            value={formData.availableFrom}
                            onChange={(e) =>
                                setFormData({ ...formData, availableFrom: e.target.value })
                            }
                        />
                    </div>

                    <div className="col-md-4 mb-3">
                        <label htmlFor="quiz-available-until" className="form-label">
                            Available Until
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="quiz-available-until"
                            value={formData.availableUntil}
                            onChange={(e) =>
                                setFormData({ ...formData, availableUntil: e.target.value })
                            }
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={!formData.title || !formData.dueDate}
                >
                    {editMode ? "Save Changes" : "Add Quiz"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}