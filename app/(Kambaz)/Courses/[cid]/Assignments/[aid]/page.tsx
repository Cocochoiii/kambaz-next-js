"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Col, Form, Row } from "react-bootstrap";
import { getAssignment } from "../catalog";

export default function AssignmentEditor() {
  const { cid, aid } = useParams<{ cid: string; aid: string }>();
  const seed = getAssignment(cid, aid);

  return (
      <div id="wd-assignments-editor" className="container-fluid">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Assignment Name</Form.Label>
            <Form.Control id="wd-name" defaultValue={seed.title} />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Control
                as="textarea"
                id="wd-description"
                rows={6}
                defaultValue={seed.description}
            />
          </Form.Group>

          <Row className="g-4">
            <Col md={6} lg={5} xxl={4}>
              <table className="table table-borderless align-middle mb-0">
                <tbody>
                <tr>
                  <td className="text-end pe-3" style={{ width: 160 }}>
                    <Form.Label htmlFor="wd-points" className="mb-0">
                      Points
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Control
                        id="wd-points"
                        type="number"
                        defaultValue={seed.points}
                        style={{ maxWidth: 140 }}
                    />
                  </td>
                </tr>

                <tr>
                  <td className="text-end pe-3">
                    <Form.Label htmlFor="wd-group" className="mb-0">
                      Assignment Group
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Select id="wd-group" style={{ maxWidth: 260 }}>
                      <option>ASSIGNMENTS</option>
                      <option>QUIZZES</option>
                      <option>EXAMS</option>
                      <option>PROJECT</option>
                    </Form.Select>
                  </td>
                </tr>

                <tr>
                  <td className="text-end pe-3">
                    <Form.Label htmlFor="wd-display-grade-as" className="mb-0">
                      Display Grade as
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Select id="wd-display-grade-as" style={{ maxWidth: 260 }}>
                      <option>Percentage</option>
                      <option>Points</option>
                    </Form.Select>
                  </td>
                </tr>

                <tr>
                  <td className="text-end pe-3">
                    <Form.Label htmlFor="wd-submission-type" className="mb-0">
                      Submission Type
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Select id="wd-submission-type" style={{ maxWidth: 260 }} className="mb-2">
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
                  </td>
                </tr>

                <tr>
                  <td className="text-end pe-3">
                    <Form.Label htmlFor="wd-assign-to" className="mb-0">
                      Assign to
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Control id="wd-assign-to" defaultValue="Everyone" style={{ maxWidth: 260 }} />
                  </td>
                </tr>

                <tr>
                  <td className="text-end pe-3">
                    <Form.Label htmlFor="wd-due-date" className="mb-0">
                      Due
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Control
                        id="wd-due-date"
                        type="date"
                        defaultValue="2025-05-13"
                        style={{ maxWidth: 220 }}
                    />
                  </td>
                </tr>

                <tr>
                  <td className="text-end pe-3">
                    <Form.Label htmlFor="wd-available-from" className="mb-0">
                      Available from
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Control
                        id="wd-available-from"
                        type="date"
                        defaultValue="2025-05-06"
                        style={{ maxWidth: 220 }}
                    />
                  </td>
                </tr>

                <tr>
                  <td className="text-end pe-3">
                    <Form.Label htmlFor="wd-available-until" className="mb-0">
                      Until
                    </Form.Label>
                  </td>
                  <td>
                    <Form.Control id="wd-available-until" type="date" style={{ maxWidth: 220 }} />
                  </td>
                </tr>
                </tbody>
              </table>
            </Col>
          </Row>

          <div className="d-flex gap-2 mt-4">
            <Link href={`/Courses/${cid}/Assignments`} className="btn btn-light">
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
