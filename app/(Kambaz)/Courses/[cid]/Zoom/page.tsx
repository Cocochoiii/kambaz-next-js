"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/app/(Kambaz)/store";
import { Tab, Tabs, Table, Button, Form, Modal, Row, Col, Alert } from "react-bootstrap";
import { FaVideo, FaCalendarPlus, FaClock, FaUsers, FaRecordVinyl, FaLink } from "react-icons/fa";
import { addMeeting, deleteMeeting, updateMeetingStatus } from "./reducer";
import { format } from "date-fns";

export default function Zoom() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const router = useRouter();

    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
    const { courses } = useSelector((state: RootState) => state.coursesReducer);
    const { meetings, personalMeetingRoom, cloudRecordings } = useSelector((state: RootState) => state.zoomReducer);

    const [activeTab, setActiveTab] = useState("upcoming");
    const [showOnlyCourseMeetings, setShowOnlyCourseMeetings] = useState(true);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newMeeting, setNewMeeting] = useState({
        topic: "",
        courseId: cid as string,
        section: "01",
        startTime: "",
        duration: 60,
        passcode: "",
        timezone: "America/New_York"
    });

    const isFaculty = currentUser?.role === "FACULTY";
    const isStudent = currentUser?.role === "STUDENT";

    // Get user's enrolled courses
    const userCourses = courses.filter(course =>
        enrollments.some(e =>
            e.user === currentUser?._id &&
            e.course === course._id
        )
    );

    // Filter meetings based on user role and enrollment
    const filteredMeetings = meetings.filter(meeting => {
        // If in a specific course context, only show that course's meetings
        if (cid) {
            return meeting.courseId === cid;
        }

        // If showing only course meetings
        if (showOnlyCourseMeetings) {
            // Faculty sees all their courses' meetings
            if (isFaculty) {
                return meeting.hostId === currentUser?._id;
            }
            // Students see only enrolled courses' meetings
            return userCourses.some(course => course._id === meeting.courseId);
        }

        return true;
    });

    // Separate upcoming and past meetings
    const upcomingMeetings = filteredMeetings.filter(m =>
        m.status === "upcoming" || m.status === "recurring"
    ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const pastMeetings = filteredMeetings.filter(m =>
        m.status === "past"
    ).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    // Auto-update meeting status based on current time
    useEffect(() => {
        const now = new Date();
        meetings.forEach(meeting => {
            const meetingTime = new Date(meeting.startTime);
            const meetingEnd = new Date(meetingTime.getTime() + meeting.duration * 60000);

            if (meetingEnd < now && meeting.status === "upcoming") {
                dispatch(updateMeetingStatus({
                    meetingId: meeting._id,
                    status: "past"
                }));
            }
        });
    }, [meetings, dispatch]);

    const handleScheduleMeeting = () => {
        const meetingId = `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`;
        const joinUrl = `https://zoom.us/j/${meetingId.replace(/-/g, '')}`;

        const course = courses.find(c => c._id === newMeeting.courseId);
        const topic = newMeeting.topic || `${course?.name || 'Course'} - Meeting`;

        dispatch(addMeeting({
            topic,
            courseId: newMeeting.courseId,
            courseName: course?.name || "",
            section: newMeeting.section,
            meetingId,
            passcode: newMeeting.passcode || Math.random().toString(36).substring(7),
            startTime: newMeeting.startTime,
            duration: newMeeting.duration,
            timezone: newMeeting.timezone,
            joinUrl,
            status: "upcoming",
            hostId: currentUser?._id || ""
        }));

        setShowScheduleModal(false);
        setNewMeeting({
            topic: "",
            courseId: cid as string,
            section: "01",
            startTime: "",
            duration: 60,
            passcode: "",
            timezone: "America/New_York"
        });
    };

    const handleDeleteMeeting = (meetingId: string) => {
        if (window.confirm("Are you sure you want to delete this meeting?")) {
            dispatch(deleteMeeting(meetingId));
        }
    };

    const formatMeetingTime = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM d, yyyy h:mm a");
        } catch {
            return dateString;
        }
    };

    const renderMeetingsTable = (meetingsList: typeof meetings) => {
        if (meetingsList.length === 0) {
            return (
                <div className="text-center py-5">
                    <p className="text-muted">No Data</p>
                </div>
            );
        }

        return (
            <Table hover className="mt-3">
                <thead>
                <tr>
                    <th>Start Time</th>
                    <th>Topic</th>
                    <th>Section</th>
                    <th>Meeting ID</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {meetingsList.map(meeting => (
                    <tr key={meeting._id}>
                        <td>{formatMeetingTime(meeting.startTime)}</td>
                        <td>
                            <FaVideo className="text-primary me-2" />
                            {meeting.topic}
                        </td>
                        <td>{meeting.courseName} - {meeting.section}</td>
                        <td>{meeting.meetingId}</td>
                        <td>
                            <Button
                                variant="link"
                                size="sm"
                                className="text-decoration-none me-2"
                                onClick={() => window.open(meeting.joinUrl, "_blank")}
                            >
                                Join
                            </Button>
                            {isFaculty && meeting.hostId === currentUser?._id && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-danger text-decoration-none"
                                    onClick={() => handleDeleteMeeting(meeting._id)}
                                >
                                    Delete
                                </Button>
                            )}
                            {meeting.recordingUrl && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-decoration-none"
                                    onClick={() => window.open(meeting.recordingUrl, "_blank")}
                                >
                                    Recording
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        );
    };

    return (
        <div id="wd-zoom" className="container-fluid px-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Zoom</h1>
                {isFaculty && (
                    <Button
                        variant="primary"
                        onClick={() => setShowScheduleModal(true)}
                    >
                        Schedule a New Meeting
                    </Button>
                )}
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <a
                    href="#"
                    className="text-primary text-decoration-none"
                    onClick={(e) => {
                        e.preventDefault();
                        // Link to all Zoom meetings/recordings
                    }}
                >
                    All My Zoom Meetings/Recordings
                </a>
                {isFaculty && (
                    <a
                        href="#"
                        className="text-primary text-decoration-none"
                        onClick={(e) => {
                            e.preventDefault();
                            // Get training link
                        }}
                    >
                        Get Training <FaLink className="ms-1" />
                    </a>
                )}
            </div>

            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || "upcoming")}
                className="mb-3"
            >
                <Tab eventKey="upcoming" title="Upcoming Meetings">
                    <Form.Check
                        type="checkbox"
                        label="Show my course meetings only"
                        checked={showOnlyCourseMeetings}
                        onChange={(e) => setShowOnlyCourseMeetings(e.target.checked)}
                        className="mb-3"
                    />
                    {renderMeetingsTable(upcomingMeetings)}
                </Tab>

                <Tab eventKey="previous" title="Previous Meetings">
                    <Form.Check
                        type="checkbox"
                        label="Show my course meetings only"
                        checked={showOnlyCourseMeetings}
                        onChange={(e) => setShowOnlyCourseMeetings(e.target.checked)}
                        className="mb-3"
                    />
                    {renderMeetingsTable(pastMeetings)}
                </Tab>

                <Tab eventKey="personal" title="Personal Meeting Room">
                    <div className="py-4">
                        {personalMeetingRoom ? (
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <FaUsers className="me-2" />
                                        Your Personal Meeting Room
                                    </h5>
                                    <Row className="mt-3">
                                        <Col md={6}>
                                            <p><strong>Meeting ID:</strong> {personalMeetingRoom.meetingId}</p>
                                            <p><strong>Passcode:</strong> {personalMeetingRoom.passcode}</p>
                                        </Col>
                                        <Col md={6}>
                                            <Button
                                                variant="primary"
                                                onClick={() => window.open(personalMeetingRoom.joinUrl, "_blank")}
                                            >
                                                Start Personal Room
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        ) : (
                            <Alert variant="info">
                                Personal Meeting Room not configured. Please contact your administrator.
                            </Alert>
                        )}
                    </div>
                </Tab>

                <Tab eventKey="recordings" title="Cloud Recordings">
                    <div className="py-4">
                        {cloudRecordings.length > 0 ? (
                            <Table hover>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Topic</th>
                                    <th>Duration</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cloudRecordings.map((recording, index) => (
                                    <tr key={index}>
                                        <td>{recording.date}</td>
                                        <td>{recording.topic}</td>
                                        <td>{recording.duration}</td>
                                        <td>
                                            <Button variant="link" size="sm">View</Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className="text-center py-5">
                                <FaRecordVinyl className="text-muted mb-3" style={{ fontSize: "3rem" }} />
                                <p className="text-muted">No cloud recordings available</p>
                            </div>
                        )}
                    </div>
                </Tab>
            </Tabs>

            {/* Schedule Meeting Modal */}
            <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Schedule a New Meeting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Topic</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter meeting topic"
                                value={newMeeting.topic}
                                onChange={(e) => setNewMeeting({ ...newMeeting, topic: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Course</Form.Label>
                            <Form.Select
                                value={newMeeting.courseId}
                                onChange={(e) => setNewMeeting({ ...newMeeting, courseId: e.target.value })}
                            >
                                {userCourses.map(course => (
                                    <option key={course._id} value={course._id}>
                                        {course.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={newMeeting.startTime}
                                        onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duration (minutes)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={newMeeting.duration}
                                        onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Passcode (optional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter meeting passcode"
                                value={newMeeting.passcode}
                                onChange={(e) => setNewMeeting({ ...newMeeting, passcode: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleScheduleMeeting}>
                        Schedule Meeting
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}