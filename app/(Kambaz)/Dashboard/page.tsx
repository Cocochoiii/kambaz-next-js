"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PiNotePencilLight } from "react-icons/pi";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse, setCourse } from "../Courses/reducer";
import { enrollUser, unenrollUser } from "../Database/reducer";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { courses, course } = useSelector((state: any) => state.coursesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

    // State for enrollment view toggle
    const [showAllCourses, setShowAllCourses] = useState(false);

    // Check if user is enrolled in a course
    const isEnrolled = (courseId: string) => {
        if (!currentUser) return false;
        return enrollments.some(
            (e: any) => e.user === currentUser._id && e.course === courseId
        );
    };

    // Filter courses based on enrollment and view mode
    const displayedCourses = showAllCourses || currentUser?.role === "FACULTY"
        ? courses
        : courses.filter((c: any) => isEnrolled(c._id));

    // Course management handlers
    const handleAddCourse = () => {
        dispatch(addCourse());
    };

    const handleDeleteCourse = (courseId: string) => {
        dispatch(deleteCourse(courseId));
    };

    const handleUpdateCourse = () => {
        dispatch(updateCourse());
    };

    const handleSetCourse = (course: any) => {
        dispatch(setCourse(course));
    };

    // Enrollment handlers
    const handleEnroll = (courseId: string) => {
        if (!currentUser) return;
        dispatch(enrollUser({ userId: currentUser._id, courseId }));
    };

    const handleUnenroll = (courseId: string) => {
        if (!currentUser) return;
        dispatch(unenrollUser({ userId: currentUser._id, courseId }));
    };

    return (
        <div id="wd-dashboard" className="container-fluid">
            <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
            <hr />

            {/* Faculty Course Management Form */}
            {currentUser?.role === "FACULTY" && (
                <>
                    <h5>
                        New Course
                        <Button
                            className="btn btn-primary float-end"
                            onClick={handleAddCourse}
                            id="wd-add-new-course-click"
                        >
                            Add
                        </Button>
                        <Button
                            className="btn btn-warning float-end me-2"
                            onClick={handleUpdateCourse}
                            id="wd-update-course-click"
                        >
                            Update
                        </Button>
                    </h5>
                    <br />

                    <Form.Control
                        value={course.name}
                        className="mb-2"
                        onChange={(e) => handleSetCourse({ ...course, name: e.target.value })}
                    />
                    <Form.Control
                        value={course.description}
                        as="textarea"
                        rows={3}
                        onChange={(e) => handleSetCourse({ ...course, description: e.target.value })}
                    />
                    <hr />
                </>
            )}

            {/* Courses Header with Enrollment Toggle */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 id="wd-dashboard-published" className="text-muted mb-0">
                    Published Courses ({displayedCourses.length})
                </h2>
                {currentUser?.role !== "FACULTY" && (
                    <Button
                        variant="primary"
                        onClick={() => setShowAllCourses(!showAllCourses)}
                        id="wd-enrollments-btn"
                    >
                        {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
                    </Button>
                )}
            </div>
            <hr />

            {/* Courses Grid */}
            <div id="wd-dashboard-courses" className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {displayedCourses.map((c: any) => {
                    const enrolled = isEnrolled(c._id);

                    return (
                        <div className="col wd-dashboard-course" key={c._id} style={{ maxWidth: "300px" }}>
                            <div className="card h-100 shadow-sm border-0 hover-lift position-relative">
                                <div className="ratio ratio-16x9">
                                    <Image
                                        src={`/images/${c.image}`}
                                        alt={c.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                <div className="card-body position-relative" style={{ paddingBottom: "60px" }}>
                                    <span className="canvas-tile-icon text-secondary">
                                        <PiNotePencilLight />
                                    </span>

                                    <h5 className="wd-dashboard-course-title course-title mt-2 mb-1">
                                        {c.name}
                                    </h5>
                                    <div className="text-muted small">
                                        {c.number}
                                    </div>
                                    <div className="text-muted small">
                                        {c.term} · {c.semester}
                                    </div>

                                    {/* Absolutely positioned button container */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '12px',
                                        left: '20px',
                                        right: '20px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        {/* Faculty View */}
                                        {currentUser?.role === "FACULTY" && (
                                            <>
                                                <div>
                                                    <Button
                                                        id="wd-edit-course-click"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            handleSetCourse(c);
                                                        }}
                                                        className="btn btn-warning btn-sm me-1"
                                                        style={{ position: 'relative', zIndex: 2 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                            handleDeleteCourse(c._id);
                                                        }}
                                                        className="btn btn-danger btn-sm"
                                                        id="wd-delete-course-click"
                                                        style={{ position: 'relative', zIndex: 2 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                                <Link
                                                    href={`/Courses/${c._id}/Home`}
                                                    className="btn btn-primary btn-sm"
                                                    style={{ position: 'relative', zIndex: 2 }}
                                                >
                                                    Go
                                                </Link>
                                            </>
                                        )}

                                        {/* Non-Faculty View */}
                                        {currentUser?.role !== "FACULTY" && (
                                            <>
                                                {/* Left side - Unenroll button or Enroll button */}
                                                <div>
                                                    {enrolled && showAllCourses ? (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                handleUnenroll(c._id);
                                                            }}
                                                            style={{ position: 'relative', zIndex: 2 }}
                                                        >
                                                            Unenroll
                                                        </Button>
                                                    ) : !enrolled ? (
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                event.stopPropagation();
                                                                handleEnroll(c._id);
                                                            }}
                                                            style={{ position: 'relative', zIndex: 2 }}
                                                        >
                                                            Enroll
                                                        </Button>
                                                    ) : (
                                                        <div style={{ width: '60px' }}></div>
                                                    )}
                                                </div>

                                                {/* Right side - Go button for enrolled courses */}
                                                <div>
                                                    {enrolled ? (
                                                        <Link
                                                            href={`/Courses/${c._id}/Home`}
                                                            className="btn btn-primary btn-sm"
                                                            style={{ position: 'relative', zIndex: 2 }}
                                                        >
                                                            Go
                                                        </Link>
                                                    ) : (
                                                        <div style={{ width: '40px' }}></div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Stretched link only for enrolled users or faculty - lower z-index */}
                                    {(enrolled || currentUser?.role === "FACULTY") && (
                                        <Link
                                            href={`/Courses/${c._id}/Home`}
                                            className="stretched-link"
                                            aria-label={`Open ${c.name}`}
                                            style={{ zIndex: 1 }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}