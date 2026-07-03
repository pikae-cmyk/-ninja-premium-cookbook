# Ninja Premium Cookbook

Version 2.0 fuer GitHub Pages.

Eine statische Premium-Web-App fuer Ninja Foodi und Ninja Air Fryer Rezepte. Die App nutzt HTML, CSS und Vanilla JavaScript mit ES6-Modulen, speichert Favoriten und Einkaufsliste in LocalStorage und benoetigt keinen Build-Schritt.

## Funktionen

- 160 fokussierte Rezepte in `data/recipes.json`
- Live-Suche und kombinierbare Filter
- Kategorie-Chips
- Favoriten mit LocalStorage
- Rezeptgenaue Portionssteuerung mit live berechneten Zutaten
- Einkaufsliste mit pro Rezept skalierten Mengen und Zusammenfuehrung gleicher Zutaten
- Geraetespezifische Anleitungen fuer Ninja Foodi FlexDrawer AF500EU und Ninja Detect Blender TB401EU
- 160 eindeutige lokale Rezeptbilder unter `assets/images/recipes/`
- Erweiterte Airfryer-Klassiker wie Pommes, Chicken Wings, Nuggets, Onion Rings und Kroketten
- Erfrischende Smoothies sowie neue Erdbeer- und Wassermelonen-Eisvarianten
- Cocktails mit alkoholischen und alkoholfreien Varianten sowie cremige Shakes
- Jede Speisegruppe besitzt unterschiedliche Rezepte mit eigener Zutatenliste
- Alle Rezepte besitzen echte Zubereitungsschritte plus separate Ninja-Geraeteanleitung
- Clientseitiger PDF-Export der zusammengefuehrten Einkaufsliste
- PWA-Vorbereitung mit Manifest und Service Worker

## Lokal starten

```bash
python3 -m http.server 4173
```

Danach `http://localhost:4173` im Browser oeffnen.

## Deployment

Das Repository kann direkt als GitHub Pages Site veroeffentlicht werden. Es gibt keine Serverfunktionen, keine Datenbank und keine Build-Pipeline.
