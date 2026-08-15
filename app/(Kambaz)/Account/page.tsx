"use client";

// "/Account" goes to Profile, or to Sign in when there is no user.
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
