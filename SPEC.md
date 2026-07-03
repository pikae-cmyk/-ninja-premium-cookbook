# SPEC

## Architektur

- `index.html`: Semantische App-Shell, Templates und Overlays
- `style.css`: Responsives Premium-UI
- `app.js`: App-Bootstrap, Rendering und Event-Binding
- `modules/recipes.js`: Rezeptdaten laden und normalisieren
- `modules/filters.js`: Filteroptionen und kombinierte Filterlogik
- `modules/favorites.js`: Favoriten-Store
- `modules/shopping.js`: Einkaufsliste, pro Rezept gespeicherte Portionen, Zutaten-Zusammenfuehrung
- `modules/pdf.js`: Clientseitiger PDF-Export fuer die zusammengefuehrte Einkaufsliste
- `modules/storage.js`: LocalStorage-Kapselung
- `modules/utils.js`: Kleine DOM- und Format-Helfer
- `data/recipes.json`: Rezeptdaten

## Datenmodell Rezept

Jedes Rezept besitzt `id`, `title`, `country`, `category`, `type`, `time`, `difficulty`, `servings`, `description`, `ingredients`, `preparationSteps`, `steps`, `tip`, `nutrition`, `tags`, `image`, `fallbackImage`, `favorite`, `diet` und `device`.

Die aktuelle Rezeptbasis konzentriert sich auf `Smoothies`, `Eiscreme`, `Saucen`, `Fast Food`, `Aufläufe`, `Gemüse`, `Cocktails` und `Shakes` in den Kategorien `Italienisch`, `Spanisch`, `Amerikanisch` und `Deutsch`.

Jedes Rezept besitzt ein eigenes lokales realistisches Bild unter `assets/images/recipes/`.

Die Rezeptbasis umfasst 160 unterschiedliche Titel, Zutatenlisten und lokale Bilder. `Fast Food`, `Smoothies`, `Eiscreme`, `Cocktails` und `Shakes` wurden gezielt erweitert, damit typische Airfryer-Gerichte, frische Erdbeer- und Wassermelonenvarianten sowie Drinks fuer den Ninja Detect Blender abgedeckt sind.

`preparationSteps` beschreibt die eigentliche Rezeptzubereitung wie Waschen, Schneiden, Marinieren, Roesten, Schichten, Abschmecken oder Anrichten. `device.steps` beschreibt separat die Bedienung des Ninja Foodi FlexDrawer AF500EU oder Ninja Detect Blender TB401EU.

Zubereitungsschritte muessen zutatenbezogen sein: Sie duerfen keine konkreten Lebensmittel wie Knoblauch, Zwiebeln, Kraeuter, Nuesse, Kaese oder Fleisch nennen, wenn diese nicht in der Zutatenliste des jeweiligen Rezepts vorkommen.

Auch `device.steps` muss rezeptbezogen sein: Die Ninja-Anleitung nennt konkrete Zutaten und Handgriffe des jeweiligen Rezepts statt generischer Geraetehinweise. Allgemeine Formulierungen duerfen keine Lebensmittelgruppen nennen, die im Rezept nicht vorkommen.

## Qualitaet

Die App ist statisch, GitHub-Pages-kompatibel, offlinefaehig vorbereitet und vermeidet globale Browser-Variablen. UI-Zustand wird aus Rezeptdaten, Filterformular, Favoriten-Store und Einkaufsliste abgeleitet.

Der PDF-Export erzeugt die Einkaufsliste vollstaendig im Browser als `application/pdf`-Blob und benoetigt keine Serverfunktion oder externe Bibliothek.
