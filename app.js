import { createFavoritesStore } from "./modules/favorites.js?v=26";
import { filterRecipes, getFilterOptions, readFilters } from "./modules/filters.js?v=26";
import { downloadShoppingPdf } from "./modules/pdf.js?v=26";
import { loadRecipes } from "./modules/recipes.js?v=26";
import { createShoppingStore } from "./modules/shopping.js?v=26";
import { $, $$, createElement } from "./modules/utils.js?v=26";

const selectors = {
  form: "[data-filter-form]",
  grid: "[data-recipes-grid]",
  template: "#recipe-card-template",
  resultCount: "[data-result-count]",
  empty: "[data-empty-state]",
  categoryStrip: "[data-category-strip]",
  favoritesList: "[data-favorites-list]",
  shoppingList: "[data-shopping-list]",
  shoppingExportStatus: "[data-shopping-export-status]",
};

async function init() {
  const recipes = await loadRecipes();
  const state = {
    recipes,
    visibleRecipes: recipes,
    servings: Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe.servings])),
  };

  const favorites = createFavoritesStore(() => {
    renderAll(state, favorites, shopping);
  });
  const shopping = createShoppingStore(() => {
    renderAll(state, favorites, shopping);
  });

  setupFilterOptions(recipes);
  setupCategoryStrip(recipes);
  bindShellEvents(state, favorites, shopping);
  renderAll(state, favorites, shopping);
  registerServiceWorker();
}

function setupFilterOptions(recipes) {
  const options = getFilterOptions(recipes);
  fillSelect($(`${selectors.form} select[name="country"]`), options.countries);
  fillSelect($(`${selectors.form} select[name="type"]`), options.types);
}

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = createElement("option", "", value);
    option.value = value;
    select.append(option);
  });
}

function setupCategoryStrip(recipes) {
  const { categories } = getFilterOptions(recipes);
  const strip = $(selectors.categoryStrip);
  strip.append(createCategoryButton("Alle", ""));
  categories.forEach((category) => strip.append(createCategoryButton(category, category)));
}

function createCategoryButton(label, value) {
  const button = createElement("button", "category-chip", label);
  button.type = "button";
  button.dataset.category = value;
  return button;
}

function bindShellEvents(state, favorites, shopping) {
  const form = $(selectors.form);

  form.addEventListener("input", () => renderAll(state, favorites, shopping));
  form.addEventListener("reset", () => {
    form.dataset.category = "";
    setTimeout(() => renderAll(state, favorites, shopping), 0);
  });

  $(selectors.categoryStrip).addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    form.dataset.category = button.dataset.category;
    renderAll(state, favorites, shopping);
  });

  $$("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      $(button.dataset.scrollTarget)?.scrollIntoView({ behavior: "smooth" });
    });
  });

  $("[data-open-favorites]").addEventListener("click", () => openDrawer("favorites"));
  $("[data-open-shopping]").addEventListener("click", () => openDrawer("shopping"));
  $$("[data-close-drawer]").forEach((button) => {
    button.addEventListener("click", () => closeDrawer(button.closest("[data-drawer]")));
  });
  $$("[data-drawer]").forEach((drawer) => {
    drawer.addEventListener("click", (event) => {
      if (event.target === drawer) closeDrawer(drawer);
    });
  });

  $("[data-show-favorites-only]").addEventListener("click", () => {
    form.elements.favoritesOnly.checked = true;
    closeDrawer($("[data-drawer='favorites']"));
    renderAll(state, favorites, shopping);
    $("#recipes").scrollIntoView({ behavior: "smooth" });
  });

  $("[data-clear-favorites]").addEventListener("click", () => favorites.clear());
  $("[data-clear-shopping]").addEventListener("click", () => shopping.clear());
  $("[data-print-shopping]").addEventListener("click", () => {
    const exportInfo = downloadShoppingPdf(shopping.combinedItems(state.recipes));
    if (exportInfo) {
      renderShoppingExportStatus(exportInfo);
    }
  });
}

function renderAll(state, favorites, shopping) {
  const filters = readFilters($(selectors.form));
  state.visibleRecipes = filterRecipes(state.recipes, filters, favorites);
  renderCategoryState(filters.category);
  renderRecipes(state, favorites, shopping);
  renderCounters(state, favorites, shopping);
  renderFavoritesList(state, favorites);
  renderShoppingList(state, shopping);
}

