// app/Labs/Navigation.tsx
"use client";

import Nav from "react-bootstrap/Nav";
import Link from "next/link";

export default function LabsNavigation() {
    return (
        <Nav variant="pills" className="flex-column">
            <Nav.Item><Nav.Link as={Link} href="/Labs">Labs</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link as={Link} href="/Labs/Lab1">Lab 1</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link as={Link} href="/Labs/Lab2">Lab 2</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link as={Link} href="/Labs/Lab3">Lab 3</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link as={Link} href="/Labs/Lab4">Lab 4</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link as={Link} href="/Labs/Lab5">Lab 5</Nav.Link></Nav.Item>

            <Nav.Item><Nav.Link as={Link} href="/">Kambaz</Nav.Link></Nav.Item>

            {/* External links */}
            <Nav.Item>
                <Nav.Link id="wd-github" href="https://github.com/Cocochoiii/kambaz-next-js" target="_blank">
                    GitHub Repository (UI)
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="https://github.com/Cocochoiii/kambaz-node-server-app" target="_blank">
                    GitHub Repository (Server)
                </Nav.Link>
            </Nav.Item>
        </Nav>
    );
}
