"use client";

// The Quizzes screen. Canvas has it, the book does not.
// The list comes from the server.
// It is read only, so useState is enough.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BsRocket, BsRocketFill, BsThreeDotsVertical } from "react-icons/bs";
import * as coursesClient from "../../client";

export default function Quizzes() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const [quizzes, setQuizzes] = useState<any[]>([]);

  const fetchQuizzes = async () => {
    const found = await coursesClient.findQuizzesForCourse(cid);
    setQuizzes(found);
  };

  useEffect(() => {
    if (cid) {
      fetchQuizzes();
    }
  }, [cid]);

  return (
    <div id="wd-quizzes">
      <div className="input-group mb-4" style={{ width: "300px" }}>
        <input id="wd-search-quiz" className="form-control" placeholder="Search for Quiz" />
      </div>

      <div className="p-3 bg-secondary border border-secondary">
        <span id="wd-quizzes-title" className="fw-bold">ASSIGNMENT QUIZZES</span>
      </div>

      <ul id="wd-quiz-list" className="list-group rounded-0">
        {quizzes.map((quiz: any) => (
          <li
            key={quiz._id}
            className="wd-quiz-list-item list-group-item p-3 ps-1 d-flex align-items-center"
          >
            <div className="me-3 ms-2">
              {/* Closed quiz: gray rocket. Open quiz: green rocket. */}
              {quiz.status === "Closed"
                ? <BsRocket className="fs-4 text-secondary" />
                : <BsRocketFill className="fs-4 text-success" />}
            </div>
            <div className="flex-fill">
              <span className="fw-bold">{quiz.title}</span>
              <p className="mb-0">
                <b>{quiz.status}</b>
                {" | "}<b>Due</b> {quiz.dueDate}
                {" | "}{quiz.points} pts
                {" | "}{quiz.questions} Questions
              </p>
            </div>
            <div className="ms-3">
              <BsThreeDotsVertical className="fs-4" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
