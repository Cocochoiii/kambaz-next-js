"use client";

import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
    const pathname = usePathname();

    const links = [
        { href: "/Dashboard", label: "Dashboard", icon: AiOutlineDashboard },
        { href: "/Dashboard", label: "Courses", icon: LiaBookSolid }, // Routes to Dashboard as per spec
        { href: "/Calendar", label: "Calendar", icon: IoCalendarOutline },
        { href: "/Inbox", label: "Inbox", icon: FaInbox },
        { href: "/Labs", label: "Labs", icon: LiaBookSolid },
        { href: "/Settings", label: "Settings", icon: LiaCogSolid },
    ];

    const isActive = (href: string, label: string) => {
        if (label === "Courses") {
            return pathname.includes("/Courses/");
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };

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

            {/* Account Link */}
            <li
                className={`list-group-item border-0 text-center ${
                    pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"
                }`}
            >
                <Link
                    href="/Account"
                    className={`text-decoration-none ${pathname.includes("Account") ? "text-danger" : "text-white"}`}
                >
                    <FaRegCircleUser className={`fs-1 ${pathname.includes("Account") ? "text-danger" : "text-white"}`} />
                    <br />
                    Account
                </Link>
            </li>

            {/* Dynamic Links */}
            {links.map((link) => {
                const active = isActive(link.href, link.label);
                const Icon = link.icon;
                return (
                    <li
                        key={link.label}
                        className={`list-group-item border-0 text-center ${
                            active ? "bg-white" : "bg-black"
                        }`}
                    >
                        <Link
                            href={link.href}
                            className={`text-decoration-none ${active ? "text-danger" : "text-white"}`}
                        >
                            <Icon className={`fs-1 ${active ? "text-danger" : "text-white"}`} />
                            <br />
                            {link.label}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}