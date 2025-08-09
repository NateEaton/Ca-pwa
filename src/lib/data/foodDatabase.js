// Database metadata for source tracking and abstraction
export const DATABASE_METADATA = {
  source: "USDA-FDC",
  label: "USDA FoodData Central",
  name: "USDA FoodData Central - Foundation & SR Legacy",
  description: "Comprehensive food database combining USDA FoodData Central (Foundation and SR Legacy sources) with previous USDA Calcium Content Reference data",
  version: "2025.2",
  recordCount: 1006,
  created: "2025-08-09",
  author: "USDA Agricultural Research Service",
  sourceUrls: [
    {
      name: "USDA FoodData Central",
      url: "https://fdc.nal.usda.gov/food-search"
    },
    {
      name: "USDA Calcium Content Reference",
      url: "https://www.nal.usda.gov/sites/default/files/page-files/calcium.pdf"
    }
  ],
  notes: "Data programmatically filtered to one element per food type, excluding branded foods from SR Legacy, then merged with abridged calcium reference data"
};

// Default bundled food database
export const DEFAULT_FOOD_DATABASE = [
  {
    "id": 1,
    "name": "Cheese, swiss",
    "measure": "1.0 cups, diced",
    "calcium": 1175,
    "isCustom": false
  },
  {
    "id": 2,
    "name": "Whey, sweet, dried",
    "measure": "1.0 cups",
    "calcium": 1154,
    "isCustom": false
  },
  {
    "id": 3,
    "name": "Cheese, pasteurized process, swiss",
    "measure": "1.0 cups, diced",
    "calcium": 1081,
    "isCustom": false
  },
  {
    "id": 4,
    "name": "Cheese, provolone",
    "measure": "1.0 cups, diced",
    "calcium": 998,
    "isCustom": false
  },
  {
    "id": 5,
    "name": "Cheese, muenster",
    "measure": "1.0 cups, diced",
    "calcium": 946,
    "isCustom": false
  },
  {
    "id": 6,
    "name": "Cheese, cheddar",
    "measure": "1.0 cups, diced",
    "calcium": 937,
    "isCustom": false
  },
  {
    "id": 7,
    "name": "Cheese, mozzarella, low moisture, part-skim",
    "measure": "1.0 cups, diced",
    "calcium": 920,
    "isCustom": false
  },
  {
    "id": 8,
    "name": "Tofu, raw, firm, prepared with calcium sulfate",
    "measure": "0.5 cups",
    "calcium": 861,
    "isCustom": false
  },
  {
    "id": 9,
    "name": "Cheese, mexican, queso chihuahua",
    "measure": "1.0 cups, diced",
    "calcium": 859,
    "isCustom": false
  },
  {
    "id": 10,
    "name": "Cheese, parmesan, grated",
    "measure": "1.0 cups",
    "calcium": 853,
    "isCustom": false
  },
  {
    "id": 11,
    "name": "Cheese spread, pasteurized process, American",
    "measure": "1.0 cups, diced",
    "calcium": 787,
    "isCustom": false
  },
  {
    "id": 12,
    "name": "Cheese food, pasteurized process, American, vitamin D fortified",
    "measure": "1.0 cups",
    "calcium": 771,
    "isCustom": false
  },
  {
    "id": 13,
    "name": "Cheese, feta",
    "measure": "1.0 cups, crumbled",
    "calcium": 740,
    "isCustom": false
  },
  {
    "id": 14,
    "name": "Cheese substitute, mozzarella",
    "measure": "1 cubic inch",
    "calcium": 110,
    "isCustom": false
  },
  {
    "id": 15,
    "name": "Beverages, Whey protein powder isolate",
    "measure": "3.0 scoop",
    "calcium": 600,
    "isCustom": false
  },
  {
    "id": 16,
    "name": "Cheese, mozzarella, whole milk",
    "measure": "1.0 cups, shredded",
    "calcium": 566,
    "isCustom": false
  },
  {
    "id": 17,
    "name": "Cornmeal, white, self-rising, bolted, with wheat flour added, enriched",
    "measure": "1.0 cups",
    "calcium": 508,
    "isCustom": false
  },
  {
    "id": 18,
    "name": "Soybeans, green, raw",
    "measure": "1.0 cups",
    "calcium": 504,
    "isCustom": false
  },
  {
    "id": 19,
    "name": "Cornmeal, white, self-rising, degermed, enriched",
    "measure": "1.0 cups",
    "calcium": 483,
    "isCustom": false
  },
  {
    "id": 20,
    "name": "Milk, sheep, fluid",
    "measure": "1 cup",
    "calcium": 473,
    "isCustom": false
  },
  {
    "id": 21,
    "name": "Beverages, almond milk, chocolate, ready-to-drink",
    "measure": "8.0 fl oz",
    "calcium": 451,
    "isCustom": false
  },
  {
    "id": 22,
    "name": "Beverages, almond milk, sweetened, vanilla flavor, ready-to-drink",
    "measure": "8.0 fl oz",
    "calcium": 451,
    "isCustom": false
  },
  {
    "id": 23,
    "name": "Milk, dry, nonfat, regular, without added vitamin A and vitamin D",
    "measure": "0.25 cups",
    "calcium": 377,
    "isCustom": false
  },
  {
    "id": 24,
    "name": "Nuts, almonds, dry roasted, without salt added",
    "measure": "1.0 cups whole kernels",
    "calcium": 370,
    "isCustom": false
  },
  {
    "id": 25,
    "name": "Milk, buttermilk, dried",
    "measure": "0.25 cups",
    "calcium": 355,
    "isCustom": false
  },
  {
    "id": 26,
    "name": "Milk, nonfat, fluid, protein fortified",
    "measure": "1.0 cups",
    "calcium": 352,
    "isCustom": false
  },
  {
    "id": 27,
    "name": "Milk, reduced fat, fluid, 2% milkfat, protein fortified",
    "measure": "1.0 cups",
    "calcium": 352,
    "isCustom": false
  },
  {
    "id": 28,
    "name": "Milk, lowfat, fluid, 1% milkfat, protein fortified",
    "measure": "1.0 cups",
    "calcium": 349,
    "isCustom": false
  },
  {
    "id": 29,
    "name": "Orange juice, chilled, includes from concentrate, with added calcium",
    "measure": "1.0 cups",
    "calcium": 349,
    "isCustom": false
  },
  {
    "id": 30,
    "name": "Cheese, ricotta, part skim milk",
    "measure": "0.5 cups",
    "calcium": 337,
    "isCustom": false
  },
  {
    "id": 31,
    "name": "Eggnog",
    "measure": "1 fl oz",
    "calcium": 41.3,
    "isCustom": false
  },
  {
    "id": 32,
    "name": "Wheat flour, white, all-purpose, enriched, calcium-fortified",
    "measure": "1.0 cups",
    "calcium": 315,
    "isCustom": false
  },
  {
    "id": 33,
    "name": "Yogurt, plain, low fat",
    "measure": "1.0 container (6 oz)",
    "calcium": 311,
    "isCustom": false
  },
  {
    "id": 34,
    "name": "Milk, producer, fluid, 3.7% milkfat",
    "measure": "1.0 cups",
    "calcium": 290,
    "isCustom": false
  },
  {
    "id": 35,
    "name": "Yogurt, fruit, low fat, 11g protein/8 oz",
    "measure": "1.0 container (6 oz)",
    "calcium": 287,
    "isCustom": false
  },
  {
    "id": 36,
    "name": "Milk, chocolate, fluid, commercial, whole",
    "measure": "1.0 cups",
    "calcium": 280,
    "isCustom": false
  },
  {
    "id": 37,
    "name": "Amaranth leaves, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 276,
    "isCustom": false
  },
  {
    "id": 38,
    "name": "Beans, pink, mature seeds, raw",
    "measure": "1.0 cups",
    "calcium": 273,
    "isCustom": false
  },
  {
    "id": 39,
    "name": "Milk, chocolate, fluid, commercial, reduced fat",
    "measure": "1.0 cups",
    "calcium": 272,
    "isCustom": false
  },
  {
    "id": 40,
    "name": "Soybeans, green, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 261,
    "isCustom": false
  },
  {
    "id": 41,
    "name": "Cheese, ricotta, whole milk",
    "measure": "0.5 cups",
    "calcium": 255,
    "isCustom": false
  },
  {
    "id": 42,
    "name": "Turnip greens, frozen, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 249,
    "isCustom": false
  },
  {
    "id": 43,
    "name": "Garlic, raw",
    "measure": "1 tsp",
    "calcium": 5.07,
    "isCustom": false
  },
  {
    "id": 44,
    "name": "Fish, salmon, pink, canned, drained solids",
    "measure": "3.0 oz",
    "calcium": 241,
    "isCustom": false
  },
  {
    "id": 45,
    "name": "Beans, black, mature seeds, raw",
    "measure": "1.0 cups",
    "calcium": 239,
    "isCustom": false
  },
  {
    "id": 46,
    "name": "Yogurt, fruit, low fat, 9g protein/8 oz",
    "measure": "1.0 container (6 oz)",
    "calcium": 235,
    "isCustom": false
  },
  {
    "id": 47,
    "name": "Bagels, plain, enriched",
    "measure": "1.0 bagel",
    "calcium": 217,
    "isCustom": false
  },
  {
    "id": 48,
    "name": "Biscuits, plain or buttermilk, dry mix",
    "measure": "1 oz",
    "calcium": 50.7,
    "isCustom": false
  },
  {
    "id": 49,
    "name": "Cowpeas (blackeyes), immature seeds, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 211,
    "isCustom": false
  },
  {
    "id": 50,
    "name": "Yogurt, plain, whole milk",
    "measure": "1.0 container (6 oz)",
    "calcium": 206,
    "isCustom": false
  },
  {
    "id": 51,
    "name": "Turnip greens, cooked, boiled, drained, without salt",
    "measure": "1.0 cups, chopped",
    "calcium": 197,
    "isCustom": false
  },
  {
    "id": 52,
    "name": "Cereals, WHEATENA, cooked with water",
    "measure": "1.0 cups",
    "calcium": 194,
    "isCustom": false
  },
  {
    "id": 53,
    "name": "Spinach, canned, regular pack, solids and liquids",
    "measure": "1.0 cups",
    "calcium": 194,
    "isCustom": false
  },
  {
    "id": 54,
    "name": "Bread, white wheat",
    "measure": "1.0 slice",
    "calcium": 192,
    "isCustom": false
  },
  {
    "id": 55,
    "name": "Collards, frozen, chopped, unprepared",
    "measure": "0.33 package (10 oz)",
    "calcium": 191,
    "isCustom": false
  },
  {
    "id": 56,
    "name": "Candies, confectioner's coating, peanut butter",
    "measure": "1.0 cups chips",
    "calcium": 185,
    "isCustom": false
  },
  {
    "id": 57,
    "name": "Jute, potherb, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 184,
    "isCustom": false
  },
  {
    "id": 58,
    "name": "Cowpeas (blackeyes), immature seeds, raw",
    "measure": "1 cup",
    "calcium": 183,
    "isCustom": false
  },
  {
    "id": 59,
    "name": "Fish, salmon, pink, canned, without salt, solids with bone and liquid",
    "measure": "3.0 oz",
    "calcium": 181,
    "isCustom": false
  },
  {
    "id": 60,
    "name": "Snacks, trail mix, regular, with chocolate chips, unsalted nuts and seeds",
    "measure": "1.0 cups",
    "calcium": 159,
    "isCustom": false
  },
  {
    "id": 61,
    "name": "Cabbage, chinese (pak-choi), cooked, boiled, drained, without salt",
    "measure": "1.0 cups, shredded",
    "calcium": 158,
    "isCustom": false
  },
  {
    "id": 62,
    "name": "Corn flour, yellow, masa, enriched",
    "measure": "1.0 cups",
    "calcium": 157,
    "isCustom": false
  },
  {
    "id": 63,
    "name": "Cereals, CREAM OF WHEAT, instant, prepared with water, without salt",
    "measure": "1.0 cups",
    "calcium": 154,
    "isCustom": false
  },
  {
    "id": 64,
    "name": "Puddings, chocolate, dry mix, regular, prepared with whole milk",
    "measure": "0.5 cups",
    "calcium": 151,
    "isCustom": false
  },
  {
    "id": 65,
    "name": "Cheese, American, nonfat or fat free",
    "measure": "1.0 serving",
    "calcium": 150,
    "isCustom": false
  },
  {
    "id": 66,
    "name": "Cheese, blue",
    "measure": "1.0 oz",
    "calcium": 150,
    "isCustom": false
  },
  {
    "id": 67,
    "name": "Potatoes, scalloped, home-prepared with butter",
    "measure": "1.0 cups",
    "calcium": 140,
    "isCustom": false
  },
  {
    "id": 68,
    "name": "Pancakes, buckwheat, dry mix, incomplete",
    "measure": "1.0 oz",
    "calcium": 135,
    "isCustom": false
  },
  {
    "id": 69,
    "name": "Cereals, oats, instant, fortified, with raisins and spice, prepared with water",
    "measure": "1.0 cups",
    "calcium": 134,
    "isCustom": false
  },
  {
    "id": 70,
    "name": "Beans, baked, canned, with pork",
    "measure": "1.0 cups",
    "calcium": 134,
    "isCustom": false
  },
  {
    "id": 71,
    "name": "Nuts, hazelnuts or filberts",
    "measure": "1.0 cups, chopped",
    "calcium": 131,
    "isCustom": false
  },
  {
    "id": 72,
    "name": "Beans, adzuki, mature seeds, raw",
    "measure": "1.0 cups",
    "calcium": 130,
    "isCustom": false
  },
  {
    "id": 73,
    "name": "Currants, zante, dried",
    "measure": "1.0 cups",
    "calcium": 127,
    "isCustom": false
  },
  {
    "id": 74,
    "name": "Cheese, cottage, lowfat, 2% milkfat",
    "measure": "4.0 oz",
    "calcium": 125,
    "isCustom": false
  },
  {
    "id": 75,
    "name": "Turnip greens, frozen, cooked, boiled, drained, with salt",
    "measure": "0.5 cups",
    "calcium": 125,
    "isCustom": false
  },
  {
    "id": 76,
    "name": "Cardoon, raw",
    "measure": "1 cup, shredded",
    "calcium": 125,
    "isCustom": false
  },
  {
    "id": 77,
    "name": "Teff, cooked",
    "measure": "1 cup",
    "calcium": 123,
    "isCustom": false
  },
  {
    "id": 78,
    "name": "Oranges, raw, with peel",
    "measure": "1 fruit without seeds",
    "calcium": 111,
    "isCustom": false
  },
  {
    "id": 79,
    "name": "Seeds, sunflower seed kernels, oil roasted, without salt",
    "measure": "1.0 cups",
    "calcium": 117,
    "isCustom": false
  },
  {
    "id": 80,
    "name": "Sauce, cheese, ready-to-serve",
    "measure": "0.25 cups",
    "calcium": 116,
    "isCustom": false
  },
  {
    "id": 81,
    "name": "Cereals ready-to-eat, QUAKER Oatmeal Squares, Golden Maple",
    "measure": "1.0 cups",
    "calcium": 113,
    "isCustom": false
  },
  {
    "id": 82,
    "name": "Cheese, camembert",
    "measure": "1.0 oz",
    "calcium": 110,
    "isCustom": false
  },
  {
    "id": 83,
    "name": "Milk, canned, condensed, sweetened",
    "measure": "1.0 fl oz",
    "calcium": 108,
    "isCustom": false
  },
  {
    "id": 84,
    "name": "Fish, herring, Atlantic, pickled",
    "measure": "1.0 cups",
    "calcium": 108,
    "isCustom": false
  },
  {
    "id": 85,
    "name": "Beans, black turtle, mature seeds, cooked, boiled, without salt",
    "measure": "1.0 cups",
    "calcium": 102,
    "isCustom": false
  },
  {
    "id": 86,
    "name": "Orange juice, frozen concentrate, unsweetened, undiluted",
    "measure": "1.0 cups",
    "calcium": 100,
    "isCustom": false
  },
  {
    "id": 87,
    "name": "Mollusks, oyster, eastern, wild, cooked, moist heat",
    "measure": "3.0 oz",
    "calcium": 99,
    "isCustom": false
  },
  {
    "id": 88,
    "name": "Turnip greens, frozen, unprepared",
    "measure": "0.5 cups, chopped or diced",
    "calcium": 97,
    "isCustom": false
  },
  {
    "id": 89,
    "name": "Cheese, cottage, creamed, large or small curd",
    "measure": "4.0 oz",
    "calcium": 94,
    "isCustom": false
  },
  {
    "id": 90,
    "name": "Cereals ready-to-eat, granola, homemade",
    "measure": "1 oz",
    "calcium": 21.5,
    "isCustom": false
  },
  {
    "id": 91,
    "name": "Milk, canned, evaporated, nonfat, with added vitamin A and vitamin D",
    "measure": "1.0 fl oz",
    "calcium": 93,
    "isCustom": false
  },
  {
    "id": 92,
    "name": "Kale, frozen, unprepared",
    "measure": "1.0 cups",
    "calcium": 91,
    "isCustom": false
  },
  {
    "id": 93,
    "name": "Soup, black bean, canned, condensed",
    "measure": "1.0 cups",
    "calcium": 90,
    "isCustom": false
  },
  {
    "id": 94,
    "name": "Purslane, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 90,
    "isCustom": false
  },
  {
    "id": 95,
    "name": "Pokeberry shoots, (poke), cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 87,
    "isCustom": false
  },
  {
    "id": 96,
    "name": "Broccoli, frozen, chopped, unprepared",
    "measure": "1.0 cups",
    "calcium": 87,
    "isCustom": false
  },
  {
    "id": 97,
    "name": "Tomatoes, red, ripe, canned, stewed",
    "measure": "1.0 cups",
    "calcium": 87,
    "isCustom": false
  },
  {
    "id": 98,
    "name": "Peanuts, all types, dry-roasted, without salt",
    "measure": "1.0 cups",
    "calcium": 85,
    "isCustom": false
  },
  {
    "id": 99,
    "name": "Squash, winter, butternut, cooked, baked, without salt",
    "measure": "1.0 cups, cubes",
    "calcium": 84,
    "isCustom": false
  },
  {
    "id": 100,
    "name": "Beans, black turtle, mature seeds, canned",
    "measure": "1.0 cups",
    "calcium": 84,
    "isCustom": false
  },
  {
    "id": 101,
    "name": "Cream, fluid, light whipping",
    "measure": "1.0 cups, whipped",
    "calcium": 83,
    "isCustom": false
  },
  {
    "id": 102,
    "name": "Milk, canned, evaporated, with added vitamin D",
    "measure": "1.0 fl oz",
    "calcium": 82,
    "isCustom": false
  },
  {
    "id": 103,
    "name": "Milk substitutes, fluid, with lauric acid oil",
    "measure": "1 cup",
    "calcium": 80.5,
    "isCustom": false
  },
  {
    "id": 104,
    "name": "Tortillas, ready-to-bake or -fry, flour, shelf stable",
    "measure": "1.0 tortilla",
    "calcium": 80,
    "isCustom": false
  },
  {
    "id": 105,
    "name": "Tomatoes, red, ripe, canned, packed in tomato juice",
    "measure": "1.0 cups",
    "calcium": 79,
    "isCustom": false
  },
  {
    "id": 106,
    "name": "Cream, fluid, heavy whipping",
    "measure": "1.0 cups, whipped",
    "calcium": 79,
    "isCustom": false
  },
  {
    "id": 107,
    "name": "Mollusks, oyster, eastern, wild, cooked, dry heat",
    "measure": "3.0 oz",
    "calcium": 78,
    "isCustom": false
  },
  {
    "id": 108,
    "name": "Peanuts, valencia, oil-roasted, without salt",
    "measure": "1.0 cups",
    "calcium": 78,
    "isCustom": false
  },
  {
    "id": 109,
    "name": "Seeds, sunflower seed kernels, toasted, without salt",
    "measure": "1.0 cups",
    "calcium": 76,
    "isCustom": false
  },
  {
    "id": 110,
    "name": "Potatoes, mashed, dehydrated, prepared from granules with milk",
    "measure": "1.0 cups",
    "calcium": 74,
    "isCustom": false
  },
  {
    "id": 111,
    "name": "Apricots, dehydrated (low-moisture), sulfured, uncooked",
    "measure": "1.0 cups",
    "calcium": 73,
    "isCustom": false
  },
  {
    "id": 112,
    "name": "Tangerines, (mandarin oranges), raw",
    "measure": "1 small (2-1/4 dia)",
    "calcium": 28.1,
    "isCustom": false
  },
  {
    "id": 113,
    "name": "Oranges, raw, California, valencias",
    "measure": "1.0 cups sections",
    "calcium": 72,
    "isCustom": false
  },
  {
    "id": 114,
    "name": "Peas, edible-podded, frozen, unprepared",
    "measure": "1.0 cups",
    "calcium": 72,
    "isCustom": false
  },
  {
    "id": 115,
    "name": "Edamame, frozen, unprepared",
    "measure": "1.0 cups",
    "calcium": 71,
    "isCustom": false
  },
  {
    "id": 116,
    "name": "Bread, cornbread, prepared from recipe, made with low fat (2%) milk",
    "measure": "1.0 oz",
    "calcium": 71,
    "isCustom": false
  },
  {
    "id": 117,
    "name": "Fish, herring, Pacific, raw",
    "measure": "3.0 oz",
    "calcium": 71,
    "isCustom": false
  },
  {
    "id": 118,
    "name": "Figs, canned, water pack, solids and liquids",
    "measure": "1.0 cups",
    "calcium": 69,
    "isCustom": false
  },
  {
    "id": 119,
    "name": "Cheese, cottage, lowfat, 1% milkfat",
    "measure": "4.0 oz",
    "calcium": 69,
    "isCustom": false
  },
  {
    "id": 120,
    "name": "Bread, cornbread, dry mix, prepared with 2% milk",
    "measure": "1.0 muffin",
    "calcium": 69,
    "isCustom": false
  },
  {
    "id": 121,
    "name": "Fish, mackerel, jack, canned, drained solids",
    "measure": "1.0 oz, boneless",
    "calcium": 68,
    "isCustom": false
  },
  {
    "id": 122,
    "name": "Okra, frozen, cooked, boiled, drained, without salt",
    "measure": "0.5 cups slices",
    "calcium": 68,
    "isCustom": false
  },
  {
    "id": 123,
    "name": "Potatoes, mashed, dehydrated, prepared from flakes without milk",
    "measure": "1.0 cups",
    "calcium": 67,
    "isCustom": false
  },
  {
    "id": 124,
    "name": "Peas and carrots, frozen, cooked, boiled, drained, without salt",
    "measure": "1.0 package (10 oz)",
    "calcium": 64,
    "isCustom": false
  },
  {
    "id": 125,
    "name": "Squash, winter, acorn, cooked, boiled, mashed, without salt",
    "measure": "1.0 cups, mashed",
    "calcium": 64,
    "isCustom": false
  },
  {
    "id": 126,
    "name": "Nuts, butternuts, dried",
    "measure": "1.0 cups",
    "calcium": 64,
    "isCustom": false
  },
  {
    "id": 127,
    "name": "Celery, cooked, boiled, drained, without salt",
    "measure": "1.0 cups, diced",
    "calcium": 63,
    "isCustom": false
  },
  {
    "id": 128,
    "name": "Fish, pike, northern, cooked, dry heat",
    "measure": "3.0 oz",
    "calcium": 62,
    "isCustom": false
  },
  {
    "id": 129,
    "name": "Currants, european black, raw",
    "measure": "1.0 cups",
    "calcium": 62,
    "isCustom": false
  },
  {
    "id": 130,
    "name": "Seeds, pumpkin and squash seed kernels, roasted, with salt added",
    "measure": "1.0 cups",
    "calcium": 61,
    "isCustom": false
  },
  {
    "id": 131,
    "name": "Burdock root, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 61,
    "isCustom": false
  },
  {
    "id": 132,
    "name": "Kiwifruit, green, raw",
    "measure": "1 fruit (2 dia)",
    "calcium": 23.5,
    "isCustom": false
  },
  {
    "id": 133,
    "name": "Broccoli, frozen, chopped, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 61,
    "isCustom": false
  },
  {
    "id": 134,
    "name": "Blueberries, wild, canned, heavy syrup, drained",
    "measure": "1.0 cups",
    "calcium": 61,
    "isCustom": false
  },
  {
    "id": 135,
    "name": "Cream, whipped, cream topping, pressurized",
    "measure": "1.0 cups",
    "calcium": 61,
    "isCustom": false
  },
  {
    "id": 136,
    "name": "Cheese, cottage, creamed, with fruit",
    "measure": "4.0 oz",
    "calcium": 60,
    "isCustom": false
  },
  {
    "id": 137,
    "name": "Cabbage, chinese (pe-tsai), raw",
    "measure": "1.0 cups, shredded",
    "calcium": 59,
    "isCustom": false
  },
  {
    "id": 138,
    "name": "Puddings, tapioca, ready-to-eat, fat free",
    "measure": "1.0 container",
    "calcium": 58,
    "isCustom": false
  },
  {
    "id": 139,
    "name": "Cake, shortcake, biscuit-type, prepared from recipe",
    "measure": "1.0 oz",
    "calcium": 58,
    "isCustom": false
  },
  {
    "id": 140,
    "name": "Fish, burbot, cooked, dry heat",
    "measure": "1.0 fillet",
    "calcium": 58,
    "isCustom": false
  },
  {
    "id": 141,
    "name": "Lima beans, immature seeds, frozen, baby, unprepared",
    "measure": "1.0 cups",
    "calcium": 57,
    "isCustom": false
  },
  {
    "id": 142,
    "name": "Oat flour, partially debranned",
    "measure": "1 cup",
    "calcium": 57.2,
    "isCustom": false
  },
  {
    "id": 143,
    "name": "Cake, chocolate, prepared from recipe without frosting",
    "measure": "1.0 piece",
    "calcium": 57,
    "isCustom": false
  },
  {
    "id": 144,
    "name": "Beans, snap, green, frozen, cooked, boiled, drained without salt",
    "measure": "1.0 cups",
    "calcium": 57,
    "isCustom": false
  },
  {
    "id": 145,
    "name": "Onions, frozen, whole, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 57,
    "isCustom": false
  },
  {
    "id": 146,
    "name": "Grapefruit juice, white, frozen concentrate, unsweetened, undiluted",
    "measure": "1.0 can (6 fl oz)",
    "calcium": 56,
    "isCustom": false
  },
  {
    "id": 147,
    "name": "Muffins, English, mixed-grain",
    "measure": "1.0 oz",
    "calcium": 56,
    "isCustom": false
  },
  {
    "id": 148,
    "name": "Nuts, almond butter, plain, with salt added",
    "measure": "1.0 tbsp",
    "calcium": 56,
    "isCustom": false
  },
  {
    "id": 149,
    "name": "Soybeans, mature seeds, sprouted, cooked, steamed",
    "measure": "1.0 cups",
    "calcium": 55,
    "isCustom": false
  },
  {
    "id": 150,
    "name": "Pasta, fresh-refrigerated, spinach, as purchased",
    "measure": "4.0 oz",
    "calcium": 55,
    "isCustom": false
  },
  {
    "id": 151,
    "name": "Beans, pinto, immature seeds, frozen, unprepared",
    "measure": "0.33 package (10 oz)",
    "calcium": 55,
    "isCustom": false
  },
  {
    "id": 152,
    "name": "Lima beans, immature seeds, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 54,
    "isCustom": false
  },
  {
    "id": 153,
    "name": "Bread, pan dulce, sweet yeast bread",
    "measure": "1.0 slice",
    "calcium": 54,
    "isCustom": false
  },
  {
    "id": 154,
    "name": "Potatoes, Russet, flesh and skin, baked",
    "measure": "1.0 potato large",
    "calcium": 54,
    "isCustom": false
  },
  {
    "id": 155,
    "name": "Crustaceans, spiny lobster, mixed species, cooked, moist heat",
    "measure": "3.0 oz",
    "calcium": 54,
    "isCustom": false
  },
  {
    "id": 156,
    "name": "Kale, raw",
    "measure": "1 cup, pieces of ~1",
    "calcium": 52.3,
    "isCustom": false
  },
  {
    "id": 157,
    "name": "Water convolvulus, cooked, boiled, drained, with salt",
    "measure": "1.0 cups, chopped",
    "calcium": 53,
    "isCustom": false
  },
  {
    "id": 158,
    "name": "Mollusks, oyster, eastern, cooked, breaded and fried",
    "measure": "3.0 oz",
    "calcium": 53,
    "isCustom": false
  },
  {
    "id": 159,
    "name": "Seeds, lotus seeds, dried",
    "measure": "1.0 cups",
    "calcium": 52,
    "isCustom": false
  },
  {
    "id": 160,
    "name": "Pork, fresh, loin, country-style ribs, separable lean only",
    "measure": "3.0 oz",
    "calcium": 52,
    "isCustom": false
  },
  {
    "id": 161,
    "name": "Rice, white, long-grain, regular, raw, unenriched",
    "measure": "1 cup",
    "calcium": 51.8,
    "isCustom": false
  },
  {
    "id": 162,
    "name": "Soup, chicken with rice, canned, condensed",
    "measure": "0.5 cups",
    "calcium": 52,
    "isCustom": false
  },
  {
    "id": 163,
    "name": "Bread, pita, white, enriched",
    "measure": "1.0 pita, large",
    "calcium": 52,
    "isCustom": false
  },
  {
    "id": 164,
    "name": "Bread, whole-wheat, commercially prepared",
    "measure": "1.0 slice",
    "calcium": 52,
    "isCustom": false
  },
  {
    "id": 165,
    "name": "Grapefruit, raw, pink and red, all areas",
    "measure": "1.0 cups sections",
    "calcium": 51,
    "isCustom": false
  },
  {
    "id": 166,
    "name": "Lima beans, immature seeds, frozen, baby, cooked",
    "measure": "1.0 cups",
    "calcium": 50,
    "isCustom": false
  },
  {
    "id": 167,
    "name": "Turnips, frozen, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 50,
    "isCustom": false
  },
  {
    "id": 168,
    "name": "Pork, fresh, loin, country-style ribs, separable lean and fat",
    "measure": "3.0 oz",
    "calcium": 48,
    "isCustom": false
  },
  {
    "id": 169,
    "name": "Apricots, dried, sulfured, stewed, without added sugar",
    "measure": "1.0 cups, halves",
    "calcium": 48,
    "isCustom": false
  },
  {
    "id": 170,
    "name": "Barley flour or meal",
    "measure": "1 cup",
    "calcium": 47.4,
    "isCustom": false
  },
  {
    "id": 171,
    "name": "Bread, reduced-calorie, wheat",
    "measure": "1.0 oz",
    "calcium": 46,
    "isCustom": false
  },
  {
    "id": 172,
    "name": "Turkey, all classes, back, meat and skin, cooked, roasted",
    "measure": "1.0 cups, chopped",
    "calcium": 46,
    "isCustom": false
  },
  {
    "id": 173,
    "name": "Boysenberries, canned, heavy syrup",
    "measure": "1.0 cups",
    "calcium": 46,
    "isCustom": false
  },
  {
    "id": 174,
    "name": "Yardlong bean, cooked, boiled, drained, without salt",
    "measure": "1.0 cups slices",
    "calcium": 46,
    "isCustom": false
  },
  {
    "id": 175,
    "name": "Squash, winter, butternut, frozen, cooked, boiled, without salt",
    "measure": "1.0 cups, mashed",
    "calcium": 46,
    "isCustom": false
  },
  {
    "id": 176,
    "name": "Snacks, tortilla chips, nacho-flavor, reduced fat",
    "measure": "1.0 oz",
    "calcium": 45,
    "isCustom": false
  },
  {
    "id": 177,
    "name": "Mollusks, octopus, common, raw",
    "measure": "3.0 oz",
    "calcium": 45,
    "isCustom": false
  },
  {
    "id": 178,
    "name": "Tomato products, canned, puree, without salt added",
    "measure": "1.0 cups",
    "calcium": 45,
    "isCustom": false
  },
  {
    "id": 179,
    "name": "Soup, beef and vegetables, canned, ready-to-serve",
    "measure": "1.0 cups",
    "calcium": 45,
    "isCustom": false
  },
  {
    "id": 180,
    "name": "Beet greens, raw",
    "measure": "0.5 cup (1 pieces)",
    "calcium": 22.2,
    "isCustom": false
  },
  {
    "id": 181,
    "name": "Beets, canned, regular pack, solids and liquids",
    "measure": "1.0 cups",
    "calcium": 44,
    "isCustom": false
  },
  {
    "id": 182,
    "name": "Puddings, chocolate, ready-to-eat, fat free",
    "measure": "1.0 serving 4 oz",
    "calcium": 44,
    "isCustom": false
  },
  {
    "id": 183,
    "name": "Blackberries, frozen, unsweetened",
    "measure": "1.0 cups, unthawed",
    "calcium": 44,
    "isCustom": false
  },
  {
    "id": 184,
    "name": "Sweet potato, cooked, baked in skin, flesh, with salt",
    "measure": "1.0 medium",
    "calcium": 43,
    "isCustom": false
  },
  {
    "id": 185,
    "name": "Broccoli raab, raw",
    "measure": "1 stalk",
    "calcium": 20.5,
    "isCustom": false
  },
  {
    "id": 186,
    "name": "Peas, mature seeds, sprouted, raw",
    "measure": "1.0 cups",
    "calcium": 43,
    "isCustom": false
  },
  {
    "id": 187,
    "name": "Bread, cheese",
    "measure": "1.0 slice",
    "calcium": 43,
    "isCustom": false
  },
  {
    "id": 188,
    "name": "Fish, yellowtail, mixed species, cooked, dry heat",
    "measure": "0.5 fillet",
    "calcium": 42,
    "isCustom": false
  },
  {
    "id": 189,
    "name": "Seeds, sesame flour, low-fat",
    "measure": "1.0 oz",
    "calcium": 42,
    "isCustom": false
  },
  {
    "id": 190,
    "name": "Carrots, raw",
    "measure": "1 slice",
    "calcium": 0.99,
    "isCustom": false
  },
  {
    "id": 191,
    "name": "Sausage, pork and turkey, pre-cooked",
    "measure": "1.0 serving",
    "calcium": 42,
    "isCustom": false
  },
  {
    "id": 192,
    "name": "Peas, edible-podded, raw",
    "measure": "1.0 cups, chopped",
    "calcium": 42,
    "isCustom": false
  },
  {
    "id": 193,
    "name": "Cake, angelfood, dry mix, prepared",
    "measure": "1.0 piece",
    "calcium": 42,
    "isCustom": false
  },
  {
    "id": 194,
    "name": "Tomato products, canned, sauce, with onions",
    "measure": "1.0 cups",
    "calcium": 42,
    "isCustom": false
  },
  {
    "id": 195,
    "name": "Cress, garden, raw",
    "measure": "1 sprig",
    "calcium": 0.81,
    "isCustom": false
  },
  {
    "id": 196,
    "name": "Bread, salvadoran sweet cheese",
    "measure": "1.0 serving",
    "calcium": 40,
    "isCustom": false
  },
  {
    "id": 197,
    "name": "Parmesan cheese topping, fat free",
    "measure": "1 tablespoon",
    "calcium": 40,
    "isCustom": false
  },
  {
    "id": 198,
    "name": "Chocolate-flavored hazelnut spread",
    "measure": "1 serving 2 TBSP",
    "calcium": 40,
    "isCustom": false
  },
  {
    "id": 199,
    "name": "Soup, cream of celery, canned, prepared with equal volume water",
    "measure": "1.0 cups",
    "calcium": 40,
    "isCustom": false
  },
  {
    "id": 200,
    "name": "Cream puff, eclair, custard or cream filled, iced",
    "measure": "4 oz",
    "calcium": 39.6,
    "isCustom": false
  },
  {
    "id": 201,
    "name": "Cake, angelfood, commercially prepared",
    "measure": "1.0 piece",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 202,
    "name": "Nuts, chestnuts, european, raw, unpeeled",
    "measure": "1.0 cups",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 203,
    "name": "Fish, salmon, coho, wild, cooked, moist heat",
    "measure": "3.0 oz",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 204,
    "name": "Cowpeas (blackeyes), immature seeds, frozen, cooked",
    "measure": "1.0 cups",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 205,
    "name": "Mollusks, mussel, blue, raw",
    "measure": "1.0 cups",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 206,
    "name": "Asparagus, canned, drained solids",
    "measure": "1.0 cups",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 207,
    "name": "Peaches, dehydrated (low-moisture), sulfured, stewed",
    "measure": "1.0 cups",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 208,
    "name": "Squash, summer, zucchini, italian style, canned",
    "measure": "1.0 cups",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 209,
    "name": "Cake, coffeecake, cinnamon with crumb topping, dry mix, prepared",
    "measure": "1.0 oz",
    "calcium": 39,
    "isCustom": false
  },
  {
    "id": 210,
    "name": "Lima beans, immature seeds, frozen, fordhook, unprepared",
    "measure": "1.0 cups",
    "calcium": 38,
    "isCustom": false
  },
  {
    "id": 211,
    "name": "Squash, summer, crookneck and straightneck, frozen, cooked",
    "measure": "1.0 cups slices",
    "calcium": 38,
    "isCustom": false
  },
  {
    "id": 212,
    "name": "Loganberries, frozen",
    "measure": "1.0 cups, unthawed",
    "calcium": 38,
    "isCustom": false
  },
  {
    "id": 213,
    "name": "Carrots, canned, no salt added, solids and liquids",
    "measure": "0.5 cups slices",
    "calcium": 38,
    "isCustom": false
  },
  {
    "id": 214,
    "name": "Gooseberries, raw",
    "measure": "1 cup",
    "calcium": 37.5,
    "isCustom": false
  },
  {
    "id": 215,
    "name": "Breadfruit, raw",
    "measure": "0.25 fruit, small",
    "calcium": 16.3,
    "isCustom": false
  },
  {
    "id": 216,
    "name": "Mollusks, oyster, eastern, farmed, raw",
    "measure": "6 medium",
    "calcium": 37,
    "isCustom": false
  },
  {
    "id": 217,
    "name": "Grapefruit, sections, canned, juice pack, solids and liquids",
    "measure": "1.0 cups",
    "calcium": 37,
    "isCustom": false
  },
  {
    "id": 218,
    "name": "Leeks, (bulb and lower leaf-portion), cooked, boiled, drained",
    "measure": "1.0 leek",
    "calcium": 37,
    "isCustom": false
  },
  {
    "id": 219,
    "name": "Brussels sprouts, raw",
    "measure": "1 sprout",
    "calcium": 7.98,
    "isCustom": false
  },
  {
    "id": 220,
    "name": "Currants, red and white, raw",
    "measure": "1 cup",
    "calcium": 37,
    "isCustom": false
  },
  {
    "id": 221,
    "name": "Onions, raw",
    "measure": "1.0 cups, chopped",
    "calcium": 37,
    "isCustom": false
  },
  {
    "id": 222,
    "name": "Grapefruit, sections, canned, water pack, solids and liquids",
    "measure": "1.0 cups",
    "calcium": 37,
    "isCustom": false
  },
  {
    "id": 223,
    "name": "Carrots, canned, regular pack, drained solids",
    "measure": "1.0 cups, sliced",
    "calcium": 36,
    "isCustom": false
  },
  {
    "id": 224,
    "name": "Crackers, standard snack-type, sandwich, with cheese filling",
    "measure": "0.5 oz",
    "calcium": 36,
    "isCustom": false
  },
  {
    "id": 225,
    "name": "Peas, green, raw",
    "measure": "1.0 cups",
    "calcium": 36,
    "isCustom": false
  },
  {
    "id": 226,
    "name": "Bread, wheat",
    "measure": "1.0 slice",
    "calcium": 36,
    "isCustom": false
  },
  {
    "id": 227,
    "name": "Hyacinth-beans, immature seeds, cooked, boiled, drained",
    "measure": "1.0 cups",
    "calcium": 36,
    "isCustom": false
  },
  {
    "id": 228,
    "name": "Boysenberries, frozen, unsweetened",
    "measure": "1.0 cups, unthawed",
    "calcium": 36,
    "isCustom": false
  },
  {
    "id": 229,
    "name": "Vegetable juice cocktail, canned",
    "measure": "1.0 cups",
    "calcium": 35,
    "isCustom": false
  },
  {
    "id": 230,
    "name": "Egg, yolk, raw, frozen, sugared, pasteurized",
    "measure": "1.0 oz",
    "calcium": 35,
    "isCustom": false
  },
  {
    "id": 231,
    "name": "Bread, protein (includes gluten)",
    "measure": "1.0 oz",
    "calcium": 35,
    "isCustom": false
  },
  {
    "id": 232,
    "name": "Squash, winter, hubbard, baked, with salt",
    "measure": "1.0 cups, cubes",
    "calcium": 35,
    "isCustom": false
  },
  {
    "id": 233,
    "name": "Crackers, cheese, sandwich-type with cheese filling",
    "measure": "6.0 cracker",
    "calcium": 35,
    "isCustom": false
  },
  {
    "id": 234,
    "name": "Grapefruit, raw, white, Florida",
    "measure": "1.0 cups sections",
    "calcium": 34,
    "isCustom": false
  },
  {
    "id": 235,
    "name": "Onions, frozen, whole, unprepared",
    "measure": "0.33 package (10 oz)",
    "calcium": 34,
    "isCustom": false
  },
  {
    "id": 236,
    "name": "Fish, trout, mixed species, cooked, dry heat",
    "measure": "1.0 fillet",
    "calcium": 34,
    "isCustom": false
  },
  {
    "id": 237,
    "name": "Lime juice, raw",
    "measure": "1 fl oz",
    "calcium": 4.31,
    "isCustom": false
  },
  {
    "id": 238,
    "name": "Bread, white, commercially prepared, toasted",
    "measure": "1.0 oz",
    "calcium": 34,
    "isCustom": false
  },
  {
    "id": 239,
    "name": "Soup, pea, split with ham, canned, chunky, ready-to-serve",
    "measure": "1.0 cups",
    "calcium": 34,
    "isCustom": false
  },
  {
    "id": 240,
    "name": "Sweet potato, canned, syrup pack, drained solids",
    "measure": "1.0 cups",
    "calcium": 33,
    "isCustom": false
  },
  {
    "id": 241,
    "name": "Cheese, neufchatel",
    "measure": "1.0 oz",
    "calcium": 33,
    "isCustom": false
  },
  {
    "id": 242,
    "name": "Nuts, mixed nuts, oil roasted, with peanuts, lightly salted",
    "measure": "1.0 oz",
    "calcium": 33,
    "isCustom": false
  },
  {
    "id": 243,
    "name": "Bread, reduced-calorie, oatmeal",
    "measure": "1.0 oz",
    "calcium": 33,
    "isCustom": false
  },
  {
    "id": 244,
    "name": "Tomato products, canned, sauce, with onions, green peppers, and celery",
    "measure": "1.0 cups",
    "calcium": 32,
    "isCustom": false
  },
  {
    "id": 245,
    "name": "Pork, fresh, shoulder, whole, separable lean and fat, cooked, roasted",
    "measure": "1.0 cups, diced",
    "calcium": 32,
    "isCustom": false
  },
  {
    "id": 246,
    "name": "Asparagus, frozen, cooked, boiled, drained, without salt",
    "measure": "1.0 cups",
    "calcium": 32,
    "isCustom": false
  },
  {
    "id": 247,
    "name": "Squash, summer, zucchini, includes skin, cooked, boiled, drained",
    "measure": "1.0 cups, sliced",
    "calcium": 32,
    "isCustom": false
  },
  {
    "id": 248,
    "name": "Cream, fluid, half and half",
    "measure": "1.0 fl oz",
    "calcium": 32,
    "isCustom": false
  },
  {
    "id": 249,
    "name": "Egg substitute, powder",
    "measure": "0.35 oz",
    "calcium": 32.3,
    "isCustom": false
  },
  {
    "id": 250,
    "name": "Fish, flatfish (flounder and sole species), cooked, dry heat",
    "measure": "1.0 fillet",
    "calcium": 32,
    "isCustom": false
  },
  {
    "id": 251,
    "name": "Fish, tuna, skipjack, fresh, cooked, dry heat",
    "measure": "3.0 oz",
    "calcium": 31,
    "isCustom": false
  },
  {
    "id": 252,
    "name": "Crackers, wheat, regular",
    "measure": "16.0 crackers",
    "calcium": 31,
    "isCustom": false
  },
  {
    "id": 253,
    "name": "Beans, kidney, mature seeds, sprouted, raw",
    "measure": "1.0 cups",
    "calcium": 31,
    "isCustom": false
  },
  {
    "id": 254,
    "name": "Snacks, potato chips, made from dried potatoes, cheese-flavor",
    "measure": "1.0 oz",
    "calcium": 31,
    "isCustom": false
  },
  {
    "id": 255,
    "name": "Noodles, egg, spinach, enriched, cooked",
    "measure": "1.0 cups",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 256,
    "name": "Drumstick pods, raw",
    "measure": "1 pod (15-1/3 long)",
    "calcium": 3.3,
    "isCustom": false
  },
  {
    "id": 257,
    "name": "Blackberry juice, canned",
    "measure": "1.0 cups",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 258,
    "name": "Spices, savory, ground",
    "measure": "1.0 tsp",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 259,
    "name": "Spinach, raw",
    "measure": "1 leaf",
    "calcium": 9.9,
    "isCustom": false
  },
  {
    "id": 260,
    "name": "Onions, sweet, raw",
    "measure": "1.0 NLEA serving",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 261,
    "name": "Biscuits, plain or buttermilk, refrigerated dough, higher fat",
    "measure": "1.0 biscuit",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 262,
    "name": "Radishes, raw",
    "measure": "1.0 cups slices",
    "calcium": 29,
    "isCustom": false
  },
  {
    "id": 263,
    "name": "Papayas, raw",
    "measure": "1 cup 1 pieces",
    "calcium": 29,
    "isCustom": false
  },
  {
    "id": 264,
    "name": "Crackers, wheat, sandwich, with cheese filling",
    "measure": "0.5 oz",
    "calcium": 29,
    "isCustom": false
  },
  {
    "id": 265,
    "name": "Macaroni, vegetable, enriched, dry",
    "measure": "2 oz",
    "calcium": 19.4,
    "isCustom": false
  },
  {
    "id": 266,
    "name": "Egg, whole, cooked, fried",
    "measure": "1.0 large",
    "calcium": 29,
    "isCustom": false
  },
  {
    "id": 267,
    "name": "Cereals ready-to-eat, POST, Shredded Wheat, original spoon-size",
    "measure": "1.0 cups",
    "calcium": 28,
    "isCustom": false
  },
  {
    "id": 268,
    "name": "Passion-fruit, (granadilla), purple, raw",
    "measure": "1 fruit without refuse",
    "calcium": 2.16,
    "isCustom": false
  },
  {
    "id": 269,
    "name": "Crustaceans, crab, queen, cooked, moist heat",
    "measure": "3.0 oz",
    "calcium": 28,
    "isCustom": false
  },
  {
    "id": 270,
    "name": "Chicken, broiler, rotisserie, BBQ, back meat only",
    "measure": "3.0 oz",
    "calcium": 28,
    "isCustom": false
  },
  {
    "id": 271,
    "name": "Egg, whole, cooked, poached",
    "measure": "1.0 large",
    "calcium": 28,
    "isCustom": false
  },
  {
    "id": 272,
    "name": "Egg, whole, raw, fresh",
    "measure": "1.0 large",
    "calcium": 28,
    "isCustom": false
  },
  {
    "id": 273,
    "name": "Purslane, raw",
    "measure": "1 plant",
    "calcium": 1.95,
    "isCustom": false
  },
  {
    "id": 274,
    "name": "Bread, stuffing, dry mix",
    "measure": "1.0 oz",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 275,
    "name": "Pomegranate juice, bottled",
    "measure": "1 fl oz",
    "calcium": 3.45,
    "isCustom": false
  },
  {
    "id": 276,
    "name": "Cream, fluid, light (coffee cream or table cream)",
    "measure": "1.0 fl oz",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 277,
    "name": "Cherries, sweet, canned, water pack, solids and liquids",
    "measure": "1.0 cups, pitted",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 278,
    "name": "Turkey, all classes, leg, meat and skin, cooked, roasted",
    "measure": "3.0 oz",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 279,
    "name": "Beef, shank crosscuts, separable lean only, trimmed to 1/4\" fat",
    "measure": "3.0 oz",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 280,
    "name": "Soup, onion, canned, condensed",
    "measure": "0.5 cups",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 281,
    "name": "Bologna, pork and turkey, lite",
    "measure": "1.0 serving 2 oz",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 282,
    "name": "Soup, pea, green, canned, condensed",
    "measure": "0.5 cups",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 283,
    "name": "Bread, reduced-calorie, white",
    "measure": "1.0 oz",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 284,
    "name": "Pasta, whole-wheat, dry",
    "measure": "1.0 cups spaghetti",
    "calcium": 26,
    "isCustom": false
  },
  {
    "id": 285,
    "name": "Turkey, ground, 93% lean, 7% fat, pan-broiled crumbles",
    "measure": "3.0 oz",
    "calcium": 26,
    "isCustom": false
  },
  {
    "id": 286,
    "name": "Cereals ready-to-eat, POST, Shredded Wheat, original big biscuit",
    "measure": "2.0 biscuits",
    "calcium": 26,
    "isCustom": false
  },
  {
    "id": 287,
    "name": "Spices, cinnamon, ground",
    "measure": "1.0 tsp",
    "calcium": 26,
    "isCustom": false
  },
  {
    "id": 288,
    "name": "Beef, loin, top loin, separable lean and fat, trimmed to 1/8\" fat",
    "measure": "4.0 oz",
    "calcium": 26,
    "isCustom": false
  },
  {
    "id": 289,
    "name": "Fish, scup, cooked, dry heat",
    "measure": "1.0 fillet",
    "calcium": 26,
    "isCustom": false
  },
  {
    "id": 290,
    "name": "Snacks, granola bars, soft, uncoated, peanut butter",
    "measure": "1.0 bar",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 291,
    "name": "Bread, pound cake type, pan de torta salvadoran",
    "measure": "1.0 serving",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 292,
    "name": "Chicken, broilers or fryers, dark meat, meat only, cooked, fried",
    "measure": "1.0 cups",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 293,
    "name": "Cherries, sour, red, canned, light syrup pack, solids and liquids",
    "measure": "1.0 cups",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 294,
    "name": "Tamarind nectar, canned",
    "measure": "1.0 cups",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 295,
    "name": "Beef, tenderloin, steak, separable lean and fat, trimmed to 1/8\" fat",
    "measure": "4.0 oz",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 296,
    "name": "Muffin, blueberry, commercially prepared, low-fat",
    "measure": "1.0 muffin small",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 297,
    "name": "Chicken, gizzard, all classes, cooked, simmered",
    "measure": "1.0 cups chopped",
    "calcium": 25,
    "isCustom": false
  },
  {
    "id": 298,
    "name": "Chicory roots, raw",
    "measure": "0.5 cup (1 pieces)",
    "calcium": 18.4,
    "isCustom": false
  },
  {
    "id": 299,
    "name": "Soup, chicken, canned, chunky, ready-to-serve",
    "measure": "1.0 cups",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 300,
    "name": "Grapes, canned, thompson seedless, water pack, solids and liquids",
    "measure": "1.0 cups",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 301,
    "name": "Tomato products, canned, sauce, with tomato tidbits",
    "measure": "1.0 cups",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 302,
    "name": "Tomato juice, canned, without salt added",
    "measure": "1.0 cups",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 303,
    "name": "Tomato juice, canned, with salt added",
    "measure": "1.0 cups",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 304,
    "name": "Crackers, wheat, sandwich, with peanut butter filling",
    "measure": "0.5 oz",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 305,
    "name": "Soup, chicken gumbo, canned, condensed",
    "measure": "0.5 cups",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 306,
    "name": "Pork, fresh, shoulder, blade, boston (roasts), separable lean and fat",
    "measure": "3.0 oz",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 307,
    "name": "Lamb, Australian, imported, fresh, shoulder ,blade, separable lean only",
    "measure": "3.0 oz",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 308,
    "name": "Squash, winter, hubbard, cooked, boiled, mashed, with salt",
    "measure": "1.0 cups, mashed",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 309,
    "name": "Squash, winter, hubbard, cooked, boiled, mashed, without salt",
    "measure": "1.0 cups, mashed",
    "calcium": 24,
    "isCustom": false
  },
  {
    "id": 310,
    "name": "Apricots, canned, heavy syrup pack, with skin, solids and liquids",
    "measure": "1.0 cups, halves",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 311,
    "name": "Carrots, frozen, unprepared",
    "measure": "0.5 cups slices",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 312,
    "name": "Bread, irish soda, prepared from recipe",
    "measure": "1.0 oz",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 313,
    "name": "Bologna, chicken, turkey, pork",
    "measure": "1.0 serving",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 314,
    "name": "Lamb, shoulder, blade, separable lean and fat, trimmed to 1/8\" fat",
    "measure": "3.0 oz",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 315,
    "name": "Pork, fresh, shoulder, (Boston butt), blade (steaks), separable lean and fat",
    "measure": "3.0 oz",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 316,
    "name": "Lamb, New Zealand, imported, frozen, shoulder, whole (arm and blade)",
    "measure": "3.0 oz",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 317,
    "name": "Lamb, Australian, imported, fresh, shoulder, arm, separable lean and fat",
    "measure": "3.0 oz",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 318,
    "name": "Fish, grouper, mixed species, raw",
    "measure": "3.0 oz",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 319,
    "name": "Cowpeas, leafy tips, raw",
    "measure": "1.0 cups, chopped",
    "calcium": 23,
    "isCustom": false
  },
  {
    "id": 320,
    "name": "Figs, raw",
    "measure": "1 small (1-1/2 dia)",
    "calcium": 14,
    "isCustom": false
  },
  {
    "id": 321,
    "name": "Bread, stuffing, cornbread, dry mix",
    "measure": "1.0 oz",
    "calcium": 22,
    "isCustom": false
  },
  {
    "id": 322,
    "name": "Soup, cream of shrimp, canned, prepared with equal volume water",
    "measure": "1.0 cups",
    "calcium": 22,
    "isCustom": false
  },
  {
    "id": 323,
    "name": "Apricots, canned, heavy syrup, drained",
    "measure": "1.0 cups, halves",
    "calcium": 22,
    "isCustom": false
  },
  {
    "id": 324,
    "name": "Seeds, safflower seed meal, partially defatted",
    "measure": "1.0 oz",
    "calcium": 22,
    "isCustom": false
  },
  {
    "id": 325,
    "name": "Beets, raw",
    "measure": "1 beet (2 dia)",
    "calcium": 13.1,
    "isCustom": false
  },
  {
    "id": 326,
    "name": "Beef, short loin, porterhouse steak, separable lean and fat",
    "measure": "4.0 oz",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 327,
    "name": "Cereals, QUAKER, Instant Oatmeal Organic, Regular",
    "measure": "1.0 packet",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 328,
    "name": "Fish, trout, rainbow, farmed, cooked, dry heat",
    "measure": "1.0 fillet",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 329,
    "name": "Pie, banana cream, prepared from recipe",
    "measure": "1.0 oz",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 330,
    "name": "Cauliflower, green, raw",
    "measure": "1.0 cups",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 331,
    "name": "Sausage, Italian, sweet, links",
    "measure": "1.0 link 3 oz",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 332,
    "name": "Cookies, molasses",
    "measure": "1.0 oz",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 333,
    "name": "Asparagus, cooked, boiled, drained",
    "measure": "0.5 cups",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 334,
    "name": "Bread, rye",
    "measure": "1 slice, snack-size",
    "calcium": 5.11,
    "isCustom": false
  },
  {
    "id": 335,
    "name": "Wheat flour, white, bread, enriched",
    "measure": "1.0 cups",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 336,
    "name": "Bread, oatmeal, toasted",
    "measure": "1.0 oz",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 337,
    "name": "Pancakes, plain, frozen, ready-to-heat, microwave",
    "measure": "1.0 oz",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 338,
    "name": "Flan, caramel custard, dry mix",
    "measure": "1 portion, amount to make 1/2 cup",
    "calcium": 5.04,
    "isCustom": false
  },
  {
    "id": 339,
    "name": "Cherries, sour, red, frozen, unsweetened",
    "measure": "1.0 cups, unthawed",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 340,
    "name": "Danish pastry, cinnamon, enriched",
    "measure": "1.0 oz",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 341,
    "name": "Grapefruit juice, white, canned, sweetened",
    "measure": "1.0 cups",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 342,
    "name": "Focaccia, Italian flatbread, plain",
    "measure": "1 piece",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 343,
    "name": "Cake, sponge, commercially prepared",
    "measure": "1.0 oz",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 344,
    "name": "Potatoes, baked, skin, without salt",
    "measure": "1.0 skin",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 345,
    "name": "Bamboo shoots, raw",
    "measure": "0.5 cup (1/2 pieces)",
    "calcium": 9.88,
    "isCustom": false
  },
  {
    "id": 346,
    "name": "Lamb, New Zealand, imported, frozen, loin, separable lean and fat",
    "measure": "3.0 oz",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 347,
    "name": "Veal, ground, raw",
    "measure": "1 oz",
    "calcium": 3.4,
    "isCustom": false
  },
  {
    "id": 348,
    "name": "Bison, ground, grass-fed, raw",
    "measure": "1 oz",
    "calcium": 3.12,
    "isCustom": false
  },
  {
    "id": 349,
    "name": "Lamb, ground, raw",
    "measure": "1 oz",
    "calcium": 4.54,
    "isCustom": false
  },
  {
    "id": 350,
    "name": "Peanuts, spanish, raw",
    "measure": "1 oz",
    "calcium": 30.1,
    "isCustom": false
  },
  {
    "id": 351,
    "name": "Mung beans, mature seeds, raw",
    "measure": "1 tbsp",
    "calcium": 17.2,
    "isCustom": false
  },
  {
    "id": 352,
    "name": "Cowpeas, catjang, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 142,
    "isCustom": false
  },
  {
    "id": 353,
    "name": "Hyacinth beans, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 273,
    "isCustom": false
  },
  {
    "id": 354,
    "name": "Peas, green, split, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 90.2,
    "isCustom": false
  },
  {
    "id": 355,
    "name": "Lentils, pink or red, raw",
    "measure": "1 cup",
    "calcium": 92.2,
    "isCustom": false
  },
  {
    "id": 356,
    "name": "Mungo beans, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 286,
    "isCustom": false
  },
  {
    "id": 357,
    "name": "Beans, white, mature seeds, raw",
    "measure": "1 tbsp",
    "calcium": 30.2,
    "isCustom": false
  },
  {
    "id": 358,
    "name": "Chickpeas (garbanzo beans, bengal gram), mature seeds, raw",
    "measure": "1 tbsp",
    "calcium": 7.12,
    "isCustom": false
  },
  {
    "id": 359,
    "name": "Soymilk (All flavors), enhanced",
    "measure": "1 cup",
    "calcium": 340,
    "isCustom": false
  },
  {
    "id": 360,
    "name": "Soymilk, chocolate, unfortified",
    "measure": "1 fl oz",
    "calcium": 7.65,
    "isCustom": false
  },
  {
    "id": 361,
    "name": "Broadbeans (fava beans), mature seeds, raw",
    "measure": "1 tbsp",
    "calcium": 9.68,
    "isCustom": false
  },
  {
    "id": 362,
    "name": "Fish, trout, brook, raw, New York State",
    "measure": "1 filet",
    "calcium": 37.2,
    "isCustom": false
  },
  {
    "id": 363,
    "name": "Crustaceans, shrimp, raw",
    "measure": "3 oz",
    "calcium": 54.4,
    "isCustom": false
  },
  {
    "id": 364,
    "name": "Alcoholic beverage, wine, light",
    "measure": "1 fl oz",
    "calcium": 2.66,
    "isCustom": false
  },
  {
    "id": 365,
    "name": "Carbonated beverage, cream soda",
    "measure": "1 fl oz",
    "calcium": 1.54,
    "isCustom": false
  },
  {
    "id": 366,
    "name": "Beverages, shake, fast food, strawberry",
    "measure": "1 fl oz",
    "calcium": 26.6,
    "isCustom": false
  },
  {
    "id": 367,
    "name": "Mission Foods, Mission Flour Tortillas, Soft Taco, 8 inch",
    "measure": "1 serving",
    "calcium": 97.4,
    "isCustom": false
  },
  {
    "id": 368,
    "name": "Nabisco, Nabisco Ritz Crackers",
    "measure": "1 cracker",
    "calcium": 5.08,
    "isCustom": false
  },
  {
    "id": 369,
    "name": "Martha White Foods, Martha White's Buttermilk Biscuit Mix, dry",
    "measure": "1 serving",
    "calcium": 68.9,
    "isCustom": false
  },
  {
    "id": 370,
    "name": "Archway Home Style Cookies, Strawberry Filled",
    "measure": "1 serving",
    "calcium": 5,
    "isCustom": false
  },
  {
    "id": 371,
    "name": "Tart, breakfast, low fat",
    "measure": "1 tart",
    "calcium": 22.9,
    "isCustom": false
  },
  {
    "id": 372,
    "name": "Taco shells, baked",
    "measure": "1 miniature (3 dia)",
    "calcium": 5,
    "isCustom": false
  },
  {
    "id": 373,
    "name": "Crackers, milk",
    "measure": "1 cracker",
    "calcium": 18.9,
    "isCustom": false
  },
  {
    "id": 374,
    "name": "Pie, peach",
    "measure": "1 oz",
    "calcium": 2.27,
    "isCustom": false
  },
  {
    "id": 375,
    "name": "English muffins, whole grain white",
    "measure": "1 muffin 1 serving",
    "calcium": 79.8,
    "isCustom": false
  },
  {
    "id": 376,
    "name": "Pie crust, standard-type, dry mix",
    "measure": "1 oz",
    "calcium": 17.3,
    "isCustom": false
  },
  {
    "id": 377,
    "name": "Doughnuts, french crullers, glazed",
    "measure": "1 oz",
    "calcium": 7.37,
    "isCustom": false
  },
  {
    "id": 378,
    "name": "Danish pastry, fruit, unenriched (includes apple, cinnamon, raisin, strawberry)",
    "measure": "1 oz",
    "calcium": 13,
    "isCustom": false
  },
  {
    "id": 379,
    "name": "Popovers, dry mix, enriched",
    "measure": "1 oz",
    "calcium": 9.07,
    "isCustom": false
  },
  {
    "id": 380,
    "name": "Cake, coffeecake, fruit",
    "measure": "1 oz",
    "calcium": 12.8,
    "isCustom": false
  },
  {
    "id": 381,
    "name": "Bagels, egg",
    "measure": "1 mini bagel (2-1/2 dia)",
    "calcium": 3.38,
    "isCustom": false
  },
  {
    "id": 382,
    "name": "Pancakes, plain, reduced fat",
    "measure": "1 serving 3 pancakes",
    "calcium": 59.8,
    "isCustom": false
  },
  {
    "id": 383,
    "name": "Leavening agents, baking soda",
    "measure": "0.5 tsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 384,
    "name": "Muffins, oat bran",
    "measure": "1 mini",
    "calcium": 10.7,
    "isCustom": false
  },
  {
    "id": 385,
    "name": "Tortillas, ready-to-bake or -fry, corn",
    "measure": "1 enchilada",
    "calcium": 15.4,
    "isCustom": false
  },
  {
    "id": 386,
    "name": "Sweet rolls, cheese",
    "measure": "1 oz",
    "calcium": 33.5,
    "isCustom": false
  },
  {
    "id": 387,
    "name": "Rolls, french",
    "measure": "1 oz",
    "calcium": 25.8,
    "isCustom": false
  },
  {
    "id": 388,
    "name": "Strudel, apple",
    "measure": "1 oz",
    "calcium": 4.25,
    "isCustom": false
  },
  {
    "id": 389,
    "name": "Toaster pastries, fruit (includes apple, blueberry, cherry, strawberry)",
    "measure": "1 oz",
    "calcium": 4.54,
    "isCustom": false
  },
  {
    "id": 390,
    "name": "Ice cream cones, sugar, rolled-type",
    "measure": "1 cone",
    "calcium": 4.4,
    "isCustom": false
  },
  {
    "id": 391,
    "name": "Croissants, apple",
    "measure": "1 oz",
    "calcium": 8.5,
    "isCustom": false
  },
  {
    "id": 392,
    "name": "Cookies, fortune",
    "measure": "1 cookie",
    "calcium": 0.96,
    "isCustom": false
  },
  {
    "id": 393,
    "name": "Strawberry-flavor beverage mix, powder",
    "measure": "1 serving (2-3 heaping tsp)",
    "calcium": 0.88,
    "isCustom": false
  },
  {
    "id": 394,
    "name": "Malt beverage, includes non-alcoholic beer",
    "measure": "1 fl oz",
    "calcium": 2.07,
    "isCustom": false
  },
  {
    "id": 395,
    "name": "Soup, onion, dry, mix",
    "measure": "1 serving 1 tbsp",
    "calcium": 10.7,
    "isCustom": false
  },
  {
    "id": 396,
    "name": "Snacks, taro chips",
    "measure": "10 chips",
    "calcium": 13.8,
    "isCustom": false
  },
  {
    "id": 397,
    "name": "Pretzels, soft",
    "measure": "1 small",
    "calcium": 14.3,
    "isCustom": false
  },
  {
    "id": 398,
    "name": "Beef, ground, 75% lean meat / 25% fat, raw",
    "measure": "1 serving (3 oz)",
    "calcium": 17.8,
    "isCustom": false
  },
  {
    "id": 399,
    "name": "Grapes, red or green (European type, such as Thompson seedless), raw",
    "measure": "10 grapes",
    "calcium": 4.9,
    "isCustom": false
  },
  {
    "id": 400,
    "name": "Guava sauce, cooked",
    "measure": "1 cup",
    "calcium": 16.7,
    "isCustom": false
  },
  {
    "id": 401,
    "name": "Jackfruit, raw",
    "measure": "1 cup 1 pieces",
    "calcium": 36.2,
    "isCustom": false
  },
  {
    "id": 402,
    "name": "Grapefruit juice, white, raw",
    "measure": "1 fl oz",
    "calcium": 2.78,
    "isCustom": false
  },
  {
    "id": 403,
    "name": "Grapefruit, raw, white, California",
    "measure": "0.5 fruit (3-3/4 dia)",
    "calcium": 14.2,
    "isCustom": false
  },
  {
    "id": 404,
    "name": "Incaparina, dry mix (corn and soy flours), unprepared",
    "measure": "1 tbsp",
    "calcium": 53.4,
    "isCustom": false
  },
  {
    "id": 405,
    "name": "Milk and cereal bar",
    "measure": "1 bar",
    "calcium": 102,
    "isCustom": false
  },
  {
    "id": 406,
    "name": "Sausage, pork, chorizo, link or ground, raw",
    "measure": "1 oz",
    "calcium": 5.39,
    "isCustom": false
  },
  {
    "id": 407,
    "name": "Frankfurter, meat",
    "measure": "1 serving (1 hot dog)",
    "calcium": 51.5,
    "isCustom": false
  },
  {
    "id": 408,
    "name": "Chicken breast, roll, oven-roasted",
    "measure": "1 serving 2 oz",
    "calcium": 3.36,
    "isCustom": false
  },
  {
    "id": 409,
    "name": "Bologna, pork",
    "measure": "1 slice (4 dia x 1/8 thick)",
    "calcium": 2.53,
    "isCustom": false
  },
  {
    "id": 410,
    "name": "Ham, minced",
    "measure": "1 slice (4-1/4 x 4-1/4 x 1/16)",
    "calcium": 2.1,
    "isCustom": false
  },
  {
    "id": 411,
    "name": "Turkey, ground, 85% lean, 15% fat, raw",
    "measure": "1 patty (cooked from 4 oz raw)",
    "calcium": 28,
    "isCustom": false
  },
  {
    "id": 412,
    "name": "Swisswurst, pork and beef, with swiss cheese, smoked",
    "measure": "1 serving 2.7 oz",
    "calcium": 57,
    "isCustom": false
  },
  {
    "id": 413,
    "name": "Salami, cooked, beef",
    "measure": "1 slice",
    "calcium": 1.56,
    "isCustom": false
  },
  {
    "id": 414,
    "name": "Bacon and beef sticks",
    "measure": "1 oz",
    "calcium": 3.92,
    "isCustom": false
  },
  {
    "id": 415,
    "name": "Bratwurst, veal, cooked",
    "measure": "1 serving 2.96 oz",
    "calcium": 9.24,
    "isCustom": false
  },
  {
    "id": 416,
    "name": "Liverwurst spread",
    "measure": "0.25 cup",
    "calcium": 12.1,
    "isCustom": false
  },
  {
    "id": 417,
    "name": "Roast beef spread",
    "measure": "1 serving .25 cup",
    "calcium": 13.1,
    "isCustom": false
  },
  {
    "id": 418,
    "name": "Oscar Mayer, Salami (hard)",
    "measure": "1 slice",
    "calcium": 1.08,
    "isCustom": false
  },
  {
    "id": 419,
    "name": "Bacon, meatless",
    "measure": "1 strip",
    "calcium": 1.15,
    "isCustom": false
  },
  {
    "id": 420,
    "name": "Hormel Pillow Pak Sliced Turkey Pepperoni",
    "measure": "1 serving",
    "calcium": 7.8,
    "isCustom": false
  },
  {
    "id": 421,
    "name": "Luncheon sausage, pork and beef",
    "measure": "1 slice (4 dia x 1/8 thick)",
    "calcium": 2.99,
    "isCustom": false
  },
  {
    "id": 422,
    "name": "Sandwich spread, meatless",
    "measure": "1 tbsp",
    "calcium": 6.6,
    "isCustom": false
  },
  {
    "id": 423,
    "name": "Polish sausage, pork",
    "measure": "3 oz",
    "calcium": 10.2,
    "isCustom": false
  },
  {
    "id": 424,
    "name": "Poultry salad sandwich spread",
    "measure": "1 tbsp",
    "calcium": 1.3,
    "isCustom": false
  },
  {
    "id": 425,
    "name": "Pork sausage, reduced sodium, cooked",
    "measure": "3 oz",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 426,
    "name": "Peppered loaf, pork, beef",
    "measure": "3.52 slices",
    "calcium": 54,
    "isCustom": false
  },
  {
    "id": 427,
    "name": "Mortadella, beef, pork",
    "measure": "1 slice (15 per 8 oz package)",
    "calcium": 2.7,
    "isCustom": false
  },
  {
    "id": 428,
    "name": "Pepperoni, beef and pork, sliced",
    "measure": "1 piece",
    "calcium": 0.38,
    "isCustom": false
  },
  {
    "id": 429,
    "name": "Pickle and pimiento loaf, pork",
    "measure": "1 slice",
    "calcium": 41.4,
    "isCustom": false
  },
  {
    "id": 430,
    "name": "Roast beef, deli style, prepackaged, sliced",
    "measure": "1 slice oval",
    "calcium": 0.465,
    "isCustom": false
  },
  {
    "id": 431,
    "name": "Turkey breast, sliced, prepackaged",
    "measure": "1 slice",
    "calcium": 2.24,
    "isCustom": false
  },
  {
    "id": 432,
    "name": "Sauce, barbecue",
    "measure": "1 tbsp",
    "calcium": 5.61,
    "isCustom": false
  },
  {
    "id": 433,
    "name": "Turkey from whole, light meat, meat and skin, with added solution, raw",
    "measure": "4 oz",
    "calcium": 15.8,
    "isCustom": false
  },
  {
    "id": 434,
    "name": "Chicken, ground, raw",
    "measure": "4 oz crumbled",
    "calcium": 6.78,
    "isCustom": false
  },
  {
    "id": 435,
    "name": "Ostrich, ground, raw",
    "measure": "1 patty",
    "calcium": 7.63,
    "isCustom": false
  },
  {
    "id": 436,
    "name": "Emu, ground, raw",
    "measure": "1 patty",
    "calcium": 8.19,
    "isCustom": false
  },
  {
    "id": 437,
    "name": "Pheasant, raw, meat and skin",
    "measure": "3 oz",
    "calcium": 10.2,
    "isCustom": false
  },
  {
    "id": 438,
    "name": "Guinea hen, meat only, raw",
    "measure": "3 oz",
    "calcium": 9.35,
    "isCustom": false
  },
  {
    "id": 439,
    "name": "Squab, (pigeon), meat and skin, raw",
    "measure": "3 oz",
    "calcium": 10.2,
    "isCustom": false
  },
  {
    "id": 440,
    "name": "Duck, wild, breast, meat only, raw",
    "measure": "1 unit (yield from 1 lb ready-to-cook duck)",
    "calcium": 2.19,
    "isCustom": false
  },
  {
    "id": 441,
    "name": "Goose, domesticated, meat and skin, raw",
    "measure": "3 oz",
    "calcium": 10.2,
    "isCustom": false
  },
  {
    "id": 442,
    "name": "Soy protein concentrate, produced by acid wash",
    "measure": "1 oz",
    "calcium": 103,
    "isCustom": false
  },
  {
    "id": 443,
    "name": "Yardlong beans, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 230,
    "isCustom": false
  },
  {
    "id": 444,
    "name": "Soybeans, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 515,
    "isCustom": false
  },
  {
    "id": 445,
    "name": "Soy protein isolate",
    "measure": "1 oz",
    "calcium": 50.5,
    "isCustom": false
  },
  {
    "id": 446,
    "name": "Chickpea flour (besan)",
    "measure": "1 cup",
    "calcium": 41.4,
    "isCustom": false
  },
  {
    "id": 447,
    "name": "Hummus, commercial",
    "measure": "1 tbsp",
    "calcium": 7.05,
    "isCustom": false
  },
  {
    "id": 448,
    "name": "Veggie burgers or soyburgers, unprepared",
    "measure": "1 pattie",
    "calcium": 95.2,
    "isCustom": false
  },
  {
    "id": 449,
    "name": "Winged beans, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 801,
    "isCustom": false
  },
  {
    "id": 450,
    "name": "Soy sauce made from soy (tamari)",
    "measure": "1 tsp",
    "calcium": 1.2,
    "isCustom": false
  },
  {
    "id": 451,
    "name": "Soy sauce made from soy and wheat (shoyu)",
    "measure": "1 tsp",
    "calcium": 1.75,
    "isCustom": false
  },
  {
    "id": 452,
    "name": "Soy sauce made from hydrolyzed vegetable protein",
    "measure": "1 tsp",
    "calcium": 1.02,
    "isCustom": false
  },
  {
    "id": 453,
    "name": "Tempeh",
    "measure": "1 cup",
    "calcium": 184,
    "isCustom": false
  },
  {
    "id": 454,
    "name": "Soy flour, full-fat, raw",
    "measure": "1 tbsp",
    "calcium": 10.7,
    "isCustom": false
  },
  {
    "id": 455,
    "name": "Meat extender",
    "measure": "1 oz",
    "calcium": 57.8,
    "isCustom": false
  },
  {
    "id": 456,
    "name": "Peanut flour, low fat",
    "measure": "1 oz",
    "calcium": 36.9,
    "isCustom": false
  },
  {
    "id": 457,
    "name": "Peanut butter, creamy",
    "measure": "100 g",
    "calcium": 49.8,
    "isCustom": false
  },
  {
    "id": 458,
    "name": "Lima beans, thin seeded (baby), mature seeds, raw",
    "measure": "1 cup",
    "calcium": 164,
    "isCustom": false
  },
  {
    "id": 459,
    "name": "Noodles, egg, dry, enriched",
    "measure": "1 cup",
    "calcium": 13.3,
    "isCustom": false
  },
  {
    "id": 460,
    "name": "Water, bottled, generic",
    "measure": "1 ml",
    "calcium": 0.1,
    "isCustom": false
  },
  {
    "id": 461,
    "name": "Cookie, chocolate, with icing or coating",
    "measure": "4 cookies",
    "calcium": 4.8,
    "isCustom": false
  },
  {
    "id": 462,
    "name": "Dip, bean, original flavor",
    "measure": "2 tbsp",
    "calcium": 9.36,
    "isCustom": false
  },
  {
    "id": 463,
    "name": "Beef composite, separable lean only, trimmed to 1/8 fat, choice, cooked",
    "measure": "3 oz",
    "calcium": 9.35,
    "isCustom": false
  },
  {
    "id": 464,
    "name": "Cherries, sour, red, raw",
    "measure": "1 cup, with pits, yields",
    "calcium": 16.5,
    "isCustom": false
  },
  {
    "id": 465,
    "name": "Blueberries, raw",
    "measure": "50 berries",
    "calcium": 4.08,
    "isCustom": false
  },
  {
    "id": 466,
    "name": "Carissa, (natal-plum), raw",
    "measure": "1 fruit without skin and seeds",
    "calcium": 2.2,
    "isCustom": false
  },
  {
    "id": 467,
    "name": "Cherimoya, raw",
    "measure": "1 cup, pieces",
    "calcium": 16,
    "isCustom": false
  },
  {
    "id": 468,
    "name": "Blackberries, raw",
    "measure": "1 cup",
    "calcium": 41.8,
    "isCustom": false
  },
  {
    "id": 469,
    "name": "Bananas, raw",
    "measure": "1 extra small (less than 6 long)",
    "calcium": 4.05,
    "isCustom": false
  },
  {
    "id": 470,
    "name": "Apricots, raw",
    "measure": "1 apricot",
    "calcium": 4.55,
    "isCustom": false
  },
  {
    "id": 471,
    "name": "Apple juice, with added vitamin C, from concentrate, shelf stable",
    "measure": "100 g",
    "calcium": 7.1,
    "isCustom": false
  },
  {
    "id": 472,
    "name": "Apples, raw, without skin, cooked, microwave",
    "measure": "1 cup slices",
    "calcium": 8.5,
    "isCustom": false
  },
  {
    "id": 473,
    "name": "Cereals, farina, unenriched, dry",
    "measure": "1 tbsp",
    "calcium": 1.53,
    "isCustom": false
  },
  {
    "id": 474,
    "name": "Kielbasa, fully cooked, unheated",
    "measure": "3 oz",
    "calcium": 20.4,
    "isCustom": false
  },
  {
    "id": 475,
    "name": "Liver cheese, pork",
    "measure": "1 oz",
    "calcium": 2.27,
    "isCustom": false
  },
  {
    "id": 476,
    "name": "Liver sausage, liverwurst, pork",
    "measure": "1 slice (2-1/2 dia x 1/4 thick)",
    "calcium": 4.68,
    "isCustom": false
  },
  {
    "id": 477,
    "name": "Lebanon bologna, beef",
    "measure": "1 oz",
    "calcium": 5.67,
    "isCustom": false
  },
  {
    "id": 478,
    "name": "Ham salad spread",
    "measure": "1 tbsp",
    "calcium": 1.2,
    "isCustom": false
  },
  {
    "id": 479,
    "name": "Knackwurst, knockwurst, pork, beef",
    "measure": "1 oz",
    "calcium": 3.12,
    "isCustom": false
  },
  {
    "id": 480,
    "name": "Corned beef loaf, jellied",
    "measure": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
    "calcium": 3.08,
    "isCustom": false
  },
  {
    "id": 481,
    "name": "Chicken spread",
    "measure": "1 serving (1 serving)",
    "calcium": 8.96,
    "isCustom": false
  },
  {
    "id": 482,
    "name": "Dutch brand loaf, chicken, pork and beef",
    "measure": "1 slice",
    "calcium": 2.66,
    "isCustom": false
  },
  {
    "id": 483,
    "name": "Mothbeans, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 294,
    "isCustom": false
  },
  {
    "id": 484,
    "name": "Lupins, mature seeds, raw",
    "measure": "1 cup",
    "calcium": 317,
    "isCustom": false
  },
  {
    "id": 485,
    "name": "Carob flour",
    "measure": "1 tbsp",
    "calcium": 20.9,
    "isCustom": false
  },
  {
    "id": 486,
    "name": "Whiskey sour mix, bottled, with added potassium and sodium",
    "measure": "1 fl oz",
    "calcium": 0.646,
    "isCustom": false
  },
  {
    "id": 487,
    "name": "Cranberry juice cocktail, bottled",
    "measure": "1 fl oz",
    "calcium": 0.948,
    "isCustom": false
  },
  {
    "id": 488,
    "name": "Canada Goose, breast meat only, skinless, raw",
    "measure": "3 oz",
    "calcium": 3.4,
    "isCustom": false
  },
  {
    "id": 489,
    "name": "Shortening, vegetable, household, composite",
    "measure": "1 tbsp",
    "calcium": 0.128,
    "isCustom": false
  },
  {
    "id": 490,
    "name": "Oil, oat",
    "measure": "1 tsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 491,
    "name": "Margarine,spread, 35-39% fat, tub",
    "measure": "1 tsp",
    "calcium": 0.288,
    "isCustom": false
  },
  {
    "id": 492,
    "name": "Margarine-like shortening, industrial, soy (partially hydrogenated), cottonseed, and soy, principal use flaky pastries",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 493,
    "name": "Salad dressing, coleslaw",
    "measure": "1 tbsp",
    "calcium": 1.71,
    "isCustom": false
  },
  {
    "id": 494,
    "name": "Margarine Spread, 40-49% fat, tub",
    "measure": "100 g",
    "calcium": 2,
    "isCustom": false
  },
  {
    "id": 495,
    "name": "Margarine-like spread with yogurt, 70% fat, stick, with salt",
    "measure": "1 tablespoon",
    "calcium": 2.8,
    "isCustom": false
  },
  {
    "id": 496,
    "name": "Margarine-like, vegetable oil spread, fat-free, tub",
    "measure": "1 tbsp",
    "calcium": 1.17,
    "isCustom": false
  },
  {
    "id": 497,
    "name": "Butter, salted",
    "measure": "1 pat (1 sq, 1/3 high)",
    "calcium": 1.2,
    "isCustom": false
  },
  {
    "id": 498,
    "name": "Fish oil, salmon",
    "measure": "1 tsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 499,
    "name": "Fat, goose",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 500,
    "name": "Shortening industrial, lard and vegetable oil",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 501,
    "name": "Shortening confectionery, coconut (hydrogenated) and or palm kernel (hydrogenated)",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 502,
    "name": "Shortening frying (heavy duty), palm (hydrogenated)",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 503,
    "name": "Babyfood, fruit, banana and strawberry, junior",
    "measure": "1 bottle",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 504,
    "name": "Clif Z bar",
    "measure": "1 bar",
    "calcium": 160,
    "isCustom": false
  },
  {
    "id": 505,
    "name": "Rosemary, fresh",
    "measure": "1 tsp",
    "calcium": 2.22,
    "isCustom": false
  },
  {
    "id": 506,
    "name": "Peppermint, fresh",
    "measure": "2 leaves",
    "calcium": 0.243,
    "isCustom": false
  },
  {
    "id": 507,
    "name": "Seasoning mix, dry, taco, original",
    "measure": "2 tsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 508,
    "name": "Spearmint, fresh",
    "measure": "2 leaves",
    "calcium": 0.597,
    "isCustom": false
  },
  {
    "id": 509,
    "name": "Fat free ice cream, no sugar added, flavors other than chocolate",
    "measure": "0.5 cup",
    "calcium": 100,
    "isCustom": false
  },
  {
    "id": 510,
    "name": "Ice cream, soft serve, chocolate",
    "measure": "0.5 cup",
    "calcium": 113,
    "isCustom": false
  },
  {
    "id": 511,
    "name": "Vanilla extract",
    "measure": "1 tsp",
    "calcium": 0.462,
    "isCustom": false
  },
  {
    "id": 512,
    "name": "Thyme, fresh",
    "measure": "0.5 tsp",
    "calcium": 1.62,
    "isCustom": false
  },
  {
    "id": 513,
    "name": "Salt, table",
    "measure": "1 dash",
    "calcium": 0.096,
    "isCustom": false
  },
  {
    "id": 514,
    "name": "Vinegar, cider",
    "measure": "1 tsp",
    "calcium": 0.35,
    "isCustom": false
  },
  {
    "id": 515,
    "name": "Yogurt, Greek, strawberry, lowfat",
    "measure": "0 container (4 oz)",
    "calcium": 99.4,
    "isCustom": false
  },
  {
    "id": 516,
    "name": "Dulce de Leche",
    "measure": "1 tbsp",
    "calcium": 47.7,
    "isCustom": false
  },
  {
    "id": 517,
    "name": "Protein supplement, milk based, Muscle Milk, powder",
    "measure": "1 tbsp",
    "calcium": 55,
    "isCustom": false
  },
  {
    "id": 518,
    "name": "Cheese product, pasteurized process, American, vitamin D fortified",
    "measure": "1 slice (2/3 oz)",
    "calcium": 261,
    "isCustom": false
  },
  {
    "id": 519,
    "name": "Cream substitute, powdered",
    "measure": "1 tsp",
    "calcium": 0.04,
    "isCustom": false
  },
  {
    "id": 520,
    "name": "Cheese, caraway",
    "measure": "1 oz",
    "calcium": 191,
    "isCustom": false
  },
  {
    "id": 521,
    "name": "Sour cream, light",
    "measure": "1 tablespoon",
    "calcium": 16.9,
    "isCustom": false
  },
  {
    "id": 522,
    "name": "Butter oil, anhydrous",
    "measure": "1 tbsp",
    "calcium": 0.512,
    "isCustom": false
  },
  {
    "id": 523,
    "name": "Pulled pork in barbecue sauce",
    "measure": "1 cup",
    "calcium": 110,
    "isCustom": false
  },
  {
    "id": 524,
    "name": "Rice and vermicelli mix, beef flavor, unprepared",
    "measure": "1 tbsp",
    "calcium": 2.88,
    "isCustom": false
  },
  {
    "id": 525,
    "name": "Potato salad with egg",
    "measure": "0.5 cup",
    "calcium": 18.8,
    "isCustom": false
  },
  {
    "id": 526,
    "name": "Macaroni and cheese dinner with dry sauce mix, boxed, uncooked",
    "measure": "1 serving (makes about 1 cup prepared)",
    "calcium": 102,
    "isCustom": false
  },
  {
    "id": 527,
    "name": "Fast foods, nachos, with cheese, beans, ground beef, and tomatoes",
    "measure": "1 serving",
    "calcium": 104,
    "isCustom": false
  },
  {
    "id": 528,
    "name": "Light ice cream, Creamsicle",
    "measure": "100 g",
    "calcium": 62,
    "isCustom": false
  },
  {
    "id": 529,
    "name": "McDONALD'S, Strawberry Sundae",
    "measure": "1 item (6.3 oz)",
    "calcium": 196,
    "isCustom": false
  },
  {
    "id": 530,
    "name": "Fast food, biscuit",
    "measure": "1 biscuit",
    "calcium": 38.5,
    "isCustom": false
  },
  {
    "id": 531,
    "name": "Continental Mills, Krusteaz Almond Poppyseed Muffin Mix, Artificially Flavored, dry",
    "measure": "1 serving",
    "calcium": 32.8,
    "isCustom": false
  },
  {
    "id": 532,
    "name": "Pillsbury, Crusty French Loaf, refrigerated dough",
    "measure": "1 serving",
    "calcium": 9.88,
    "isCustom": false
  },
  {
    "id": 533,
    "name": "Pasta, dry, enriched",
    "measure": "2 oz",
    "calcium": 12,
    "isCustom": false
  },
  {
    "id": 534,
    "name": "Sorghum flour, white, pearled, unenriched, dry, raw",
    "measure": "100 g",
    "calcium": 7.89,
    "isCustom": false
  },
  {
    "id": 535,
    "name": "Shake, fast food, vanilla",
    "measure": "1 fl oz",
    "calcium": 23.9,
    "isCustom": false
  },
  {
    "id": 536,
    "name": "Rice crackers",
    "measure": "1 serving",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 537,
    "name": "Formulated bar, high fiber, chewy, oats and chocolate",
    "measure": "1 bar",
    "calcium": 100,
    "isCustom": false
  },
  {
    "id": 538,
    "name": "Tortilla chips, yellow, plain, salted",
    "measure": "1 oz",
    "calcium": 29.5,
    "isCustom": false
  },
  {
    "id": 539,
    "name": "Popcorn, sugar syrup/caramel, fat-free",
    "measure": "1 oz",
    "calcium": 5.1,
    "isCustom": false
  },
  {
    "id": 540,
    "name": "Groundcherries, (cape-gooseberries or poha), raw",
    "measure": "1 cup",
    "calcium": 12.6,
    "isCustom": false
  },
  {
    "id": 541,
    "name": "Guavas, strawberry, raw",
    "measure": "1 fruit without refuse",
    "calcium": 1.26,
    "isCustom": false
  },
  {
    "id": 542,
    "name": "Goji berries, dried",
    "measure": "5 tbsp",
    "calcium": 53.2,
    "isCustom": false
  },
  {
    "id": 543,
    "name": "Rice and Wheat cereal bar",
    "measure": "1 bar",
    "calcium": 6.82,
    "isCustom": false
  },
  {
    "id": 544,
    "name": "Pate, truffle flavor",
    "measure": "1 serving 2 oz",
    "calcium": 39.2,
    "isCustom": false
  },
  {
    "id": 545,
    "name": "Macaroni and cheese loaf, chicken, pork and beef",
    "measure": "1 slice",
    "calcium": 46.4,
    "isCustom": false
  },
  {
    "id": 546,
    "name": "Scrapple, pork",
    "measure": "1 cubic inch",
    "calcium": 1.19,
    "isCustom": false
  },
  {
    "id": 547,
    "name": "Beerwurst, pork and beef",
    "measure": "1 serving 2 oz",
    "calcium": 15.1,
    "isCustom": false
  },
  {
    "id": 548,
    "name": "Yachtwurst, with pistachio nuts, cooked",
    "measure": "1 serving 2 oz",
    "calcium": 10.6,
    "isCustom": false
  },
  {
    "id": 549,
    "name": "Pastrami, turkey",
    "measure": "2 slices",
    "calcium": 6.27,
    "isCustom": false
  },
  {
    "id": 550,
    "name": "Honey roll sausage, beef",
    "measure": "1 slice (4 dia x 1/8 thick)",
    "calcium": 2.07,
    "isCustom": false
  },
  {
    "id": 551,
    "name": "Thuringer, cervelat, summer sausage, beef, pork",
    "measure": "2 oz 1 serving",
    "calcium": 5.04,
    "isCustom": false
  },
  {
    "id": 552,
    "name": "Picnic loaf, pork, beef",
    "measure": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
    "calcium": 13.2,
    "isCustom": false
  },
  {
    "id": 553,
    "name": "Mother's loaf, pork",
    "measure": "1 slice (4-1/4 x 4-1/4 x 1/16)",
    "calcium": 9.03,
    "isCustom": false
  },
  {
    "id": 554,
    "name": "Olive loaf, pork",
    "measure": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
    "calcium": 30.5,
    "isCustom": false
  },
  {
    "id": 555,
    "name": "Luxury loaf, pork",
    "measure": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
    "calcium": 10.1,
    "isCustom": false
  },
  {
    "id": 556,
    "name": "Quail, breast, meat only, raw",
    "measure": "1 breast",
    "calcium": 5.6,
    "isCustom": false
  },
  {
    "id": 557,
    "name": "Ruffed Grouse, breast meat, skinless, raw",
    "measure": "4 oz",
    "calcium": 5.65,
    "isCustom": false
  },
  {
    "id": 558,
    "name": "Wonton wrappers (includes egg roll wrappers)",
    "measure": "1 wrapper, wonton (3-1/2 square)",
    "calcium": 3.76,
    "isCustom": false
  },
  {
    "id": 559,
    "name": "Phyllo dough",
    "measure": "1 sheet dough",
    "calcium": 2.09,
    "isCustom": false
  },
  {
    "id": 560,
    "name": "Croutons, plain",
    "measure": "0.5 oz",
    "calcium": 10.8,
    "isCustom": false
  },
  {
    "id": 561,
    "name": "Cracker, meal",
    "measure": "1 oz",
    "calcium": 6.52,
    "isCustom": false
  },
  {
    "id": 562,
    "name": "Peanut butter with omega-3, creamy",
    "measure": "1 tbsp",
    "calcium": 7.2,
    "isCustom": false
  },
  {
    "id": 563,
    "name": "Pigeon peas (red gram), mature seeds, raw",
    "measure": "1 cup",
    "calcium": 266,
    "isCustom": false
  },
  {
    "id": 564,
    "name": "Soy sauce, reduced sodium, made from hydrolyzed vegetable protein",
    "measure": "1 tsp",
    "calcium": 0.539,
    "isCustom": false
  },
  {
    "id": 565,
    "name": "Peanut spread, reduced sugar",
    "measure": "2 tbsp",
    "calcium": 22.3,
    "isCustom": false
  },
  {
    "id": 566,
    "name": "Okara",
    "measure": "1 cup",
    "calcium": 97.6,
    "isCustom": false
  },
  {
    "id": 567,
    "name": "Soy meal, defatted, raw",
    "measure": "1 cup",
    "calcium": 298,
    "isCustom": false
  },
  {
    "id": 568,
    "name": "Miso",
    "measure": "1 tbsp",
    "calcium": 9.69,
    "isCustom": false
  },
  {
    "id": 569,
    "name": "Natto",
    "measure": "1 cup",
    "calcium": 380,
    "isCustom": false
  },
  {
    "id": 570,
    "name": "Animal fat, bacon grease",
    "measure": "1 tsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 571,
    "name": "Shortening cake mix, soybean (hydrogenated) and cottonseed (hydrogenated)",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 572,
    "name": "Shortening household soybean (hydrogenated) and palm",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 573,
    "name": "Shortening bread, soybean (hydrogenated) and cottonseed",
    "measure": "1 tablespoon",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 574,
    "name": "Ice cream sandwich",
    "measure": "1 serving",
    "calcium": 60.2,
    "isCustom": false
  },
  {
    "id": 575,
    "name": "Spices, turmeric, ground",
    "measure": "1 tsp",
    "calcium": 5.04,
    "isCustom": false
  },
  {
    "id": 576,
    "name": "Basil, fresh",
    "measure": "5 leaves",
    "calcium": 4.42,
    "isCustom": false
  },
  {
    "id": 577,
    "name": "Dill weed, fresh",
    "measure": "5 sprigs",
    "calcium": 2.08,
    "isCustom": false
  },
  {
    "id": 578,
    "name": "Ice cream cone, chocolate covered, with nuts, flavors other than chocolate",
    "measure": "1 unit",
    "calcium": 60.5,
    "isCustom": false
  },
  {
    "id": 579,
    "name": "Ice cream cookie sandwich",
    "measure": "1 serving",
    "calcium": 59.9,
    "isCustom": false
  },
  {
    "id": 580,
    "name": "Reddi Wip Fat Free Whipped Topping",
    "measure": "1 tablespoon",
    "calcium": 4.32,
    "isCustom": false
  },
  {
    "id": 581,
    "name": "Cream, heavy",
    "measure": "100 g",
    "calcium": 61.2,
    "isCustom": false
  },
  {
    "id": 582,
    "name": "Lean Pockets, Meatballs & Mozzarella",
    "measure": "1 each",
    "calcium": 251,
    "isCustom": false
  },
  {
    "id": 583,
    "name": "Egg rolls, pork, refrigerated, heated",
    "measure": "1 oz",
    "calcium": 9.64,
    "isCustom": false
  },
  {
    "id": 584,
    "name": "Spaghetti, spinach, dry",
    "measure": "2 oz",
    "calcium": 33.1,
    "isCustom": false
  },
  {
    "id": 585,
    "name": "Tortellini, pasta with cheese filling, fresh-refrigerated, as purchased",
    "measure": "0.75 cup",
    "calcium": 123,
    "isCustom": false
  },
  {
    "id": 586,
    "name": "McDONALD'S Bacon Ranch Salad with Crispy Chicken",
    "measure": "1 item 11.3 oz",
    "calcium": 147,
    "isCustom": false
  },
  {
    "id": 587,
    "name": "Millet flour",
    "measure": "1 cup",
    "calcium": 16.7,
    "isCustom": false
  },
  {
    "id": 588,
    "name": "Wheat flour, white, cake, enriched",
    "measure": "1 cup unsifted, dipped",
    "calcium": 19.2,
    "isCustom": false
  },
  {
    "id": 589,
    "name": "Cornmeal, blue (Navajo)",
    "measure": "100 g",
    "calcium": 5,
    "isCustom": false
  },
  {
    "id": 590,
    "name": "Alcoholic beverages, wine, rose",
    "measure": "1 fl oz",
    "calcium": 3.03,
    "isCustom": false
  },
  {
    "id": 591,
    "name": "Wasabi, root, raw",
    "measure": "1 cup, sliced",
    "calcium": 166,
    "isCustom": false
  },
  {
    "id": 592,
    "name": "Dates, medjool",
    "measure": "1 date, pitted",
    "calcium": 15.4,
    "isCustom": false
  },
  {
    "id": 593,
    "name": "Elderberries, raw",
    "measure": "1 cup",
    "calcium": 55.1,
    "isCustom": false
  },
  {
    "id": 594,
    "name": "Custard-apple, (bullock's-heart), raw",
    "measure": "100 g",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 595,
    "name": "Cranberries, raw",
    "measure": "1 cup, whole",
    "calcium": 8,
    "isCustom": false
  },
  {
    "id": 596,
    "name": "Crabapples, raw",
    "measure": "1 cup slices",
    "calcium": 19.8,
    "isCustom": false
  },
  {
    "id": 597,
    "name": "Carambola, (starfruit), raw",
    "measure": "1 small (3-1/8 long)",
    "calcium": 2.1,
    "isCustom": false
  },
  {
    "id": 598,
    "name": "Avocados, raw, California",
    "measure": "1 NLEA serving",
    "calcium": 6.5,
    "isCustom": false
  },
  {
    "id": 599,
    "name": "Acerola, (west indian cherry), raw",
    "measure": "1 fruit without refuse",
    "calcium": 0.576,
    "isCustom": false
  },
  {
    "id": 600,
    "name": "Acerola juice, raw",
    "measure": "1 fl oz",
    "calcium": 3.02,
    "isCustom": false
  },
  {
    "id": 601,
    "name": "Meatballs, meatless",
    "measure": "1 cup",
    "calcium": 36,
    "isCustom": false
  },
  {
    "id": 602,
    "name": "Headcheese, pork",
    "measure": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
    "calcium": 4.48,
    "isCustom": false
  },
  {
    "id": 603,
    "name": "Ham and cheese spread",
    "measure": "1 tbsp",
    "calcium": 32.6,
    "isCustom": false
  },
  {
    "id": 604,
    "name": "Ham and cheese loaf or roll",
    "measure": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
    "calcium": 16.2,
    "isCustom": false
  },
  {
    "id": 605,
    "name": "Braunschweiger (a liver sausage), pork",
    "measure": "1 slice (2-1/2 dia x 1/4 thick)",
    "calcium": 1.62,
    "isCustom": false
  },
  {
    "id": 606,
    "name": "Cheesefurter, cheese smokie, pork, beef",
    "measure": "2.33 links",
    "calcium": 58,
    "isCustom": false
  },
  {
    "id": 607,
    "name": "Blood sausage",
    "measure": "4 slices",
    "calcium": 6,
    "isCustom": false
  },
  {
    "id": 608,
    "name": "Bockwurst, pork, veal, raw",
    "measure": "1 sausage",
    "calcium": 37.3,
    "isCustom": false
  },
  {
    "id": 609,
    "name": "Potato soup, instant, dry mix",
    "measure": "1 serving 1/3 cup",
    "calcium": 67.1,
    "isCustom": false
  },
  {
    "id": 610,
    "name": "Fish broth",
    "measure": "1 fl oz",
    "calcium": 9.15,
    "isCustom": false
  },
  {
    "id": 611,
    "name": "Gravy, brown, dry",
    "measure": "1 tbsp",
    "calcium": 7.92,
    "isCustom": false
  },
  {
    "id": 612,
    "name": "Barbecue loaf, pork, beef",
    "measure": "1 slice (5-7/8 x 3-1/2 x 1/16)",
    "calcium": 12.6,
    "isCustom": false
  },
  {
    "id": 613,
    "name": "Chicken breast tenders, breaded, uncooked",
    "measure": "1 piece",
    "calcium": 2.85,
    "isCustom": false
  },
  {
    "id": 614,
    "name": "Turkey thigh, pre-basted, meat and skin, cooked, roasted",
    "measure": "3 oz",
    "calcium": 6.8,
    "isCustom": false
  },
  {
    "id": 615,
    "name": "Mayonnaise, made with tofu",
    "measure": "1 tbsp",
    "calcium": 7.95,
    "isCustom": false
  },
  {
    "id": 616,
    "name": "Vegetable oil, palm kernel",
    "measure": "1 tablespoon",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 617,
    "name": "Lard",
    "measure": "1 tbsp",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 618,
    "name": "Zwieback",
    "measure": "1 piece",
    "calcium": 1.4,
    "isCustom": false
  },
  {
    "id": 619,
    "name": "Ice cream sundae cone",
    "measure": "100 g",
    "calcium": 60,
    "isCustom": false
  },
  {
    "id": 620,
    "name": "Ice cream bar, covered with chocolate and nuts",
    "measure": "100 g",
    "calcium": 90,
    "isCustom": false
  },
  {
    "id": 621,
    "name": "Cheese food, cold pack, American",
    "measure": "1 oz",
    "calcium": 141,
    "isCustom": false
  },
  {
    "id": 622,
    "name": "Whey, acid, dried",
    "measure": "1 tbsp",
    "calcium": 59.6,
    "isCustom": false
  },
  {
    "id": 623,
    "name": "Sour dressing, non-butterfat, cultured, filled cream-type",
    "measure": "1 tbsp",
    "calcium": 13.6,
    "isCustom": false
  },
  {
    "id": 624,
    "name": "Cheese spread, cream cheese base",
    "measure": "1 oz",
    "calcium": 20.1,
    "isCustom": false
  },
  {
    "id": 625,
    "name": "Poultry, mechanically deboned, from backs and necks without skin, raw",
    "measure": "0.5 lb",
    "calcium": 279,
    "isCustom": false
  },
  {
    "id": 626,
    "name": "Turkey sticks, breaded, battered, fried",
    "measure": "1 stick (2.25 oz)",
    "calcium": 8.96,
    "isCustom": false
  },
  {
    "id": 627,
    "name": "Dressing, honey mustard, fat-free",
    "measure": "2 tbsp (1 NLEA serving)",
    "calcium": 7.2,
    "isCustom": false
  },
  {
    "id": 628,
    "name": "Margarine-like vegetable-oil spread, stick/tub/bottle, 60% fat, with added vitamin D",
    "measure": "1 teaspoon",
    "calcium": 1.01,
    "isCustom": false
  },
  {
    "id": 629,
    "name": "Nutritional supplement for people with diabetes, liquid",
    "measure": "1 can",
    "calcium": 250,
    "isCustom": false
  },
  {
    "id": 630,
    "name": "Milk shakes, thick vanilla",
    "measure": "1 fl oz",
    "calcium": 41.5,
    "isCustom": false
  },
  {
    "id": 631,
    "name": "Dessert topping, powdered",
    "measure": "1 portion, amount to make 1 tbsp",
    "calcium": 0.221,
    "isCustom": false
  },
  {
    "id": 632,
    "name": "School Lunch, chicken patty, whole grain breaded",
    "measure": "1 patty",
    "calcium": 29.2,
    "isCustom": false
  },
  {
    "id": 633,
    "name": "Buckwheat flour, whole-groat",
    "measure": "1 cup",
    "calcium": 49.2,
    "isCustom": false
  },
  {
    "id": 634,
    "name": "Buckwheat groats, roasted, dry",
    "measure": "1 cup",
    "calcium": 27.9,
    "isCustom": false
  },
  {
    "id": 635,
    "name": "Bulgur, dry, raw",
    "measure": "100 g",
    "calcium": 34.1,
    "isCustom": false
  },
  {
    "id": 636,
    "name": "Amaranth grain, cooked",
    "measure": "1 cup",
    "calcium": 116,
    "isCustom": false
  },
  {
    "id": 637,
    "name": "Arrowroot flour",
    "measure": "1 cup",
    "calcium": 51.2,
    "isCustom": false
  },
  {
    "id": 638,
    "name": "Sweetener, syrup, agave",
    "measure": "1 tsp",
    "calcium": 0.069,
    "isCustom": false
  },
  {
    "id": 639,
    "name": "Ice creams, strawberry",
    "measure": "1 individual (3.5 fl oz)",
    "calcium": 69.6,
    "isCustom": false
  },
  {
    "id": 640,
    "name": "Sweeteners, tabletop, fructose, liquid",
    "measure": "1 serving",
    "calcium": 0.001,
    "isCustom": false
  },
  {
    "id": 641,
    "name": "Sugar, turbinado",
    "measure": "1 tsp",
    "calcium": 0.552,
    "isCustom": false
  },
  {
    "id": 642,
    "name": "Candies, hard",
    "measure": "1 piece, small",
    "calcium": 0.09,
    "isCustom": false
  },
  {
    "id": 643,
    "name": "Cocoa, dry powder, unsweetened",
    "measure": "1 tbsp",
    "calcium": 6.91,
    "isCustom": false
  },
  {
    "id": 644,
    "name": "Syrups, malt",
    "measure": "1 tbsp",
    "calcium": 12.8,
    "isCustom": false
  },
  {
    "id": 645,
    "name": "Jams and preserves",
    "measure": "1 packet (0.5 oz)",
    "calcium": 2.8,
    "isCustom": false
  },
  {
    "id": 646,
    "name": "Puddings, rice, dry mix",
    "measure": "1 portion, amount to make 1/2 cup",
    "calcium": 3.78,
    "isCustom": false
  },
  {
    "id": 647,
    "name": "Nuts, ginkgo nuts, raw",
    "measure": "1 oz",
    "calcium": 0.567,
    "isCustom": false
  },
  {
    "id": 648,
    "name": "Seeds, sesame butter, tahini, from raw and stone ground kernels",
    "measure": "1 tbsp",
    "calcium": 63,
    "isCustom": false
  },
  {
    "id": 649,
    "name": "Yam, raw",
    "measure": "1 cup, cubes",
    "calcium": 25.5,
    "isCustom": false
  },
  {
    "id": 650,
    "name": "Waxgourd, (chinese preserving melon), raw",
    "measure": "1 cup, cubes",
    "calcium": 25.1,
    "isCustom": false
  },
  {
    "id": 651,
    "name": "Winged bean, immature seeds, cooked, boiled, drained, with salt",
    "measure": "0.5 cup",
    "calcium": 18.9,
    "isCustom": false
  },
  {
    "id": 652,
    "name": "Turnips, raw",
    "measure": "1 slice",
    "calcium": 4.5,
    "isCustom": false
  },
  {
    "id": 653,
    "name": "Taro, tahitian, raw",
    "measure": "1 cup slices",
    "calcium": 161,
    "isCustom": false
  },
  {
    "id": 654,
    "name": "Squash, winter, all varieties, raw",
    "measure": "1 cup, cubes",
    "calcium": 32.5,
    "isCustom": false
  },
  {
    "id": 655,
    "name": "Succotash, (corn and limas), raw",
    "measure": "100 g",
    "calcium": 18,
    "isCustom": false
  },
  {
    "id": 656,
    "name": "Rutabagas, raw",
    "measure": "1 cup, cubes",
    "calcium": 60.2,
    "isCustom": false
  },
  {
    "id": 657,
    "name": "Salsify, (vegetable oyster), raw",
    "measure": "1 cup slices",
    "calcium": 79.8,
    "isCustom": false
  },
  {
    "id": 658,
    "name": "Potatoes, red, flesh and skin, raw",
    "measure": "0.5 cup, diced",
    "calcium": 7.5,
    "isCustom": false
  },
  {
    "id": 659,
    "name": "Pumpkin, raw",
    "measure": "1 cup (1 cubes)",
    "calcium": 24.4,
    "isCustom": false
  },
  {
    "id": 660,
    "name": "Pokeberry shoots, (poke), raw",
    "measure": "1 cup",
    "calcium": 84.8,
    "isCustom": false
  },
  {
    "id": 661,
    "name": "Peppers, hot chili, green, raw",
    "measure": "1 pepper",
    "calcium": 8.1,
    "isCustom": false
  },
  {
    "id": 662,
    "name": "Pigeonpeas, immature seeds, raw",
    "measure": "10 seeds",
    "calcium": 1.68,
    "isCustom": false
  },
  {
    "id": 663,
    "name": "Parsnips, raw",
    "measure": "1 cup slices",
    "calcium": 47.9,
    "isCustom": false
  },
  {
    "id": 664,
    "name": "Onions, welsh, raw",
    "measure": "100 g",
    "calcium": 18,
    "isCustom": false
  },
  {
    "id": 665,
    "name": "Carrot, dehydrated",
    "measure": "1 cup",
    "calcium": 157,
    "isCustom": false
  },
  {
    "id": 666,
    "name": "Mustard greens, raw",
    "measure": "1 cup, chopped",
    "calcium": 64.4,
    "isCustom": false
  },
  {
    "id": 667,
    "name": "Tomatoes, orange, raw",
    "measure": "1 tomato",
    "calcium": 5.55,
    "isCustom": false
  },
  {
    "id": 668,
    "name": "Mustard spinach, (tendergreen), raw",
    "measure": "1 cup, chopped",
    "calcium": 315,
    "isCustom": false
  },
  {
    "id": 669,
    "name": "New Zealand spinach, raw",
    "measure": "1 cup, chopped",
    "calcium": 32.5,
    "isCustom": false
  },
  {
    "id": 670,
    "name": "Shallots, raw",
    "measure": "1 tbsp chopped",
    "calcium": 3.7,
    "isCustom": false
  },
  {
    "id": 671,
    "name": "Seaweed, wakame, raw",
    "measure": "2 tbsp (1/8 cup)",
    "calcium": 15,
    "isCustom": false
  },
  {
    "id": 672,
    "name": "Spinach souffle",
    "measure": "1 cup",
    "calcium": 224,
    "isCustom": false
  },
  {
    "id": 673,
    "name": "Borage, raw",
    "measure": "1 cup (1 pieces)",
    "calcium": 82.8,
    "isCustom": false
  },
  {
    "id": 674,
    "name": "Parsley, fresh",
    "measure": "1 tbsp",
    "calcium": 5.24,
    "isCustom": false
  },
  {
    "id": 675,
    "name": "Leeks, (bulb and lower leaf-portion), raw",
    "measure": "1 slice",
    "calcium": 3.54,
    "isCustom": false
  },
  {
    "id": 676,
    "name": "Winged bean leaves, raw",
    "measure": "100 g",
    "calcium": 224,
    "isCustom": false
  },
  {
    "id": 677,
    "name": "Vinespinach, (basella), raw",
    "measure": "100 g",
    "calcium": 109,
    "isCustom": false
  },
  {
    "id": 678,
    "name": "Turnip greens, raw",
    "measure": "1 cup, chopped",
    "calcium": 104,
    "isCustom": false
  },
  {
    "id": 679,
    "name": "Tree fern, cooked, with salt",
    "measure": "1 frond (6-1/2 long)",
    "calcium": 2.48,
    "isCustom": false
  },
  {
    "id": 680,
    "name": "Tomato powder",
    "measure": "100 g",
    "calcium": 166,
    "isCustom": false
  },
  {
    "id": 681,
    "name": "Poi",
    "measure": "1 cup",
    "calcium": 38.4,
    "isCustom": false
  },
  {
    "id": 682,
    "name": "Corn, sweet, yellow, raw",
    "measure": "1 ear, small (5-1/2 to 6-1/2 long)",
    "calcium": 1.46,
    "isCustom": false
  },
  {
    "id": 683,
    "name": "Collards, raw",
    "measure": "1 cup, chopped",
    "calcium": 83.5,
    "isCustom": false
  },
  {
    "id": 684,
    "name": "Chayote, fruit, raw",
    "measure": "1 cup (1 pieces)",
    "calcium": 22.4,
    "isCustom": false
  },
  {
    "id": 685,
    "name": "Chicory, witloof, raw",
    "measure": "0.5 cup",
    "calcium": 8.55,
    "isCustom": false
  },
  {
    "id": 686,
    "name": "Chard, swiss, raw",
    "measure": "1 cup",
    "calcium": 18.4,
    "isCustom": false
  },
  {
    "id": 687,
    "name": "Chrysanthemum, garland, raw",
    "measure": "1 stem (8-3/4 long)",
    "calcium": 16.4,
    "isCustom": false
  },
  {
    "id": 688,
    "name": "Cauliflower, raw",
    "measure": "1 floweret",
    "calcium": 2.86,
    "isCustom": false
  },
  {
    "id": 689,
    "name": "Celeriac, raw",
    "measure": "1 cup",
    "calcium": 67.1,
    "isCustom": false
  },
  {
    "id": 690,
    "name": "Cabbage, chinese (pak-choi), raw",
    "measure": "1 leaf",
    "calcium": 14.7,
    "isCustom": false
  },
  {
    "id": 691,
    "name": "Butterbur, (fuki), raw",
    "measure": "1 petiole",
    "calcium": 5.15,
    "isCustom": false
  },
  {
    "id": 692,
    "name": "Burdock root, raw",
    "measure": "1 cup (1 pieces)",
    "calcium": 48.4,
    "isCustom": false
  },
  {
    "id": 693,
    "name": "Broccoli, raw",
    "measure": "1 spear (about 5 long)",
    "calcium": 14.6,
    "isCustom": false
  },
  {
    "id": 694,
    "name": "Broadbeans, immature seeds, raw",
    "measure": "1 broadbean",
    "calcium": 1.76,
    "isCustom": false
  },
  {
    "id": 695,
    "name": "Yogurt parfait, lowfat, with fruit and granola",
    "measure": "1 item",
    "calcium": 156,
    "isCustom": false
  },
  {
    "id": 696,
    "name": "Corn bran, crude",
    "measure": "1 cup",
    "calcium": 31.9,
    "isCustom": false
  },
  {
    "id": 697,
    "name": "Corn flour, masa harina, white or yellow, dry, raw",
    "measure": "100 g",
    "calcium": 112,
    "isCustom": false
  },
  {
    "id": 698,
    "name": "Corn grain, white",
    "measure": "1 cup",
    "calcium": 11.6,
    "isCustom": false
  },
  {
    "id": 699,
    "name": "Buckwheat",
    "measure": "1 cup",
    "calcium": 30.6,
    "isCustom": false
  },
  {
    "id": 700,
    "name": "Barley, pearled, raw",
    "measure": "1 cup",
    "calcium": 58,
    "isCustom": false
  },
  {
    "id": 701,
    "name": "Jams, preserves, marmalade, reduced sugar",
    "measure": "1 tablespoon",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 702,
    "name": "Syrup, Cane",
    "measure": "1 serving",
    "calcium": 2.73,
    "isCustom": false
  },
  {
    "id": 703,
    "name": "Chocolate, dark, 70-85% cacao solids",
    "measure": "1 oz",
    "calcium": 20.7,
    "isCustom": false
  },
  {
    "id": 704,
    "name": "Potato chips, without salt, reduced fat",
    "measure": "1 oz",
    "calcium": 5.95,
    "isCustom": false
  },
  {
    "id": 705,
    "name": "Mushrooms, portabella, exposed to ultraviolet light, raw",
    "measure": "1 piece whole",
    "calcium": 2.52,
    "isCustom": false
  },
  {
    "id": 706,
    "name": "Sweet potato leaves, raw",
    "measure": "1 leaf (12-1/4 long)",
    "calcium": 12.5,
    "isCustom": false
  },
  {
    "id": 707,
    "name": "Water convolvulus,raw",
    "measure": "1 shoot",
    "calcium": 10,
    "isCustom": false
  },
  {
    "id": 708,
    "name": "Pumpkin leaves, raw",
    "measure": "1 cup",
    "calcium": 15.2,
    "isCustom": false
  },
  {
    "id": 709,
    "name": "Radishes, white icicle, raw",
    "measure": "1 radish (7 long)",
    "calcium": 4.59,
    "isCustom": false
  },
  {
    "id": 710,
    "name": "Okra, raw",
    "measure": "8 pods (3 long)",
    "calcium": 77.9,
    "isCustom": false
  },
  {
    "id": 711,
    "name": "Radish seeds, sprouted, raw",
    "measure": "1 cup",
    "calcium": 19.4,
    "isCustom": false
  },
  {
    "id": 712,
    "name": "Potato pancakes",
    "measure": "1 small 2-3/4 in. dia., 5/8 in. thick.",
    "calcium": 7.04,
    "isCustom": false
  },
  {
    "id": 713,
    "name": "Chives, raw",
    "measure": "1 tsp chopped",
    "calcium": 0.92,
    "isCustom": false
  },
  {
    "id": 714,
    "name": "Yambean (jicama), raw",
    "measure": "1 slice",
    "calcium": 0.72,
    "isCustom": false
  },
  {
    "id": 715,
    "name": "Dock, raw",
    "measure": "1 cup, chopped",
    "calcium": 58.5,
    "isCustom": false
  },
  {
    "id": 716,
    "name": "Eppaw, raw",
    "measure": "1 cup",
    "calcium": 110,
    "isCustom": false
  },
  {
    "id": 717,
    "name": "Winged bean tuber, raw",
    "measure": "100 g",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 718,
    "name": "Waterchestnuts, chinese, (matai), raw",
    "measure": "4 waterchestnuts",
    "calcium": 3.96,
    "isCustom": false
  },
  {
    "id": 719,
    "name": "Watercress, raw",
    "measure": "1 sprig",
    "calcium": 3,
    "isCustom": false
  },
  {
    "id": 720,
    "name": "Coriander (cilantro) leaves, raw",
    "measure": "0.25 cup",
    "calcium": 2.68,
    "isCustom": false
  },
  {
    "id": 721,
    "name": "Celery, raw",
    "measure": "1 strip (4 long)",
    "calcium": 1.6,
    "isCustom": false
  },
  {
    "id": 722,
    "name": "Chicory greens, raw",
    "measure": "1 cup, chopped",
    "calcium": 29,
    "isCustom": false
  },
  {
    "id": 723,
    "name": "Celtuce, raw",
    "measure": "1 leaf",
    "calcium": 3.12,
    "isCustom": false
  },
  {
    "id": 724,
    "name": "Cassava, raw",
    "measure": "1 cup",
    "calcium": 33,
    "isCustom": false
  },
  {
    "id": 725,
    "name": "Plums, raw",
    "measure": "1 fruit (2-1/8 dia)",
    "calcium": 3.96,
    "isCustom": false
  },
  {
    "id": 726,
    "name": "Persimmons, native, raw",
    "measure": "1 fruit without refuse",
    "calcium": 6.75,
    "isCustom": false
  },
  {
    "id": 727,
    "name": "Pineapple, raw, all varieties",
    "measure": "1 slice, thin (3-1/2 dia x 1/2 thick)",
    "calcium": 7.28,
    "isCustom": false
  },
  {
    "id": 728,
    "name": "Pears, raw",
    "measure": "1 cup, slices",
    "calcium": 12.6,
    "isCustom": false
  },
  {
    "id": 729,
    "name": "Peaches, yellow, raw",
    "measure": "1 small (2-1/2 dia)",
    "calcium": 7.8,
    "isCustom": false
  },
  {
    "id": 730,
    "name": "Tangerine juice, raw",
    "measure": "1 fl oz",
    "calcium": 5.56,
    "isCustom": false
  },
  {
    "id": 731,
    "name": "Oheloberries, raw",
    "measure": "10 fruit",
    "calcium": 0.77,
    "isCustom": false
  },
  {
    "id": 732,
    "name": "Nectarines, raw",
    "measure": "1 each, 2-1/3 dia",
    "calcium": 2.58,
    "isCustom": false
  },
  {
    "id": 733,
    "name": "Mulberries, raw",
    "measure": "10 fruit",
    "calcium": 5.85,
    "isCustom": false
  },
  {
    "id": 734,
    "name": "Dove, cooked (includes squab)",
    "measure": "1 cup, chopped or diced",
    "calcium": 23.8,
    "isCustom": false
  },
  {
    "id": 735,
    "name": "Loquats, raw",
    "measure": "1 small",
    "calcium": 2.18,
    "isCustom": false
  },
  {
    "id": 736,
    "name": "Melons, honeydew, raw",
    "measure": "1 wedge (1/8 of 5-1/4 dia melon)",
    "calcium": 7.5,
    "isCustom": false
  },
  {
    "id": 737,
    "name": "Mammy-apple, (mamey), raw",
    "measure": "1 fruit without refuse",
    "calcium": 93.1,
    "isCustom": false
  },
  {
    "id": 738,
    "name": "Longans, raw",
    "measure": "1 fruit without refuse",
    "calcium": 0.032,
    "isCustom": false
  },
  {
    "id": 739,
    "name": "Mangos, raw",
    "measure": "1 cup pieces",
    "calcium": 18.2,
    "isCustom": false
  },
  {
    "id": 740,
    "name": "Pork, ground, 96% lean / 4% fat, raw",
    "measure": "4 oz",
    "calcium": 17,
    "isCustom": false
  },
  {
    "id": 741,
    "name": "Whipped cream substitute, dietetic, made from powdered mix",
    "measure": "1 cup",
    "calcium": 2.4,
    "isCustom": false
  },
  {
    "id": 742,
    "name": "Bacon bits, meatless",
    "measure": "1 tbsp",
    "calcium": 7.07,
    "isCustom": false
  },
  {
    "id": 743,
    "name": "Beverage, instant breakfast powder, chocolate, not reconstituted",
    "measure": "1 tbsp",
    "calcium": 21.1,
    "isCustom": false
  },
  {
    "id": 744,
    "name": "Butter replacement, without fat, powder",
    "measure": "1 cup",
    "calcium": 18.4,
    "isCustom": false
  },
  {
    "id": 745,
    "name": "Eggplant, raw",
    "measure": "1 cup, cubes",
    "calcium": 7.38,
    "isCustom": false
  },
  {
    "id": 746,
    "name": "Vegetarian meatloaf or patties",
    "measure": "1 slice",
    "calcium": 16.2,
    "isCustom": false
  },
  {
    "id": 747,
    "name": "Jellies",
    "measure": "1 packet (0.5 oz)",
    "calcium": 0.98,
    "isCustom": false
  },
  {
    "id": 748,
    "name": "Chewing gum",
    "measure": "1 stick",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 749,
    "name": "Vermicelli, made from soy",
    "measure": "1 cup",
    "calcium": 77,
    "isCustom": false
  },
  {
    "id": 750,
    "name": "Hazelnuts, beaked (Northern Plains Indians)",
    "measure": "1 nut",
    "calcium": 1.76,
    "isCustom": false
  },
  {
    "id": 751,
    "name": "Tortilla, blue corn, Sakwavikaviki (Hopi)",
    "measure": "1 piece",
    "calcium": 99.2,
    "isCustom": false
  },
  {
    "id": 752,
    "name": "Wocas, dried seeds, Oregon, yellow pond lily (Klamath)",
    "measure": "1 oz",
    "calcium": 7.65,
    "isCustom": false
  },
  {
    "id": 753,
    "name": "Tea, herbal, brewed, Hohoysi (Hopi)",
    "measure": "100 g",
    "calcium": 5,
    "isCustom": false
  },
  {
    "id": 754,
    "name": "Caribou, eye, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 19,
    "isCustom": false
  },
  {
    "id": 755,
    "name": "Sea lion, Steller, meat (Alaska Native)",
    "measure": "100 g",
    "calcium": 6,
    "isCustom": false
  },
  {
    "id": 756,
    "name": "Prairie Turnips, raw (Northern Plains Indians)",
    "measure": "1 bulb peeled",
    "calcium": 16.4,
    "isCustom": false
  },
  {
    "id": 757,
    "name": "Lambsquarters, raw (Northern Plains Indians)",
    "measure": "1 leaf",
    "calcium": 3.29,
    "isCustom": false
  },
  {
    "id": 758,
    "name": "Pinon Nuts, roasted (Navajo)",
    "measure": "100 g",
    "calcium": 18,
    "isCustom": false
  },
  {
    "id": 759,
    "name": "Stinging Nettles, blanched (Northern Plains Indians)",
    "measure": "1 cup",
    "calcium": 428,
    "isCustom": false
  },
  {
    "id": 760,
    "name": "Prickly pears, raw (Northern Plains Indians)",
    "measure": "1 pad peeled",
    "calcium": 34.2,
    "isCustom": false
  },
  {
    "id": 761,
    "name": "Agave, raw (Southwest)",
    "measure": "100 g",
    "calcium": 417,
    "isCustom": false
  },
  {
    "id": 762,
    "name": "Cockles, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 763,
    "name": "Tennis Bread, plain (Apache)",
    "measure": "100 g",
    "calcium": 67,
    "isCustom": false
  },
  {
    "id": 764,
    "name": "Cloudberries, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 18,
    "isCustom": false
  },
  {
    "id": 765,
    "name": "Huckleberries, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 15,
    "isCustom": false
  },
  {
    "id": 766,
    "name": "Cranberry, low bush or lingenberry, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 26,
    "isCustom": false
  },
  {
    "id": 767,
    "name": "Bear, polar, meat, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 17,
    "isCustom": false
  },
  {
    "id": 768,
    "name": "Whale, beluga, meat, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 7,
    "isCustom": false
  },
  {
    "id": 769,
    "name": "Rice mix, cheese flavor, dry mix, unprepared",
    "measure": "0.25 cup dry rice mix",
    "calcium": 79.8,
    "isCustom": false
  },
  {
    "id": 770,
    "name": "Macaroni or noodles with cheese, microwaveable, unprepared",
    "measure": "1 serving 1 pouch",
    "calcium": 200,
    "isCustom": false
  },
  {
    "id": 771,
    "name": "Spanish rice mix, dry mix, unprepared",
    "measure": "1 tbsp",
    "calcium": 2.55,
    "isCustom": false
  },
  {
    "id": 772,
    "name": "Ginger root, raw",
    "measure": "1 tsp",
    "calcium": 0.32,
    "isCustom": false
  },
  {
    "id": 773,
    "name": "Wheat, durum",
    "measure": "1 cup",
    "calcium": 65.3,
    "isCustom": false
  },
  {
    "id": 774,
    "name": "Spelt, cooked",
    "measure": "1 cup",
    "calcium": 19.4,
    "isCustom": false
  },
  {
    "id": 775,
    "name": "Rice noodles, dry",
    "measure": "2 oz",
    "calcium": 10.3,
    "isCustom": false
  },
  {
    "id": 776,
    "name": "Barley malt flour",
    "measure": "1 cup",
    "calcium": 59.9,
    "isCustom": false
  },
  {
    "id": 777,
    "name": "Wild rice, raw",
    "measure": "1 cup",
    "calcium": 33.6,
    "isCustom": false
  },
  {
    "id": 778,
    "name": "Wheat bran, crude",
    "measure": "1 cup",
    "calcium": 42.3,
    "isCustom": false
  },
  {
    "id": 779,
    "name": "Sorghum grain, white, pearled, unenriched, dry, raw",
    "measure": "100 g",
    "calcium": 7.45,
    "isCustom": false
  },
  {
    "id": 780,
    "name": "Rice bran, crude",
    "measure": "1 cup",
    "calcium": 67.3,
    "isCustom": false
  },
  {
    "id": 781,
    "name": "Triticale",
    "measure": "1 cup",
    "calcium": 71,
    "isCustom": false
  },
  {
    "id": 782,
    "name": "Tapioca, pearl, dry",
    "measure": "1 cup",
    "calcium": 30.4,
    "isCustom": false
  },
  {
    "id": 783,
    "name": "Rice flour, brown",
    "measure": "1 cup",
    "calcium": 17.4,
    "isCustom": false
  },
  {
    "id": 784,
    "name": "Semolina, enriched",
    "measure": "1 cup",
    "calcium": 28.4,
    "isCustom": false
  },
  {
    "id": 785,
    "name": "Millet, raw",
    "measure": "1 cup",
    "calcium": 16,
    "isCustom": false
  },
  {
    "id": 786,
    "name": "Couscous, dry",
    "measure": "1 cup",
    "calcium": 41.5,
    "isCustom": false
  },
  {
    "id": 787,
    "name": "Cornstarch",
    "measure": "1 cup",
    "calcium": 2.56,
    "isCustom": false
  },
  {
    "id": 788,
    "name": "Gelatin desserts, dry mix",
    "measure": "1 portion, amount to make 1/2 cup",
    "calcium": 0.63,
    "isCustom": false
  },
  {
    "id": 789,
    "name": "Toppings, strawberry",
    "measure": "1 serving",
    "calcium": 2.4,
    "isCustom": false
  },
  {
    "id": 790,
    "name": "Frostings, white, fluffy, dry mix",
    "measure": "0.08 package",
    "calcium": 0.68,
    "isCustom": false
  },
  {
    "id": 791,
    "name": "Sugars, maple",
    "measure": "1 tsp",
    "calcium": 2.7,
    "isCustom": false
  },
  {
    "id": 792,
    "name": "Honey",
    "measure": "1 packet (0.5 oz)",
    "calcium": 0.84,
    "isCustom": false
  },
  {
    "id": 793,
    "name": "Desserts, rennin, vanilla, dry mix",
    "measure": "1 tbsp",
    "calcium": 12.6,
    "isCustom": false
  },
  {
    "id": 794,
    "name": "Gelatins, dry powder, unsweetened",
    "measure": "1 envelope (1 tbsp)",
    "calcium": 3.85,
    "isCustom": false
  },
  {
    "id": 795,
    "name": "Fiddlehead ferns, raw",
    "measure": "100 g",
    "calcium": 32,
    "isCustom": false
  },
  {
    "id": 796,
    "name": "Malabar spinach, cooked",
    "measure": "1 bunch",
    "calcium": 21.1,
    "isCustom": false
  },
  {
    "id": 797,
    "name": "Yautia (tannier), raw",
    "measure": "1 cup, sliced",
    "calcium": 12.2,
    "isCustom": false
  },
  {
    "id": 798,
    "name": "Epazote, raw",
    "measure": "1 tbsp",
    "calcium": 2.2,
    "isCustom": false
  },
  {
    "id": 799,
    "name": "Fireweed, leaves, raw",
    "measure": "1 plant",
    "calcium": 94.4,
    "isCustom": false
  },
  {
    "id": 800,
    "name": "Pepper, banana, raw",
    "measure": "1 small (4 long)",
    "calcium": 4.62,
    "isCustom": false
  },
  {
    "id": 801,
    "name": "Pickles, cucumber, sour",
    "measure": "1 slice",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 802,
    "name": "Grape leaves, raw",
    "measure": "1 leaf",
    "calcium": 10.9,
    "isCustom": false
  },
  {
    "id": 803,
    "name": "Arugula, raw",
    "measure": "1 leaf",
    "calcium": 3.2,
    "isCustom": false
  },
  {
    "id": 804,
    "name": "Nopales, raw",
    "measure": "1 cup, sliced",
    "calcium": 141,
    "isCustom": false
  },
  {
    "id": 805,
    "name": "Pickle relish, sweet",
    "measure": "1 packet (2/3 tbsp)",
    "calcium": 0.3,
    "isCustom": false
  },
  {
    "id": 806,
    "name": "Fennel, bulb, raw",
    "measure": "1 cup, sliced",
    "calcium": 42.6,
    "isCustom": false
  },
  {
    "id": 807,
    "name": "Catsup",
    "measure": "1 packet",
    "calcium": 1.35,
    "isCustom": false
  },
  {
    "id": 808,
    "name": "Mushroom, white, exposed to ultraviolet light, raw",
    "measure": "1 slice",
    "calcium": 0.18,
    "isCustom": false
  },
  {
    "id": 809,
    "name": "Sesbania flower, raw",
    "measure": "1 flower",
    "calcium": 0.57,
    "isCustom": false
  },
  {
    "id": 810,
    "name": "Jute, potherb, raw",
    "measure": "1 cup",
    "calcium": 58.2,
    "isCustom": false
  },
  {
    "id": 811,
    "name": "Gourd, white-flowered (calabash), raw",
    "measure": "0.5 cup (1 pieces)",
    "calcium": 15.1,
    "isCustom": false
  },
  {
    "id": 812,
    "name": "Yardlong bean, raw",
    "measure": "1 pod",
    "calcium": 6,
    "isCustom": false
  },
  {
    "id": 813,
    "name": "Kohlrabi, raw",
    "measure": "1 slice",
    "calcium": 3.84,
    "isCustom": false
  },
  {
    "id": 814,
    "name": "Dandelion greens, raw",
    "measure": "1 cup, chopped",
    "calcium": 103,
    "isCustom": false
  },
  {
    "id": 815,
    "name": "Asparagus, raw",
    "measure": "1 spear tip (2 long or less)",
    "calcium": 0.84,
    "isCustom": false
  },
  {
    "id": 816,
    "name": "Artichokes, (globe or french), raw",
    "measure": "1 artichoke, medium",
    "calcium": 56.3,
    "isCustom": false
  },
  {
    "id": 817,
    "name": "Taro shoots, raw",
    "measure": "0.5 cup slices",
    "calcium": 5.16,
    "isCustom": false
  },
  {
    "id": 818,
    "name": "Pumpkin flowers, raw",
    "measure": "1 flower",
    "calcium": 0.78,
    "isCustom": false
  },
  {
    "id": 819,
    "name": "Lotus root, raw",
    "measure": "10 slices (2-1/2 dia)",
    "calcium": 36.4,
    "isCustom": false
  },
  {
    "id": 820,
    "name": "Lettuce, green leaf, raw",
    "measure": "1 leaf inner",
    "calcium": 1.73,
    "isCustom": false
  },
  {
    "id": 821,
    "name": "Kanpyo, (dried gourd strips)",
    "measure": "1 strip",
    "calcium": 17.6,
    "isCustom": false
  },
  {
    "id": 822,
    "name": "Hyacinth-beans, immature seeds, raw",
    "measure": "1 cup",
    "calcium": 40,
    "isCustom": false
  },
  {
    "id": 823,
    "name": "Jerusalem-artichokes, raw",
    "measure": "1 cup slices",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 824,
    "name": "Jew's ear, (pepeao), raw",
    "measure": "1 piece",
    "calcium": 0.96,
    "isCustom": false
  },
  {
    "id": 825,
    "name": "Cucumber, peeled, raw",
    "measure": "1 slice",
    "calcium": 0.98,
    "isCustom": false
  },
  {
    "id": 826,
    "name": "Cornsalad, raw",
    "measure": "1 cup",
    "calcium": 21.3,
    "isCustom": false
  },
  {
    "id": 827,
    "name": "Arrowhead, raw",
    "measure": "1 medium",
    "calcium": 1.2,
    "isCustom": false
  },
  {
    "id": 828,
    "name": "Amaranth leaves, raw",
    "measure": "1 leaf",
    "calcium": 30.1,
    "isCustom": false
  },
  {
    "id": 829,
    "name": "Plantains, yellow, raw",
    "measure": "1 cup, sliced",
    "calcium": 4.44,
    "isCustom": false
  },
  {
    "id": 830,
    "name": "Pitanga, (surinam-cherry), raw",
    "measure": "1 fruit without refuse",
    "calcium": 0.63,
    "isCustom": false
  },
  {
    "id": 831,
    "name": "Pomegranates, raw",
    "measure": "0.5 cup arils (seed/juice sacs)",
    "calcium": 8.7,
    "isCustom": false
  },
  {
    "id": 832,
    "name": "Passion-fruit juice, yellow, raw",
    "measure": "1 fl oz",
    "calcium": 1.24,
    "isCustom": false
  },
  {
    "id": 833,
    "name": "Orange peel, raw",
    "measure": "1 tsp",
    "calcium": 3.22,
    "isCustom": false
  },
  {
    "id": 834,
    "name": "Mango, Tommy Atkins, peeled, raw",
    "measure": "100 g",
    "calcium": 12.4,
    "isCustom": false
  },
  {
    "id": 835,
    "name": "Litchis, raw",
    "measure": "1 fruit without refuse",
    "calcium": 0.48,
    "isCustom": false
  },
  {
    "id": 836,
    "name": "Soybean, curd cheese",
    "measure": "1 cup",
    "calcium": 423,
    "isCustom": false
  },
  {
    "id": 837,
    "name": "Vegetarian fillets",
    "measure": "1 fillet",
    "calcium": 80.8,
    "isCustom": false
  },
  {
    "id": 838,
    "name": "Breakfast bars, oats, sugar, raisins, coconut (include granola bar)",
    "measure": "1 bar",
    "calcium": 25.8,
    "isCustom": false
  },
  {
    "id": 839,
    "name": "Luncheon slices, meatless",
    "measure": "1 slice, thin",
    "calcium": 5.74,
    "isCustom": false
  },
  {
    "id": 840,
    "name": "Gums, seed gums (includes locust bean, guar)",
    "measure": "1 oz",
    "calcium": 83.3,
    "isCustom": false
  },
  {
    "id": 841,
    "name": "Piki bread, made from blue cornmeal (Hopi)",
    "measure": "1 piece",
    "calcium": 35,
    "isCustom": false
  },
  {
    "id": 842,
    "name": "Stew, moose (Alaska Native)",
    "measure": "100 g",
    "calcium": 12,
    "isCustom": false
  },
  {
    "id": 843,
    "name": "Tamales, masa and pork filling (Hopi)",
    "measure": "4 oz",
    "calcium": 20.3,
    "isCustom": false
  },
  {
    "id": 844,
    "name": "Cattail, Narrow Leaf Shoots (Northern Plains Indians)",
    "measure": "1 shoot",
    "calcium": 10.3,
    "isCustom": false
  },
  {
    "id": 845,
    "name": "Rose Hips, wild (Northern Plains Indians)",
    "measure": "1 cup",
    "calcium": 215,
    "isCustom": false
  },
  {
    "id": 846,
    "name": "Raspberries, raw",
    "measure": "10 raspberries",
    "calcium": 4.75,
    "isCustom": false
  },
  {
    "id": 847,
    "name": "Chokecherries, raw, pitted (Northern Plains Indians)",
    "measure": "1 cup",
    "calcium": 92.4,
    "isCustom": false
  },
  {
    "id": 848,
    "name": "Chiton, leathery, gumboots (Alaska Native)",
    "measure": "100 g",
    "calcium": 121,
    "isCustom": false
  },
  {
    "id": 849,
    "name": "Stew/soup, caribou (Alaska Native)",
    "measure": "100 g",
    "calcium": 7,
    "isCustom": false
  },
  {
    "id": 850,
    "name": "Agutuk, meat-caribou (Alaskan ice cream) (Alaska Native)",
    "measure": "100 g",
    "calcium": 16,
    "isCustom": false
  },
  {
    "id": 851,
    "name": "Ascidians (tunughnak) (Alaska Native)",
    "measure": "100 g",
    "calcium": 47,
    "isCustom": false
  },
  {
    "id": 852,
    "name": "Pasta mix, classic beef, unprepared",
    "measure": "1 packet",
    "calcium": 9.24,
    "isCustom": false
  },
  {
    "id": 853,
    "name": "Yellow rice with seasoning, dry packet mix, unprepared",
    "measure": "1 serving (2 oz)",
    "calcium": 20,
    "isCustom": false
  },
  {
    "id": 854,
    "name": "Quinoa, cooked",
    "measure": "1 cup",
    "calcium": 31.4,
    "isCustom": false
  },
  {
    "id": 855,
    "name": "Wheat flours, bread, unenriched",
    "measure": "1 cup unsifted, dipped",
    "calcium": 20.6,
    "isCustom": false
  },
  {
    "id": 856,
    "name": "Wheat germ, crude",
    "measure": "1 cup",
    "calcium": 44.8,
    "isCustom": false
  },
  {
    "id": 857,
    "name": "Rye flour, dark",
    "measure": "1 cup",
    "calcium": 47.4,
    "isCustom": false
  },
  {
    "id": 858,
    "name": "Rye grain",
    "measure": "1 cup",
    "calcium": 40.6,
    "isCustom": false
  },
  {
    "id": 859,
    "name": "Triticale flour, whole-grain",
    "measure": "1 cup",
    "calcium": 45.5,
    "isCustom": false
  },
  {
    "id": 860,
    "name": "Oat bran, raw",
    "measure": "1 cup",
    "calcium": 54.5,
    "isCustom": false
  },
  {
    "id": 861,
    "name": "Cheese puffs and twists, corn based, baked, low fat",
    "measure": "1 oz",
    "calcium": 101,
    "isCustom": false
  },
  {
    "id": 862,
    "name": "Molasses",
    "measure": "1 serving 1 tbsp",
    "calcium": 41,
    "isCustom": false
  },
  {
    "id": 863,
    "name": "Pectin, liquid",
    "measure": "1 fl oz assumed specific gravity of honey",
    "calcium": 0,
    "isCustom": false
  },
  {
    "id": 864,
    "name": "Fruit butters, apple",
    "measure": "1 serving",
    "calcium": 2.38,
    "isCustom": false
  },
  {
    "id": 865,
    "name": "Marmalade, orange",
    "measure": "1 package (0.5 oz)",
    "calcium": 5.32,
    "isCustom": false
  },
  {
    "id": 866,
    "name": "Egg custards, dry mix",
    "measure": "1 portion, amount to make 1/2 cup",
    "calcium": 47.9,
    "isCustom": false
  },
  {
    "id": 867,
    "name": "Fungi, Cloud ears, dried",
    "measure": "1 piece",
    "calcium": 7.16,
    "isCustom": false
  },
  {
    "id": 868,
    "name": "Hearts of palm, raw",
    "measure": "100 g",
    "calcium": 18,
    "isCustom": false
  },
  {
    "id": 869,
    "name": "Lemon grass (citronella), raw",
    "measure": "1 tbsp",
    "calcium": 3.12,
    "isCustom": false
  },
  {
    "id": 870,
    "name": "Radicchio, raw",
    "measure": "1 leaf",
    "calcium": 1.52,
    "isCustom": false
  },
  {
    "id": 871,
    "name": "Tomatillos, raw",
    "measure": "1 medium",
    "calcium": 2.38,
    "isCustom": false
  },
  {
    "id": 872,
    "name": "Mountain yam, hawaii, raw",
    "measure": "0.5 cup, cubes",
    "calcium": 17.7,
    "isCustom": false
  },
  {
    "id": 873,
    "name": "Drumstick leaves, raw",
    "measure": "1 cup, chopped",
    "calcium": 38.8,
    "isCustom": false
  },
  {
    "id": 874,
    "name": "Taro leaves, raw",
    "measure": "1 leaf (11 x 6-1/2)",
    "calcium": 10.7,
    "isCustom": false
  },
  {
    "id": 875,
    "name": "Chrysanthemum leaves, raw",
    "measure": "1 leaf",
    "calcium": 21.1,
    "isCustom": false
  },
  {
    "id": 876,
    "name": "Balsam-pear (bitter gourd), pods, raw",
    "measure": "1 cup (1/2 pieces)",
    "calcium": 17.7,
    "isCustom": false
  },
  {
    "id": 877,
    "name": "Arrowroot, raw",
    "measure": "1 root",
    "calcium": 1.98,
    "isCustom": false
  },
  {
    "id": 878,
    "name": "Potato flour",
    "measure": "1 cup",
    "calcium": 104,
    "isCustom": false
  },
  {
    "id": 879,
    "name": "Pepeao, dried",
    "measure": "1 cup",
    "calcium": 27.1,
    "isCustom": false
  },
  {
    "id": 880,
    "name": "Escarole, cooked, boiled, drained, no salt added",
    "measure": "1 cup",
    "calcium": 69,
    "isCustom": false
  },
  {
    "id": 881,
    "name": "Endive, raw",
    "measure": "0.5 cup, chopped",
    "calcium": 13,
    "isCustom": false
  },
  {
    "id": 882,
    "name": "Canadian bacon, unprepared",
    "measure": "2 slices (6 per 6-oz pkg.)",
    "calcium": 3.42,
    "isCustom": false
  },
  {
    "id": 883,
    "name": "Alfalfa seeds, sprouted, raw",
    "measure": "1 tbsp",
    "calcium": 0.96,
    "isCustom": false
  },
  {
    "id": 884,
    "name": "Raspberry juice concentrate",
    "measure": "100 g",
    "calcium": 97,
    "isCustom": false
  },
  {
    "id": 885,
    "name": "Cranberry juice blend, 100% juice, bottled, with added vitamin C and calcium",
    "measure": "6.75 fl oz",
    "calcium": 38,
    "isCustom": false
  },
  {
    "id": 886,
    "name": "Juice, prune, shelf-stable",
    "measure": "100 g",
    "calcium": 16.2,
    "isCustom": false
  },
  {
    "id": 887,
    "name": "Clementines, raw",
    "measure": "1 fruit",
    "calcium": 22.2,
    "isCustom": false
  },
  {
    "id": 888,
    "name": "Sugar-apples, (sweetsop), raw",
    "measure": "1 fruit (2-7/8 dia)",
    "calcium": 37.2,
    "isCustom": false
  },
  {
    "id": 889,
    "name": "Feijoa, raw",
    "measure": "1 fruit without peel",
    "calcium": 7.14,
    "isCustom": false
  },
  {
    "id": 890,
    "name": "Rose-apples, raw",
    "measure": "100 g",
    "calcium": 29,
    "isCustom": false
  },
  {
    "id": 891,
    "name": "Rhubarb, raw",
    "measure": "1 stalk",
    "calcium": 43.9,
    "isCustom": false
  },
  {
    "id": 892,
    "name": "Raisins, seeded",
    "measure": "1 cup (not packed)",
    "calcium": 40.6,
    "isCustom": false
  },
  {
    "id": 893,
    "name": "Roselle, raw",
    "measure": "1 cup, without refuse",
    "calcium": 123,
    "isCustom": false
  },
  {
    "id": 894,
    "name": "Prunes, dehydrated (low-moisture), stewed",
    "measure": "1 cup",
    "calcium": 67.2,
    "isCustom": false
  },
  {
    "id": 895,
    "name": "Quinces, raw",
    "measure": "1 fruit without refuse",
    "calcium": 10.1,
    "isCustom": false
  },
  {
    "id": 896,
    "name": "Frog legs, raw",
    "measure": "1 leg",
    "calcium": 8.1,
    "isCustom": false
  },
  {
    "id": 897,
    "name": "Limes, raw",
    "measure": "1 fruit (2 dia)",
    "calcium": 22.1,
    "isCustom": false
  },
  {
    "id": 898,
    "name": "Jujube, raw",
    "measure": "100 g",
    "calcium": 21,
    "isCustom": false
  },
  {
    "id": 899,
    "name": "Kumquats, raw",
    "measure": "1 fruit without refuse",
    "calcium": 11.8,
    "isCustom": false
  },
  {
    "id": 900,
    "name": "Java-plum, (jambolan), raw",
    "measure": "3 fruit",
    "calcium": 1.71,
    "isCustom": false
  },
  {
    "id": 901,
    "name": "Vital wheat gluten",
    "measure": "100 g",
    "calcium": 142,
    "isCustom": false
  },
  {
    "id": 902,
    "name": "Jellyfish, dried, salted",
    "measure": "1 cup",
    "calcium": 1.16,
    "isCustom": false
  },
  {
    "id": 903,
    "name": "Cranberry juice, unsweetened",
    "measure": "1 fl oz",
    "calcium": 2.53,
    "isCustom": false
  },
  {
    "id": 904,
    "name": "Rice cake, cracker (include hain mini rice cakes)",
    "measure": "1 cubic inch",
    "calcium": 0.462,
    "isCustom": false
  },
  {
    "id": 905,
    "name": "Papad",
    "measure": "100 g",
    "calcium": 143,
    "isCustom": false
  },
  {
    "id": 906,
    "name": "Granola bar, soft, milk chocolate coated, peanut butter",
    "measure": "1 oz",
    "calcium": 30.6,
    "isCustom": false
  },
  {
    "id": 907,
    "name": "Creamy dressing, made with sour cream and/or buttermilk and oil, reduced calorie",
    "measure": "1 tbsp",
    "calcium": 0.9,
    "isCustom": false
  },
  {
    "id": 908,
    "name": "Imitation cheese, american or cheddar, low cholesterol",
    "measure": "1 cubic inch",
    "calcium": 127,
    "isCustom": false
  },
  {
    "id": 909,
    "name": "Acorn stew (Apache)",
    "measure": "100 g",
    "calcium": 14,
    "isCustom": false
  },
  {
    "id": 910,
    "name": "Elk, free range, ground, raw (Shoshone Bannock)",
    "measure": "100 g",
    "calcium": 4,
    "isCustom": false
  },
  {
    "id": 911,
    "name": "Seal, bearded (Oogruk), meat, low quadrant, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 4,
    "isCustom": false
  },
  {
    "id": 912,
    "name": "Salmonberries, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 13,
    "isCustom": false
  },
  {
    "id": 913,
    "name": "Octopus (Alaska Native)",
    "measure": "100 g",
    "calcium": 35,
    "isCustom": false
  },
  {
    "id": 914,
    "name": "Walrus, meat, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 18,
    "isCustom": false
  },
  {
    "id": 915,
    "name": "Sourdock, young leaves (Alaska Native)",
    "measure": "100 g",
    "calcium": 2,
    "isCustom": false
  },
  {
    "id": 916,
    "name": "Willow, young leaves, chopped (Alaska Native)",
    "measure": "100 g",
    "calcium": 130,
    "isCustom": false
  },
  {
    "id": 917,
    "name": "Mouse nuts, roots (Alaska Native)",
    "measure": "100 g",
    "calcium": 22,
    "isCustom": false
  },
  {
    "id": 918,
    "name": "Schar, Gluten-Free, Classic White Rolls",
    "measure": "1 roll",
    "calcium": 140,
    "isCustom": false
  },
  {
    "id": 919,
    "name": "Van's, Gluten Free, Totally Original Waffles",
    "measure": "1 waffle",
    "calcium": 22.6,
    "isCustom": false
  },
  {
    "id": 920,
    "name": "Udi's, Gluten Free, Whole Grain Dinner Rolls",
    "measure": "1 roll",
    "calcium": 51.9,
    "isCustom": false
  },
  {
    "id": 921,
    "name": "Sweet potatoes, orange flesh, without skin, raw",
    "measure": "100 g",
    "calcium": 22.3,
    "isCustom": false
  },
  {
    "id": 922,
    "name": "Mary's Gone Crackers, Original Crackers, Organic Gluten Free",
    "measure": "3 crackers",
    "calcium": 16.5,
    "isCustom": false
  },
  {
    "id": 923,
    "name": "Glutino, Gluten Free Wafers, Milk Chocolate",
    "measure": "3 cookies",
    "calcium": 25.1,
    "isCustom": false
  },
  {
    "id": 924,
    "name": "Sage Valley, Gluten Free Vanilla Sandwich Cookies",
    "measure": "3 cookies",
    "calcium": 7.48,
    "isCustom": false
  },
  {
    "id": 925,
    "name": "Baking chocolate, mexican, squares",
    "measure": "1 tablet",
    "calcium": 6.8,
    "isCustom": false
  },
  {
    "id": 926,
    "name": "Fruit syrup",
    "measure": "0.25 cup",
    "calcium": 6.72,
    "isCustom": false
  },
  {
    "id": 927,
    "name": "Cinnamon buns, frosted (includes honey buns)",
    "measure": "1 bun",
    "calcium": 119,
    "isCustom": false
  },
  {
    "id": 928,
    "name": "Pan Dulce, La Ricura, Salpora de Arroz con Azucar, cookie-like, contains wheat flour and rice flour",
    "measure": "1 piece (1 serving)",
    "calcium": 21.8,
    "isCustom": false
  },
  {
    "id": 929,
    "name": "Keikitos (muffins), Latino bakery item",
    "measure": "1 piece",
    "calcium": 26.5,
    "isCustom": false
  },
  {
    "id": 930,
    "name": "Interstate Brands Corp, Wonder Hamburger Rolls",
    "measure": "1 serving",
    "calcium": 37.4,
    "isCustom": false
  },
  {
    "id": 931,
    "name": "Pillsbury Grands, Buttermilk Biscuits, refrigerated dough",
    "measure": "1 biscuit",
    "calcium": 7.82,
    "isCustom": false
  },
  {
    "id": 932,
    "name": "Baobab powder",
    "measure": "100 g",
    "calcium": 342,
    "isCustom": false
  },
  {
    "id": 933,
    "name": "Cherry juice, tart",
    "measure": "1 fl oz",
    "calcium": 4.1,
    "isCustom": false
  },
  {
    "id": 934,
    "name": "Horned melon (Kiwano)",
    "measure": "1 fruit (4-2/3 long x 2-3/4 dia)",
    "calcium": 27.2,
    "isCustom": false
  },
  {
    "id": 935,
    "name": "Orange Pineapple Juice Blend",
    "measure": "8 fl oz",
    "calcium": 19.7,
    "isCustom": false
  },
  {
    "id": 936,
    "name": "Abiyuch, raw",
    "measure": "0.5 cup",
    "calcium": 9.12,
    "isCustom": false
  },
  {
    "id": 937,
    "name": "Candied fruit",
    "measure": "100 g",
    "calcium": 18,
    "isCustom": false
  },
  {
    "id": 938,
    "name": "Rowal, raw",
    "measure": "0.5 cup",
    "calcium": 17.1,
    "isCustom": false
  },
  {
    "id": 939,
    "name": "Prune puree",
    "measure": "2 tbsp",
    "calcium": 11.2,
    "isCustom": false
  },
  {
    "id": 940,
    "name": "Tamarinds, raw",
    "measure": "1 fruit (3 x 1)",
    "calcium": 1.48,
    "isCustom": false
  },
  {
    "id": 941,
    "name": "Watermelon, raw",
    "measure": "10 watermelon balls",
    "calcium": 8.54,
    "isCustom": false
  },
  {
    "id": 942,
    "name": "Sapodilla, raw",
    "measure": "1 sapodilla",
    "calcium": 35.7,
    "isCustom": false
  },
  {
    "id": 943,
    "name": "Soursop, raw",
    "measure": "1 cup, pulp",
    "calcium": 31.5,
    "isCustom": false
  },
  {
    "id": 944,
    "name": "Sapote, mamey, raw",
    "measure": "1 cup 1 pieces",
    "calcium": 31.5,
    "isCustom": false
  },
  {
    "id": 945,
    "name": "Lemon peel, raw",
    "measure": "1 tsp",
    "calcium": 2.68,
    "isCustom": false
  },
  {
    "id": 946,
    "name": "Pummelo, raw",
    "measure": "1 cup, sections",
    "calcium": 7.6,
    "isCustom": false
  },
  {
    "id": 947,
    "name": "Turtle, green, raw",
    "measure": "3 oz",
    "calcium": 100,
    "isCustom": false
  },
  {
    "id": 948,
    "name": "Lemons, raw, without peel",
    "measure": "1 wedge or slice (1/8 of one 2-1/8 dia lemon)",
    "calcium": 1.82,
    "isCustom": false
  },
  {
    "id": 949,
    "name": "Lemon juice, raw",
    "measure": "1 wedge yields",
    "calcium": 0.354,
    "isCustom": false
  },
  {
    "id": 950,
    "name": "Mayonnaise dressing, no cholesterol",
    "measure": "1 tbsp",
    "calcium": 1.05,
    "isCustom": false
  },
  {
    "id": 951,
    "name": "Breakfast bar, corn flake crust with fruit",
    "measure": "1 oz",
    "calcium": 11.6,
    "isCustom": false
  },
  {
    "id": 952,
    "name": "Tofu yogurt",
    "measure": "1 cup",
    "calcium": 309,
    "isCustom": false
  },
  {
    "id": 953,
    "name": "Yeast extract spread",
    "measure": "1 tsp",
    "calcium": 4.02,
    "isCustom": false
  },
  {
    "id": 954,
    "name": "Tomato and vegetable juice, low sodium",
    "measure": "1 fl oz",
    "calcium": 3.32,
    "isCustom": false
  },
  {
    "id": 955,
    "name": "Pork sausage rice links, brown and serve, cooked",
    "measure": "2 links 1 NLEA serving",
    "calcium": 6.75,
    "isCustom": false
  },
  {
    "id": 956,
    "name": "Vegetable oil-butter spread, reduced calorie",
    "measure": "1 tbsp",
    "calcium": 0.78,
    "isCustom": false
  },
  {
    "id": 957,
    "name": "Corned beef and potatoes in tortilla (Apache)",
    "measure": "100 g",
    "calcium": 27,
    "isCustom": false
  },
  {
    "id": 958,
    "name": "Smelt, dried (Alaska Native)",
    "measure": "100 g",
    "calcium": 1600,
    "isCustom": false
  },
  {
    "id": 959,
    "name": "Buffalo, free range, top round steak, raw (Shoshone Bannock)",
    "measure": "100 g",
    "calcium": 3,
    "isCustom": false
  },
  {
    "id": 960,
    "name": "Frybread, made with lard (Apache)",
    "measure": "100 g",
    "calcium": 52,
    "isCustom": false
  },
  {
    "id": 961,
    "name": "Tamales (Navajo)",
    "measure": "1 piece",
    "calcium": 53.9,
    "isCustom": false
  },
  {
    "id": 962,
    "name": "Mutton, cooked, roasted (Navajo)",
    "measure": "1 oz",
    "calcium": 2.84,
    "isCustom": false
  },
  {
    "id": 963,
    "name": "Melon, banana (Navajo)",
    "measure": "100 g",
    "calcium": 13,
    "isCustom": false
  },
  {
    "id": 964,
    "name": "Chilchen (Red Berry Beverage) (Navajo)",
    "measure": "100 g",
    "calcium": 7,
    "isCustom": false
  },
  {
    "id": 965,
    "name": "Mush, blue corn with ash (Navajo)",
    "measure": "100 g",
    "calcium": 96,
    "isCustom": false
  },
  {
    "id": 966,
    "name": "Owl, horned, flesh, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 16,
    "isCustom": false
  },
  {
    "id": 967,
    "name": "Sea cucumber, yane (Alaska Native)",
    "measure": "100 g",
    "calcium": 30,
    "isCustom": false
  },
  {
    "id": 968,
    "name": "Moose, meat, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 5,
    "isCustom": false
  },
  {
    "id": 969,
    "name": "Deer (venison), sitka, raw (Alaska Native)",
    "measure": "100 g",
    "calcium": 7,
    "isCustom": false
  },
  {
    "id": 970,
    "name": "Oopah (tunicate), whole animal (Alaska Native)",
    "measure": "100 g",
    "calcium": 53,
    "isCustom": false
  },
  {
    "id": 971,
    "name": "Rudi's, Gluten-Free Bakery, Original Sandwich Bread",
    "measure": "1 slice",
    "calcium": 8.16,
    "isCustom": false
  },
  {
    "id": 972,
    "name": "Andrea's, Gluten Free Soft Dinner Roll",
    "measure": "1 roll",
    "calcium": 28.3,
    "isCustom": false
  },
  {
    "id": 973,
    "name": "Sherbet, orange",
    "measure": "1 bar (2.75 fl oz)",
    "calcium": 35.6,
    "isCustom": false
  },
  {
    "id": 974,
    "name": "George Weston Bakeries, Thomas English Muffins",
    "measure": "1 serving",
    "calcium": 103,
    "isCustom": false
  },
  {
    "id": 975,
    "name": "Tostada shells, corn",
    "measure": "1 piece",
    "calcium": 9.35,
    "isCustom": false
  },
  {
    "id": 976,
    "name": "Pastry, Pastelitos de Guava (guava pastries)",
    "measure": "1 piece",
    "calcium": 12,
    "isCustom": false
  },
  {
    "id": 977,
    "name": "Rutabaga, peeled, raw",
    "measure": "100 g",
    "calcium": 42,
    "isCustom": false
  },
  {
    "id": 978,
    "name": "Green onion, (scallion), bulb and greens, root removed, raw",
    "measure": "100 g",
    "calcium": 59.4,
    "isCustom": false
  },
  {
    "id": 979,
    "name": "Pawpaw, peeled, seeded, raw",
    "measure": "100 g",
    "calcium": 9.91,
    "isCustom": false
  },
  {
    "id": 980,
    "name": "Apricot, with skin, raw",
    "measure": "100 g",
    "calcium": 11.6,
    "isCustom": false
  },
  {
    "id": 981,
    "name": "Khorasan, grain, dry, raw",
    "measure": "100 g",
    "calcium": 24.1,
    "isCustom": false
  },
  {
    "id": 982,
    "name": "Mandarin, seedless, peeled, raw",
    "measure": "100 g",
    "calcium": 44,
    "isCustom": false
  },
  {
    "id": 983,
    "name": "Plum, black, with skin, raw",
    "measure": "100 g",
    "calcium": 4.03,
    "isCustom": false
  },
  {
    "id": 984,
    "name": "Farro, pearled, dry, raw",
    "measure": "100 g",
    "calcium": 25.9,
    "isCustom": false
  },
  {
    "id": 985,
    "name": "Pear, Anjou, green, with skin, raw",
    "measure": "100 g",
    "calcium": 9.99,
    "isCustom": false
  },
  {
    "id": 986,
    "name": "Fonio, grain, dry, raw",
    "measure": "100 g",
    "calcium": 11.6,
    "isCustom": false
  },
  {
    "id": 987,
    "name": "Chia seeds, dry, raw",
    "measure": "100 g",
    "calcium": 595,
    "isCustom": false
  },
  {
    "id": 988,
    "name": "Sorghum bran, white, unenriched, dry, raw",
    "measure": "100 g",
    "calcium": 61.7,
    "isCustom": false
  },
  {
    "id": 989,
    "name": "Kiwifruit (kiwi), green, peeled, raw",
    "measure": "100 g",
    "calcium": 24.4,
    "isCustom": false
  },
  {
    "id": 990,
    "name": "Sorghum, whole grain, white, dry, raw",
    "measure": "100 g",
    "calcium": 14.9,
    "isCustom": false
  },
  {
    "id": 991,
    "name": "Einkorn, grain, dry, raw",
    "measure": "100 g",
    "calcium": 41.4,
    "isCustom": false
  },
  {
    "id": 992,
    "name": "Avocado, Hass, peeled, raw",
    "measure": "100 g",
    "calcium": 14.5,
    "isCustom": false
  },
  {
    "id": 993,
    "name": "Tomato, roma",
    "measure": "100 g",
    "calcium": 9.96,
    "isCustom": false
  },
  {
    "id": 994,
    "name": "Blackeye pea, dry",
    "measure": "100 g",
    "calcium": 71.4,
    "isCustom": false
  },
  {
    "id": 995,
    "name": "Chickpeas, (garbanzo beans, bengal gram), dry",
    "measure": "100 g",
    "calcium": 111,
    "isCustom": false
  },
  {
    "id": 996,
    "name": "Flour, 00",
    "measure": "100 g",
    "calcium": 18.7,
    "isCustom": false
  },
  {
    "id": 997,
    "name": "Oats, whole grain, steel cut",
    "measure": "100 g",
    "calcium": 51.3,
    "isCustom": false
  },
  {
    "id": 998,
    "name": "Cream cheese, full fat, block",
    "measure": "100 g",
    "calcium": 97.1,
    "isCustom": false
  },
  {
    "id": 999,
    "name": "Cottage cheese, full fat, large or small curd",
    "measure": "100 g",
    "calcium": 88.3,
    "isCustom": false
  },
  {
    "id": 1000,
    "name": "Flaxseed, ground",
    "measure": "100 g",
    "calcium": 230,
    "isCustom": false
  },
  {
    "id": 1001,
    "name": "Almond butter, creamy",
    "measure": "100 g",
    "calcium": 264,
    "isCustom": false
  },
  {
    "id": 1002,
    "name": "Sesame butter, creamy",
    "measure": "100 g",
    "calcium": 116,
    "isCustom": false
  },
  {
    "id": 1003,
    "name": "Buttermilk, low fat",
    "measure": "100 g",
    "calcium": 120,
    "isCustom": false
  },
  {
    "id": 1004,
    "name": "Soy milk, sweetened, plain, refrigerated",
    "measure": "100 g",
    "calcium": 155,
    "isCustom": false
  },
  {
    "id": 1005,
    "name": "Almond milk, unsweetened, plain, refrigerated",
    "measure": "100 g",
    "calcium": 158,
    "isCustom": false
  },
  {
    "id": 1006,
    "name": "Oat milk, unsweetened, plain, refrigerated",
    "measure": "100 g",
    "calcium": 148,
    "isCustom": false
  }
];

