"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import AccountNavigation from "./Navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import "./account-styles.css";
import api from "@/app/lib/api";

export default function AccountLayout({ children }: { children: ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.post("/users/profile");
                if (!cancelled) dispatch(setCurrentUser(data));
            } catch {
                if (!cancelled) dispatch(setCurrentUser(null));
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [dispatch]);

    return (
        <div id="wd-account" className="container-fluid py-3">
            <div className="row align-items-start" style={{ "--bs-gutter-x": "0.5rem" } as any}>
                <aside className="col-12 col-md-3 col-xl-2 pe-md-2">
                    <AccountNavigation />
                </aside>
                <main className="col-12 col-md-9 col-xl-6">{children}</main>
            </div>
        </div>
    );
}
