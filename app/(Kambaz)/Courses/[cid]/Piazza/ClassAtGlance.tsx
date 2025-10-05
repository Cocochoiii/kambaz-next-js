"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";
import {
    FaCheck,
    FaTimes,
    FaClock,
    FaChartLine,
    FaUserGraduate,
    FaChartBar,
    FaUsers,
    FaIdBadge,
} from "react-icons/fa";
import { fetchStats } from "./pazzaReducer";

const ClassAtGlance = ({
                           courseId,
                           stats,
                       }: {
    courseId: string;
    stats?: any;
}) => {
    const dispatch = useDispatch<any>();

    const enrollments = useSelector(
        (state: any) => state.enrollmentsReducer?.enrollments || []
    );
    const courses = useSelector(
        (state: any) => state.coursesReducer?.courses || []
    );

    const course = courses.find((c: any) => c._id === courseId);
    const courseEnrollments = enrollments.filter((e: any) => e.course === courseId);
    const studentCount = courseEnrollments.filter(
        (e: any) => e.user?.role === "STUDENT"
    ).length;
    const instructorCount = courseEnrollments.filter((e: any) =>
        ["FACULTY", "TA", "INSTRUCTOR"].includes(e.user?.role)
    ).length;

    const defaultStats = {
        unreadPosts: 0,
        unansweredQuestions: 0,
        unansweredFollowups: 0,
        totalPosts: 0,
        instructorResponses: 0,
        studentResponses: 0,
        totalContributions: 0,
    };
    const statistics = stats || defaultStats;

    useEffect(() => {
        if (courseId && !stats) {
            dispatch(fetchStats(courseId));
        }
    }, [courseId, dispatch, stats]);

    const attention = [
        {
            label: "unread posts",
            value: statistics.unreadPosts,
        },
        {
            label: "unanswered questions",
            value: statistics.unansweredQuestions,
        },
        {
            label: "unanswered followups",
            value: statistics.unansweredFollowups,
        },
    ];

    return (
        <div className="class-glance">
            <div className="glance-header">
                <h2>Class at a Glance</h2>
                <div className="glance-updated">
                    Updated just now.{" "}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(fetchStats(courseId));
                        }}
                    >
                        Reload
                    </a>
                </div>
            </div>

            {/* Attention banners (like Piazza “Needs Attention”) */}
            <Row className="mb-3 attention-strip">
                {attention.map((a, i) => (
                    <Col md={4} key={i} className="mb-2">
                        <div
                            className={`attention-item ${
                                a.value > 0 ? "warn" : "ok"
                            } d-flex align-items-center`}
                        >
                            <div className="attention-icon">
                                {a.value > 0 ? <FaTimes /> : <FaCheck />}
                            </div>
                            <div>
                                <div className="attention-title">
                                    {a.value > 0 ? "Needs Attention" : "All Set"}
                                </div>
                                <div className="attention-sub">
                                    {a.value} {a.label}
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Metric cards row */}
            <Row className="metric-row">
                <Col md={4} className="mb-3">
                    <Card className="metric-card">
                        <div className="metric-icon">
                            <FaChartBar />
                        </div>
                        <div className="metric-meta">
                            <div className="metric-label">Total Posts</div>
                            <div className="metric-value">{statistics.totalPosts}</div>
                        </div>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="metric-card">
                        <div className="metric-icon">
                            <FaChartLine />
                        </div>
                        <div className="metric-meta">
                            <div className="metric-label">Total Contributions</div>
                            <div className="metric-value">{statistics.totalContributions}</div>
                        </div>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="metric-card">
                        <div className="metric-icon">
                            <FaUsers />
                        </div>
                        <div className="metric-meta">
                            <div className="metric-label">Students Enrolled</div>
                            <div className="metric-value">{studentCount}</div>
                        </div>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="metric-card">
                        <div className="metric-icon">
                            <FaIdBadge />
                        </div>
                        <div className="metric-meta">
                            <div className="metric-label">License Status</div>
                            <div className="metric-value small">active instructor license</div>
                        </div>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="metric-card">
                        <div className="metric-icon">
                            <FaClock />
                        </div>
                        <div className="metric-meta">
                            <div className="metric-label">Instructor Engagement</div>
                            <div className="metric-value">
                                {statistics.instructorResponses}
                            </div>
                            <div className="metric-hint">instructor responses</div>
                        </div>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="metric-card">
                        <div className="metric-icon">
                            <FaUserGraduate />
                        </div>
                        <div className="metric-meta">
                            <div className="metric-label">Student Participation</div>
                            <div className="metric-value">
                                {statistics.studentResponses}
                            </div>
                            <div className="metric-hint">student responses</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Enrollment Progress (kept, but restyled to match) */}
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                    <h5 className="d-flex align-items-center">
                        <FaUserGraduate className="me-2" />
                        Student Enrollment
                    </h5>
                    <div className="mb-2">
                        <strong>{studentCount}</strong> enrolled
                        {typeof instructorCount === "number" && (
                            <span className="text-muted ms-2">
                • {instructorCount} instructor
                                {instructorCount > 1 ? "s" : ""}
              </span>
                        )}
                    </div>
                    <ProgressBar
                        now={Math.min(100, (studentCount / 100) * 100)}
                        variant="success"
                        style={{ height: "28px" }}
                        label={`${Math.round(Math.min(100, (studentCount / 100) * 100))}%`}
                    />
                </Card.Body>
            </Card>

            {/* Course info footer (kept) */}
            {course && (
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <h5 className="mb-3">Course Information</h5>
                        <Row>
                            <Col sm={6}>
                                <p className="mb-1">
                                    <strong>Course:</strong> {course.name}
                                </p>
                                <p className="mb-1">
                                    <strong>Number:</strong> {course.number}
                                </p>
                            </Col>
                            <Col sm={6}>
                                <p className="mb-1">
                                    <strong>Section:</strong> {course.section || "01"}
                                </p>
                                <p className="mb-1">
                                    <strong>Term:</strong> {course.term || "Spring 2025"}
                                </p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}
        </div>
    );
};

export default ClassAtGlance;
