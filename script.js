const STORAGE_VERSION = '2.0';
const FAVORITE_KEY = 'ninjaFavorites_v2';
const SHOPPING_KEY = 'ninjaShopping_v2';

function safeJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const state = {
  favorites: new Set(Array.isArray(safeJson(FAVORITE_KEY, [])) ? safeJson(FAVORITE_KEY, []) : []),
  shopping: safeJson(SHOPPING_KEY, {}),
  showFavoritesOnly: false
};

const els = {
  grid: document.getElementById('recipes'),
  template: document.getElementById('recipeCardTemplate'),
  search: document.getElementById('searchInput'),
  country: document.getElementById('countryFilter'),
  type: document.getElementById('typeFilter'),
  time: document.getElementById('timeFilter'),
  reset: document.getElementById('resetFilters'),
  recipeCount: document.getElementById('recipeCount'),
  favoriteCount: document.getElementById('favoriteCount'),
  shoppingCount: document.getElementById('shoppingCount'),
  drawer: document.getElementById('shoppingDrawer'),
  openDrawer: document.getElementById('openShoppingList'),
  closeDrawer: document.getElementById('closeShoppingList'),
  globalPortions: document.getElementById('globalPortions'),
  selectedRecipes: document.getElementById('selectedRecipes'),
  shoppingList: document.getElementById('shoppingList'),
  copy: document.getElementById('copyShoppingList'),
  clear: document.getElementById('clearShoppingList'),
  showAll: document.getElementById('showAllRecipes'),
  showFavs: document.getElementById('showFavoriteRecipes'),
  favOverview: document.getElementById('favoriteOverview'),
  favoriteStat: document.getElementById('favoriteStat')
};

function migrateOldBrokenStorage() {
  const currentVersion = localStorage.getItem('ninjaCookbookStorageVersion');
  if (currentVersion !== STORAGE_VERSION) {
    localStorage.removeItem('ninjaFavorites');
    localStorage.removeItem('favorites');
    localStorage.setItem('ninjaCookbookStorageVersion', STORAGE_VERSION);
    if (!localStorage.getItem(FAVORITE_KEY)) localStorage.setItem(FAVORITE_KEY, '[]');
  }
}

function sanitizeStoredState() {
  const validIds = new Set(RECIPES.map(recipe => String(recipe.id)));
  const cleanedFavorites = [...state.favorites].map(String).filter(id => validIds.has(id));
  state.favorites = new Set(cleanedFavorites);

  const cleanedShopping = {};
  Object.entries(state.shopping || {}).forEach(([id, value]) => {
    const cleanId = String(id);
    const portions = Number(value?.portions);
    if (validIds.has(cleanId) && portions > 0) cleanedShopping[cleanId] = { portions };
  });
  state.shopping = cleanedShopping;
  save();
}

function save() {
  localStorage.setItem(FAVORITE_KEY, JSON.stringify([...state.favorites]));
  localStorage.setItem(SHOPPING_KEY, JSON.stringify(state.shopping));
}

function fillSelect(select, values, allLabel) {
  select.innerHTML = `<option value="all">${allLabel}</option>` + values.map(v => `<option value="${v}">${v}</option>`).join('');
}

function initFilters() {
  fillSelect(els.country, [...new Set(RECIPES.map(r => r.country))].sort(), 'Alle Länder');
  fillSelect(els.type, [...new Set(RECIPES.map(r => r.type))].sort(), 'Alle Speisen');
}

function filteredRecipes() {
  const q = els.search.value.trim().toLowerCase();
  return RECIPES.filter(recipe => {
    const text = [recipe.title, recipe.description, recipe.country, recipe.type, recipe.tags.join(' ')].join(' ').toLowerCase();
    return (!q || text.includes(q))
      && (els.country.value === 'all' || recipe.country === els.country.value)
      && (els.type.value === 'all' || recipe.type === els.type.value)
      && (els.time.value === 'all' || recipe.time <= Number(els.time.value))
      && (!state.showFavoritesOnly || state.favorites.has(String(recipe.id)));
  });
}

function formatAmount(value) {
  if (Number.isInteger(value)) return String(value);
  return String(Math.round(value * 10) / 10).replace('.', ',');
}

function scaledIngredients(recipe, portions) {
  const factor = portions / recipe.servings;
  return recipe.ingredients.map(i => ({ ...i, amount: i.amount * factor }));
}

