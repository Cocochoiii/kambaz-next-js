'use client';

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
    const pathname = usePathname();

    const links = [
        { href: "/Account",   label: "Account",   icon: FaRegCircleUser },
        { href: "/Dashboard", label: "Dashboard", icon: AiOutlineDashboard },
        { href: "/Calendar",  label: "Calendar",  icon: IoCalendarOutline },
        { href: "/Inbox",     label: "Inbox",     icon: FaInbox },
        { href: "/Labs",      label: "Labs",      icon: LiaBookSolid },
        { href: "/Settings",  label: "Settings",  icon: LiaCogSolid },
    ];

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <ul
            id="wd-kambaz-navigation"
            className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2 text-center"
            style={{ width: 100 }}
        >
            <li className="list-group-item bg-black border-0 text-center" id="wd-neu-link">
                <a href="https://www.northeastern.edu/" target="_blank" rel="noreferrer">
                    <img src="/images/NEU.png" width={80} alt="Northeastern University" />
                </a>
            </li>
            <br />

            {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                    <li
                        key={href}
                        className={`list-group-item border-0 text-center ${
                            active ? "bg-white" : "bg-black"
                        }`}
                    >
                        <Link
                            href={href}
                            className={`text-decoration-none ${active ? "text-danger" : "text-white"}`}
                        >
                            <Icon className={`fs-1 ${active ? "text-danger" : "text-white"}`} />
                            <br />
                            {label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
