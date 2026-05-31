"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ChefHat, Clock, ListChecks, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { UndoDeleteToast } from "@/components/undo-toast";
import { Recipe, recipesService } from "@/services/recipes.service";

export default function RecipeDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkedIngredients, setCheckedIngredients] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await recipesService.single(params.id);
        setRecipe(data);
        setCheckedIngredients(new Set());
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Could not load recipe.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    let deleted = false;

    toast.custom(
      (t) => (
        <UndoDeleteToast
          message="Recipe deleted"
          onUndo={() => {
            setIsDeleting(false);
            toast.dismiss(t);
          }}
          onExpire={async () => {
            if (deleted) return;
            deleted = true;

            try {
              await recipesService.remove(params.id);
              toast.dismiss(t);
              router.push("/recipes");
            } catch {
              setIsDeleting(false);
              toast.error("Could not delete recipe.");
            }
          }}
        />
      ),
      { duration: Infinity },
    );
  };

  const toggleIngredient = (ingredientKey: string) => {
    setCheckedIngredients((current) => {
      const next = new Set(current);

      if (next.has(ingredientKey)) {
        next.delete(ingredientKey);
      } else {
        next.add(ingredientKey);
      }

      return next;
    });
  };

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/recipes"
          className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Recipes
        </Link>
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

        {!isLoading && !error && recipe && (
          <article className="space-y-6">
            <header className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  <ChefHat className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold">{recipe.title}</h1>
                  {recipe.description && (
                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {recipe.description}
                    </p>
                  )}
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {recipe.servings && (
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-4 w-4" aria-hidden="true" />
                          {recipe.servings}
                        </span>
                      )}
                      {recipe.prepTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          Prep: {recipe.prepTime}
                        </span>
                      )}
                      {recipe.cookTime && (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          Cook: {recipe.cookTime}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="text-lg font-semibold">Ingredients</h2>
                {recipe.ingredients.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {recipe.ingredients.map((ingredient, index) => {
                      const ingredientKey =
                        ingredient.id || `${ingredient.name}-${index}`;
                      const isChecked = checkedIngredients.has(ingredientKey);

                      return (
                        <li
                          key={ingredientKey}
                          className={`rounded-md border px-3 py-2 text-sm transition-colors duration-200 ${
                            isChecked
                              ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                              : "border-gray-200 bg-gray-50 hover:border-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-800"
                          }`}
                        >
                          <label className="flex cursor-pointer items-center gap-3 group">
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-200 ${
                                isChecked
                                  ? "border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400"
                                  : "border-gray-300 bg-white group-hover:border-blue-400 dark:border-gray-600 dark:bg-gray-800 dark:group-hover:border-blue-500"
                              }`}
                            >
                              <span
                                className={`transition-transform duration-200 ${
                                  isChecked ? "scale-100" : "scale-0"
                                }`}
                              >
                                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleIngredient(ingredientKey)}
                              className="sr-only"
                            />
                            <span className="min-w-0">
                              <span
                                className={`font-medium transition-colors duration-200 ${
                                  isChecked ? "text-gray-500 line-through dark:text-gray-500" : ""
                                }`}
                              >
                                {ingredient.name}
                              </span>
                              {(ingredient.quantity || ingredient.unit) && (
                                <span
                                  className={`ml-2 transition-colors duration-200 ${
                                    isChecked
                                      ? "text-gray-400 dark:text-gray-500"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {ingredient.quantity} {ingredient.unit}
                                </span>
                              )}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    No ingredients available.
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="flex items-center text-lg font-semibold">
                  <ListChecks className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  Instructions
                </h2>
                {recipe.instructions.length > 0 ? (
                  <ol className="mt-4 space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={`${index}-${instruction}`} className="flex gap-3 text-sm leading-6">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    No instructions available.
                  </p>
                )}
              </div>
            </section>
          </article>
        )}
      </main>
    </>
  );
}
