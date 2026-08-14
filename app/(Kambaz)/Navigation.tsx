"use client";

// The Kambaz menu on the left side. The links live in one array.
import { ListGroup } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser, FaBook } from "react-icons/fa6";

const links = [
  { label: "Account",   href: "/Account",   match: "/Account",   icon: FaRegCircleUser },
  { label: "Dashboard", href: "/Dashboard", match: "/Dashboard", icon: AiOutlineDashboard },
  { label: "Courses",   href: "/Dashboard", match: "/Courses",   icon: FaBook },
  { label: "Calendar",  href: "/Calendar",  match: "/Calendar",  icon: IoCalendarOutline },
  { label: "Inbox",     href: "/Inbox",     match: "/Inbox",     icon: FaInbox },
  { label: "Labs",      href: "/Labs",      match: "/Labs",      icon: LiaBookSolid },
  { label: "Settings",  href: "/Settings",  match: "/Settings",  icon: LiaCogSolid },
];

export default function KambazNavigation() {
  const pathname = usePathname() || "";

  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 110 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      <ListGroup.Item
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        rel="noreferrer"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroup.Item>

      {links.map((link) => {
        // The selected item is white with red text. The others are black.
        const active = pathname === link.match || pathname.includes(`${link.match}/`);
        const Icon = link.icon;
        // Only the Account icon is white when it is not selected.
        const iconColor =
          link.label === "Account" && !active ? "text-white" : "text-danger";
        return (
          <ListGroup.Item
            key={link.label}
            className={`border-0 text-center ${active ? "bg-white" : "bg-black"}`}
          >
            <Link
              href={link.href}
              id={`wd-${link.label.toLowerCase()}-link`}
              className={`text-decoration-none ${active ? "text-danger" : "text-white"}`}
            >
              <Icon className={`fs-1 ${iconColor}`} />
              <br />
              {link.label}
            </Link>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
