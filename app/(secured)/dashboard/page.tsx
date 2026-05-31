"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
  );
}
