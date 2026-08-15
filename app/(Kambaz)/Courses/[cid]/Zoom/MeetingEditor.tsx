"use client";

// The dialog that adds a meeting. Same shape as ModuleEditor.
// The fields live in the Zoom screen, so they come in as props.
import { Modal, Form, Button } from "react-bootstrap";

// The hours a class can start.
const HOURS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
               "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

function hourLabel(hour: string) {
  const h = Number(hour.slice(0, 2));
  const half = h < 12 ? "AM" : "PM";
  const shown = h % 12 === 0 ? 12 : h % 12;
  return `${shown}:00 ${half}`;
}

export default function MeetingEditor({
  show,
  handleClose,
  meeting,
  setMeeting,
  addMeeting,
}: {
  show: boolean;
  handleClose: () => void;
  meeting: { topic: string; date: string; hour: string; duration: number };
  setMeeting: (meeting: any) => void;
  addMeeting: () => void;
}) {
  const error =
    meeting.topic.trim() === "" ? "Please type a topic"
    : meeting.date === "" ? "Please pick a date"
    : "";

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule a Meeting</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Label htmlFor="wd-meeting-topic">Topic</Form.Label>
        <Form.Control
          id="wd-meeting-topic"
          className="mb-3"
          placeholder="Lecture 11: Deployment"
          value={meeting.topic}
          onChange={(e) => setMeeting({ ...meeting, topic: e.target.value })}
        />

        <Form.Label htmlFor="wd-meeting-date">Date</Form.Label>
        <Form.Control
          id="wd-meeting-date"
          type="date"
          className="mb-3"
          value={meeting.date}
          onChange={(e) => setMeeting({ ...meeting, date: e.target.value })}
        />

        <Form.Label htmlFor="wd-meeting-hour">Time</Form.Label>
        <Form.Select
          id="wd-meeting-hour"
          className="form-control mb-3"
          value={meeting.hour}
          onChange={(e) => setMeeting({ ...meeting, hour: e.target.value })}
        >
          {HOURS.map((hour) => (
            <option key={hour} value={hour}>{hourLabel(hour)}</option>
          ))}
        </Form.Select>

        <Form.Label htmlFor="wd-meeting-duration">Duration in minutes</Form.Label>
        <Form.Control
          id="wd-meeting-duration"
          type="number"
          value={meeting.duration}
          onChange={(e) =>
            setMeeting({ ...meeting, duration: parseInt(e.target.value) || 0 })
          }
        />

        {error && <p className="text-danger mt-2 mb-0">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="danger"
          id="wd-schedule-meeting-btn"
          disabled={error !== ""}
          onClick={addMeeting}
        >
          Schedule
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
