// app/(Kambaz)/Courses/[cid]/Assignments/page.tsx
import Link from "next/link";
import { assignmentCatalog } from "./catalog";

export default async function Assignments({
  params,
}: {
  params: Promise<{ cid: string }>;
}) {
  const { cid } = await params;
  const items = assignmentCatalog[cid]?.map((a) => a.title) ?? [
    "A1 – Basics",
    "A2 – Project",
  ];

  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments" id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>

      {/* Assignments group */}
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button>
      </h3>
      <ul id="wd-assignment-list">
        {items.map((title, idx) => (
          <li className="wd-assignment-list-item" key={idx}>
            <Link
              className="wd-assignment-link"
              href={`/Courses/${cid}/Assignments/${100 + idx}`}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>

      {/* Quizzes group */}
      <h3 id="wd-quizzes-title">
        QUIZZES 10% of Total <button>+</button>
      </h3>
      <ul className="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/201`}>
            Q1 - HTML
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/202`}>
            Q2 - CSS
          </Link>
        </li>
      </ul>

      {/* Exams group */}
      <h3 id="wd-exams-title">
        EXAMS 20% of Total <button>+</button>
      </h3>
      <ul className="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/301`}>
            Midterm Exam
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/302`}>
            Final Exam
          </Link>
        </li>
      </ul>

      {/* Project group */}
      <h3 id="wd-project-title">
        PROJECT 30% of Total <button>+</button>
      </h3>
      <ul className="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/401`}>
            Final Project - Part 1
          </Link>
        </li>
        <li className="wd-assignment-list-item">
          <Link className="wd-assignment-link" href={`/Courses/${cid}/Assignments/402`}>
            Final Project - Part 2
          </Link>
        </li>
      </ul>
    </div>
  );
}
