"use client";

// The table of contents. It links to every lab, Kambaz, and my GitHub.
// The pill of the page I am on is active.
import { Nav } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TOC() {
  const pathname = usePathname() || "";

  return (
    <Nav variant="pills" id="wd-toc">
      <Nav.Item>
        <Nav.Link href="/Labs" as={Link} id="wd-labs-home-link"
                  active={pathname === "/Labs"}>
          Labs
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Labs/Lab1" as={Link} id="wd-toc-lab1-link"
                  active={pathname.includes("Lab1")}>
          Lab 1
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Labs/Lab2" as={Link} id="wd-toc-lab2-link"
                  active={pathname.includes("Lab2")}>
          Lab 2
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Labs/Lab3" as={Link} id="wd-toc-lab3-link"
                  active={pathname.includes("Lab3")}>
          Lab 3
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Labs/Lab4" as={Link} id="wd-toc-lab4-link"
                  active={pathname.includes("Lab4")}>
          Lab 4
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/" as={Link} id="wd-toc-kambaz-link">Kambaz</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          href="https://github.com/Cocochoiii/kambaz-next-js"
          target="_blank"
          rel="noreferrer"
          id="wd-toc-github-link"
        >
          My GitHub
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
