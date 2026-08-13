// The Dashboard screen. It reads the courses from the Database and maps over
// them, so I do not write eleven cards by hand.
// Every card links to the Home screen and puts the course id in the path.
import Link from "next/link";
import Image from "next/image";
import { FaBullhorn, FaRegEdit, FaRegCommentDots, FaRegFolder } from "react-icons/fa";
import * as db from "../Database";

export default function Dashboard() {
  const courses = db.courses;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />

      <div id="wd-dashboard-courses" className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {courses.map((course) => (
          <div className="col wd-dashboard-course" key={course._id} style={{ maxWidth: "300px" }}>
            <div className="card h-100 shadow-sm border-0 hover-lift d-flex flex-column">
              {/* The ratio box keeps every image the same shape. */}
              <div className="ratio ratio-16x9">
                <Image
                  src={`/images/${course.image}`}
                  alt={course.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="card-body flex-grow-1 d-flex flex-column position-relative pb-5">
                <h5 className="wd-dashboard-course-title course-title mt-2 mb-1">
                  <Link
                    href={`/Courses/${course._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    {course.name}
                  </Link>
                </h5>
                <div className="text-muted small">{course.number}</div>
                <div className="text-muted small">
                  {course.term} · {course.semester}
                </div>

                {/* The Go button sits at the bottom right of the card. */}
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="btn btn-primary btn-sm position-absolute"
                  style={{ bottom: "10px", right: "15px" }}
                >
                  Go
                </Link>
              </div>

              {/* The four shortcuts are always at the bottom of the card. */}
              <div className="d-flex justify-content-around align-items-center py-2 px-3 border-top mt-auto">
                <Link href={`/Courses/${course._id}/Announcements`}
                      className="dashboard-icon-btn" aria-label="Announcements">
                  <FaBullhorn size={18} />
                </Link>
                <Link href={`/Courses/${course._id}/Quizzes`}
                      className="dashboard-icon-btn" aria-label="Quizzes">
                  <FaRegEdit size={18} />
                </Link>
                <Link href={`/Courses/${course._id}/Zoom`}
                      className="dashboard-icon-btn" aria-label="Zoom">
                  <FaRegCommentDots size={18} />
                </Link>
                <Link href={`/Courses/${course._id}/Assignments`}
                      className="dashboard-icon-btn" aria-label="Assignments">
                  <FaRegFolder size={18} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
