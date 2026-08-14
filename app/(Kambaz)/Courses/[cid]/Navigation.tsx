"use client";

// The menu for one course. I build it from an array.
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = ["Home", "Modules", "Announcements", "Piazza", "Zoom",
               "Assignments", "Quizzes", "Grades", "People"];

export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname() || "";

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0" style={{ width: 150 }}>
      {links.map((link) => {
        // The People table lives one folder deeper.
        const href = link === "People"
          ? `/Courses/${cid}/People/Table`
          : `/Courses/${cid}/${link}`;
        const active = pathname === href || pathname.includes(`${href}/`);
        return (
          <Link
            key={link}
            href={href}
            id={`wd-course-${link.toLowerCase()}-link`}
            className={`list-group-item border-0 ${active ? "active" : "text-danger"}`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
