// app/(Kambaz)/Courses/CourseNavigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CourseNavigation({ cid }: { cid: string }) {
    const pathname = usePathname();

    const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

    const isActive = (section: string) => {
        const currentPath = pathname.split('/').pop();
        if (section === "People" && pathname.includes("/People/Table")) return true;
        return currentPath === section;
    };

    return (
        <div id="wd-courses-navigation">
            {links.map((link) => {
                const href = link === "People"
                    ? `/Courses/${cid}/People/Table`
                    : `/Courses/${cid}/${link}`;
                const active = isActive(link);

                return (
                    <div key={link}>
                        <Link
                            id={`wd-course-${link.toLowerCase()}-link`}
                            href={href}
                            className={active ? "text-dark fw-semibold" : "text-danger"}
                            style={{ textDecoration: "none" }}
                        >
                            {link}
                        </Link>
                        <br />
                    </div>
                );
            })}
        </div>
    );
}