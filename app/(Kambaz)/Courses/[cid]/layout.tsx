import type { ReactNode } from "react";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "../CourseNavigation";

export default function CoursesLayout({
                                          children,
                                          params,
                                      }: {
    children: ReactNode;
    params: { cid: string };
}) {
    const { cid } = params;

    return (
        <div id="wd-courses" className="p-2">
            <h2 className="text-danger">
                <FaAlignJustify className="me-2 fs-4 mb-1" />
                Course {cid}
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
