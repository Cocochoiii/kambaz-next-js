// The Assignments screen. It has four groups:
// ASSIGNMENTS, QUIZZES, EXAMS, and PROJECT.
// Clicking a title opens the Assignment Editor.
import Link from "next/link";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments" id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>

      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>
      </h3>
      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/101`} className="wd-assignment-link">
            A1 - ENV + HTML
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/102`} className="wd-assignment-link">
            A2 - CSS + BOOTSTRAP
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/103`} className="wd-assignment-link">
            A3 - JAVASCRIPT + REACT
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/104`} className="wd-assignment-link">
            A4 - STATE + REDUX
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/105`} className="wd-assignment-link">
            A5 - NODE + EXPRESS
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/106`} className="wd-assignment-link">
            A6 - MONGO + DEPLOY
          </Link>
        </li>
      </ul>

      <h3 id="wd-quizzes-title">
        QUIZZES 10% of Total <button>+</button>
      </h3>
      <ul className="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/201`} className="wd-assignment-link">
            Q1 - HTML
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/202`} className="wd-assignment-link">
            Q2 - CSS
          </Link>
        </li>
      </ul>

      <h3 id="wd-exams-title">
        EXAMS 20% of Total <button>+</button>
      </h3>
      <ul className="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/301`} className="wd-assignment-link">
            Midterm Exam
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/302`} className="wd-assignment-link">
            Final Exam
          </Link>
        </li>
      </ul>

      <h3 id="wd-project-title">
        PROJECT 30% of Total <button>+</button>
      </h3>
      <ul className="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/401`} className="wd-assignment-link">
            Final Project - Part 1
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link href={`/Courses/${cid}/Assignments/402`} className="wd-assignment-link">
            Final Project - Part 2
          </Link>
        </li>
      </ul>
    </div>
  );
}
