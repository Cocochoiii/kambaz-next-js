// Who is allowed to change things.
// Faculty and Admin can edit. A Student only reads.
// In Student View a Faculty counts as a student too.
// These are plain functions. The screen reads the store and calls them.

function roleOf(currentUser: any) {
  return currentUser && currentUser.role ? currentUser.role : "";
}

// True for a real Faculty or Admin, even during the preview.
export function isRealFaculty(currentUser: any): boolean {
  const role = roleOf(currentUser);
  return role === "FACULTY" || role === "ADMIN";
}

// True only when the screen should show the editing controls.
export function isFacultyNow(currentUser: any, viewAsStudent: boolean): boolean {
  return isRealFaculty(currentUser) && !viewAsStudent;
}