// Search stopwords to ignore
const SEARCH_STOPWORDS = [
  "with",
  "without",
  "and",
  "or",
  "the",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "from",
  "by",
  "added",
  "prepared",
  "cooked",
  "raw",
  "fresh",
  "frozen",
  "canned",
  "dried",
  "chopped",
  "sliced",
  "diced",
  "whole",
  "ground",
  "boiled",
  "baked",
  "fried",
  "roasted",
  "steamed",
];

// Helper function to search foods
export function searchFoods(query, customFoods = [], favorites = new Set()) {
  if (!query || query.length < 2) return [];

  const keywords = query
    .toLowerCase()
    .split(/[,\s]+/)
    .filter((word) => word.length > 1)
    .filter((word) => !SEARCH_STOPWORDS.includes(word));

  if (keywords.length === 0) return [];

  // Combine default database and custom foods
  const allFoods = [...DEFAULT_FOOD_DATABASE, ...customFoods];

  const results = allFoods
    .map((food) => {
      const searchText = food.name.toLowerCase();
      let score = 0;
      let hasMatch = false;

      keywords.forEach((keyword) => {
        if (searchText.includes(keyword)) {
          hasMatch = true;
          // Exact word match gets higher score
          if (searchText.split(/\s+/).includes(keyword)) {
            score += 10;
          } else {
            score += 5;
          }

          // Boost score if keyword appears at start
          if (searchText.startsWith(keyword)) {
            score += 15;
          }
        }
      });

      // Must match at least one keyword
      if (!hasMatch) return null;

      // Prioritize favorites first (highest priority)
      if (favorites.has(food.id)) {
        score += 10000;
      }

      // Prioritize custom foods second
      if (food.isCustom) {
        score += 5000;
      }

      // Boost score for foods with higher calcium content
      score += Math.log(food.calcium + 1) * 0.5;

      return { ...food, searchScore: score };
    })
    .filter(Boolean)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 15); // Limit results

  return results;
}

