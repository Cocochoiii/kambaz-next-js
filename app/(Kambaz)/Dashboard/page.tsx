"use client";

import Link from "next/link";
import Image from "next/image";
import { PiNotePencilLight } from "react-icons/pi";
import {
    FaBullhorn,
    FaRegEdit,
    FaRegCommentDots,
    FaRegFolder
} from "react-icons/fa";
import * as db from "../Database";

export default function Dashboard() {
    const courses = db.courses;

    return (
        <div id="wd-dashboard" className="container-fluid">
            <h1 id="wd-dashboard-title" className="mb-0">Dashboard</h1>
            <hr />
            <h2 id="wd-dashboard-published" className="text-muted mb-4">
                Published Courses ({courses.length})
            </h2>
            <hr />

            {/* Course Cards Grid */}
            <div id="wd-dashboard-courses" className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                {courses.map((course) => (
                    <div className="col wd-dashboard-course" key={course._id} style={{ maxWidth: "300px" }}>
                        <div className="card h-100 shadow-sm border-0 hover-lift d-flex flex-column">
                            {/* Image with ratio */}
                            <div className="ratio ratio-16x9">
                                <Image
                                    src={`/images/${course.image}`}
                                    alt={course.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            <div className="card-body flex-grow-1 d-flex flex-column position-relative pb-5">

                                {/* Course Name and Semester Info */}
                                <h5 className="wd-dashboard-course-title course-title mt-2 mb-1">
                                    <Link
                                        href={`/Courses/${course._id}/Home`}
                                        className="text-decoration-none text-dark"
                                    >
                                        {course.name}
                                    </Link>
                                </h5>
                                <div className="text-muted small">
                                    {course.number}
                                </div>
                                <div className="text-muted small">
                                    {course.term} · {course.semester}
                                </div>

                                {/* Go Button positioned at bottom right */}
                                <Link
                                    href={`/Courses/${course._id}/Home`}
                                    className="btn btn-primary btn-sm position-absolute"
                                    style={{ bottom: '10px', right: '15px' }}
                                >
                                    Go
                                </Link>
                            </div>

                            {/* Four icon buttons - always at bottom */}
                            <div className="d-flex justify-content-around align-items-center py-2 px-3 border-top mt-auto">
                                <Link
                                    href={`/Courses/${course._id}/Announcements`}
                                    className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                >
                                    <FaBullhorn size={18} />
                                </Link>
                                <Link
                                    href={`/Courses/${course._id}/Quizzes`}
                                    className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                >
                                    <FaRegEdit size={18} />
                                </Link>
                                <Link
                                    href={`/Courses/${course._id}/Zoom`}
                                    className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                >
                                    <FaRegCommentDots size={18} />
                                </Link>
                                <Link
                                    href={`/Courses/${course._id}/Assignments`}
                                    className="btn p-0 border-0 bg-transparent dashboard-icon-btn"
                                >
                                    <FaRegFolder size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}