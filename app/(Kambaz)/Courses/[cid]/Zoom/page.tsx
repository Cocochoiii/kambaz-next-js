"use client";

// The Zoom screen. The book does not ask for it. Canvas has a Zoom tab.
// Two tabs, Upcoming and Previous. The data says which meetings already
// happened. Faculty can schedule one and remove one.
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button, Nav, Table } from "react-bootstrap";
import { FaVideo } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import MeetingEditor from "./MeetingEditor";
import { addMeeting, deleteMeeting } from "./reducer";

// The times look like 2025-01-13T18:00:00. I cut the text apart myself, so
// the server and the browser print the same thing.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function longTime(startTime: string) {
  const [day, clock] = startTime.split("T");
  const [, month, date] = day.split("-");
  const hour = Number(clock.slice(0, 2));
  const minute = clock.slice(3, 5);
  const half = hour < 12 ? "AM" : "PM";
  const shown = hour % 12 === 0 ? 12 : hour % 12;
  return `${MONTHS[Number(month) - 1]} ${Number(date)} at ${shown}:${minute} ${half}`;
}

export default function Zoom() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const [tab, setTab] = useState("upcoming");
  const [show, setShow] = useState(false);
  const [meeting, setMeeting] = useState({
    topic: "",
    date: "",
    hour: "18:00",
    duration: 90,
  });

  const { meetings } = useSelector((state: any) => state.meetingsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  const isFaculty = currentUser?.role === "FACULTY";

  const courseMeetings = meetings.filter((m: any) => m.course === cid);
  const upcoming = courseMeetings.filter((m: any) => !m.past);
  const previous = courseMeetings.filter((m: any) => m.past);
  const shown = tab === "upcoming" ? upcoming : previous;

  const schedule = () => {
    dispatch(addMeeting({
      course: cid,
      topic: meeting.topic,
      startTime: `${meeting.date}T${meeting.hour}:00`,
      duration: meeting.duration,
      // Canvas gives every meeting a number. Mine comes from the clock.
      meetingId: new Date().getTime().toString().slice(-11),
      host: currentUser?._id,
    }));
    setMeeting({ topic: "", date: "", hour: "18:00", duration: 90 });
    setShow(false);
    setTab("upcoming");
  };

  const remove = (meetingId: string) => {
    if (window.confirm("Are you sure you want to remove this meeting?")) {
      dispatch(deleteMeeting(meetingId));
    }
  };

  return (
    <div id="wd-zoom">
      {/* The button floats right, so I write it first. */}
      <div className="clearfix mb-3">
        {isFaculty && (
          <Button
            id="wd-schedule-meeting"
            variant="danger"
            size="lg"
            className="float-end"
            onClick={() => setShow(true)}
          >
            Schedule a Meeting
          </Button>
        )}
        <h2 className="mb-0">Zoom Meetings</h2>
      </div>

      {/* The two tabs. The one I am on is active. */}
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link
            id="wd-upcoming-tab"
            active={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
          >
            Upcoming Meetings ({upcoming.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            id="wd-previous-tab"
            active={tab === "previous"}
            onClick={() => setTab("previous")}
          >
            Previous Meetings ({previous.length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <MeetingEditor
        show={show}
        handleClose={() => setShow(false)}
        meeting={meeting}
        setMeeting={setMeeting}
        addMeeting={schedule}
      />

      <Table responsive className="mb-0">
        <thead className="bg-light">
          <tr>
            <th>Topic</th>
            <th className="text-nowrap">Time</th>
            <th className="text-nowrap">Duration</th>
            <th>Meeting ID</th>
            {isFaculty && <th />}
          </tr>
        </thead>
        <tbody>
          {shown.map((item: any) => (
            <tr key={item._id}>
              <td>
                <FaVideo className="text-primary me-2" />
                <b>{item.topic}</b>
              </td>
              <td className="text-nowrap">{longTime(item.startTime)}</td>
              <td className="text-nowrap">{item.duration} min</td>
              <td className="text-nowrap">{item.meetingId}</td>
              {isFaculty && (
                <td className="text-end">
                  <FaTrash
                    role="button"
                    aria-label="Delete meeting"
                    className="text-danger"
                    onClick={() => remove(item._id)}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      {shown.length === 0 && (
        <p className="text-muted mt-3">No meetings to show.</p>
      )}
    </div>
  );
}
