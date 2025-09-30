"use client";

import { useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import * as db from "../../../Database";

export default function Announcements() {
    const { cid } = useParams<{ cid: string }>();
    const announcements = db.announcements.filter((a: any) => a.course === cid);

    return (
        <div id="wd-announcements">
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search..."
                    />
                    <button className="btn btn-danger">
                        + Announcement
                    </button>
                </div>
            </div>

            <div className="list-group">
                {announcements.map((announcement: any) => (
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
                                        <p className="small">{new Date(announcement.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}</p>
                                        <BsThreeDots className="text-muted" />
                                    </div>
                                </div>
                                <p className="mb-0">{announcement.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}