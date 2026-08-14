"use client";

// The dialog that changes one score.
// 4.3 The score lives in the Grades screen and arrives here as a prop.
// The error is not state. I work it out from the score every time.
import { Modal, Form, Button } from "react-bootstrap";

export default function GradeEditor({
  show,
  handleClose,
  studentName,
  assignmentTitle,
  maxPoints,
  score,
  setScore,
  saveGrade,
}: {
  show: boolean;
  handleClose: () => void;
  studentName: string;
  assignmentTitle: string;
  maxPoints: number;
  score: string;
  setScore: (score: string) => void;
  saveGrade: () => void;
}) {
  const value = parseFloat(score);
  const error =
    score.trim() === "" ? "Please type a score"
    : isNaN(value) ? "Please type a number"
    : value < 0 ? "The score cannot be less than 0"
    : value > maxPoints ? `The score cannot be more than ${maxPoints}`
    : "";

  const percent = error ? 0 : (value / maxPoints) * 100;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Grade</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-1"><b>{studentName}</b></p>
        <p className="text-muted">{assignmentTitle}</p>

        <Form.Label htmlFor="wd-grade-score">Score</Form.Label>
        <div className="input-group">
          <Form.Control
            id="wd-grade-score"
            type="number"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
          <span className="input-group-text">/ {maxPoints}</span>
        </div>

        {error && <p className="text-danger mt-2 mb-0">{error}</p>}
        {!error && (
          <p className="text-muted mt-2 mb-0">{percent.toFixed(1)}%</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="danger"
          id="wd-save-grade-btn"
          disabled={error !== ""}
          onClick={saveGrade}
        >
          Save Grade
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
