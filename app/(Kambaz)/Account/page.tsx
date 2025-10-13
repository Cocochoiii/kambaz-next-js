"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import api from "@/app/lib/api";

/**
 * Decides where /Account should go:
 *  - If session is valid -> /Account/Profile
 *  - Else               -> /Account/Signin
 *
 * We call /users/profile through the same-origin /api proxy and
 * support either POST or GET (whichever your server exposes).
 */
export default function AccountPage() {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                // try POST first
                let res = await api.post("/users/profile").catch(async (err) => {
                    // if POST isn't implemented, fall back to GET
                    if (err?.response?.status === 404 || err?.response?.status === 405) {
                        return await api.get("/users/profile");
                    }
                    throw err;
                });

                if (cancelled) return;
                dispatch(setCurrentUser(res.data));
                router.replace("/Account/Profile");
            } catch {
                if (cancelled) return;
                dispatch(setCurrentUser(null));
                router.replace("/Account/Signin");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [dispatch, router]);

    return null;
}
