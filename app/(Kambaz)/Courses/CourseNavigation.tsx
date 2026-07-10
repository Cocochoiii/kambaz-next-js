"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Course sidebar links. The link for the current page is marked "active",
// which styles.css renders with black text and a black left border.
const LINKS = [
    { id: "wd-course-home-link",        label: "Home",        path: "Home" },
    { id: "wd-course-modules-link",     label: "Modules",     path: "Modules" },
    { id: "wd-course-piazza-link",      label: "Piazza",      path: "Piazza" },
    { id: "wd-course-zoom-link",        label: "Zoom",        path: "Zoom" },
    { id: "wd-course-assignments-link", label: "Assignments", path: "Assignments" },
    { id: "wd-course-quizzes-link",     label: "Quizzes",     path: "Quizzes" },
    { id: "wd-course-grades-link",      label: "Grades",      path: "Grades" },
    { id: "wd-course-people-link",      label: "People",      path: "People/Table" },
];

export default function CourseNavigation({ cid }: { cid: string }) {
    const pathname = usePathname();

    return (
        <div id="wd-courses-navigation" className="list-group rounded-0">
            {LINKS.map(({ id, label, path }) => {
                const href = `/Courses/${cid}/${path}`;
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                    <Link
                        key={id}
                        id={id}
                        href={href}
                        className={`list-group-item text-decoration-none ${active ? "active" : ""}`}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
