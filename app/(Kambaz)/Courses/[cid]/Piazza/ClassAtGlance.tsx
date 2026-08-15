"use client";

// Class at a Glance. It opens when I pick no post.
// It shows the six numbers the project asks for.
import {
  FaCheckCircle,
  FaRegFileAlt,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";

export default function ClassAtGlance({
  unread,
  unanswered,
  totalPosts,
  instructorResponses,
  studentResponses,
  studentsEnrolled,
  isInstructor,
  onShowUnanswered,
}: {
  unread: number;
  unanswered: number;
  totalPosts: number;
  instructorResponses: number;
  studentResponses: number;
  studentsEnrolled: number;
  isInstructor: boolean;
  onShowUnanswered: () => void;
}) {
  // A zero turns the card green and says the class is caught up.
  const inbox = (count: number, zeroText: string, someText: string, onClick?: () => void) => {
    const clickable = Boolean(onClick) && count > 0;
    return (
      <div
        className={`wd-pazza-stat ${count === 0 ? "wd-pazza-stat-clear" : ""}`}
        role={clickable ? "button" : undefined}
        onClick={clickable ? onClick : undefined}
      >
        {count === 0 ? (
          <>
            <FaCheckCircle className="text-success mb-1" size={22} />
            <div className="fw-bold">All caught up</div>
            <div className="text-muted small">{zeroText}</div>
          </>
        ) : (
          <>
            <div className="fw-bold fs-3">{count}</div>
            <div className="text-muted small">
              {someText}
              {clickable ? " >" : ""}
            </div>
          </>
        )}
      </div>
    );
  };

  const total = (icon: any, value: number, label: string) => (
    <div className="wd-pazza-stat wd-pazza-stat-row">
      <span className="text-secondary fs-3">{icon}</span>
      <div>
        <div className="fw-bold fs-3">{value}</div>
        <div className="text-muted small">{label}</div>
      </div>
    </div>
  );

  return (
    <div id="wd-pazza-glance" className="p-4">
      <h4 className="mb-3">Class at a Glance</h4>

      <div className="wd-pazza-stats">
        {inbox(unread, "no unread posts", "unread posts")}
        {inbox(
          unanswered,
          "no unanswered posts",
          "unanswered posts",
          isInstructor ? onShowUnanswered : undefined
        )}
      </div>

      <div className="wd-pazza-stats">
        {total(<FaRegFileAlt />, totalPosts, "total posts")}
        {total(<FaChalkboardTeacher />, instructorResponses, "instructor responses")}
      </div>

      <div className="wd-pazza-stats">
        {total(<FaUserGraduate />, studentResponses, "student responses")}
        {total(<FaUsers />, studentsEnrolled, "students enrolled")}
      </div>

      <p className="text-muted small mt-3 mb-0">
        Pick a post on the left to read it. Click New Post to write your own.
      </p>
    </div>
  );
}
