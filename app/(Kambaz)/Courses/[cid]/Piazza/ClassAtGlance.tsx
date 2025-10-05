"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Card, Row, Col, ProgressBar, Alert } from "react-bootstrap";
import {
    FaCheck,
    FaTimes,
    FaQuestionCircle,
    FaComments,
    FaUserGraduate,
    FaClock,
    FaChartLine,
    FaBook,
    FaAndroid,
    FaApple
} from "react-icons/fa";
import { fetchStats } from "./pazzaReducer";

// Explicitly type the component
const ClassAtGlance = ({ courseId, stats }: { courseId: string; stats?: any }) => {
    const dispatch = useDispatch<any>();

    const enrollments = useSelector((state: any) => state.enrollmentsReducer?.enrollments || []);
    const courses = useSelector((state: any) => state.coursesReducer?.courses || []);

    const course = courses.find((c: any) => c._id === courseId);
    const courseEnrollments = enrollments.filter((e: any) => e.course === courseId);
    const studentCount = courseEnrollments.filter((e: any) =>
        e.user?.role === "STUDENT"
    ).length;
    const instructorCount = courseEnrollments.filter((e: any) =>
        ["FACULTY", "TA"].includes(e.user?.role)
    ).length;

    // Default stats if not provided
    const defaultStats = {
        unreadPosts: 0,
        unansweredQuestions: 0,
        unansweredFollowups: 0,
        totalPosts: 0,
        instructorResponses: 0,
        studentResponses: 0,
        totalContributions: 0
    };

    const statistics = stats || defaultStats;

    useEffect(() => {
        if (courseId && !stats) {
            dispatch(fetchStats(courseId));
        }
    }, [courseId, dispatch, stats]);

    const handleReload = () => {
        dispatch(fetchStats(courseId));
    };

    const StatCard = ({ icon, value, label, color = "primary", description }: any) => (
        <div className="stat-item">
            <div className={`stat-icon bg-${color}`}>
                {icon}
            </div>
            <div>
                <div className="stat-text">{value}</div>
                {description && <small className="text-muted">{description}</small>}
            </div>
        </div>
    );

    return (
        <div className="class-glance">
            <h2>Class at a Glance</h2>
            <div className="glance-updated">
                Updated just now. <a href="#" onClick={(e) => { e.preventDefault(); handleReload(); }}>Reload</a>
            </div>

            <Row className="mb-4">
                <Col md={4}>
                    <div className="stats-grid">
                        <StatCard
                            icon={statistics.unreadPosts === 0 ? <FaCheck /> : <FaTimes />}
                            value={statistics.unreadPosts === 0 ? "no unread posts" : `${statistics.unreadPosts} unread posts`}
                            color={statistics.unreadPosts === 0 ? "success" : "warning"}
                        />
                        <StatCard
                            icon={statistics.unansweredQuestions === 0 ? <FaCheck /> : <FaTimes />}
                            value={statistics.unansweredQuestions === 0 ? "no unanswered questions" : `${statistics.unansweredQuestions} unanswered questions`}
                            color={statistics.unansweredQuestions === 0 ? "success" : "warning"}
                        />
                        <StatCard
                            icon={statistics.unansweredFollowups === 0 ? <FaCheck /> : <FaTimes />}
                            value={statistics.unansweredFollowups === 0 ? "no unanswered followups" : `${statistics.unansweredFollowups} unanswered followups`}
                            color={statistics.unansweredFollowups === 0 ? "success" : "warning"}
                        />
                    </div>
                </Col>

                <Col md={4}>
                    <div className="stats-summary">
                        <div className="summary-row">
                            <span className="summary-label">license status</span>
                            <span className="summary-value">active instructor license</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">total posts</span>
                            <span className="summary-value">{statistics.totalPosts}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">total contributions</span>
                            <span className="summary-value">{statistics.totalContributions}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">instructors' responses</span>
                            <span className="summary-value">{statistics.instructorResponses}</span>
                        </div>
                        <div className="summary-row">
                            <span className="summary-label">students' responses</span>
                            <span className="summary-value">{statistics.studentResponses}</span>
                        </div>
                    </div>
                </Col>

                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex align-items-center mb-2">
                                <FaClock className="text-primary me-2" size={20} />
                                <div>
                                    <div className="text-muted small">avg. response time</div>
                                    <div className="h5 mb-0">8 hr</div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <FaChartLine className="text-success me-2" size={20} />
                                <div>
                                    <div className="text-muted small">class participation</div>
                                    <div className="h5 mb-0">
                                        {Math.round((statistics.totalContributions / Math.max(studentCount, 1)) * 10) / 10} posts/student
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Student Enrollment Progress */}
            <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                    <h5 className="d-flex align-items-center">
                        <FaUserGraduate className="me-2" />
                        Student Enrollment
                    </h5>
                    <div className="mb-2">
                        <strong>{studentCount}</strong> enrolled out of <strong>100</strong> (estimated)
                        {instructorCount > 0 && (
                            <span className="text-muted ms-2">
                                • {instructorCount} instructor{instructorCount > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <ProgressBar
                        now={(studentCount / 100) * 100}
                        variant="success"
                        style={{ height: "30px" }}
                        label={`${Math.round((studentCount / 100) * 100)}%`}
                    />
                </Card.Body>
            </Card>

            <Row>
                {/* Mobile Apps */}
                <Col md={6}>
                    <Card className="mb-3 border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <h6 className="mb-3">Download Pazza on Mobile</h6>
                            <div className="d-flex justify-content-center gap-3">
                                <a href="#" className="text-decoration-none">
                                    <div className="d-flex align-items-center gap-2 px-3 py-2 bg-dark text-white rounded">
                                        <FaApple size={20} />
                                        <div className="text-start">
                                            <div className="small">Download on the</div>
                                            <div>App Store</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#" className="text-decoration-none">
                                    <div className="d-flex align-items-center gap-2 px-3 py-2 bg-dark text-white rounded">
                                        <FaAndroid size={20} />
                                        <div className="text-start">
                                            <div className="small">Get it on</div>
                                            <div>Google Play</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* AI Features Announcement */}
                <Col md={6}>
                    <Card className="mb-3 border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">
                                <span className="badge bg-info me-2">New</span>
                                AI-Powered Features
                            </h5>
                            <Alert variant="info" className="mb-2">
                                <strong>Followup Summarization:</strong> Posts with 5+ followup comments now have a "Summarize" button for quick overview.
                            </Alert>
                            <Alert variant="info" className="mb-0">
                                <strong>Folder Summarization:</strong> View AI-generated summaries of folder content for quick navigation.
                            </Alert>
                            <small className="text-muted">
                                These features are optional and can be enabled in Q&A Settings.
                            </small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Course Information */}
            {course && (
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <h5 className="mb-3">
                            <FaBook className="me-2" />
                            Course Information
                        </h5>
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