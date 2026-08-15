"use client";

// The Quiz Preview screen. Only a faculty comes here.
// I answer the quiz like a student and I see the score.
// Nothing is saved, because a preview is not a real attempt.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
import QuizRunner from "../../QuizRunner";
import * as quizzesClient from "../../client";
import { questionsOf, totalPoints } from "../../helpers";
import { useIsFaculty } from "../../../../../Account/roles";

function sameText(one: any, two: any) {
  return String(one || "").trim().toLowerCase() ===
    String(two || "").trim().toLowerCase();
}

// The same rule the server uses. Here it only makes the preview score.
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

export default function QuizPreview() {
  const params = useParams<{ cid: string; qid: string }>();
  const cid = params ? params.cid : "";
  const qid = params ? params.qid : "";
  const router = useRouter();
  const isFaculty = useIsFaculty();

  const [quiz, setQuiz] = useState<any>(null);
  // done holds the answers and the score of the preview.
  const [done, setDone] = useState<any>(null);

  const fetchQuiz = async () => {
    const found = await quizzesClient.findQuizById(qid);
    setQuiz(found);
  };

  useEffect(() => {
    if (qid) {
      fetchQuiz();
    }
  }, [qid]);

  // Preview is a faculty screen. A student goes to the details screen.
  useEffect(() => {
    if (!isFaculty) {
      router.replace(`/Courses/${cid}/Quizzes/${qid}`);
    }
  }, [isFaculty, cid, qid, router]);

  if (!isFaculty) {
    return null;
  }
  if (!quiz) {
    return <div id="wd-quiz-preview">Loading...</div>;
  }

  const points = totalPoints(quiz);

  // I count the score here, because nothing goes to the server.
  const finish = (list: any[]) => {
    const map: any = {};
    let score = 0;
    for (const item of list) {
      map[item.questionId] = item.answer;
    }
    for (const question of questionsOf(quiz)) {
      if (isCorrect(question, map[question._id])) {
        score = score + (Number(question.points) || 0);
      }
    }
    setDone({ answers: map, score });
  };

  return (
    <div id="wd-quiz-preview">
      <div className="clearfix mb-3">
        <Link
          href={`/Courses/${cid}/Quizzes/${qid}/edit?tab=questions`}
          id="wd-edit-quiz-from-preview"
          className="btn btn-secondary float-end"
        >
          Edit Quiz
        </Link>
        <h2 className="m-0">{quiz.title}</h2>
      </div>

      <p className="text-muted">
        This is a preview. My answers are not saved.
      </p>
      <hr />

      {done ? (
        <>
          <p className="fw-bold">
            Score: {done.score} out of {points}
          </p>
          <QuizRunner key="review" quiz={quiz} mode="review"
                      initialAnswers={done.answers} />
          <Button variant="secondary" onClick={() => setDone(null)}>
            Preview Again
          </Button>
        </>
      ) : (
        <QuizRunner
          key="preview"
          quiz={quiz}
          mode="preview"
          onSubmit={(list: any[]) => finish(list)}
        />
      )}
    </div>
  );
}