// Helper function to parse serving sizes
export function parseServingSize(measure) {
  if (!measure) return { quantity: 1, unit: "serving" };

  // Extract number from beginning of measure string
  const match = measure.match(/^([0-9]*\.?[0-9]+)/);
  const quantity = match ? parseFloat(match[1]) : 1;

  // Extract unit (everything after the number)
  const unit = measure.replace(/^[0-9]*\.?[0-9]+\s*/, "").trim() || "serving";

  return { quantity, unit };
}

// Helper function to standardize units
export function standardizeUnit(unit) {
  const unitMap = {
    cups: "cup",
    cup: "cup",
    tbsp: "tablespoon",
    tablespoons: "tablespoon",
    tsp: "teaspoon",
    teaspoons: "teaspoon",
    oz: "ounce",
    ounces: "ounce",
    lb: "pound",
    pounds: "pound",
    g: "gram",
    grams: "gram",
    mg: "milligram",
    milligrams: "milligram",
    ml: "milliliter",
    milliliters: "milliliter",
    l: "liter",
    liters: "liter",
    "fl oz": "fluid ounce",
    "fluid ounces": "fluid ounce",
    piece: "piece",
    pieces: "piece",
    slice: "slice",
    slices: "slice",
    serving: "serving",
    servings: "serving",
  };

  return unitMap[unit.toLowerCase()] || unit;
}
