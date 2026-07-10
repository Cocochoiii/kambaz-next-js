"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { FaAlignJustify } from "react-icons/fa";
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

    // Gate access: faculty may open any course; students only their enrolled ones.
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
                const enrolled = mine.some((c: any) => c._id === cid);
                if (!active) return;
                if (enrolled) setAccess("ok");
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
        <div id="wd-courses" className="p-2">
            {realFaculty && viewAsStudent && (
                <div className="alert alert-warning d-flex justify-content-between align-items-center py-2">
                    <span>You are viewing this course as a student.</span>
                    <Button size="sm" variant="dark" onClick={() => dispatch(setViewAsStudent(false))}>
                        Leave Student View
                    </Button>
                </div>
            )}

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
                        Student View
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
        </div>
    );
}
