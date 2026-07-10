"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCourses, addCourse, deleteCourse, updateCourse, setCourse } from "../Courses/reducer";
import * as coursesClient from "../Courses/client";
import * as accountClient from "../Account/client";
import * as enrollmentsClient from "../Enrollments/client";
import * as assignmentsClient from "../Courses/[cid]/Assignments/client";
import * as submissionsClient from "../Submissions/client";
import KebabMenu from "../KebabMenu";
import {
    FaBullhorn,
    FaRegEdit,
    FaRegCommentDots,
    FaRegFolder
} from "react-icons/fa";

// A blank course used when opening the "+ Course" form.
const BLANK_COURSE = {
    name: "", number: "", description: "",
    semester: "", term: "", startDate: "", endDate: "", image: "",
};

// Curated "Morandi" palette — 12 distinct muted tones, assigned by position so
// every card on the dashboard gets its own color (no repeats for up to 12 courses).
const CARD_COLORS = [
    "#4E6E7E", "#6B7A8F", "#6E6A86", "#8E7597",
    "#A6786D", "#B08B6E", "#8C7B6B", "#7E8B6D",
    "#567D6B", "#5E8585", "#9A8478", "#8B9467",
];
const colorFor = (i: number) => CARD_COLORS[i % CARD_COLORS.length];

