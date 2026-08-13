"use client";

// The table of contents. Now it uses Bootstrap pills.
// It links to every lab, back to Kambaz, and to my GitHub repository.
// I need "use client" because React Bootstrap uses React context.
import { Nav } from "react-bootstrap";
import Link from "next/link";

export default function TOC() {
  return (
    <Nav variant="pills" id="wd-toc">
      <Nav.Item>
        <Nav.Link href="/Labs" as={Link} id="wd-labs-home-link">Labs</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Labs/Lab1" as={Link} id="wd-toc-lab1-link">Lab 1</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Labs/Lab2" as={Link} id="wd-toc-lab2-link">Lab 2</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/Labs/Lab3" as={Link} id="wd-toc-lab3-link">Lab 3</Nav.Link>
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
