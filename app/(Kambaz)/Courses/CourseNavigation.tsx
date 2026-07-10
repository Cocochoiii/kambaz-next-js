"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Data-driven course sidebar. The current page's link is marked "active",
// which styles.css renders with black text and a black left border.
const LINKS = ["Home", "Modules", "Announcements", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

export default function CourseNavigation({ cid }: { cid: string }) {
    const pathname = usePathname();

    return (
        <div id="wd-courses-navigation" className="list-group rounded-0">
            {LINKS.map((link) => {
                const href = link === "People"
                    ? `/Courses/${cid}/People/Table`
                    : `/Courses/${cid}/${link}`;
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                    <Link
                        key={link}
                        id={`wd-course-${link.toLowerCase()}-link`}
                        href={href}
                        className={`list-group-item text-decoration-none ${active ? "active" : ""}`}
                    >
                        {link}
                    </Link>
                );
            })}
        </div>
    );
}
