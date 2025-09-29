"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ListGroup, Badge, Button, Form } from "react-bootstrap";
import {
    BsGripVertical,
    BsFileEarmarkText,
    BsThreeDotsVertical,
    BsPlus
} from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment } from "./reducer";

export default function Assignments() {
    const { cid } = useParams<{ cid: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const courseAssignments = assignments.filter((a: any) => a.course === cid);
    const isFaculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";

    const handleDelete = (assignmentId: string) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            dispatch(deleteAssignment(assignmentId));
        }
    };

    const handleAddAssignment = () => router.push(`/Courses/${cid}/Assignments/new`);

    return (
        <div id="wd-assignments" className="mt-2">
            <div className="d-flex align-items-center gap-2 mb-3">
                <Form.Control id="wd-search-assignment" placeholder="Search…" style={{ maxWidth: 380 }} />
                {isFaculty && (
                    <>
                        <Button id="wd-add-assignment-group" variant="light" className="ms-auto">+ Group</Button>
                        <Button id="wd-add-assignment" variant="danger" onClick={handleAddAssignment}>
                            + Assignment
                        </Button>
                    </>
                )}
            </div>

            <div className="border rounded mb-3">
                <div className="d-flex align-items-center justify-content-between px-3 py-2">
                    <div className="d-flex align-items-center gap-2">
                        <BsGripVertical className="fs-4 text-secondary" />
                        <strong>ASSIGNMENTS</strong>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Badge bg="light" text="dark" className="border">40% of Total</Badge>
                        {isFaculty && (
                            <>
                                <Button size="sm" variant="light" onClick={handleAddAssignment}><BsPlus /></Button>
                                <Button size="sm" variant="light"><BsThreeDotsVertical /></Button>
                            </>
                        )}
                    </div>
                </div>

                <ListGroup variant="flush" id="wd-assignment-list">
                    {courseAssignments.map((assignment: any) => (
                        <ListGroup.Item key={assignment._id} className="py-3 d-flex align-items-start">
                            <div className="me-2 pt-1"><BsGripVertical className="text-secondary" /></div>
                            <div className="me-3 pt-1"><BsFileEarmarkText className="text-success fs-5" /></div>

                            <div className="flex-grow-1">
                                <Link
                                    className="wd-assignment-link fw-semibold text-decoration-none"
                                    href={`/Courses/${cid}/Assignments/${assignment._id}`}
                                >
                                    {assignment.title}
                                </Link>
                                <div className="text-muted small">
                                    Multiple Modules <span className="mx-2">|</span>
                                    {assignment.availableFrom
                                        ? <>Not available until {new Date(assignment.availableFrom).toLocaleDateString()} at 12:00am</>
                                        : <>Not available yet</>
                                    }
                                    <span className="mx-2">|</span>
                                    {assignment.dueDate
                                        ? <>Due {new Date(assignment.dueDate).toLocaleDateString()} at 11:59pm</>
                                        : <>Due —</>
                                    }
                                    <span className="mx-2">|</span>
                                    {assignment.points} pts
                                </div>
                            </div>

                            <div className="ms-3 d-flex align-items-center gap-2">
                                {/* No green check for students; faculty can delete */}
                                {isFaculty && (
                                    <Button
                                        variant="link"
                                        className="text-danger p-0"
                                        onClick={() => handleDelete(assignment._id)}
                                    >
                                        🗑️
                                    </Button>
                                )}
                                <BsThreeDotsVertical className="text-secondary" />
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
}
