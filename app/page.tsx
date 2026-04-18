import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Utensils, Activity, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Nutri Scale
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/signin"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "hidden sm:inline-flex"
              )}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-4 pt-32 pb-24 md:px-8 md:pt-48 md:pb-32 text-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 mb-8 border border-blue-200 dark:border-blue-800/50">
            A new way to control your diet
          </div>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl md:text-7xl">
            Your personal <br className="hidden sm:block" />
            <span className="text-blue-600 dark:text-blue-500">
              nutrition assistant
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed sm:text-xl">
            Track your macronutrients, control your weight, and achieve your dietary goals 
            with ease. Nutri Scale is an app that makes taking care of your health an everyday habit.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "lg", variant: "default" }), "w-full sm:w-auto gap-2")}
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signin"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "w-full sm:w-auto")}
            >
              I already have an account
            </Link>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="container mx-auto px-4 py-24 md:px-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="grid gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Achieve your goals
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Set your calorie needs and easily fulfill your assumed plan, 
                whether you want to lose weight or gain muscle mass.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                <Utensils className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Count calories
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Quickly and conveniently add meals, tracking your macronutrients 
                and daily balance in detail.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Analyze your progress
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Clear charts and statistics will help you track weight changes 
                and stay motivated at all times.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} Nutri Scale. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
