"use client";

// The Assignment Editor screen.
// 4.12 Every field is controlled now. When the id is "new" Save adds a
// new assignment. If not, Save updates the one I opened.
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAssignment, updateAssignment } from "../reducer";

export default function AssignmentEditor() {
  const params = useParams<{ cid: string; aid: string }>();
  const cid = params ? params.cid : "";
  const aid = params ? params.aid : "";
  const router = useRouter();
  const dispatch = useDispatch();

  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const isNew = aid === "new";
  const existing = assignments.find((a: any) => a._id === aid);

  // A new empty assignment, or a copy of the one I opened.
  const [assignment, setAssignment] = useState<any>(
    isNew || !existing
      ? {
          title: "New Assignment",
          description: "New Description",
          points: 100,
          dueDate: "",
          availableFrom: "",
          availableUntil: "",
          course: cid,
        }
      : { ...existing }
  );

  const save = () => {
    if (isNew) {
      dispatch(addAssignment({ ...assignment, course: cid }));
    } else {
      dispatch(updateAssignment(assignment));
    }
    router.push(`/Courses/${cid}/Assignments`);
  };

  if (!isNew && !existing) {
    return <div id="wd-assignments-editor">Assignment not found</div>;
  }

  return (
    <div id="wd-assignments-editor">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control
            value={assignment.title || ""}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Control
            as="textarea"
            rows={8}
            value={assignment.description || ""}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-md-2">
            <Form.Label htmlFor="wd-points">Points</Form.Label>
          </Col>
          <Col md={9}>
            <Form.Control
              id="wd-points"
              type="number"
              value={assignment.points ?? 0}
              onChange={(e) =>
                setAssignment({
                  ...assignment,
                  points: e.target.value === "" ? 0 : parseInt(e.target.value),
                })
              }
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-md-2">
            <Form.Label htmlFor="wd-group">Assignment Group</Form.Label>
          </Col>
          <Col md={9}>
            <Form.Select id="wd-group" defaultValue="ASSIGNMENTS" className="form-control">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-md-2">
            <Form.Label htmlFor="wd-display-grade-as">Display Grade as</Form.Label>
          </Col>
          <Col md={9}>
            <Form.Select id="wd-display-grade-as" defaultValue="PERCENTAGE" className="form-control">
              <option value="PERCENTAGE">Percentage</option>
              <option value="POINTS">Points</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-md-2">
            <Form.Label htmlFor="wd-submission-type">Submission Type</Form.Label>
          </Col>
          <Col md={9}>
            <div className="border rounded p-3">
              <Form.Select id="wd-submission-type" defaultValue="ONLINE" className="form-control mb-3">
                <option value="ONLINE">Online</option>
                <option value="ON_PAPER">On Paper</option>
              </Form.Select>
              <Form.Label className="fw-bold">Online Entry Options</Form.Label>
              <Form.Check id="wd-text-entry" label="Text Entry" defaultChecked />
              <Form.Check id="wd-website-url" label="Website URL" defaultChecked />
              <Form.Check id="wd-media-recordings" label="Media Recordings" />
              <Form.Check id="wd-student-annotation" label="Student Annotation" />
              <Form.Check id="wd-file-upload" label="File Uploads" />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-md-2">
            <Form.Label htmlFor="wd-assign-to">Assign</Form.Label>
          </Col>
          <Col md={9}>
            <div className="border rounded p-3">
              <Form.Group className="mb-3" controlId="wd-assign-to">
                <Form.Label className="fw-bold">Assign to</Form.Label>
                <Form.Control defaultValue="Everyone" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="wd-due-date">
                <Form.Label className="fw-bold">Due</Form.Label>
                <Form.Control
                  type="date"
                  value={assignment.dueDate || ""}
                  onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="wd-available-from">
                    <Form.Label className="fw-bold">Available from</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignment.availableFrom || ""}
                      onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="wd-available-until">
                    <Form.Label className="fw-bold">Until</Form.Label>
                    <Form.Control
                      type="date"
                      value={assignment.availableUntil || ""}
                      onChange={(e) => setAssignment({ ...assignment, availableUntil: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        {/* Save keeps the changes. Cancel drops them. */}
        <div className="clearfix mb-3">
          <Button id="wd-save-btn" onClick={save} className="btn btn-danger float-end">
            Save
          </Button>
          <Link href={`/Courses/${cid}/Assignments`} id="wd-cancel-btn"
                className="btn btn-secondary me-2 float-end">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
