"use client";

// The Inbox screen. Canvas has it, the book does not.
// The list is on the left. The open message is on the right.
// Reading one marks it as read on the server.
import { useEffect, useState } from "react";
import { Badge, Button, Col, ListGroup, Row } from "react-bootstrap";
import { FaTrash } from "react-icons/fa6";
import { FaUserCircle, FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import MessageEditor from "./MessageEditor";
import { setMessages, updateMessage, deleteMessage } from "./reducer";
import * as client from "./client";
import { isFacultyNow } from "../Account/roles";

// I cut the date myself, so the server and the browser agree.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(date?: string) {
  if (!date) { return ""; }
  const [, month, day] = date.slice(0, 10).split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

function longDate(date?: string) {
  if (!date) { return ""; }
  const [year, month, day] = date.slice(0, 10).split("-");
  const clock = date.slice(11, 16);
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year} at ${clock}`;
}

export default function Inbox() {
  const { messages } = useSelector((state: any) => state.messagesReducer);
  const { currentUser, viewAsStudent } = useSelector(
    (state: any) => state.accountReducer
  );
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();

  // The message I am reading, and the compose dialog.
  const [openId, setOpenId] = useState("");
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState({
    course: "", to: "", subject: "", body: "",
  });

  const myId = currentUser ? currentUser._id : "";
  const isFaculty = isFacultyNow(currentUser, viewAsStudent);

  // Compose uses my courses. Faculty sees every course.
  const myCourses = isFaculty
    ? courses
    : courses.filter((course: any) =>
        enrollments.some(
          (e: any) => e.user === myId && e.course === course._id
        )
      );

  const fetchMessages = async () => {
    const found = await client.findMyMessages();
    dispatch(setMessages(found));
  };

  useEffect(() => {
    if (currentUser) {
      fetchMessages();
    }
  }, [currentUser]);

  // Opening a message marks it as read on the server.
  const open = async (message: any) => {
    setOpenId(message._id);
    if (!message.read) {
      const updated = await client.updateMessage({ ...message, read: true });
      dispatch(updateMessage(updated));
    }
  };

  const send = async () => {
    await client.sendMessage(draft);
    setDraft({ course: "", to: "", subject: "", body: "" });
  };

  const remove = async (messageId: string) => {
    if (window.confirm("Are you sure you want to remove this message?")) {
      await client.deleteMessage(messageId);
      dispatch(deleteMessage(messageId));
      if (openId === messageId) { setOpenId(""); }
    }
  };

  const openMessage = messages.find((m: any) => m._id === openId);
  const unread = messages.filter((m: any) => !m.read).length;

  return (
    <div id="wd-inbox">
      {/* The button floats right, so it comes first. */}
      <div className="clearfix mb-3">
        <Button
          id="wd-compose-message"
          variant="danger"
          className="float-end"
          onClick={() => setShow(true)}
        >
          Compose
        </Button>
        <h2 className="float-start">
          Inbox{" "}
          {unread > 0 && (
            <Badge bg="danger" id="wd-unread-count">{unread}</Badge>
          )}
        </h2>
      </div>

      <MessageEditor
        show={show}
        handleClose={() => setShow(false)}
        message={draft}
        setMessage={setDraft}
        sendMessage={send}
        myCourses={myCourses}
        myId={myId}
      />

      <Row>
        {/* The list of messages */}
        <Col md={5}>
          <ListGroup id="wd-message-list" className="rounded-0">
            {messages.map((message: any) => (
              <ListGroup.Item
                key={message._id}
                role="button"
                onClick={() => open(message)}
                className={
                  message._id === openId
                    ? "wd-message border-start border-4 border-danger"
                    : "wd-message"
                }
              >
                <FaTrash
                  role="button"
                  aria-label="Remove message"
                  className="text-danger float-end mt-1"
                  onClick={(event) => {
                    event.stopPropagation();
                    remove(message._id);
                  }}
                />
                {/* A closed envelope means I have not read it yet. */}
                {message.read
                  ? <FaEnvelopeOpen className="text-secondary me-2" />
                  : <FaEnvelope className="text-danger me-2" />}
                <span className={message.read ? "" : "fw-bold"}>
                  {message.subject}
                </span>
                <div className="text-muted small ms-4">
                  {message.fromName} · {message.courseName} ·{" "}
                  {shortDate(message.date)}
                </div>
              </ListGroup.Item>
            ))}
            {messages.length === 0 && (
              <ListGroup.Item className="text-muted">
                No messages yet.
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>

        {/* The message I opened */}
        <Col md={7}>
          {!openMessage && (
            <div className="text-muted" id="wd-no-message">
              Choose a message to read it.
            </div>
          )}
          {openMessage && (
            <div id="wd-message-body-pane" className="border p-3">
              <h4>{openMessage.subject}</h4>
              <div className="mb-3">
                <FaUserCircle className="me-2 fs-3 text-secondary" />
                <b>{openMessage.fromName}</b>
                <div className="text-muted small">
                  {openMessage.courseName} · {longDate(openMessage.date)}
                </div>
              </div>
              <p>{openMessage.body}</p>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
