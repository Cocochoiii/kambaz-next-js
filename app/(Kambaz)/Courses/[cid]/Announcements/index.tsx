"use client";

import { useParams } from "next/navigation";
import { FaUserCircle, FaPlus, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setAnnouncements, addAnnouncement, deleteAnnouncement, updateAnnouncement } from "./reducer";
import * as announcementsClient from "./client";
import AnnouncementModal from "./AnnouncementModal";
import KebabMenu from "@/app/(Kambaz)/KebabMenu";
import { useIsFaculty } from "../../../Account/roles";

export default function Announcements() {
    const { cid } = useParams<{ cid: string }>();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

    const { announcements } = useSelector((state: any) => state.announcementsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const loadAnnouncements = async () => {
        const list = await announcementsClient.findAnnouncementsForCourse(cid);
        dispatch(setAnnouncements(list));
    };
    useEffect(() => {
        loadAnnouncements();
    }, [cid]);

    // Filter announcements for current course
    const [searchTerm, setSearchTerm] = useState("");
    const courseAnnouncements = announcements
        .filter((a: any) => a.course === cid)
        .filter((a: any) => {
            const q = searchTerm.toLowerCase();
            return (
                (a.title || "").toLowerCase().includes(q) ||
                (a.content || "").toLowerCase().includes(q)
            );
        });

    // Check if current user is faculty
    const isFaculty = useIsFaculty();

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

    const handleDeleteClick = async (announcementId: string) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            await announcementsClient.deleteAnnouncement(announcementId);
            dispatch(deleteAnnouncement(announcementId));
        }
    };

    const handleSave = async (announcementData: any) => {
        if (editMode) {
            await announcementsClient.updateAnnouncement(announcementData);
            dispatch(updateAnnouncement(announcementData));
        } else {
            const created = await announcementsClient.createAnnouncement(cid, {
                ...announcementData,
                course: cid,
                author: currentUser?.username || "Unknown",
                date: new Date().toISOString(),
            });
            dispatch(addAnnouncement(created));
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                                {announcement.author} - {announcement.section}
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
                                                <div className="d-flex justify-content-end align-items-center gap-2 mt-1">
                                                    <button
                                                        className="btn btn-link text-danger p-0"
                                                        type="button"
                                                        onClick={() => handleDeleteClick(announcement._id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    <KebabMenu items={[{ label: "Edit", onClick: () => handleEditClick(announcement) }]} />
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