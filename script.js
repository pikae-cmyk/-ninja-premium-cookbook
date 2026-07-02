const state = {
  favorites: new Set(JSON.parse(localStorage.getItem('ninjaFavorites') || '[]')),
  shopping: JSON.parse(localStorage.getItem('ninjaShopping') || '{}'),
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

function sanitizeStoredState() {
  const validIds = new Set(RECIPES.map(recipe => recipe.id));
  let changed = false;

  [...state.favorites].forEach(id => {
    if (!validIds.has(id)) {
      state.favorites.delete(id);
      changed = true;
    }
  });

  Object.keys(state.shopping).forEach(id => {
    if (!validIds.has(id)) {
      delete state.shopping[id];
      changed = true;
    }
  });

  if (changed) save();
}

function save() {
  localStorage.setItem('ninjaFavorites', JSON.stringify([...state.favorites]));
  localStorage.setItem('ninjaShopping', JSON.stringify(state.shopping));
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
    const matchQ = !q || text.includes(q);
    const matchCountry = els.country.value === 'all' || recipe.country === els.country.value;
    const matchType = els.type.value === 'all' || recipe.type === els.type.value;
    const matchTime = els.time.value === 'all' || recipe.time <= Number(els.time.value);
    const matchFavorites = !state.showFavoritesOnly || state.favorites.has(recipe.id);
    return matchQ && matchCountry && matchType && matchTime && matchFavorites;
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
      ? '<div class="empty">Du hast noch keine passenden Favoriten. Klicke bei einem Rezept auf das Herz oder setze die Filter zurück.</div>'
      : '<div class="empty">Keine Rezepte gefunden. Setze die Filter zurück oder suche nach etwas anderem.</div>';
  }

  recipes.forEach(recipe => {
    const node = els.template.content.cloneNode(true);
    const card = node.querySelector('.recipe-card');
    card.dataset.id = recipe.id;
    node.querySelector('h2').textContent = recipe.title;
    node.querySelector('.recipe-card__meta').textContent = `${recipe.country} · ${recipe.type} · ${recipe.time} Min.`;
    node.querySelector('.recipe-card__description').textContent = recipe.description;
    node.querySelector('.chips').innerHTML = recipe.tags.map(tag => `<span>${tag}</span>`).join('');
    node.querySelector('.recipe-detail').innerHTML = `
      <div class="setting">${recipe.setting}</div>
      <h3>Zutaten für ${recipe.servings} Portionen</h3>
      <ul>${recipe.ingredients.map(i => `<li>${formatAmount(i.amount)} ${i.unit} ${i.name}</li>`).join('')}</ul>
      <h3>Zubereitung</h3>
      <ol>${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol>
    `;

    const favBtn = node.querySelector('.favorite-btn');
    favBtn.textContent = state.favorites.has(recipe.id) ? '♥' : '♡';
    favBtn.classList.toggle('is-active', state.favorites.has(recipe.id));
    favBtn.addEventListener('click', () => {
      state.favorites.has(recipe.id) ? state.favorites.delete(recipe.id) : state.favorites.add(recipe.id);
      save();
      renderRecipes();
      renderShopping();
    });

    const portionInput = node.querySelector('.portion-input');
    const toggle = node.querySelector('.shopping-toggle');
    const selected = state.shopping[recipe.id];
    if (selected) {
      toggle.checked = true;
      portionInput.value = selected.portions;
    } else {
      portionInput.value = els.globalPortions.value || recipe.servings;
    }

    function updateShopping() {
      if (toggle.checked) state.shopping[recipe.id] = { portions: Number(portionInput.value) || recipe.servings };
      else delete state.shopping[recipe.id];
      save();
      renderShopping();
    }
    toggle.addEventListener('change', updateShopping);
    portionInput.addEventListener('change', () => {
      toggle.checked = true;
      updateShopping();
    });

    els.grid.appendChild(node);
  });
  updateStats(recipes.length);
  renderFavoriteOverview();
}


