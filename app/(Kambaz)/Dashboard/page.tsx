// app/(Kambaz)/Dashboard/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { PiNotePencilLight } from "react-icons/pi";
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
                        <div className="card h-100 shadow-sm border-0 hover-lift position-relative">
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

                            <div className="card-body">
                                {/* Icon */}
                                <span className="canvas-tile-icon text-secondary" title="Course card icon">
                                    <PiNotePencilLight />
                                </span>

                                {/* ONLY Course Name and Semester Info */}
                                <h5 className="wd-dashboard-course-title course-title mt-2 mb-1">
                                    {course.name}
                                </h5>
                                <div className="text-muted small">
                                    {course.number}
                                </div>
                                <div className="text-muted small">
                                    {course.term} · {course.semester}
                                </div>

                                {/* Stretched link - covers entire card */}
                                <Link
                                    href={`/Courses/${course._id}/Home`}
                                    className="stretched-link"
                                    aria-label={`Open ${course.name}`}
                                />
                            </div>

                            {/* Go Button */}
                            <Link href={`/Courses/${course._id}/Home`} className="btn btn-primary btn-sm btn-go">
                                Go
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}