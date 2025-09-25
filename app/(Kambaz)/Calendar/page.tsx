"use client";

import { useMemo, useState } from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import {
    IoChevronBack,
    IoChevronForward,
    IoCalendarClearOutline,
} from "react-icons/io5";

/** ---------- helpers ---------- */
type CalEvent = {
    id: string;
    title: string;
    date: string;          // ISO "YYYY-MM-DD"
    course?: string;       // short label shown in the sidebar list
    color?: string;        // dot color in the grid
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const lastOfMonth  = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

/** Build a 6x7 matrix of Date objects for the month view (starts on Sunday) */
function monthMatrix(anchor: Date): Date[][] {
    const first = firstOfMonth(anchor);
    const last  = lastOfMonth(anchor);

    // start on the Sunday before (or equal to) the 1st
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());

    // 6 weeks * 7 days = 42 cells
    const weeks: Date[][] = [];
    let cur = new Date(start);
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

/** ---------- sample events (replace with your data later) ---------- */
const demoEvents: CalEvent[] = [
    { id: "e1", title: "HW1 Due",            date: "2025-09-08", course: "CS5610", color: "#3b82f6" },
    { id: "e2", title: "Quiz 1",             date: "2025-09-12", course: "CS5200", color: "#06b6d4" },
    { id: "e3", title: "Lecture Cancelled",  date: "2025-09-18", course: "CS5004", color: "#f59e0b" },
    { id: "e4", title: "Project Milestone",  date: "2025-09-25", course: "CS6510", color: "#10b981" },
];

/** ---------- components ---------- */
export default function CalendarPage() {
    const [view, setView] = useState<"week" | "month" | "agenda">("month");
    const [cursor, setCursor] = useState<Date>(new Date());       // which month/week we’re showing
    const [enabledCals, setEnabledCals] = useState<Record<string, boolean>>({
        CS5610: true, CS5520: true, CS5004: true, CS5200: true, CS5800: true, CS6620: true, CS6510: true,
    });

    const weeks = useMemo(() => monthMatrix(cursor), [cursor]);
    const monthIso = `${cursor.toLocaleString("default", { month: "long" })} ${cursor.getFullYear()}`;

    const eventsByDay = useMemo(() => {
        const map: Record<string, CalEvent[]> = {};
        for (const ev of demoEvents) {
            if (ev.course && !enabledCals[ev.course]) continue;
            (map[ev.date] ||= []).push(ev);
        }
        return map;
    }, [enabledCals]);

    const inMonth = (d: Date) => d.getMonth() === cursor.getMonth();
    const todayIso = iso(new Date());

    const goToday = () => setCursor(new Date());
    const goPrev  = () => setCursor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const goNext  = () => setCursor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    return (
        <div id="wd-calendar" className="container-fluid">
            {/* Header controls */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <Button variant="light" className="border" onClick={goToday}>
                    Today
                </Button>
                <ButtonGroup>
                    <Button variant="light" className="border" onClick={goPrev}><IoChevronBack /></Button>
                    <Button variant="light" className="border" onClick={goNext}><IoChevronForward /></Button>
                </ButtonGroup>
                <h5 className="mb-0 ms-2 fw-semibold">{monthIso}</h5>

                <div className="ms-auto">
                    <ButtonGroup>
                        <Button
                            variant={view === "week" ? "secondary" : "light"}
                            className="border"
                            onClick={() => setView("week")}
                        >
                            Week
                        </Button>
                        <Button
                            variant={view === "month" ? "secondary" : "light"}
                            className="border"
                            onClick={() => setView("month")}
                        >
                            Month
                        </Button>
                        <Button
                            variant={view === "agenda" ? "secondary" : "light"}
                            className="border"
                            onClick={() => setView("agenda")}
                        >
                            Agenda
                        </Button>
                    </ButtonGroup>
                    <Button variant="light" className="border ms-2">
                        <IoCalendarClearOutline className="me-1" />
                        +
                    </Button>
                </div>
            </div>

            {/* 2-column layout */}
            <div className="row">
                {/* Left: main grid */}
                <div className="col-12 col-lg-9">
                    {/* Weekday header */}
                    <div className="wd-cal-grid wd-cal-head d-none d-lg-grid">
                        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                            <div key={d} className="text-center small fw-semibold py-2">{d}</div>
                        ))}
                    </div>

                    {/* Month view grid */}
                    {view === "month" && (
                        <div className="wd-cal-grid wd-cal-body">
                            {weeks.flat().map((day, idx) => {
                                const key = iso(day);
                                const dayEvents = eventsByDay[key] ?? [];
                                const faded = !inMonth(day);
                                const isToday = key === todayIso;
                                return (
                                    <div key={idx} className={`wd-cal-cell ${faded ? "wd-cal-faded" : ""}`}>
                                        <div className={`wd-cal-date ${isToday ? "wd-cal-today" : ""}`}>
                                            {day.getDate()}
                                        </div>

                                        {/* Events */}
                                        {dayEvents.map((ev) => (
                                            <div key={ev.id} className="wd-cal-pill text-truncate mt-1" title={ev.title}>
                        <span
                            className="wd-cal-dot me-1"
                            style={{ background: ev.color || "#64748b" }}
                        />
                                                {ev.title}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* (Optional) Simple Agenda placeholder */}
                    {view === "agenda" && (
                        <div className="border rounded p-3 bg-white">
                            <div className="small text-muted mb-2">Agenda (demo)</div>
                            {demoEvents.map((ev) => (
                                <div key={ev.id} className="d-flex align-items-center py-2 border-top">
                                    <div className="me-3 small text-muted" style={{ width: 90 }}>
                                        {ev.date}
                                    </div>
                                    <div>
                    <span
                        className="wd-cal-dot me-2"
                        style={{ background: ev.color || "#64748b" }}
                    />
                                        <strong className="me-2">{ev.title}</strong>
                                        <span className="text-muted">{ev.course}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* (Optional) Week view placeholder */}
                    {view === "week" && (
                        <div className="border rounded p-4 bg-white text-muted">
                            Week view not implemented (month is fully working).
                        </div>
                    )}
                </div>

                {/* Right: sidebar mini calendar + calendars list */}
                <div className="col-12 col-lg-3 mt-4 mt-lg-0">
                    {/* Mini calendar */}
                    <div className="border rounded p-2 bg-white mb-3">
                        <div className="d-flex align-items-center justify-content-between px-2">
                            <strong className="small">{monthIso}</strong>
                            <div>
                                <Button size="sm" variant="light" className="border me-1" onClick={goPrev}><IoChevronBack /></Button>
                                <Button size="sm" variant="light" className="border" onClick={goNext}><IoChevronForward /></Button>
                            </div>
                        </div>
                        <div className="wd-mini-grid mt-2">
                            {["S","M","T","W","T","F","S"].map((d) => (
                                <div key={d} className="text-center text-muted small">{d}</div>
                            ))}
                            {weeks.flat().map((d, i) => {
                                const dim = d.getMonth() !== cursor.getMonth();
                                const isToday = iso(d) === todayIso;
                                return (
                                    <div key={i} className={`text-center py-1 small ${dim ? "text-muted" : ""}`}>
                    <span className={`wd-mini-date ${isToday ? "wd-mini-today" : ""}`}>
                      {d.getDate()}
                    </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Calendars list */}
                    <div className="border rounded p-3 bg-white">
                        <div className="small fw-semibold mb-2">CALENDARS</div>
                        {Object.keys(enabledCals).map((c) => (
                            <div key={c} className="d-flex align-items-center mb-2">
                <span
                    className="wd-cal-dot me-2"
                    style={{
                        background:
                            {
                                CS5610: "#3b82f6",
                                CS5520: "#8b5cf6",
                                CS5004: "#f59e0b",
                                CS5200: "#06b6d4",
                                CS5800: "#ef4444",
                                CS6620: "#a855f7",
                                CS6510: "#10b981",
                            }[c] || "#64748b",
                    }}
                />
                                <Form.Check
                                    type="checkbox"
                                    id={`cal-${c}`}
                                    label={c}
                                    checked={enabledCals[c]}
                                    onChange={(e) =>
                                        setEnabledCals((prev) => ({ ...prev, [c]: e.currentTarget.checked }))
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
