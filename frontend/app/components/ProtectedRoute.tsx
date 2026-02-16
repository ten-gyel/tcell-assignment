"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: Array<"Admin" | "Manager" | "Member" | "Viewer">;
}) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login");
      return;
    }

    if (!loading && roles && user && !roles.includes(user.role)) {
      router.replace("/dashboard");
    }
  }, [loading, token, user, roles, router]);

  if (loading || (!token && pathname !== "/login")) {
    return <div className="p-8 text-center text-slate-600">Loading...</div>;
  }

  return <>{children}</>;
}
