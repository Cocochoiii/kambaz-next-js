"use client";

// The screen where a student takes the quiz.
// The server grades the answers and keeps them, so I can come back
// later and see my last try again.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import QuizRunner from "../../QuizRunner";
import * as quizzesClient from "../../client";
import { attemptLimit, availability, longDate, totalPoints } from "../../helpers";

export default function TakeQuiz() {
  const params = useParams<{ cid: string; qid: string }>();
  const cid = params ? params.cid : "";
  const qid = params ? params.qid : "";

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const [quiz, setQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<any>({ count: 0, last: null, attempts: [] });
  // review turns true after I submit.
  // It is also true when I come back to read my last try.
  const [review, setReview] = useState(false);
  const [code, setCode] = useState("");
  const [codeOk, setCodeOk] = useState(false);

  const fetchAll = async () => {
    const found = await quizzesClient.findQuizById(qid);
    setQuiz(found);
    if (currentUser) {
      const mine = await quizzesClient.findAttempts(qid, currentUser._id);
      setAttempts(mine);
    }
  };

  useEffect(() => {
    if (qid) {
      fetchAll();
    }
  }, [qid, currentUser]);

  // The details screen sends me here with ?review=true.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("review") === "true") {
      setReview(true);
    }
  }, []);

  if (!quiz) {
    return <div id="wd-take-quiz">Loading...</div>;
  }

  const points = totalPoints(quiz);
  const open = availability(quiz);
  const limit = attemptLimit(quiz);
  const left = limit - attempts.count;
  const last = attempts.last;

  // The answers of my last try, as one object the runner understands.
  const lastAnswers: any = {};
  if (last) {
    for (const item of last.answers || []) {
      lastAnswers[item.questionId] = item.answer;
    }
  }

  const submit = async (list: any[], timeTaken: number) => {
    // The server can still say no, for example when the tries run out.
    // Then I tell the student, instead of showing a dead screen.
    try {
      await quizzesClient.createAttempt(qid, {
        user: currentUser ? currentUser._id : "",
        answers: list,
        timeTaken,
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      window.alert(message || "I could not send your answers. Try again.");
      return;
    }
    await fetchAll();
    setReview(true);
  };

  const header = (
    <div className="clearfix mb-3">
      <Link
        href={`/Courses/${cid}/Quizzes/${qid}`}
        className="btn btn-secondary float-end"
      >
        Back to Quiz
      </Link>
      <h2 className="m-0">{quiz.title}</h2>
    </div>
  );

  // The quiz is closed or it has not opened yet.
  if (open.state !== "available" && !review) {
    return (
      <div id="wd-take-quiz">
        {header}
        <hr />
        <p className="text-danger">{open.label}</p>
        <p>Available: {longDate(quiz.availableDate)} - {longDate(quiz.untilDate)}</p>
      </div>
    );
  }

  // My last try. Every question gets a green check or a red cross.
  if (review && last) {
    return (
      <div id="wd-take-quiz">
        {header}
        <hr />
        <p className="fw-bold">
          Score: {last.score} out of {points}
        </p>
        <p className="text-muted">
          Attempt {last.attemptNumber} of {limit}, submitted{" "}
          {new Date(last.submittedAt).toLocaleString()}
        </p>
        <QuizRunner key="review" quiz={quiz} mode="review"
                    initialAnswers={lastAnswers} />
        {open.state === "available" && left > 0 && (
          <Button variant="danger" onClick={() => setReview(false)}>
            Take the Quiz Again
          </Button>
        )}
        {left <= 0 && (
          <p className="text-muted">You used all {limit} attempts.</p>
        )}
      </div>
    );
  }

  // No attempt is left.
  if (left <= 0) {
    return (
      <div id="wd-take-quiz">
        {header}
        <hr />
        <p>You used all {limit} attempts of this quiz.</p>
      </div>
    );
  }

  // The quiz asks for a code before it opens.
  if (quiz.accessCode && !codeOk) {
    return (
      <div id="wd-take-quiz">
        {header}
        <hr />
        <p>This quiz needs an access code.</p>
        <div style={{ maxWidth: 320 }}>
          <Form.Control
            placeholder="Access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="danger"
            className="mt-2"
            onClick={() => setCodeOk(code === quiz.accessCode)}
          >
            Start the Quiz
          </Button>
          {code !== "" && code !== quiz.accessCode && (
            <p className="text-danger mt-2">This code is wrong.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="wd-take-quiz">
      {header}
      <hr />
      <p className="text-muted">
        Attempt {attempts.count + 1} of {limit}
      </p>
      <div dangerouslySetInnerHTML={{ __html: quiz.description || "" }} />
      <QuizRunner key="take" quiz={quiz} mode="take" onSubmit={submit} />
    </div>
  );
}
