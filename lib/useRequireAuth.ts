"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth";

export function useRequireAuth() {
  const router = useRouter();

  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();

    if (!stored) {
      router.replace("/login");
      return;
    }

    setUser(stored);
    setLoading(false);
  }, [router]);

  return {
    user,
    loading,
  };
}