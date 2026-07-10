"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ListGroup, Badge, Button, Form, InputGroup } from "react-bootstrap";
import {
    BsGripVertical,
    BsFileEarmarkText,
    BsPlus,
    BsSearch
} from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setAssignments, deleteAssignment, updateAssignment } from "./reducer";
import * as assignmentsClient from "./client";
import KebabMenu from "@/app/(Kambaz)/KebabMenu";
import { useIsFaculty } from "../../../Account/roles";

export default function Assignments() {
    const { cid } = useParams<{ cid: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const isFaculty = useIsFaculty();

    const loadAssignments = async () => {
        const list = await assignmentsClient.findAssignmentsForCourse(cid);
        dispatch(setAssignments(list));
    };
    useEffect(() => {
        loadAssignments();
    }, [cid]);

    const [searchTerm, setSearchTerm] = useState("");
    const courseAssignments = assignments
        .filter((a: any) => a.course === cid)
        .filter((a: any) => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
        // Students only see published assignments.
        .filter((a: any) => isFaculty || a.published !== false);

    // Faculty publish toggle: persists on the server via the update endpoint.
    const togglePublish = async (a: any) => {
        const updated = { ...a, published: !(a.published !== false) };
        await assignmentsClient.updateAssignment(updated);
        dispatch(updateAssignment(updated));
    };

    const handleDelete = async (assignmentId: string) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            await assignmentsClient.deleteAssignment(assignmentId);
            dispatch(deleteAssignment(assignmentId));
        }
    };

    const handleAddAssignment = () => router.push(`/Courses/${cid}/Assignments/new`);

    // Availability status shown per assignment (changes with the current date).
    const availabilityLabel = (a: any) => {
        const now = Date.now();
        if (a.availableFrom && now < new Date(a.availableFrom).getTime()) {
            return `Not available until ${new Date(a.availableFrom).toLocaleDateString()}`;
        }
        if (a.availableUntil && now > new Date(a.availableUntil).getTime()) {
            return "Closed";
        }
        if (a.availableUntil) {
            return `Available until ${new Date(a.availableUntil).toLocaleDateString()}`;
        }
        return "Available";
    };

    return (
        <div id="wd-assignments" className="mt-2">
            <div className="d-flex align-items-center gap-2 mb-3">
                <InputGroup style={{ maxWidth: 380 }}>
                    <InputGroup.Text><BsSearch /></InputGroup.Text>
                    <Form.Control
                        id="wd-search-assignment"
                        placeholder="Search for Assignments"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
                {isFaculty && (
                    <>
                        <Button id="wd-add-assignment-group" variant="secondary" className="ms-auto" onClick={handleAddAssignment}>
                            <FaPlus className="me-1" /> Group
                        </Button>
                        <Button id="wd-add-assignment" variant="danger" onClick={handleAddAssignment}>
                            <FaPlus className="me-1" /> Assignment
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
                                <KebabMenu items={[{ label: "New Assignment", onClick: handleAddAssignment }]} />
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
                                    {availabilityLabel(assignment)}
                                    <span className="mx-2">|</span>
                                    {assignment.dueDate
                                        ? <>Due {new Date(assignment.dueDate).toLocaleDateString()} at 11:59pm</>
                                        : <>Due -</>
                                    }
                                    <span className="mx-2">|</span>
                                    {assignment.points} pts
                                </div>
                            </div>

                            <div className="ms-3 d-flex align-items-center gap-2">
                                {/* Students see no controls; faculty can delete or edit */}
                                {isFaculty && (
                                    <>
                                        <Button
                                            variant="link"
                                            className="p-0"
                                            title={assignment.published !== false ? "Published — click to unpublish" : "Unpublished — click to publish"}
                                            onClick={() => togglePublish(assignment)}
                                        >
                                            {assignment.published !== false ? (
                                                <FaCheckCircle className="text-success" />
                                            ) : (
                                                <FaBan className="text-secondary" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="link"
                                            className="text-danger p-0"
                                            onClick={() => handleDelete(assignment._id)}
                                        >
                                            <FaTrash />
                                        </Button>
                                        <KebabMenu
                                            items={[
                                                {
                                                    label: "Edit",
                                                    onClick: () =>
                                                        router.push(`/Courses/${cid}/Assignments/${assignment._id}`),
                                                },
                                            ]}
                                        />
                                    </>
                                )}
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>
        </div>
    );
}
