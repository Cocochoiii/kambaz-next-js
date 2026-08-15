"use client";

// The Kambaz menu on the left. The links live in one array.
// Courses does not jump to a screen. It slides out a tray.
import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useIsFaculty } from "./Account/roles";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser, FaBook } from "react-icons/fa6";

const links = [
  { label: "Account",   href: "/Account",   match: "/Account",   icon: FaRegCircleUser, tray: false },
  { label: "Dashboard", href: "/Dashboard", match: "/Dashboard", icon: AiOutlineDashboard, tray: false },
  { label: "Courses",   href: "/Dashboard", match: "/Courses",   icon: FaBook, tray: true },
  { label: "Calendar",  href: "/Calendar",  match: "/Calendar",  icon: IoCalendarOutline, tray: false },
  { label: "Inbox",     href: "/Inbox",     match: "/Inbox",     icon: FaInbox, tray: false },
  { label: "Labs",      href: "/Labs",      match: "/Labs",      icon: LiaBookSolid, tray: false },
  { label: "Settings",  href: "/Settings",  match: "/Settings",  icon: LiaCogSolid, tray: false },
];

const MENU_WIDTH = 110;
const TRAY_WIDTH = 280;

export default function KambazNavigation() {
  const pathname = usePathname() || "";
  const [showTray, setShowTray] = useState(false);

  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  // Faculty sees every course. A student sees only their courses.
  // Student View counts as a student here too, so the tray matches
  // what the course screens show during the preview.
  const isFaculty = useIsFaculty();
  const myCourses =
    isFaculty
      ? courses
      : courses.filter((course: any) =>
          enrollments.some(
            (enrollment: any) =>
              enrollment.user === currentUser?._id &&
              enrollment.course === course._id
          )
        );

  return (
    <>
      <ListGroup
        id="wd-kambaz-navigation"
        style={{ width: MENU_WIDTH }}
        className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      >
        <ListGroup.Item
          className="bg-black border-0 text-center"
          as="a"
          target="_blank"
          rel="noreferrer"
          href="https://www.northeastern.edu/"
          id="wd-neu-link"
        >
          <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
        </ListGroup.Item>

        {links.map((link) => {
          // The selected item is white with red text.
          const active = pathname === link.match || pathname.includes(`${link.match}/`);
          const Icon = link.icon;
          // Only the Account icon is white when not selected.
          const iconColor =
            link.label === "Account" && !active ? "text-white" : "text-danger";
          const textColor = active ? "text-danger" : "text-white";

          return (
            <ListGroup.Item
              key={link.label}
              className={`border-0 text-center ${active ? "bg-white" : "bg-black"}`}
            >
              {link.tray ? (
                <button
                  id={`wd-${link.label.toLowerCase()}-link`}
                  type="button"
                  aria-expanded={showTray}
                  onClick={() => setShowTray(!showTray)}
                  className={`btn btn-link p-0 text-decoration-none ${textColor}`}
                >
                  <Icon className={`fs-1 ${iconColor}`} />
                  <br />
                  {link.label}
                </button>
              ) : (
                <Link
                  href={link.href}
                  id={`wd-${link.label.toLowerCase()}-link`}
                  className={`text-decoration-none ${textColor}`}
                  onClick={() => setShowTray(false)}
                >
                  <Icon className={`fs-1 ${iconColor}`} />
                  <br />
                  {link.label}
                </Link>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {/* The gray sheet behind the tray. A click closes it. */}
      {showTray && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-none d-md-block"
          style={{ zIndex: 3, backgroundColor: "rgba(0, 0, 0, .3)" }}
          onClick={() => setShowTray(false)}
        />
      )}

      {/* The tray itself, right next to the menu. */}
      {showTray && (
        <div
          id="wd-courses-tray"
          className="position-fixed top-0 bottom-0 bg-white border-start shadow d-none d-md-block overflow-auto"
          style={{ left: MENU_WIDTH, width: TRAY_WIDTH, zIndex: 4 }}
        >
          <div className="d-flex align-items-center justify-content-between p-3">
            <h5 className="mb-0">Courses</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setShowTray(false)}
            />
          </div>

          <ListGroup variant="flush">
            <ListGroup.Item
              as={Link}
              href="/Dashboard"
              id="wd-tray-all-courses"
              className="text-danger fw-bold"
              onClick={() => setShowTray(false)}
            >
              All Courses
            </ListGroup.Item>

            {myCourses.map((course: any) => (
              <ListGroup.Item
                key={course._id}
                as={Link}
                href={`/Courses/${course._id}/Home`}
                className="text-decoration-none"
                onClick={() => setShowTray(false)}
              >
                <div className="fw-semibold">{course.name}</div>
                <div className="text-muted small">{course.number}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Nothing to list before I sign in. */}
          {myCourses.length === 0 && (
            <p className="text-muted small px-3">No courses yet.</p>
          )}
        </div>
      )}
    </>
  );
}
