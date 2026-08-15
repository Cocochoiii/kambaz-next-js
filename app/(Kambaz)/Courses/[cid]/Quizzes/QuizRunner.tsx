"use client";

// One screen answers a quiz three ways.
// take is a student. preview is a faculty.
// review only reads an attempt that is done.
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { questionsOf } from "./helpers";

// I mix a copy of the list, so the first order stays safe.
function mix(list: any[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const keep = copy[i];
    copy[i] = copy[j];
    copy[j] = keep;
  }
  return copy;
}

function sameText(one: any, two: any) {
  return String(one || "").trim().toLowerCase() ===
    String(two || "").trim().toLowerCase();
}

// The browser marks a done attempt green or red. The score itself
// always comes from the server, so this is only for the picture.
function isCorrect(question: any, given: any) {
  if (question.type === "TRUE_FALSE") {
    return given === true || given === false
      ? given === (question.correctAnswer === true)
      : false;
  }
  if (question.type === "FILL_BLANK") {
    return (question.answers || []).some((answer: string) =>
      sameText(answer, given)
    );
  }
  const right = (question.choices || [])
    .filter((choice: any) => choice.correct)
    .map((choice: any) => choice._id);
  const picked = given || [];
  if (right.length === 0 || picked.length !== right.length) { return false; }
  return right.every((id: string) => picked.includes(id));
}

