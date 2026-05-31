"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChefHat } from "lucide-react";

import { Recipe, recipesService } from "@/services/recipes.service";
import { userService } from "@/services/user.service";
import { User } from "@/types/auth";

interface DayCount {
  date: string;
  label: string;
  count: number;
}

function aggregateDaily(recipes: Recipe[]): DayCount[] {
  const counts: Record<string, number> = {};

  for (const recipe of recipes) {
    if (!recipe.createdAt) continue;
    const day = recipe.createdAt.split("T")[0];
    counts[day] = (counts[day] || 0) + 1;
  }

  const today = new Date();
  const days: DayCount[] = [];

  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];

    days.push({
      date: key,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      count: counts[key] || 0,
    });
  }

  return days;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, recipesData] = await Promise.all([
          userService.me(),
          recipesService.all(),
        ]);

        setUser(userData);
        setRecipes(recipesData);
      } catch {
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const chartData = useMemo(() => aggregateDaily(recipes), [recipes]);
  const totalRecipes = recipes.length;
  const weekCount = chartData.slice(-7).reduce((sum, d) => sum + d.count, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {user?.email?.split("@")[0] || "chef"}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <ChefHat className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Recipes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalRecipes}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                This Week
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {weekCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {chartData[chartData.length - 1]?.count ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          Daily Uploads
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Recipes uploaded per day over the last 14 days
        </p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, bottom: 0, left: -16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="stroke-gray-200 dark:stroke-gray-700"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                className="text-gray-500 dark:text-gray-400"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                className="text-gray-500 dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, #fff)",
                  border: "1px solid var(--tooltip-border, #e5e7eb)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "var(--tooltip-color, #111827)",
                }}
                formatter={(value) => [value, "Recipes"]}
                labelFormatter={(label) => label}
                cursor={{ fill: "var(--tooltip-cursor, #f3f4f6)" }}
              />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
                className="fill-blue-600 dark:fill-blue-400"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx>{`
        :global(.recharts-tooltip-wrapper) {
          --tooltip-bg: #fff;
          --tooltip-border: #e5e7eb;
          --tooltip-color: #111827;
          --tooltip-cursor: #f3f4f6;
        }

        :global(.dark .recharts-tooltip-wrapper) {
          --tooltip-bg: #1f2937;
          --tooltip-border: #374151;
          --tooltip-color: #f9fafb;
          --tooltip-cursor: #1f2937;
        }
      `}</style>
    </main>
  );
}
