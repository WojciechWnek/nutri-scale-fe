"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import { Button } from "@/components/auth/Button";
import { userService } from "@/services/user.service";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.me();
        setUser(userData);
      } catch {
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <Button onClick={() => router.push("/upload-pdf")} variant="ghost" size="sm">
                Upload PDF
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-5 py-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Welcome, {user?.email}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Email: {user?.email}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2"></p>
          </div>
        </div>
      </main>
    </div>
  );
}
