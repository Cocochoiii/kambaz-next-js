"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

// Runs once on load: asks the server who the current user is (session cookie).
// This is what keeps the user logged in after a browser reload.
export default function Session({ children }: { children: any }) {
    const [pending, setPending] = useState(true);
    const dispatch = useDispatch();
    const fetchProfile = async () => {
        try {
            const currentUser = await client.profile();
            dispatch(setCurrentUser(currentUser));
        } catch (err) {
            // no active session; stay logged out
        }
        setPending(false);
    };
    useEffect(() => {
        fetchProfile();
    }, []);
    if (pending) {
        return null;
    }
    return children;
}
