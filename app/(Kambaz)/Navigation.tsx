"use client";

import { useState } from "react";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function KambazNavigation() {
    const pathname = usePathname();
    const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
    const { courses } = useSelector((state: any) => state.coursesReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

    // Filter courses based on enrollment for non-faculty users
    const displayedCourses = currentUser?.role === "FACULTY"
        ? courses
        : courses.filter((c: any) =>
            enrollments.some((e: any) => e.user === currentUser?._id && e.course === c._id)
        );

    const links = [
        { href: "/Account", label: "Account", icon: FaRegCircleUser },
        { href: "/Dashboard", label: "Dashboard", icon: AiOutlineDashboard },
        { href: "#", label: "Courses", icon: LiaBookSolid, dropdown: true },
        { href: "/Calendar", label: "Calendar", icon: IoCalendarOutline },
        { href: "/Inbox", label: "Inbox", icon: FaInbox },
        { href: "/Labs", label: "Labs", icon: LiaBookSolid },
        { href: "/Settings", label: "Settings", icon: LiaCogSolid },
    ];

    const isActive = (href: string, label: string) => {
        if (label === "Account") {
            return pathname.includes("/Account");
        }
        if (label === "Dashboard") {
            return pathname === "/Dashboard";
        }
        if (label === "Courses") {
            return pathname.includes("/Courses/");
        }
        return pathname === href;
    };

    return (
        <>
            <ul
                id="wd-kambaz-navigation"
                className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 text-center"
                style={{ width: 100 }}
            >
                <li className="list-group-item bg-black border-0 text-center" id="wd-neu-link">
                    <a href="https://www.northeastern.edu/" target="_blank" rel="noreferrer">
                        <img src="/images/NEU.png" width={75} alt="Northeastern University" />
                    </a>
                </li>
                <br />

                {/* Dynamic Links */}
                {links.map((link) => {
                    const active = isActive(link.href, link.label);
                    const Icon = link.icon;

                    if (link.dropdown) {
                        return (
                            <li
                                key={link.label}
                                className={`list-group-item border-0 text-center position-relative ${
                                    active ? "bg-white" : "bg-black"
                                }`}
                            >
                                <button
                                    onClick={() => setShowCoursesDropdown(!showCoursesDropdown)}
                                    className={`btn p-0 text-decoration-none ${active ? "text-danger" : "text-white"}`}
                                    style={{ background: "none", border: "none" }}
                                >
                                    <Icon className={`fs-1 ${active ? "text-danger" : "text-white"}`} />
                                    <br />
                                    {link.label}
                                </button>
                            </li>
                        );
                    }

                    return (
                        <li
                            key={link.label}
                            className={`list-group-item border-0 text-center ${
                                active ? "bg-white" : "bg-black"
                            }`}
                        >
                            <Link
                                href={link.href}
                                className={`text-decoration-none d-block ${active ? "text-danger" : "text-white"}`}
                            >
                                <Icon className={`fs-1 ${active ? "text-danger" : "text-white"}`} />
                                <br />
                                {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            {/* Courses Dropdown Panel */}
            {showCoursesDropdown && (
                <div
                    className="position-fixed bg-white shadow-lg border rounded-end"
                    style={{
                        left: 100,
                        top: 0,
                        width: 320,
                        height: "100vh",
                        zIndex: 1050,
                        overflowY: "auto"
                    }}
                >
                    <div className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="mb-0">Courses</h4>
                            <button
                                className="btn-close"
                                onClick={() => setShowCoursesDropdown(false)}
                            />
                        </div>

                        <div className="mb-3">
                            <h6 className="text-muted">All Courses</h6>
                        </div>

                        <div className="list-group">
                            {displayedCourses.map((course: any) => (
                                <Link
                                    key={course._id}
                                    href={`/Courses/${course._id}/Home`}
                                    className="list-group-item list-group-item-action border-0 mb-2 rounded"
                                    onClick={() => setShowCoursesDropdown(false)}
                                    style={{ backgroundColor: "#f8f9fa" }}
                                >
                                    <div className="d-flex align-items-start">
                                        <div
                                            className="rounded me-3"
                                            style={{
                                                width: 8,
                                                height: 60,
                                                backgroundColor: {
                                                    "5610": "#3b82f6",
                                                    "5520": "#10b981",
                                                    "5004": "#f59e0b",
                                                    "5200": "#06b6d4",
                                                    "5800": "#ef4444",
                                                    "6620": "#a855f7",
                                                    "6510": "#22d3ee",
                                                }[course._id] || "#6b7280"
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{course.number}</h6>
                                            <div className="text-muted small">{course.name}</div>
                                            <div className="text-muted small">{course.term}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {showCoursesDropdown && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{ zIndex: 1040, background: "rgba(0,0,0,0.3)" }}
                    onClick={() => setShowCoursesDropdown(false)}
                />
            )}
        </>
    );
}