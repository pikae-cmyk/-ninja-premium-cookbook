import { normalizeText, uniqueSorted } from "./utils.js?v=25";

export function getFilterOptions(recipes) {
  return {
    countries: uniqueSorted(recipes.map((recipe) => recipe.country)),
    types: uniqueSorted(recipes.map((recipe) => recipe.type)),
    categories: uniqueSorted(recipes.map((recipe) => recipe.category)),
  };
}

export function readFilters(form) {
  const data = new FormData(form);
  return {
    query: normalizeText(data.get("query")),
    country: data.get("country"),
    type: data.get("type"),
    time: Number(data.get("time")) || 0,
    difficulty: data.get("difficulty"),
    vegetarian: data.has("vegetarian"),
    vegan: data.has("vegan"),
    glutenFree: data.has("glutenFree"),
    kids: data.has("kids"),
    mealPrep: data.has("mealPrep"),
    favoritesOnly: data.has("favoritesOnly"),
    category: form.dataset.category || "",
  };
}

export function filterRecipes(recipes, filters, favorites) {
  return recipes.filter((recipe) => {
    const searchText = normalizeText([
      recipe.title,
      recipe.description,
      recipe.country,
      recipe.category,
      recipe.type,
      recipe.tags.join(" "),
    ].join(" "));

    return (
      (!filters.query || searchText.includes(filters.query)) &&
      (!filters.country || recipe.country === filters.country) &&
      (!filters.type || recipe.type === filters.type) &&
      (!filters.category || recipe.category === filters.category) &&
      (!filters.time || recipe.time <= filters.time) &&
      (!filters.difficulty || recipe.difficulty === filters.difficulty) &&
      (!filters.vegetarian || recipe.diet.vegetarian) &&
      (!filters.vegan || recipe.diet.vegan) &&
      (!filters.glutenFree || recipe.diet.glutenFree) &&
      (!filters.kids || recipe.diet.kids) &&
      (!filters.mealPrep || recipe.diet.mealPrep) &&
      (!filters.favoritesOnly || favorites.has(recipe.id))
    );
  });
}
