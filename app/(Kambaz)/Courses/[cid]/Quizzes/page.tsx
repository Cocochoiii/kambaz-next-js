"use client";

// The Quizzes screen. Canvas has it, the book does not.
// Faculty can add, publish and delete. A student only sees the
// published quizzes and the score of the last try.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BsGripVertical, BsPlus, BsThreeDotsVertical, BsSearch,
         BsRocketFill } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import PublishToggle from "../Modules/PublishToggle";
import KebabMenu from "../../../KebabMenu";
import { useIsFaculty } from "../../../Account/roles";
import { setQuizzes, addQuiz, deleteQuiz, updateQuiz } from "./reducer";
import * as coursesClient from "../../client";
import * as quizzesClient from "./client";
import {
  availability,
  isPublished,
  questionCount,
  shortDate,
  totalPoints,
} from "./helpers";

export default function Quizzes() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";
  const router = useRouter();
  const dispatch = useDispatch();

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = useIsFaculty();

  const [search, setSearch] = useState("");
  // The score of the last attempt of this student, one per quiz.
  const [scores, setScores] = useState<any>({});

  // A student never sees a quiz that is not published.
  const courseQuizzes = quizzes
    .filter((quiz: any) => quiz.course === cid)
    .filter((quiz: any) => isFaculty || isPublished(quiz))
    .filter((quiz: any) =>
      (quiz.title || "").toLowerCase().includes(search.toLowerCase())
    );

  // Canvas sorts the list by the day the quiz opens.
  const sortedQuizzes = [...courseQuizzes].sort((a: any, b: any) =>
    (a.availableDate || "").localeCompare(b.availableDate || "")
  );

  const fetchQuizzes = async () => {
    const found = await coursesClient.findQuizzesForCourse(cid);
    dispatch(setQuizzes(found));
  };

  useEffect(() => {
    if (cid) {
      fetchQuizzes();
    }
  }, [cid]);

  // A student sees their own score under the title. So I ask the
  // server once for every quiz I can see.
  const fetchScores = async () => {
    if (isFaculty || !currentUser) {
      setScores({});
      return;
    }
    const mine: any = {};
    for (const quiz of courseQuizzes) {
      const found = await quizzesClient.findAttempts(quiz._id, currentUser._id);
      mine[quiz._id] = found.last ? found.last.score : null;
    }
    setScores(mine);
  };

  useEffect(() => {
    fetchScores();
  }, [quizzes, isFaculty, currentUser]);

  // + Quiz makes an empty quiz and opens the editor at once.
  const addQuizAndEdit = async () => {
    const created = await coursesClient.createQuizForCourse(cid, {
      title: "New Quiz",
      course: cid,
    });
    dispatch(addQuiz(created));
    router.push(`/Courses/${cid}/Quizzes/${created._id}/edit`);
  };

  // Publish only changes one field. So I reuse the update route.
  const togglePublish = async (quiz: any) => {
    const updated = { ...quiz, published: !isPublished(quiz) };
    await quizzesClient.updateQuiz(updated);
    dispatch(updateQuiz(updated));
  };

  const removeQuiz = async (quizId: string) => {
    // The book asks for a dialog.
    if (window.confirm("Are you sure you want to remove this quiz?")) {
      await quizzesClient.deleteQuiz(quizId);
      dispatch(deleteQuiz(quizId));
    }
  };

  return (
    <div id="wd-quizzes">
      {/* The buttons float right, so I write the right one first. */}
      <div className="clearfix mb-4">
        {isFaculty && (
          <>
            <button
              id="wd-add-quiz"
              className="btn btn-lg btn-danger float-end"
              onClick={addQuizAndEdit}
            >
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Quiz
            </button>
            <button id="wd-add-quiz-group" className="btn btn-lg btn-secondary me-2 float-end">
              <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
              Group
            </button>
          </>
        )}
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text bg-white">
            <BsSearch />
          </span>
          <input
            id="wd-search-quiz"
            className="form-control"
            placeholder="Search for Quiz"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* The ASSIGNMENT QUIZZES group title */}
      <div className="p-3 bg-secondary border border-secondary clearfix">
        <BsGripVertical className="me-2 fs-3" />
        <span id="wd-quizzes-title" className="fw-bold">ASSIGNMENT QUIZZES</span>
        <div className="float-end d-flex align-items-center">
          <BsPlus
            role={isFaculty ? "button" : undefined}
            aria-label="Add quiz"
            className="fs-4"
            onClick={isFaculty ? addQuizAndEdit : undefined}
          />
          <BsThreeDotsVertical className="fs-4" />
        </div>
      </div>

      {/* An empty list still tells me what to do next. */}
      {sortedQuizzes.length === 0 ? (
        <div id="wd-no-quizzes" className="border border-top-0 p-4 text-center">
          {isFaculty
            ? "There are no quizzes yet. Click the + Quiz button to add one."
            : "There are no quizzes yet."}
        </div>
      ) : (
        <ul id="wd-quiz-list" className="list-group rounded-0">
          {sortedQuizzes.map((quiz: any) => (
            <li
              key={quiz._id}
              className={`wd-quiz-list-item list-group-item p-3 ps-1 d-flex align-items-center ${
                isPublished(quiz) ? "" : "opacity-50"
              }`}
            >
              <BsGripVertical className="me-2 fs-3" />
              <BsRocketFill className="me-3 fs-3 text-success" />
              <div className="flex-fill">
                <Link
                  href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                  className="wd-quiz-link fw-bold text-dark text-decoration-none"
                >
                  {quiz.title}
                </Link>
                <p className="mb-0">
                  <b>{availability(quiz).label}</b>
                  {" | "}<b>Due</b> {shortDate(quiz.dueDate)}
                  {" | "}{totalPoints(quiz)} pts
                  {" | "}{questionCount(quiz)} Questions
                  {!isFaculty && scores[quiz._id] !== undefined
                    && scores[quiz._id] !== null
                    && <>{" | "}<b>Score</b> {scores[quiz._id]}</>}
                </p>
              </div>
              <div className="ms-3 d-flex align-items-center">
                {isFaculty && (
                  <FaTrash
                    role="button"
                    aria-label="Delete quiz"
                    title="Delete this quiz"
                    className="text-danger me-3"
                    onClick={() => removeQuiz(quiz._id)}
                  />
                )}
                <PublishToggle
                  published={isPublished(quiz)}
                  onToggle={isFaculty ? () => togglePublish(quiz) : undefined}
                />
                {isFaculty ? (
                  <KebabMenu
                    variant="dark"
                    items={[
                      {
                        label: "Edit",
                        onClick: () =>
                          router.push(`/Courses/${cid}/Quizzes/${quiz._id}`),
                      },
                      {
                        label: isPublished(quiz) ? "Unpublish" : "Publish",
                        onClick: () => togglePublish(quiz),
                      },
                      {
                        label: "Delete",
                        danger: true,
                        onClick: () => removeQuiz(quiz._id),
                      },
                    ]}
                  />
                ) : (
                  <BsThreeDotsVertical className="fs-4" />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
