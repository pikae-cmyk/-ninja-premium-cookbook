const state = {
  favorites: JSON.parse(localStorage.getItem("ninjaFavorites") || "[]"),
  shopping: JSON.parse(localStorage.getItem("ninjaShopping") || "{}"),
  filters: { search: "", country: "all", type: "all", time: "all" }
};

const $ = (selector) => document.querySelector(selector);
const recipeGrid = $("#recipes");
const template = $("#recipeCardTemplate");
const countryFilter = $("#countryFilter");
const typeFilter = $("#typeFilter");
const searchInput = $("#searchInput");
const timeFilter = $("#timeFilter");
const globalPortions = $("#globalPortions");

function save() {
  localStorage.setItem("ninjaFavorites", JSON.stringify(state.favorites));
  localStorage.setItem("ninjaShopping", JSON.stringify(state.shopping));
}

function uniqueValues(key) {
  return ["all", ...new Set(RECIPES.map(recipe => recipe[key]))];
}

function fillSelect(select, values, allLabel) {
  select.innerHTML = values.map(value => `<option value="${value}">${value === "all" ? allLabel : value}</option>`).join("");
}

function formatAmount(amount) {
  if (Number.isInteger(amount)) return amount;
  return String(Math.round(amount * 100) / 100).replace(".", ",");
}

function scaleIngredient(ingredient, recipeServings, targetServings) {
  const scaled = ingredient.amount * (targetServings / recipeServings);
  return { ...ingredient, amount: scaled };
}

function filteredRecipes() {
  return RECIPES.filter(recipe => {
    const text = `${recipe.title} ${recipe.description} ${recipe.tags.join(" ")}`.toLowerCase();
    const matchesSearch = text.includes(state.filters.search.toLowerCase());
    const matchesCountry = state.filters.country === "all" || recipe.country === state.filters.country;
    const matchesType = state.filters.type === "all" || recipe.type === state.filters.type;
    const matchesTime = state.filters.time === "all" || recipe.time <= Number(state.filters.time);
    return matchesSearch && matchesCountry && matchesType && matchesTime;
  });
}

function renderRecipes() {
  const recipes = filteredRecipes();
  recipeGrid.innerHTML = "";

  if (!recipes.length) {
    recipeGrid.innerHTML = `<div class="empty"><strong>Keine Rezepte gefunden.</strong><br>Bitte ändere die Filter oder Suchbegriffe.</div>`;
    updateStats();
    return;
  }

  recipes.forEach(recipe => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".recipe-card");
    const favoriteBtn = node.querySelector(".favorite-btn");
    const shoppingToggle = node.querySelector(".shopping-toggle");
    const portionInput = node.querySelector(".portion-input");
    const selected = state.shopping[recipe.id];

    node.querySelector(".recipe-card__meta").textContent = `${recipe.country} · ${recipe.type} · ${recipe.time} Min.`;
    node.querySelector("h2").textContent = recipe.title;
    node.querySelector(".recipe-card__description").textContent = recipe.description;
    node.querySelector(".chips").innerHTML = recipe.tags.map(tag => `<span class="chip">${tag}</span>`).join("");
    node.querySelector(".recipe-detail").innerHTML = `
      <div><h3>Ninja Einstellung</h3><p>${recipe.setting}</p></div>
      <div><h3>Zutaten für ${recipe.servings} Portionen</h3><ul>${recipe.ingredients.map(item => `<li>${formatAmount(item.amount)} ${item.unit} ${item.name}</li>`).join("")}</ul></div>
      <div><h3>Zubereitung</h3><ol>${recipe.steps.map(step => `<li>${step}</li>`).join("")}</ol></div>
    `;

    favoriteBtn.textContent = state.favorites.includes(recipe.id) ? "♥" : "♡";
    favoriteBtn.classList.toggle("is-active", state.favorites.includes(recipe.id));
    favoriteBtn.addEventListener("click", () => toggleFavorite(recipe.id));

    portionInput.value = selected?.portions || globalPortions.value || recipe.servings;
    shoppingToggle.checked = Boolean(selected);
    shoppingToggle.addEventListener("change", () => {
      if (shoppingToggle.checked) {
        state.shopping[recipe.id] = { portions: Number(portionInput.value) || recipe.servings };
      } else {
        delete state.shopping[recipe.id];
      }
      save();
      renderShoppingList();
      updateStats();
    });
    portionInput.addEventListener("input", () => {
      if (state.shopping[recipe.id]) {
        state.shopping[recipe.id].portions = Number(portionInput.value) || recipe.servings;
        save();
        renderShoppingList();
      }
    });

    recipeGrid.appendChild(node);
  });
  updateStats();
}

