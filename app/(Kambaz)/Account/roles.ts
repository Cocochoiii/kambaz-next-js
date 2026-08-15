"use client";

// Who is allowed to change things.
// Faculty and Admin can edit. A Student only reads.
// In Student View a Faculty counts as a student too.
import { useSelector } from "react-redux";

function roleOf(currentUser: any) {
  return currentUser && currentUser.role ? currentUser.role : "";
}

// The two plain functions. A screen that already reads the store
// can call these without another hook.
export function isRealFaculty(currentUser: any): boolean {
  const role = roleOf(currentUser);
  return role === "FACULTY" || role === "ADMIN";
}

export function isFacultyNow(currentUser: any, viewAsStudent: boolean): boolean {
  return isRealFaculty(currentUser) && !viewAsStudent;
}

// The two hooks. They read the store for me, so a screen only
// needs one line. Both shapes give the same answer.
export function useIsRealFaculty(): boolean {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  return isRealFaculty(currentUser);
}

export function useIsFaculty(): boolean {
  const { currentUser, viewAsStudent } = useSelector(
    (state: any) => state.accountReducer
  );
  return isFacultyNow(currentUser, viewAsStudent);
}
