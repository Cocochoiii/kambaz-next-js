"use client";

// The Dashboard screen.
// Every button talks to the server first, then updates the store.
// Faculty edits a course from the three dots menu on the card.
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FaBullhorn, FaRegEdit, FaRegCommentDots, FaRegFolder } from "react-icons/fa";
import {
  setCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  setCourse,
} from "../Courses/reducer";
import { setEnrollments, enrollUser, unenrollUser } from "../Enrollments/reducer";
import { setCurrentUser } from "../Account/reducer";
import { useIsFaculty } from "../Account/roles";
import KebabMenu from "../KebabMenu";
import * as accountClient from "../Account/client";
import * as coursesClient from "../Courses/client";
import * as enrollmentsClient from "../Enrollments/client";

export default function Dashboard() {
  const { courses, course } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();

  // enrolling false means "my courses". True means "all courses".
  const [enrolling, setEnrolling] = useState(false);
  const isFaculty = useIsFaculty();

  // A course with no published field is published.
  const isPublished = (c: any) => c.published !== false;

  // A 401 means the session on the server is gone. That happens when the
  // server restarts, because the sessions live in its memory. I sign the
  // user out here, so ProtectedRoute sends them back to Sign in.
  const handleError = (error: any) => {
    if (error && error.response && error.response.status === 401) {
      dispatch(setCurrentUser(null));
      return;
    }
    console.error(error);
  };

  // The menu and the course screens read enrollments from the store.
  // So I build that list again every time the server answers.
  const rememberEnrollments = (myCourses: any[]) => {
    if (!currentUser) {
      return;
    }
    dispatch(
      setEnrollments(
        myCourses.map((c: any) => ({
          _id: `${currentUser._id}-${c._id}`,
          user: currentUser._id,
          course: c._id,
        }))
      )
    );
  };

  // Only the courses I am enrolled in.
  const findCoursesForUser = async () => {
    if (!currentUser) {
      return;
    }
    try {
      const myCourses = await accountClient.findMyCourses();
      dispatch(setCourses(myCourses));
      rememberEnrollments(myCourses);
    } catch (error) {
      handleError(error);
    }
  };

  // Every course. The ones I joined get enrolled set to true.
  const fetchCourses = async () => {
    if (!currentUser) {
      return;
    }
    try {
      const allCourses = await coursesClient.fetchAllCourses();
      const myCourses = await accountClient.findMyCourses();
      const merged = allCourses.map((c: any) => {
        if (myCourses.find((mine: any) => mine._id === c._id)) {
          return { ...c, enrolled: true };
        } else {
          return c;
        }
      });
      dispatch(setCourses(merged));
      rememberEnrollments(myCourses);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (enrolling) {
      fetchCourses();
    } else {
      findCoursesForUser();
    }
  }, [currentUser, enrolling]);

  // Add. The server makes the id and enrolls me.
  const onAddCourse = async () => {
    const created = await accountClient.createCourse(course);
    dispatch(addCourse(enrolling ? { ...created, enrolled: true } : created));
    if (currentUser) {
      dispatch(enrollUser({ userId: currentUser._id, courseId: created._id }));
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    await coursesClient.deleteCourse(courseId);
    dispatch(deleteCourse(courseId));
  };

  const onUpdateCourse = async () => {
    // The empty draft has no real id yet. There is nothing to update.
    if (!course._id || course._id === "0") {
      return;
    }
    const updated = await coursesClient.updateCourse(course);
    dispatch(updateCourse(updated ? updated : course));
  };

  // Publish only changes one field. So I reuse the update route.
  const onTogglePublish = async (c: any) => {
    const updated = { ...c, published: !isPublished(c) };
    await coursesClient.updateCourse(updated);
    dispatch(updateCourse(updated));
  };

  // Edit copies the course into the form at the top of the screen.
  const onEditCourse = (c: any) => {
    dispatch(setCourse(c));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // One function for both buttons, the way the book writes it.
  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (enrolled) {
      await enrollmentsClient.enrollIntoCourse(currentUser._id, courseId);
      dispatch(enrollUser({ userId: currentUser._id, courseId }));
    } else {
      await enrollmentsClient.unenrollFromCourse(currentUser._id, courseId);
      dispatch(unenrollUser({ userId: currentUser._id, courseId }));
    }
    dispatch(
      setCourses(
        courses.map((c: any) =>
          c._id === courseId ? { ...c, enrolled: enrolled } : c
        )
      )
    );
  };

  // The image can be a file name or a full path.
  const imagePath = (image?: string) =>
    !image ? "/images/reactjs.jpg" : image.startsWith("/") ? image : `/images/${image}`;

  // A student never sees a course that is not published.
  const shownCourses = isFaculty ? courses : courses.filter(isPublished);

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        {/* The button changes between my courses and every course. */}
        <Button
          id="wd-enrollments-btn"
          variant="primary"
          className="float-end"
          onClick={() => setEnrolling(!enrolling)}
        >
          {enrolling ? "My Courses" : "All Courses"}
        </Button>
      </h1>
      <hr />

      {/* The course form. Faculty only. */}
      {isFaculty && (
        <div id="wd-dashboard-course-editor" className="border rounded p-3 mb-4 bg-light">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0">{course._id && course._id !== "0" ? "Edit Course" : "New Course"}</h5>
            <div>
              <Button
                id="wd-update-course-click"
                variant="warning"
                className="me-2"
                onClick={onUpdateCourse}
              >
                Update
              </Button>
              <Button id="wd-add-new-course-click" variant="primary" onClick={onAddCourse}>
                Add
              </Button>
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-8">
              <Form.Label className="small mb-1">Course Name</Form.Label>
              <Form.Control
                id="wd-dashboard-course-name"
                value={course.name}
                onChange={(e) => dispatch(setCourse({ ...course, name: e.target.value }))}
              />
            </div>
            <div className="col-md-4">
              <Form.Label className="small mb-1">Number</Form.Label>
              <Form.Control
                id="wd-dashboard-course-number"
                value={course.number}
                onChange={(e) => dispatch(setCourse({ ...course, number: e.target.value }))}
              />
            </div>
          </div>

          <Form.Label className="small mb-1 mt-2">Description</Form.Label>
          <Form.Control
            id="wd-dashboard-course-description"
            as="textarea"
            rows={3}
            value={course.description}
            onChange={(e) => dispatch(setCourse({ ...course, description: e.target.value }))}
          />
        </div>
      )}

      <h2 id="wd-dashboard-published">Published Courses ({shownCourses.length})</h2>
      <hr />

      <div id="wd-dashboard-courses" className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {shownCourses.map((c: any) => {
          // In All Courses a card I did not join yet is not clickable.
          const canOpen = isFaculty || !enrolling || c.enrolled;
          return (
            <div className="col wd-dashboard-course" key={c._id} style={{ maxWidth: "300px" }}>
              <div
                className={`card h-100 shadow-sm border-0 hover-lift d-flex flex-column position-relative ${
                  isFaculty && !isPublished(c) ? "opacity-75" : ""
                }`}
              >
                {/* The whole card is the link now, so there is no Go button. */}
                {canOpen && (
                  <Link
                    href={`/Courses/${c._id}/Home`}
                    className="stretched-link wd-dashboard-course-link"
                    aria-label={`Open ${c.name}`}
                  />
                )}

                <div className="ratio ratio-16x9">
                  <Image
                    src={imagePath(c.image)}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Faculty gets the three dots menu in the corner. */}
                {isFaculty && (
                  <span
                    className="position-absolute top-0 end-0 p-2"
                    style={{ zIndex: 3 }}
                  >
                    <KebabMenu
                      items={[
                        {
                          label: isPublished(c) ? "Unpublish" : "Publish",
                          onClick: () => onTogglePublish(c),
                        },
                        { label: "Edit", onClick: () => onEditCourse(c) },
                        { label: "Delete", danger: true, onClick: () => onDeleteCourse(c._id) },
                      ]}
                    />
                  </span>
                )}
                {isFaculty && !isPublished(c) && (
                  <span
                    className="position-absolute top-0 start-0 m-2 badge bg-dark"
                    style={{ zIndex: 2 }}
                  >
                    Unpublished
                  </span>
                )}

                <div className="card-body flex-grow-1 d-flex flex-column">
                  <h5 className="wd-dashboard-course-title course-title mt-2 mb-1">{c.name}</h5>
                  <div className="text-muted small">{c.number}</div>
                  <div className="text-muted small">
                    {c.term} · {c.semester}
                  </div>

                  {/* The only button on the card, and only in All Courses. */}
                  {enrolling && (
                    <div className="mt-3" style={{ position: "relative", zIndex: 2 }}>
                      <Button
                        variant={c.enrolled ? "danger" : "success"}
                        size="sm"
                        className={c.enrolled ? "wd-unenroll-click" : "wd-enroll-click"}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          updateEnrollment(c._id, !c.enrolled);
                        }}
                      >
                        {c.enrolled ? "Unenroll" : "Enroll"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* The four shortcuts stay at the bottom of the card. */}
                <div
                  className="d-flex justify-content-around align-items-center py-2 px-3 border-top mt-auto"
                  style={{ position: "relative", zIndex: 2 }}
                >
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
          );
        })}
      </div>
    </div>
  );
}