function toggleFavorite(id) {
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter(item => item !== id)
    : [...state.favorites, id];
  save();
  renderRecipes();
}

function aggregateShopping() {
  const grouped = new Map();
  Object.entries(state.shopping).forEach(([recipeId, config]) => {
    const recipe = RECIPES.find(item => item.id === recipeId);
    if (!recipe) return;
    recipe.ingredients.forEach(ingredient => {
      const scaled = scaleIngredient(ingredient, recipe.servings, config.portions);
      const key = `${scaled.name}|${scaled.unit}`;
      const current = grouped.get(key) || { name: scaled.name, unit: scaled.unit, amount: 0 };
      current.amount += scaled.amount;
      grouped.set(key, current);
    });
  });
  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function renderShoppingList() {
  const selectedRecipes = $("#selectedRecipes");
  const shoppingList = $("#shoppingList");
  const entries = Object.entries(state.shopping);

  selectedRecipes.innerHTML = entries.length
    ? entries.map(([id, config]) => {
        const recipe = RECIPES.find(item => item.id === id);
        return `<div class="selected-item"><span><strong>${recipe.title}</strong><br>${config.portions} Portionen</span><button data-remove="${id}">Entfernen</button></div>`;
      }).join("")
    : `<div class="selected-item">Noch kein Rezept ausgewählt.</div>`;

  selectedRecipes.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      delete state.shopping[button.dataset.remove];
      save();
      renderRecipes();
      renderShoppingList();
    });
  });

  const ingredients = aggregateShopping();
  shoppingList.innerHTML = ingredients.length
    ? `<h3>Zusammengefasste Zutaten</h3>` + ingredients.map(item => `
      <label class="shopping-item">
        <input type="checkbox" />
        <span>${formatAmount(item.amount)} ${item.unit} ${item.name}</span>
      </label>
    `).join("")
    : `<div class="shopping-item">Die Einkaufsliste ist leer.</div>`;
  updateStats();
}

function updateStats() {
  $("#recipeCount").textContent = filteredRecipes().length;
  $("#favoriteCount").textContent = state.favorites.length;
  $("#shoppingCount").textContent = aggregateShopping().length;
}

function copyShoppingList() {
  const ingredients = aggregateShopping();
  const text = ingredients.map(item => `☐ ${formatAmount(item.amount)} ${item.unit} ${item.name}`).join("\n");
  navigator.clipboard.writeText(text || "Einkaufsliste ist leer.");
  alert("Einkaufsliste wurde kopiert.");
}

function bindEvents() {
  searchInput.addEventListener("input", event => { state.filters.search = event.target.value; renderRecipes(); });
  countryFilter.addEventListener("change", event => { state.filters.country = event.target.value; renderRecipes(); });
  typeFilter.addEventListener("change", event => { state.filters.type = event.target.value; renderRecipes(); });
  timeFilter.addEventListener("change", event => { state.filters.time = event.target.value; renderRecipes(); });
  $("#resetFilters").addEventListener("click", () => {
    state.filters = { search: "", country: "all", type: "all", time: "all" };
    searchInput.value = "";
    countryFilter.value = "all";
    typeFilter.value = "all";
    timeFilter.value = "all";
    renderRecipes();
  });
  $("#openShoppingList").addEventListener("click", () => $("#shoppingDrawer").classList.add("is-open"));
  $("#closeShoppingList").addEventListener("click", () => $("#shoppingDrawer").classList.remove("is-open"));
  $("#copyShoppingList").addEventListener("click", copyShoppingList);
  $("#clearShoppingList").addEventListener("click", () => {
    state.shopping = {};
    save();
    renderRecipes();
    renderShoppingList();
  });
}

function init() {
  fillSelect(countryFilter, uniqueValues("country"), "Alle Länder");
  fillSelect(typeFilter, uniqueValues("type"), "Alle Speisen");
  bindEvents();
  renderRecipes();
  renderShoppingList();
}

init();
