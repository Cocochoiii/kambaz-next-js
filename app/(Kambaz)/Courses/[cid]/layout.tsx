// Layout for one course. I read the course id (cid) from the URL and find the
// course in the Database, so the title shows the real name.
// The course menu is on the left. It hides on a narrow screen.
import type { ReactNode } from "react";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import * as db from "../../Database";

export default async function CoursesLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>) {
  const { cid } = await params;
  const course = db.courses.find((course) => course._id === cid);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course ? course.name : `Course ${cid}`}
        <Breadcrumb />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill ms-3">
          {children}
        </div>
      </div>
    </div>
  );
}
