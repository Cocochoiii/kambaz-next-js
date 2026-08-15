"use client";

// The dialog for one lesson name. It is the same shape as ModuleEditor.
// The same dialog adds a new lesson and renames an old one.
// Canvas uses a dialog here too, so I dropped the browser prompt.
import { Modal, Form, Button } from "react-bootstrap";

export default function LessonEditor({
  show,
  handleClose,
  dialogTitle,
  lessonName,
  setLessonName,
  saveLesson,
}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  lessonName: string;
  setLessonName: (name: string) => void;
  saveLesson: () => void;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label htmlFor="wd-lesson-name">Lesson name</Form.Label>
        <Form.Control
          id="wd-lesson-name"
          autoFocus
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          onKeyDown={(e) => {
            // Enter saves it, the same as the button.
            if (e.key === "Enter") {
              saveLesson();
              handleClose();
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          id="wd-save-lesson-btn"
          onClick={() => {
            saveLesson();
            handleClose();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
