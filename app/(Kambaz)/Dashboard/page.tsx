"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse, setCourse } from "../Courses/reducer";
import { enrollUser, unenrollUser } from "../Database/reducer";
import {
    FaBullhorn,
    FaRegEdit,
    FaRegCommentDots,
    FaRegFolder
} from "react-icons/fa";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { courses, course } = useSelector((state: any) => state.coursesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

    const [showAllCourses, setShowAllCourses] = useState(false);

    const isFaculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";

    const isEnrolled = (courseId: string) =>
        !!currentUser &&
        enrollments.some((e: any) => e.user === currentUser._id && e.course === courseId);

    const displayedCourses =
        showAllCourses || isFaculty ? courses : courses.filter((c: any) => isEnrolled(c._id));

    // course CRUD
    const handleAddCourse = () => dispatch(addCourse());
    const handleDeleteCourse = (courseId: string) => dispatch(deleteCourse(courseId));
    const handleUpdateCourse = () => dispatch(updateCourse());
    const handleSetCourse = (c: any) => dispatch(setCourse(c));

    // enrollment
    const handleEnroll = (courseId: string) => {
        if (!currentUser) return;
        dispatch(enrollUser({ userId: currentUser._id, courseId }));
    };
    const handleUnenroll = (courseId: string) => {
        if (!currentUser) return;
        dispatch(unenrollUser({ userId: currentUser._id, courseId }));
    };

    // helper to render image path safely
    const resolveImg = (img?: string) =>
        !img ? "/images/course1.jpg" : img.startsWith("/") ? img : `/images/${img}`;

    return (
        <div id="wd-dashboard" className="container-fluid">
            <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
            <hr />

            {/* FACULTY: inline editor form */}
            {isFaculty && (
                <>
                    <h5 className="mb-3">
                        Edit / New Course
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

                    <div className="row g-2 mb-2">
                        <div className="col-lg-6">
                            <Form.Label className="small">Course Name</Form.Label>
                            <Form.Control
                                value={course.name || ""}
                                onChange={(e) => handleSetCourse({ ...course, name: e.target.value })}
                            />
                        </div>
                        <div className="col-lg-3">
                            <Form.Label className="small">Number</Form.Label>
                            <Form.Control
                                value={course.number || ""}
                                onChange={(e) => handleSetCourse({ ...course, number: e.target.value })}
                            />
                        </div>
                        <div className="col-lg-3">
                            <Form.Label className="small">Image (filename or /images/...)</Form.Label>
                            <Form.Control
                                value={course.image || ""}
                                onChange={(e) => handleSetCourse({ ...course, image: e.target.value })}
                                placeholder="course1.jpg"
                            />
                        </div>
                    </div>

                    <div className="row g-2 mb-2">
                        <div className="col-lg-3">
                            <Form.Label className="small">Semester</Form.Label>
                            <Form.Control
                                value={course.semester || ""}
                                onChange={(e) => handleSetCourse({ ...course, semester: e.target.value })}
                                placeholder="Spring 2025"
                            />
                        </div>
                        <div className="col-lg-3">
                            <Form.Label className="small">Term</Form.Label>
                            <Form.Control
                                value={course.term || ""}
                                onChange={(e) => handleSetCourse({ ...course, term: e.target.value })}
                                placeholder="Full Term"
                            />
                        </div>
                        <div className="col-lg-3">
                            <Form.Label className="small">Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={course.startDate || ""}
                                onChange={(e) => handleSetCourse({ ...course, startDate: e.target.value })}
                            />
                        </div>
                        <div className="col-lg-3">
                            <Form.Label className="small">End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={course.endDate || ""}
                                onChange={(e) => handleSetCourse({ ...course, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <Form.Label className="small">Description</Form.Label>
                    <Form.Control
                        value={course.description || ""}
                        as="textarea"
                        rows={3}
                        onChange={(e) => handleSetCourse({ ...course, description: e.target.value })}
                    />
                    <hr />
                </>
            )}

            {/* header + toggle */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 id="wd-dashboard-published" className="text-muted mb-0">
                    Published Courses ({displayedCourses.length})
                </h2>
                {!isFaculty && (
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

            {/* Course cards grid */}
            <div id="wd-dashboard-courses" className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {displayedCourses.map((c: any) => {
                    const enrolled = isEnrolled(c._id);
                    return (
                        <div className="col wd-dashboard-course" key={c._id} style={{ maxWidth: "300px" }}>
                            <div className="card h-100 shadow-sm border-0 hover-lift d-flex flex-column">
                                <div className="ratio ratio-16x9">
                                    <Image
                                        src={resolveImg(c.image)}
                                        alt={c.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                <div className="card-body flex-grow-1 d-flex flex-column position-relative pb-5">
                                    <h5 className="wd-dashboard-course-title course-title mt-2 mb-1">{c.name}</h5>
                                    <div className="text-muted small">{c.number}</div>
                                    <div className="text-muted small">{c.term || "Full Term"} · {c.semester || ""}</div>

                                    {/* Button bar for faculty/students */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "10px",
                                            left: "20px",
                                            right: "20px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }}
                                    >
                                        {/* Faculty controls */}
                                        {isFaculty && (
                                            <>
                                                <div>
                                                    <Button
                                                        id="wd-edit-course-click"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleSetCourse(c);
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                        }}
                                                        className="btn btn-warning btn-sm me-1"
                                                        style={{ position: "relative", zIndex: 2 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteCourse(c._id);
                                                        }}
                                                        className="btn btn-danger btn-sm"
                                                        id="wd-delete-course-click"
                                                        style={{ position: "relative", zIndex: 2 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                                <Link
                                                    href={`/Courses/${c._id}/Home`}
                                                    className="btn btn-primary btn-sm"
                                                    style={{ position: "relative", zIndex: 2 }}
                                                >
                                                    Go
                                                </Link>
                                            </>
                                        )}

                                        {/* Student controls */}
                                        {!isFaculty && (
                                            <>
                                                <div>
                                                    {enrolled && showAllCourses ? (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleUnenroll(c._id);
                                                            }}
                                                            style={{ position: "relative", zIndex: 2 }}
                                                        >
                                                            Unenroll
                                                        </Button>
                                                    ) : !enrolled ? (
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleEnroll(c._id);
                                                            }}
                                                            style={{ position: "relative", zIndex: 2 }}
                                                        >
                                                            Enroll
                                                        </Button>
                                                    ) : (
                                                        <div style={{ width: "60px" }} />
                                                    )}
                                                </div>

                                                <div>
                                                    {enrolled ? (
                                                        <Link
                                                            href={`/Courses/${c._id}/Home`}
                                                            className="btn btn-primary btn-sm"
                                                            style={{ position: "relative", zIndex: 2 }}
                                                        >
                                                            Go
                                                        </Link>
                                                    ) : (
                                                        <div style={{ width: "40px" }} />
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {(enrolled || isFaculty) && (
                                        <Link
                                            href={`/Courses/${c._id}/Home`}
                                            className="stretched-link"
                                            aria-label={`Open ${c.name}`}
                                            style={{ zIndex: 1 }}
                                        />
                                    )}
                                </div>

                                {/* Icon buttons at bottom */}
                                <div className="d-flex justify-content-around align-items-center py-2 px-3 border-top mt-auto">
                                    <Link
                                        href={`/Courses/${c._id}/Announcements`}
                                        className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                    >
                                        <FaBullhorn size={18} />
                                    </Link>
                                    <Link
                                        href={`/Courses/${c._id}/Quizzes`}
                                        className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                    >
                                        <FaRegEdit size={18} />
                                    </Link>
                                    <Link
                                        href={`/Courses/${c._id}/Zoom`}
                                        className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                    >
                                        <FaRegCommentDots size={18} />
                                    </Link>
                                    <Link
                                        href={`/Courses/${c._id}/Assignments`}
                                        className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                    >
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