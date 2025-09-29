"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { IoChevronBack, IoChevronForward, IoCalendarClearOutline } from "react-icons/io5";

/** ---------- helpers ---------- */
type CalEvent = {
    id: string;
    title: string;
    date: string;      // ISO "YYYY-MM-DD"
    course?: string;
    color?: string;
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

function monthMatrix(anchor: Date): Date[][] {
    const first = firstOfMonth(anchor);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay()); // back to Sunday

    const weeks: Date[][] = [];
    const cur = new Date(start);
    for (let w = 0; w < 6; w++) {
        const row: Date[] = [];
        for (let d = 0; d < 7; d++) {
            row.push(new Date(cur));
            cur.setDate(cur.getDate() + 1);
        }
        weeks.push(row);
    }
    return weeks;
}

/** Course colors */
const COURSE_COLORS: Record<string, string> = {
    CS5610: "#3b82f6",
    CS5520: "#8b5cf6",
    CS5004: "#f59e0b",
    CS5200: "#06b6d4",
    CS5800: "#ef4444",
    CS6620: "#a855f7",
    CS6510: "#10b981",
};

/** ---------- inline fallback styles (so the grid always renders) ---------- */
const GRID_HEAD_STYLE: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 2,
    background: "#f8f9fa",
    border: "1px solid #e5e7eb",
    borderBottom: "none",
};
const GRID_BODY_STYLE: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: 2,
    gridAutoRows: "140px",
    border: "1px solid #e5e7eb",
    background: "#fff",
};
const CELL_STYLE: React.CSSProperties = {
    position: "relative",
    padding: "6px 8px 8px",
    borderTop: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    overflow: "hidden",
};
const DATE_STYLE: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#6b7280" };
const TODAY_BADGE_STYLE: React.CSSProperties = {
    color: "#111827",
    background: "#e0e7ff",
    padding: "2px 6px",
    borderRadius: 6,
    display: "inline-block",
};
const PILL_STYLE: React.CSSProperties = {
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: 6,
    background: "#f3f4f6",
    whiteSpace: "nowrap",
};
const DOT = (bg: string): React.CSSProperties => ({
    width: 8,
    height: 8,
    borderRadius: 999,
    display: "inline-block",
    background: bg,
});

