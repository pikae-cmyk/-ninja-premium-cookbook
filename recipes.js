const RECIPES = [
  {
    id: 'crispy-pommes',
    title: 'Extra knusprige Pommes',
    country: 'Amerikanisch',
    type: 'Beilage',
    time: 24,
    servings: 4,
    description: 'Goldbraune Airfryer-Pommes mit wenig Öl und richtigem Crunch.',
    tags: ['Kinderliebling', 'Schnell', 'Knusprig'],
    setting: 'Max Crisp · 200 °C · 20–24 Min.',
    ingredients: [
      { name: 'TK-Pommes', amount: 800, unit: 'g' },
      { name: 'Öl', amount: 1, unit: 'EL' },
      { name: 'Salz', amount: 1, unit: 'TL' },
      { name: 'Paprikapulver', amount: 1, unit: 'TL' }
    ],
    steps: ['Pommes locker in den Korb geben.', 'Optional mit wenig Öl vermengen.', 'Bei 200 °C garen und nach der Hälfte kräftig schütteln.', 'Zum Schluss salzen und sofort servieren.']
  },
  {
    id: 'chicken-nuggets',
    title: 'Chicken Nuggets Familienportion',
    country: 'Amerikanisch',
    type: 'Hauptgericht',
    time: 18,
    servings: 4,
    description: 'Schnelle Nuggets außen knusprig und innen saftig – ideal mit Pommes.',
    tags: ['Familie', 'Schnell', 'Kids'],
    setting: 'Air Fry · 190 °C · 14–18 Min.',
    ingredients: [
      { name: 'Chicken Nuggets', amount: 700, unit: 'g' },
      { name: 'Pommesgewürz', amount: 1, unit: 'TL' },
      { name: 'Ketchup', amount: 100, unit: 'ml' },
      { name: 'Mayonnaise', amount: 80, unit: 'g' }
    ],
    steps: ['Nuggets nebeneinander in den Korb legen.', 'Bei 190 °C backen.', 'Nach 8 Minuten wenden oder schütteln.', 'Mit Dips servieren.']
  },
  {
    id: 'italian-meatballs',
    title: 'Italienische Meatballs',
    country: 'Italienisch',
    type: 'Hauptgericht',
    time: 28,
    servings: 4,
    description: 'Saftige Hackbällchen mit Parmesan, Kräutern und Tomatensauce.',
    tags: ['Italien', 'Meal Prep', 'Herzhaft'],
    setting: 'Air Fry · 185 °C · 16–18 Min.',
    ingredients: [
      { name: 'Rinderhackfleisch', amount: 600, unit: 'g' },
      { name: 'Parmesan', amount: 60, unit: 'g' },
      { name: 'Ei', amount: 1, unit: 'Stk.' },
      { name: 'Paniermehl', amount: 50, unit: 'g' },
      { name: 'Passierte Tomaten', amount: 500, unit: 'ml' },
      { name: 'Italienische Kräuter', amount: 2, unit: 'TL' }
    ],
    steps: ['Hackfleisch mit Parmesan, Ei und Paniermehl vermengen.', 'Kleine Bällchen formen.', 'Im Airfryer garen.', 'Tomatensauce erwärmen und Bällchen darin ziehen lassen.']
  },
  {
    id: 'bruschetta-baguette',
    title: 'Bruschetta Baguette',
    country: 'Italienisch',
    type: 'Snack',
    time: 15,
    servings: 4,
    description: 'Knuspriges Baguette mit Tomaten, Knoblauch und Basilikum.',
    tags: ['Snack', 'Vegetarisch', 'Sommer'],
    setting: 'Air Fry · 180 °C · 6–8 Min.',
    ingredients: [
      { name: 'Baguette', amount: 1, unit: 'Stk.' },
      { name: 'Tomaten', amount: 400, unit: 'g' },
      { name: 'Knoblauchzehe', amount: 1, unit: 'Stk.' },
      { name: 'Olivenöl', amount: 3, unit: 'EL' },
      { name: 'Basilikum', amount: 1, unit: 'Bund' },
      { name: 'Salz', amount: 1, unit: 'Prise' }
    ],
    steps: ['Baguette aufschneiden.', 'Tomaten würfeln und mit Öl, Knoblauch und Basilikum mischen.', 'Baguette kurz rösten.', 'Tomatenmix daraufgeben.']
  },
  {
    id: 'spanish-patatas',
    title: 'Patatas Bravas',
    country: 'Spanisch / Mediterran',
    type: 'Beilage',
    time: 35,
    servings: 4,
    description: 'Mediterrane Kartoffelwürfel mit würziger Bravas-Sauce.',
    tags: ['Tapas', 'Würzig', 'Vegetarisch'],
    setting: 'Air Fry · 195 °C · 25–30 Min.',
    ingredients: [
      { name: 'Kartoffeln', amount: 900, unit: 'g' },
      { name: 'Olivenöl', amount: 2, unit: 'EL' },
      { name: 'Paprikapulver', amount: 2, unit: 'TL' },
      { name: 'Passierte Tomaten', amount: 250, unit: 'ml' },
      { name: 'Knoblauchzehe', amount: 1, unit: 'Stk.' },
      { name: 'Chiliflocken', amount: 0.5, unit: 'TL' }
    ],
    steps: ['Kartoffeln würfeln und mit Öl würzen.', 'Im Airfryer knusprig garen.', 'Sauce aus Tomaten, Knoblauch und Chili erhitzen.', 'Kartoffeln mit Sauce servieren.']
  },
  {
    id: 'mediterranean-veggies',
    title: 'Mediterranes Gemüse',
    country: 'Spanisch / Mediterran',
    type: 'Beilage',
    time: 22,
    servings: 4,
    description: 'Zucchini, Paprika und rote Zwiebeln aromatisch geröstet.',
    tags: ['Leicht', 'Vegetarisch', 'Meal Prep'],
    setting: 'Roast · 190 °C · 18–22 Min.',
    ingredients: [
      { name: 'Zucchini', amount: 2, unit: 'Stk.' },
      { name: 'Paprika', amount: 3, unit: 'Stk.' },
      { name: 'Rote Zwiebel', amount: 2, unit: 'Stk.' },
      { name: 'Olivenöl', amount: 3, unit: 'EL' },
      { name: 'Feta', amount: 150, unit: 'g' },
      { name: 'Oregano', amount: 1, unit: 'TL' }
    ],
    steps: ['Gemüse grob schneiden.', 'Mit Öl und Oregano vermengen.', 'Im Airfryer rösten.', 'Mit Feta bestreuen.']
  },
  {
    id: 'bbq-wings',
    title: 'BBQ Chicken Wings',
    country: 'Amerikanisch',
    type: 'Snack',
    time: 32,
    servings: 4,
    description: 'Klebrige BBQ-Wings mit knuspriger Haut.',
    tags: ['BBQ', 'Party', 'Knusprig'],
    setting: 'Air Fry · 200 °C · 24–28 Min.',
    ingredients: [
      { name: 'Chicken Wings', amount: 1000, unit: 'g' },
      { name: 'BBQ-Sauce', amount: 150, unit: 'ml' },
      { name: 'Öl', amount: 1, unit: 'EL' },
      { name: 'Knoblauchpulver', amount: 1, unit: 'TL' },
      { name: 'Salz', amount: 1, unit: 'TL' }
    ],
    steps: ['Wings trocken tupfen und würzen.', 'Im Airfryer knusprig garen.', 'Mit BBQ-Sauce glasieren.', 'Noch 3 Minuten karamellisieren lassen.']
  },
  {
    id: 'caprese-chicken',
    title: 'Caprese Hähnchen',
    country: 'Italienisch',
    type: 'Hauptgericht',
    time: 30,
    servings: 4,
    description: 'Hähnchenbrust mit Tomate, Mozzarella und Basilikum.',
    tags: ['Proteinreich', 'Italien', 'Familie'],
    setting: 'Roast · 180 °C · 22–26 Min.',
    ingredients: [
      { name: 'Hähnchenbrust', amount: 4, unit: 'Stk.' },
      { name: 'Mozzarella', amount: 250, unit: 'g' },
      { name: 'Tomaten', amount: 3, unit: 'Stk.' },
      { name: 'Pesto', amount: 4, unit: 'EL' },
      { name: 'Basilikum', amount: 0.5, unit: 'Bund' }
    ],
    steps: ['Hähnchen würzen und mit Pesto bestreichen.', 'Im Airfryer vorgaren.', 'Mit Tomate und Mozzarella belegen.', 'Fertig garen, bis der Käse schmilzt.']
  }
];
