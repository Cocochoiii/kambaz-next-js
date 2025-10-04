"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { addCourse, deleteCourse, updateCourse, setCourse } from "../Courses/reducer";
import { enrollUser, unenrollUser } from "../Database/reducer";
import {
    FaBullhorn,
    FaRegEdit,
    FaRegCommentDots,
    FaRegFolder,
    FaPlus,
    FaCheck,
    FaTimes
} from "react-icons/fa";

import "./dashboard-styles.css";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { courses, course } = useSelector((state: any) => state.coursesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

    const [showAllCourses, setShowAllCourses] = useState(false);
    const [showEditor, setShowEditor] = useState(false);

    const isFaculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";

    const isEnrolled = (courseId: string) =>
        !!currentUser &&
        enrollments.some((e: any) => e.user === currentUser._id && e.course === courseId);

    const displayedCourses =
        showAllCourses || isFaculty ? courses : courses.filter((c: any) => isEnrolled(c._id));

    // course CRUD
    const handleAddCourse = () => {
        dispatch(addCourse());
        setShowEditor(false);
    };

    const handleDeleteCourse = (courseId: string) => {
        if (confirm("Are you sure you want to delete this course?")) {
            dispatch(deleteCourse(courseId));
        }
    };

    const handleUpdateCourse = () => {
        dispatch(updateCourse());
        setShowEditor(false);
    };

    const handleSetCourse = (c: any) => dispatch(setCourse(c));

    // enrollment
    const handleEnroll = (courseId: string) => {
        if (!currentUser) return;
        dispatch(enrollUser({ userId: currentUser._id, courseId }));
    };

    const handleUnenroll = (courseId: string) => {
        if (!currentUser) return;
        if (confirm("Are you sure you want to unenroll from this course?")) {
            dispatch(unenrollUser({ userId: currentUser._id, courseId }));
        }
    };

    // helper to resolve image path safely
    const resolveImg = (img?: string) =>
        !img ? "/images/course1.jpg" : img.startsWith("/") ? img : `/images/${img}`;

    return (
        <div id="wd-dashboard" className="dashboard-container">
            <div className="dashboard-header">
                <h1 id="wd-dashboard-title">Dashboard</h1>
                {isFaculty && (
                    <button
                        className="btn-add-course"
                        onClick={() => setShowEditor(!showEditor)}
                        id="wd-toggle-editor"
                    >
                        <FaPlus className="me-2" />
                        New Course
                    </button>
                )}
            </div>

            {/* FACULTY: Course Editor Panel */}
            {isFaculty && showEditor && (
                <div className="course-editor-panel">
                    <div className="editor-header">
                        <h5 className="editor-title">
                            {course._id ? "Edit Course" : "Create New Course"}
                        </h5>
                        <button
                            className="btn-close-editor"
                            onClick={() => setShowEditor(false)}
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="editor-body">
                        <div className="row g-3">
                            <div className="col-lg-6">
                                <div className="form-group-custom">
                                    <label>Course Name</label>
                                    <input
                                        type="text"
                                        className="form-control-custom"
                                        value={course.name || ""}
                                        onChange={(e) => handleSetCourse({ ...course, name: e.target.value })}
                                        placeholder="e.g., Web Development"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="form-group-custom">
                                    <label>Course Number</label>
                                    <input
                                        type="text"
                                        className="form-control-custom"
                                        value={course.number || ""}
                                        onChange={(e) => handleSetCourse({ ...course, number: e.target.value })}
                                        placeholder="e.g., CS5610"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="form-group-custom">
                                    <label>Image</label>
                                    <input
                                        type="text"
                                        className="form-control-custom"
                                        value={course.image || ""}
                                        onChange={(e) => handleSetCourse({ ...course, image: e.target.value })}
                                        placeholder="course1.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-lg-3">
                                <div className="form-group-custom">
                                    <label>Semester</label>
                                    <input
                                        type="text"
                                        className="form-control-custom"
                                        value={course.semester || ""}
                                        onChange={(e) => handleSetCourse({ ...course, semester: e.target.value })}
                                        placeholder="Spring 2025"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="form-group-custom">
                                    <label>Term</label>
                                    <input
                                        type="text"
                                        className="form-control-custom"
                                        value={course.term || ""}
                                        onChange={(e) => handleSetCourse({ ...course, term: e.target.value })}
                                        placeholder="Full Term"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="form-group-custom">
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control-custom"
                                        value={course.startDate || ""}
                                        onChange={(e) => handleSetCourse({ ...course, startDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="form-group-custom">
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        className="form-control-custom"
                                        value={course.endDate || ""}
                                        onChange={(e) => handleSetCourse({ ...course, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label>Description</label>
                            <textarea
                                className="form-control-custom"
                                rows={3}
                                value={course.description || ""}
                                onChange={(e) => handleSetCourse({ ...course, description: e.target.value })}
                                placeholder="Enter course description..."
                            />
                        </div>

                        <div className="editor-actions">
                            <button
                                className="btn-editor-cancel"
                                onClick={() => setShowEditor(false)}
                            >
                                Cancel
                            </button>
                            {course._id ? (
                                <button
                                    className="btn-editor-update"
                                    onClick={handleUpdateCourse}
                                    id="wd-update-course-click"
                                >
                                    Update Course
                                </button>
                            ) : (
                                <button
                                    className="btn-editor-add"
                                    onClick={handleAddCourse}
                                    id="wd-add-new-course-click"
                                >
                                    Create Course
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Courses Section Header */}
            <div className="courses-header">
                <div>
                    <h2 id="wd-dashboard-published" className="courses-title">
                        Published Courses
                    </h2>
                    <p className="courses-subtitle">
                        {displayedCourses.length} {displayedCourses.length === 1 ? "course" : "courses"}
                    </p>
                </div>
                {!isFaculty && (
                    <button
                        className="btn-toggle-courses"
                        onClick={() => setShowAllCourses(!showAllCourses)}
                        id="wd-enrollments-btn"
                    >
                        {showAllCourses ? "Show Enrolled Only" : "Browse All Courses"}
                    </button>
                )}
            </div>

            {/* Course Cards Grid */}
            <div id="wd-dashboard-courses" className="courses-grid">
                {displayedCourses.map((c: any) => {
                    const enrolled = isEnrolled(c._id);
                    return (
                        <div className="course-card-wrapper" key={c._id}>
                            <div className="course-card">
                                {/* Course Image */}
                                <div className="course-card-image">
                                    <Image
                                        src={resolveImg(c.image)}
                                        alt={c.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                        style={{ objectFit: "cover" }}
                                    />
                                    {enrolled && !isFaculty && (
                                        <div className="enrolled-badge">
                                            <FaCheck /> Enrolled
                                        </div>
                                    )}
                                </div>

                                {/* Course Info */}
                                <div className="course-card-body">
                                    <h5 className="course-card-title">{c.name}</h5>
                                    <div className="course-card-number">{c.number}</div>
                                    <div className="course-card-term">
                                        {c.term || "Full Term"} · {c.semester || "2025"}
                                    </div>


                                    {/* Action Buttons */}
                                    <div className="course-card-actions">
                                        {/* Faculty Actions */}
                                        {isFaculty ? (
                                            <>
                                                <div className="action-buttons-left">
                                                    <button
                                                        className="btn-card-edit"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleSetCourse(c);
                                                            setShowEditor(true);
                                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                                        }}
                                                        id="wd-edit-course-click"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn-card-delete"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleDeleteCourse(c._id);
                                                        }}
                                                        id="wd-delete-course-click"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                <Link
                                                    href={`/Courses/${c._id}/Home`}
                                                    className="btn-card-go"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Open Course
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                {/* Student Actions */}
                                                {enrolled ? (
                                                    <>
                                                        {showAllCourses && (
                                                            <button
                                                                className="btn-card-unenroll"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleUnenroll(c._id);
                                                                }}
                                                            >
                                                                Unenroll
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={`/Courses/${c._id}/Home`}
                                                            className="btn-card-go"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Open Course
                                                        </Link>
                                                    </>
                                                ) : (
                                                    <button
                                                        className="btn-card-enroll"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleEnroll(c._id);
                                                        }}
                                                    >
                                                        Enroll
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Links Bar */}
                                {(enrolled || isFaculty) && (
                                    <div className="course-card-links">
                                        <Link
                                            href={`/Courses/${c._id}/Announcements`}
                                            className="card-link-icon"
                                            title="Announcements"
                                        >
                                            <FaBullhorn />
                                        </Link>
                                        <Link
                                            href={`/Courses/${c._id}/Quizzes`}
                                            className="card-link-icon"
                                            title="Quizzes"
                                        >
                                            <FaRegEdit />
                                        </Link>
                                        <Link
                                            href={`/Courses/${c._id}/Zoom`}
                                            className="card-link-icon"
                                            title="Zoom"
                                        >
                                            <FaRegCommentDots />
                                        </Link>
                                        <Link
                                            href={`/Courses/${c._id}/Assignments`}
                                            className="card-link-icon"
                                            title="Assignments"
                                        >
                                            <FaRegFolder />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {displayedCourses.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">📚</div>
                    <h3>No courses available</h3>
                    <p>
                        {isFaculty
                            ? "Click 'New Course' to create your first course."
                            : showAllCourses
                                ? "No courses are currently available."
                                : "You haven't enrolled in any courses yet. Click 'Browse All Courses' to see available courses."}
                    </p>
                </div>
            )}
        </div>
    );
}