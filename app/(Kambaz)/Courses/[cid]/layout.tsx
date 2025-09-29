"use client";

import type { ReactNode } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "../CourseNavigation";
import * as db from "../../Database";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function CoursesLayout({ children }: { children: ReactNode }) {
    const { cid } = useParams<{ cid: string }>();
    const pathname = usePathname();
    const router = useRouter();
    const course = db.courses.find((c: any) => c._id === cid);

    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

    // Check if user is enrolled or is faculty
    const isEnrolled = enrollments.some(
        (e: any) => e.user === currentUser?._id && e.course === cid
    );
    const canAccess = isEnrolled || currentUser?.role === "FACULTY";

    useEffect(() => {
        if (!currentUser) {
            router.push("/Account/Signin");
        } else if (!canAccess) {
            router.push("/Dashboard");
        }
    }, [currentUser, canAccess, router]);

    if (!canAccess) {
        return null;
    }

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