function renderCategoryState(activeCategory) {
  $$("[data-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.category === activeCategory);
  });
}

function renderRecipes(state, favorites, shopping) {
  const recipes = state.visibleRecipes;
  const grid = $(selectors.grid);
  const template = $(selectors.template);
  grid.replaceChildren();

  recipes.forEach((recipe) => {
    const fragment = template.content.cloneNode(true);
    const card = $(".recipe-card", fragment);
    const image = $(".recipe-image", fragment);
    const heart = $(".heart-button", fragment);
    const details = $(".recipe-details", fragment);
    const detailsButton = $("[data-toggle-details]", fragment);
    const shoppingCheckbox = $("[data-shopping-toggle]", fragment);
    const servingsInput = $("[data-recipe-servings]", fragment);

    image.alt = recipe.title;
    image.addEventListener("error", () => {
      image.src = recipe.fallbackImage || "assets/images/premium-food-realistic.png";
    }, { once: true });
    image.src = recipe.image;
    $("h3", fragment).textContent = recipe.title;
    $(".difficulty-badge", fragment).textContent = recipe.difficulty;
    $("[data-time]", fragment).textContent = `${recipe.time} Min.`;
    $("[data-servings]", fragment).textContent = recipe.servings;
    $("[data-country]", fragment).textContent = recipe.country;
    $("[data-tip]", fragment).textContent = recipe.tip;
    servingsInput.value = shopping.recipeServings(recipe.id, state.servings[recipe.id] ?? recipe.servings);

    renderTags($(".tag-row", fragment), recipe.tags);
    renderSteps($("[data-steps]", fragment), recipe.preparationSteps ?? recipe.steps);
    renderIngredients($("[data-ingredients]", fragment), recipe, Number(servingsInput.value));
    renderDeviceGuide($("[data-device]", fragment), $("[data-device-steps]", fragment), recipe.device);
    renderNutrition($("[data-nutrition]", fragment), recipe.nutrition);

    setHeartState(heart, favorites.has(recipe.id));
    shoppingCheckbox.checked = shopping.hasRecipe(recipe.id);

    heart.addEventListener("click", () => {
      setHeartState(heart, favorites.toggle(recipe.id));
    });

    detailsButton.addEventListener("click", () => {
      const isHidden = details.hidden;
      details.hidden = !isHidden;
      detailsButton.textContent = isHidden ? "Zubereitung ausblenden" : "Zubereitung anzeigen";
    });

    const updateServings = () => {
      if (servingsInput.dataset.replaceNext === "true" && servingsInput.value.length > 1) {
        servingsInput.value = servingsInput.value.slice(-1);
        servingsInput.dataset.replaceNext = "false";
      }
      const servings = clampServings(Number(servingsInput.value) || recipe.servings);
      servingsInput.value = servings;
      state.servings[recipe.id] = servings;
      renderIngredients($("[data-ingredients]", card), recipe, servings);
      if (shopping.hasRecipe(recipe.id)) {
        shopping.updateRecipeServings(recipe.id, servings);
      }
    };

    servingsInput.addEventListener("input", updateServings);
    servingsInput.addEventListener("focus", () => {
      servingsInput.dataset.replaceNext = "true";
      servingsInput.select();
    });
    servingsInput.addEventListener("keydown", (event) => {
      if (servingsInput.dataset.replaceNext !== "true" || !/^[0-9]$/.test(event.key)) return;
      event.preventDefault();
      servingsInput.dataset.replaceNext = "false";
      servingsInput.value = event.key;
      updateServings();
    });

    shoppingCheckbox.addEventListener("change", () => {
      shopping.toggleRecipe(recipe.id, clampServings(Number(servingsInput.value) || recipe.servings));
    });

    card.dataset.recipeId = recipe.id;
    grid.append(fragment);
  });

  $(selectors.empty).hidden = recipes.length > 0;
  $(selectors.resultCount).textContent = `${recipes.length} Rezepte`;
}

function renderTags(container, tags) {
  container.replaceChildren(...tags.slice(0, 4).map((tag) => createElement("span", "", tag)));
}

function renderSteps(container, steps) {
  container.replaceChildren(...steps.map((step) => createElement("li", "", step)));
}

