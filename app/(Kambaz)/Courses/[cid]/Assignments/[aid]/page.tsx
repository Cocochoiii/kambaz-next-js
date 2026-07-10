"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";
import * as assignmentsClient from "../client";
import * as submissionsClient from "../../../../Submissions/client";
import { useIsFaculty } from "../../../../Account/roles";

// One row of the faculty grading table, with its own grade/feedback inputs.
function GradeRow({ submission, maxPoints, onGrade }: any) {
    const [grade, setGrade] = useState<string>(submission.grade ?? "");
    const [feedback, setFeedback] = useState<string>(submission.feedback ?? "");
    return (
        <tr>
            <td className="align-middle">{submission.user}</td>
            <td className="align-middle text-truncate" style={{ maxWidth: 260 }}>{submission.text}</td>
            <td className="align-middle">
                <div className="d-flex align-items-center gap-1">
                    <Form.Control
                        type="number"
                        size="sm"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        style={{ width: 80 }}
                    />
                    <span className="text-muted small">/ {maxPoints}</span>
                </div>
            </td>
            <td className="align-middle">
                <Form.Control size="sm" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
            </td>
            <td className="align-middle">
                <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onGrade(submission._id, grade === "" ? 0 : Number(grade), feedback)}
                >
                    Save
                </Button>
            </td>
        </tr>
    );
}

export default function AssignmentEditor() {
    const { cid, aid } = useParams<{ cid: string; aid: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

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

    const isFaculty = useIsFaculty();

    // Student side: the current user's own submission for this assignment.
    const [mySubmission, setMySubmission] = useState<any>(null);
    const [submissionText, setSubmissionText] = useState("");
    // Faculty side: every submission for this assignment (for grading).
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            if (isNew) return;
            try {
                if (isFaculty) {
                    setSubmissions(await submissionsClient.findSubmissionsForAssignment(aid));
                } else if (currentUser) {
                    const mine = await submissionsClient.findSubmissionsForUser(currentUser._id);
                    const found = mine.find((s: any) => s.assignment === aid);
                    if (found) {
                        setMySubmission(found);
                        setSubmissionText(found.text || "");
                    }
                }
            } catch {
                // ignore load errors and show the empty state
            }
        };
        load();
    }, [isFaculty, isNew, aid, currentUser]);

    // Student submits (or resubmits) their work.
    const handleSubmit = async () => {
        if (!currentUser) return;
        const saved = await submissionsClient.submitAssignment(aid, {
            user: currentUser._id,
            course: cid,
            title: assignment.title,
            points: assignment.points,
            text: submissionText,
        });
        setMySubmission(saved);
    };

    // Students see a read-only detail page plus their submission box.
    if (!isFaculty) {
        return (
            <div id="wd-assignment-details" className="container-fluid">
                <h2 className="text-danger">{assignment.title}</h2>
                <hr />
                <p style={{ whiteSpace: "pre-wrap" }}>{assignment.description}</p>
                <ul className="list-unstyled">
                    <li className="mb-1"><b>Points:</b> {assignment.points}</li>
                    <li className="mb-1">
                        <b>Due:</b>{" "}
                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "-"}
                    </li>
                </ul>

                <hr />
                <h4>Your Submission</h4>
                {mySubmission?.status === "graded" && (
                    <div className="alert alert-success">
                        <b>Grade:</b> {mySubmission.grade} / {assignment.points}
                        {mySubmission.feedback && (
                            <div className="mt-1"><b>Feedback:</b> {mySubmission.feedback}</div>
                        )}
                    </div>
                )}
                {mySubmission && mySubmission.status !== "graded" && (
                    <p className="text-muted small">
                        Submitted {new Date(mySubmission.submittedAt).toLocaleString()} — waiting for a grade.
                    </p>
                )}
                <Form.Control
                    as="textarea"
                    rows={4}
                    className="mb-2"
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Type your submission here"
                />
                <div className="d-flex gap-2">
                    <Button variant="danger" onClick={handleSubmit}>
                        {mySubmission ? "Resubmit" : "Submit"}
                    </Button>
                    <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Assignments`)}>
                        Back to Assignments
                    </Button>
                </div>
            </div>
        );
    }

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

    // Faculty grades one submission, then refreshes that row in place.
    const handleGrade = async (sid: string, grade: number, feedback: string) => {
        const updated = await submissionsClient.gradeSubmission(sid, { grade, feedback });
        setSubmissions((prev) => prev.map((s) => (s._id === sid ? updated : s)));
    };

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

            {!isNew && (
                <div className="mt-5">
                    <h4>Submissions ({submissions.length})</h4>
                    <hr />
                    {submissions.length === 0 ? (
                        <p className="text-muted">No submissions yet.</p>
                    ) : (
                        <Table hover responsive>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Submission</th>
                                    <th>Grade</th>
                                    <th>Feedback</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((s) => (
                                    <GradeRow key={s._id} submission={s} maxPoints={assignment.points} onGrade={handleGrade} />
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}
        </div>
    );
}
