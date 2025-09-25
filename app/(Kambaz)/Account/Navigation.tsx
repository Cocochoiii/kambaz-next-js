"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNavigation() {
    const pathname = usePathname();
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
            <Item href="/Account/Signin" label="Signin" />
            <Item href="/Account/Signup" label="Signup" />
            <Item href="/Account/Profile" label="Profile" />
        </nav>
    );
}
