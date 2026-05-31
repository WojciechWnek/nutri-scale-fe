"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { Toaster } from "@/components/ui/toaster";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recipes", label: "Recipes" },
  { href: "/upload-pdf", label: "Upload PDF" },
];

export default function SecuredLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-lg font-bold tracking-tight">
              NutriScale
            </Link>
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-transparent px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Sign out
          </button>
        </div>
      </nav>
      {children}
      <Toaster />
    </div>
  );
}
