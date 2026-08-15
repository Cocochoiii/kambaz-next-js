"use client";

// The Details tab of the Quiz Editor.
// Every box shows the value the quiz has now, and changes it.
import { Row, Col, Form } from "react-bootstrap";
import RichText from "../../RichText";
import { totalPoints } from "../../helpers";

export default function DetailsTab({
  quiz,
  set,
}: {
  quiz: any;
  set: (changes: any) => void;
}) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="wd-quiz-name">
        <Form.Label>Quiz Name</Form.Label>
        <Form.Control
          value={quiz.title || ""}
          onChange={(e) => set({ title: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Quiz Instructions</Form.Label>
        <RichText
          value={quiz.description}
          onChange={(html: string) => set({ description: html })}
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={3} className="text-md-end pt-md-2">
          <Form.Label htmlFor="wd-quiz-type">Quiz Type</Form.Label>
        </Col>
        <Col md={9}>
          <Form.Select
            id="wd-quiz-type"
            className="form-control"
            value={quiz.quizType || "Graded Quiz"}
            onChange={(e) => set({ quizType: e.target.value })}
          >
            <option value="Graded Quiz">Graded Quiz</option>
            <option value="Practice Quiz">Practice Quiz</option>
            <option value="Graded Survey">Graded Survey</option>
            <option value="Ungraded Survey">Ungraded Survey</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3} className="text-md-end pt-md-2">
          <Form.Label htmlFor="wd-quiz-group">Assignment Group</Form.Label>
        </Col>
        <Col md={9}>
          <Form.Select
            id="wd-quiz-group"
            className="form-control"
            value={quiz.assignmentGroup || "Quizzes"}
            onChange={(e) => set({ assignmentGroup: e.target.value })}
          >
            <option value="Quizzes">Quizzes</option>
            <option value="Exams">Exams</option>
            <option value="Assignments">Assignments</option>
            <option value="Project">Project</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3} className="text-md-end pt-md-2">
          <Form.Label htmlFor="wd-quiz-points">Points</Form.Label>
        </Col>
        <Col md={9}>
          {/* The points are the sum of the questions, so I only show them. */}
          <Form.Control
            id="wd-quiz-points"
            type="number"
            readOnly
            value={totalPoints(quiz)}
          />
          <Form.Text>The sum of the points of every question.</Form.Text>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3} className="text-md-end pt-md-2">
          <Form.Label>Options</Form.Label>
        </Col>
        <Col md={9}>
          <div className="border rounded p-3">
            <Form.Check
              id="wd-shuffle-answers"
              label="Shuffle Answers"
              checked={quiz.shuffleAnswers !== false}
              onChange={(e) => set({ shuffleAnswers: e.target.checked })}
            />

            <div className="d-flex align-items-center my-2">
              <Form.Check
                id="wd-time-limit"
                label="Time Limit"
                className="me-3"
                checked={quiz.hasTimeLimit !== false}
                onChange={(e) => set({ hasTimeLimit: e.target.checked })}
              />
              <Form.Control
                id="wd-time-limit-minutes"
                type="number"
                style={{ width: 110 }}
                value={quiz.timeLimit === undefined ? 20 : quiz.timeLimit}
                onChange={(e) =>
                  set({
                    timeLimit: e.target.value === "" ? 0 : parseInt(e.target.value),
                  })
                }
              />
              <span className="ms-2">Minutes</span>
            </div>

            <Form.Check
              id="wd-multiple-attempts"
              label="Allow Multiple Attempts"
              checked={quiz.multipleAttempts === true}
              onChange={(e) => set({ multipleAttempts: e.target.checked })}
            />

            {/* How many tries only makes sense with multiple attempts. */}
            {quiz.multipleAttempts && (
              <div className="d-flex align-items-center my-2">
                <Form.Label htmlFor="wd-how-many-attempts" className="me-3 mb-0">
                  How Many Attempts
                </Form.Label>
                <Form.Control
                  id="wd-how-many-attempts"
                  type="number"
                  min={1}
                  style={{ width: 110 }}
                  value={quiz.howManyAttempts === undefined ? 1 : quiz.howManyAttempts}
                  onChange={(e) =>
                    set({
                      howManyAttempts:
                        e.target.value === "" ? 1 : parseInt(e.target.value),
                    })
                  }
                />
              </div>
            )}

            <Form.Check
              id="wd-show-correct-answers"
              label="Show Correct Answers"
              checked={quiz.showCorrectAnswers === true}
              onChange={(e) => set({ showCorrectAnswers: e.target.checked })}
            />
            <Form.Check
              id="wd-one-question-at-a-time"
              label="One Question at a Time"
              checked={quiz.oneQuestionAtATime !== false}
              onChange={(e) => set({ oneQuestionAtATime: e.target.checked })}
            />
            <Form.Check
              id="wd-webcam-required"
              label="Webcam Required"
              checked={quiz.webcamRequired === true}
              onChange={(e) => set({ webcamRequired: e.target.checked })}
            />
            <Form.Check
              id="wd-lock-questions"
              label="Lock Questions After Answering"
              checked={quiz.lockQuestionsAfterAnswering === true}
              onChange={(e) =>
                set({ lockQuestionsAfterAnswering: e.target.checked })
              }
            />

            <Form.Group className="mt-3" controlId="wd-access-code">
              <Form.Label>Access Code</Form.Label>
              <Form.Control
                placeholder="Leave it empty for no code"
                value={quiz.accessCode || ""}
                onChange={(e) => set({ accessCode: e.target.value })}
              />
            </Form.Group>
          </div>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3} className="text-md-end pt-md-2">
          <Form.Label htmlFor="wd-due-date">Assign</Form.Label>
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
                value={quiz.dueDate ? quiz.dueDate.slice(0, 10) : ""}
                onChange={(e) => set({ dueDate: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="wd-available-date">
                  <Form.Label className="fw-bold">Available from</Form.Label>
                  <Form.Control
                    type="date"
                    value={quiz.availableDate ? quiz.availableDate.slice(0, 10) : ""}
                    onChange={(e) => set({ availableDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="wd-until-date">
                  <Form.Label className="fw-bold">Until</Form.Label>
                  <Form.Control
                    type="date"
                    value={quiz.untilDate ? quiz.untilDate.slice(0, 10) : ""}
                    onChange={(e) => set({ untilDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
