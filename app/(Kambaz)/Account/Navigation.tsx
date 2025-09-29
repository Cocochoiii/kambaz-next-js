"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
    const pathname = usePathname();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    // Show different links based on whether user is signed in
    const links = currentUser ? ["Profile"] : ["Signin", "Signup"];

    const Item = ({
                      href,
                      label,
                  }: {
        href: string;
        label: string;
    }) => {
        const active = pathname?.startsWith(href);
        return (
            <Link
                href={href}
                className={`d-block mb-3 text-decoration-none ${
                    active ? "text-dark fw-semibold" : "text-danger"
                }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav id="wd-account-nav" aria-label="Account">
            {links.map((link) => (
                <Item
                    key={link}
                    href={`/Account/${link}`}
                    label={link}
                />
            ))}
        </nav>
    );
}