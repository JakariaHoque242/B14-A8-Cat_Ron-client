"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BookOpen } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-900 border-t-amber-600 rounded-full animate-spin"></div>
          <BookOpen className="w-6 h-6 text-amber-600 absolute animate-pulse" />
        </div>
        <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
          Checking your library pass...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};
