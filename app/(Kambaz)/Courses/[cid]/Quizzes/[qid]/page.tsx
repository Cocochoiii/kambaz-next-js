"use client";

// The Quiz Details screen.
// A faculty reads the summary and opens Preview or Edit.
// A student only gets a button that starts the quiz.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import * as quizzesClient from "../client";
import { useIsFaculty } from "../../../../Account/roles";
import {
  attemptLimit,
  availability,
  isPublished,
  longDate,
  questionCount,
  totalPoints,
} from "../helpers";

// One line of the summary table.
function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="d-flex border-bottom py-2">
      <div className="text-end fw-bold pe-3" style={{ width: 260 }}>
        {label}
      </div>
      <div>{value}</div>
    </div>
  );
}

export default function QuizDetails() {
  const params = useParams<{ cid: string; qid: string }>();
  const cid = params ? params.cid : "";
  const qid = params ? params.qid : "";
  const router = useRouter();

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = useIsFaculty();

  const [quiz, setQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<any>({ count: 0, last: null });

  const fetchQuiz = async () => {
    const found = await quizzesClient.findQuizById(qid);
    setQuiz(found);
  };

  // A student also needs their own tries, to know if one is left.
  const fetchAttempts = async () => {
    if (isFaculty || !currentUser) { return; }
    const found = await quizzesClient.findAttempts(qid, currentUser._id);
    setAttempts(found);
  };

  useEffect(() => {
    if (qid) {
      fetchQuiz();
      fetchAttempts();
    }
  }, [qid, isFaculty, currentUser]);

  if (!quiz) {
    return <div id="wd-quiz-details">Loading...</div>;
  }

  const points = totalPoints(quiz);
  const open = availability(quiz);
  const limit = attemptLimit(quiz);
  const left = limit - attempts.count;

  const togglePublish = async () => {
    const updated = { ...quiz, published: !isPublished(quiz) };
    await quizzesClient.updateQuiz(updated);
    setQuiz(updated);
  };

  // A quiz that is not published does not exist for a student.
  // Hiding it in the list is not enough. The address must work too.
  if (!isFaculty && !isPublished(quiz)) {
    return (
      <div id="wd-quiz-details">
        <h2>{quiz.title}</h2>
        <hr />
        <p className="text-danger">This quiz is not available yet.</p>
        <Link href={`/Courses/${cid}/Quizzes`} className="btn btn-secondary">
          Back to Quizzes
        </Link>
      </div>
    );
  }

  // The student screen. No form, only the button that starts the quiz.
  if (!isFaculty) {
    return (
      <div id="wd-quiz-details">
        <h2>{quiz.title}</h2>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: quiz.description || "" }} />
        <ul className="list-unstyled">
          <li className="mb-1"><b>Points:</b> {points}</li>
          <li className="mb-1"><b>Questions:</b> {questionCount(quiz)}</li>
          <li className="mb-1"><b>Due:</b> {longDate(quiz.dueDate)}</li>
          <li className="mb-1">
            <b>Available:</b> {longDate(quiz.availableDate)} - {longDate(quiz.untilDate)}
          </li>
          <li className="mb-1">
            <b>Time Limit:</b>{" "}
            {quiz.hasTimeLimit === false ? "No time limit" : `${quiz.timeLimit || 20} Minutes`}
          </li>
          <li className="mb-1"><b>Allowed Attempts:</b> {limit}</li>
        </ul>

        {attempts.last && (
          <p>
            <b>Your last score:</b> {attempts.last.score} out of {points}
          </p>
        )}

        {open.state !== "available" && (
          <p className="text-danger">{open.label}</p>
        )}

        <hr />
        {open.state === "available" && left > 0 && (
          <Button
            id="wd-take-quiz-btn"
            variant="danger"
            className="me-2"
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
          >
            {attempts.count === 0 ? "Take the Quiz" : "Take the Quiz Again"}
          </Button>
        )}
        {attempts.last && (
          <Link
            href={`/Courses/${cid}/Quizzes/${qid}/take?review=true`}
            id="wd-review-quiz-btn"
            className="btn btn-secondary me-2"
          >
            View Last Attempt
          </Link>
        )}
        {left <= 0 && (
          <span className="text-muted">You used all {limit} attempts.</span>
        )}
      </div>
    );
  }

  // The faculty screen. The summary of every quiz property.
  return (
    <div id="wd-quiz-details">
      <div className="text-center mb-3">
        <Button
          id="wd-publish-quiz-btn"
          variant="secondary"
          className="me-2"
          onClick={togglePublish}
        >
          {isPublished(quiz) ? "Unpublish" : "Publish"}
        </Button>
        <Link
          href={`/Courses/${cid}/Quizzes/${qid}/preview`}
          id="wd-preview-quiz-btn"
          className="btn btn-secondary me-2"
        >
          Preview
        </Link>
        <Link
          href={`/Courses/${cid}/Quizzes/${qid}/edit`}
          id="wd-edit-quiz-btn"
          className="btn btn-danger"
        >
          Edit
        </Link>
      </div>
      <hr />

      <h2>{quiz.title}</h2>

      <Row label="Quiz Type" value={quiz.quizType || "Graded Quiz"} />
      <Row label="Points" value={points} />
      <Row label="Assignment Group" value={quiz.assignmentGroup || "Quizzes"} />
      <Row label="Shuffle Answers" value={quiz.shuffleAnswers === false ? "No" : "Yes"} />
      <Row
        label="Time Limit"
        value={quiz.hasTimeLimit === false ? "No" : `${quiz.timeLimit || 20} Minutes`}
      />
      <Row label="Multiple Attempts" value={quiz.multipleAttempts ? "Yes" : "No"} />
      <Row label="How Many Attempts" value={limit} />
      <Row label="Show Correct Answers" value={quiz.showCorrectAnswers ? "Yes" : "No"} />
      <Row label="Access Code" value={quiz.accessCode || "None"} />
      <Row
        label="One Question at a Time"
        value={quiz.oneQuestionAtATime === false ? "No" : "Yes"}
      />
      <Row label="Webcam Required" value={quiz.webcamRequired ? "Yes" : "No"} />
      <Row
        label="Lock Questions After Answering"
        value={quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}
      />

      {/* The three dates get their own table, the way Canvas shows them. */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Due</th>
            <th>For</th>
            <th>Available from</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{longDate(quiz.dueDate)}</td>
            <td>Everyone</td>
            <td>{longDate(quiz.availableDate)}</td>
            <td>{longDate(quiz.untilDate)}</td>
          </tr>
        </tbody>
      </table>

      <Link href={`/Courses/${cid}/Quizzes`} className="btn btn-secondary">
        Back to Quizzes
      </Link>
    </div>
  );
}
