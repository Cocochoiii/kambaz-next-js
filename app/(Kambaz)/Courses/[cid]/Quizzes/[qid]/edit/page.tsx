"use client";

// The Quiz Editor. It has two tabs, Details and Questions.
// Save keeps the changes. Save and Publish also publishes.
// Cancel drops everything and goes back to the list.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DetailsTab from "./DetailsTab";
import QuestionsTab from "./QuestionsTab";
import * as quizzesClient from "../../client";
import { updateQuiz as updateQuizInStore } from "../../reducer";
import { totalPoints } from "../../helpers";
import { useIsFaculty } from "../../../../../Account/roles";

export default function QuizEditor() {
  const params = useParams<{ cid: string; qid: string }>();
  const cid = params ? params.cid : "";
  const qid = params ? params.qid : "";
  const router = useRouter();
  const dispatch = useDispatch();
  const isFaculty = useIsFaculty();

  const [quiz, setQuiz] = useState<any>(null);
  // Details is the tab I see first.
  const [tab, setTab] = useState("details");

  const fetchQuiz = async () => {
    const found = await quizzesClient.findQuizById(qid);
    setQuiz(found);
  };

  useEffect(() => {
    if (qid) {
      fetchQuiz();
    }
  }, [qid]);

  // Preview sends me here with ?tab=questions, so I open that tab.
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("tab") === "questions") {
      setTab("questions");
    }
  }, []);

  // A student can not edit a quiz.
  // So I send them back to the details screen.
  useEffect(() => {
    if (!isFaculty) {
      router.replace(`/Courses/${cid}/Quizzes/${qid}`);
    }
  }, [isFaculty, cid, qid, router]);

  if (!isFaculty) {
    return null;
  }
  if (!quiz) {
    return <div id="wd-quizzes-editor">Loading...</div>;
  }

  // One small change of one field.
  const set = (changes: any) => setQuiz({ ...quiz, ...changes });

  // publish is undefined for a plain Save. Then I leave the field
  // alone, so a published quiz does not go back to not published.
  const save = async (publish?: boolean) => {
    const updated = { ...quiz, points: totalPoints(quiz) };
    if (publish === true) {
      updated.published = true;
    }
    await quizzesClient.updateQuiz(updated);
    dispatch(updateQuizInStore(updated));
    if (publish === true) {
      router.push(`/Courses/${cid}/Quizzes`);
    } else {
      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    }
  };

  return (
    <div id="wd-quizzes-editor">
      <div className="clearfix mb-3">
        <span className="float-end fw-bold">Points {totalPoints(quiz)}</span>
        <span className="float-end me-3">
          {quiz.published ? "Published" : "Not Published"}
        </span>
      </div>

      <Nav variant="tabs" activeKey={tab} className="mb-4">
        <Nav.Item>
          <Nav.Link
            id="wd-quiz-details-tab"
            eventKey="details"
            onClick={() => setTab("details")}
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            id="wd-quiz-questions-tab"
            eventKey="questions"
            onClick={() => setTab("questions")}
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {tab === "details"
        ? <DetailsTab quiz={quiz} set={set} />
        : <QuestionsTab quiz={quiz} setQuiz={setQuiz} />}

      <hr />

      {/* Save keeps the changes. Cancel drops them. */}
      <div className="clearfix mb-3">
        <Button
          id="wd-save-publish-btn"
          className="btn btn-danger float-end"
          onClick={() => save(true)}
        >
          Save &amp; Publish
        </Button>
        <Button
          id="wd-save-btn"
          className="btn btn-secondary me-2 float-end"
          onClick={() => save()}
        >
          Save
        </Button>
        <Button
          id="wd-cancel-btn"
          className="btn btn-secondary me-2 float-end"
          onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
