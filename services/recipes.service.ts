import { endpoints } from "@/config/endpoints";
import { del, get } from "@/lib/http";

type ApiRecord = Record<string, unknown>;

export interface RecipeIngredient {
  id?: string;
  name: string;
  quantity?: string;
  unit?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  createdAt?: string;
}

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringFrom(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function textFrom(value: unknown): string | undefined {
  const text = stringFrom(value);

  if (!text || /^\d+$/.test(text.trim())) {
    return undefined;
  }

  return text;
}

function pickString(record: ApiRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = stringFrom(record[key]);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function pickText(record: ApiRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = textFrom(record[key]);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function pickNestedString(record: ApiRecord, parentKeys: string[], childKeys: string[]) {
  for (const parentKey of parentKeys) {
    const parent = record[parentKey];

    if (!isRecord(parent)) {
      continue;
    }

    const value = pickString(parent, childKeys);

    if (value) {
      return value;
    }
  }

  return undefined;
}

function normalizeIngredient(value: unknown, index: number): RecipeIngredient {
  if (typeof value === "string") {
    return { id: String(index), name: value };
  }

  if (!isRecord(value)) {
    return { id: String(index), name: "Ingredient" };
  }

  const quantity = pickString(value, ["quantity", "amount", "value"]);
  const unit = pickString(value, ["unit", "measure"]);
  const nestedName = pickNestedString(
    value,
    ["ingredient", "product", "food", "item"],
    ["name", "productName", "ingredientName", "title", "label"],
  );

  return {
    id: pickString(value, ["id", "_id", "ingredientId"]) || String(index),
    name: pickString(value, [
      "name",
      "ingredient",
      "product",
      "productName",
      "ingredientName",
      "title",
      "label",
    ]) || nestedName || "Ingredient",
    quantity,
    unit,
  };
}

function normalizeInstructions(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => Boolean(textFrom(line)));
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (isRecord(item)) {
          const nestedText = pickNestedString(
            item,
            ["instruction", "step", "direction"],
            ["text", "content", "description"],
          );

          return pickText(item, [
            "instruction",
            "text",
            "content",
            "description",
            "direction",
            "details",
            "step",
          ]) || nestedText;
        }

        return undefined;
      })
      .filter((item): item is string => Boolean(item));
  }

  return [];
}

function normalizeRecipe(value: unknown): Recipe {
  if (!isRecord(value)) {
    return {
      id: "",
      title: "Recipe",
      ingredients: [],
      instructions: [],
    };
  }

  const ingredientsValue = value.ingredients || value.recipeIngredients;
  const ingredients = Array.isArray(ingredientsValue)
    ? ingredientsValue.map(normalizeIngredient)
    : [];

  return {
    id: pickString(value, ["id", "_id", "uuid"]) || "",
    title: pickString(value, ["title", "name", "recipeName"]) || "Untitled recipe",
    description: pickString(value, ["description", "summary"]),
    ingredients,
    instructions: normalizeInstructions(value.instructions || value.steps || value.method),
    servings: pickString(value, ["servings", "portions"]),
    prepTime: pickString(value, ["prepTime", "preparationTime"]),
    cookTime: pickString(value, ["cookTime", "cookingTime"]),
    createdAt: pickString(value, ["createdAt", "created_at"]),
  };
}

function extractRecipeArray(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!isRecord(data)) {
    return [];
  }

  const candidates = [data.recipes, data.items, data.results, data.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }

    if (isRecord(candidate)) {
      const nested = [candidate.recipes, candidate.items, candidate.results];
      const nestedArray = nested.find(Array.isArray);

      if (nestedArray) {
        return nestedArray;
      }
    }
  }

  return [];
}

export const recipesService = {
  async all(): Promise<Recipe[]> {
    const data = await get<unknown>(endpoints.recipes.all);
    return extractRecipeArray(data).map(normalizeRecipe);
  },

  async single(id: string): Promise<Recipe> {
    const data = await get<unknown>(endpoints.recipes.single(id));

    if (isRecord(data) && isRecord(data.recipe)) {
      return normalizeRecipe(data.recipe);
    }

    if (isRecord(data) && isRecord(data.data)) {
      return normalizeRecipe(data.data);
    }

    return normalizeRecipe(data);
  },

  async remove(id: string): Promise<void> {
    await del(endpoints.recipes.delete(id));
  },
};
