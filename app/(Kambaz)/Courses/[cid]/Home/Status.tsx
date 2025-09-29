"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { FaHouse, FaBullhorn, FaChartLine, FaBell } from "react-icons/fa6";
import { useSelector } from "react-redux";

export default function CourseStatus() {
    const { cid } = useParams<{ cid: string }>();
    const router = useRouter();
    const [isPublished, setIsPublished] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [showHomePageModal, setShowHomePageModal] = useState(false);
    const [announcement, setAnnouncement] = useState({ title: "", content: "" });
    const [selectedHomePage, setSelectedHomePage] = useState("modules");
    const [showSuccessAlert, setShowSuccessAlert] = useState("");

    const { courses } = useSelector((state: any) => state.coursesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const role = (currentUser?.role ?? "").toString().toUpperCase();
    const isFaculty = role === "FACULTY";

    // Hide the entire panel for non-faculty (safety if mounted anywhere)
    if (!isFaculty) return null;

    // Toggle publish status
    const handlePublishToggle = () => {
        setIsPublished(!isPublished);
        setShowSuccessAlert(
            isPublished ? "Course unpublished successfully" : "Course published successfully"
        );
        setTimeout(() => setShowSuccessAlert(""), 3000);
    };

    // Handle import from existing courses
    const handleImportContent = () => {
        setShowImportModal(false);
        setShowSuccessAlert("Content imported successfully");
        setTimeout(() => setShowSuccessAlert(""), 3000);
    };

    // Create new announcement
    const handleCreateAnnouncement = () => {
        if (announcement.title && announcement.content) {
            setShowAnnouncementModal(false);
            setAnnouncement({ title: "", content: "" });
            setShowSuccessAlert("Announcement posted successfully");
            setTimeout(() => setShowSuccessAlert(""), 3000);
        }
    };

    // Change home page
    const handleChangeHomePage = () => {
        setShowHomePageModal(false);
        setShowSuccessAlert(`Home page set to ${selectedHomePage}`);
        setTimeout(() => setShowSuccessAlert(""), 3000);
    };

    // View course screen
    const handleViewCourseScreen = () => {
        router.push(`/Courses/${cid}/Home`);
    };

    // View analytics
    const handleViewAnalytics = () => {
        router.push(`/Courses/${cid}/Grades`);
    };

    // View notifications
    const handleViewNotifications = () => {
        setShowSuccessAlert("No new notifications");
        setTimeout(() => setShowSuccessAlert(""), 3000);
    };

    return (
        <>
            <div id="wd-course-status" style={{ width: 350 }}>
                <h2>Course Status</h2>

                {showSuccessAlert && (
                    <Alert variant="success" className="mb-3">
                        {showSuccessAlert}
                    </Alert>
                )}

                <div className="d-flex mb-3">
                    <div className="w-50 pe-1">
                        <Button
                            variant={isPublished ? "secondary" : "success"}
                            className="w-100 text-nowrap"
                            onClick={handlePublishToggle}
                        >
                            {isPublished ? (
                                <>
                                    <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className="me-2 fs-5" /> Publish
                                </>
                            )}
                        </Button>
                    </div>
                    <div className="w-50">
                        <Button
                            variant={isPublished ? "success" : "secondary"}
                            className="w-100"
                            onClick={handlePublishToggle}
                        >
                            {isPublished ? (
                                <>
                                    <FaCheckCircle className="me-2 fs-5" /> Published
                                </>
                            ) : (
                                <>
                                    <MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublished
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    className="w-100 mt-1 text-start"
                    onClick={() => setShowImportModal(true)}
                >
                    <BiImport className="me-2 fs-5" /> Import Existing Content
                </Button>

                <Button
                    variant="secondary"
                    className="w-100 mt-1 text-start"
                    onClick={() => setShowImportModal(true)}
                >
                    <LiaFileImportSolid className="me-2 fs-5" /> Import from Commons
                </Button>

                <Button
                    variant="secondary"
                    className="w-100 mt-1 text-start"
                    onClick={() => setShowHomePageModal(true)}
                >
                    <FaHouse className="me-2 fs-5" /> Choose Home Page
                </Button>

                <Button
                    variant="secondary"
                    className="w-100 mt-1 text-start"
                    onClick={handleViewCourseScreen}
                >
                    <FaHouse className="me-2 fs-5" /> View Course Stream
                </Button>

                <Button
                    variant="secondary"
                    className="w-100 mt-1 text-start"
                    onClick={() => setShowAnnouncementModal(true)}
                >
                    <FaBullhorn className="me-2 fs-5" /> New Announcement
                </Button>

                <Button
                    variant="secondary"
                    className="w-100 mt-1 text-start"
                    onClick={handleViewAnalytics}
                >
                    <FaChartLine className="me-2 fs-5" /> New Analytics
                </Button>

                <Button
                    variant="secondary"
                    className="w-100 mt-1 text-start"
                    onClick={handleViewNotifications}
                >
                    <FaBell className="me-2 fs-5" /> View Course Notifications
                </Button>
            </div>

            {/* Import Content Modal */}
            <Modal show={showImportModal} onHide={() => setShowImportModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Import Course Content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Select Source Course</Form.Label>
                            <Form.Select>
                                <option>Select a course...</option>
                                {courses
                                    .filter((c: any) => c._id !== cid)
                                    .map((course: any) => (
                                        <option key={course._id} value={course._id}>
                                            {course.name}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Content to Import</Form.Label>
                            <Form.Check label="Assignments" defaultChecked />
                            <Form.Check label="Modules" defaultChecked />
                            <Form.Check label="Quizzes" />
                            <Form.Check label="Files" />
                            <Form.Check label="Pages" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImportModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleImportContent}>
                        Import Content
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* New Announcement Modal */}
            <Modal
                show={showAnnouncementModal}
                onHide={() => setShowAnnouncementModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>New Announcement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={announcement.title}
                                onChange={(e) =>
                                    setAnnouncement({ ...announcement, title: e.target.value })
                                }
                                placeholder="Enter announcement title"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={announcement.content}
                                onChange={(e) =>
                                    setAnnouncement({ ...announcement, content: e.target.value })
                                }
                                placeholder="Enter announcement message"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowAnnouncementModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateAnnouncement}>
                        Post Announcement
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Choose Home Page Modal */}
            <Modal
                show={showHomePageModal}
                onHide={() => setShowHomePageModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Choose Home Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Check
                            type="radio"
                            label="Course Activity Stream"
                            name="homepage"
                            value="stream"
                            checked={selectedHomePage === "stream"}
                            onChange={(e) => setSelectedHomePage(e.target.value)}
                            className="mb-2"
                        />
                        <Form.Check
                            type="radio"
                            label="Course Modules"
                            name="homepage"
                            value="modules"
                            checked={selectedHomePage === "modules"}
                            onChange={(e) => setSelectedHomePage(e.target.value)}
                            className="mb-2"
                        />
                        <Form.Check
                            type="radio"
                            label="Assignments List"
                            name="homepage"
                            value="assignments"
                            checked={selectedHomePage === "assignments"}
                            onChange={(e) => setSelectedHomePage(e.target.value)}
                            className="mb-2"
                        />
                        <Form.Check
                            type="radio"
                            label="Course Syllabus"
                            name="homepage"
                            value="syllabus"
                            checked={selectedHomePage === "syllabus"}
                            onChange={(e) => setSelectedHomePage(e.target.value)}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowHomePageModal(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleChangeHomePage}>
                        Save Selection
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
