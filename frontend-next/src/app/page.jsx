"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated) {
      if (['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'].includes(user?.role)) {
        router.push("/admin/dashboard");
      } else {
        router.push("/employee/dashboard");
      }
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, user, isLoading, router]);

  return null;
}