function renderRecipes() {
  const recipes = filteredRecipes();
  els.grid.innerHTML = '';

  if (!recipes.length) {
    els.grid.innerHTML = state.showFavoritesOnly
      ? '<div class="empty">Noch keine Favoriten vorhanden oder keine Favoriten passen zu den aktiven Filtern.</div>'
      : '<div class="empty">Keine Rezepte gefunden. Setze die Filter zurück oder suche nach etwas anderem.</div>';
  }

  recipes.forEach(recipe => {
    const recipeId = String(recipe.id);
    const node = els.template.content.cloneNode(true);
    const card = node.querySelector('.recipe-card');
    card.dataset.id = recipeId;
    node.querySelector('h2').textContent = recipe.title;
    node.querySelector('.recipe-card__meta').textContent = `${recipe.country} · ${recipe.type} · ${recipe.time} Min.`;
    node.querySelector('.recipe-card__description').textContent = recipe.description;
    node.querySelector('.chips').innerHTML = recipe.tags.map(tag => `<span>${tag}</span>`).join('');
    node.querySelector('.recipe-detail').innerHTML = `
      <div class="setting">${recipe.setting}</div>
      <h3>Zutaten für ${recipe.servings} Portionen</h3>
      <ul>${recipe.ingredients.map(i => `<li>${formatAmount(i.amount)} ${i.unit} ${i.name}</li>`).join('')}</ul>
      <h3>Zubereitung</h3>
      <ol>${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol>`;

    const favBtn = node.querySelector('.favorite-btn');
    const isFavorite = state.favorites.has(recipeId);
    favBtn.textContent = isFavorite ? '♥' : '♡';
    favBtn.classList.toggle('is-active', isFavorite);
    favBtn.setAttribute('aria-pressed', String(isFavorite));
    favBtn.addEventListener('click', () => {
      if (state.favorites.has(recipeId)) state.favorites.delete(recipeId);
      else state.favorites.add(recipeId);
      save();
      renderRecipes();
      renderFavoriteOverview();
      updateStats();
    });

    const portionInput = node.querySelector('.portion-input');
    const toggle = node.querySelector('.shopping-toggle');
    const selected = state.shopping[recipeId];
    if (selected) {
      toggle.checked = true;
      portionInput.value = selected.portions;
    } else {
      portionInput.value = els.globalPortions.value || recipe.servings;
    }

    function updateShopping() {
      if (toggle.checked) state.shopping[recipeId] = { portions: Number(portionInput.value) || recipe.servings };
      else delete state.shopping[recipeId];
      save();
      renderShopping();
    }
    toggle.addEventListener('change', updateShopping);
    portionInput.addEventListener('change', () => { toggle.checked = true; updateShopping(); });

    els.grid.appendChild(node);
  });

  updateStats(recipes.length);
  renderFavoriteOverview();
}

