"use client";

// The dialog for a new announcement. It is the same shape as ModuleEditor.
// The two fields live in the Announcements screen, so I send them up and down.
import { Modal, Form, Button } from "react-bootstrap";

export default function AnnouncementEditor({
  show,
  handleClose,
  dialogTitle,
  announcement,
  setAnnouncement,
  addAnnouncement,
}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string;
  announcement: { title: string; content: string };
  setAnnouncement: (announcement: { title: string; content: string }) => void;
  addAnnouncement: () => void;
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label htmlFor="wd-announcement-title">Title</Form.Label>
        <Form.Control
          id="wd-announcement-title"
          className="mb-3"
          placeholder="Announcement title"
          value={announcement.title}
          onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
        />
        <Form.Label htmlFor="wd-announcement-content">Message</Form.Label>
        <Form.Control
          id="wd-announcement-content"
          as="textarea"
          rows={5}
          placeholder="Write your message here"
          value={announcement.content}
          onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="danger"
          id="wd-post-announcement-btn"
          onClick={() => {
            addAnnouncement();
            handleClose();
          }}
        >
          Post Announcement
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