export default function Dashboard() {
    const dispatch = useDispatch();
    const { courses, course } = useSelector((state: any) => state.coursesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const [showAllCourses, setShowAllCourses] = useState(false);
    const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [comingUp, setComingUp] = useState<any[]>([]);
    const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
    const [toGrade, setToGrade] = useState<any[]>([]);

    const isFaculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";
    const isEnrolled = (courseId: string) => enrolledIds.includes(courseId);
    const isPublished = (c: any) => c.published !== false;

    const loadAllCourses = async () => {
        const all = await coursesClient.fetchAllCourses();
        dispatch(setCourses(all));
    };
    // The current user's enrolled course ids (drives the student course list).
    const loadEnrolled = async () => {
        if (!currentUser) {
            setEnrolledIds([]);
            return;
        }
        try {
            const mine = await enrollmentsClient.findCoursesForUser(currentUser._id);
            setEnrolledIds(mine.map((c: any) => c._id));
        } catch {
            setEnrolledIds([]);
        }
    };
    useEffect(() => {
        loadAllCourses();
    }, []);
    useEffect(() => {
        loadEnrolled();
    }, [currentUser]);

    // "Coming Up": upcoming published assignments across the user's courses
    // (all courses for faculty, enrolled ones for students), soonest first.
    useEffect(() => {
        const buildComingUp = async () => {
            const faculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";
            const mine = faculty
                ? courses
                : courses.filter((c: any) => enrolledIds.includes(c._id) && c.published !== false);
            if (mine.length === 0) {
                setComingUp([]);
                return;
            }
            const lists = await Promise.all(
                mine.map((c: any) => assignmentsClient.findAssignmentsForCourse(c._id).catch(() => []))
            );
            const now = Date.now();
            const upcoming = lists
                .flat()
                .filter((a: any) => a.published !== false && a.dueDate && new Date(a.dueDate).getTime() >= now)
                .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 5);
            setComingUp(upcoming);
        };
        buildComingUp();
    }, [courses, enrolledIds, currentUser]);

    // Sidebar extras: student "Recent Feedback" (graded work) and faculty
    // "To Grade" queue (submissions still waiting for a grade).
    useEffect(() => {
        const load = async () => {
            if (!currentUser) {
                setRecentFeedback([]);
                setToGrade([]);
                return;
            }
            const faculty = (currentUser.role ?? "").toString().toUpperCase() === "FACULTY";
            try {
                if (faculty) {
                    const all = await submissionsClient.findAllSubmissions();
                    setToGrade(all.filter((s: any) => s.status === "submitted").slice(0, 5));
                    setRecentFeedback([]);
                } else {
                    const mine = await submissionsClient.findSubmissionsForUser(currentUser._id);
                    const graded = mine
                        .filter((s: any) => s.status === "graded")
                        .sort((a: any, b: any) => new Date(b.gradedAt || 0).getTime() - new Date(a.gradedAt || 0).getTime())
                        .slice(0, 5);
                    setRecentFeedback(graded);
                    setToGrade([]);
                }
            } catch {
                setRecentFeedback([]);
                setToGrade([]);
            }
        };
        load();
    }, [courses, currentUser]);

    // Faculty see every course; students see published courses they can reach.
    const visibleCourses = isFaculty
        ? courses
        : showAllCourses
            ? courses.filter(isPublished)
            : courses.filter((c: any) => isEnrolled(c._id) && isPublished(c));
    const publishedCourses = visibleCourses.filter(isPublished);
    const unpublishedCourses = isFaculty ? visibleCourses.filter((c: any) => !isPublished(c)) : [];

    // course CRUD (through the server)
    const handleAddCourse = async () => {
        const newCourse = await accountClient.createCourseForCurrentUser(course);
        dispatch(addCourse(newCourse));
        await loadEnrolled();
        setShowForm(false);
    };
    const handleUpdateCourse = async () => {
        await coursesClient.updateCourse(course);
        dispatch(updateCourse(course));
        setShowForm(false);
    };
    const handleDeleteCourse = async (courseId: string) => {
        await coursesClient.deleteCourse(courseId);
        dispatch(deleteCourse(courseId));
    };
    const handleSetCourse = (c: any) => dispatch(setCourse(c));
    // Course-level publish toggle (persisted on the server).
    const handleTogglePublish = async (c: any) => {
        const updated = { ...c, published: !isPublished(c) };
        await coursesClient.updateCourse(updated);
        dispatch(updateCourse(updated));
    };

    // enrollment (through the server)
    const handleEnroll = async (courseId: string) => {
        if (!currentUser) return;
        await enrollmentsClient.enrollIntoCourse(currentUser._id, courseId);
        await loadEnrolled();
    };
    const handleUnenroll = async (courseId: string) => {
        if (!currentUser) return;
        await enrollmentsClient.unenrollFromCourse(currentUser._id, courseId);
        await loadEnrolled();
    };

    const openNewCourseForm = () => {
        handleSetCourse(BLANK_COURSE);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const openEditCourseForm = (c: any) => {
        handleSetCourse(c);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Course name shown next to sidebar items.
    const courseName = (courseId: string) => courses.find((c: any) => c._id === courseId)?.name || courseId;
    // First course a student is enrolled in, used by the "View Grades" shortcut.
    const firstGradesCourse = courses.find((c: any) => isEnrolled(c._id) && isPublished(c))?._id;

    // One card. Faculty get a "⋮" menu (publish/edit/delete); students get enroll/unenroll.
    const renderCard = (c: any, i: number) => {
        const enrolled = isEnrolled(c._id);
        const published = isPublished(c);
        const canOpen = isFaculty || (enrolled && published);
        return (
            <div className="wd-dashboard-course" key={c._id} style={{ width: 300, maxWidth: "100%" }}>
                <div className={`card h-100 shadow-sm border-0 hover-lift position-relative ${isFaculty && !published ? "opacity-75" : ""}`}>
                    {canOpen && (
                        <Link href={`/Courses/${c._id}/Home`} className="stretched-link" aria-label={`Open ${c.name}`} />
                    )}

                    <div className="position-relative d-flex align-items-center justify-content-center text-center p-3"
                        style={{ height: 150, background: colorFor(i) }}>
                        <span className="text-white fw-bold" style={{ textShadow: "0 1px 3px rgba(0,0,0,.4)" }}>
                            {c.name}
                        </span>
                        {isFaculty && (
                            <span className="position-absolute top-0 end-0 p-2 text-white" style={{ zIndex: 1000 }}>
                                <KebabMenu
                                    items={[
                                        { label: published ? "Unpublish" : "Publish", onClick: () => handleTogglePublish(c) },
                                        { label: "Edit", onClick: () => openEditCourseForm(c) },
                                        { label: "Delete", danger: true, onClick: () => handleDeleteCourse(c._id) },
                                    ]}
                                />
                            </span>
                        )}
                        {isFaculty && !published && (
                            <span className="position-absolute top-0 start-0 m-2 badge bg-dark" style={{ zIndex: 2 }}>
                                Unpublished
                            </span>
                        )}
                    </div>

                    <div className="card-body">
                        <div className="text-muted small">{c.number}</div>
                        <div className="text-muted small">{[c.semester, c.term].filter(Boolean).join(" - ")}</div>

                        {!isFaculty && showAllCourses && (
                            <Button
                                size="sm"
                                variant={enrolled ? "danger" : "success"}
                                className="mt-2"
                                style={{ position: "relative", zIndex: 2 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    enrolled ? handleUnenroll(c._id) : handleEnroll(c._id);
                                }}
                            >
                                {enrolled ? "Unenroll" : "Enroll"}
                            </Button>
                        )}
                    </div>

                    <div className="d-flex justify-content-around align-items-center py-2 px-3 border-top mt-auto"
                        style={{ position: "relative", zIndex: 2 }}>
                        <Link href={`/Courses/${c._id}/Announcements`} className="dashboard-icon-btn text-secondary"><FaBullhorn size={18} /></Link>
                        <Link href={`/Courses/${c._id}/Assignments`} className="dashboard-icon-btn text-secondary"><FaRegEdit size={18} /></Link>
                        <Link href={`/Courses/${c._id}/Piazza`} className="dashboard-icon-btn text-secondary"><FaRegCommentDots size={18} /></Link>
                        <Link href={`/Courses/${c._id}/Modules`} className="dashboard-icon-btn text-secondary"><FaRegFolder size={18} /></Link>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div id="wd-dashboard" className="container-fluid">
            <div className="d-flex flex-column flex-lg-row">
                {/* Main column: title, course editor, and course cards. */}
                <div className="flex-fill" style={{ minWidth: 0 }}>
                    <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
                    <hr />

                    {isFaculty && showForm && (
                        <div className="border rounded p-3 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">{course._id ? "Edit Course" : "New Course"}</h5>
                                <div>
                                    <Button variant="light" className="me-2" onClick={() => setShowForm(false)}>Cancel</Button>
                                    {course._id ? (
                                        <Button variant="warning" onClick={handleUpdateCourse} id="wd-update-course-click">Update</Button>
                                    ) : (
                                        <Button variant="primary" onClick={handleAddCourse}>Add</Button>
                                    )}
                                </div>
                            </div>

                            <div className="row g-2 mb-2">
                                <div className="col-lg-6">
                                    <Form.Label className="small">Course Name</Form.Label>
                                    <Form.Control value={course.name || ""} onChange={(e) => handleSetCourse({ ...course, name: e.target.value })} />
                                </div>
                                <div className="col-lg-3">
                                    <Form.Label className="small">Number</Form.Label>
                                    <Form.Control value={course.number || ""} onChange={(e) => handleSetCourse({ ...course, number: e.target.value })} />
                                </div>
                                <div className="col-lg-3">
                                    <Form.Label className="small">Image (filename or /images/...)</Form.Label>
                                    <Form.Control value={course.image || ""} onChange={(e) => handleSetCourse({ ...course, image: e.target.value })} placeholder="course1.jpg" />
                                </div>
                            </div>

                            <div className="row g-2 mb-2">
                                <div className="col-lg-3">
                                    <Form.Label className="small">Semester</Form.Label>
                                    <Form.Control value={course.semester || ""} onChange={(e) => handleSetCourse({ ...course, semester: e.target.value })} placeholder="Spring 2025" />
                                </div>
                                <div className="col-lg-3">
                                    <Form.Label className="small">Term</Form.Label>
                                    <Form.Control value={course.term || ""} onChange={(e) => handleSetCourse({ ...course, term: e.target.value })} placeholder="Full Term" />
                                </div>
                                <div className="col-lg-3">
                                    <Form.Label className="small">Start Date</Form.Label>
                                    <Form.Control type="date" value={course.startDate || ""} onChange={(e) => handleSetCourse({ ...course, startDate: e.target.value })} />
                                </div>
                                <div className="col-lg-3">
                                    <Form.Label className="small">End Date</Form.Label>
                                    <Form.Control type="date" value={course.endDate || ""} onChange={(e) => handleSetCourse({ ...course, endDate: e.target.value })} />
                                </div>
                            </div>

                            <Form.Label className="small">Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={course.description || ""} onChange={(e) => handleSetCourse({ ...course, description: e.target.value })} />
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 id="wd-dashboard-published" className="text-muted mb-0">
                            Published Courses ({publishedCourses.length})
                        </h2>
                        {!isFaculty && (
                            <Button variant="primary" onClick={() => setShowAllCourses(!showAllCourses)} id="wd-enrollments-btn">
                                {showAllCourses ? "Show Enrolled Courses" : "Show All Courses"}
                            </Button>
                        )}
                    </div>
                    <hr />

                    <div id="wd-dashboard-courses" className="d-flex flex-wrap" style={{ gap: 40 }}>
                        {publishedCourses.map(renderCard)}
                    </div>

                    {isFaculty && unpublishedCourses.length > 0 && (
                        <>
                            <h2 className="text-muted mt-5 mb-3">Unpublished Courses ({unpublishedCourses.length})</h2>
                            <hr />
                            <div className="d-flex flex-wrap" style={{ gap: 40 }}>
                                {unpublishedCourses.map(renderCard)}
                            </div>
                        </>
                    )}
                </div>

                {/* Right sidebar: quick actions, To Grade / Coming Up / Recent Feedback. */}
                <div className="ms-lg-5 mt-4 mt-lg-0" style={{ width: 300, flexShrink: 0 }}>
                    {isFaculty ? (
                        <Button variant="danger" className="w-100 mb-3" onClick={openNewCourseForm} id="wd-add-new-course-click">
                            + Course
                        </Button>
                    ) : (
                        firstGradesCourse && (
                            <Link href={`/Courses/${firstGradesCourse}/Grades`} className="btn btn-outline-secondary w-100 mb-3">
                                View Grades
                            </Link>
                        )
                    )}

                    {isFaculty && unpublishedCourses.length > 0 && (
                        <p className="text-muted small mb-3">
                            {unpublishedCourses.length} unpublished course{unpublishedCourses.length > 1 ? "s" : ""}
                        </p>
                    )}

                    {isFaculty && (
                        <div className="mb-4">
                            <h5 className="text-muted">To Grade ({toGrade.length})</h5>
                            <hr className="mt-1" />
                            {toGrade.length === 0 ? (
                                <p className="text-muted small">Nothing to grade.</p>
                            ) : (
                                toGrade.map((s: any) => (
                                    <div key={s._id} className="mb-2">
                                        <Link href={`/Courses/${s.course}/Assignments/${s.assignment}`} className="text-decoration-none fw-semibold">
                                            {s.title || "Assignment"}
                                        </Link>
                                        <div className="text-muted small">{s.userName || s.user} · {courseName(s.course)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <h5 className="text-muted">Coming Up</h5>
                    <hr className="mt-1" />
                    {comingUp.length === 0 ? (
                        <p className="text-muted small">Nothing due right now.</p>
                    ) : (
                        comingUp.map((a: any) => (
                            <div key={a._id} className="mb-3">
                                <Link href={`/Courses/${a.course}/Assignments/${a._id}`} className="text-decoration-none fw-semibold">
                                    {a.title}
                                </Link>
                                <div className="text-muted small">{courseName(a.course)}</div>
                                <div className="text-muted small">
                                    Due {new Date(a.dueDate).toLocaleDateString()} · {a.points} pts
                                </div>
                            </div>
                        ))
                    )}

                    {!isFaculty && (
                        <div className="mt-4">
                            <h5 className="text-muted">Recent Feedback</h5>
                            <hr className="mt-1" />
                            {recentFeedback.length === 0 ? (
                                <p className="text-muted small">No feedback yet.</p>
                            ) : (
                                recentFeedback.map((s: any) => (
                                    <div key={s._id} className="mb-2">
                                        <Link href={`/Courses/${s.course}/Assignments/${s.assignment}`} className="text-decoration-none fw-semibold">
                                            {s.title || "Assignment"}
                                        </Link>
                                        <div className="text-muted small">
                                            {s.grade}{s.points ? ` / ${s.points}` : ""} · {courseName(s.course)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
