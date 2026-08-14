"use client";

// The Assignments screen.
// The assignments come from the server. + Assignment opens the editor.
// Delete and publish go to the server first.
import Link from "next/link";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BsGripVertical, BsPlus, BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { LiaFileAltSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import PublishToggle from "../Modules/PublishToggle";
import { setAssignments, deleteAssignment, updateAssignment } from "./reducer";
import * as coursesClient from "../../client";
import * as assignmentsClient from "./client";

// The dates look like 2025-01-19. I cut them myself.
// If not, the server and the browser print different text.
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

  // Read the assignments of this course.
  const fetchAssignments = async () => {
    const found = await coursesClient.findAssignmentsForCourse(cid);
    dispatch(setAssignments(found));
  };

  useEffect(() => {
    if (cid) {
      fetchAssignments();
    }
  }, [cid]);

  // Publish only flips a flag, so I reuse the update route.
  const togglePublish = async (assignment: any) => {
    const updated = { ...assignment, published: !assignment.published };
    await assignmentsClient.updateAssignment(updated);
    dispatch(updateAssignment(updated));
  };

  const removeAssignment = async (assignmentId: string) => {
    // The book asks for a dialog.
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      await assignmentsClient.deleteAssignment(assignmentId);
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
              <PublishToggle
                published={assignment.published !== false}
                onToggle={isFaculty ? () => togglePublish(assignment) : undefined}
              />
              <BsThreeDotsVertical className="fs-4" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
