"use client";

// The Pazza Navigation Bar. It sits at the top of every Pazza screen.
// It never scrolls, because the screen below it owns the scroll bar.
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { displayName } from "./helpers";

export default function PazzaNav({
  cid,
  courseName,
  currentUser,
  isInstructor,
  active,
}: {
  cid: string;
  courseName: string;
  currentUser: any;
  isInstructor: boolean;
  active: "qa" | "manage";
}) {
  return (
    <div id="wd-pazza-nav" className="wd-pazza-nav">
      {/* The logo of the application. */}
      <span className="wd-pazza-logo">pazza</span>

      {/* The course I am reading right now. */}
      <span id="wd-pazza-course-name" className="wd-pazza-course">
        {courseName}
      </span>

      {/* The tabs. The open one is bold and underlined. */}
      <Link
        id="wd-pazza-qa-tab"
        href={`/Courses/${cid}/Piazza`}
        className={`wd-pazza-tab ${active === "qa" ? "wd-pazza-tab-active" : ""}`}
      >
        Q&amp;A
      </Link>
      <span className="wd-pazza-tab wd-pazza-tab-off">Resources</span>
      <span className="wd-pazza-tab wd-pazza-tab-off">Statistics</span>

      {/* Only an instructor sees the Manage Class tab. */}
      {isInstructor && (
        <Link
          id="wd-pazza-manage-tab"
          href={`/Courses/${cid}/Piazza/ManageClass`}
          className={`wd-pazza-tab ${active === "manage" ? "wd-pazza-tab-active" : ""}`}
        >
          Manage Class
        </Link>
      )}

      {/* The person who is signed in. */}
      <span className="wd-pazza-user">
        <span className="wd-pazza-role">
          {isInstructor ? "Instructor" : "Student"}
        </span>
        <FaUserCircle size={20} />
        {displayName(currentUser)}
      </span>
    </div>
  );
}
