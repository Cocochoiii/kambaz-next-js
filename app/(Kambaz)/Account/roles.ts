"use client";

// Who is allowed to change things.
// Faculty and Admin can edit. A Student only reads.
// In Student View a Faculty counts as a student too.
import { useSelector } from "react-redux";

function roleOf(currentUser: any) {
  return currentUser && currentUser.role ? currentUser.role : "";
}

// True for a real Faculty or Admin, even during the preview.
export function useIsRealFaculty(): boolean {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const role = roleOf(currentUser);
  return role === "FACULTY" || role === "ADMIN";
}

// True only when the screen should show the editing controls.
export function useIsFaculty(): boolean {
  const { currentUser, viewAsStudent } = useSelector(
    (state: any) => state.accountReducer
  );
  const role = roleOf(currentUser);
  const canEdit = role === "FACULTY" || role === "ADMIN";
  return canEdit && !viewAsStudent;
}
