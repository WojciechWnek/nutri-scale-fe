"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChefHat, FileText, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Recipe, recipesService } from "@/services/recipes.service";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    setDeletingId(id);

    try {
      await recipesService.remove(id);
      setRecipes((current) => current.filter((r) => r.id !== id));
      toast.success("Recipe deleted");
    } catch {
      toast.error("Could not delete recipe.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 pt-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
            Recipes
          </p>
          <h1 className="text-xl font-bold">Available recipes</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={fetchRecipes}
          >
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>
      </div>

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
            <FileText
              className="mx-auto h-12 w-12 text-gray-400"
              aria-hidden="true"
            />
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
              <div
                key={recipe.id || recipe.title}
                className="group cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-800"
              >
                <Link
                  href={recipe.id ? `/recipes/${recipe.id}` : "/recipes"}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
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
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={deletingId === recipe.id}
                      onClick={(e) => handleDelete(e, recipe.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-950 dark:hover:text-red-400 cursor-pointer"
                      aria-label="Delete recipe"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ArrowRight
                      className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
