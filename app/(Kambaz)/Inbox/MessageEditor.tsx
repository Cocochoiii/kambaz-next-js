"use client";

// The dialog that writes a new message. Same shape as AnnouncementEditor.
// I pick a course first. The people of that course become the recipients,
// so this reuses the route the People screen already uses.
import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import * as coursesClient from "../Courses/client";

export default function MessageEditor({
  show,
  handleClose,
  message,
  setMessage,
  sendMessage,
  myCourses,
  myId,
}: {
  show: boolean;
  handleClose: () => void;
  message: { course: string; to: string; subject: string; body: string };
  setMessage: (message: any) => void;
  sendMessage: () => void;
  myCourses: any[];
  myId: string;
}) {
  const [people, setPeople] = useState<any[]>([]);

  // Every time I change the course I load the people of that course.
  const fetchPeople = async () => {
    if (!message.course) {
      setPeople([]);
      return;
    }
    const found = await coursesClient.findUsersForCourse(message.course);
    setPeople(found.filter((person: any) => person._id !== myId));
  };

  useEffect(() => {
    fetchPeople();
  }, [message.course]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label htmlFor="wd-message-course">Course</Form.Label>
        <Form.Select
          id="wd-message-course"
          className="mb-3"
          value={message.course}
          onChange={(e) =>
            setMessage({ ...message, course: e.target.value, to: "" })
          }
        >
          <option value="">Choose a course</option>
          {myCourses.map((course: any) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </Form.Select>

        <Form.Label htmlFor="wd-message-to">To</Form.Label>
        <Form.Select
          id="wd-message-to"
          className="mb-3"
          value={message.to}
          onChange={(e) => setMessage({ ...message, to: e.target.value })}
        >
          <option value="">Choose a person</option>
          {people.map((person: any) => (
            <option key={person._id} value={person._id}>
              {person.firstName} {person.lastName} ({person.role})
            </option>
          ))}
        </Form.Select>

        <Form.Label htmlFor="wd-message-subject">Subject</Form.Label>
        <Form.Control
          id="wd-message-subject"
          className="mb-3"
          placeholder="Subject"
          value={message.subject}
          onChange={(e) => setMessage({ ...message, subject: e.target.value })}
        />

        <Form.Label htmlFor="wd-message-body">Message</Form.Label>
        <Form.Control
          id="wd-message-body"
          as="textarea"
          rows={5}
          placeholder="Write your message here"
          value={message.body}
          onChange={(e) => setMessage({ ...message, body: e.target.value })}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="danger"
          id="wd-send-message-btn"
          disabled={!message.to || !message.subject}
          onClick={() => {
            sendMessage();
            handleClose();
          }}
        >
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
