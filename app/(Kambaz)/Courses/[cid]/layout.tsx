// app/(Kambaz)/Courses/[cid]/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useParams, usePathname } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "../CourseNavigation";
import * as db from "../../Database";

export default function CoursesLayout({ children }: { children: ReactNode }) {
    const { cid } = useParams<{ cid: string }>();
    const pathname = usePathname();
    const course = db.courses.find((c: any) => c._id === cid);

    // Extract the section name from the pathname for breadcrumb
    const pathParts = pathname.split('/');
    const section = pathParts[pathParts.length - 1] === cid
        ? "Home"
        : pathParts[pathParts.length - 1] === "Table"
            ? "People"
            : pathParts[pathParts.length - 1];

    return (
        <div id="wd-courses" className="p-2">
            <h2 className="text-danger">
                <FaAlignJustify className="me-3 fs-4 mb-1" />
                {course ? course.name : `Course ${cid}`} &gt; {section}
            </h2>
            <hr />
            <div className="d-flex">
                <div className="d-none d-md-block" style={{ minWidth: 200 }}>
                    <CourseNavigation cid={cid} />
                </div>
                <div className="flex-fill ms-3">{children}</div>
            </div>
        </div>
    );
}