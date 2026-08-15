"use client";

// The Calendar screen. Canvas has a month grid and an agenda.
// The Calendar keeps no data. The server collects the assignment due
// dates, the Zoom meetings and the announcements of my courses.
import { useEffect, useState } from "react";
import { Button, ListGroup, Nav, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as client from "./client";

// I cut the date myself, so the server and the browser agree.
const MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday",
              "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Two digits, so the text matches the dates the server sends.
function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

// A key like 2025-01-19. I compare these as plain text.
function dayKey(year: number, month: number, date: number) {
  return `${year}-${pad(month + 1)}-${pad(date)}`;
}

// A day title like "Monday, January 19, 2025".
function dayTitle(day: string) {
  const [year, month, date] = day.split("-");
  // Noon keeps the day the same in every time zone.
  const weekday = new Date(`${day}T12:00:00`).getDay();
  return `${DAYS[weekday]}, ${MONTHS[Number(month) - 1]} ${Number(date)}, ${year}`;
}

function clockOf(date: string) {
  const clock = date.slice(11, 16);
  return clock ? clock : "all day";
}

// One color per kind of event, the way Canvas colors its dots.
const DOTS: Record<string, string> = {
  assignment: "text-danger",
  meeting: "text-primary",
  announcement: "text-secondary",
};
const LABELS: Record<string, string> = {
  assignment: "Assignment due",
  meeting: "Zoom meeting",
  announcement: "Announcement",
};

export default function Calendar() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [events, setEvents] = useState<any[]>([]);
  const [tab, setTab] = useState("month");
  const [onlyComing, setOnlyComing] = useState(true);

  // The clock only runs in the browser.
  // Reading it while rendering makes the server and the browser disagree.
  // So I read it after the screen loads.
  const [today, setToday] = useState("");
  const [cursor, setCursor] = useState({ year: 0, month: 0 });
  const [picked, setPicked] = useState("");

  const fetchEvents = async () => {
    const found = await client.findMyEvents();
    setEvents(found);
  };

  useEffect(() => {
    const now = new Date();
    setToday(dayKey(now.getFullYear(), now.getMonth(), now.getDate()));
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser]);

  // The courses can be from an older term.
  // An empty month looks broken, so I open on the next event.
  // If every event is past, I open on the last one.
  useEffect(() => {
    if (events.length === 0) {
      return;
    }
    const coming = events.filter(
      (event: any) => event.date.slice(0, 10) >= today
    );
    const focus = coming.length > 0 ? coming[0] : events[events.length - 1];
    const [year, month] = focus.date.slice(0, 7).split("-");
    setCursor({ year: Number(year), month: Number(month) - 1 });
    setOnlyComing(coming.length > 0);
  }, [events]);

  const eventsOn = (day: string) =>
    events.filter((event: any) => event.date.slice(0, 10) === day);

  // ---- the month grid ----
  // getDay of the first day says how many empty boxes come first.
  // Day 0 of the next month is the last day of this one.
  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();

  const boxes: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    boxes.push(null);
  }
  for (let date = 1; date <= daysInMonth; date++) {
    boxes.push(date);
  }
  // The last row needs empty boxes too, so every row has seven.
  while (boxes.length % 7 !== 0) {
    boxes.push(null);
  }
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < boxes.length; i += 7) {
    weeks.push(boxes.slice(i, i + 7));
  }

  const goMonth = (step: number) => {
    const month = cursor.month + step;
    if (month < 0) {
      setCursor({ year: cursor.year - 1, month: 11 });
    } else if (month > 11) {
      setCursor({ year: cursor.year + 1, month: 0 });
    } else {
      setCursor({ year: cursor.year, month });
    }
    setPicked("");
  };

  const goToday = () => {
    const now = new Date();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    setPicked(today);
  };

  // ---- the agenda ----
  const shown = onlyComing && today
    ? events.filter((event: any) => event.date.slice(0, 10) >= today)
    : events;

  // One group per day. The list already arrives in date order.
  const agendaDays: string[] = [];
  shown.forEach((event: any) => {
    const day = event.date.slice(0, 10);
    if (!agendaDays.includes(day)) {
      agendaDays.push(day);
    }
  });

  // The clock is not read yet on the very first render.
  if (!today) {
    return <div id="wd-calendar"><h2>Calendar</h2></div>;
  }

  return (
    <div id="wd-calendar">
      <h2 className="mb-3">Calendar</h2>

      {/* The tab I am on is active. */}
      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link id="wd-month-tab" active={tab === "month"}
                    onClick={() => setTab("month")}>
            Month
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link id="wd-agenda-tab" active={tab === "agenda"}
                    onClick={() => setTab("agenda")}>
            Agenda
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* A short legend, so the colors mean something. */}
      <div className="mb-3 text-muted small" id="wd-calendar-legend">
        {Object.keys(LABELS).map((type) => (
          <span key={type} className="me-3">
            <span className={DOTS[type]}>&#9679;</span> {LABELS[type]}
          </span>
        ))}
      </div>

      {tab === "month" && (
        <div id="wd-calendar-month">
          <div className="clearfix mb-2">
            <div className="float-end">
              <Button id="wd-prev-month" variant="outline-secondary" size="sm"
                      className="me-2" onClick={() => goMonth(-1)}>
                Previous
              </Button>
              <Button id="wd-today" variant="outline-danger" size="sm"
                      className="me-2" onClick={goToday}>
                Today
              </Button>
              <Button id="wd-next-month" variant="outline-secondary" size="sm"
                      onClick={() => goMonth(1)}>
                Next
              </Button>
            </div>
            <h4 className="float-start mb-0" id="wd-month-title">
              {MONTHS[cursor.month]} {cursor.year}
            </h4>
          </div>

          <Table bordered className="wd-month-table">
            <thead>
              <tr>
                {SHORT_DAYS.map((day) => (
                  <th key={day} className="text-center bg-secondary">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, index) => (
                <tr key={index}>
                  {week.map((date, box) => {
                    // An empty box belongs to the month before or after.
                    if (date === null) {
                      return <td key={box} className="bg-light" />;
                    }
                    const day = dayKey(cursor.year, cursor.month, date);
                    const dayEvents = eventsOn(day);
                    return (
                      <td
                        key={box}
                        role="button"
                        onClick={() => setPicked(day)}
                        className={day === picked ? "table-active" : ""}
                        style={{ height: "96px", verticalAlign: "top" }}
                      >
                        <div className={day === today
                          ? "fw-bold text-danger"
                          : "text-muted small"}>
                          {date}
                        </div>
                        {/* Three fit in a box. The rest are a count. */}
                        {dayEvents.slice(0, 3).map((event: any) => (
                          <div key={event._id} className="small text-truncate">
                            <span className={DOTS[event.type]}>&#9679;</span>{" "}
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="small text-muted">
                            + {dayEvents.length - 3} more
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>

          {/* The day I clicked, in full. */}
          {picked && (
            <div id="wd-picked-day" className="mt-3">
              <h5>{dayTitle(picked)}</h5>
              <ListGroup className="rounded-0">
                {eventsOn(picked).map((event: any) => (
                  <ListGroup.Item key={event._id} className="wd-calendar-event">
                    <span className={`${DOTS[event.type]} me-2`}>&#9679;</span>
                    <b>{event.title}</b>
                    <span className="float-end text-muted small">
                      {clockOf(event.date)}
                    </span>
                    <div className="text-muted small ms-4">
                      {event.courseName} · {LABELS[event.type]} · {event.detail}
                    </div>
                  </ListGroup.Item>
                ))}
                {eventsOn(picked).length === 0 && (
                  <ListGroup.Item className="text-muted">
                    Nothing on this day.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          )}
        </div>
      )}

      {tab === "agenda" && (
        <div id="wd-calendar-agenda">
          <div className="clearfix mb-2">
            <Button
              id="wd-toggle-past"
              variant="secondary"
              size="sm"
              className="float-end"
              onClick={() => setOnlyComing(!onlyComing)}
            >
              {onlyComing ? "Show everything" : "Upcoming only"}
            </Button>
          </div>

          {agendaDays.length === 0 && (
            <div className="text-muted" id="wd-no-events">
              Nothing on the calendar.
            </div>
          )}

          {agendaDays.map((day) => (
            <div key={day} className="mb-4 wd-calendar-day">
              <h5 className={day === today ? "text-danger" : ""}>
                {dayTitle(day)}
                {day === today && <span className="ms-2">Today</span>}
              </h5>
              <ListGroup className="rounded-0">
                {eventsOn(day).map((event: any) => (
                  <ListGroup.Item key={event._id} className="wd-calendar-event">
                    <span className={`${DOTS[event.type]} me-2`}>&#9679;</span>
                    <b>{event.title}</b>
                    <span className="float-end text-muted small">
                      {clockOf(event.date)}
                    </span>
                    <div className="text-muted small ms-4">
                      {event.courseName} · {LABELS[event.type]} · {event.detail}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
