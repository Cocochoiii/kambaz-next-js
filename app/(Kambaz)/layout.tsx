// app/(Kambaz)/layout.tsx
"use client";

import type { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./Account/ProtectedRoute";
import { usePathname } from "next/navigation";
import "./styles.css";

function KambazContent({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Routes that need protection
    const protectedRoutes = ['/Dashboard', '/Courses', '/Calendar', '/Inbox', '/Settings'];
    const needsProtection = protectedRoutes.some(route => pathname.startsWith(route));

    // Account routes don't need protection (except Profile)
    const isAccountRoute = pathname.startsWith('/Account');
    const isProfileRoute = pathname.startsWith('/Account/Profile');

    return (
        <div id="wd-kambaz">
            <div className="d-flex">
                <div><KambazNavigation /></div>
                <div className="wd-main-content-offset p-3 flex-fill">
                    {needsProtection || isProfileRoute ? (
                        <ProtectedRoute>{children}</ProtectedRoute>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
}

export default function KambazLayout({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <KambazContent>{children}</KambazContent>
        </Provider>
    );
}