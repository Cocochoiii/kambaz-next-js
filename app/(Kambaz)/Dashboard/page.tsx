"use client";

// The Dashboard screen.
// 4.9 Faculty can add, edit, update and delete courses with the form
// at the top. 4.13 A student sees the Enrollments button instead, and
// an Enroll or Unenroll button on every card.
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaBullhorn, FaRegEdit, FaRegCommentDots, FaRegFolder } from "react-icons/fa";
import { addCourse, deleteCourse, updateCourse, setCourse } from "../Courses/reducer";
import { enrollUser, unenrollUser } from "../Enrollments/reducer";

export default function Dashboard() {
  const { courses, course } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const dispatch = useDispatch();

  // A student presses Enrollments to see all the courses.
  const [showAllCourses, setShowAllCourses] = useState(false);

  const isFaculty = currentUser?.role === "FACULTY";

  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser?._id && enrollment.course === courseId
    );

  // Faculty sees every course. A student sees only the enrolled ones.
  const shownCourses = isFaculty || showAllCourses
    ? courses
    : courses.filter((c: any) => isEnrolled(c._id));

  // The image can be a file name or a full path.
  const imagePath = (image?: string) =>
    !image ? "/images/reactjs.jpg" : image.startsWith("/") ? image : `/images/${image}`;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />

      {/* 4.9 The course form. Faculty only. */}
      {isFaculty && (
        <div id="wd-dashboard-course-editor">
          <h5>
            New Course
            <Button
              id="wd-add-new-course-click"
              className="btn btn-primary float-end"
              onClick={() => dispatch(addCourse())}
            >
              Add
            </Button>
            <Button
              id="wd-update-course-click"
              className="btn btn-warning float-end me-2"
              onClick={() => dispatch(updateCourse())}
            >
              Update
            </Button>
          </h5>
          <br />
          <Form.Control
            id="wd-dashboard-course-name"
            className="mb-2"
            value={course.name}
            onChange={(e) => dispatch(setCourse({ ...course, name: e.target.value }))}
          />
          <Form.Control
            id="wd-dashboard-course-number"
            className="mb-2"
            value={course.number}
            onChange={(e) => dispatch(setCourse({ ...course, number: e.target.value }))}
          />
          <Form.Control
            id="wd-dashboard-course-description"
            as="textarea"
            rows={3}
            value={course.description}
            onChange={(e) => dispatch(setCourse({ ...course, description: e.target.value }))}
          />
          <hr />
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between">
        <h2 id="wd-dashboard-published">Published Courses ({shownCourses.length})</h2>
        {/* 4.13 The Enrollments button. Students only. */}
        {!isFaculty && (
          <Button
            id="wd-enrollments-btn"
            variant="primary"
            onClick={() => setShowAllCourses(!showAllCourses)}
          >
            Enrollments
          </Button>
        )}
      </div>
      <hr />

      <div id="wd-dashboard-courses" className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {shownCourses.map((c: any) => (
          <div className="col wd-dashboard-course" key={c._id} style={{ maxWidth: "300px" }}>
            <div className="card h-100 shadow-sm border-0 hover-lift d-flex flex-column">
              {/* The ratio box keeps every image the same shape. */}
              <div className="ratio ratio-16x9">
                <Image
                  src={imagePath(c.image)}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="card-body flex-grow-1 d-flex flex-column position-relative pb-5">
                <h5 className="wd-dashboard-course-title course-title mt-2 mb-1">
                  <Link
                    href={`/Courses/${c._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                  >
                    {c.name}
                  </Link>
                </h5>
                <div className="text-muted small">{c.number}</div>
                <div className="text-muted small">
                  {c.term} · {c.semester}
                </div>

                <div
                  className="position-absolute d-flex align-items-center"
                  style={{ bottom: "10px", left: "15px", right: "15px" }}
                >
                  {/* 4.9 Faculty buttons */}
                  {isFaculty && (
                    <>
                      <Button
                        id="wd-edit-course-click"
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={(event) => {
                          event.preventDefault();
                          dispatch(setCourse(c));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        id="wd-delete-course-click"
                        variant="danger"
                        size="sm"
                        onClick={(event) => {
                          event.preventDefault();
                          dispatch(deleteCourse(c._id));
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}

                  {/* 4.13 Student buttons */}
                  {!isFaculty && isEnrolled(c._id) && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="wd-unenroll-click"
                      onClick={(event) => {
                        event.preventDefault();
                        dispatch(unenrollUser({ userId: currentUser._id, courseId: c._id }));
                      }}
                    >
                      Unenroll
                    </Button>
                  )}
                  {!isFaculty && !isEnrolled(c._id) && (
                    <Button
                      variant="success"
                      size="sm"
                      className="wd-enroll-click"
                      onClick={(event) => {
                        event.preventDefault();
                        dispatch(enrollUser({ userId: currentUser._id, courseId: c._id }));
                      }}
                    >
                      Enroll
                    </Button>
                  )}

                  {/* Go only shows when I can open the course. */}
                  {(isFaculty || isEnrolled(c._id)) && (
                    <Link
                      href={`/Courses/${c._id}/Home`}
                      className="btn btn-primary btn-sm ms-auto"
                    >
                      Go
                    </Link>
                  )}
                </div>
              </div>

              {/* The four shortcuts stay at the bottom of the card. */}
              <div className="d-flex justify-content-around align-items-center py-2 px-3 border-top mt-auto">
                <Link href={`/Courses/${c._id}/Announcements`}
                      className="dashboard-icon-btn" aria-label="Announcements">
                  <FaBullhorn size={18} />
                </Link>
                <Link href={`/Courses/${c._id}/Quizzes`}
                      className="dashboard-icon-btn" aria-label="Quizzes">
                  <FaRegEdit size={18} />
                </Link>
                <Link href={`/Courses/${c._id}/Zoom`}
                      className="dashboard-icon-btn" aria-label="Zoom">
                  <FaRegCommentDots size={18} />
                </Link>
                <Link href={`/Courses/${c._id}/Assignments`}
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
