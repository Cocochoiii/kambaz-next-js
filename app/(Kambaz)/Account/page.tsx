"use client";

// 4.11 When someone opens "/Account" I send them to Profile if they are
// signed in, and to Sign in if they are not.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AccountPage() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const router = useRouter();

  useEffect(() => {
    router.replace(currentUser ? "/Account/Profile" : "/Account/Signin");
  }, [currentUser, router]);

  return null;
}
