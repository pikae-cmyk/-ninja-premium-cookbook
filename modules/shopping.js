import { readStorage, writeStorage } from "./storage.js?v=25";
import { formatAmount, normalizeText } from "./utils.js?v=25";

const SHOPPING_KEY = "shopping";
const CHECKED_KEY = "shopping-checked";

function ingredientKey(ingredient) {
  return `${normalizeText(ingredient.name)}::${normalizeText(ingredient.unit)}`;
}

export function createShoppingStore(onChange = () => {}) {
  let entries = normalizeEntries(readStorage(SHOPPING_KEY, {}));
  let checked = new Set(readStorage(CHECKED_KEY, []));

  function persist() {
    writeStorage(SHOPPING_KEY, entries);
    writeStorage(CHECKED_KEY, [...checked]);
    onChange();
  }

  return {
    recipeIds() {
      return Object.keys(entries);
    },
    count() {
      return Object.keys(entries).length;
    },
    hasRecipe(id) {
      return Boolean(entries[id]);
    },
    recipeServings(id, fallback) {
      return entries[id] ?? fallback;
    },
    addRecipe(id, servings) {
      entries[id] = servings;
      persist();
    },
    removeRecipe(id) {
      delete entries[id];
      persist();
    },
    updateRecipeServings(id, servings) {
      if (!entries[id]) return;
      entries[id] = servings;
      persist();
    },
    toggleRecipe(id, servings) {
      if (entries[id]) {
        delete entries[id];
      } else {
        entries[id] = servings;
      }
      persist();
      return Boolean(entries[id]);
    },
    clear() {
      entries = {};
      checked = new Set();
      persist();
    },
    toggleChecked(key) {
      if (checked.has(key)) {
        checked.delete(key);
      } else {
        checked.add(key);
      }
      persist();
    },
    isChecked(key) {
      return checked.has(key);
    },
    combinedItems(recipes) {
      const byKey = new Map();
      Object.entries(entries).forEach(([id, selectedServings]) => {
        const recipe = recipes.find((item) => item.id === id);
        if (!recipe) return;
        const factor = Number(selectedServings) / Number(recipe.servings);

        recipe.ingredients.forEach((ingredient) => {
          const key = ingredientKey(ingredient);
          const current = byKey.get(key) ?? {
            key,
            name: ingredient.name,
            unit: ingredient.unit,
            amount: 0,
            sources: new Set(),
          };
          current.amount += Number(ingredient.amount) * factor;
          current.sources.add(recipe.title);
          byKey.set(key, current);
        });
      });

      return [...byKey.values()]
        .map((item) => ({
          ...item,
          amountLabel: `${formatAmount(item.amount)} ${item.unit}`.trim(),
          sources: [...item.sources].sort((a, b) => a.localeCompare(b, "de")),
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "de"));
    },
  };
}

function normalizeEntries(value) {
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((id) => [id, 2]));
  }
  return value && typeof value === "object" ? value : {};
}
