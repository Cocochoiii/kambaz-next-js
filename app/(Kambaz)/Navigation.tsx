"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser, FaBook } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Data-driven links. `match` is the path prefix used to highlight the active item.
// Courses links to the Dashboard but stays highlighted while viewing a course.
const links = [
    { href: "/Account",   label: "Account",   icon: FaRegCircleUser,    match: "/Account" },
    { href: "/Dashboard", label: "Dashboard", icon: AiOutlineDashboard, match: "/Dashboard" },
    { href: "/Dashboard", label: "Courses",   icon: FaBook,             match: "/Courses" },
    { href: "/Calendar",  label: "Calendar",  icon: IoCalendarOutline,  match: "/Calendar" },
    { href: "/Inbox",     label: "Inbox",      icon: FaInbox,            match: "/Inbox" },
    { href: "/Labs",      label: "Labs",       icon: LiaBookSolid,       match: "/Labs" },
    { href: "/Settings",  label: "Settings",   icon: LiaCogSolid,        match: "/Settings" },
];

export default function KambazNavigation() {
    const pathname = usePathname();
    const isActive = (m: string) => pathname === m || pathname.startsWith(`${m}/`);

    return (
        <ul
            id="wd-kambaz-navigation"
            className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 text-center"
            style={{ width: 100 }}
        >
            <li className="list-group-item bg-black border-0 text-center" id="wd-neu-link">
                <a href="https://www.northeastern.edu/" target="_blank" rel="noreferrer">
                    <img src="/images/NEU.png" width={75} alt="Northeastern University" />
                </a>
            </li>
            <br />

            {links.map(({ href, label, icon: Icon, match }) => {
                const active = isActive(match);
                // Account shows a white icon; every other item shows a red icon.
                const iconColor = label === "Account" && !active ? "text-white" : "text-danger";
                return (
                    <li
                        key={label}
                        className={`list-group-item border-0 text-center ${active ? "bg-white" : "bg-black"}`}
                    >
                        <Link href={href} className={`text-decoration-none ${active ? "text-danger" : "text-white"}`}>
                            <Icon className={`fs-1 ${iconColor}`} />
                            <br />
                            {label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
