"use client";

// The editor of one question.
// Title, points and the question text are the same for every type.
// The part under them changes with the type.
import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa6";
import RichText from "../../RichText";
import { newId } from "../../helpers";

// Multiple choice. I can add and remove choices, and I tick the
// ones that are correct.
function MultipleChoice({ question, set }: any) {
  const choices = question.choices || [];

  const setChoices = (list: any[]) => set({ choices: list });

  return (
    <div>
      <Form.Label className="fw-bold">Answers</Form.Label>
      {choices.map((choice: any) => (
        <div key={choice._id} className="d-flex align-items-center mb-2">
          <Form.Check
            className="me-2"
            title="This choice is correct"
            checked={choice.correct === true}
            onChange={() =>
              setChoices(
                choices.map((one: any) =>
                  one._id === choice._id ? { ...one, correct: !one.correct } : one
                )
              )
            }
          />
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Possible answer"
            value={choice.text || ""}
            onChange={(e) =>
              setChoices(
                choices.map((one: any) =>
                  one._id === choice._id ? { ...one, text: e.target.value } : one
                )
              )
            }
          />
          <FaTrash
            role="button"
            aria-label="Remove answer"
            className="text-danger ms-2"
            onClick={() =>
              setChoices(choices.filter((one: any) => one._id !== choice._id))
            }
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          setChoices([...choices, { _id: newId(), text: "", correct: false }])
        }
      >
        <FaPlus className="me-2" />
        Add Another Answer
      </Button>
    </div>
  );
}

// True or false. Two radio buttons, one right answer.
function TrueFalse({ question, set }: any) {
  return (
    <div>
      <Form.Label className="fw-bold">Correct Answer</Form.Label>
      <Form.Check
        type="radio"
        name={`wd-true-false-${question._id}`}
        label="True"
        checked={question.correctAnswer === true}
        onChange={() => set({ correctAnswer: true })}
      />
      <Form.Check
        type="radio"
        name={`wd-true-false-${question._id}`}
        label="False"
        checked={question.correctAnswer === false}
        onChange={() => set({ correctAnswer: false })}
      />
    </div>
  );
}

// Fill in the blank. A list of answers I accept. The server does
// not look at upper and lower case.
function FillBlank({ question, set }: any) {
  const answers = question.answers || [];
  const setAnswers = (list: string[]) => set({ answers: list });

  return (
    <div>
      <Form.Label className="fw-bold">
        Possible Correct Answers
      </Form.Label>
      {answers.map((answer: string, index: number) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Possible answer"
            value={answer}
            onChange={(e) =>
              setAnswers(
                answers.map((one: string, i: number) =>
                  i === index ? e.target.value : one
                )
              )
            }
          />
          <FaTrash
            role="button"
            aria-label="Remove answer"
            className="text-danger ms-2"
            onClick={() =>
              setAnswers(answers.filter((one: string, i: number) => i !== index))
            }
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setAnswers([...answers, ""])}
      >
        <FaPlus className="me-2" />
        Add Another Answer
      </Button>
    </div>
  );
}

export default function QuestionEditor({
  question,
  onSave,
  onCancel,
}: {
  question: any;
  onSave: (question: any) => void;
  onCancel: () => void;
}) {
  // I work on my own copy. So Cancel really drops the changes.
  const [mine, setMine] = useState<any>({
    ...question,
    choices: (question.choices || []).map((choice: any) => ({ ...choice })),
    answers: [...(question.answers || [])],
  });

  const set = (changes: any) => setMine({ ...mine, ...changes });

  // A new type may need a part the question does not have yet.
  const changeType = (type: string) => {
    const next = { ...mine, type };
    if (type === "MULTIPLE_CHOICE" && next.choices.length === 0) {
      next.choices = [
        { _id: newId(), text: "", correct: true },
        { _id: newId(), text: "", correct: false },
      ];
    }
    if (type === "TRUE_FALSE" && typeof next.correctAnswer !== "boolean") {
      next.correctAnswer = true;
    }
    if (type === "FILL_BLANK" && next.answers.length === 0) {
      next.answers = [""];
    }
    setMine(next);
  };

  return (
    <div className="p-3">
      <Row className="mb-3">
        <Col md={5}>
          <Form.Label htmlFor="wd-question-title">Title</Form.Label>
          <Form.Control
            id="wd-question-title"
            value={mine.title || ""}
            onChange={(e) => set({ title: e.target.value })}
          />
        </Col>
        <Col md={4}>
          <Form.Label htmlFor="wd-question-type">Type</Form.Label>
          <Form.Select
            id="wd-question-type"
            className="form-control"
            value={mine.type}
            onChange={(e) => changeType(e.target.value)}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_BLANK">Fill in the Blank</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label htmlFor="wd-question-points">Points</Form.Label>
          <Form.Control
            id="wd-question-points"
            type="number"
            value={mine.points === undefined ? 0 : mine.points}
            onChange={(e) =>
              set({ points: e.target.value === "" ? 0 : parseInt(e.target.value) })
            }
          />
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>Question</Form.Label>
        <RichText
          value={mine.question}
          onChange={(html: string) => set({ question: html })}
        />
      </Form.Group>

      {mine.type === "MULTIPLE_CHOICE" && (
        <MultipleChoice question={mine} set={set} />
      )}
      {mine.type === "TRUE_FALSE" && <TrueFalse question={mine} set={set} />}
      {mine.type === "FILL_BLANK" && <FillBlank question={mine} set={set} />}

      <hr />
      <Button variant="secondary" className="me-2" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="danger" onClick={() => onSave(mine)}>
        Update Question
      </Button>
    </div>
  );
}
