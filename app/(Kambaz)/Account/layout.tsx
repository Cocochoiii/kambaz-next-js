"use client";

import type { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({
                                          children
                                      }: {
    children: ReactNode
}) {
    return (
        <div id="wd-account" className="container-fluid py-3">
            <div className="row align-items-start" style={{ "--bs-gutter-x": "0.5rem" } as any}>
                <aside className="col-12 col-md-3 col-xl-2 pe-md-2">
                <AccountNavigation />
                </aside>
                <main className="col-12 col-md-9 col-xl-6">
                    {children}
                </main>
            </div>
        </div>
    );
}