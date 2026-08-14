"use client";

// Protecting routes.
// No user means go to the Sign in screen.
// The Dashboard and the Courses routes use this.
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/Account/Signin");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }
  return <>{children}</>;
}
