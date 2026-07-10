"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as db from "../../../../Database";

export default function AssignmentEditor() {
    const { cid, aid } = useParams<{ cid: string; aid: string }>();
    const assignment = db.assignments.find((a: any) => a._id === aid);

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return (
        <div id="wd-assignments-editor" className="container-fluid">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="wd-name" className="fw-semibold">Assignment Name</Form.Label>
                    <Form.Control id="wd-name" defaultValue={assignment.title} />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control
                        as="textarea"
                        id="wd-description"
                        rows={6}
                        defaultValue={assignment.description}
                    />
                </Form.Group>

                {/* Each label/field pair is a Bootstrap grid row: label on the left, field on the right */}
                <Row className="mb-3 align-items-center">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-points" className="mb-0">Points</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control id="wd-points" type="number" defaultValue={assignment.points} />
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-group" className="mb-0">Assignment Group</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Select id="wd-group">
                            <option>ASSIGNMENTS</option>
                            <option>QUIZZES</option>
                            <option>EXAMS</option>
                            <option>PROJECT</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-display-grade-as" className="mb-0">Display Grade as</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Select id="wd-display-grade-as">
                            <option>Percentage</option>
                            <option>Points</option>
                        </Form.Select>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-submission-type" className="mb-0">Submission Type</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Select id="wd-submission-type" className="mb-2">
                            <option>Online</option>
                            <option>On Paper</option>
                        </Form.Select>
                        <Form.Check id="wd-text-entry" label="Text Entry" defaultChecked />
                        <Form.Check id="wd-website-url" label="Website URL" defaultChecked />
                        <Form.Check id="wd-media-recordings" label="Media Recordings" />
                        <Form.Check id="wd-student-annotation" label="Student Annotation" />
                        <Form.Check id="wd-file-upload" label="File Uploads" />
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-assign-to" className="mb-0">Assign to</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control id="wd-assign-to" defaultValue="Everyone" />
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-due-date" className="mb-0">Due</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control id="wd-due-date" type="date" defaultValue={assignment.dueDate} />
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-available-from" className="mb-0">Available from</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control id="wd-available-from" type="date" defaultValue={assignment.availableFrom} />
                    </Col>
                </Row>

                <Row className="mb-3 align-items-center">
                    <Col md={3} className="text-md-end">
                        <Form.Label htmlFor="wd-available-until" className="mb-0">Until</Form.Label>
                    </Col>
                    <Col md={9}>
                        <Form.Control id="wd-available-until" type="date" defaultValue={assignment.availableUntil} />
                    </Col>
                </Row>

                <hr />
                <div className="d-flex justify-content-end gap-2">
                    <Link href={`/Courses/${cid}/Assignments`} className="btn btn-light border">
                        Cancel
                    </Link>
                    <Link href={`/Courses/${cid}/Assignments`} className="btn btn-danger">
                        Save
                    </Link>
                </div>
            </Form>
        </div>
    );
}
