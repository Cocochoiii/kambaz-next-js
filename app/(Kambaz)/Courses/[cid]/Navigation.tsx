// The menu for one course. I pass the course id (cid) in, so every
// link goes to the correct course.
// The links are red. Home is the selected one, so it is black with a
// black bar on the left.
import Link from "next/link";

export default function CourseNavigation({ cid }: { cid: string }) {
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0" style={{ width: 150 }}>
      <Link href={`/Courses/${cid}/Home`} id="wd-course-home-link" className="list-group-item active border-0">
        Home
      </Link>
      <Link href={`/Courses/${cid}/Modules`} id="wd-course-modules-link" className="list-group-item text-danger border-0">
        Modules
      </Link>
      <Link href={`/Courses/${cid}/Piazza`} id="wd-course-piazza-link" className="list-group-item text-danger border-0">
        Piazza
      </Link>
      <Link href={`/Courses/${cid}/Zoom`} id="wd-course-zoom-link" className="list-group-item text-danger border-0">
        Zoom
      </Link>
      <Link href={`/Courses/${cid}/Assignments`} id="wd-course-assignments-link" className="list-group-item text-danger border-0">
        Assignments
      </Link>
      <Link href={`/Courses/${cid}/Quizzes`} id="wd-course-quizzes-link" className="list-group-item text-danger border-0">
        Quizzes
      </Link>
      <Link href={`/Courses/${cid}/Grades`} id="wd-course-grades-link" className="list-group-item text-danger border-0">
        Grades
      </Link>
      <Link href={`/Courses/${cid}/People/Table`} id="wd-course-people-link" className="list-group-item text-danger border-0">
        People
      </Link>
    </div>
  );
}
