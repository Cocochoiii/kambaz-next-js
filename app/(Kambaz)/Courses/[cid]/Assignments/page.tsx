"use client";

// The Assignments screen.
// 4.12 The assignments come from the store. + Assignment opens the
// editor. The trash can asks first, then deletes. Faculty only.
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { BsGripVertical, BsPlus, BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { LiaFileAltSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { deleteAssignment } from "./reducer";

// The dates look like 2025-01-19. I build the short date myself, so the
// server and the browser print the same text.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function shortDate(date?: string) {
  if (!date) { return "-"; }
  const [, month, day] = date.split("-");
  return `${MONTHS[Number(month) - 1]} ${Number(day)}`;
}

export default function Assignments() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const isFaculty = currentUser?.role === "FACULTY";
  const courseAssignments = assignments.filter((a: any) => a.course === cid);

  const removeAssignment = (assignmentId: string) => {
    // The book asks for a dialog. Yes deletes, Cancel does nothing.
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      dispatch(deleteAssignment(assignmentId));
    }
  };

  return (
    <div id="wd-assignments">
      {/* The buttons float right, so I write the right one first. */}
      <div className="clearfix mb-4">
        {isFaculty && (
          <>
            <button
              id="wd-add-assignment"
              className="btn btn-lg btn-danger float-end"
              onClick={() => router.push(`/Courses/${cid}/Assignments/new`)}
            >
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Assignment
            </button>
            <button id="wd-add-assignment-group" className="btn btn-lg btn-secondary me-2 float-end">
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Group
            </button>
          </>
        )}
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white">
            <BsSearch />
          </span>
          <input
            id="wd-search-assignment"
            className="form-control"
            placeholder="Search for Assignments"
          />
        </div>
      </div>

      {/* The ASSIGNMENTS group title */}
      <div className="p-3 bg-secondary border border-secondary clearfix">
        <BsGripVertical className="me-2 fs-3" />
        <span id="wd-assignments-title" className="fw-bold">ASSIGNMENTS</span>
        <div className="float-end">
          <span className="border border-dark rounded-pill px-2 py-1 me-2">40% of Total</span>
          <BsPlus className="fs-4" />
          <BsThreeDotsVertical className="fs-4" />
        </div>
      </div>

      <ul id="wd-assignment-list" className="list-group rounded-0">
        {courseAssignments.map((assignment: any) => (
          <li
            key={assignment._id}
            className="wd-assignment-list-item list-group-item p-3 ps-1 d-flex align-items-center"
          >
            <BsGripVertical className="me-2 fs-3" />
            <LiaFileAltSolid className="me-3 fs-3 text-success" />
            <div className="flex-fill">
              <Link
                href={`/Courses/${cid}/Assignments/${assignment._id}`}
                className="wd-assignment-link fw-bold text-dark text-decoration-none"
              >
                {assignment.title}
              </Link>
              <p className="mb-0">
                <span className="text-danger">Multiple Modules</span>
                {" | "}<b>Not available until</b> {shortDate(assignment.availableFrom)} at 12:00am
                {" | "}<b>Due</b> {shortDate(assignment.dueDate)} at 11:59pm
                {" | "}{assignment.points} pts
              </p>
            </div>
            <div className="ms-3 d-flex align-items-center">
              {isFaculty && (
                <FaTrash
                  role="button"
                  aria-label="Delete assignment"
                  className="text-danger me-3"
                  onClick={() => removeAssignment(assignment._id)}
                />
              )}
              <GreenCheckmark />
              <BsThreeDotsVertical className="fs-4" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
