export async function loadRecipes() {
  const response = await fetch("data/recipes.json?v=26", { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Rezepte konnten nicht geladen werden (${response.status})`);
  }
  const recipes = await response.json();
  return recipes.map(normalizeRecipe);
}

function normalizeRecipe(recipe) {
  return {
    favorite: false,
    ...recipe,
    image: recipe.image || "assets/images/recipe-placeholder.svg",
    tags: recipe.tags ?? [],
    diet: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      kids: false,
      mealPrep: false,
      ...(recipe.diet ?? {}),
    },
  };
}