function renderFavoriteOverview() {
  if (!els.favOverview) return;
  const favorites = RECIPES.filter(recipe => state.favorites.has(recipe.id));

  if (!favorites.length) {
    els.favOverview.innerHTML = `
      <div class="favorite-overview__head">
        <div><strong>Favoriten</strong><span>Noch keine Favoriten gespeichert.</span></div>
      </div>`;
    return;
  }

  els.favOverview.innerHTML = `
    <div class="favorite-overview__head">
      <div><strong>Favoriten</strong><span>${favorites.length} gespeichert</span></div>
      <button class="view-btn" type="button" id="overviewShowFavs">Nur Favoriten anzeigen</button>
    </div>
    <div class="favorite-list">${favorites.map(recipe => `
      <button class="favorite-pill" type="button" data-id="${recipe.id}">♥ ${recipe.title}</button>
    `).join('')}</div>`;

  const overviewButton = document.getElementById('overviewShowFavs');
  if (overviewButton) {
    overviewButton.addEventListener('click', () => {
      state.showFavoritesOnly = true;
      updateViewButtons();
      renderRecipes();
      document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  els.favOverview.querySelectorAll('.favorite-pill').forEach(button => {
    button.addEventListener('click', () => {
      state.showFavoritesOnly = false;
      updateViewButtons();
      els.search.value = button.dataset.id ? RECIPES.find(r => r.id === button.dataset.id)?.title || '' : '';
      renderRecipes();
      document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function renderShopping() {
  const selectedIds = Object.keys(state.shopping);
  els.selectedRecipes.innerHTML = selectedIds.length ? selectedIds.map(id => {
    const recipe = RECIPES.find(r => r.id === id);
    return recipe ? `<div class="selected-pill"><strong>${recipe.title}</strong><span>${state.shopping[id].portions} Portionen</span></div>` : '';
  }).join('') : '<p class="muted">Noch kein Rezept ausgewählt.</p>';

  const items = new Map();
  selectedIds.forEach(id => {
    const recipe = RECIPES.find(r => r.id === id);
    if (!recipe) return;
    scaledIngredients(recipe, Number(state.shopping[id].portions)).forEach(item => {
      const key = `${item.name.toLowerCase()}|${item.unit}`;
      const existing = items.get(key) || { name: item.name, unit: item.unit, amount: 0 };
      existing.amount += item.amount;
      items.set(key, existing);
    });
  });

  els.shoppingList.innerHTML = items.size ? `<ul>${[...items.values()].sort((a,b) => a.name.localeCompare(b.name)).map(i => `<li><label><input type="checkbox"> <span>${formatAmount(i.amount)} ${i.unit} ${i.name}</span></label></li>`).join('')}</ul>` : '<div class="empty empty--small">Die Einkaufsliste ist leer.</div>';
  updateStats(filteredRecipes().length);
}

function updateStats(visibleCount) {
  els.recipeCount.textContent = visibleCount ?? filteredRecipes().length;
  els.favoriteCount.textContent = state.favorites.size;
  els.shoppingCount.textContent = Object.keys(state.shopping).length;
}

function copyShoppingList() {
  const lines = [...els.shoppingList.querySelectorAll('li span')].map(el => `- ${el.textContent}`);
  navigator.clipboard.writeText(lines.join('\n'));
  els.copy.textContent = 'Kopiert!';
  setTimeout(() => els.copy.textContent = 'Liste kopieren', 1200);
}

['input', 'change'].forEach(evt => {
  els.search.addEventListener(evt, renderRecipes);
  els.country.addEventListener(evt, renderRecipes);
  els.type.addEventListener(evt, renderRecipes);
  els.time.addEventListener(evt, renderRecipes);
});

function updateViewButtons() {
  els.showAll.classList.toggle('is-active', !state.showFavoritesOnly);
  els.showFavs.classList.toggle('is-active', state.showFavoritesOnly);
}

if (els.favoriteStat) {
  els.favoriteStat.addEventListener('click', () => {
    state.showFavoritesOnly = true;
    updateViewButtons();
    renderRecipes();
    document.getElementById('recipes').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

els.showAll.addEventListener('click', () => {
  state.showFavoritesOnly = false;
  updateViewButtons();
  renderRecipes();
});

els.showFavs.addEventListener('click', () => {
  state.showFavoritesOnly = true;
  updateViewButtons();
  renderRecipes();
});

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

sanitizeStoredState();
initFilters();
updateViewButtons();
renderRecipes();
renderShopping();
