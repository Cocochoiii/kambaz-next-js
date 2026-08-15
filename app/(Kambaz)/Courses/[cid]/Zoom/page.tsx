"use client";

// The Zoom screen. Canvas has it, the book does not.
// Two tabs: Upcoming and Previous. Faculty can add and remove.
// The list comes from the server, like the modules.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Nav, Table } from "react-bootstrap";
import { FaVideo } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useIsFaculty } from "../../../Account/roles";
import MeetingEditor from "./MeetingEditor";
import { setMeetings, addMeeting, deleteMeeting } from "./reducer";
import * as coursesClient from "../../client";
import * as meetingsClient from "./client";

// I cut the time myself, so the server and the browser agree.
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

  const isFaculty = useIsFaculty();

  const courseMeetings = meetings.filter((m: any) => m.course === cid);
  const upcoming = courseMeetings.filter((m: any) => !m.past);
  const previous = courseMeetings.filter((m: any) => m.past);
  const shown = tab === "upcoming" ? upcoming : previous;

  // Read the meetings of this course.
  const fetchMeetings = async () => {
    const found = await coursesClient.findMeetingsForCourse(cid);
    dispatch(setMeetings(found));
  };

  useEffect(() => {
    if (cid) {
      fetchMeetings();
    }
  }, [cid]);

  const schedule = async () => {
    const created = await coursesClient.createMeetingForCourse(cid, {
      topic: meeting.topic,
      startTime: `${meeting.date}T${meeting.hour}:00`,
      duration: meeting.duration,
      // Canvas gives every meeting a number. Mine is the clock.
      meetingId: new Date().getTime().toString().slice(-11),
      host: currentUser?._id,
      // A new meeting is always in the Upcoming tab.
      past: false,
    });
    dispatch(addMeeting(created));
    setMeeting({ topic: "", date: "", hour: "18:00", duration: 90 });
    setShow(false);
    setTab("upcoming");
  };

  const remove = async (meetingId: string) => {
    if (window.confirm("Are you sure you want to remove this meeting?")) {
      await meetingsClient.deleteMeeting(meetingId);
      dispatch(deleteMeeting(meetingId));
    }
  };

  return (
    <div id="wd-zoom">
      {/* The button floats right, so it comes first. */}
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

      {/* The tab I am on is active. */}
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
