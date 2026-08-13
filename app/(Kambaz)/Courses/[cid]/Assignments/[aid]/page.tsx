"use client";

// The Assignment Editor screen.
// In A1 this was a table. Now every row is a Bootstrap Row with two
// Cols: the label on the left and the field on the right.
// Every assignment still shows the same data. That is OK for now.
// I need "use client" because React Bootstrap uses React context.
import { Row, Col, Button, Form } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <Form>
        <Form.Group className="mb-3" controlId="wd-name">
          <Form.Label>Assignment Name</Form.Label>
          <Form.Control defaultValue="A1 - ENV + HTML" />
        </Form.Group>

        <Form.Group className="mb-4" controlId="wd-description">
          <Form.Control
            as="textarea"
            rows={8}
            defaultValue="The assignment is available online. Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: your full name and section, links to each of the lab assignments, link to the Kambaz application, links to all relevant source code repositories."
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={3} className="text-md-end pt-md-2">
            <Form.Label htmlFor="wd-points">Points</Form.Label>
          </Col>
          <Col md={9}>
            <Form.Control id="wd-points" type="number" defaultValue={100} />
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
                <Form.Control type="date" defaultValue="2025-09-22" />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="wd-available-from">
                    <Form.Label className="fw-bold">Available from</Form.Label>
                    <Form.Control type="date" defaultValue="2025-09-01" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="wd-available-until">
                    <Form.Label className="fw-bold">Until</Form.Label>
                    <Form.Control type="date" defaultValue="2025-12-31" />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />

        <div className="clearfix mb-3">
          <Button variant="danger" className="float-end" id="wd-save-btn">Save</Button>
          <Button variant="secondary" className="me-2 float-end" id="wd-cancel-btn">Cancel</Button>
        </div>
      </Form>
    </div>
  );
}
