"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";
import * as assignmentsClient from "../client";

export default function AssignmentEditor() {
    const { cid, aid } = useParams<{ cid: string; aid: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);

    const isNew = aid === "new";
    const existingAssignment = assignments.find((a: any) => a._id === aid);

    const [assignment, setAssignment] = useState({
        title: "",
        description: "",
        points: 100,
        dueDate: "",
        availableFrom: "",
        availableUntil: "",
        course: cid,
        ...existingAssignment,
    });

    useEffect(() => {
        if (!isNew && existingAssignment) {
            setAssignment(existingAssignment);
        }
    }, [existingAssignment, isNew]);

    const handleSave = async () => {
        if (isNew) {
            const created = await assignmentsClient.createAssignment(cid, assignment);
            dispatch(addAssignment(created));
        } else {
            await assignmentsClient.updateAssignment(assignment);
            dispatch(updateAssignment(assignment));
        }
        router.push(`/Courses/${cid}/Assignments`);
    };

    const handleCancel = () => router.push(`/Courses/${cid}/Assignments`);

    // one label/field pair per row: label on the left, field on the right
    const field = (labelId: string, label: string, control: React.ReactNode) => (
        <Row className="mb-3 align-items-center">
            <Col md={3} className="text-md-end">
                <Form.Label htmlFor={labelId} className="mb-0">{label}</Form.Label>
            </Col>
            <Col md={9}>{control}</Col>
        </Row>
    );

    return (
        <div id="wd-assignments-editor" className="container-fluid">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="wd-name" className="fw-semibold">Assignment Name</Form.Label>
                    <Form.Control
                        id="wd-name"
                        value={assignment.title}
                        onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control
                        as="textarea"
                        id="wd-description"
                        rows={6}
                        value={assignment.description}
                        onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
                    />
                </Form.Group>

                {field("wd-points", "Points",
                    <Form.Control
                        id="wd-points"
                        type="number"
                        value={assignment.points}
                        onChange={(e) =>
                            setAssignment({
                                ...assignment,
                                points: Number.isNaN(parseInt(e.target.value, 10)) ? 0 : parseInt(e.target.value, 10),
                            })
                        }
                        style={{ maxWidth: 160 }}
                    />
                )}

                {field("wd-group", "Assignment Group",
                    <Form.Select id="wd-group" style={{ maxWidth: 300 }}>
                        <option>ASSIGNMENTS</option>
                        <option>QUIZZES</option>
                        <option>EXAMS</option>
                        <option>PROJECT</option>
                    </Form.Select>
                )}

                {field("wd-display-grade-as", "Display Grade as",
                    <Form.Select id="wd-display-grade-as" style={{ maxWidth: 300 }}>
                        <option>Percentage</option>
                        <option>Points</option>
                    </Form.Select>
                )}

                {field("wd-submission-type", "Submission Type",
                    <>
                        <Form.Select id="wd-submission-type" style={{ maxWidth: 300 }} className="mb-2">
                            <option>Online</option>
                            <option>On Paper</option>
                        </Form.Select>
                        <div className="ps-1">
                            <Form.Check id="wd-text-entry" label="Text Entry" defaultChecked />
                            <Form.Check id="wd-website-url" label="Website URL" defaultChecked />
                            <Form.Check id="wd-media-recordings" label="Media Recordings" />
                            <Form.Check id="wd-student-annotation" label="Student Annotation" />
                            <Form.Check id="wd-file-upload" label="File Uploads" />
                        </div>
                    </>
                )}

                {field("wd-assign-to", "Assign to",
                    <Form.Control id="wd-assign-to" defaultValue="Everyone" style={{ maxWidth: 300 }} />
                )}

                {field("wd-due-date", "Due",
                    <Form.Control
                        id="wd-due-date"
                        type="date"
                        value={assignment.dueDate}
                        onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                        style={{ maxWidth: 260 }}
                    />
                )}

                {field("wd-available-from", "Available from",
                    <Form.Control
                        id="wd-available-from"
                        type="date"
                        value={assignment.availableFrom}
                        onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })}
                        style={{ maxWidth: 260 }}
                    />
                )}

                {field("wd-available-until", "Until",
                    <Form.Control
                        id="wd-available-until"
                        type="date"
                        value={assignment.availableUntil}
                        onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                        style={{ maxWidth: 260 }}
                    />
                )}

                <hr />
                <div className="d-flex gap-2 justify-content-end">
                    <Button variant="light" onClick={handleCancel}>Cancel</Button>
                    <Button variant="danger" onClick={handleSave}>Save</Button>
                </div>
            </Form>
        </div>
    );
}
