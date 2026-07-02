(function(){
  const recipes = Array.isArray(window.RECIPES) ? window.RECIPES : [];
  const $ = (id)=>document.getElementById(id);
  const keys = { fav:'ninjaCookbookFavoritesV4', shop:'ninjaCookbookShoppingV4' };
  let view='all';
  let favorites = new Set(JSON.parse(localStorage.getItem(keys.fav)||'[]').filter(id=>recipes.some(r=>r.id===id)));
  let shopping = JSON.parse(localStorage.getItem(keys.shop)||'{}');
  function save(){localStorage.setItem(keys.fav, JSON.stringify([...favorites]));localStorage.setItem(keys.shop, JSON.stringify(shopping));}
  function fillFilters(){
    const countries=[...new Set(recipes.map(r=>r.country))].sort();
    const types=[...new Set(recipes.map(r=>r.type))].sort();
    $('countryFilter').innerHTML='<option value="">Alle Länder</option>'+countries.map(v=>`<option>${v}</option>`).join('');
    $('typeFilter').innerHTML='<option value="">Alle Speisen</option>'+types.map(v=>`<option>${v}</option>`).join('');
  }
  function filtered(){
    const q=$('searchInput').value.trim().toLowerCase(), c=$('countryFilter').value, t=$('typeFilter').value, max=Number($('timeFilter').value||0);
    return recipes.filter(r =>
      (view!=='favorites'||favorites.has(r.id)) &&
      (!q || [r.title,r.description,r.country,r.type,...r.tags].join(' ').toLowerCase().includes(q)) &&
      (!c || r.country===c) && (!t || r.type===t) && (!max || r.time<=max)
    );
  }
  function card(r){
    const inShop=shopping[r.id]; const portions=inShop?.portions || r.servings;
    return `<article class="card">
      <div class="card__top"><div><div class="card__meta">${r.country} · ${r.type} · ${r.time} Min.</div><h3>${r.title}</h3></div><button class="heart ${favorites.has(r.id)?'is-active':''}" data-fav="${r.id}" title="Favorit">${favorites.has(r.id)?'♥':'♡'}</button></div>
      <p>${r.description}</p><div class="tags">${r.tags.map(x=>`<span class="tag">${x}</span>`).join('')}</div>
      <details class="details"><summary>Zubereitung & Zutaten anzeigen</summary><h4>Zutaten für ${r.servings} Portionen</h4><ul>${r.ingredients.map(i=>`<li>${i.amount} ${i.unit} ${i.name}</li>`).join('')}</ul><h4>Zubereitung</h4><ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol></details>
      <div class="shop-row"><label class="check"><input type="checkbox" data-shop="${r.id}" ${inShop?'checked':''}>Auf die Einkaufsliste setzen</label><label class="portions">Portionen <input type="number" min="1" max="20" value="${portions}" data-portions="${r.id}"></label></div>
    </article>`;
  }
  function render(){
    const list=filtered();
    $('recipeGrid').innerHTML=list.map(card).join('');
    $('emptyState').hidden=list.length!==0;
    $('recipeCount').textContent=recipes.length;
    $('favoriteCount').textContent=favorites.size;
    $('shoppingCount').textContent=ingredientCount();
    $('viewTitle').textContent=view==='favorites'?'Meine Favoriten':'Alle Rezepte';
    $('viewInfo').textContent=view==='favorites'?'Hier erscheinen alle Rezepte, die du mit dem Herz markiert hast.':'Wähle Rezepte aus, markiere Favoriten und erstelle deine Einkaufsliste.';
    $('recipes').hidden=view==='shopping'; $('shopping').hidden=view!=='shopping';
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('is-active'));
    $(view==='favorites'?'favoritesTab':view==='shopping'?'shoppingTab':'allTab').classList.add('is-active');
    renderShopping(); save();
  }
  function ingredientCount(){const names=new Set();Object.keys(shopping).forEach(id=>{const r=recipes.find(x=>x.id===id); r?.ingredients.forEach(i=>names.add(i.name+'|'+i.unit));});return names.size;}
  function renderShopping(){
    const totals={};
    Object.entries(shopping).forEach(([id,item])=>{const r=recipes.find(x=>x.id===id); if(!r)return; const factor=(Number(item.portions)||r.servings)/r.servings; r.ingredients.forEach(i=>{const k=i.name+'|'+i.unit; totals[k]=totals[k]||{name:i.name,unit:i.unit,amount:0}; totals[k].amount += Number(i.amount)*factor;});});
    const vals=Object.values(totals).sort((a,b)=>a.name.localeCompare(b.name));
    $('shoppingList').innerHTML = vals.length ? `<ul>${vals.map(i=>`<li>${round(i.amount)} ${i.unit} ${i.name}</li>`).join('')}</ul>` : '<p class="muted">Noch keine Zutaten in der Einkaufsliste.</p>';
  }
  function round(n){return Math.round(n*10)/10;}
  document.addEventListener('click',e=>{const fav=e.target.closest('[data-fav]'); if(fav){favorites.has(fav.dataset.fav)?favorites.delete(fav.dataset.fav):favorites.add(fav.dataset.fav);render();}});
  document.addEventListener('change',e=>{if(e.target.matches('[data-shop]')){const id=e.target.dataset.shop; const r=recipes.find(x=>x.id===id); if(e.target.checked) shopping[id]={portions:r.servings}; else delete shopping[id]; render();} if(e.target.matches('[data-portions]')){const id=e.target.dataset.portions; if(shopping[id]){shopping[id].portions=Math.max(1,Number(e.target.value)||1); render();}}});
  ['searchInput','countryFilter','typeFilter','timeFilter'].forEach(id=>$(id).addEventListener('input',render));
  $('resetBtn').onclick=()=>{$('searchInput').value='';$('countryFilter').value='';$('typeFilter').value='';$('timeFilter').value='';view='all';render();};
  $('allTab').onclick=()=>{view='all';render();}; $('favoritesTab').onclick=()=>{view='favorites';render();}; $('shoppingTab').onclick=()=>{view='shopping';render();};
  $('showFavoritesBtn').onclick=()=>{view='favorites';render();location.hash='recipes';}; $('showShoppingBtn').onclick=()=>{view='shopping';render();location.hash='shopping';}; $('showShoppingBtn').onclick=()=>{view='shopping';render();};
  $('clearShoppingBtn').onclick=()=>{shopping={};render();};
  $('copyShoppingBtn').onclick=()=>navigator.clipboard?.writeText($('shoppingList').innerText||'');
  fillFilters(); render();
})();
