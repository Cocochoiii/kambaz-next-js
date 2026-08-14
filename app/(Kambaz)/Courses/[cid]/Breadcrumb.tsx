"use client";

// The breadcrumb after the course name, like "> Modules".
// The URL is /Courses/<cid>/<section>, so I take the third part.
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname() || "";
  const parts = pathname.split("/").filter((part) => part !== "");

  // parts is ["Courses", "5610", "Modules"], so I want parts[2].
  const section = parts[2];
  if (!section) { return null; }

  return <span> &gt; {section}</span>;
}
