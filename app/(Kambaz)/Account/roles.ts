"use client";

import { useSelector } from "react-redux";

/**
 * Effective faculty check used across the course screens.
 * Returns false when a faculty member is previewing the course as a student,
 * so every faculty-only control and unpublished item is hidden during preview.
 */
export function useIsFaculty(): boolean {
    const { currentUser, viewAsStudent } = useSelector((s: any) => s.accountReducer);
    const realFaculty = (currentUser?.role ?? "").toString().toUpperCase() === "FACULTY";
    return realFaculty && !viewAsStudent;
}
