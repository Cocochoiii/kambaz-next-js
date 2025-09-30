"use client";

import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

interface AnnouncementModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (announcement: any) => void;
    announcement: any;
    editMode: boolean;
}

export default function AnnouncementModal({
                                              show,
                                              onClose,
                                              onSave,
                                              announcement,
                                              editMode
                                          }: AnnouncementModalProps) {
    const [formData, setFormData] = useState({
        _id: "",
        title: "",
        content: "",
        section: "All Sections",
    });

    useEffect(() => {
        if (announcement) {
            setFormData({
                _id: announcement._id || "",
                title: announcement.title || "",
                content: announcement.content || "",
                section: announcement.section || "All Sections",
            });
        }
    }, [announcement]);

    const handleSubmit = () => {
        if (formData.title && formData.content) {
            onSave(formData);
            // Clear form after save
            setFormData({
                _id: "",
                title: "",
                content: "",
                section: "All Sections",
            });
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {editMode ? "Edit Announcement" : "Add Announcement"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label htmlFor="announcement-title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="announcement-title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter announcement title"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="announcement-section" className="form-label">
                        Section
                    </label>
                    <select
                        className="form-select"
                        id="announcement-section"
                        value={formData.section}
                        onChange={(e) =>
                            setFormData({ ...formData, section: e.target.value })
                        }
                    >
                        <option value="All Sections">All Sections</option>
                        <option value="Section 01">Section 01</option>
                        <option value="Section 02">Section 02</option>
                        <option value="Section 03">Section 03</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="announcement-content" className="form-label">
                        Content
                    </label>
                    <textarea
                        className="form-control"
                        id="announcement-content"
                        rows={6}
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Enter announcement content..."
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="danger"
                    onClick={handleSubmit}
                    disabled={!formData.title || !formData.content}
                >
                    {editMode ? "Save Changes" : "Add Announcement"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}