"use client";

// Working with location. In Next.js the hook is usePathname instead of
// useLocation, but it does the same thing: it gives me the current URL so
// I can highlight the pill of the page I am on.
// The two middle pills encode the path parameters for the add exercise.
// I need "use client" because usePathname and React Bootstrap run in the browser.
import { Nav } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WorkingWithLocation() {
  const pathname = usePathname() ?? "";

  return (
    <div id="wd-working-with-location">
      <h4>Working with Location</h4>
      <Nav variant="pills" id="wd-location-toc" className="mb-3">
        <Nav.Item>
          <Nav.Link as={Link} href="/Labs/Lab3" id="wd-lab3-pill"
                    active={pathname.endsWith("/Lab3")}>
            Lab 3
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href="/Labs/Lab3/add/1/2" id="wd-add-1-2"
                    active={pathname.includes("/add/1/2")}>
            1 + 2
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} href="/Labs/Lab3/add/3/4" id="wd-add-3-4"
                    active={pathname.includes("/add/3/4")}>
            3 + 4
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}