// The right answer in words, for the review screen.
function correctText(question: any) {
  if (question.type === "TRUE_FALSE") {
    return question.correctAnswer === true ? "True" : "False";
  }
  if (question.type === "FILL_BLANK") {
    return (question.answers || []).join(", ");
  }
  return (question.choices || [])
    .filter((choice: any) => choice.correct)
    .map((choice: any) => choice.text)
    .join(", ");
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

export default function QuizRunner({
  quiz,
  mode,
  initialAnswers,
  onSubmit,
}: {
  quiz: any;
  mode: "take" | "preview" | "review";
  initialAnswers?: any;
  onSubmit?: (answers: any[], timeTaken: number) => void;
}) {
  const review = mode === "review";
  const base = questionsOf(quiz);

  // The order is fixed once, when the screen opens. If it changed on
  // every key press, the questions would jump around.
  const [order] = useState(() => {
    const list = base.map((question: any) => ({
      question,
      choices: quiz.shuffleAnswers && !review
        ? mix(question.choices || [])
        : question.choices || [],
    }));
    return list;
  });

  const [answers, setAnswers] = useState<any>(initialAnswers || {});
  const [current, setCurrent] = useState(0);
  const [sending, setSending] = useState(false);
  const [startedAt] = useState(() => new Date().getTime());

  const oneAtATime = quiz.oneQuestionAtATime !== false;
  const hasTimer = mode === "take" && quiz.hasTimeLimit !== false
    && Number(quiz.timeLimit) > 0;
  const [left, setLeft] = useState(
    hasTimer ? Number(quiz.timeLimit) * 60 : 0
  );

  const send = () => {
    if (sending || review || !onSubmit) { return; }
    setSending(true);
    const list = order.map((row: any) => ({
      questionId: row.question._id,
      answer: answers[row.question._id] === undefined
        ? null
        : answers[row.question._id],
    }));
    const seconds = Math.round((new Date().getTime() - startedAt) / 1000);
    onSubmit(list, seconds);
  };

  // The clock. One second at a time. At zero I send the answers.
  useEffect(() => {
    if (!hasTimer || sending) { return; }
    if (left <= 0) {
      send();
      return;
    }
    const timer = setTimeout(() => setLeft(left - 1), 1000);
    return () => clearTimeout(timer);
  }, [left, hasTimer, sending]);

  if (order.length === 0) {
    return <div className="text-muted">This quiz has no questions yet.</div>;
  }

  const setAnswer = (questionId: string, value: any) => {
    if (review || sending) { return; }
    setAnswers({ ...answers, [questionId]: value });
  };

  // A multiple choice question with two right choices needs check boxes.
  const pickChoice = (question: any, choiceId: string) => {
    const many = (question.choices || [])
      .filter((choice: any) => choice.correct).length > 1;
    const picked = answers[question._id] || [];
    if (!many) {
      setAnswer(question._id, [choiceId]);
      return;
    }
    setAnswer(
      question._id,
      picked.includes(choiceId)
        ? picked.filter((id: string) => id !== choiceId)
        : [...picked, choiceId]
    );
  };

  const shown = oneAtATime ? [order[current]] : order;

  return (
    <div id="wd-quiz-runner">
      {hasTimer && (
        <div className="mb-2">
          <b>Time Remaining</b>{" "}
          {twoDigits(Math.floor(left / 60))}:{twoDigits(left % 60)}
        </div>
      )}

      {shown.map((row: any) => {
        const question = row.question;
        const given = answers[question._id];
        const right = review ? isCorrect(question, given) : null;
        const many = (question.choices || [])
          .filter((choice: any) => choice.correct).length > 1;
        const picked = given || [];
        return (
          <div key={question._id} className="border mb-3">
            {/* The gray head of a Canvas question box. */}
            <div className="bg-secondary p-2 d-flex align-items-center">
              <b className="flex-fill">
                {question.title || "Question"}
                {review && right && <FaCheck className="ms-2 text-success" />}
                {review && !right && <FaTimes className="ms-2 text-danger" />}
              </b>
              <span>{Number(question.points) || 0} pts</span>
            </div>

            <div className="p-3">
              <div
                className="mb-3"
                dangerouslySetInnerHTML={{ __html: question.question || "" }}
              />

              {question.type === "TRUE_FALSE" && (
                <>
                  <Form.Check
                    type="radio"
                    name={`wd-answer-${question._id}`}
                    label="True"
                    disabled={review}
                    checked={given === true}
                    onChange={() => setAnswer(question._id, true)}
                  />
                  <Form.Check
                    type="radio"
                    name={`wd-answer-${question._id}`}
                    label="False"
                    disabled={review}
                    checked={given === false}
                    onChange={() => setAnswer(question._id, false)}
                  />
                </>
              )}

              {question.type === "FILL_BLANK" && (
                <Form.Control
                  style={{ maxWidth: 320 }}
                  placeholder="Your answer"
                  disabled={review}
                  value={given || ""}
                  onChange={(e) => setAnswer(question._id, e.target.value)}
                />
              )}

              {question.type === "MULTIPLE_CHOICE" &&
                row.choices.map((choice: any) => (
                  <Form.Check
                    key={choice._id}
                    type={many ? "checkbox" : "radio"}
                    name={`wd-answer-${question._id}`}
                    label={choice.text}
                    disabled={review}
                    checked={picked.includes(choice._id)}
                    onChange={() => pickChoice(question, choice._id)}
                  />
                ))}

              {/* Canvas shows the right answer only when I allow it. */}
              {review && !right && quiz.showCorrectAnswers && (
                <p className="text-success mt-3 mb-0">
                  <b>Correct answer:</b> {correctText(question)}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* One question at a time needs the two arrows and the jump list. */}
      {oneAtATime && (
        <div className="mb-3 d-flex flex-wrap align-items-center">
          <Button
            variant="secondary"
            className="me-2"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            className="me-3"
            disabled={current === order.length - 1}
            onClick={() => setCurrent(current + 1)}
          >
            Next
          </Button>
          <span className="me-2">Jump to:</span>
          {order.map((row: any, index: number) => (
            <Button
              key={row.question._id}
              size="sm"
              className="me-1 mb-1"
              variant={index === current ? "danger" : "outline-secondary"}
              onClick={() => setCurrent(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      )}

      {!review && (
        <Button
          id="wd-submit-quiz-btn"
          variant="danger"
          disabled={sending}
          onClick={send}
        >
          Submit Quiz
        </Button>
      )}
    </div>
  );
}
