"use client";

// The Account menu.
// Before I sign in it shows Signin and Signup.
// After that it shows Profile and Users.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const pathname = usePathname() || "";
  const links = currentUser ? ["Profile", "Users"] : ["Signin", "Signup"];

  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0" style={{ width: 150 }}>
      {links.map((link) => {
        const href = `/Account/${link}`;
        const active = pathname === href || pathname.includes(`${href}/`);
        return (
          <Link
            key={link}
            href={href}
            id={`wd-account-${link.toLowerCase()}-link`}
            className={`list-group-item border-0 ${active ? "active" : "text-danger"}`}
          >
            {link}
          </Link>
        );
      })}
    </div>
  );
}
