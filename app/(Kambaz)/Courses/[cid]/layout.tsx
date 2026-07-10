"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FaAlignJustify, FaGlasses } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import CourseNavigation from "../CourseNavigation";
import * as db from "../../Database";
import * as enrollmentsClient from "../../Enrollments/client";
import { setViewAsStudent } from "../../Account/reducer";

export default function CoursesLayout({ children }: { children: ReactNode }) {
    const { cid } = useParams<{ cid: string }>();
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const course = db.courses.find((c: any) => c._id === cid);

    const { currentUser, viewAsStudent } = useSelector((s: any) => s.accountReducer);
    const realFaculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";

    // Gate access: faculty open any course; students only their enrolled, published ones.
    const [access, setAccess] = useState<"checking" | "ok">("checking");
    useEffect(() => {
        let active = true;
        const check = async () => {
            if (!currentUser) {
                router.push("/Account/Signin");
                return;
            }
            if (realFaculty) {
                setAccess("ok");
                return;
            }
            try {
                const mine = await enrollmentsClient.findCoursesForUser(currentUser._id);
                const theCourse = mine.find((c: any) => c._id === cid);
                if (!active) return;
                // Enrolled AND the course is published, otherwise send them home.
                if (theCourse && theCourse.published !== false) setAccess("ok");
                else router.push("/Dashboard");
            } catch {
                if (active) router.push("/Dashboard");
            }
        };
        setAccess("checking");
        check();
        return () => {
            active = false;
        };
    }, [currentUser, realFaculty, cid, router]);

    if (!currentUser || access !== "ok") {
        return null;
    }

    // Section name for the breadcrumb.
    const parts = pathname.split("/");
    const last = parts[parts.length - 1];
    const section = last === cid ? "Home" : last === "Table" ? "People" : last;

    return (
        <div id="wd-courses" className="p-2" style={{ paddingBottom: realFaculty && viewAsStudent ? 64 : undefined }}>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="text-danger m-0">
                    <FaAlignJustify className="me-3 fs-4 mb-1" />
                    {course ? course.name : `Course ${cid}`} &gt; {section}
                </h2>
                {realFaculty && !viewAsStudent && (
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => dispatch(setViewAsStudent(true))}
                    >
                        <FaGlasses className="me-1" /> Student View
                    </Button>
                )}
            </div>
            <hr />
            <div className="d-flex">
                <div className="d-none d-md-block" style={{ minWidth: 200 }}>
                    <CourseNavigation cid={cid} />
                </div>
                <div className="flex-fill ms-3">{children}</div>
            </div>

            {/* Canvas-style Student View bar, fixed at the bottom while previewing. */}
            {realFaculty && viewAsStudent && (
                <div
                    className="position-fixed bottom-0 start-0 end-0 d-flex justify-content-between align-items-center px-4 py-2"
                    style={{ background: "#6c757d", color: "#fff", zIndex: 1050 }}
                >
                    <span>
                        <FaGlasses className="me-2" />
                        You are viewing this course as a student.
                    </span>
                    <Button size="sm" variant="light" onClick={() => dispatch(setViewAsStudent(false))}>
                        Leave Student View
                    </Button>
                </div>
            )}
        </div>
    );
}
