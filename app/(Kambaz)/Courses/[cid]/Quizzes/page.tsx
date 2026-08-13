// The Quizzes screen. The book does not ask for it, I added it because Canvas
// has it. It reads the quizzes of this course from the Database.
import { BsRocket, BsRocketFill, BsThreeDotsVertical } from "react-icons/bs";
import * as db from "../../../Database";

export default async function Quizzes({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const quizzes = db.quizzes.filter((quiz) => quiz.course === cid);

  return (
    <div id="wd-quizzes">
      <div className="input-group mb-4" style={{ width: "300px" }}>
        <input id="wd-search-quiz" className="form-control" placeholder="Search for Quiz" />
      </div>

      <div className="p-3 bg-secondary border border-secondary">
        <span id="wd-quizzes-title" className="fw-bold">ASSIGNMENT QUIZZES</span>
      </div>

      <ul id="wd-quiz-list" className="list-group rounded-0">
        {quizzes.map((quiz) => (
          <li
            key={quiz._id}
            className="wd-quiz-list-item list-group-item p-3 ps-1 d-flex align-items-center"
          >
            <div className="me-3 ms-2">
              {/* A closed quiz gets the gray rocket, an open one the green rocket. */}
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