function renderIngredients(container, recipe, selectedServings) {
  const factor = selectedServings / recipe.servings;
  container.replaceChildren(
    ...recipe.ingredients.map((ingredient) =>
      createElement("li", "", `${formatScaledAmount(ingredient.amount * factor)} ${ingredient.unit} ${ingredient.name}`.trim()),
    ),
  );
}

function formatScaledAmount(value) {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return value.toLocaleString("de-DE", { maximumFractionDigits: 1 });
}

function clampServings(value) {
  return Math.min(12, Math.max(1, Math.round(value)));
}

function renderDeviceGuide(metaContainer, stepsContainer, device) {
  metaContainer.replaceChildren();
  const rows = {
    Geraet: device?.name,
    Programm: device?.program,
    Temperatur: device?.temperature,
    Zeit: device?.time,
    Einsatz: device?.accessory,
  };
  Object.entries(rows).forEach(([key, value]) => {
    if (!value) return;
    metaContainer.append(createElement("dt", "", key), createElement("dd", "", value));
  });
  stepsContainer.replaceChildren(...(device?.steps ?? []).map((step) => createElement("li", "", step)));
}

function renderNutrition(container, nutrition) {
  container.replaceChildren();
  Object.entries(nutrition).forEach(([key, value]) => {
    container.append(createElement("dt", "", key), createElement("dd", "", value));
  });
}

function setHeartState(button, isActive) {
  button.classList.toggle("is-active", isActive);
  button.setAttribute("aria-pressed", String(isActive));
  button.textContent = isActive ? "♥" : "♡";
}

function renderCounters(state, favorites, shopping) {
  $$("[data-favorites-count], [data-stat-favorites]").forEach((node) => {
    node.textContent = favorites.count();
  });
  $$("[data-shopping-count]").forEach((node) => {
    node.textContent = shopping.count();
  });
  $("[data-stat-recipes]").textContent = state.recipes.length;
  $("[data-stat-shopping]").textContent = shopping.combinedItems(state.recipes).length;
}

function renderFavoritesList(state, favorites) {
  const favoriteRecipes = state.recipes.filter((recipe) => favorites.has(recipe.id));
  const list = $(selectors.favoritesList);

  if (!favoriteRecipes.length) {
    list.replaceChildren(createElement("p", "empty-state", "Noch keine Favoriten gespeichert."));
    return;
  }

  list.replaceChildren(
    ...favoriteRecipes.map((recipe) => {
      const item = createElement("article", "drawer-item");
      item.append(
        createElement("strong", "", recipe.title),
        createElement("span", "", `${recipe.country} · ${recipe.time} Min. · ${recipe.difficulty}`),
      );
      return item;
    }),
  );
}

function renderShoppingList(state, shopping) {
  const items = shopping.combinedItems(state.recipes);
  const list = $(selectors.shoppingList);

  if (!items.length) {
    $(selectors.shoppingExportStatus).replaceChildren();
    list.replaceChildren(createElement("p", "empty-state", "Noch keine Zutaten auf der Einkaufsliste."));
    return;
  }

  list.replaceChildren(
    ...items.map((item) => {
      const label = createElement("label", "shopping-item");
      const checkbox = document.createElement("input");
      const text = createElement("span");
      const title = createElement("strong", "", `${item.amountLabel} ${item.name}`.trim());
      checkbox.type = "checkbox";
      checkbox.checked = shopping.isChecked(item.key);
      label.classList.toggle("is-done", checkbox.checked);
      checkbox.addEventListener("change", () => shopping.toggleChecked(item.key));
      text.append(title);
      label.append(checkbox, text);
      return label;
    }),
  );
}

function renderShoppingExportStatus({ fileName, url }) {
  const status = $(selectors.shoppingExportStatus);
  const link = createElement("a", "", fileName);
  link.href = url;
  link.download = fileName;
  status.replaceChildren("PDF erstellt: ", link);
}

function openDrawer(name) {
  const drawer = $(`[data-drawer="${name}"]`);
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeDrawer(drawer) {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }
}

init().catch((error) => {
  $(selectors.resultCount).textContent = "Rezepte konnten nicht geladen werden.";
  $(selectors.empty).hidden = false;
  $(selectors.empty).textContent = error.message;
});
