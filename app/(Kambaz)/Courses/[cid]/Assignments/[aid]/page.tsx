"use client";

// The Assignment Editor screen. It shows the assignment I clicked on.
// I read the two ids from the URL and find the assignment in the Database.
// Cancel and Save are links back to the Assignments screen.
// I need "use client" because useParams runs in the browser.
import Link from "next/link";
import { useParams } from "next/navigation";
import { Row, Col, Form } from "react-bootstrap";
import * as db from "../../../../Database";

export default function AssignmentEditor() {
  const params = useParams<{ cid: string; aid: string }>();
  const cid = params ? params.cid : "";
  const aid = params ? params.aid : "";
  const assignment = db.assignments.find((assignment) => assignment._id === aid);

  if (!assignment) {
    return <div id="wd-assignments-editor">Assignment not found</div>;
  }

  return (
    <div id="wd-assignments-editor">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control defaultValue={assignment.title} />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Control as="textarea" rows={8} defaultValue={assignment.description} />
        </Form.Group>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-md-2">
            <Form.Label htmlFor="wd-points">Points</Form.Label>
          </Col>
          <Col md={9}>
            <Form.Control id="wd-points" type="number" defaultValue={assignment.points} />
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
                <Form.Control type="date" defaultValue={assignment.dueDate} />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="wd-available-from">
                    <Form.Label className="fw-bold">Available from</Form.Label>
                    <Form.Control type="date" defaultValue={assignment.availableFrom} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="wd-available-until">
                    <Form.Label className="fw-bold">Until</Form.Label>
                    <Form.Control type="date" defaultValue={assignment.availableUntil} />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        {/* Cancel and Save go back to the Assignments screen of this course. */}
        <div className="clearfix mb-3">
          <Link href={`/Courses/${cid}/Assignments`} id="wd-save-btn"
                className="btn btn-danger float-end">
            Save
          </Link>
          <Link href={`/Courses/${cid}/Assignments`} id="wd-cancel-btn"
                className="btn btn-secondary me-2 float-end">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
