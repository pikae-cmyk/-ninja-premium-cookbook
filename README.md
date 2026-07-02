# Ninja Premium Cookbook

Statische Website für GitHub Pages mit:

- Rezeptübersicht
- Filter nach Land/Küche, Art der Speise und Zeit
- Suchfunktion
- Favoritenfunktion per LocalStorage
- Einkaufsliste mit Portionsberechnung
- Zusammenfassung gleicher Zutaten

## GitHub Upload

1. Neues Repository bei GitHub erstellen, z. B. `ninja-premium-cookbook`.
2. Die Dateien `index.html`, `style.css`, `script.js`, `recipes.js` und `README.md` hochladen.
3. Unter **Settings → Pages** als Source `Deploy from a branch` auswählen.
4. Branch `main` und Ordner `/root` auswählen.
5. Nach kurzer Zeit ist die Seite über GitHub Pages erreichbar.

## Rezepte ergänzen

Neue Rezepte werden in `recipes.js` ergänzt. Wichtig ist eine eindeutige `id`, z. B.:

```js
{
  id: "neues-rezept",
  title: "Neues Rezept",
  country: "Italienisch",
  type: "Hauptgericht",
  time: 25,
  servings: 4,
  description: "Kurze Beschreibung.",
  tags: ["Schnell", "Familie"],
  ingredients: [
    { name: "Zutat", amount: 500, unit: "g" }
  ],
  steps: ["Schritt 1", "Schritt 2"],
  setting: "Air Fry · 190 °C · 20 Min."
}
```
