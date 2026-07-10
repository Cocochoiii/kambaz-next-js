"use client";

import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TOC() {
    const pathname = usePathname();
    return (
        <Nav variant="pills" className="flex-column">
            <NavItem><NavLink href="/Labs" as={Link} active={pathname === "/Labs"}>Labs</NavLink></NavItem>
            <NavItem><NavLink href="/Labs/Lab1" as={Link} active={pathname.startsWith("/Labs/Lab1")}>Lab 1</NavLink></NavItem>
            <NavItem><NavLink href="/Labs/Lab2" as={Link} active={pathname.startsWith("/Labs/Lab2")}>Lab 2</NavLink></NavItem>
            <NavItem><NavLink href="/Labs/Lab3" as={Link} active={pathname.startsWith("/Labs/Lab3")}>Lab 3</NavLink></NavItem>
            <NavItem><NavLink href="/Labs/Lab4" as={Link} active={pathname.startsWith("/Labs/Lab4")}>Lab 4</NavLink></NavItem>
            <NavItem><NavLink href="/Labs/Lab5" as={Link} active={pathname.startsWith("/Labs/Lab5")}>Lab 5</NavLink></NavItem>
            <NavItem><NavLink href="/" as={Link}>Kambaz</NavLink></NavItem>
            <NavItem>
                <NavLink id="wd-github" href="https://github.com/Cocochoiii/kambaz-next-js">
                    GitHub Repository
                </NavLink>
            </NavItem>
        </Nav>
    );
}
