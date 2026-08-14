// A protected screen. Only a signed in user sees it.
import type { ReactNode } from "react";
import ProtectedRoute from "../Account/ProtectedRoute";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