function renderFavoriteOverview() {
  if (!els.favOverview) return;
  const favorites = RECIPES.filter(recipe => state.favorites.has(String(recipe.id)));

  if (!favorites.length) {
    els.favOverview.innerHTML = `
      <div class="favorite-overview__head">
        <div><strong>Favoritenliste</strong><span>0 gespeichert</span></div>
      </div>
      <div class="empty empty--small">Noch keine Favoriten. Klicke bei einem Rezept auf das Herz ♡.</div>`;
    return;
  }

  els.favOverview.innerHTML = `
    <div class="favorite-overview__head">
      <div><strong>Favoritenliste</strong><span>${favorites.length} gespeichert</span></div>
      <button class="view-btn" type="button" id="clearFavorites">Favoriten leeren</button>
    </div>
    <div class="favorite-list">
      ${favorites.map(recipe => `
        <article class="favorite-mini-card" data-id="${recipe.id}">
          <div><strong>${recipe.title}</strong><span>${recipe.country} · ${recipe.type} · ${recipe.time} Min.</span></div>
          <button type="button" class="remove-favorite" data-id="${recipe.id}" aria-label="Favorit entfernen">×</button>
        </article>`).join('')}
    </div>`;

  document.getElementById('clearFavorites')?.addEventListener('click', () => {
    state.favorites.clear();
    state.showFavoritesOnly = false;
    save();
    updateViewButtons();
    renderRecipes();
  });

  els.favOverview.querySelectorAll('.favorite-mini-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.classList.contains('remove-favorite')) return;
      const recipe = RECIPES.find(r => String(r.id) === String(card.dataset.id));
      if (!recipe) return;
      state.showFavoritesOnly = false;
      updateViewButtons();
      els.search.value = recipe.title;
      renderRecipes();
      els.grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  els.favOverview.querySelectorAll('.remove-favorite').forEach(button => {
    button.addEventListener('click', () => {
      state.favorites.delete(String(button.dataset.id));
      save();
      renderRecipes();
    });
  });
}

function renderShopping() {
  const selectedIds = Object.keys(state.shopping);
  els.selectedRecipes.innerHTML = selectedIds.length ? selectedIds.map(id => {
    const recipe = RECIPES.find(r => String(r.id) === String(id));
    return recipe ? `<div class="selected-pill"><strong>${recipe.title}</strong><span>${state.shopping[id].portions} Portionen</span></div>` : '';
  }).join('') : '<p class="muted">Noch kein Rezept ausgewählt.</p>';

  const items = new Map();
  selectedIds.forEach(id => {
    const recipe = RECIPES.find(r => String(r.id) === String(id));
    if (!recipe) return;
    scaledIngredients(recipe, Number(state.shopping[id].portions)).forEach(item => {
      const key = `${item.name.toLowerCase()}|${item.unit}`;
      const existing = items.get(key) || { name: item.name, unit: item.unit, amount: 0 };
      existing.amount += item.amount;
      items.set(key, existing);
    });
  });

  els.shoppingList.innerHTML = items.size
    ? `<ul>${[...items.values()].sort((a,b) => a.name.localeCompare(b.name)).map(i => `<li><label><input type="checkbox"> <span>${formatAmount(i.amount)} ${i.unit} ${i.name}</span></label></li>`).join('')}</ul>`
    : '<div class="empty empty--small">Die Einkaufsliste ist leer.</div>';
  updateStats();
}

function updateStats(visibleCount) {
  els.recipeCount.textContent = visibleCount ?? filteredRecipes().length;
  els.favoriteCount.textContent = RECIPES.filter(recipe => state.favorites.has(String(recipe.id))).length;
  els.shoppingCount.textContent = Object.keys(state.shopping).length;
}

function copyShoppingList() {
  const lines = [...els.shoppingList.querySelectorAll('li span')].map(el => `- ${el.textContent}`);
  navigator.clipboard.writeText(lines.join('\n'));
  els.copy.textContent = 'Kopiert!';
  setTimeout(() => els.copy.textContent = 'Liste kopieren', 1200);
}

function updateViewButtons() {
  els.showAll.classList.toggle('is-active', !state.showFavoritesOnly);
  els.showFavs.classList.toggle('is-active', state.showFavoritesOnly);
}

['input', 'change'].forEach(evt => {
  els.search.addEventListener(evt, renderRecipes);
  els.country.addEventListener(evt, renderRecipes);
  els.type.addEventListener(evt, renderRecipes);
  els.time.addEventListener(evt, renderRecipes);
});

els.favoriteStat?.addEventListener('click', () => {
  state.showFavoritesOnly = true;
  updateViewButtons();
  renderRecipes();
  els.grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

els.showAll.addEventListener('click', () => { state.showFavoritesOnly = false; updateViewButtons(); renderRecipes(); });
els.showFavs.addEventListener('click', () => { state.showFavoritesOnly = true; updateViewButtons(); renderRecipes(); });

els.reset.addEventListener('click', () => {
  els.search.value = '';
  els.country.value = 'all';
  els.type.value = 'all';
  els.time.value = 'all';
  state.showFavoritesOnly = false;
  updateViewButtons();
  renderRecipes();
});

els.openDrawer.addEventListener('click', () => els.drawer.setAttribute('aria-hidden', 'false'));
els.closeDrawer.addEventListener('click', () => els.drawer.setAttribute('aria-hidden', 'true'));
els.drawer.addEventListener('click', e => { if (e.target === els.drawer) els.drawer.setAttribute('aria-hidden', 'true'); });
els.clear.addEventListener('click', () => { state.shopping = {}; save(); renderRecipes(); renderShopping(); });
els.copy.addEventListener('click', copyShoppingList);

migrateOldBrokenStorage();
sanitizeStoredState();
initFilters();
updateViewButtons();
renderRecipes();
renderShopping();
