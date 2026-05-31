"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChefHat, FileText, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Recipe, recipesService } from "@/services/recipes.service";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await recipesService.all();
      setRecipes(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load recipes.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      <nav className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Recipes
            </p>
            <h1 className="text-xl font-bold">Available recipes</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={fetchRecipes}>
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Refresh
            </Button>
            <Link
              href="/upload-pdf"
              className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-transparent px-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              Upload PDF
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading && (
          <div className="flex min-h-60 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {!isLoading && !error && recipes.length === 0 && (
          <section className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <FileText className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">No recipes yet</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Upload a PDF and parsed recipes will appear here.
            </p>
            <Link
              href="/upload-pdf"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Upload PDF
            </Link>
          </section>
        )}

        {!isLoading && !error && recipes.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id || recipe.title}
                href={recipe.id ? `/recipes/${recipe.id}` : "/recipes"}
                className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                      <ChefHat className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                        {recipe.title}
                      </h2>
                      {recipe.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                          {recipe.description}
                        </p>
                      )}
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                        {recipe.ingredients.length} ingredients
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
