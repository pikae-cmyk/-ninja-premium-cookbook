const RECIPES = [
  {
    id: "crispy-fries",
    title: "Goldene Airfryer Pommes",
    country: "Amerikanisch",
    type: "Beilage",
    time: 25,
    servings: 4,
    description: "Außen knusprig, innen weich – perfekt zu Nuggets, Burgern oder als Snack.",
    tags: ["Max Crisp", "Familie", "Vegetarisch"],
    ingredients: [
      { name: "TK-Pommes", amount: 800, unit: "g" },
      { name: "Öl", amount: 1, unit: "EL" },
      { name: "Pommesgewürz oder Salz", amount: 1, unit: "TL" }
    ],
    steps: [
      "Pommes locker im Korb verteilen und nicht zu voll machen.",
      "Bei 200 °C oder Max Crisp ca. 18–25 Minuten garen.",
      "Nach der Hälfte der Zeit kräftig schütteln oder wenden.",
      "Direkt würzen und heiß servieren."
    ],
    setting: "Air Fry / Max Crisp · 200–240 °C · 18–25 Min."
  },
  {
    id: "chicken-nuggets",
    title: "Knusprige Chicken Nuggets",
    country: "Amerikanisch",
    type: "Hauptgericht",
    time: 18,
    servings: 4,
    description: "Schnelle Nuggets für Kinder und Erwachsene – ideal mit Pommes im zweiten Fach.",
    tags: ["Kinderliebling", "Schnell", "Dual Zone"],
    ingredients: [
      { name: "Chicken Nuggets", amount: 700, unit: "g" },
      { name: "Ölspray", amount: 1, unit: "Sprühstoß" },
      { name: "Dip nach Wahl", amount: 150, unit: "g" }
    ],
    steps: [
      "Nuggets in einer Lage in den Korb legen.",
      "Optional leicht mit Öl besprühen.",
      "Bei 190 °C ca. 12–18 Minuten garen.",
      "Zwischendurch wenden, bis sie goldbraun sind."
    ],
    setting: "Air Fry · 190 °C · 12–18 Min."
  },
  {
    id: "italian-meatballs",
    title: "Italienische Meatballs",
    country: "Italienisch",
    type: "Hauptgericht",
    time: 28,
    servings: 4,
    description: "Saftige Hackbällchen mit Parmesan, Kräutern und Tomatensauce.",
    tags: ["Italien", "Pasta", "Herzhaft"],
    ingredients: [
      { name: "Rinderhack", amount: 600, unit: "g" },
      { name: "Parmesan", amount: 50, unit: "g" },
      { name: "Ei", amount: 1, unit: "Stück" },
      { name: "Paniermehl", amount: 60, unit: "g" },
      { name: "Passierte Tomaten", amount: 500, unit: "ml" },
      { name: "Italienische Kräuter", amount: 2, unit: "TL" }
    ],
    steps: [
      "Hack, Parmesan, Ei, Paniermehl und Kräuter vermengen.",
      "Bällchen formen und leicht einölen.",
      "Bei 190 °C ca. 14–18 Minuten airfryen.",
      "Mit warmer Tomatensauce servieren."
    ],
    setting: "Air Fry · 190 °C · 14–18 Min."
  },
  {
    id: "mediterranean-vegetables",
    title: "Mediterranes Ofengemüse",
    country: "Spanisch/Mediterran",
    type: "Beilage",
    time: 24,
    servings: 4,
    description: "Paprika, Zucchini und Kartoffeln mit Olivenöl, Knoblauch und Kräutern.",
    tags: ["Vegetarisch", "Meal Prep", "Mediterran"],
    ingredients: [
      { name: "Kartoffeln", amount: 500, unit: "g" },
      { name: "Zucchini", amount: 1, unit: "Stück" },
      { name: "Paprika", amount: 2, unit: "Stück" },
      { name: "Rote Zwiebel", amount: 1, unit: "Stück" },
      { name: "Olivenöl", amount: 2, unit: "EL" },
      { name: "Knoblauch", amount: 2, unit: "Zehen" }
    ],
    steps: [
      "Gemüse in gleichmäßige Stücke schneiden.",
      "Mit Öl, Knoblauch, Salz und Kräutern mischen.",
      "Bei 190 °C ca. 20–24 Minuten garen.",
      "Nach der Hälfte der Zeit wenden."
    ],
    setting: "Air Fry / Roast · 190 °C · 20–24 Min."
  },
  {
    id: "spanish-potatoes",
    title: "Patatas Bravas",
    country: "Spanisch/Mediterran",
    type: "Snack",
    time: 35,
    servings: 4,
    description: "Spanische Kartoffelwürfel mit würziger Bravas-Sauce.",
    tags: ["Tapas", "Knusprig", "Würzig"],
    ingredients: [
      { name: "Kartoffeln", amount: 800, unit: "g" },
      { name: "Olivenöl", amount: 2, unit: "EL" },
      { name: "Paprikapulver", amount: 2, unit: "TL" },
      { name: "Passierte Tomaten", amount: 250, unit: "ml" },
      { name: "Chiliflocken", amount: 0.5, unit: "TL" },
      { name: "Mayonnaise oder Aioli", amount: 120, unit: "g" }
    ],
    steps: [
      "Kartoffeln würfeln, wässern und gut abtrocknen.",
      "Mit Öl, Paprika und Salz mischen.",
      "Bei 200 °C ca. 25–35 Minuten garen und mehrfach schütteln.",
      "Mit Tomaten-Chili-Sauce und Aioli servieren."
    ],
    setting: "Air Fry · 200 °C · 25–35 Min."
  },
  {
    id: "garlic-parmesan-wings",
    title: "Garlic Parmesan Wings",
    country: "Amerikanisch",
    type: "Hauptgericht",
    time: 35,
    servings: 4,
    description: "Knusprige Wings mit Butter, Knoblauch und Parmesan-Finish.",
    tags: ["Game Day", "Protein", "Knusprig"],
    ingredients: [
      { name: "Chicken Wings", amount: 1000, unit: "g" },
      { name: "Backpulver", amount: 1, unit: "TL" },
      { name: "Butter", amount: 40, unit: "g" },
      { name: "Knoblauch", amount: 2, unit: "Zehen" },
      { name: "Parmesan", amount: 50, unit: "g" }
    ],
    steps: [
      "Wings trocken tupfen und mit Salz sowie Backpulver mischen.",
      "Bei 200 °C ca. 28–35 Minuten garen, zwischendurch wenden.",
      "Butter mit Knoblauch schmelzen.",
      "Wings mit Knoblauchbutter und Parmesan vermengen."
    ],
    setting: "Air Fry · 200 °C · 28–35 Min."
  },
  {
    id: "caprese-chicken",
    title: "Caprese Chicken",
    country: "Italienisch",
    type: "Hauptgericht",
    time: 26,
    servings: 4,
    description: "Hähnchenbrust mit Tomate, Mozzarella und Basilikum.",
    tags: ["Low Carb", "Italien", "Schnell"],
    ingredients: [
      { name: "Hähnchenbrust", amount: 4, unit: "Stück" },
      { name: "Tomaten", amount: 2, unit: "Stück" },
      { name: "Mozzarella", amount: 250, unit: "g" },
      { name: "Pesto", amount: 4, unit: "TL" },
      { name: "Basilikum", amount: 1, unit: "Bund" }
    ],
    steps: [
      "Hähnchen würzen und mit etwas Öl einreiben.",
      "Bei 180 °C ca. 16–20 Minuten garen.",
      "Mit Pesto, Tomate und Mozzarella belegen.",
      "Weitere 3–5 Minuten garen, bis der Käse schmilzt."
    ],
    setting: "Air Fry · 180 °C · 20–26 Min."
  },
  {
    id: "churro-bites",
    title: "Churro Bites",
    country: "Spanisch/Mediterran",
    type: "Dessert",
    time: 22,
    servings: 4,
    description: "Kleine süße Teigstücke mit Zimt-Zucker – perfekt als Nachtisch.",
    tags: ["Dessert", "Süß", "Kinder"],
    ingredients: [
      { name: "Blätterteig", amount: 1, unit: "Rolle" },
      { name: "Butter", amount: 40, unit: "g" },
      { name: "Zucker", amount: 60, unit: "g" },
      { name: "Zimt", amount: 2, unit: "TL" },
      { name: "Schokosauce", amount: 120, unit: "g" }
    ],
    steps: [
      "Blätterteig in kleine Stücke schneiden.",
      "Bei 180 °C ca. 8–12 Minuten goldbraun backen.",
      "Mit Butter bestreichen und in Zimt-Zucker wenden.",
      "Mit Schokosauce servieren."
    ],
    setting: "Bake / Air Fry · 180 °C · 8–12 Min."
  },
  {
    id: "mozzarella-sticks",
    title: "Mozzarella Sticks",
    country: "Amerikanisch",
    type: "Snack",
    time: 20,
    servings: 4,
    description: "Knuspriger Käse-Snack mit Dip – funktioniert am besten gut gekühlt oder gefroren.",
    tags: ["Snack", "Käse", "Party"],
    ingredients: [
      { name: "Mozzarella Sticks", amount: 600, unit: "g" },
      { name: "Marinara Dip", amount: 200, unit: "g" },
      { name: "Ölspray", amount: 1, unit: "Sprühstoß" }
    ],
    steps: [
      "Sticks möglichst gefroren oder gut gekühlt verwenden.",
      "Locker in den Korb legen und leicht besprühen.",
      "Bei 180 °C ca. 7–10 Minuten garen.",
      "Sofort servieren, bevor der Käse ausläuft."
    ],
    setting: "Air Fry · 180 °C · 7–10 Min."
  },
  {
    id: "italian-bruschetta-bread",
    title: "Bruschetta Brot",
    country: "Italienisch",
    type: "Snack",
    time: 16,
    servings: 4,
    description: "Krosses Brot mit Tomaten, Knoblauch, Olivenöl und Basilikum.",
    tags: ["Vorspeise", "Vegetarisch", "Sommer"],
    ingredients: [
      { name: "Baguette", amount: 1, unit: "Stück" },
      { name: "Tomaten", amount: 4, unit: "Stück" },
      { name: "Knoblauch", amount: 1, unit: "Zehe" },
      { name: "Olivenöl", amount: 2, unit: "EL" },
      { name: "Basilikum", amount: 1, unit: "Bund" }
    ],
    steps: [
      "Baguette in Scheiben schneiden und mit etwas Öl bestreichen.",
      "Bei 180 °C ca. 5–7 Minuten rösten.",
      "Tomaten würfeln und mit Knoblauch, Öl, Salz und Basilikum mischen.",
      "Auf dem warmen Brot servieren."
    ],
    setting: "Air Fry · 180 °C · 5–7 Min."
  }
];
