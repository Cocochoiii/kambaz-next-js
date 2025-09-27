'use client';
import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WorkingWithLocation() {
  const pathname = usePathname() || "";
  return (
    <Nav variant="pills" id="wd-toc" className="my-2">
      <NavItem><NavLink as={Link} href="/Labs/Lab3" id="wd-a1" active={pathname.endsWith("/Lab3")}> Lab 3 </NavLink></NavItem>
      <NavItem><NavLink as={Link} href="/Labs/Lab3/add/1/2" id="wd-a2" active={pathname.includes("/add/1/2")}> 1 + 2 </NavLink></NavItem>
      <NavItem><NavLink as={Link} href="/Labs/Lab3/add/3/4" id="wd-a3" active={pathname.includes("/add/3/4")}> 3 + 4 </NavLink></NavItem>
      <NavItem><NavLink as={Link} href="/" id="wd-kambaz-link"> Kambaz </NavLink></NavItem>
      <NavItem><NavLink id="wd-github" href="https://github.com/Cocochoiii/kambaz-next-js">GitHub Repository</NavLink></NavItem>
    </Nav>
  );
}