/** ---------- component ---------- */
export default function CalendarPage() {
    const [view, setView] = useState<"week" | "month" | "agenda">("month");
    const [cursor, setCursor] = useState<Date>(new Date());

    // Your Redux data
    const { assignments } = useSelector((s: any) => s.assignmentsReducer);
    const { courses } = useSelector((s: any) => s.coursesReducer);

    const courseLabels: string[] = useMemo(
        () => courses.map((c: any) => c.number ?? `CS${c._id}`),
        [courses]
    );

    const [enabledCals, setEnabledCals] = useState<Record<string, boolean>>(
        () => Object.fromEntries(courseLabels.map((num) => [num, true]))
    );

    const events: CalEvent[] = useMemo(() => {
        return assignments
            .filter((a: any) => !!a.dueDate)
            .map((a: any) => {
                const courseNum =
                    courses.find((c: any) => c._id === a.course)?.number ?? `CS${a.course}`;
                return {
                    id: a._id,
                    title: a.title,
                    date: (a.dueDate as string).slice(0, 10), // normalize to YYYY-MM-DD
                    course: courseNum,
                    color: COURSE_COLORS[courseNum] || "#64748b",
                } as CalEvent;
            });
    }, [assignments, courses]);

    const weeks = useMemo(() => monthMatrix(cursor), [cursor]);
    const monthLabel = `${cursor.toLocaleString("default", { month: "long" })} ${cursor.getFullYear()}`;
    const todayIso = iso(new Date());
    const inMonth = (d: Date) => d.getMonth() === cursor.getMonth();

    const goToday = () => setCursor(new Date());
    const goPrev  = () => setCursor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goNext  = () => setCursor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    const eventsByDay = useMemo(() => {
        const map: Record<string, CalEvent[]> = {};
        for (const ev of events) {
            if (ev.course && enabledCals[ev.course] === false) continue;
            (map[ev.date] ||= []).push(ev);
        }
        Object.values(map).forEach(arr => arr.sort((a, b) => a.title.localeCompare(b.title)));
        return map;
    }, [events, enabledCals]);

    const [moreOpen, setMoreOpen] = useState<{ date?: string; items: CalEvent[] }>({ items: [] });
    const openMore = (date: string, items: CalEvent[]) => setMoreOpen({ date, items });
    const closeMore = () => setMoreOpen({ items: [] });

    return (
        <div id="wd-calendar" className="container-fluid">
            {/* Toolbar */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <Button variant="light" className="border" onClick={goToday}>Today</Button>
                <ButtonGroup>
                    <Button variant="light" className="border" onClick={goPrev}><IoChevronBack /></Button>
                    <Button variant="light" className="border" onClick={goNext}><IoChevronForward /></Button>
                </ButtonGroup>
                <h5 className="mb-0 ms-2 fw-semibold">{monthLabel}</h5>

                <div className="ms-auto">
                    <ButtonGroup>
                        <Button variant={view === "week" ? "secondary" : "light"} className="border" onClick={() => setView("week")}>Week</Button>
                        <Button variant={view === "month" ? "secondary" : "light"} className="border" onClick={() => setView("month")}>Month</Button>
                        <Button variant={view === "agenda" ? "secondary" : "light"} className="border" onClick={() => setView("agenda")}>Agenda</Button>
                    </ButtonGroup>
                    <Button variant="light" className="border ms-2">
                        <IoCalendarClearOutline className="me-1" /> +
                    </Button>
                </div>
            </div>

            {/* 2-column layout */}
            <div className="row">
                {/* Main */}
                <div className="col-12 col-lg-9">
                    {/* Weekday header (desktop) */}
                    <div className="d-none d-lg-block">
                        <div className="row g-0 border border-bottom-0 rounded-top bg-light text-center small fw-semibold">
                            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d) => (
                                <div key={d} className="col py-2">{d}</div>
                            ))}
                        </div>
                    </div>

                    {/* Month grid */}
                    {view === "month" && (
                        <div style={GRID_BODY_STYLE}>
                            {weeks.flat().map((day, idx) => {
                                const key = iso(day);
                                const items = eventsByDay[key] ?? [];
                                const faded = !inMonth(day);
                                const isToday = key === todayIso;

                                const visible = items.slice(0, 3);
                                const hiddenCount = Math.max(0, items.length - visible.length);

                                // remove right border on last column
                                const cellStyle = {
                                    ...CELL_STYLE,
                                    borderRight: (idx + 1) % 7 === 0 ? "none" : CELL_STYLE.borderRight,
                                    background: faded ? "#fafafa" : "#fff",
                                    color: faded ? "#9ca3af" : "inherit",
                                } as React.CSSProperties;

                                return (
                                    <div key={idx} style={cellStyle}>
                                        <div style={isToday ? { ...DATE_STYLE, ...TODAY_BADGE_STYLE } : DATE_STYLE}>
                                            {day.getDate()}
                                        </div>

                                        {visible.map((ev) => (
                                            <div key={ev.id} className="text-truncate mt-1" style={PILL_STYLE} title={`${ev.title} • ${ev.course ?? ""}`}>
                                                <span className="me-1" style={DOT(ev.color || "#64748b")} />
                                                {ev.title}
                                            </div>
                                        ))}

                                        {hiddenCount > 0 && (
                                            <button className="btn btn-link p-0 small mt-1" onClick={() => openMore(key, items)}>
                                                +{hiddenCount} more
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {view === "agenda" && (
                        <div className="border rounded p-3 bg-white">
                            <div className="small text-muted mb-2">Agenda</div>
                            {events
                                .slice()
                                .sort((a, b) => a.date.localeCompare(b.date))
                                .map((ev) => (
                                    <div key={ev.id} className="d-flex align-items-center py-2 border-top">
                                        <div className="me-3 small text-muted" style={{ width: 100 }}>{ev.date}</div>
                                        <div>
                                            <span className="me-2" style={DOT(ev.color || "#64748b")} />
                                            <strong className="me-2">{ev.title}</strong>
                                            <span className="text-muted">{ev.course}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {view === "week" && (
                        <div className="border rounded p-4 bg-white text-muted">
                            Week view not implemented.
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="col-12 col-lg-3 mt-4 mt-lg-0">
                    <div className="border rounded p-2 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between px-2">
                            <strong className="small">{monthLabel}</strong>
                            <div>
                                <Button size="sm" variant="light" className="border me-1" onClick={goPrev}><IoChevronBack /></Button>
                                <Button size="sm" variant="light" className="border" onClick={goNext}><IoChevronForward /></Button>
                            </div>
                        </div>

                        {/* Mini calendar */}
                        <div
                            style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}
                            className="mt-2"
                        >
                            {["S","M","T","W","T","F","S"].map((d) => (
                                <div key={d} className="text-center text-muted small">{d}</div>
                            ))}
                            {weeks.flat().map((d, i) => {
                                const dim = d.getMonth() !== cursor.getMonth();
                                const isToday = iso(d) === todayIso;
                                return (
                                    <div key={i} className={`text-center py-1 small ${dim ? "text-muted" : ""}`}>
                    <span
                        className={isToday ? "" : ""}
                        style={{
                            display: "inline-block",
                            width: 24,
                            height: 24,
                            lineHeight: "24px",
                            borderRadius: 6,
                            background: isToday ? "#e0e7ff" : "transparent",
                            fontWeight: isToday ? 600 : 400,
                        }}
                    >
                      {d.getDate()}
                    </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border rounded p-3 bg-white">
                        <div className="small fw-semibold mb-2">CALENDARS</div>
                        {courseLabels.map((label) => (
                            <div key={label} className="d-flex align-items-center mb-2">
                                <span className="me-2" style={DOT(COURSE_COLORS[label] || "#64748b")} />
                                <Form.Check
                                    type="checkbox"
                                    id={`cal-${label}`}
                                    label={label}
                                    checked={enabledCals[label] ?? true}
                                    onChange={(e) =>
                                        setEnabledCals((prev) => ({ ...prev, [label]: e.currentTarget.checked }))
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* +N more modal */}
            <Modal show={moreOpen.items.length > 0} onHide={closeMore} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Events — {moreOpen.date}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {moreOpen.items.map((ev) => (
                        <div key={ev.id} className="d-flex align-items-center mb-2">
                            <span className="me-2" style={DOT(ev.color || "#64748b")} />
                            <div className="fw-semibold me-2">{ev.title}</div>
                            <span className="text-muted small">{ev.course}</span>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeMore}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
