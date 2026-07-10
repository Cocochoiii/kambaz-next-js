"use client";

import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Labs table of contents. The link for the current page is highlighted (active).
const LINKS = [
    { href: "/Labs", label: "Labs" },
    { href: "/Labs/Lab1", label: "Lab 1" },
    { href: "/Labs/Lab2", label: "Lab 2" },
    { href: "/Labs/Lab3", label: "Lab 3" },
    { href: "/", label: "Kambaz" },
];

export default function TOC() {
    const pathname = usePathname();
    const isActive = (href: string) =>
        href === "/Labs" ? pathname === "/Labs"
            : href === "/" ? false
                : pathname.startsWith(href);

    return (
        <Nav variant="pills" className="flex-column">
            {LINKS.map(({ href, label }) => (
                <NavItem key={href}>
                    <NavLink as={Link} href={href} active={isActive(href)}>
                        {label}
                    </NavLink>
                </NavItem>
            ))}
            <NavItem>
                <NavLink id="wd-github" href="https://github.com/Cocochoiii/kambaz-next-js">
                    GitHub Repository
                </NavLink>
            </NavItem>
        </Nav>
    );
}
