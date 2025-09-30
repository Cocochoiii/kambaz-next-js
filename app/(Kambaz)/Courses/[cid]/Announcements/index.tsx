"use client";

import { useParams } from "next/navigation";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addAnnouncement, deleteAnnouncement, updateAnnouncement } from "./reducer";
import AnnouncementModal from "./AnnouncementModal";

export default function Announcements() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

    const { announcements } = useSelector((state: any) => state.announcementsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    // Filter announcements for current course
    const courseAnnouncements = announcements.filter((a: any) => a.course === cid);

    // Check if current user is faculty
    const isFaculty = currentUser?.role === "FACULTY";

    const handleAddClick = () => {
        setEditingAnnouncement({
            title: "",
            content: "",
            section: "All Sections",
        });
        setEditMode(false);
        setShowModal(true);
    };

    const handleEditClick = (announcement: any) => {
        setEditingAnnouncement(announcement);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDeleteClick = (announcementId: string) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            dispatch(deleteAnnouncement(announcementId));
        }
    };

    const handleSave = (announcementData: any) => {
        if (editMode) {
            dispatch(updateAnnouncement(announcementData));
        } else {
            dispatch(addAnnouncement({
                ...announcementData,
                course: cid,
                author: currentUser?.username || "Unknown",
            }));
        }
        setShowModal(false);
        setEditingAnnouncement(null);
    };

    return (
        <div id="wd-announcements">
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search..."
                    />
                    {isFaculty && (
                        <button
                            className="btn btn-danger"
                            onClick={handleAddClick}
                        >
                            <FaPlus className="me-1" /> Announcement
                        </button>
                    )}
                </div>
            </div>

            <div className="list-group">
                {courseAnnouncements.length === 0 ? (
                    <div className="alert alert-info">
                        No announcements yet.
                    </div>
                ) : (
                    courseAnnouncements.map((announcement: any) => (
                        <div key={announcement._id} className="list-group-item border-start border-5 border-secondary mb-3">
                            <div className="d-flex">
                                <div className="me-3">
                                    <FaUserCircle className="text-secondary" size={40} />
                                </div>

                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="mb-1">{announcement.title}</h5>
                                            <p className="text-muted small mb-2">
                                                {announcement.author} • {announcement.section}
                                            </p>
                                        </div>
                                        <div className="text-end">
                                            <p className="text-muted small mb-1">Posted on:</p>
                                            <p className="small">
                                                {new Date(announcement.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                            {isFaculty && (
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-link text-muted p-0"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <BsThreeDots />
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleEditClick(announcement)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item text-danger"
                                                                onClick={() => handleDeleteClick(announcement._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mb-0">{announcement.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <AnnouncementModal
                    show={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setEditingAnnouncement(null);
                    }}
                    onSave={handleSave}
                    announcement={editingAnnouncement}
                    editMode={editMode}
                />
            )}
        </div>
    );
}