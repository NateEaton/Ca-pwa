/*
 * My Calcium Tracker PWA
 * Copyright (C) 2025 Nathan A. Eaton Jr.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// Key mappings for rehydration
export const KEYS = {
  "i": "id",
  "n": "name",
  "ms": "measures",
  "c100": "calciumPer100g",
  "ds": "defaultServing",
  "si": "sourceId",
  "sn": "sourceName",
  "sub": "subset",
  "cf": "collapsedFrom"
};

// Measure object key mappings for rehydration
export const MEASURE_KEYS = {
  "s": "measure",
  "c": "calcium"
};

// Minified food database
export const DB = [
  {
    "i": 357,
    "n": "Veal, ground, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "1 oz",
        "c": 3.4
      },
      {
        "s": "4 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 362,
    "n": "Bison, ground, grass-fed, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      },
      {
        "s": "1 patty (cooked from 4 oz raw)",
        "c": 9.35
      }
    ]
  },
  {
    "i": 363,
    "n": "Veal, shoulder, arm, separable lean only, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 6.24
      },
      {
        "s": "1 steak, excluding refuse (yield from 1 raw steak, with refuse, weighing 385 g)",
        "c": 63.6
      }
    ]
  },
  {
    "i": 368,
    "n": "Veal, Shoulder, Blade, Separable Lean*",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 66.1
      },
      {
        "s": "3 oz",
        "c": 23.8
      }
    ]
  },
  {
    "i": 386,
    "n": "Lamb, New Zealand, imported, square-cut shoulder, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 serving",
        "c": 13.8
      }
    ]
  },
  {
    "i": 391,
    "n": "Lamb, New Zealand, imported, rack - partly frenched, separable lean only, cooked, fast roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 18.7
      },
      {
        "s": "1 serving",
        "c": 18.7
      }
    ]
  },
  {
    "i": 393,
    "n": "Lamb, New Zealand, imported, rack - partly frenched, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 serving",
        "c": 13.8
      }
    ]
  },
  {
    "i": 397,
    "n": "Peas, Split, Mature Seeds, Cooked, Boiled, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 27.4
      }
    ]
  },
  {
    "i": 434,
    "n": "Soymilk (all flavors), nonfat, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 282
      }
    ]
  },
  {
    "i": 435,
    "n": "Soymilk, chocolate, nonfat, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 282
      }
    ]
  },
  {
    "i": 437,
    "n": "Hyacinth beans, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 273
      }
    ]
  },
  {
    "i": 442,
    "n": "Soymilk (all flavors), unsweetened, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 301
      }
    ]
  },
  {
    "i": 443,
    "n": "Broadbeans (fava beans), mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 154
      },
      {
        "s": "1 tbsp",
        "c": 9.68
      }
    ]
  },
  {
    "i": 444,
    "n": "Cowpeas, catjang, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 142
      }
    ]
  },
  {
    "i": 451,
    "n": "Beans, white, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 485
      },
      {
        "s": "1 tbsp",
        "c": 30.2
      }
    ]
  },
  {
    "i": 456,
    "n": "Beans, kidney, all types, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 263
      }
    ]
  },
  {
    "i": 457,
    "n": "Beans, kidney, royal red, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 241
      }
    ]
  },
  {
    "i": 465,
    "n": "Beans, cranberry (roman), mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 248
      }
    ]
  },
  {
    "i": 466,
    "n": "Beans, black turtle, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 294
      }
    ]
  },
  {
    "i": 474,
    "n": "Crustaceans, shrimp, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 54.4
      }
    ]
  },
  {
    "i": 475,
    "n": "Fish, tilapia, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 12.2
      }
    ]
  },
  {
    "i": 477,
    "n": "Fish, tilapia, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 11.6
      }
    ]
  },
  {
    "i": 478,
    "n": "Mollusks, oyster, eastern, farmed, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 37.4
      },
      {
        "s": "6 medium",
        "c": 37
      }
    ]
  },
  {
    "i": 479,
    "n": "Mollusks, oyster, eastern, farmed, cooked, dry heat",
    "ms": [
      {
        "s": "6 medium",
        "c": 33
      },
      {
        "s": "3 oz",
        "c": 47.6
      }
    ]
  },
  {
    "i": 480,
    "n": "Mollusks, oyster, eastern, wild, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 78.2
      },
      {
        "s": "6 medium",
        "c": 54.3
      }
    ]
  },
  {
    "i": 481,
    "n": "Crustaceans, crayfish, mixed species, farmed, raw",
    "ms": [
      {
        "s": "8 crayfish",
        "c": 6.75
      },
      {
        "s": "3 oz",
        "c": 21.2
      }
    ]
  },
  {
    "i": 482,
    "n": "Crustaceans, crayfish, mixed species, farmed, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 43.4
      }
    ]
  },
  {
    "i": 483,
    "n": "Fish, catfish, channel, farmed, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 12.9
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 484,
    "n": "Fish, yellowtail, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 19.6
      },
      {
        "s": "0.5 fillet",
        "c": 43
      }
    ]
  },
  {
    "i": 485,
    "n": "Crustaceans, crab, alaska king, raw",
    "ms": [
      {
        "s": "1 leg",
        "c": 79.1
      },
      {
        "s": "3 oz",
        "c": 39.1
      }
    ]
  },
  {
    "i": 486,
    "n": "Fish, catfish, channel, farmed, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 12.7
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 487,
    "n": "Fish, salmon, Atlantic, farmed, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 12.8
      },
      {
        "s": "0.5 fillet",
        "c": 26.7
      }
    ]
  },
  {
    "i": 488,
    "n": "Fish, salmon, Atlantic, farmed, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 17.8
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 489,
    "n": "Fish, tuna, fresh, yellowfin, raw",
    "ms": [
      {
        "s": "1 oz, boneless",
        "c": 1.13
      },
      {
        "s": "3 oz",
        "c": 3.4
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 0.64
      }
    ]
  },
  {
    "i": 491,
    "n": "Fish, tuna salad",
    "ms": [
      {
        "s": "1 cup",
        "c": 34.8
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 492,
    "n": "Fish, whiting, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 52.7
      },
      {
        "s": "1 fillet",
        "c": 44.6
      }
    ]
  },
  {
    "i": 494,
    "n": "Fish, wolffish, Atlantic, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "0.5 fillet",
        "c": 9.18
      }
    ]
  },
  {
    "i": 495,
    "n": "Fish, sucker, white, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 111
      },
      {
        "s": "3 oz",
        "c": 59.5
      }
    ]
  },
  {
    "i": 496,
    "n": "Fish, sunfish, pumpkin seed, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 68
      },
      {
        "s": "1 fillet",
        "c": 38.4
      }
    ]
  },
  {
    "i": 497,
    "n": "Fish, tuna, fresh, skipjack, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 57.4
      },
      {
        "s": "3 oz",
        "c": 24.6
      }
    ]
  },
  {
    "i": 498,
    "n": "Fish, tilefish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 22.1
      },
      {
        "s": "0.5 fillet",
        "c": 39
      }
    ]
  },
  {
    "i": 499,
    "n": "Fish, trout, mixed species, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 34
      },
      {
        "s": "3 oz",
        "c": 36.6
      }
    ]
  },
  {
    "i": 500,
    "n": "Fish, trout, rainbow, wild, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 73.1
      },
      {
        "s": "1 fillet",
        "c": 123
      }
    ]
  },
  {
    "i": 501,
    "n": "Fish, trout, rainbow, wild, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 57
      },
      {
        "s": "1 fillet",
        "c": 107
      }
    ]
  },
  {
    "i": 502,
    "n": "Fish, smelt, rainbow, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 51
      }
    ]
  },
  {
    "i": 503,
    "n": "Fish, sturgeon, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      },
      {
        "s": "1 oz, boneless",
        "c": 4.82
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 2.89
      },
      {
        "s": "1 cup, cooked",
        "c": 23.1
      },
      {
        "s": "1 piece (4-1/2 x 2-1/8 x 7/8)",
        "c": 24.6
      }
    ]
  },
  {
    "i": 504,
    "n": "Fish, smelt, rainbow, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 65.4
      }
    ]
  },
  {
    "i": 505,
    "n": "Fish, sheepshead, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 31.4
      },
      {
        "s": "1 fillet",
        "c": 68.8
      }
    ]
  },
  {
    "i": 506,
    "n": "Fish, sturgeon, mixed species, smoked",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.82
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 507,
    "n": "Fish, sheepshead, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 17.8
      },
      {
        "s": "1 fillet",
        "c": 50
      }
    ]
  },
  {
    "i": 509,
    "n": "Fish, shark, mixed species, cooked, batter-dipped and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 42.5
      }
    ]
  },
  {
    "i": 510,
    "n": "Fish, scup, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 66.4
      },
      {
        "s": "1 oz, boneless",
        "c": 11.3
      },
      {
        "s": "1 fillet",
        "c": 25.6
      },
      {
        "s": "3 oz",
        "c": 34
      }
    ]
  },
  {
    "i": 512,
    "n": "Fish, sea bass, mixed species, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 12.9
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 513,
    "n": "Fish, salmon, pink, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 11.1
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 514,
    "n": "Fish, roe, mixed species, raw",
    "ms": [
      {
        "s": "1 can (8 oz), solids and liquid",
        "c": 49.9
      },
      {
        "s": "3 oz",
        "c": 18.7
      },
      {
        "s": "1 oz",
        "c": 6.24
      },
      {
        "s": "1 tbsp",
        "c": 3.08
      }
    ]
  },
  {
    "i": 515,
    "n": "Fish, salmon, coho, wild, cooked, moist heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 71.3
      },
      {
        "s": "3 oz",
        "c": 39.1
      }
    ]
  },
  {
    "i": 516,
    "n": "Fish, sablefish, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 67.6
      },
      {
        "s": "3 oz",
        "c": 29.8
      }
    ]
  },
  {
    "i": 517,
    "n": "Fish, roughy, orange, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 519,
    "n": "Fish, salmon, coho, wild, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 71.3
      },
      {
        "s": "3 oz",
        "c": 30.6
      }
    ]
  },
  {
    "i": 520,
    "n": "Fish, rockfish, Pacific, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 25.3
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 521,
    "n": "Fish, pollock, Alaska, raw (may contain additives to retain moisture)",
    "ms": [
      {
        "s": "3 oz",
        "c": 12.8
      },
      {
        "s": "1 fillet",
        "c": 11.6
      }
    ]
  },
  {
    "i": 522,
    "n": "Fish, pike, walleye, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 93.5
      },
      {
        "s": "1 fillet",
        "c": 175
      }
    ]
  },
  {
    "i": 523,
    "n": "Fish, pollock, Atlantic, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 116
      },
      {
        "s": "3 oz",
        "c": 51
      }
    ]
  },
  {
    "i": 524,
    "n": "Fish, mullet, striped, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 26.4
      },
      {
        "s": "1 fillet",
        "c": 28.8
      }
    ]
  },
  {
    "i": 525,
    "n": "Fish, ocean perch, Atlantic, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 28.9
      },
      {
        "s": "1 fillet",
        "c": 17
      }
    ]
  },
  {
    "i": 526,
    "n": "Fish, mackerel, king, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 61.4
      },
      {
        "s": "3 oz",
        "c": 26.4
      }
    ]
  },
  {
    "i": 527,
    "n": "Fish, ocean perch, Atlantic, raw",
    "ms": [
      {
        "s": "1 oz, boneless",
        "c": 7.94
      },
      {
        "s": "1 fillet",
        "c": 17.9
      },
      {
        "s": "3 oz",
        "c": 23.8
      }
    ]
  },
  {
    "i": 528,
    "n": "Fish, pike, northern, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 62
      },
      {
        "s": "0.5 fillet",
        "c": 113
      }
    ]
  },
  {
    "i": 529,
    "n": "Fish, mullet, striped, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 34.8
      },
      {
        "s": "1 fillet",
        "c": 48.8
      },
      {
        "s": "1 oz",
        "c": 11.6
      }
    ]
  },
  {
    "i": 530,
    "n": "Fish, herring, Atlantic, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 106
      },
      {
        "s": "3 oz",
        "c": 62.9
      }
    ]
  },
  {
    "i": 531,
    "n": "Fish, mackerel, Atlantic, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 13.2
      },
      {
        "s": "3 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 532,
    "n": "Fish, mackerel, Atlantic, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 13.4
      },
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 533,
    "n": "Fish, herring, Atlantic, pickled",
    "ms": [
      {
        "s": "1 cup",
        "c": 108
      },
      {
        "s": "1 cubic inch",
        "c": 15.4
      },
      {
        "s": "1 piece (1-3/4 x 7/8 x 1/2)",
        "c": 11.6
      },
      {
        "s": "1 oz, boneless",
        "c": 21.8
      }
    ]
  },
  {
    "i": 535,
    "n": "Fish, herring, Atlantic, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 105
      },
      {
        "s": "3 oz",
        "c": 48.4
      },
      {
        "s": "1 oz, boneless",
        "c": 16.2
      }
    ]
  },
  {
    "i": 536,
    "n": "Alcoholic beverage, wine, dessert, dry",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.36
      },
      {
        "s": "1 glass (3.5 fl oz)",
        "c": 8.24
      }
    ]
  },
  {
    "i": 538,
    "n": "Carbonated beverage, low calorie, other than cola or pepper, with sodium saccharin, without caffeine",
    "ms": [
      {
        "s": "1 can (12 fl oz)",
        "c": 14.2
      },
      {
        "s": "1 fl oz",
        "c": 1.18
      }
    ]
  },
  {
    "i": 539,
    "n": "Beverages, fruit punch-flavor drink, powder, without added sodium, prepared with water",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 5.56
      },
      {
        "s": "8 fl oz",
        "c": 44.5
      }
    ]
  },
  {
    "i": 540,
    "n": "Beverages, Propel Zero, fruit-flavored, non-carbonated",
    "ms": [
      {
        "s": "1 bottle 12 fl oz",
        "c": 3.56
      },
      {
        "s": "1 bottle 16.9 fl oz",
        "c": 5.01
      },
      {
        "s": "1 fl oz",
        "c": 0.296
      },
      {
        "s": "1 bottle 23.7 fl oz",
        "c": 7.03
      }
    ]
  },
  {
    "i": 541,
    "n": "Beverages, Cocoa mix, low calorie, powder, with added calcium, phosphorus, aspartame, without added sodium or vitamin A",
    "ms": [
      {
        "s": "1 packet (0.675 oz)",
        "c": 274
      },
      {
        "s": "1 envelope  Swiss Miss (.53 oz)",
        "c": 216
      }
    ]
  },
  {
    "i": 544,
    "n": "Beverages, carbonated, low calorie, cola or pepper-type, with aspartame, contains caffeine",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.888
      },
      {
        "s": "1 serving child 12 fl oz",
        "c": 7.74
      },
      {
        "s": "1 bottle bottle 16 fl oz",
        "c": 14.2
      },
      {
        "s": "1 serving large 32 fl oz",
        "c": 21.7
      },
      {
        "s": "1 can can 12 fl oz",
        "c": 10.6
      },
      {
        "s": "1 serving small 16 fl oz",
        "c": 10.4
      },
      {
        "s": "1 serving medium 21 fl oz",
        "c": 14.6
      }
    ]
  },
  {
    "i": 545,
    "n": "Beverages, Orange drink, breakfast type, with juice and pulp, frozen concentrate, prepared with water",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 295
      },
      {
        "s": "1 fl oz",
        "c": 36.9
      }
    ]
  },
  {
    "i": 547,
    "n": "Beverages, orange breakfast drink, ready-to-drink, with added nutrients",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 253
      },
      {
        "s": "1 fl oz",
        "c": 31.6
      }
    ]
  },
  {
    "i": 549,
    "n": "Beverages, water, tap, municipal",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.888
      },
      {
        "s": "1 liter",
        "c": 30
      },
      {
        "s": "3 ice cube (3/4 fl oz)",
        "c": 1.92
      },
      {
        "s": "1 bottle 8 fl oz",
        "c": 7.11
      }
    ]
  },
  {
    "i": 551,
    "n": "Beverages, Orange drink, breakfast type, with juice and pulp, frozen concentrate",
    "ms": [
      {
        "s": "1 can",
        "c": 1740
      },
      {
        "s": "1 fl oz",
        "c": 145
      }
    ]
  },
  {
    "i": 553,
    "n": "Beverages, carbonated, cola, fast-food cola",
    "ms": [
      {
        "s": "1 serving child 12 fl oz, without ice",
        "c": 5.16
      },
      {
        "s": "1 serving medium 21 fl oz,  without ice",
        "c": 9.72
      },
      {
        "s": "1 serving large 32 fl oz,  without ice",
        "c": 14.4
      },
      {
        "s": "1 serving small 16 fl oz, without ice",
        "c": 6.94
      }
    ]
  },
  {
    "i": 554,
    "n": "Beverages, tea, instant, sweetened with sodium saccharin, lemon-flavored, powder",
    "ms": [
      {
        "s": "4 tbsp (1/4 cup)",
        "c": 3.02
      },
      {
        "s": "2 tsp",
        "c": 0.336
      }
    ]
  },
  {
    "i": 555,
    "n": "Beverages, fruit punch juice drink, frozen concentrate",
    "ms": [
      {
        "s": "1 can (12 fl oz)",
        "c": 84.6
      },
      {
        "s": "1 fl oz",
        "c": 7.04
      }
    ]
  },
  {
    "i": 556,
    "n": "Alcoholic beverage, liqueur, coffee with cream, 34 proof",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 4.98
      },
      {
        "s": "1.5 fl oz",
        "c": 7.52
      }
    ]
  },
  {
    "i": 558,
    "n": "Alcoholic Beverage, Liqueur, Coffee*",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.348
      },
      {
        "s": "1 serving 1.5 fl oz",
        "c": 0.52
      }
    ]
  },
  {
    "i": 559,
    "n": "Beverages, fruit punch juice drink, frozen concentrate, prepared with water",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 16.4
      },
      {
        "s": "1 fl oz",
        "c": 2.05
      }
    ]
  },
  {
    "i": 560,
    "n": "Beverages, water, tap, well",
    "ms": [
      {
        "s": "1 liter",
        "c": 30
      },
      {
        "s": "1 fl oz",
        "c": 0.888
      },
      {
        "s": "1 serving 8 fl oz 8 fl oz",
        "c": 7.11
      }
    ]
  },
  {
    "i": 562,
    "n": "Beverages, tea, instant, lemon, sweetened, powder",
    "ms": [
      {
        "s": "1 cup",
        "c": 3.64
      },
      {
        "s": "1 serving (3 heaping tsp)",
        "c": 0.46
      }
    ]
  },
  {
    "i": 568,
    "n": "Beverages, tea, instant, lemon, unsweetened",
    "ms": [
      {
        "s": "2 tbsp, rounded",
        "c": 3.16
      },
      {
        "s": "1 tsp, rounded",
        "c": 0.392
      }
    ]
  },
  {
    "i": 574,
    "n": "Tart, breakfast, low fat",
    "ms": [
      {
        "s": "1 tart",
        "c": 22.9
      }
    ]
  },
  {
    "i": 575,
    "n": "Taco shells, baked, without added salt",
    "ms": [
      {
        "s": "1 medium (approx 5 dia)",
        "c": 20.8
      },
      {
        "s": "1 miniature (3 dia)",
        "c": 8
      },
      {
        "s": "1 oz",
        "c": 45.4
      }
    ]
  },
  {
    "i": 576,
    "n": "Crackers, saltines, fat-free, low-sodium",
    "ms": [
      {
        "s": "6 saltines",
        "c": 6.6
      },
      {
        "s": "3 saltines",
        "c": 3.3
      }
    ]
  },
  {
    "i": 584,
    "n": "Pie, fried pies, lemon",
    "ms": [
      {
        "s": "1 pie (5 x 3-3/4)",
        "c": 28.2
      },
      {
        "s": "1 oz",
        "c": 6.24
      }
    ]
  },
  {
    "i": 587,
    "n": "Doughnuts, yeast-leavened, glazed, unenriched (includes honey buns)",
    "ms": [
      {
        "s": "1 doughnut, medium (3-1/4 dia)",
        "c": 25.8
      },
      {
        "s": "1 oz",
        "c": 12.2
      }
    ]
  },
  {
    "i": 588,
    "n": "Danish pastry, raspberry, unenriched",
    "ms": [
      {
        "s": "1 oz",
        "c": 13
      },
      {
        "s": "1 pastry (4-1/4 dia)",
        "c": 32.7
      }
    ]
  },
  {
    "i": 589,
    "n": "Popovers, Dry Mix*",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.07
      },
      {
        "s": "1 package (6 oz)",
        "c": 54.4
      }
    ]
  },
  {
    "i": 590,
    "n": "Crackers, cheese, low sodium",
    "ms": [
      {
        "s": "1 cracker (1 square)",
        "c": 1.51
      },
      {
        "s": "1 cup, crushed",
        "c": 109
      },
      {
        "s": "1 gold fish",
        "c": 0.906
      },
      {
        "s": "0.5 oz",
        "c": 21.4
      },
      {
        "s": "1 cup Cheez-its",
        "c": 93.6
      }
    ]
  },
  {
    "i": 591,
    "n": "Cake, yellow, unenriched, dry mix",
    "ms": [
      {
        "s": "1 package (18.50 oz)",
        "c": 707
      },
      {
        "s": "1 oz",
        "c": 38.3
      }
    ]
  },
  {
    "i": 592,
    "n": "Crackers, saltines, unsalted tops (includes oyster, soda, soup)",
    "ms": [
      {
        "s": "1 cracker",
        "c": 3.57
      },
      {
        "s": "0.5 oz",
        "c": 16.9
      }
    ]
  },
  {
    "i": 593,
    "n": "Crackers, wheat, low salt",
    "ms": [
      {
        "s": "1 cracker",
        "c": 0.98
      },
      {
        "s": "1 cracker, thin square",
        "c": 0.98
      },
      {
        "s": "0.5 oz",
        "c": 6.96
      },
      {
        "s": "1 cup, crushed",
        "c": 40.7
      }
    ]
  },
  {
    "i": 594,
    "n": "Crackers, saltines, low salt (includes oyster, soda, soup)",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 16.9
      },
      {
        "s": "1 cracker, oyster",
        "c": 1.19
      },
      {
        "s": "1 cup oyster crackers",
        "c": 53.6
      },
      {
        "s": "1 cracker, rectangle",
        "c": 7.14
      },
      {
        "s": "1 cracker, round large",
        "c": 11.9
      },
      {
        "s": "1 cracker",
        "c": 3.57
      }
    ]
  },
  {
    "i": 596,
    "n": "Cake, Pudding-Type, White*",
    "ms": [
      {
        "s": "1 package (18.50 oz)",
        "c": 403
      },
      {
        "s": "1 oz",
        "c": 21.8
      }
    ]
  },
  {
    "i": 597,
    "n": "Bagels, plain, unenriched, with calcium propionate (includes onion, poppy, sesame)",
    "ms": [
      {
        "s": "1 oz",
        "c": 21
      },
      {
        "s": "1 large bagel (4-1/2 dia)",
        "c": 96.9
      },
      {
        "s": "1 medium bagel (3-1/2 to 4)",
        "c": 77.7
      },
      {
        "s": "1 small bagel (3 dia)",
        "c": 51.1
      },
      {
        "s": "1 mini bagel (2-1/2 dia)",
        "c": 19.2
      }
    ]
  },
  {
    "i": 598,
    "n": "Cake, Pound, Commercially Prepared, Other Than All Butter*",
    "ms": [
      {
        "s": "1 piece (1/12 of 12 oz cake)",
        "c": 17.9
      },
      {
        "s": "1 snack cake (2.5 oz)",
        "c": 45.4
      },
      {
        "s": "1 piece (1/10 of 10.6 oz cake)",
        "c": 19.2
      }
    ]
  },
  {
    "i": 602,
    "n": "Bagels, Plain*",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.1
      },
      {
        "s": "1 small bagel (3 dia)",
        "c": 12.4
      },
      {
        "s": "1 mini bagel (2-1/2 dia)",
        "c": 4.68
      },
      {
        "s": "1 large bagel (4-1/2 dia)",
        "c": 23.6
      },
      {
        "s": "1 medium bagel (3-1/2 to 4 dia)",
        "c": 18.9
      }
    ]
  },
  {
    "i": 604,
    "n": "Leavening agents, yeast, baker's, active dry",
    "ms": [
      {
        "s": "1 packet",
        "c": 2.16
      },
      {
        "s": "1 tsp",
        "c": 1.2
      },
      {
        "s": "1 tbsp",
        "c": 3.6
      }
    ]
  },
  {
    "i": 605,
    "n": "Muffins, blueberry, toaster-type, toasted",
    "ms": [
      {
        "s": "1 muffin, toaster",
        "c": 4.34
      },
      {
        "s": "1 oz",
        "c": 3.97
      }
    ]
  },
  {
    "i": 606,
    "n": "Leavening agents, yeast, baker's, compressed",
    "ms": [
      {
        "s": "1 cake (0.6 oz)",
        "c": 3.23
      }
    ]
  },
  {
    "i": 607,
    "n": "Bread, rice bran, toasted",
    "ms": [
      {
        "s": "1 slice",
        "c": 18.8
      },
      {
        "s": "1 oz",
        "c": 21.3
      }
    ]
  },
  {
    "i": 608,
    "n": "Muffins, wheat bran, toaster-type with raisins, toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 11.1
      },
      {
        "s": "1 muffin, toaster",
        "c": 13.3
      }
    ]
  },
  {
    "i": 609,
    "n": "Leavening agents, cream of tartar",
    "ms": [
      {
        "s": "0.5 tsp",
        "c": 0.12
      },
      {
        "s": "1 tsp",
        "c": 0.24
      }
    ]
  },
  {
    "i": 610,
    "n": "Tortillas, ready-to-bake or -fry, flour, refrigerated",
    "ms": [
      {
        "s": "1 tortilla (approx 10 dia)",
        "c": 105
      },
      {
        "s": "1 tortilla (approx 7-8 dia)",
        "c": 71.5
      },
      {
        "s": "1 tortilla medium (approx 6 dia)",
        "c": 43.8
      },
      {
        "s": "1 oz",
        "c": 41.4
      },
      {
        "s": "1 tortilla",
        "c": 70.1
      },
      {
        "s": "1 package",
        "c": 594
      },
      {
        "s": "1 tortilla (approx 12 dia)",
        "c": 171
      }
    ]
  },
  {
    "i": 613,
    "n": "Leavening agents, baking soda",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "0.5 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 614,
    "n": "Tortillas, ready-to-bake or -fry, corn",
    "ms": [
      {
        "s": "1 tortilla",
        "c": 19.4
      },
      {
        "s": "1 oz",
        "c": 23
      },
      {
        "s": "1 enchilada",
        "c": 15.4
      }
    ]
  },
  {
    "i": 616,
    "n": "Rolls, dinner, wheat",
    "ms": [
      {
        "s": "1 roll (1 oz)",
        "c": 49.3
      }
    ]
  },
  {
    "i": 617,
    "n": "Rolls, hard (includes kaiser)",
    "ms": [
      {
        "s": "1 oz",
        "c": 26.9
      },
      {
        "s": "1 roll (3-1/2 dia)",
        "c": 54.2
      }
    ]
  },
  {
    "i": 618,
    "n": "Sweet rolls, cheese",
    "ms": [
      {
        "s": "1 oz",
        "c": 33.5
      },
      {
        "s": "1 roll",
        "c": 77.9
      }
    ]
  },
  {
    "i": 619,
    "n": "Strudel, apple",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.25
      },
      {
        "s": "1 piece",
        "c": 10.6
      }
    ]
  },
  {
    "i": 620,
    "n": "Toaster pastries, fruit (includes apple, blueberry, cherry, strawberry)",
    "ms": [
      {
        "s": "1 pastry",
        "c": 8.64
      },
      {
        "s": "1 oz",
        "c": 4.54
      }
    ]
  },
  {
    "i": 622,
    "n": "Rolls, dinner, oat bran",
    "ms": [
      {
        "s": "1 roll",
        "c": 28
      },
      {
        "s": "1 oz",
        "c": 24.1
      }
    ]
  },
  {
    "i": 624,
    "n": "Rolls, dinner, rye",
    "ms": [
      {
        "s": "1 medium",
        "c": 10.8
      },
      {
        "s": "1 large (approx 3-1/2 to 4 dia)",
        "c": 12.9
      },
      {
        "s": "1 small (2-3/8 dia)",
        "c": 8.4
      }
    ]
  },
  {
    "i": 625,
    "n": "Rolls, dinner, egg",
    "ms": [
      {
        "s": "1 oz",
        "c": 16.7
      },
      {
        "s": "1 roll (2-1/2 dia)",
        "c": 20.6
      }
    ]
  },
  {
    "i": 628,
    "n": "Pie crust, standard-type, dry mix",
    "ms": [
      {
        "s": "1 oz",
        "c": 17.3
      },
      {
        "s": "1 package (10 oz)",
        "c": 173
      }
    ]
  },
  {
    "i": 629,
    "n": "Pie, peach",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "1 piece (1/6 of 8 pie)",
        "c": 9.36
      }
    ]
  },
  {
    "i": 644,
    "n": "Ice cream cones, sugar, rolled-type",
    "ms": [
      {
        "s": "1 cone",
        "c": 4.4
      },
      {
        "s": "1 oz",
        "c": 12.5
      }
    ]
  },
  {
    "i": 645,
    "n": "Ice cream cones, cake or wafer-type",
    "ms": [
      {
        "s": "1 cone",
        "c": 1
      },
      {
        "s": "1 large waffle cone",
        "c": 7.25
      },
      {
        "s": "1 oz",
        "c": 7.09
      }
    ]
  },
  {
    "i": 646,
    "n": "Muffins, corn, toaster-type",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.39
      },
      {
        "s": "1 muffin, toaster",
        "c": 6.27
      }
    ]
  },
  {
    "i": 648,
    "n": "Muffins, corn, prepared from recipe, made with low fat (2%) milk",
    "ms": [
      {
        "s": "1 muffin (2-3/4 dia x 2)",
        "c": 148
      },
      {
        "s": "1 oz",
        "c": 73.4
      }
    ]
  },
  {
    "i": 651,
    "n": "Muffins, English, plain, toasted, enriched, with calcium propionate (includes sourdough)",
    "ms": [
      {
        "s": "1 oz",
        "c": 55.8
      },
      {
        "s": "1 muffin",
        "c": 102
      }
    ]
  },
  {
    "i": 652,
    "n": "French toast, prepared from recipe, made with low fat (2%) milk",
    "ms": [
      {
        "s": "1 slice",
        "c": 65
      },
      {
        "s": "1 oz",
        "c": 28.4
      }
    ]
  },
  {
    "i": 653,
    "n": "Muffins, English, raisin-cinnamon (includes apple-cinnamon)",
    "ms": [
      {
        "s": "1 muffin",
        "c": 65
      },
      {
        "s": "1 oz",
        "c": 32.3
      }
    ]
  },
  {
    "i": 655,
    "n": "Muffins, English, mixed-grain (includes granola)",
    "ms": [
      {
        "s": "1 muffin",
        "c": 129
      },
      {
        "s": "1 oz",
        "c": 55.6
      }
    ]
  },
  {
    "i": 656,
    "n": "Doughnuts, cake-type, plain (includes unsugared, old-fashioned)",
    "ms": [
      {
        "s": "1 doughnut, large (4 dia)",
        "c": 28.4
      },
      {
        "s": "1 donut",
        "c": 16
      },
      {
        "s": "1 oz",
        "c": 11.3
      },
      {
        "s": "1 doughnut medium (3-1/4 dia)",
        "c": 21.6
      },
      {
        "s": "1 doughnut, long type (twist) (4-1/2 long)",
        "c": 20.8
      },
      {
        "s": "1 doughnut stick",
        "c": 20.8
      },
      {
        "s": "1 doughnut, mini (1-1/2 dia) or doughnut hole",
        "c": 5.6
      }
    ]
  },
  {
    "i": 657,
    "n": "Doughnuts, cake-type, chocolate, sugared or glazed",
    "ms": [
      {
        "s": "1 doughnut (3-3/4 dia)",
        "c": 128
      },
      {
        "s": "1 oz",
        "c": 60.4
      },
      {
        "s": "1 doughnut, medium (approx 3 dia)",
        "c": 89.5
      }
    ]
  },
  {
    "i": 658,
    "n": "Muffins, English, plain, enriched, with ca prop (includes sourdough)",
    "ms": [
      {
        "s": "1 muffin",
        "c": 92.9
      },
      {
        "s": "1 oz",
        "c": 46.2
      }
    ]
  },
  {
    "i": 659,
    "n": "Doughnuts, cake-type, plain, chocolate-coated or frosted",
    "ms": [
      {
        "s": "1 doughnut, medium (approx 3 dia)",
        "c": 10.3
      },
      {
        "s": "1 donettes (2 dia)",
        "c": 4.32
      },
      {
        "s": "1 doughnut large (approx 3-1/2 dia)",
        "c": 16.1
      },
      {
        "s": "1 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 660,
    "n": "Doughnuts, cake-type, plain, sugared or glazed",
    "ms": [
      {
        "s": "1 doughnut, medium (approx 3 dia)",
        "c": 27
      },
      {
        "s": "1 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 662,
    "n": "Croissants, apple",
    "ms": [
      {
        "s": "1 oz",
        "c": 8.5
      },
      {
        "s": "1 croissant, medium",
        "c": 17.1
      }
    ]
  },
  {
    "i": 663,
    "n": "Crackers, wheat, regular",
    "ms": [
      {
        "s": "16 crackers 1 serving",
        "c": 31.3
      },
      {
        "s": "2 crackers 1 serving",
        "c": 13.3
      }
    ]
  },
  {
    "i": 664,
    "n": "Croissants, butter",
    "ms": [
      {
        "s": "1 croissant, small",
        "c": 15.5
      },
      {
        "s": "1 oz",
        "c": 10.5
      },
      {
        "s": "1 croissant, large",
        "c": 24.8
      },
      {
        "s": "1 croissant, medium",
        "c": 21.1
      },
      {
        "s": "1 croissant, mini",
        "c": 10.4
      }
    ]
  },
  {
    "i": 665,
    "n": "Croissants, cheese",
    "ms": [
      {
        "s": "1 croissant, medium",
        "c": 30.2
      },
      {
        "s": "1 croissant, small",
        "c": 22.3
      },
      {
        "s": "1 croissant, large",
        "c": 35.5
      },
      {
        "s": "1 oz",
        "c": 15
      }
    ]
  },
  {
    "i": 666,
    "n": "Crackers, rusk toast",
    "ms": [
      {
        "s": "1 rusk",
        "c": 2.7
      },
      {
        "s": "0.5 oz",
        "c": 3.83
      }
    ]
  },
  {
    "i": 668,
    "n": "Crackers, milk",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 24.4
      },
      {
        "s": "1 cracker",
        "c": 18.9
      }
    ]
  },
  {
    "i": 669,
    "n": "Crackers, standard snack-type, sandwich, with peanut butter filling",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 11.5
      },
      {
        "s": "1 cracker, sandwich",
        "c": 5.67
      }
    ]
  },
  {
    "i": 670,
    "n": "Crackers, standard snack-type, sandwich, with cheese filling",
    "ms": [
      {
        "s": "1 cracker, sandwich",
        "c": 18
      },
      {
        "s": "0.5 oz",
        "c": 36.5
      }
    ]
  },
  {
    "i": 672,
    "n": "Crackers, cheese, sandwich-type with peanut butter filling",
    "ms": [
      {
        "s": "1 sandwich",
        "c": 3.25
      },
      {
        "s": "1 cup, crushed",
        "c": 41.5
      },
      {
        "s": "0.5 oz",
        "c": 7.1
      },
      {
        "s": "6 cracker",
        "c": 19.5
      }
    ]
  },
  {
    "i": 673,
    "n": "Crackers, cheese, regular",
    "ms": [
      {
        "s": "1 bag, single serving",
        "c": 38.1
      },
      {
        "s": "1 gold fish",
        "c": 0.816
      },
      {
        "s": "0.5 oz",
        "c": 19.3
      },
      {
        "s": "1 cup, crushed",
        "c": 97.9
      },
      {
        "s": "1 snack stick",
        "c": 2.72
      },
      {
        "s": "1 cracker (1 square)",
        "c": 1.36
      },
      {
        "s": "1 cup, bite size",
        "c": 84.3
      }
    ]
  },
  {
    "i": 674,
    "n": "Crackers, melba toast, rye (includes pumpernickel)",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 11.1
      },
      {
        "s": "1 toast",
        "c": 3.9
      }
    ]
  },
  {
    "i": 675,
    "n": "Cookies, vanilla wafers, higher fat",
    "ms": [
      {
        "s": "8 wafers",
        "c": 10.8
      },
      {
        "s": "8 wafers mini wafers",
        "c": 4.18
      }
    ]
  },
  {
    "i": 676,
    "n": "Crackers, melba toast, wheat",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 6.11
      },
      {
        "s": "1 toast",
        "c": 2.15
      }
    ]
  },
  {
    "i": 678,
    "n": "Cookies, vanilla wafers, lower fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 13.6
      },
      {
        "s": "1 large",
        "c": 2.88
      },
      {
        "s": "1 cup, crumbs",
        "c": 38.4
      },
      {
        "s": "1 small",
        "c": 1.44
      },
      {
        "s": "1 medium",
        "c": 1.92
      }
    ]
  },
  {
    "i": 679,
    "n": "Cookies, sugar, refrigerated dough",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "1 cookie 1 pre-sliced cookie dough",
        "c": 2.08
      },
      {
        "s": "1 serving",
        "c": 2.64
      },
      {
        "s": "1 cookie dough for 1rolled cookie",
        "c": 1.36
      }
    ]
  },
  {
    "i": 680,
    "n": "Cookies, sugar wafer, with creme filling, sugar free",
    "ms": [
      {
        "s": "1 oz",
        "c": 0
      },
      {
        "s": "1 wafer",
        "c": 0
      }
    ]
  },
  {
    "i": 681,
    "n": "Cookies, peanut butter sandwich, special dietary",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      },
      {
        "s": "1 cookie",
        "c": 4.3
      }
    ]
  },
  {
    "i": 682,
    "n": "Cookies, peanut butter sandwich, regular",
    "ms": [
      {
        "s": "1 oz",
        "c": 15
      },
      {
        "s": "1 cookie",
        "c": 7.42
      }
    ]
  },
  {
    "i": 683,
    "n": "Cookies, peanut butter, prepared from recipe",
    "ms": [
      {
        "s": "1 cookie (3 dia)",
        "c": 7.8
      },
      {
        "s": "1 oz",
        "c": 11.1
      }
    ]
  },
  {
    "i": 685,
    "n": "Cookies, raisin, soft-type",
    "ms": [
      {
        "s": "1 cookie",
        "c": 6.9
      },
      {
        "s": "1 oz",
        "c": 13
      }
    ]
  },
  {
    "i": 687,
    "n": "Cookies, oatmeal, with raisins",
    "ms": [
      {
        "s": "1 cookie",
        "c": 6.72
      },
      {
        "s": "1 oz",
        "c": 7.94
      }
    ]
  },
  {
    "i": 688,
    "n": "Cookies, graham crackers, chocolate-coated",
    "ms": [
      {
        "s": "3 pieces",
        "c": 12.4
      },
      {
        "s": "1 oz",
        "c": 13
      }
    ]
  },
  {
    "i": 689,
    "n": "Cookies, oatmeal, refrigerated dough",
    "ms": [
      {
        "s": "1 portion, dough for 1 cookie",
        "c": 4.96
      },
      {
        "s": "1 oz",
        "c": 8.79
      }
    ]
  },
  {
    "i": 691,
    "n": "Cookies, ladyfingers, with lemon juice and rind",
    "ms": [
      {
        "s": "1 breakfast treat (approx 4 x 2 x 7/8)",
        "c": 11.3
      },
      {
        "s": "1 oz",
        "c": 13.3
      },
      {
        "s": "1 anisette sponge (4 x 1-1/8 x 7/8)",
        "c": 6.11
      },
      {
        "s": "1 ladyfinger",
        "c": 5.17
      }
    ]
  },
  {
    "i": 692,
    "n": "Cookies, oatmeal, dry mix",
    "ms": [
      {
        "s": "1 package (17.5 oz)",
        "c": 124
      },
      {
        "s": "1 oz",
        "c": 7.09
      }
    ]
  },
  {
    "i": 693,
    "n": "Cookies, fudge, cake-type (includes trolley cakes)",
    "ms": [
      {
        "s": "1 cookie",
        "c": 7.14
      },
      {
        "s": "1 oz",
        "c": 9.64
      }
    ]
  },
  {
    "i": 694,
    "n": "Cookies, graham crackers, plain or honey (includes cinnamon)",
    "ms": [
      {
        "s": "1 large rectangular piece or 2 squares or 4 small rectangular pieces",
        "c": 10.8
      },
      {
        "s": "1 oz",
        "c": 21.8
      },
      {
        "s": "1 cracker",
        "c": 11.6
      },
      {
        "s": "1 cup, crushed",
        "c": 64.7
      }
    ]
  },
  {
    "i": 696,
    "n": "Cookies, gingersnaps",
    "ms": [
      {
        "s": "1 oz",
        "c": 21.8
      },
      {
        "s": "1 cookie",
        "c": 5.39
      },
      {
        "s": "1 large (approx 3-1/2 to 4 dia)",
        "c": 24.6
      }
    ]
  },
  {
    "i": 697,
    "n": "Cookies, chocolate chip, refrigerated dough",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.97
      },
      {
        "s": "1 portion, dough spoon from roll",
        "c": 4.06
      },
      {
        "s": "1 serving",
        "c": 4.62
      }
    ]
  },
  {
    "i": 699,
    "n": "Cookies, chocolate chip, dry mix",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      },
      {
        "s": "1 package (17.5 oz)",
        "c": 213
      }
    ]
  },
  {
    "i": 701,
    "n": "Cookies, brownies, dry mix, regular",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.39
      },
      {
        "s": "1 package (21.5 oz)",
        "c": 116
      }
    ]
  },
  {
    "i": 703,
    "n": "Cake, pudding-type, yellow, dry mix",
    "ms": [
      {
        "s": "1 package (18.50 oz)",
        "c": 603
      },
      {
        "s": "1 oz",
        "c": 32.6
      }
    ]
  },
  {
    "i": 711,
    "n": "Cake, coffeecake, fruit",
    "ms": [
      {
        "s": "1 piece (1/8 cake)",
        "c": 22.5
      },
      {
        "s": "1 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 712,
    "n": "Cake, pudding-type, chocolate, dry mix",
    "ms": [
      {
        "s": "1 package (18.25 oz)",
        "c": 688
      },
      {
        "s": "1 oz",
        "c": 37.7
      }
    ]
  },
  {
    "i": 713,
    "n": "Cake, coffeecake, creme-filled with chocolate frosting",
    "ms": [
      {
        "s": "1 piece (1/6 of 19 oz cake)",
        "c": 34.2
      },
      {
        "s": "1 oz",
        "c": 10.8
      }
    ]
  },
  {
    "i": 717,
    "n": "Cake, pudding-type, carrot, dry mix",
    "ms": [
      {
        "s": "1 package (18 oz)",
        "c": 877
      },
      {
        "s": "1 oz",
        "c": 48.8
      }
    ]
  },
  {
    "i": 718,
    "n": "Bread, stuffing, dry mix, prepared",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 30
      },
      {
        "s": "1 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 719,
    "n": "Bread, sticks, plain",
    "ms": [
      {
        "s": "1 cup, small pieces",
        "c": 10.1
      },
      {
        "s": "1 stick (7-5/8 x 5/8)",
        "c": 2.2
      },
      {
        "s": "1 stick (9-1/4 x 3/8)",
        "c": 1.32
      },
      {
        "s": "1 stick, small (approx 4-1/4 long)",
        "c": 1.1
      }
    ]
  },
  {
    "i": 720,
    "n": "Cake, cherry fudge with chocolate frosting",
    "ms": [
      {
        "s": "1 piece (1/8 cake)",
        "c": 34.1
      },
      {
        "s": "1 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 722,
    "n": "Bread, white, commercially prepared, toasted",
    "ms": [
      {
        "s": "1 slice thin, crust not eaten",
        "c": 9.52
      },
      {
        "s": "1 slice, very thin",
        "c": 15.5
      },
      {
        "s": "1 cup, crumbs",
        "c": 53.6
      },
      {
        "s": "1 slice",
        "c": 26.2
      },
      {
        "s": "1 slice, large",
        "c": 32.1
      },
      {
        "s": "1 oz",
        "c": 33.7
      },
      {
        "s": "1 cup, cubes",
        "c": 50
      },
      {
        "s": "1 slice crust not eaten",
        "c": 13.1
      },
      {
        "s": "1 slice, thin",
        "c": 20.2
      }
    ]
  },
  {
    "i": 723,
    "n": "Bread, white, prepared from recipe, made with low fat (2%) milk",
    "ms": [
      {
        "s": "1 slice, thin (3-3/4 x 5 x 3/8)",
        "c": 18.8
      },
      {
        "s": "1 oz",
        "c": 16.2
      },
      {
        "s": "1 slice",
        "c": 23.9
      }
    ]
  },
  {
    "i": 724,
    "n": "Bread, crumbs, dry, grated, plain",
    "ms": [
      {
        "s": "1 oz",
        "c": 51.9
      },
      {
        "s": "1 cup",
        "c": 198
      }
    ]
  },
  {
    "i": 725,
    "n": "Bread, rice bran",
    "ms": [
      {
        "s": "1 oz",
        "c": 19.6
      },
      {
        "s": "1 slice",
        "c": 18.6
      }
    ]
  },
  {
    "i": 726,
    "n": "Bread, white, commercially prepared (includes soft bread crumbs)",
    "ms": [
      {
        "s": "1 oz",
        "c": 40.8
      },
      {
        "s": "1 slice thin, crust not eaten",
        "c": 13
      },
      {
        "s": "1 slice, large",
        "c": 43.2
      },
      {
        "s": "1 slice",
        "c": 36
      },
      {
        "s": "1 slice, very thin",
        "c": 21.6
      },
      {
        "s": "1 slice, thin",
        "c": 28.8
      },
      {
        "s": "1 cup, crumbs",
        "c": 64.8
      },
      {
        "s": "1 cup, cubes",
        "c": 50.4
      },
      {
        "s": "1 slice crust not eaten",
        "c": 17.3
      },
      {
        "s": "1 slice",
        "c": 41.8
      }
    ]
  },
  {
    "i": 727,
    "n": "Bread, white, prepared from recipe, made with nonfat dry milk",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.07
      },
      {
        "s": "1 slice",
        "c": 14.1
      }
    ]
  },
  {
    "i": 728,
    "n": "Bread, reduced-calorie, wheat",
    "ms": [
      {
        "s": "1 slice",
        "c": 34.2
      },
      {
        "s": "1 oz",
        "c": 46.2
      }
    ]
  },
  {
    "i": 729,
    "n": "Bread, protein (includes gluten)",
    "ms": [
      {
        "s": "1 slice",
        "c": 23.6
      },
      {
        "s": "1 oz",
        "c": 35.2
      }
    ]
  },
  {
    "i": 730,
    "n": "Bread, reduced-calorie, rye",
    "ms": [
      {
        "s": "1 slice",
        "c": 17.5
      },
      {
        "s": "1 slice, thick",
        "c": 24.3
      },
      {
        "s": "1 oz",
        "c": 21.5
      },
      {
        "s": "1 slice, thin",
        "c": 15.2
      }
    ]
  },
  {
    "i": 731,
    "n": "Bread, reduced-calorie, white",
    "ms": [
      {
        "s": "1 slice",
        "c": 21.6
      },
      {
        "s": "1 oz",
        "c": 26.6
      }
    ]
  },
  {
    "i": 732,
    "n": "Bread, reduced-calorie, oatmeal",
    "ms": [
      {
        "s": "1 oz",
        "c": 32.6
      },
      {
        "s": "1 slice",
        "c": 26.4
      }
    ]
  },
  {
    "i": 733,
    "n": "Bread, pumpernickel",
    "ms": [
      {
        "s": "1 slice (5 x 4 x 3/8)",
        "c": 21.8
      },
      {
        "s": "1 slice, thin",
        "c": 13.6
      },
      {
        "s": "1 oz",
        "c": 19.3
      },
      {
        "s": "1 slice, regular",
        "c": 17.7
      },
      {
        "s": "1 slice, snack-size",
        "c": 4.76
      }
    ]
  },
  {
    "i": 734,
    "n": "Bread, irish soda, prepared from recipe",
    "ms": [
      {
        "s": "1 oz",
        "c": 23
      }
    ]
  },
  {
    "i": 735,
    "n": "Bread, pita, whole-wheat",
    "ms": [
      {
        "s": "1 pita, small  (4 dia)",
        "c": 4.2
      },
      {
        "s": "1 pita, large (6-1/2 dia)",
        "c": 9.6
      }
    ]
  },
  {
    "i": 737,
    "n": "Bread, Italian",
    "ms": [
      {
        "s": "1 slice",
        "c": 30.4
      },
      {
        "s": "1 oz",
        "c": 29.8
      }
    ]
  },
  {
    "i": 738,
    "n": "Bread, multi-grain, toasted (includes whole-grain)",
    "ms": [
      {
        "s": "1 slice large",
        "c": 42.2
      },
      {
        "s": "1 slice regular",
        "c": 26.6
      },
      {
        "s": "1 oz",
        "c": 31.5
      }
    ]
  },
  {
    "i": 739,
    "n": "Bread, cornbread, prepared from recipe, made with low fat (2%) milk",
    "ms": [
      {
        "s": "1 piece",
        "c": 162
      },
      {
        "s": "1 oz",
        "c": 70.6
      }
    ]
  },
  {
    "i": 740,
    "n": "Bread, french or vienna, toasted (includes sourdough)",
    "ms": [
      {
        "s": "1 slice, large",
        "c": 41.4
      },
      {
        "s": "1 slice, medium",
        "c": 27.7
      },
      {
        "s": "1 oz",
        "c": 13.3
      },
      {
        "s": "1 slice, small",
        "c": 13.6
      }
    ]
  },
  {
    "i": 741,
    "n": "Bread, Cornbread, Dry Mix*",
    "ms": [
      {
        "s": "1 oz",
        "c": 16.2
      },
      {
        "s": "1 package (8.5 oz)",
        "c": 137
      }
    ]
  },
  {
    "i": 742,
    "n": "Bread, boston brown, canned",
    "ms": [
      {
        "s": "1 slice",
        "c": 31.5
      },
      {
        "s": "1 oz",
        "c": 19.8
      }
    ]
  },
  {
    "i": 743,
    "n": "Bread, cornbread, dry mix, prepared with 2% milk, 80% margarine, and eggs",
    "ms": [
      {
        "s": "1 muffin",
        "c": 68.8
      },
      {
        "s": "1 oz",
        "c": 38.3
      },
      {
        "s": "1 piece",
        "c": 81
      }
    ]
  },
  {
    "i": 744,
    "n": "Biscuits, plain or buttermilk, refrigerated dough, lower fat, baked",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.39
      },
      {
        "s": "1 biscuit (2-1/4 dia)",
        "c": 3.99
      }
    ]
  },
  {
    "i": 745,
    "n": "Bread, banana, prepared from recipe, made with margarine",
    "ms": [
      {
        "s": "1 slice",
        "c": 12.6
      },
      {
        "s": "1 oz",
        "c": 5.95
      },
      {
        "s": "1 individual loaf (include Keebler Elfin Loaves)",
        "c": 12
      }
    ]
  },
  {
    "i": 747,
    "n": "Biscuits, plain or buttermilk, dry mix",
    "ms": [
      {
        "s": "1 oz",
        "c": 50.7
      },
      {
        "s": "0.33 cup (NLEA serving size)",
        "c": 71.6
      },
      {
        "s": "1 cup, purchased",
        "c": 215
      },
      {
        "s": "1 cup, homemade",
        "c": 204
      },
      {
        "s": "1 cup, spooned into cup",
        "c": 215
      },
      {
        "s": "1 cup, poured from box",
        "c": 229
      }
    ]
  },
  {
    "i": 748,
    "n": "Bagels, egg",
    "ms": [
      {
        "s": "1 mini bagel (2-1/2 dia)",
        "c": 3.38
      },
      {
        "s": "1 large bagel (4-1/2 dia)",
        "c": 17
      },
      {
        "s": "1 oz",
        "c": 3.69
      },
      {
        "s": "1 medium bagel (3-1/2 to 4 dia)",
        "c": 13.6
      },
      {
        "s": "1 small bagel (3 dia)",
        "c": 8.97
      }
    ]
  },
  {
    "i": 751,
    "n": "Bagels, plain, enriched, with calcium propionate (includes onion, poppy, sesame), toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.25
      },
      {
        "s": "1 small bagel (3 dia)",
        "c": 9.75
      },
      {
        "s": "1 mini bagel (2-1/2 dia)",
        "c": 3.6
      },
      {
        "s": "1 large bagel (4-1/2)",
        "c": 18.4
      },
      {
        "s": "1 medium bagel (3-1/2 to 4 dia)",
        "c": 14.8
      }
    ]
  },
  {
    "i": 752,
    "n": "Lamb, Australian, Imported, Fresh, Rib Chop, Frenched, Denuded, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      },
      {
        "s": "1 chop",
        "c": 4.3
      }
    ]
  },
  {
    "i": 754,
    "n": "Lamb, Australian, imported, fresh, leg, hindshank, heel on, bone-in, separable lean and fat, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 leg hindshank, heel on",
        "c": 26.5
      }
    ]
  },
  {
    "i": 757,
    "n": "Lamb, Australian, imported, fresh, external fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 760,
    "n": "Lamb, Australian, Imported, Fresh, Rack, Roast, Frenched, Denuded, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 roast",
        "c": 23
      }
    ]
  },
  {
    "i": 763,
    "n": "Lamb, Australian, imported, fresh, rack, roast, frenched, bone-in, separable lean only, trimmed to 1/8 fat, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 26.8
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 766,
    "n": "Veal, seam fat only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 33.9
      }
    ]
  },
  {
    "i": 768,
    "n": "Veal, external fat only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 35
      }
    ]
  },
  {
    "i": 770,
    "n": "Lamb, New Zealand, Imported, Tenderloin, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 773,
    "n": "Lamb, New Zealand, imported, square-cut shoulder, separable lean and fat, cooked, slow roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 775,
    "n": "Beverages, tea, instant, decaffeinated, unsweetened",
    "ms": [
      {
        "s": "1 serving 2 tsp",
        "c": 0.826
      }
    ]
  },
  {
    "i": 776,
    "n": "Lamb, New Zealand, Imported, Tunnel-Boned Leg, Chump Off, Shank Off, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 778,
    "n": "Lamb, New Zealand, imported, square-cut shoulder chops, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 24.9
      }
    ]
  },
  {
    "i": 781,
    "n": "Beverages, malted drink mix, chocolate, powder",
    "ms": [
      {
        "s": "1 serving (3 heaping tsp or 1 envelope)",
        "c": 12.6
      }
    ]
  },
  {
    "i": 784,
    "n": "Strawberry-flavor beverage mix, powder",
    "ms": [
      {
        "s": "1 serving (2-3 heaping tsp)",
        "c": 0.88
      }
    ]
  },
  {
    "i": 787,
    "n": "Beverages, lemonade-flavor drink, powder",
    "ms": [
      {
        "s": "0.5 scoop (2 tbsp)",
        "c": 3.19
      },
      {
        "s": "1 serving",
        "c": 1.98
      }
    ]
  },
  {
    "i": 788,
    "n": "Malt beverage, includes non-alcoholic beer",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.6
      },
      {
        "s": "1 fl oz",
        "c": 2.07
      }
    ]
  },
  {
    "i": 793,
    "n": "Beverages, tea, black, ready-to-drink, peach, diet",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.68
      }
    ]
  },
  {
    "i": 795,
    "n": "Beverages, Lemonade, powder",
    "ms": [
      {
        "s": "1 cup",
        "c": 43.6
      },
      {
        "s": "1 serving",
        "c": 3.6
      }
    ]
  },
  {
    "i": 796,
    "n": "Beverages, carbonated, cola, regular",
    "ms": [
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 4.92
      },
      {
        "s": "1 drink, medium (22 fl oz)",
        "c": 6.76
      },
      {
        "s": "1 drink, large (32 fl oz)",
        "c": 9.84
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 3.7
      },
      {
        "s": "1 fl oz",
        "c": 0.307
      },
      {
        "s": "1 drink, extra large (44 fl oz)",
        "c": 13.5
      },
      {
        "s": "1 drink, small (16 fl oz)",
        "c": 4.92
      }
    ]
  },
  {
    "i": 797,
    "n": "Beverages, carbonated, reduced sugar, cola, contains caffeine and sweeteners",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.592
      },
      {
        "s": "1 can (8 fl oz)",
        "c": 7.1
      }
    ]
  },
  {
    "i": 798,
    "n": "Beverages, carbonated, orange",
    "ms": [
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 24.8
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 18.6
      },
      {
        "s": "1 fl oz",
        "c": 1.55
      }
    ]
  },
  {
    "i": 799,
    "n": "Alcoholic beverage, wine, table, white",
    "ms": [
      {
        "s": "1 serving (5 fl oz)",
        "c": 13.2
      },
      {
        "s": "1 fl oz",
        "c": 2.65
      }
    ]
  },
  {
    "i": 800,
    "n": "Beverages, carbonated, club soda",
    "ms": [
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 23.7
      },
      {
        "s": "1 fl oz",
        "c": 1.48
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 17.8
      }
    ]
  },
  {
    "i": 801,
    "n": "Beverages, carbonated, cola, without caffeine",
    "ms": [
      {
        "s": "1 serving 12 fl oz",
        "c": 7.36
      },
      {
        "s": "1 serving 16 fl oz",
        "c": 9.82
      },
      {
        "s": "1 fl oz",
        "c": 0.614
      }
    ]
  },
  {
    "i": 802,
    "n": "Beverages, almond milk, unsweetened, shelf stable",
    "ms": [
      {
        "s": "1 cup",
        "c": 482
      }
    ]
  },
  {
    "i": 803,
    "n": "Beverages, carbonated, low calorie, cola or pepper-type, with aspartame, without caffeine",
    "ms": [
      {
        "s": "1 drink, large (32 fl oz)",
        "c": 28.4
      },
      {
        "s": "1 fl oz",
        "c": 0.888
      },
      {
        "s": "1 can (12 fl oz)",
        "c": 10.6
      },
      {
        "s": "1 drink, small (16 fl oz)",
        "c": 14.2
      },
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 14.2
      },
      {
        "s": "1 drink, extra large (44 fl oz)",
        "c": 39.1
      },
      {
        "s": "1 drink, medium (22 fl oz)",
        "c": 19.5
      }
    ]
  },
  {
    "i": 805,
    "n": "Beverages, carbonated, ginger ale",
    "ms": [
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 14.6
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 11
      },
      {
        "s": "1 fl oz",
        "c": 0.915
      }
    ]
  },
  {
    "i": 808,
    "n": "Beverages, yellow green colored citrus soft drink with caffeine",
    "ms": [
      {
        "s": "16 fl oz",
        "c": 61.5
      }
    ]
  },
  {
    "i": 810,
    "n": "Beverages, Coconut water, ready-to-drink, unsweetened",
    "ms": [
      {
        "s": "1 cup",
        "c": 17.2
      }
    ]
  },
  {
    "i": 812,
    "n": "Beverages, chocolate powder, no sugar added",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 100
      }
    ]
  },
  {
    "i": 813,
    "n": "Alcoholic Beverage, Distilled*",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0
      },
      {
        "s": "1 jigger (1.5 fl oz)",
        "c": 0
      }
    ]
  },
  {
    "i": 815,
    "n": "Beverages, Energy Drink, sugar free",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 816,
    "n": "Beverages, almond milk, chocolate, ready-to-drink",
    "ms": [
      {
        "s": "1 cup",
        "c": 451
      },
      {
        "s": "8 fl oz",
        "c": 451
      }
    ]
  },
  {
    "i": 818,
    "n": "Beverages, Energy Drink with carbonated water and high fructose corn syrup",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 825,
    "n": "Alcoholic Beverage, Distilled, All (Gin, Rum, Vodka, Whiskey)*",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0
      },
      {
        "s": "1 jigger (1.5 fl oz)",
        "c": 0
      }
    ]
  },
  {
    "i": 829,
    "n": "Beverages, Whiskey sour mix, bottled",
    "ms": [
      {
        "s": "2 fl oz",
        "c": 1.3
      },
      {
        "s": "1 fl oz",
        "c": 0.646
      }
    ]
  },
  {
    "i": 830,
    "n": "Snacks, Pretzels, gluten- free made with cornstarch and potato flour",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 831,
    "n": "Soup, egg drop, Chinese restaurant",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.9
      }
    ]
  },
  {
    "i": 832,
    "n": "Snacks, potato chips, lightly salted",
    "ms": [
      {
        "s": "23 pieces",
        "c": 6.72
      },
      {
        "s": "1 bag",
        "c": 54.5
      }
    ]
  },
  {
    "i": 833,
    "n": "Snacks, potato chips, made from dried potatoes (preformed), multigrain",
    "ms": [
      {
        "s": "16.5 pieces average",
        "c": 7.28
      },
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 839,
    "n": "Snacks, candy bits, yogurt covered with vitamin C",
    "ms": [
      {
        "s": "1 package",
        "c": 100
      }
    ]
  },
  {
    "i": 845,
    "n": "Snacks, vegetable chips, made from garden vegetables",
    "ms": [
      {
        "s": "1 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 848,
    "n": "Snacks, popcorn, microwave, regular (butter) flavor, made with partially hydrogenated oil",
    "ms": [
      {
        "s": "1 cup",
        "c": 1.58
      },
      {
        "s": "1 bag",
        "c": 17.4
      }
    ]
  },
  {
    "i": 855,
    "n": "Snacks, sweet potato chips, unsalted",
    "ms": [
      {
        "s": "1 package",
        "c": 20.1
      },
      {
        "s": "1 Bag",
        "c": 16.5
      },
      {
        "s": "1 oz",
        "c": 16.7
      }
    ]
  },
  {
    "i": 857,
    "n": "Snacks, candy rolls, yogurt-covered, fruit flavored with high vitamin C",
    "ms": [
      {
        "s": "1 Roll",
        "c": 98.9
      }
    ]
  },
  {
    "i": 859,
    "n": "Beef, flank, steak, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 36.3
      },
      {
        "s": "4 oz",
        "c": 23.7
      }
    ]
  },
  {
    "i": 860,
    "n": "Snacks, popcorn, microwave, low fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      }
    ]
  },
  {
    "i": 861,
    "n": "Beef, flank, steak, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 45.1
      },
      {
        "s": "4 oz",
        "c": 27.1
      }
    ]
  },
  {
    "i": 865,
    "n": "Beef, bottom sirloin, tri-tip roast, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 73.2
      },
      {
        "s": "4 oz",
        "c": 30.5
      }
    ]
  },
  {
    "i": 866,
    "n": "Beef, variety meats and by-products, tripe, cooked, simmered",
    "ms": [
      {
        "s": "1 serving",
        "c": 68.8
      },
      {
        "s": "3 oz",
        "c": 68.8
      }
    ]
  },
  {
    "i": 869,
    "n": "Beef, bottom sirloin, tri-tip roast, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 60
      },
      {
        "s": "4 oz",
        "c": 26
      }
    ]
  },
  {
    "i": 871,
    "n": "Beef, brisket, flat half, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 20.3
      },
      {
        "s": "1 lb",
        "c": 81.6
      }
    ]
  },
  {
    "i": 872,
    "n": "Beef, top sirloin, steak, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 31.6
      },
      {
        "s": "1 lb",
        "c": 127
      }
    ]
  },
  {
    "i": 873,
    "n": "Beef, rib, small end (ribs 10-12), separable lean only, trimmed to 1/8fat, choice, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 13.6
      },
      {
        "s": "1 lb",
        "c": 72.6
      }
    ]
  },
  {
    "i": 874,
    "n": "Beef, tenderloin, steak, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 31.6
      },
      {
        "s": "1 lb",
        "c": 127
      }
    ]
  },
  {
    "i": 876,
    "n": "Beef, rib, small end (ribs 10-12), separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 127
      },
      {
        "s": "4 oz",
        "c": 31.6
      }
    ]
  },
  {
    "i": 877,
    "n": "Beef, Composite Of Trimmed Retail Cuts, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 878,
    "n": "Beef, Composite Of Trimmed Retail Cuts, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 881,
    "n": "Beef, ground, 97% lean meat / 3% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 882,
    "n": "Beef, ground, 93% lean meat / 7% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 883,
    "n": "Beef, ground, 93% lean meat / 7% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 884,
    "n": "Beef, ground, 93% lean meat / 7% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 885,
    "n": "Beef, ground, 93% lean meat /7% fat, patty, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 886,
    "n": "Beef, New Zealand, imported, striploin, separable lean and fat, cooked, fast fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 887,
    "n": "Beef, New Zealand, Imported, Rump Centre, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 889,
    "n": "Beef, New Zealand, Imported, Rump Centre, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 891,
    "n": "Beef, New Zealand, Imported, Eye Round, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 892,
    "n": "Beef, New Zealand, imported, eye round, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 893,
    "n": "Beef, New Zealand, Imported, Flank, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 895,
    "n": "Beef, New Zealand, imported, brisket navel end, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 898,
    "n": "Beef, New Zealand, imported, brisket point end, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 899,
    "n": "Beef, New Zealand, imported, variety meats and by-products, tongue, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 900,
    "n": "Beef, New Zealand, imported, striploin, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 903,
    "n": "Beef, New Zealand, Imported, Oyster Blade, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 904,
    "n": "Beef, New Zealand, Imported, Tenderloin, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 908,
    "n": "Beef, New Zealand, imported, variety meats and by-products, liver, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 909,
    "n": "Beef, New Zealand, imported, inside, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 910,
    "n": "Beef, New Zealand, imported, variety meats and by-products liver, cooked, boiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 911,
    "n": "Beef, New Zealand, imported, variety meats and by-products, kidney, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 913,
    "n": "Beef, New Zealand, imported, hind shin, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 914,
    "n": "Beef, New Zealand, imported, cube roll, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 916,
    "n": "Beef, New Zealand, imported, variety meats and by-products, heart, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 918,
    "n": "Beef, New Zealand, Imported, Bolar Blade, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 919,
    "n": "Beef, New Zealand, imported, cube roll, separable lean only, cooked, fast roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 922,
    "n": "Beef, New Zealand, imported, bolar blade, separable lean only, cooked, fast roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 924,
    "n": "Beef, top loin petite roast/filet, boneless, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 51.1
      },
      {
        "s": "1 fillet",
        "c": 10.4
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 927,
    "n": "Beef, top loin petite roast, boneless, separable lean and fat, trimmed to 1/8 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 roast",
        "c": 34.3
      }
    ]
  },
  {
    "i": 928,
    "n": "Beef, top loin petite roast, boneless, separable lean and fat, trimmed to 1/8 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 44.4
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 930,
    "n": "Beef, loin, top sirloin cap steak, boneless, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 13.4
      }
    ]
  },
  {
    "i": 931,
    "n": "Beef, top loin petite roast, boneless, separable lean and fat, trimmed to 1/8 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 roast",
        "c": 47.4
      }
    ]
  },
  {
    "i": 932,
    "n": "Beef, loin, top sirloin cap steak, boneless, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 14.3
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 933,
    "n": "Beef, ribeye filet, boneless, separable lean only, trimmed to 0 fat, all grades, cooked, grilled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 fillet",
        "c": 8.1
      }
    ]
  },
  {
    "i": 934,
    "n": "Beef, ribeye cap steak, boneless, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 steak",
        "c": 18.7
      }
    ]
  },
  {
    "i": 935,
    "n": "Beef, ribeye filet, boneless, separable lean only, trimmed to 0 fat, select, cooked, grilled",
    "ms": [
      {
        "s": "1 fillet",
        "c": 7.74
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 937,
    "n": "Beef, ribeye filet, boneless, separable lean only, trimmed to 0 fat, choice, cooked, grilled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 fillet",
        "c": 8.28
      }
    ]
  },
  {
    "i": 938,
    "n": "Beef, ribeye  petite roast/filet, boneless, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 8.15
      },
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 46.9
      }
    ]
  },
  {
    "i": 939,
    "n": "Beef, ribeye cap steak, boneless, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 14.9
      }
    ]
  },
  {
    "i": 940,
    "n": "Beef, ribeye  petite roast/filet, boneless, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 42.4
      },
      {
        "s": "1 fillet",
        "c": 8.35
      }
    ]
  },
  {
    "i": 941,
    "n": "Beef, loin, top sirloin petite roast/filet, boneless, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 47.8
      },
      {
        "s": "1 fillet",
        "c": 9.3
      }
    ]
  },
  {
    "i": 942,
    "n": "Beef, ribeye  petite roast/filet, boneless, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 45
      },
      {
        "s": "1 fillet",
        "c": 8.2
      }
    ]
  },
  {
    "i": 943,
    "n": "Beef, top loin filet, boneless, separable lean only, trimmed to 1/8 fat, select, cooked, grilled",
    "ms": [
      {
        "s": "3 oz",
        "c": 18.7
      },
      {
        "s": "1 fillet",
        "c": 29.7
      }
    ]
  },
  {
    "i": 944,
    "n": "Beef, top loin petite roast/filet, boneless, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 43.3
      },
      {
        "s": "1 fillet",
        "c": 8.3
      }
    ]
  },
  {
    "i": 945,
    "n": "Beef, loin, top sirloin filet, boneless, separable lean only, trimmed to 0 fat, choice, cooked, grilled",
    "ms": [
      {
        "s": "1 fillet",
        "c": 7.44
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 946,
    "n": "Beef, top loin petite roast/filet, boneless, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 42.2
      },
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 fillet",
        "c": 8.9
      }
    ]
  },
  {
    "i": 947,
    "n": "Beef, loin, top sirloin filet, boneless, separable lean only, trimmed to 0 fat, all grades, cooked, grilled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 fillet",
        "c": 7.26
      }
    ]
  },
  {
    "i": 948,
    "n": "Beef, top loin filet, boneless, separable lean only, trimmed to 1/8 fat, all grades, cooked, grilled",
    "ms": [
      {
        "s": "1 fillet",
        "c": 23
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 949,
    "n": "Beef, top loin filet, boneless, separable lean only, trimmed to 1/8 fat, choice, cooked, grilled",
    "ms": [
      {
        "s": "1 fillet",
        "c": 23
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 951,
    "n": "Guava sauce, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.7
      }
    ]
  },
  {
    "i": 952,
    "n": "Jackfruit, raw",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 39.6
      },
      {
        "s": "1 cup 1 pieces",
        "c": 36.2
      }
    ]
  },
  {
    "i": 953,
    "n": "Grapefruit juice, white, canned, sweetened",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.5
      },
      {
        "s": "1 cup",
        "c": 20
      }
    ]
  },
  {
    "i": 955,
    "n": "Grapefruit juice, white, frozen concentrate, unsweetened, undiluted",
    "ms": [
      {
        "s": "1 can (6 fl oz)",
        "c": 55.9
      }
    ]
  },
  {
    "i": 956,
    "n": "Grapefruit juice, white, frozen concentrate, unsweetened, diluted with 3 volume water",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.47
      },
      {
        "s": "1 cup",
        "c": 19.8
      }
    ]
  },
  {
    "i": 958,
    "n": "Grapes, red or green (European type, such as Thompson seedless), raw",
    "ms": [
      {
        "s": "1 NLEA serving",
        "c": 12.6
      },
      {
        "s": "10 grapes",
        "c": 4.9
      },
      {
        "s": "1 cup",
        "c": 15.1
      }
    ]
  },
  {
    "i": 959,
    "n": "Grapes, american type (slip skin), raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 12.9
      },
      {
        "s": "1 grape",
        "c": 0.336
      }
    ]
  },
  {
    "i": 960,
    "n": "Fruit salad, (peach and pear and apricot and pineapple and cherry), canned, extra heavy syrup, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 15.5
      }
    ]
  },
  {
    "i": 961,
    "n": "Grapefruit, raw, white, California",
    "ms": [
      {
        "s": "0.5 fruit (3-3/4 dia)",
        "c": 14.2
      },
      {
        "s": "1 cup sections, with juice",
        "c": 27.6
      }
    ]
  },
  {
    "i": 962,
    "n": "Grapefruit, raw, white, all areas",
    "ms": [
      {
        "s": "1 cup sections, with juice",
        "c": 27.6
      },
      {
        "s": "0.5 fruit (3-3/4 dia)",
        "c": 14.2
      }
    ]
  },
  {
    "i": 963,
    "n": "Grapefruit, raw, pink and red, California and Arizona",
    "ms": [
      {
        "s": "1 cup sections, with juice",
        "c": 25.3
      },
      {
        "s": "0.5 fruit (3-3/4 dia)",
        "c": 13.5
      }
    ]
  },
  {
    "i": 964,
    "n": "Grapefruit, raw, pink and red, all areas",
    "ms": [
      {
        "s": "0.5 fruit (3-3/4 dia)",
        "c": 27.1
      },
      {
        "s": "1 NLEA serving",
        "c": 33.9
      },
      {
        "s": "1 cup sections, with juice",
        "c": 50.6
      }
    ]
  },
  {
    "i": 965,
    "n": "Grapefruit, raw, pink and red, Florida",
    "ms": [
      {
        "s": "1 cup sections, with juice",
        "c": 34.5
      },
      {
        "s": "0.5 fruit (3-3/4 dia)",
        "c": 18.4
      }
    ]
  },
  {
    "i": 966,
    "n": "Fruit salad, (peach and pear and apricot and pineapple and cherry), canned, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 27.4
      }
    ]
  },
  {
    "i": 967,
    "n": "Figs, dried, stewed",
    "ms": [
      {
        "s": "1 cup",
        "c": 181
      }
    ]
  },
  {
    "i": 968,
    "n": "Fruit cocktail, (peach and pineapple and pear and grape and cherry), canned, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 19
      }
    ]
  },
  {
    "i": 970,
    "n": "Fruit cocktail, (peach and pineapple and pear and grape and cherry), canned, water pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 11.8
      }
    ]
  },
  {
    "i": 972,
    "n": "Fruit salad, (peach and pear and apricot and pineapple and cherry), canned, water pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 17.2
      }
    ]
  },
  {
    "i": 973,
    "n": "Fruit salad, (peach and pear and apricot and pineapple and cherry), canned, light syrup, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 17.6
      }
    ]
  },
  {
    "i": 980,
    "n": "Incaparina, dry mix (corn and soy flours), unprepared",
    "ms": [
      {
        "s": "1 cup",
        "c": 768
      },
      {
        "s": "1 tbsp",
        "c": 53.4
      }
    ]
  },
  {
    "i": 988,
    "n": "Milk and cereal bar",
    "ms": [
      {
        "s": "1 bar",
        "c": 102
      }
    ]
  },
  {
    "i": 1008,
    "n": "Cereals ready-to-eat, Post, Waffle Crisp",
    "ms": [
      {
        "s": "1 cup (1 NLEA serving)",
        "c": 7.2
      }
    ]
  },
  {
    "i": 1018,
    "n": "Sausage, breakfast sausage, beef, pre-cooked, unprepared",
    "ms": [
      {
        "s": "1 link",
        "c": 5.51
      }
    ]
  },
  {
    "i": 1019,
    "n": "Sausage, beef, fresh, cooked",
    "ms": [
      {
        "s": "1 serving",
        "c": 4.73
      }
    ]
  },
  {
    "i": 1020,
    "n": "Sausage, turkey, fresh, raw",
    "ms": [
      {
        "s": "1 serving",
        "c": 10.8
      }
    ]
  },
  {
    "i": 1021,
    "n": "Frankfurter, meat, heated",
    "ms": [
      {
        "s": "1 serving (1 hot dog)",
        "c": 51.5
      }
    ]
  },
  {
    "i": 1023,
    "n": "Chicken breast, roll, oven-roasted",
    "ms": [
      {
        "s": "1 serving 2 oz",
        "c": 3.36
      }
    ]
  },
  {
    "i": 1024,
    "n": "Bologna, pork, turkey and beef",
    "ms": [
      {
        "s": "1 oz",
        "c": 8.79
      }
    ]
  },
  {
    "i": 1025,
    "n": "Bologna, pork and turkey, lite",
    "ms": [
      {
        "s": "1 serving 2 oz",
        "c": 26.9
      }
    ]
  },
  {
    "i": 1026,
    "n": "Ham, honey, smoked, cooked",
    "ms": [
      {
        "s": "1.94 oz (1 serving)",
        "c": 3.3
      }
    ]
  },
  {
    "i": 1027,
    "n": "Turkey, white, rotisserie, deli cut",
    "ms": [
      {
        "s": "1.69 oz (1 serving)",
        "c": 7.68
      }
    ]
  },
  {
    "i": 1028,
    "n": "Frankfurter, beef, heated",
    "ms": [
      {
        "s": "1 frankfurter",
        "c": 5.28
      },
      {
        "s": "1 package",
        "c": 49.6
      }
    ]
  },
  {
    "i": 1029,
    "n": "Swisswurst, pork and beef, with swiss cheese, smoked",
    "ms": [
      {
        "s": "1 serving 2.7 oz",
        "c": 57
      }
    ]
  },
  {
    "i": 1030,
    "n": "Salami, Italian, pork",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.8
      }
    ]
  },
  {
    "i": 1031,
    "n": "Sausage, Italian, turkey, smoked",
    "ms": [
      {
        "s": "1 serving 2 oz",
        "c": 11.8
      }
    ]
  },
  {
    "i": 1032,
    "n": "Sausage, chicken, beef, pork, skinless, smoked",
    "ms": [
      {
        "s": "1 link",
        "c": 84
      }
    ]
  },
  {
    "i": 1033,
    "n": "Bacon and beef sticks",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.92
      }
    ]
  },
  {
    "i": 1034,
    "n": "Sausage, turkey, hot, smoked",
    "ms": [
      {
        "s": "2 oz",
        "c": 11.8
      }
    ]
  },
  {
    "i": 1035,
    "n": "Bratwurst, veal, cooked",
    "ms": [
      {
        "s": "1 serving 2.96 oz",
        "c": 9.24
      }
    ]
  },
  {
    "i": 1036,
    "n": "Liverwurst spread",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 12.1
      }
    ]
  },
  {
    "i": 1037,
    "n": "Salami, pork, beef, less sodium",
    "ms": [
      {
        "s": "3.52 oz",
        "c": 94
      }
    ]
  },
  {
    "i": 1038,
    "n": "Sausage, turkey, breakfast links, mild, raw",
    "ms": [
      {
        "s": "1 package",
        "c": 248
      },
      {
        "s": "1 link",
        "c": 15.4
      }
    ]
  },
  {
    "i": 1039,
    "n": "Roast beef spread",
    "ms": [
      {
        "s": "1 serving .25 cup",
        "c": 13.1
      }
    ]
  },
  {
    "i": 1040,
    "n": "Sausage, summer, pork and beef, sticks, with cheddar cheese",
    "ms": [
      {
        "s": "1 oz",
        "c": 23
      }
    ]
  },
  {
    "i": 1042,
    "n": "Bacon, turkey, unprepared",
    "ms": [
      {
        "s": "1 slice 12 oz pkg",
        "c": 12.8
      },
      {
        "s": "1 serving",
        "c": 11.2
      },
      {
        "s": "1 slice 6 oz pkg",
        "c": 7.84
      }
    ]
  },
  {
    "i": 1044,
    "n": "Sausage, New england brand, pork, beef",
    "ms": [
      {
        "s": "1 slice (4 dia x 1/8 thick)",
        "c": 1.61
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 1045,
    "n": "Luncheon sausage, pork and beef",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.69
      },
      {
        "s": "1 slice (4 dia x 1/8 thick)",
        "c": 2.99
      }
    ]
  },
  {
    "i": 1049,
    "n": "Sandwich spread, pork, beef",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.8
      },
      {
        "s": "1 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 1050,
    "n": "Sausage, smoked link sausage, pork",
    "ms": [
      {
        "s": "1 link, little (2 long x 3/4 dia)",
        "c": 1.76
      },
      {
        "s": "1 link (4 long x 1-1/8 dia)",
        "c": 7.48
      }
    ]
  },
  {
    "i": 1052,
    "n": "Sausage, smoked link sausage, pork and beef",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1053,
    "n": "Salami, dry or hard, pork, beef",
    "ms": [
      {
        "s": "3 slices 1 serving",
        "c": 6.48
      },
      {
        "s": "1 slice",
        "c": 2.35
      },
      {
        "s": "1 oz",
        "c": 6.72
      }
    ]
  },
  {
    "i": 1054,
    "n": "Sausage, turkey, reduced fat, brown and serve, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 39.7
      }
    ]
  },
  {
    "i": 1055,
    "n": "Polish sausage, pork",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "1 sausage (10 long x 1-1/4 dia)",
        "c": 27.2
      }
    ]
  },
  {
    "i": 1056,
    "n": "Poultry salad sandwich spread",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.3
      },
      {
        "s": "1 oz",
        "c": 2.84
      }
    ]
  },
  {
    "i": 1057,
    "n": "Sausage, pork and beef, fresh, cooked",
    "ms": [
      {
        "s": "1 link (raw dimensions: 4 long x 7/8 dia), cooked",
        "c": 1.3
      },
      {
        "s": "1 patty, cooked (raw dimensions: 3-7/8 dia x 1/4 thick)",
        "c": 2.7
      }
    ]
  },
  {
    "i": 1058,
    "n": "Pork sausage, link/patty, cooked, pan-fried",
    "ms": [
      {
        "s": "1 serving",
        "c": 4.32
      },
      {
        "s": "1 link",
        "c": 2.07
      },
      {
        "s": "1 patty",
        "c": 2.43
      }
    ]
  },
  {
    "i": 1059,
    "n": "Peppered loaf, pork, beef",
    "ms": [
      {
        "s": "3.52 slices",
        "c": 54
      }
    ]
  },
  {
    "i": 1060,
    "n": "Mortadella, beef, pork",
    "ms": [
      {
        "s": "1 slice (15 per 8 oz package)",
        "c": 2.7
      },
      {
        "s": "1 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 1061,
    "n": "Pepperoni, beef and pork, sliced",
    "ms": [
      {
        "s": "3 oz",
        "c": 16.2
      },
      {
        "s": "1 oz",
        "c": 5.32
      },
      {
        "s": "1 piece",
        "c": 0.38
      }
    ]
  },
  {
    "i": 1062,
    "n": "Pickle and pimiento loaf, pork",
    "ms": [
      {
        "s": "2 slices",
        "c": 62.1
      },
      {
        "s": "1 slice",
        "c": 41.4
      }
    ]
  },
  {
    "i": 1063,
    "n": "Roast beef, deli style, prepackaged, sliced",
    "ms": [
      {
        "s": "1 slice oval",
        "c": 0.465
      },
      {
        "s": "1 slice rectangle",
        "c": 0.69
      }
    ]
  },
  {
    "i": 1067,
    "n": "Turkey breast, low salt, prepackaged or deli, luncheon meat",
    "ms": [
      {
        "s": "2 oz",
        "c": 4.56
      },
      {
        "s": "1 cubic inch",
        "c": 1.12
      },
      {
        "s": "1 slice NFS",
        "c": 2.24
      },
      {
        "s": "1 cup wafer slices or shaved",
        "c": 6.48
      },
      {
        "s": "1 slice",
        "c": 2.24
      }
    ]
  },
  {
    "i": 1070,
    "n": "Soup, vegetarian vegetable, canned, prepared with equal volume water",
    "ms": [
      {
        "s": "1 cup",
        "c": 24.1
      },
      {
        "s": "1 can (10.5 oz), prepared",
        "c": 58.6
      }
    ]
  },
  {
    "i": 1072,
    "n": "Soup, vegetable beef, canned, prepared with equal volume water",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 19.5
      },
      {
        "s": "1 can (10.75 oz), prepared",
        "c": 47.4
      }
    ]
  },
  {
    "i": 1077,
    "n": "Soup, turkey vegetable, canned, prepared with equal volume water",
    "ms": [
      {
        "s": "1 can (10.5 oz), prepared",
        "c": 41
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 16.9
      },
      {
        "s": "1 fl oz",
        "c": 2.11
      }
    ]
  },
  {
    "i": 1084,
    "n": "Soup, cheese, canned, prepared with equal volume water",
    "ms": [
      {
        "s": "1 can (11 oz), prepared",
        "c": 342
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 141
      }
    ]
  },
  {
    "i": 1088,
    "n": "Soup, tomato, canned, prepared with equal volume low fat (2%) milk",
    "ms": [
      {
        "s": "1 serving 1 cup",
        "c": 171
      },
      {
        "s": "1 fl oz",
        "c": 21.4
      }
    ]
  },
  {
    "i": 1093,
    "n": "Soup, cream of mushroom, canned, prepared with equal volume low fat (2%) milk",
    "ms": [
      {
        "s": "1 serving 1 cup",
        "c": 171
      },
      {
        "s": "1 fl oz",
        "c": 21.4
      }
    ]
  },
  {
    "i": 1094,
    "n": "Sauce, white, thin, prepared-from-recipe, with butter",
    "ms": [
      {
        "s": "100 g",
        "c": 131
      }
    ]
  },
  {
    "i": 1095,
    "n": "Soup, vegetable, canned, low sodium, condensed",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 25.2
      }
    ]
  },
  {
    "i": 1096,
    "n": "Soup, chicken broth, ready-to-serve",
    "ms": [
      {
        "s": "1 cup",
        "c": 9.96
      }
    ]
  },
  {
    "i": 1097,
    "n": "Soup, clam chowder, new england, canned, prepared with equal volume low fat (2%) milk",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 22
      },
      {
        "s": "1 serving 1 cup",
        "c": 176
      }
    ]
  },
  {
    "i": 1098,
    "n": "Soup, cream of onion, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 can (10.75 oz), prepared",
        "c": 433
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 179
      }
    ]
  },
  {
    "i": 1099,
    "n": "Soup, cream of chicken, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 181
      },
      {
        "s": "1 fl oz",
        "c": 22.6
      },
      {
        "s": "1 can (10.75 oz), prepared",
        "c": 439
      }
    ]
  },
  {
    "i": 1105,
    "n": "Sauce, oyster, ready-to-serve",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 5.76
      }
    ]
  },
  {
    "i": 1106,
    "n": "Sauce, fish, ready-to-serve",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.74
      }
    ]
  },
  {
    "i": 1107,
    "n": "Sauce, barbecue",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 47.2
      },
      {
        "s": "1 cup",
        "c": 92.1
      },
      {
        "s": "1 tbsp",
        "c": 5.61
      }
    ]
  },
  {
    "i": 1109,
    "n": "Sauce, salsa, ready-to-serve",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 39
      },
      {
        "s": "1 cup",
        "c": 77.7
      },
      {
        "s": "2 tbsp",
        "c": 10.8
      }
    ]
  },
  {
    "i": 1110,
    "n": "Sauce, homemade, white, thick",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 139
      },
      {
        "s": "1 cup",
        "c": 278
      }
    ]
  },
  {
    "i": 1111,
    "n": "Sauce, homemade, white, medium",
    "ms": [
      {
        "s": "1 cup",
        "c": 295
      },
      {
        "s": "0.5 cup",
        "c": 148
      }
    ]
  },
  {
    "i": 1112,
    "n": "Sauce, ready-to-serve, pepper or hot",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.376
      },
      {
        "s": "0.25 tsp",
        "c": 0.096
      }
    ]
  },
  {
    "i": 1114,
    "n": "Turkey, back, from whole bird, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 back",
        "c": 187
      },
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 1117,
    "n": "Turkey, retail parts, breast, meat only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 breast",
        "c": 104
      }
    ]
  },
  {
    "i": 1119,
    "n": "Turkey, retail parts, thigh, meat only, raw",
    "ms": [
      {
        "s": "1 thigh",
        "c": 18.2
      },
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 1121,
    "n": "Turkey, retail parts, wing, meat only, raw",
    "ms": [
      {
        "s": "1 wing",
        "c": 31.1
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 1123,
    "n": "Turkey, retail parts, breast, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 breast",
        "c": 93.7
      },
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 1125,
    "n": "Turkey from whole, light meat, meat and skin, with added solution, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 63.4
      },
      {
        "s": "4 oz",
        "c": 15.8
      }
    ]
  },
  {
    "i": 1126,
    "n": "Turkey, dark meat from whole, meat and skin, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 lb",
        "c": 63.4
      }
    ]
  },
  {
    "i": 1127,
    "n": "Turkey, dark meat, meat only, with added solution, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 1128,
    "n": "Turkey, dark meat from whole, meat only, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 1134,
    "n": "Chicken, dark meat, drumstick, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 drumstick with skin",
        "c": 12.9
      },
      {
        "s": "1 drumstick without skin",
        "c": 12.2
      },
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1136,
    "n": "Chicken, skin (drumsticks and thighs), with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      }
    ]
  },
  {
    "i": 1138,
    "n": "Chicken, broilers or fryers, dark meat, drumstick, meat and skin, cooked, braised",
    "ms": [
      {
        "s": "1 drumstick without skin",
        "c": 11.4
      },
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "1 drumstick with skin",
        "c": 12.6
      }
    ]
  },
  {
    "i": 1139,
    "n": "Turkey, ground, 85% lean, 15% fat, patties, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 40.8
      }
    ]
  },
  {
    "i": 1140,
    "n": "Turkey, ground, 85% lean, 15% fat, pan-broiled crumbles",
    "ms": [
      {
        "s": "3 oz",
        "c": 41.6
      }
    ]
  },
  {
    "i": 1141,
    "n": "Chicken, broilers or fryers, dark meat, thigh, meat and skin, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 thigh with skin",
        "c": 14.2
      },
      {
        "s": "1 thigh without skin",
        "c": 12.2
      }
    ]
  },
  {
    "i": 1142,
    "n": "Turkey, ground, 93% lean, 7% fat, patties, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 24.6
      }
    ]
  },
  {
    "i": 1144,
    "n": "Turkey, ground, 85% lean, 15% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 37.3
      },
      {
        "s": "1 patty (cooked from 4 oz raw)",
        "c": 28
      },
      {
        "s": "1 lb",
        "c": 149
      }
    ]
  },
  {
    "i": 1159,
    "n": "Pheasant, raw, meat and skin",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-eat pheasant)",
        "c": 44.5
      },
      {
        "s": "0.5 pheasant",
        "c": 48
      }
    ]
  },
  {
    "i": 1160,
    "n": "Guinea hen, meat only, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook guinea)",
        "c": 30.2
      },
      {
        "s": "0.5 guinea",
        "c": 29
      }
    ]
  },
  {
    "i": 1162,
    "n": "Pheasant, raw, meat only",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-eat pheasant)",
        "c": 42.4
      },
      {
        "s": "0.5 pheasant",
        "c": 45.8
      }
    ]
  },
  {
    "i": 1163,
    "n": "Pheasant, breast, meat only, raw",
    "ms": [
      {
        "s": "0.5 breast, bone and skin removed",
        "c": 5.46
      },
      {
        "s": "3 oz",
        "c": 2.55
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-eat pheasant)",
        "c": 5.07
      }
    ]
  },
  {
    "i": 1164,
    "n": "Squab, (pigeon), meat and skin, raw",
    "ms": [
      {
        "s": "1 squab",
        "c": 23.9
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook squab)",
        "c": 35.6
      },
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1165,
    "n": "Duck, wild, breast, meat only, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 2.19
      },
      {
        "s": "0.5 breast, bone and skin removed",
        "c": 2.49
      }
    ]
  },
  {
    "i": 1166,
    "n": "Chicken, capons, giblets, cooked, simmered",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to cook capon)",
        "c": 1.43
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 18.8
      }
    ]
  },
  {
    "i": 1167,
    "n": "Goose, domesticated, meat and skin, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook goose)",
        "c": 38.4
      },
      {
        "s": "0.5 goose",
        "c": 158
      },
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1168,
    "n": "Duck, wild, meat and skin, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      },
      {
        "s": "0.5 duck",
        "c": 13.5
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 12
      }
    ]
  },
  {
    "i": 1169,
    "n": "Duck, domesticated, liver, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 1.1
      },
      {
        "s": "1 liver",
        "c": 4.84
      }
    ]
  },
  {
    "i": 1170,
    "n": "Chicken, capons, giblets, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to cook capon)",
        "c": 1.8
      },
      {
        "s": "1 giblets",
        "c": 11.5
      }
    ]
  },
  {
    "i": 1171,
    "n": "Lamb, New Zealand, imported, loin saddle, separable lean and fat, cooked, fast roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 1172,
    "n": "Lamb, New Zealand, Imported, Leg Chop/Steak, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 1173,
    "n": "Lamb, New Zealand, imported, loin chop, separable lean and fat, cooked, fast fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 26.4
      }
    ]
  },
  {
    "i": 1174,
    "n": "Lamb, New Zealand, imported, loin saddle, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 1175,
    "n": "Lamb, New Zealand, Imported, Netted Shoulder, Rolled, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 1177,
    "n": "Lamb, New Zealand, imported, neck chops, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 26
      }
    ]
  },
  {
    "i": 1179,
    "n": "Lamb, New Zealand, Imported, Rack - Fully Frenched, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 1181,
    "n": "Lamb, New Zealand, Imported, Hind-Shank, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 1183,
    "n": "Lamb, New Zealand, Imported, Loin, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 1184,
    "n": "Lamb, New Zealand, Imported, Loin, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 1186,
    "n": "Lamb, New Zealand, Imported, Tunnel-Boned Leg, Chump Off, Shank Off, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 1188,
    "n": "Lamb, New Zealand, imported, sweetbread, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 2.26
      }
    ]
  },
  {
    "i": 1190,
    "n": "Lamb, New Zealand, imported, sweetbread, cooked, soaked and simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 1191,
    "n": "Lamb, New Zealand, imported, heart, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 1192,
    "n": "Lamb, New Zealand, imported, flap, boneless, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      }
    ]
  },
  {
    "i": 1193,
    "n": "Lamb, New Zealand, imported, kidney, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 1194,
    "n": "Lamb, New Zealand, imported, heart, cooked, soaked and simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 1195,
    "n": "Lamb, New Zealand, imported, brains, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 1196,
    "n": "Lamb, New Zealand, imported, brains, cooked, soaked and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 1197,
    "n": "Lamb, New Zealand, imported, kidney, cooked, soaked and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 1199,
    "n": "Lamb, New Zealand, imported, chump, boneless, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 1200,
    "n": "Veal, Australian, shank, fore, bone-in, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 18.1
      },
      {
        "s": "1 roast with bone",
        "c": 37.6
      }
    ]
  },
  {
    "i": 1203,
    "n": "Lamb, New Zealand, imported, Intermuscular fat, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5
      }
    ]
  },
  {
    "i": 1204,
    "n": "Lamb, New Zealand, imported, subcutaneous fat, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 3
      }
    ]
  },
  {
    "i": 1214,
    "n": "Lamb, Australian, imported, fresh, shoulder, arm, separable lean only, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.25
      },
      {
        "s": "3 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 1220,
    "n": "Lamb, Australian, Imported, Fresh, Rib Chop/Rack Roast, Frenched, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 chop",
        "c": 4.41
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 1226,
    "n": "Lamb, Australian, imported, fresh, leg, sirloin half, boneless, separable lean only, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 45.4
      },
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 1228,
    "n": "Lamb, Australian, imported, fresh, leg, center slice, bone-in, separable lean only, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 1232,
    "n": "Lamb, Australian, imported, fresh, foreshank, separable lean only, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 49.9
      },
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 oz",
        "c": 3.12
      }
    ]
  },
  {
    "i": 1241,
    "n": "Veal, breast, whole, boneless, separable lean and fat, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.98
      },
      {
        "s": "1 lb",
        "c": 31.8
      }
    ]
  },
  {
    "i": 1242,
    "n": "Veal, breast, point half, boneless, separable lean and fat, cooked, braised",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 24.7
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 1245,
    "n": "Veal, breast, plate half, boneless, separable lean and fat, cooked, braised",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 23.3
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 1248,
    "n": "Lamb, shoulder, arm, separable lean and fat, trimmed to 1/8 fat, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 15.3
      },
      {
        "s": "1 steak, excluding refuse (yield from 1 raw steak, with refuse, weighing 102 g)",
        "c": 10.6
      }
    ]
  },
  {
    "i": 1249,
    "n": "Lamb, shoulder, arm, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.97
      },
      {
        "s": "1 steak, excluding refuse (yield from 1 raw steak, with refuse, weighing 102 g)",
        "c": 11.8
      }
    ]
  },
  {
    "i": 1258,
    "n": "Lamb, rib, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.97
      },
      {
        "s": "1 lb",
        "c": 63.5
      }
    ]
  },
  {
    "i": 1260,
    "n": "Lamb, leg, shank half, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 31.8
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 1264,
    "n": "Veal, variety meats and by-products, tongue, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 1265,
    "n": "Lamb, ground, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.54
      },
      {
        "s": "4 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 1268,
    "n": "Lamb, variety meats and by-products, tongue, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      },
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1269,
    "n": "Lamb, foreshank, separable lean and fat, trimmed to 1/8 fat, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 17
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 29.6
      }
    ]
  },
  {
    "i": 1271,
    "n": "Veal, variety meats and by-products, pancreas, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 21.5
      },
      {
        "s": "1 oz",
        "c": 5.39
      }
    ]
  },
  {
    "i": 1272,
    "n": "Veal, variety meats and by-products, kidneys, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 1275,
    "n": "Lamb, variety meats and by-products, lungs, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 1276,
    "n": "Veal, variety meats and by-products, lungs, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 1278,
    "n": "Lamb, variety meats and by-products, spleen, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 1280,
    "n": "Lamb, variety meats and by-products, kidneys, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.69
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 1286,
    "n": "Veal, variety meats and by-products, brain, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 oz",
        "c": 2.84
      }
    ]
  },
  {
    "i": 1291,
    "n": "Lamb, New Zealand, imported, leg chop/steak, bone-in, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 serving",
        "c": 11.5
      }
    ]
  },
  {
    "i": 1306,
    "n": "Lamb, shoulder, blade, separable lean only, trimmed to 1/4 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.54
      },
      {
        "s": "1 lb",
        "c": 72.6
      }
    ]
  },
  {
    "i": 1314,
    "n": "Lamb, leg, sirloin half, separable lean only, trimmed to 1/4 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.98
      },
      {
        "s": "1 lb",
        "c": 31.8
      }
    ]
  },
  {
    "i": 1315,
    "n": "Lamb, leg, shank half, separable lean and fat, trimmed to 1/4 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "1 lb",
        "c": 36.3
      }
    ]
  },
  {
    "i": 1317,
    "n": "Lamb, rib, separable lean and fat, trimmed to 1/4 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.25
      },
      {
        "s": "1 lb",
        "c": 68
      }
    ]
  },
  {
    "i": 1329,
    "n": "Soy protein concentrate, produced by acid wash",
    "ms": [
      {
        "s": "1 oz",
        "c": 103
      }
    ]
  },
  {
    "i": 1335,
    "n": "Soy protein isolate, potassium type",
    "ms": [
      {
        "s": "1 oz",
        "c": 50.5
      }
    ]
  },
  {
    "i": 1339,
    "n": "Soymilk, chocolate, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 306
      },
      {
        "s": "1 fl oz",
        "c": 38.6
      }
    ]
  },
  {
    "i": 1345,
    "n": "Chickpea flour (besan)",
    "ms": [
      {
        "s": "1 cup",
        "c": 41.4
      }
    ]
  },
  {
    "i": 1346,
    "n": "Hummus, commercial",
    "ms": [
      {
        "s": "1 cup",
        "c": 116
      },
      {
        "s": "1 tbsp",
        "c": 7.05
      }
    ]
  },
  {
    "i": 1347,
    "n": "Soymilk, chocolate, unfortified",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 7.65
      },
      {
        "s": "1 cup",
        "c": 60.8
      }
    ]
  },
  {
    "i": 1349,
    "n": "Veggie burgers or soyburgers, unprepared",
    "ms": [
      {
        "s": "1 pattie",
        "c": 95.2
      }
    ]
  },
  {
    "i": 1351,
    "n": "Winged beans, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 801
      }
    ]
  },
  {
    "i": 1352,
    "n": "Lentils, pink or red, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 92.2
      }
    ]
  },
  {
    "i": 1353,
    "n": "Tofu, salted and fermented (fuyu)",
    "ms": [
      {
        "s": "1 block",
        "c": 5.06
      }
    ]
  },
  {
    "i": 1354,
    "n": "Yardlong beans, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 230
      }
    ]
  },
  {
    "i": 1355,
    "n": "Soy sauce made from soy (tamari)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.6
      },
      {
        "s": "1 tsp",
        "c": 1.2
      }
    ]
  },
  {
    "i": 1356,
    "n": "Soy sauce made from soy and wheat (shoyu)",
    "ms": [
      {
        "s": "1 cup",
        "c": 84.2
      },
      {
        "s": "1 tsp",
        "c": 1.75
      },
      {
        "s": "1 tbsp",
        "c": 5.28
      },
      {
        "s": "1 individual packet",
        "c": 2.94
      }
    ]
  },
  {
    "i": 1357,
    "n": "Soy sauce made from hydrolyzed vegetable protein",
    "ms": [
      {
        "s": "1 tsp",
        "c": 1.02
      },
      {
        "s": "0.25 cup",
        "c": 9.86
      },
      {
        "s": "1 tbsp",
        "c": 3.06
      }
    ]
  },
  {
    "i": 1358,
    "n": "Soy protein isolate",
    "ms": [
      {
        "s": "1 oz",
        "c": 50.5
      }
    ]
  },
  {
    "i": 1360,
    "n": "Soybeans, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 515
      }
    ]
  },
  {
    "i": 1361,
    "n": "Tempeh",
    "ms": [
      {
        "s": "1 cup",
        "c": 184
      }
    ]
  },
  {
    "i": 1362,
    "n": "Soybeans, mature cooked, boiled, without salt",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 10.9
      },
      {
        "s": "1 cup",
        "c": 175
      }
    ]
  },
  {
    "i": 1363,
    "n": "Soy flour, full-fat, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 10.7
      },
      {
        "s": "1 cup, stirred",
        "c": 173
      }
    ]
  },
  {
    "i": 1364,
    "n": "Soy flour, defatted",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 15.9
      },
      {
        "s": "1 cup",
        "c": 253
      }
    ]
  },
  {
    "i": 1366,
    "n": "Meat extender",
    "ms": [
      {
        "s": "1 cup",
        "c": 180
      },
      {
        "s": "1 oz",
        "c": 57.8
      }
    ]
  },
  {
    "i": 1367,
    "n": "Sausage, meatless",
    "ms": [
      {
        "s": "1 slice",
        "c": 17.6
      },
      {
        "s": "1 link",
        "c": 15.8
      },
      {
        "s": "1 patty",
        "c": 23.9
      }
    ]
  },
  {
    "i": 1368,
    "n": "Peanut flour, defatted",
    "ms": [
      {
        "s": "1 cup",
        "c": 84
      },
      {
        "s": "1 oz",
        "c": 39.7
      }
    ]
  },
  {
    "i": 1370,
    "n": "Peanut Butter, Chunk Style, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 116
      },
      {
        "s": "2 tbsp",
        "c": 14.4
      }
    ]
  },
  {
    "i": 1372,
    "n": "Peanuts, Virginia, Oil-Roasted, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 123
      },
      {
        "s": "1 oz",
        "c": 24.4
      }
    ]
  },
  {
    "i": 1374,
    "n": "Peanuts, spanish, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 30.1
      },
      {
        "s": "1 cup",
        "c": 155
      }
    ]
  },
  {
    "i": 1375,
    "n": "Peanuts, All Types, Oil-Roasted, With*",
    "ms": [
      {
        "s": "1 oz shelled (32 nuts)",
        "c": 17.3
      },
      {
        "s": "1 cup, chopped",
        "c": 87.8
      }
    ]
  },
  {
    "i": 1376,
    "n": "Mung beans, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 273
      },
      {
        "s": "1 tbsp",
        "c": 17.2
      }
    ]
  },
  {
    "i": 1377,
    "n": "Lima beans, thin seeded (baby), mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 164
      }
    ]
  },
  {
    "i": 1379,
    "n": "Noodles, chinese, cellophane or long rice (mung beans), dehydrated",
    "ms": [
      {
        "s": "1 cup",
        "c": 35
      }
    ]
  },
  {
    "i": 1380,
    "n": "Mungo beans, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 286
      }
    ]
  },
  {
    "i": 1383,
    "n": "Mollusks, oyster, Pacific, cooked, moist heat",
    "ms": [
      {
        "s": "1 medium",
        "c": 4
      },
      {
        "s": "3 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 1384,
    "n": "Fish, yellowtail, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 42.3
      },
      {
        "s": "3 oz",
        "c": 24.6
      }
    ]
  },
  {
    "i": 1385,
    "n": "Lima beans, large, mature seeds, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 8.99
      },
      {
        "s": "1 cup",
        "c": 144
      }
    ]
  },
  {
    "i": 1386,
    "n": "Mollusks, octopus, common, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 90.1
      }
    ]
  },
  {
    "i": 1387,
    "n": "Fish, roughy, orange, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 1388,
    "n": "Fish, shad, american, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 86.4
      },
      {
        "s": "3 oz",
        "c": 51
      }
    ]
  },
  {
    "i": 1389,
    "n": "Fish, spot, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 9
      },
      {
        "s": "3 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 1390,
    "n": "Fish, whitefish, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 28
      },
      {
        "s": "1 fillet",
        "c": 50.8
      }
    ]
  },
  {
    "i": 1391,
    "n": "Fish, scup, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 25.5
      },
      {
        "s": "3 oz",
        "c": 43.4
      }
    ]
  },
  {
    "i": 1392,
    "n": "Fish, turbot, european, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 36.6
      },
      {
        "s": "3 oz",
        "c": 19.6
      }
    ]
  },
  {
    "i": 1393,
    "n": "Fish, sablefish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 38.2
      },
      {
        "s": "0.5 fillet",
        "c": 68
      }
    ]
  },
  {
    "i": 1394,
    "n": "Fish, wolffish, Atlantic, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 9.52
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 1395,
    "n": "Fish, seatrout, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 40.9
      },
      {
        "s": "3 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 1396,
    "n": "Fish, herring, Pacific, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 153
      },
      {
        "s": "3 oz",
        "c": 90.1
      }
    ]
  },
  {
    "i": 1397,
    "n": "Fish, pout, ocean, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 17.8
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 1398,
    "n": "Fish, ling, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 37.4
      },
      {
        "s": "1 fillet",
        "c": 66.4
      }
    ]
  },
  {
    "i": 1399,
    "n": "Fish, roe, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 23.8
      },
      {
        "s": "1 oz",
        "c": 7.94
      }
    ]
  },
  {
    "i": 1400,
    "n": "Fish, lingcod, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 15.3
      },
      {
        "s": "0.5 fillet",
        "c": 27.2
      }
    ]
  },
  {
    "i": 1401,
    "n": "Fish, mackerel, king, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 61.6
      },
      {
        "s": "3 oz",
        "c": 34
      }
    ]
  },
  {
    "i": 1402,
    "n": "Fish, pollock, Atlantic, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 65.4
      },
      {
        "s": "0.5 fillet",
        "c": 116
      }
    ]
  },
  {
    "i": 1403,
    "n": "Fish, bluefish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "1 fillet",
        "c": 10.5
      }
    ]
  },
  {
    "i": 1406,
    "n": "Fish, burbot, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 57.6
      },
      {
        "s": "3 oz",
        "c": 54.4
      }
    ]
  },
  {
    "i": 1407,
    "n": "Fish, bass, striped, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 16.2
      },
      {
        "s": "1 fillet",
        "c": 23.6
      }
    ]
  },
  {
    "i": 1408,
    "n": "Fish, butterfish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 23.8
      },
      {
        "s": "1 fillet",
        "c": 7
      }
    ]
  },
  {
    "i": 1409,
    "n": "Fish, halibut, greenland, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 6.36
      },
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 1411,
    "n": "Mollusks, squid, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 27.2
      },
      {
        "s": "1 oz, boneless",
        "c": 9.07
      }
    ]
  },
  {
    "i": 1412,
    "n": "Mollusks, scallop, mixed species, imitation, made from surimi",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 1413,
    "n": "Mollusks, oyster, Pacific, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 medium",
        "c": 4
      }
    ]
  },
  {
    "i": 1414,
    "n": "Mollusks, scallop, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 unit 2 large or 5 small",
        "c": 1.8
      }
    ]
  },
  {
    "i": 1415,
    "n": "Mollusks, octopus, common, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 45
      }
    ]
  },
  {
    "i": 1417,
    "n": "Mollusks, scallop, mixed species, cooked, breaded and fried",
    "ms": [
      {
        "s": "2 large",
        "c": 13
      }
    ]
  },
  {
    "i": 1418,
    "n": "Mollusks, mussel, blue, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 28
      }
    ]
  },
  {
    "i": 1419,
    "n": "Mollusks, clam, mixed species, raw",
    "ms": [
      {
        "s": "1 large",
        "c": 7.8
      },
      {
        "s": "1 cup (with liquid and clams)",
        "c": 88.5
      },
      {
        "s": "3 oz",
        "c": 33.2
      },
      {
        "s": "1 lb (with shell), yield after shell removed",
        "c": 26.5
      },
      {
        "s": "1 medium",
        "c": 5.66
      },
      {
        "s": "1 small",
        "c": 3.51
      }
    ]
  },
  {
    "i": 1420,
    "n": "Mollusks, abalone, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 26.4
      }
    ]
  },
  {
    "i": 1422,
    "n": "Mollusks, mussel, blue, raw",
    "ms": [
      {
        "s": "1 medium",
        "c": 4.16
      },
      {
        "s": "3 oz",
        "c": 22.1
      },
      {
        "s": "1 cup",
        "c": 39
      },
      {
        "s": "1 large",
        "c": 5.2
      },
      {
        "s": "1 oz",
        "c": 7.37
      },
      {
        "s": "1 small",
        "c": 2.6
      }
    ]
  },
  {
    "i": 1423,
    "n": "Mollusks, cuttlefish, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 76.5
      }
    ]
  },
  {
    "i": 1424,
    "n": "Crustaceans, spiny lobster, mixed species, raw",
    "ms": [
      {
        "s": "1 lobster",
        "c": 102
      },
      {
        "s": "3 oz",
        "c": 41.6
      }
    ]
  },
  {
    "i": 1426,
    "n": "Crustaceans, lobster, northern, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 81.6
      },
      {
        "s": "1 cup",
        "c": 139
      }
    ]
  },
  {
    "i": 1427,
    "n": "Crustaceans, lobster, northern, raw",
    "ms": [
      {
        "s": "1 lobster",
        "c": 126
      },
      {
        "s": "3 oz",
        "c": 71.4
      }
    ]
  },
  {
    "i": 1428,
    "n": "Crustaceans, crayfish, mixed species, wild, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 51
      }
    ]
  },
  {
    "i": 1429,
    "n": "Crustaceans, crayfish, mixed species, wild, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 23
      },
      {
        "s": "8 crayfish",
        "c": 7.29
      }
    ]
  },
  {
    "i": 1430,
    "n": "Crustaceans, crab, alaska king, imitation, made from surimi",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 1431,
    "n": "Crustaceans, crab, blue, raw",
    "ms": [
      {
        "s": "1 crab",
        "c": 18.7
      },
      {
        "s": "3 oz",
        "c": 75.6
      }
    ]
  },
  {
    "i": 1432,
    "n": "Crustaceans, crab, blue, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 77.4
      },
      {
        "s": "1 oz",
        "c": 25.8
      },
      {
        "s": "1 cup, flaked and pieces",
        "c": 107
      },
      {
        "s": "1 cup (not packed)",
        "c": 123
      }
    ]
  },
  {
    "i": 1433,
    "n": "Fish, haddock, smoked",
    "ms": [
      {
        "s": "3 oz",
        "c": 41.6
      },
      {
        "s": "1 oz, boneless",
        "c": 13.9
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 8.33
      }
    ]
  },
  {
    "i": 1434,
    "n": "Fish, halibut, Atlantic and Pacific, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "0.5 fillet",
        "c": 14.3
      }
    ]
  },
  {
    "i": 1435,
    "n": "Fish, haddock, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 21
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 1436,
    "n": "Fish, halibut, Atlantic and Pacific, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 14.3
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 1437,
    "n": "Crustaceans, crab, alaska king, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 50.2
      },
      {
        "s": "1 leg",
        "c": 79.1
      }
    ]
  },
  {
    "i": 1438,
    "n": "Fish, flatfish (flounder and sole species), raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 17.8
      },
      {
        "s": "1 oz, boneless",
        "c": 5.95
      },
      {
        "s": "1 fillet",
        "c": 34.2
      }
    ]
  },
  {
    "i": 1439,
    "n": "Fish, flatfish (flounder and sole species), cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 31.8
      },
      {
        "s": "3 oz",
        "c": 21.2
      }
    ]
  },
  {
    "i": 1441,
    "n": "Fish, eel, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 41.3
      },
      {
        "s": "1 oz with bone (yield after bone removed)",
        "c": 5.72
      },
      {
        "s": "3 oz",
        "c": 22.1
      },
      {
        "s": "1 oz, boneless",
        "c": 7.37
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 4.42
      }
    ]
  },
  {
    "i": 1443,
    "n": "Fish, croaker, Atlantic, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 11.8
      },
      {
        "s": "3 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 1445,
    "n": "Fish, cod, Atlantic, dried and salted",
    "ms": [
      {
        "s": "1 oz",
        "c": 45.4
      },
      {
        "s": "1 piece (5-1/2 x 1-1/2 x 1/2)",
        "c": 128
      },
      {
        "s": "3 oz",
        "c": 136
      }
    ]
  },
  {
    "i": 1446,
    "n": "Fish, eel, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 17
      },
      {
        "s": "1 fillet",
        "c": 40.8
      }
    ]
  },
  {
    "i": 1448,
    "n": "Fish, catfish, channel, cooked, breaded and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 37.4
      },
      {
        "s": "1 fillet",
        "c": 38.3
      }
    ]
  },
  {
    "i": 1449,
    "n": "Fish, catfish, channel, wild, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 22.3
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 1450,
    "n": "Fish, caviar, black and red, granular",
    "ms": [
      {
        "s": "1 oz",
        "c": 78
      },
      {
        "s": "1 tbsp",
        "c": 44
      }
    ]
  },
  {
    "i": 1451,
    "n": "Fish, anchovy, european, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 125
      }
    ]
  },
  {
    "i": 1452,
    "n": "Fish, carp, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 88.4
      },
      {
        "s": "3 oz",
        "c": 44.2
      }
    ]
  },
  {
    "i": 1453,
    "n": "Fish, bass, fresh water, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 68
      },
      {
        "s": "1 fillet",
        "c": 63.2
      }
    ]
  },
  {
    "i": 1454,
    "n": "Beverages, nutritional shake mix, high protein, powder",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 71.4
      },
      {
        "s": "1 serving",
        "c": 143
      }
    ]
  },
  {
    "i": 1455,
    "n": "Beverages, Fruit flavored drink, less than 3% juice, not fortified with vitamin C",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 7.14
      }
    ]
  },
  {
    "i": 1456,
    "n": "Beverages, Fruit flavored drink containing less than 3% fruit juice, with high vitamin C",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 7.14
      }
    ]
  },
  {
    "i": 1457,
    "n": "Beverages, fruit juice drink, reduced sugar, with vitamin E added",
    "ms": [
      {
        "s": "1 ml",
        "c": 0.05
      },
      {
        "s": "1 container",
        "c": 10.4
      }
    ]
  },
  {
    "i": 1462,
    "n": "Beverages, Vegetable and fruit juice drink, reduced calorie, with low-calorie sweetener, added vitamin C",
    "ms": [
      {
        "s": "1 serving",
        "c": 19
      }
    ]
  },
  {
    "i": 1464,
    "n": "Beverages, milk beverage, reduced fat, flavored and sweetened, Ready-to-drink,  added calcium, vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 400
      }
    ]
  },
  {
    "i": 1466,
    "n": "Beverages, vegetable and fruit juice blend, 100% juice, with added vitamins A, C, E",
    "ms": [
      {
        "s": "1 serving 8 oz",
        "c": 19.7
      }
    ]
  },
  {
    "i": 1468,
    "n": "Beverages, Water with added vitamins and minerals, bottles, sweetened, assorted fruit flavors",
    "ms": [
      {
        "s": "1 serving",
        "c": 40.3
      },
      {
        "s": "8 fl oz (1 NLEA serving)",
        "c": 40.3
      }
    ]
  },
  {
    "i": 1469,
    "n": "Beverages, Wine, non-alcoholic",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.61
      }
    ]
  },
  {
    "i": 1470,
    "n": "Beverages, chocolate-flavor beverage mix for milk, powder, with added nutrients",
    "ms": [
      {
        "s": "1 serving",
        "c": 100
      }
    ]
  },
  {
    "i": 1471,
    "n": "Beverages, chocolate-flavor beverage mix for milk, powder, with added nutrients, prepared with whole milk",
    "ms": [
      {
        "s": "1 serving",
        "c": 375
      }
    ]
  },
  {
    "i": 1472,
    "n": "Beverages, coffee, instant, vanilla, sweetened, decaffeinated, with non dairy creamer",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 1473,
    "n": "Beverages, tea, herb, brewed, chamomile",
    "ms": [
      {
        "s": "6 fl oz",
        "c": 3.56
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 4.74
      },
      {
        "s": "1 fl oz",
        "c": 0.592
      }
    ]
  },
  {
    "i": 1475,
    "n": "Water, bottled, generic",
    "ms": [
      {
        "s": "1 ml",
        "c": 0.1
      },
      {
        "s": "1 fl oz",
        "c": 2.96
      },
      {
        "s": "1 cup",
        "c": 23.7
      }
    ]
  },
  {
    "i": 1476,
    "n": "Beverages, Fruit punch drink, frozen concentrate, prepared with water",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.24
      },
      {
        "s": "1 cup",
        "c": 9.88
      }
    ]
  },
  {
    "i": 1481,
    "n": "Beverages, Fruit punch drink, frozen concentrate",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.78
      },
      {
        "s": "1 can (12 fl oz)",
        "c": 33.4
      }
    ]
  },
  {
    "i": 1482,
    "n": "Beverages, Fruit punch drink, with added nutrients, canned",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.48
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 19.8
      }
    ]
  },
  {
    "i": 1483,
    "n": "Beverages, cranberry-apple juice drink, bottled",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 7.35
      },
      {
        "s": "1 fl oz",
        "c": 0.918
      }
    ]
  },
  {
    "i": 1484,
    "n": "Alcoholic beverage, malt beer, hard lemonade",
    "ms": [
      {
        "s": "11.2 fl oz",
        "c": 13.4
      }
    ]
  },
  {
    "i": 1485,
    "n": "Beverages, tea, green, instant, decaffeinated, lemon, unsweetened, fortified with vitamin C",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 0.09
      }
    ]
  },
  {
    "i": 1487,
    "n": "Alcoholic beverage, beer, light, higher alcohol",
    "ms": [
      {
        "s": "12 fl oz",
        "c": 14.2
      }
    ]
  },
  {
    "i": 1489,
    "n": "Beverages, cranberry-apricot juice drink, bottled",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 22
      },
      {
        "s": "1 fl oz",
        "c": 2.75
      }
    ]
  },
  {
    "i": 1490,
    "n": "Beverages, tea, black, ready to drink",
    "ms": [
      {
        "s": "16 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 1494,
    "n": "Beverages, coffee substitute, cereal grain beverage, powder",
    "ms": [
      {
        "s": "1 tsp (1 serving)",
        "c": 1.74
      }
    ]
  },
  {
    "i": 1495,
    "n": "Beverages, coffee, instant, chicory",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.2
      },
      {
        "s": "1 serving 6 fl oz",
        "c": 7.16
      }
    ]
  },
  {
    "i": 1496,
    "n": "Beverages, coffee, instant, decaffeinated, powder",
    "ms": [
      {
        "s": "1 tsp rounded",
        "c": 2.52
      }
    ]
  },
  {
    "i": 1497,
    "n": "Beverages, coffee, instant, mocha, sweetened",
    "ms": [
      {
        "s": "1 serving 2 tbsp",
        "c": 35.2
      }
    ]
  },
  {
    "i": 1498,
    "n": "Beverages, coffee, instant, regular, half the caffeine",
    "ms": [
      {
        "s": "1 tsp",
        "c": 1.41
      },
      {
        "s": "1 packet",
        "c": 2.82
      }
    ]
  },
  {
    "i": 1500,
    "n": "Beverages, tea, green, ready-to-drink, sweetened",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.7
      }
    ]
  },
  {
    "i": 1501,
    "n": "Beverages, aloe vera juice drink, fortified with Vitamin C",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 19.2
      }
    ]
  },
  {
    "i": 1502,
    "n": "Beverages, tea, ready-to-drink, lemon, diet",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "16 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 1503,
    "n": "Beverages, coffee and cocoa, instant, decaffeinated, with whitener and low calorie sweetener",
    "ms": [
      {
        "s": "1 tsp dry",
        "c": 3.84
      }
    ]
  },
  {
    "i": 1504,
    "n": "Beverages, tea, Oolong, brewed",
    "ms": [
      {
        "s": "100 g",
        "c": 1
      }
    ]
  },
  {
    "i": 1506,
    "n": "Beverages, Cocoa mix, powder",
    "ms": [
      {
        "s": "1 serving (3 heaping tsp or 1 envelope)",
        "c": 37.2
      }
    ]
  },
  {
    "i": 1507,
    "n": "Beverages, coffee, ready to drink, iced, mocha, milk based",
    "ms": [
      {
        "s": "1 cup",
        "c": 138
      }
    ]
  },
  {
    "i": 1510,
    "n": "Beverages, tea, green, ready-to-drink, citrus, diet, fortified with vitamin C",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.65
      }
    ]
  },
  {
    "i": 1511,
    "n": "Beverages, chocolate syrup",
    "ms": [
      {
        "s": "1 serving 2 tbsp",
        "c": 5.46
      },
      {
        "s": "1 cup",
        "c": 42
      }
    ]
  },
  {
    "i": 1512,
    "n": "Beverages, Apple juice drink, light, fortified with vitamin C",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 7.2
      }
    ]
  },
  {
    "i": 1513,
    "n": "Alcoholic beverage, wine, table, white, Chardonnay",
    "ms": [
      {
        "s": "1 serving 5 fl oz",
        "c": 13.2
      },
      {
        "s": "1 fl oz",
        "c": 2.64
      }
    ]
  },
  {
    "i": 1514,
    "n": "Beverages, coconut milk, sweetened, fortified with calcium, vitamins A, B12, D2",
    "ms": [
      {
        "s": "1 cup",
        "c": 451
      }
    ]
  },
  {
    "i": 1516,
    "n": "Beverages, Kiwi Strawberry Juice Drink",
    "ms": [
      {
        "s": "16 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 1518,
    "n": "Beverages, Carob-flavor beverage mix, powder",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.84
      }
    ]
  },
  {
    "i": 1521,
    "n": "Beverages,  Energy drink, Citrus",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 19.2
      }
    ]
  },
  {
    "i": 1523,
    "n": "Rolls, dinner, sweet",
    "ms": [
      {
        "s": "1 roll",
        "c": 18.6
      },
      {
        "s": "1 slice",
        "c": 24.2
      }
    ]
  },
  {
    "i": 1524,
    "n": "Bread, gluten-free, white, made with potato extract, rice starch, and rice flour",
    "ms": [
      {
        "s": "1 slice",
        "c": 8.16
      }
    ]
  },
  {
    "i": 1525,
    "n": "Bread, gluten-free, white, made with tapioca starch and brown rice flour",
    "ms": [
      {
        "s": "1 slice",
        "c": 16.5
      }
    ]
  },
  {
    "i": 1526,
    "n": "Crackers, gluten-free, multi-seeded and multigrain",
    "ms": [
      {
        "s": "3 crackers",
        "c": 14.5
      }
    ]
  },
  {
    "i": 1527,
    "n": "Crackers, gluten-free, multigrain and vegetable, made with corn starch and white rice flour",
    "ms": [
      {
        "s": "3 crackers",
        "c": 3
      }
    ]
  },
  {
    "i": 1528,
    "n": "Bread, gluten-free, whole grain, made with tapioca starch and brown rice flour",
    "ms": [
      {
        "s": "1 slice",
        "c": 15
      }
    ]
  },
  {
    "i": 1529,
    "n": "Bread, gluten-free, white, made with rice flour, corn starch, and/or tapioca",
    "ms": [
      {
        "s": "1 slice",
        "c": 48.3
      }
    ]
  },
  {
    "i": 1530,
    "n": "Cookies, chocolate chip sandwich, with creme filling",
    "ms": [
      {
        "s": "1 cookie",
        "c": 0
      }
    ]
  },
  {
    "i": 1531,
    "n": "English muffins, whole grain white",
    "ms": [
      {
        "s": "1 muffin 1 serving",
        "c": 79.8
      }
    ]
  },
  {
    "i": 1532,
    "n": "Crackers, flavored, fish-shaped",
    "ms": [
      {
        "s": "10 goldfish",
        "c": 4.32
      }
    ]
  },
  {
    "i": 1533,
    "n": "Rolls, hamburger, whole grain white, calcium-fortified",
    "ms": [
      {
        "s": "1 piece roll",
        "c": 100
      }
    ]
  },
  {
    "i": 1534,
    "n": "Cookies, marshmallow, with rice cereal and chocolate chips",
    "ms": [
      {
        "s": "1 bar",
        "c": 0
      }
    ]
  },
  {
    "i": 1535,
    "n": "Cookies, chocolate, made with rice cereal",
    "ms": [
      {
        "s": "1 cookie",
        "c": 19.8
      }
    ]
  },
  {
    "i": 1536,
    "n": "Rolls, hamburger or hot dog, whole wheat",
    "ms": [
      {
        "s": "1 roll",
        "c": 111
      }
    ]
  },
  {
    "i": 1537,
    "n": "Rolls, hamburger or hot dog, wheat/cracked wheat",
    "ms": [
      {
        "s": "1 roll",
        "c": 100
      }
    ]
  },
  {
    "i": 1538,
    "n": "Bread, french or vienna, whole wheat",
    "ms": [
      {
        "s": "1 slice 1 serving",
        "c": 20.2
      }
    ]
  },
  {
    "i": 1539,
    "n": "Bagels, whole grain white",
    "ms": [
      {
        "s": "0.5 piece bagel 1 serving",
        "c": 40
      }
    ]
  },
  {
    "i": 1540,
    "n": "Cookies, sugar wafer, chocolate-covered",
    "ms": [
      {
        "s": "3 cookie",
        "c": 0
      }
    ]
  },
  {
    "i": 1541,
    "n": "Pancakes, plain, reduced fat",
    "ms": [
      {
        "s": "1 serving 3 pancakes",
        "c": 59.8
      }
    ]
  },
  {
    "i": 1542,
    "n": "Cookies, shortbread, reduced fat",
    "ms": [
      {
        "s": "1 cookie",
        "c": 1.53
      }
    ]
  },
  {
    "i": 1544,
    "n": "Crackers, cheese, whole grain",
    "ms": [
      {
        "s": "1 serving 55 pieces",
        "c": 39.7
      }
    ]
  },
  {
    "i": 1546,
    "n": "Cookies, graham crackers, plain or honey, lowfat",
    "ms": [
      {
        "s": "1 serving",
        "c": 150
      }
    ]
  },
  {
    "i": 1547,
    "n": "Cookie, butter or sugar, with chocolate icing or filling",
    "ms": [
      {
        "s": "3 cookies",
        "c": 5.89
      }
    ]
  },
  {
    "i": 1548,
    "n": "Bread, roll, Mexican, bollilo",
    "ms": [
      {
        "s": "1 piece",
        "c": 40.2
      }
    ]
  },
  {
    "i": 1549,
    "n": "Bread, naan, whole wheat, commercially prepared, refrigerated",
    "ms": [
      {
        "s": "1 piece",
        "c": 62.5
      }
    ]
  },
  {
    "i": 1550,
    "n": "Tortillas, ready-to-bake or -fry, whole wheat",
    "ms": [
      {
        "s": "1 tortilla 1 serving",
        "c": 100
      }
    ]
  },
  {
    "i": 1551,
    "n": "Cookie, chocolate, with icing or coating",
    "ms": [
      {
        "s": "4 cookies",
        "c": 4.8
      }
    ]
  },
  {
    "i": 1552,
    "n": "Soup, beef barley, ready to serve",
    "ms": [
      {
        "s": "1 can",
        "c": 58
      },
      {
        "s": "1 cup",
        "c": 22.9
      }
    ]
  },
  {
    "i": 1553,
    "n": "Sauce, enchilada, red, mild, ready to serve",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 3.92
      },
      {
        "s": "1 can",
        "c": 19.8
      },
      {
        "s": "1 cup",
        "c": 15.7
      }
    ]
  },
  {
    "i": 1555,
    "n": "Bread, chapati or roti, whole wheat, commercially prepared, frozen",
    "ms": [
      {
        "s": "1 piece",
        "c": 15.5
      }
    ]
  },
  {
    "i": 1556,
    "n": "Bread, paratha, whole wheat, commercially prepared, frozen",
    "ms": [
      {
        "s": "1 piece",
        "c": 19.8
      }
    ]
  },
  {
    "i": 1557,
    "n": "Sauce, peanut, made from peanut butter, water, soy sauce",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.96
      }
    ]
  },
  {
    "i": 1558,
    "n": "Dip, salsa con queso, cheese and salsa- medium",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 29.4
      },
      {
        "s": "0.5 cup",
        "c": 122
      }
    ]
  },
  {
    "i": 1559,
    "n": "Sauce, cocktail, ready-to-serve",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 15.6
      }
    ]
  },
  {
    "i": 1561,
    "n": "Soup, chunky vegetable, reduced sodium, canned, ready-to-serve",
    "ms": [
      {
        "s": "1 cup",
        "c": 60
      }
    ]
  },
  {
    "i": 1567,
    "n": "Sauce, sweet and sour, ready-to-serve",
    "ms": [
      {
        "s": "2 Tbsp",
        "c": 3.5
      }
    ]
  },
  {
    "i": 1571,
    "n": "Beef, top sirloin, steak, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 113
      },
      {
        "s": "4 oz",
        "c": 28.2
      }
    ]
  },
  {
    "i": 1572,
    "n": "Beef, round, bottom round, roast, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 21.5
      },
      {
        "s": "1 lb",
        "c": 86.2
      }
    ]
  },
  {
    "i": 1573,
    "n": "Beef, Brisket, Flat Half, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      },
      {
        "s": "1 lb",
        "c": 68
      }
    ]
  },
  {
    "i": 1574,
    "n": "Beef, chuck, arm pot roast, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      },
      {
        "s": "1 lb",
        "c": 68
      }
    ]
  },
  {
    "i": 1577,
    "n": "Beef, chuck, arm pot roast, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 72.6
      },
      {
        "s": "4 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 1578,
    "n": "Beef, Round, Eye Of Round, Roast, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 22.6
      },
      {
        "s": "1 lb",
        "c": 90.7
      }
    ]
  },
  {
    "i": 1581,
    "n": "Beef, Brisket, Flat Half, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 18.1
      },
      {
        "s": "1 lb",
        "c": 72.6
      }
    ]
  },
  {
    "i": 1582,
    "n": "Beef, round, bottom round, roast, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 90.7
      },
      {
        "s": "4 oz",
        "c": 22.6
      }
    ]
  },
  {
    "i": 1585,
    "n": "Beef, ground, 75% lean meat / 25% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 25.5
      }
    ]
  },
  {
    "i": 1587,
    "n": "Beef, short loin, top loin, steak, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 26
      },
      {
        "s": "1 lb",
        "c": 104
      }
    ]
  },
  {
    "i": 1588,
    "n": "Beef, ground, 75% lean meat / 25% fat, patty, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 27.2
      }
    ]
  },
  {
    "i": 1590,
    "n": "Beef, ground, 75% lean meat / 25% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 28.9
      }
    ]
  },
  {
    "i": 1591,
    "n": "Beef, ground, 75% lean meat / 25% fat, raw",
    "ms": [
      {
        "s": "1 serving (3 oz)",
        "c": 17.8
      },
      {
        "s": "4 oz",
        "c": 23.7
      }
    ]
  },
  {
    "i": 1592,
    "n": "Beef, ground, 85% lean meat / 15% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "3 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 1593,
    "n": "Beef, ground, 85% lean meat / 15% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 1594,
    "n": "Beef, ground, 80% lean meat / 20% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 20.3
      }
    ]
  },
  {
    "i": 1595,
    "n": "Beef, ground, 90% lean meat / 10% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 1596,
    "n": "Beef, ground, 85% lean meat / 15% fat, patty, cooked, pan-broiled",
    "ms": [
      {
        "s": "1 patty ( yield from 1/4 lb raw meat )",
        "c": 16.6
      },
      {
        "s": "3 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 1597,
    "n": "Beef, ground, 85% lean meat / 15% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "1 patty (yield from 1/4 lb raw meat)",
        "c": 13.9
      },
      {
        "s": "3 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 1598,
    "n": "Beef, ground, 90% lean meat / 10% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 1599,
    "n": "Beef, ground, 95% lean meat / 5% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 1600,
    "n": "Beef, loin, bottom sirloin butt, tri-tip steak, separable lean and fat, trimmed to 0 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "1 lb",
        "c": 54.4
      }
    ]
  },
  {
    "i": 1601,
    "n": "Beef, Chuck, Mock Tender Steak, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 lb",
        "c": 36.3
      }
    ]
  },
  {
    "i": 1602,
    "n": "Beef, ground, 95% lean meat / 5% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 1603,
    "n": "Beef, chuck, clod roast, separable lean and fat, trimmed to 0 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 lb",
        "c": 36.3
      }
    ]
  },
  {
    "i": 1604,
    "n": "Beef, Chuck, Clod Roast, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 lb",
        "c": 31.8
      }
    ]
  },
  {
    "i": 1605,
    "n": "Beef, Chuck, Top Blade, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 lb",
        "c": 31.8
      }
    ]
  },
  {
    "i": 1609,
    "n": "Beef, chuck, clod roast, separable lean only, trimmed to 1/4 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 lb",
        "c": 27.2
      }
    ]
  },
  {
    "i": 1612,
    "n": "Beef, composite of trimmed retail cuts, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 1613,
    "n": "Beef composite, separable lean only, trimmed to 1/8 fat, choice, cooked",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 1614,
    "n": "Beef, composite of trimmed retail cuts, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 20.3
      }
    ]
  },
  {
    "i": 1617,
    "n": "Beef, loin, top loin steak, boneless, lip-on, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      },
      {
        "s": "1 steak",
        "c": 45.3
      }
    ]
  },
  {
    "i": 1618,
    "n": "Beef, Loin, Top Loin Steak, Boneless, Lip-On, Separable Lean Only, Trimmed To 1/8 Fat, Choice, Raw*",
    "ms": [
      {
        "s": "1 steak",
        "c": 45.2
      },
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 1619,
    "n": "Beef, loin, top loin steak, boneless, lip-on, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 steak",
        "c": 42.6
      }
    ]
  },
  {
    "i": 1621,
    "n": "Beef, Loin, Tenderloin Roast, Separable Lean Only, Boneless, Trimmed To 0 Fat, Select, Cooked, Roasted*",
    "ms": [
      {
        "s": "1 roast",
        "c": 63.3
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 1625,
    "n": "Beef, loin, tenderloin roast, boneless, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 roast",
        "c": 81.2
      }
    ]
  },
  {
    "i": 1626,
    "n": "Beef, Loin, Tenderloin Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 roast",
        "c": 94.2
      }
    ]
  },
  {
    "i": 1628,
    "n": "Beef, Loin, Top Loin Steak, Boneless, Lip Off, Separable Lean*",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.2
      },
      {
        "s": "4 oz",
        "c": 17
      },
      {
        "s": "1 steak",
        "c": 39.9
      }
    ]
  },
  {
    "i": 1629,
    "n": "Beef, Round, Eye Of Round Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 roast",
        "c": 87.8
      }
    ]
  },
  {
    "i": 1636,
    "n": "Beef, Loin, Tenderloin Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 steak",
        "c": 24.1
      }
    ]
  },
  {
    "i": 1639,
    "n": "Beef, loin, tenderloin steak, boneless, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 23.8
      },
      {
        "s": "4 oz",
        "c": 15.8
      }
    ]
  },
  {
    "i": 1640,
    "n": "Beef, Round, Eye Of Round Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 steak",
        "c": 19.6
      }
    ]
  },
  {
    "i": 1641,
    "n": "Beef, loin, tenderloin steak, boneless, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 23.5
      },
      {
        "s": "4 oz",
        "c": 15.8
      }
    ]
  },
  {
    "i": 1642,
    "n": "Beef, loin, tenderloin roast, boneless, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 roast",
        "c": 90.2
      }
    ]
  },
  {
    "i": 1644,
    "n": "Beef, Round, Top Round Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 roast",
        "c": 100
      }
    ]
  },
  {
    "i": 1645,
    "n": "Beef, Round, Top Round Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 steak",
        "c": 44.7
      }
    ]
  },
  {
    "i": 1646,
    "n": "Beef, Round, Eye Of Round Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 steak",
        "c": 18.2
      }
    ]
  },
  {
    "i": 1647,
    "n": "Beef, round, eye of round steak, boneless separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 steak",
        "c": 17.3
      }
    ]
  },
  {
    "i": 1648,
    "n": "Beef, Australian, Imported, Grass-Fed, Rib, Ribeye Steak/Roast Lip-On, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 17.5
      }
    ]
  },
  {
    "i": 1649,
    "n": "Beef, Round, Top Round Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 steak",
        "c": 44.7
      }
    ]
  },
  {
    "i": 1651,
    "n": "Beef, Australian, imported, grass-fed, round, bottom round steak/roast, boneless, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 16.8
      }
    ]
  },
  {
    "i": 1652,
    "n": "Beef, Australian, imported, Wagyu, loin, top loin steak/roast, separable lean and fat, Aust. marble score 9, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 14.4
      },
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 1653,
    "n": "Beef, Australian, Imported, Wagyu, Loin, Top Loin Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 roast",
        "c": 13.9
      }
    ]
  },
  {
    "i": 1655,
    "n": "Beef, Australian, Imported, Wagyu, Loin, Tenderloin Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 steak",
        "c": 6.92
      }
    ]
  },
  {
    "i": 1656,
    "n": "Beef, Australian, Imported, Grass-Fed, Round, Top Round Cap-Off Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 38.2
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 1659,
    "n": "Beef, Australian, Imported, Grass-Fed, Loin, Tenderloin Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 steak",
        "c": 6
      }
    ]
  },
  {
    "i": 1660,
    "n": "Beef, Australian, imported, Wagyu, external fat, Aust. marble score 9, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 1661,
    "n": "Beef, Australian, imported, Wagyu, seam fat, Aust. marble score 9, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 2.26
      }
    ]
  },
  {
    "i": 1664,
    "n": "Currants, red and white, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 37
      }
    ]
  },
  {
    "i": 1667,
    "n": "Currants, european black, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 61.6
      }
    ]
  },
  {
    "i": 1669,
    "n": "Cherries, sweet, canned, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup, pitted",
        "c": 35
      }
    ]
  },
  {
    "i": 1670,
    "n": "Cherries, sour, red, raw",
    "ms": [
      {
        "s": "1 cup, with pits, yields",
        "c": 16.5
      },
      {
        "s": "1 cup, without pits",
        "c": 24.8
      }
    ]
  },
  {
    "i": 1677,
    "n": "Carissa, (natal-plum), raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 16.5
      },
      {
        "s": "1 fruit without skin and seeds",
        "c": 2.2
      }
    ]
  },
  {
    "i": 1680,
    "n": "Blackberry juice, canned",
    "ms": [
      {
        "s": "1 cup",
        "c": 30
      }
    ]
  },
  {
    "i": 1681,
    "n": "Cherimoya, raw",
    "ms": [
      {
        "s": "1 fruit without skin and seeds",
        "c": 23.5
      },
      {
        "s": "1 cup, pieces",
        "c": 16
      }
    ]
  },
  {
    "i": 1682,
    "n": "Blackberries, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 41.8
      }
    ]
  },
  {
    "i": 1683,
    "n": "Bananas, raw",
    "ms": [
      {
        "s": "1 cup, mashed",
        "c": 11.2
      },
      {
        "s": "1 medium (7 to 7-7/8 long)",
        "c": 5.9
      },
      {
        "s": "1 extra small (less than 6 long)",
        "c": 4.05
      },
      {
        "s": "1 small (6 to 6-7/8 long)",
        "c": 5.05
      },
      {
        "s": "1 cup, sliced",
        "c": 7.5
      },
      {
        "s": "1 large (8 to 8-7/8 long)",
        "c": 6.8
      },
      {
        "s": "1 extra large (9 or longer)",
        "c": 7.6
      },
      {
        "s": "1 NLEA serving",
        "c": 6.3
      }
    ]
  },
  {
    "i": 1684,
    "n": "Bananas, dehydrated, or banana powder",
    "ms": [
      {
        "s": "1 cup",
        "c": 22
      },
      {
        "s": "1 tbsp",
        "c": 1.36
      }
    ]
  },
  {
    "i": 1685,
    "n": "Apricots, dried, sulfured, stewed, without added sugar",
    "ms": [
      {
        "s": "1 cup, halves",
        "c": 47.5
      }
    ]
  },
  {
    "i": 1686,
    "n": "Apricots, dried, sulfured, stewed, with added sugar",
    "ms": [
      {
        "s": "1 cup, halves",
        "c": 40.5
      }
    ]
  },
  {
    "i": 1687,
    "n": "Apricots, dehydrated (low-moisture), sulfured, stewed",
    "ms": [
      {
        "s": "1 cup",
        "c": 59.8
      }
    ]
  },
  {
    "i": 1689,
    "n": "Apricots, dried, sulfured, uncooked",
    "ms": [
      {
        "s": "1 half",
        "c": 1.92
      },
      {
        "s": "1 cup, halves",
        "c": 71.5
      }
    ]
  },
  {
    "i": 1690,
    "n": "Apple juice, frozen concentrate, unsweetened, diluted with 3 volume water without added ascorbic acid",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.3
      },
      {
        "s": "1 fl oz",
        "c": 1.79
      }
    ]
  },
  {
    "i": 1693,
    "n": "Apricots, canned, juice pack, with skin, solids and liquids",
    "ms": [
      {
        "s": "1 apricot half with liquid",
        "c": 4.32
      },
      {
        "s": "1 cup, halves",
        "c": 29.3
      }
    ]
  },
  {
    "i": 1694,
    "n": "Apple juice, frozen concentrate, unsweetened, undiluted, without added ascorbic acid",
    "ms": [
      {
        "s": "1 can (6 fl oz)",
        "c": 42.2
      }
    ]
  },
  {
    "i": 1696,
    "n": "Apples, dehydrated (low moisture), sulfured, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 11.4
      }
    ]
  },
  {
    "i": 1697,
    "n": "Apples, raw, without skin, cooked, microwave",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 8.5
      }
    ]
  },
  {
    "i": 1698,
    "n": "Apple juice, canned or bottled, unsweetened, without added ascorbic acid",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.48
      },
      {
        "s": "1 drink box (8.45 fl oz)",
        "c": 21
      },
      {
        "s": "1 cup",
        "c": 19.8
      }
    ]
  },
  {
    "i": 1705,
    "n": "Apples, raw, without skin, cooked, boiled",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 8.55
      }
    ]
  },
  {
    "i": 1708,
    "n": "Cereals, oats, instant, fortified, maple and brown sugar, dry",
    "ms": [
      {
        "s": "1 packet",
        "c": 111
      }
    ]
  },
  {
    "i": 1710,
    "n": "Cereals ready-to-eat, wheat, puffed, fortified",
    "ms": [
      {
        "s": "1 cup",
        "c": 3.36
      },
      {
        "s": "0.5 oz",
        "c": 3.98
      }
    ]
  },
  {
    "i": 1712,
    "n": "Cereals, farina, enriched, cooked with water, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 226
      }
    ]
  },
  {
    "i": 1713,
    "n": "Cereals ready-to-eat, rice, puffed, fortified",
    "ms": [
      {
        "s": "1 cup",
        "c": 0.84
      },
      {
        "s": "0.5 oz",
        "c": 0.852
      }
    ]
  },
  {
    "i": 1716,
    "n": "Cereals, farina, unenriched, dry",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.53
      },
      {
        "s": "1 cup",
        "c": 24.6
      }
    ]
  },
  {
    "i": 1723,
    "n": "Cereals, oats, regular and quick, unenriched, cooked with water (includes boiling and microwaving), without salt",
    "ms": [
      {
        "s": "0.75 cup",
        "c": 15.8
      },
      {
        "s": "1 cup",
        "c": 21.1
      },
      {
        "s": "1 tbsp",
        "c": 1.31
      }
    ]
  },
  {
    "i": 1726,
    "n": "Cereals, oats, regular and quick, not fortified, dry",
    "ms": [
      {
        "s": "0.33 cup",
        "c": 14
      },
      {
        "s": "1 cup",
        "c": 42.1
      }
    ]
  },
  {
    "i": 1730,
    "n": "Cereals ready-to-eat, wheat germ, toasted, plain",
    "ms": [
      {
        "s": "1 cup",
        "c": 50.8
      },
      {
        "s": "1 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 1743,
    "n": "Sausage, pork, turkey, and beef, reduced sodium",
    "ms": [
      {
        "s": "3 oz",
        "c": 20.4
      },
      {
        "s": "1 serving",
        "c": 13.4
      }
    ]
  },
  {
    "i": 1745,
    "n": "Pork sausage, reduced sodium, cooked",
    "ms": [
      {
        "s": "3 oz",
        "c": 0
      }
    ]
  },
  {
    "i": 1747,
    "n": "Kielbasa, fully cooked, unheated",
    "ms": [
      {
        "s": "3 oz",
        "c": 20.4
      },
      {
        "s": "1 link",
        "c": 95
      }
    ]
  },
  {
    "i": 1748,
    "n": "Ham, smoked, extra lean, low sodium",
    "ms": [
      {
        "s": "100 g",
        "c": 5
      }
    ]
  },
  {
    "i": 1749,
    "n": "Sausage, chicken or turkey, Italian style,  lower sodium",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 1750,
    "n": "Kielbasa, fully cooked, pan-fried",
    "ms": [
      {
        "s": "1 link",
        "c": 148
      }
    ]
  },
  {
    "i": 1751,
    "n": "Pork sausage, link/patty, fully cooked, unheated",
    "ms": [
      {
        "s": "1 patty",
        "c": 5.92
      },
      {
        "s": "1 link",
        "c": 3.68
      }
    ]
  },
  {
    "i": 1752,
    "n": "Frankfurter, meat and poultry, unheated",
    "ms": [
      {
        "s": "1 frankfurter",
        "c": 54.1
      }
    ]
  },
  {
    "i": 1754,
    "n": "Chicken breast, deli, rotisserie seasoned, sliced, prepackaged",
    "ms": [
      {
        "s": "1 slice",
        "c": 1.32
      }
    ]
  },
  {
    "i": 1756,
    "n": "Liver cheese, pork",
    "ms": [
      {
        "s": "1 slice",
        "c": 3.04
      },
      {
        "s": "1 oz",
        "c": 2.27
      }
    ]
  },
  {
    "i": 1757,
    "n": "Bologna, chicken, pork, beef",
    "ms": [
      {
        "s": "1 serving",
        "c": 25.8
      },
      {
        "s": "1 slice",
        "c": 25.8
      }
    ]
  },
  {
    "i": 1758,
    "n": "Bologna, chicken, pork",
    "ms": [
      {
        "s": "1 serving",
        "c": 54.9
      },
      {
        "s": "1 slice",
        "c": 54.9
      }
    ]
  },
  {
    "i": 1759,
    "n": "Liver sausage, liverwurst, pork",
    "ms": [
      {
        "s": "1 slice (2-1/2 dia x 1/4 thick)",
        "c": 4.68
      },
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 1761,
    "n": "Lebanon bologna, beef",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.67
      },
      {
        "s": "1 serving 2 slices",
        "c": 11.4
      },
      {
        "s": "2 oz",
        "c": 11.4
      }
    ]
  },
  {
    "i": 1762,
    "n": "Ham, minced",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "1 slice (4-1/4 x 4-1/4 x 1/16)",
        "c": 2.1
      }
    ]
  },
  {
    "i": 1763,
    "n": "Ham salad spread",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.2
      },
      {
        "s": "1 oz",
        "c": 2.27
      }
    ]
  },
  {
    "i": 1764,
    "n": "Ham, sliced, regular (approximately 11% fat)",
    "ms": [
      {
        "s": "56 grams 1 serving",
        "c": 13.4
      },
      {
        "s": "1 slice",
        "c": 6.72
      }
    ]
  },
  {
    "i": 1765,
    "n": "Knackwurst, knockwurst, pork, beef",
    "ms": [
      {
        "s": "1 link",
        "c": 7.92
      },
      {
        "s": "1 oz",
        "c": 3.12
      }
    ]
  },
  {
    "i": 1766,
    "n": "Frankfurter, beef, unheated",
    "ms": [
      {
        "s": "1 hot dog",
        "c": 6.86
      },
      {
        "s": "1 package",
        "c": 62.4
      }
    ]
  },
  {
    "i": 1767,
    "n": "Corned beef loaf, jellied",
    "ms": [
      {
        "s": "2 slices",
        "c": 6.27
      },
      {
        "s": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
        "c": 3.08
      }
    ]
  },
  {
    "i": 1768,
    "n": "Sausage, pork, chorizo, link or ground, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.39
      },
      {
        "s": "1 link (4 long)",
        "c": 11.4
      }
    ]
  },
  {
    "i": 1769,
    "n": "Chicken spread",
    "ms": [
      {
        "s": "1 serving (1 serving)",
        "c": 8.96
      }
    ]
  },
  {
    "i": 1770,
    "n": "Dutch brand loaf, chicken, pork and beef",
    "ms": [
      {
        "s": "1 slice",
        "c": 2.66
      }
    ]
  },
  {
    "i": 1774,
    "n": "Bologna, pork",
    "ms": [
      {
        "s": "1 slice, medium (4-1/2 dia x 1/8 thick) (1 oz)",
        "c": 3.08
      },
      {
        "s": "1 slice (4 dia x 1/8 thick)",
        "c": 2.53
      }
    ]
  },
  {
    "i": 1775,
    "n": "Bologna, turkey",
    "ms": [
      {
        "s": "0.99 oz 1 serving",
        "c": 34.4
      },
      {
        "s": "1 serving",
        "c": 34.4
      },
      {
        "s": "1 package",
        "c": 558
      }
    ]
  },
  {
    "i": 1777,
    "n": "Veal, Australian, rib, rib roast, separable lean and fat, raw",
    "ms": [
      {
        "s": "1 roast with bone",
        "c": 29.2
      },
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1782,
    "n": "Veal, Australian, separable fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 2.26
      }
    ]
  },
  {
    "i": 1785,
    "n": "Veal, Shoulder, Blade Chop, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 26
      },
      {
        "s": "1 oz",
        "c": 6.52
      },
      {
        "s": "1 chop",
        "c": 104
      }
    ]
  },
  {
    "i": 1791,
    "n": "Veal, cubed for stew (leg and shoulder), separable lean only, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.82
      },
      {
        "s": "1 lb",
        "c": 77.1
      }
    ]
  },
  {
    "i": 1817,
    "n": "Peanuts, Valencia, Oil-Roasted, With*",
    "ms": [
      {
        "s": "1 oz",
        "c": 15.3
      },
      {
        "s": "1 cup",
        "c": 77.8
      }
    ]
  },
  {
    "i": 1818,
    "n": "Lamb, New Zealand, imported, loin chop, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 20.3
      },
      {
        "s": "1 serving",
        "c": 20.7
      }
    ]
  },
  {
    "i": 1823,
    "n": "Peanuts, Spanish, Oil-Roasted, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 147
      },
      {
        "s": "1 oz",
        "c": 28.4
      }
    ]
  },
  {
    "i": 1824,
    "n": "Peanuts, All Types, Dry-Roasted, With*",
    "ms": [
      {
        "s": "1 peanut",
        "c": 0.58
      },
      {
        "s": "1 cup",
        "c": 84.7
      },
      {
        "s": "1 oz",
        "c": 16.4
      }
    ]
  },
  {
    "i": 1836,
    "n": "Beans, adzuki, mature seed, cooked, boiled, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 64.4
      }
    ]
  },
  {
    "i": 1849,
    "n": "Soymilk, original and vanilla, light, unsweetened, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 299
      }
    ]
  },
  {
    "i": 1859,
    "n": "Soymilk, chocolate and other flavors, light, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 299
      }
    ]
  },
  {
    "i": 1860,
    "n": "Soymilk (All flavors), lowfat, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 199
      }
    ]
  },
  {
    "i": 1865,
    "n": "Cowpeas, common (blackeyes, crowder, southern), mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 184
      },
      {
        "s": "1 tbsp",
        "c": 11.6
      }
    ]
  },
  {
    "i": 1868,
    "n": "Soymilk (All flavors), enhanced",
    "ms": [
      {
        "s": "1 cup",
        "c": 340
      }
    ]
  },
  {
    "i": 1870,
    "n": "Soymilk, original and vanilla, light, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 cup",
        "c": 299
      }
    ]
  },
  {
    "i": 1871,
    "n": "Carob flour",
    "ms": [
      {
        "s": "1 cup",
        "c": 358
      },
      {
        "s": "1 tbsp",
        "c": 20.9
      }
    ]
  },
  {
    "i": 1873,
    "n": "Chickpeas (garbanzo beans, bengal gram), mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 114
      },
      {
        "s": "1 tbsp",
        "c": 7.12
      }
    ]
  },
  {
    "i": 1878,
    "n": "Beans, yellow, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 325
      }
    ]
  },
  {
    "i": 1881,
    "n": "Beans, pink, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 273
      }
    ]
  },
  {
    "i": 1882,
    "n": "Beans, small white, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 372
      }
    ]
  },
  {
    "i": 1884,
    "n": "Beans, kidney, red, mature seeds, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 10.1
      },
      {
        "s": "1 cup",
        "c": 153
      }
    ]
  },
  {
    "i": 1885,
    "n": "Beans, navy, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 306
      }
    ]
  },
  {
    "i": 1887,
    "n": "Beans, kidney, california red, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 359
      }
    ]
  },
  {
    "i": 1889,
    "n": "Beans, black, mature seeds, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 14.9
      },
      {
        "s": "1 cup",
        "c": 239
      }
    ]
  },
  {
    "i": 1892,
    "n": "Beans, french, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 342
      }
    ]
  },
  {
    "i": 1897,
    "n": "Beans, adzuki, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 130
      }
    ]
  },
  {
    "i": 1905,
    "n": "Salmon nuggets, cooked as purchased, unheated",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 1907,
    "n": "Mollusks, conch, baked or broiled",
    "ms": [
      {
        "s": "1 oz cooked, yield",
        "c": 16.7
      },
      {
        "s": "1 cup, sliced",
        "c": 124
      }
    ]
  },
  {
    "i": 1909,
    "n": "Fish, catfish, channel, wild, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 fillet",
        "c": 15.7
      }
    ]
  },
  {
    "i": 1910,
    "n": "Fish, salmon, coho, farmed, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "1 fillet",
        "c": 17.2
      }
    ]
  },
  {
    "i": 1911,
    "n": "Fish, trout, rainbow, farmed, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 21.2
      },
      {
        "s": "1 fillet",
        "c": 19.8
      }
    ]
  },
  {
    "i": 1912,
    "n": "Fish, salmon, coho, farmed, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 19.1
      },
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1913,
    "n": "Fish, trout, rainbow, farmed, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 25.5
      },
      {
        "s": "1 fillet",
        "c": 21.3
      }
    ]
  },
  {
    "i": 1914,
    "n": "Fish, salmon, coho, wild, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 38.2
      },
      {
        "s": "0.5 fillet",
        "c": 80.1
      }
    ]
  },
  {
    "i": 1915,
    "n": "Fish, whitefish, mixed species, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 51.5
      },
      {
        "s": "3 oz",
        "c": 22.1
      }
    ]
  },
  {
    "i": 1916,
    "n": "Fish, turbot, european, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 15.3
      },
      {
        "s": "0.5 fillet",
        "c": 36.7
      }
    ]
  },
  {
    "i": 1917,
    "n": "Fish, whiting, mixed species, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 44.2
      },
      {
        "s": "3 oz",
        "c": 40.8
      }
    ]
  },
  {
    "i": 1919,
    "n": "Fish, whitefish, mixed species, smoked",
    "ms": [
      {
        "s": "1 cup, cooked",
        "c": 24.5
      },
      {
        "s": "1 oz, boneless",
        "c": 5.1
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 3.06
      },
      {
        "s": "3 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 1921,
    "n": "Fish, tuna, fresh, bluefin, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 1922,
    "n": "Fish, tuna, fresh, bluefin, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 1923,
    "n": "Fish, swordfish, raw",
    "ms": [
      {
        "s": "1 piece (4-1/2 x 2-1/8 x 7/8)",
        "c": 6.8
      },
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 1924,
    "n": "Fish, swordfish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 piece",
        "c": 6.36
      }
    ]
  },
  {
    "i": 1925,
    "n": "Fish, tilefish, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 22.1
      },
      {
        "s": "0.5 fillet",
        "c": 50.2
      }
    ]
  },
  {
    "i": 1926,
    "n": "Fish, snapper, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 27.2
      },
      {
        "s": "1 fillet",
        "c": 69.8
      }
    ]
  },
  {
    "i": 1927,
    "n": "Fish, spot, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 8.96
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 1928,
    "n": "Fish, sturgeon, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 1929,
    "n": "Fish, shark, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 28.9
      }
    ]
  },
  {
    "i": 1930,
    "n": "Fish, snapper, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 34
      },
      {
        "s": "1 fillet",
        "c": 68
      }
    ]
  },
  {
    "i": 1931,
    "n": "Fish, surimi",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 1933,
    "n": "Fish, seatrout, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      },
      {
        "s": "1 fillet",
        "c": 40.5
      }
    ]
  },
  {
    "i": 1934,
    "n": "Fish, sea bass, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 fillet",
        "c": 13.1
      }
    ]
  },
  {
    "i": 1935,
    "n": "Fish, salmon, sockeye, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 17
      },
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 1936,
    "n": "Fish, shad, american, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 86.5
      },
      {
        "s": "3 oz",
        "c": 40
      }
    ]
  },
  {
    "i": 1937,
    "n": "Fish, salmon, chinook, smoked",
    "ms": [
      {
        "s": "1 cup, cooked",
        "c": 15
      },
      {
        "s": "1 oz, boneless",
        "c": 3.12
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 1.87
      },
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 1938,
    "n": "Fish, salmon, chinook, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 22.1
      },
      {
        "s": "0.5 fillet",
        "c": 51.5
      }
    ]
  },
  {
    "i": 1939,
    "n": "Fish, salmon, chum, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "0.5 fillet",
        "c": 21.8
      }
    ]
  },
  {
    "i": 1941,
    "n": "Fish, salmon, sockeye, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "0.5 fillet",
        "c": 17.8
      },
      {
        "s": "1 oz, boneless",
        "c": 2.55
      }
    ]
  },
  {
    "i": 1942,
    "n": "Fish, pompano, florida, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 36.6
      },
      {
        "s": "1 fillet",
        "c": 37.8
      }
    ]
  },
  {
    "i": 1943,
    "n": "Fish, sablefish, smoked",
    "ms": [
      {
        "s": "3 oz",
        "c": 42.5
      },
      {
        "s": "1 oz",
        "c": 14.2
      }
    ]
  },
  {
    "i": 1944,
    "n": "Fish, salmon, Atlantic, wild, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 23.8
      },
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1945,
    "n": "Fish, pompano, florida, raw",
    "ms": [
      {
        "s": "1 oz, boneless",
        "c": 6.24
      },
      {
        "s": "1 fillet",
        "c": 24.6
      },
      {
        "s": "3 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 1946,
    "n": "Fish, rockfish, Pacific, mixed species, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 26.7
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 1947,
    "n": "Fish, pollock, Alaska, cooked, dry heat (may contain additives to retain moisture)",
    "ms": [
      {
        "s": "1 fillet",
        "c": 43.2
      },
      {
        "s": "3 oz",
        "c": 61.2
      }
    ]
  },
  {
    "i": 1948,
    "n": "Fish, milkfish, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 43.4
      }
    ]
  },
  {
    "i": 1949,
    "n": "Fish, monkfish, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 1950,
    "n": "Fish, perch, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 46.9
      },
      {
        "s": "3 oz",
        "c": 86.7
      }
    ]
  },
  {
    "i": 1951,
    "n": "Fish, pike, northern, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 113
      },
      {
        "s": "3 oz",
        "c": 48.4
      }
    ]
  },
  {
    "i": 1952,
    "n": "Fish, pout, ocean, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      },
      {
        "s": "0.5 fillet",
        "c": 17.6
      }
    ]
  },
  {
    "i": 1953,
    "n": "Fish, mackerel, spanish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 fillet",
        "c": 19
      }
    ]
  },
  {
    "i": 1954,
    "n": "Fish, perch, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 68
      },
      {
        "s": "1 fillet",
        "c": 48
      }
    ]
  },
  {
    "i": 1955,
    "n": "Fish, lingcod, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "0.5 fillet",
        "c": 27
      }
    ]
  },
  {
    "i": 1956,
    "n": "Fish, herring, Pacific, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 153
      },
      {
        "s": "3 oz",
        "c": 70.6
      }
    ]
  },
  {
    "i": 1957,
    "n": "Fish, mackerel, spanish, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 fillet",
        "c": 20.6
      }
    ]
  },
  {
    "i": 1958,
    "n": "Fish, mackerel, Pacific and jack, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 19.6
      },
      {
        "s": "1 fillet",
        "c": 51.8
      }
    ]
  },
  {
    "i": 1959,
    "n": "Fish, herring, Atlantic, kippered",
    "ms": [
      {
        "s": "1 fillet, medium (5 x 1-3/4 x 1/4)",
        "c": 33.6
      },
      {
        "s": "1 fillet, small (2-3/8 x 1-3/8 x 1/4)",
        "c": 16.8
      },
      {
        "s": "1 fillet, large (7 x 2-1/4 x 1/4)",
        "c": 54.6
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 14.3
      },
      {
        "s": "1 oz, boneless",
        "c": 23.8
      }
    ]
  },
  {
    "i": 1960,
    "n": "Fish, ling, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 65.6
      },
      {
        "s": "3 oz",
        "c": 28.9
      }
    ]
  },
  {
    "i": 1964,
    "n": "Whiskey sour mix, bottled, with added potassium and sodium",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.646
      }
    ]
  },
  {
    "i": 1973,
    "n": "Beverages, Dairy drink mix, chocolate, reduced calorie, with low-calorie sweeteners, powder",
    "ms": [
      {
        "s": "1 envelope",
        "c": 297
      },
      {
        "s": "1 packet (.75 oz)",
        "c": 297
      }
    ]
  },
  {
    "i": 1976,
    "n": "Cranberry juice cocktail, frozen concentrate, prepared with water",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 11.8
      },
      {
        "s": "1 fl oz",
        "c": 1.48
      }
    ]
  },
  {
    "i": 1978,
    "n": "Cranberry juice cocktail, frozen concentrate",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.98
      },
      {
        "s": "1 can (12 fl oz)",
        "c": 47.8
      }
    ]
  },
  {
    "i": 1981,
    "n": "Chicken, stewing, light meat, meat only, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 9.79
      },
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 14.3
      }
    ]
  },
  {
    "i": 1982,
    "n": "Beverages, water, tap, drinking",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.888
      },
      {
        "s": "1 serving 8 fl oz",
        "c": 7.11
      },
      {
        "s": "1 liter",
        "c": 30
      }
    ]
  },
  {
    "i": 1983,
    "n": "Chicken, capons, meat and skin, raw",
    "ms": [
      {
        "s": "0.5 capon, bone removed",
        "c": 106
      },
      {
        "s": "1 unit (yield from 1 lb ready-to cook capon)",
        "c": 32.7
      },
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 1985,
    "n": "Chicken, stewing, light meat, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 8.96
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 19.6
      }
    ]
  },
  {
    "i": 1986,
    "n": "Chicken, roasting, meat only, raw",
    "ms": [
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 47.7
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 20.9
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 1987,
    "n": "Chicken, stewing, meat and skin, and giblets and neck, raw",
    "ms": [
      {
        "s": "1 chicken",
        "c": 90.5
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 1988,
    "n": "Chicken, stewing, giblets, cooked, simmered",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 18.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.21
      }
    ]
  },
  {
    "i": 1989,
    "n": "Chicken, stewing, giblets, raw",
    "ms": [
      {
        "s": "1 giblets",
        "c": 8.1
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.8
      }
    ]
  },
  {
    "i": 1991,
    "n": "Chicken, roasting, dark meat, meat only, raw",
    "ms": [
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 23.2
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 10.2
      }
    ]
  },
  {
    "i": 1993,
    "n": "Chicken, broilers or fryers, wing, meat only, raw",
    "ms": [
      {
        "s": "1 wing, bone and skin removed (yield from 1 lb ready-to-cook chicken)",
        "c": 2.21
      },
      {
        "s": "1 wing, bone and skin removed",
        "c": 3.77
      }
    ]
  },
  {
    "i": 1994,
    "n": "Canada Goose, breast meat only, skinless, raw",
    "ms": [
      {
        "s": "1 breast",
        "c": 25.4
      },
      {
        "s": "3 oz",
        "c": 3.4
      },
      {
        "s": "1 bird",
        "c": 176
      }
    ]
  },
  {
    "i": 1996,
    "n": "Chicken, roasting, meat and skin, cooked, roasted",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 25.2
      },
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 57.6
      }
    ]
  },
  {
    "i": 1997,
    "n": "Chicken, broilers or fryers, wing, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.88
      },
      {
        "s": "1 wing, bone removed",
        "c": 4.8
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 16.8
      }
    ]
  },
  {
    "i": 1998,
    "n": "Chicken, broilers or fryers, thigh, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 4.51
      },
      {
        "s": "1 thigh, bone removed",
        "c": 7.48
      }
    ]
  },
  {
    "i": 2000,
    "n": "Chicken, broilers or fryers, wing, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.85
      },
      {
        "s": "1 wing, bone removed",
        "c": 4.8
      }
    ]
  },
  {
    "i": 2001,
    "n": "Chicken, broilers or fryers, dark meat, thigh, meat only, raw",
    "ms": [
      {
        "s": "1 thigh without skin",
        "c": 10.4
      },
      {
        "s": "4 oz",
        "c": 7.91
      }
    ]
  },
  {
    "i": 2002,
    "n": "Chicken, broilers or fryers, wing, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "1 wing, bone removed",
        "c": 9.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 5.8
      }
    ]
  },
  {
    "i": 2004,
    "n": "Chicken, broilers or fryers, neck, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 3.41
      },
      {
        "s": "1 neck, bone removed",
        "c": 11.2
      }
    ]
  },
  {
    "i": 2005,
    "n": "Chicken, broilers or fryers, neck, meat only, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 1.62
      },
      {
        "s": "1 neck, bone and skin removed",
        "c": 5.4
      }
    ]
  },
  {
    "i": 2006,
    "n": "Chicken, broilers or fryers, neck, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "1 neck, bone removed",
        "c": 16.1
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 4.96
      }
    ]
  },
  {
    "i": 2007,
    "n": "Chicken, broilers or fryers, neck, meat and skin, cooked simmered",
    "ms": [
      {
        "s": "1 neck, bone removed",
        "c": 10.3
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.97
      }
    ]
  },
  {
    "i": 2008,
    "n": "Chicken, broilers or fryers, thigh, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 thigh, bone removed",
        "c": 8.68
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 5.32
      }
    ]
  },
  {
    "i": 2009,
    "n": "Chicken, broilers or fryers, leg, meat only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 back bone and skin removed",
        "c": 3
      },
      {
        "s": "1 leg, bone and skin removed (Sum of drumstick+thigh+back meat only)",
        "c": 26.5
      },
      {
        "s": "1 thigh bone and skin removed",
        "c": 14.7
      },
      {
        "s": "1 drumstick bone and skin removed",
        "c": 8.8
      }
    ]
  },
  {
    "i": 2010,
    "n": "Chicken, broilers or fryers, leg, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 8.71
      },
      {
        "s": "1 leg, bone removed",
        "c": 14.6
      }
    ]
  },
  {
    "i": 2011,
    "n": "Chicken, broilers or fryers, dark meat, drumstick, meat only, raw",
    "ms": [
      {
        "s": "1 drumstick  with skin",
        "c": 11.7
      },
      {
        "s": "1 drumstick without skin",
        "c": 11
      },
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 2013,
    "n": "Chicken, broilers or fryers, leg, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "1 leg, bone removed",
        "c": 28.4
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 17.1
      }
    ]
  },
  {
    "i": 2014,
    "n": "Chicken, broilers or fryers, leg, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 15.4
      },
      {
        "s": "1 leg, bone removed",
        "c": 13.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 8.25
      }
    ]
  },
  {
    "i": 2015,
    "n": "Shortening, industrial, soy (partially hydrogenated ) for baking and confections",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2016,
    "n": "Chicken, broilers or fryers, drumstick, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 3.48
      },
      {
        "s": "1 drumstick, bone removed",
        "c": 5.88
      }
    ]
  },
  {
    "i": 2018,
    "n": "Chicken, broilers or fryers, drumstick, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 15.4
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 3.74
      },
      {
        "s": "1 drumstick, bone removed",
        "c": 6.27
      }
    ]
  },
  {
    "i": 2019,
    "n": "Oil, industrial, palm kernel (hydrogenated), confection fat, uses similar to 95 degree hard butter",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.136
      },
      {
        "s": "1 tsp",
        "c": 0.045
      },
      {
        "s": "1 cup",
        "c": 2.18
      }
    ]
  },
  {
    "i": 2020,
    "n": "Oil, industrial, palm kernel (hydrogenated), confection fat, intermediate grade product",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.045
      },
      {
        "s": "1 tbsp",
        "c": 0.136
      },
      {
        "s": "1 cup",
        "c": 2.18
      }
    ]
  },
  {
    "i": 2021,
    "n": "Margarine, industrial, non-dairy, cottonseed, soy oil (partially hydrogenated ), for flaky pastries",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 9.24
      }
    ]
  },
  {
    "i": 2022,
    "n": "Shortening, industrial, soy (partially hydrogenated ) and corn for frying",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2023,
    "n": "Oil, industrial, soy (partially hydrogenated ), palm, principal uses icings and fillings",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2024,
    "n": "Oil, industrial, palm kernel (hydrogenated), filling fat",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.272
      },
      {
        "s": "1 cup",
        "c": 4.36
      },
      {
        "s": "1 tsp",
        "c": 0.09
      }
    ]
  },
  {
    "i": 2025,
    "n": "Oil, industrial, palm kernel, confection fat, uses similar to high quality cocoa butter",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.136
      },
      {
        "s": "1 tsp",
        "c": 0.045
      },
      {
        "s": "1 cup",
        "c": 2.18
      }
    ]
  },
  {
    "i": 2026,
    "n": "Shortening, industrial, soy (partially hydrogenated), pourable liquid fry shortening",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2027,
    "n": "Oil, industrial, soy, refined, for woks and light frying",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2028,
    "n": "Margarine-like shortening, industrial, soy (partially hydrogenated), cottonseed, and soy, principal use flaky pastries",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2029,
    "n": "Salad dressing, mayonnaise, light",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0.9
      }
    ]
  },
  {
    "i": 2030,
    "n": "Salad dressing, ranch dressing, reduced fat",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 6
      },
      {
        "s": "1 serving (2 tbsp)",
        "c": 12
      }
    ]
  },
  {
    "i": 2031,
    "n": "Salad dressing, ranch dressing, regular",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 4.2
      },
      {
        "s": "1 serving",
        "c": 8.4
      }
    ]
  },
  {
    "i": 2032,
    "n": "Oil, industrial, coconut, principal uses candy coatings, oil sprays, roasting nuts",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2033,
    "n": "Oil, industrial, soy (partially hydrogenated), principal uses popcorn and flavoring vegetables",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2034,
    "n": "Margarine, margarine-type vegetable oil spread, 70% fat, soybean and partially hydrogenated soybean, stick",
    "ms": [
      {
        "s": "1 tbsp (1 NLEA serving)",
        "c": 0.98
      }
    ]
  },
  {
    "i": 2035,
    "n": "Salad dressing, italian dressing, fat-free",
    "ms": [
      {
        "s": "1 cup",
        "c": 69.3
      },
      {
        "s": "1 tbsp",
        "c": 4.2
      }
    ]
  },
  {
    "i": 2036,
    "n": "Salad dressing, ranch dressing, fat-free",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 7
      }
    ]
  },
  {
    "i": 2037,
    "n": "Margarine, 80% fat, stick, includes regular and hydrogenated corn and soybean oils",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.42
      }
    ]
  },
  {
    "i": 2038,
    "n": "Margarine Spread, 40-49% fat, tub",
    "ms": [
      {
        "s": "100 g",
        "c": 2
      }
    ]
  },
  {
    "i": 2039,
    "n": "Margarine-like spread with yogurt, approximately 40% fat, tub, with salt",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 7
      }
    ]
  },
  {
    "i": 2040,
    "n": "Margarine-like, vegetable oil spread, 60% fat, tub, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 48.1
      },
      {
        "s": "1 tsp",
        "c": 1.01
      },
      {
        "s": "1 tbsp",
        "c": 2.94
      }
    ]
  },
  {
    "i": 2042,
    "n": "Margarine, Regular, 80% Fat, Composite, Stick, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 6.81
      },
      {
        "s": "1 pat (1 sq, 1/3 high)",
        "c": 0.15
      },
      {
        "s": "1 stick",
        "c": 3.39
      },
      {
        "s": "1 tbsp",
        "c": 0.426
      }
    ]
  },
  {
    "i": 2044,
    "n": "Margarine-like, vegetable oil-butter spread, tub, with salt",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 3.36
      }
    ]
  },
  {
    "i": 2045,
    "n": "Shortening, vegetable, household, composite",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.05
      },
      {
        "s": "1 tbsp",
        "c": 0.128
      }
    ]
  },
  {
    "i": 2046,
    "n": "Fish oil, sardine",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2047,
    "n": "Shortening, multipurpose, soybean (hydrogenated) and palm (hydrogenated)",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2048,
    "n": "Shortening, special purpose for cakes and frostings, soybean (hydrogenated)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2049,
    "n": "Fish oil, cod liver",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2050,
    "n": "Fat, goose",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2051,
    "n": "Oil, oat",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2052,
    "n": "Fat, turkey",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2053,
    "n": "Oil, avocado",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2054,
    "n": "Shortening, special purpose for baking, soybean (hydrogenated) palm and cottonseed",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2055,
    "n": "Shortening industrial, lard and vegetable oil",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2056,
    "n": "Shortening industrial, soybean (hydrogenated) and cottonseed",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2057,
    "n": "Shortening confectionery, coconut (hydrogenated) and or palm kernel (hydrogenated)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2058,
    "n": "Shortening frying (heavy duty), beef tallow and cottonseed",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2059,
    "n": "Oil, ucuhuba butter",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2060,
    "n": "Fat, chicken",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2061,
    "n": "Salad dressing, blue or roquefort cheese dressing, commercial, regular",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 5.55
      },
      {
        "s": "1 cup",
        "c": 90.6
      }
    ]
  },
  {
    "i": 2064,
    "n": "Oil, soybean, salad or cooking, (partially hydrogenated) and cottonseed",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 2065,
    "n": "Oil, cupu assu",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 2149,
    "n": "Rosemary, fresh",
    "ms": [
      {
        "s": "1 tsp",
        "c": 2.22
      },
      {
        "s": "1 tbsp",
        "c": 5.39
      }
    ]
  },
  {
    "i": 2150,
    "n": "Peppermint, fresh",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 7.78
      },
      {
        "s": "2 leaves",
        "c": 0.243
      }
    ]
  },
  {
    "i": 2151,
    "n": "Seasoning mix, dry, chili, original",
    "ms": [
      {
        "s": "1.33 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 2152,
    "n": "Spearmint, fresh",
    "ms": [
      {
        "s": "2 leaves",
        "c": 0.597
      },
      {
        "s": "2 tbsp",
        "c": 22.7
      }
    ]
  },
  {
    "i": 2154,
    "n": "Fat free ice cream, no sugar added, flavors other than chocolate",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 100
      }
    ]
  },
  {
    "i": 2155,
    "n": "Ice cream, bar or stick, chocolate covered",
    "ms": [
      {
        "s": "1 bar",
        "c": 59.5
      }
    ]
  },
  {
    "i": 2156,
    "n": "Vanilla extract",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.43
      },
      {
        "s": "1 cup",
        "c": 22.9
      },
      {
        "s": "1 tsp",
        "c": 0.462
      }
    ]
  },
  {
    "i": 2157,
    "n": "Thyme, fresh",
    "ms": [
      {
        "s": "0.5 tsp",
        "c": 1.62
      },
      {
        "s": "1 tsp",
        "c": 3.24
      }
    ]
  },
  {
    "i": 2158,
    "n": "Salt, table",
    "ms": [
      {
        "s": "1 dash",
        "c": 0.096
      },
      {
        "s": "1 tbsp",
        "c": 4.32
      },
      {
        "s": "1 tsp",
        "c": 1.44
      },
      {
        "s": "1 cup",
        "c": 70.1
      }
    ]
  },
  {
    "i": 2159,
    "n": "Vinegar, cider",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.7
      },
      {
        "s": "1 tbsp",
        "c": 1.04
      },
      {
        "s": "1 tsp",
        "c": 0.35
      }
    ]
  },
  {
    "i": 2160,
    "n": "Ice cream, soft serve, chocolate",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 113
      }
    ]
  },
  {
    "i": 2161,
    "n": "Yogurt, vanilla flavor, lowfat milk, sweetened with low calorie sweetener",
    "ms": [
      {
        "s": "1 container",
        "c": 291
      }
    ]
  },
  {
    "i": 2162,
    "n": "Dulce de Leche",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 47.7
      }
    ]
  },
  {
    "i": 2163,
    "n": "Yogurt, frozen, flavors not chocolate, nonfat milk, with low-calorie sweetener",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 108
      }
    ]
  },
  {
    "i": 2164,
    "n": "Protein supplement, milk based, Muscle Milk Light, powder",
    "ms": [
      {
        "s": "2 scoop",
        "c": 600
      }
    ]
  },
  {
    "i": 2165,
    "n": "Egg substitute, liquid or frozen, fat free",
    "ms": [
      {
        "s": "1 cup",
        "c": 175
      },
      {
        "s": "0.25 cup",
        "c": 43.8
      }
    ]
  },
  {
    "i": 2166,
    "n": "Cheese product, pasteurized process, American, reduced fat, fortified with vitamin D",
    "ms": [
      {
        "s": "1 slice 2/3 oz",
        "c": 101
      },
      {
        "s": "1 slice 3/4 oz",
        "c": 111
      }
    ]
  },
  {
    "i": 2167,
    "n": "Cream substitute, flavored, liquid",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.9
      }
    ]
  },
  {
    "i": 2168,
    "n": "Protein supplement, milk based, Muscle Milk, powder",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 55
      }
    ]
  },
  {
    "i": 2169,
    "n": "Yogurt, fruit variety, nonfat, fortified with vitamin D",
    "ms": [
      {
        "s": "1 container (8 oz)",
        "c": 345
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 372
      },
      {
        "s": "1 container (6 oz)",
        "c": 258
      },
      {
        "s": "1 container (4.4 oz)",
        "c": 190
      }
    ]
  },
  {
    "i": 2170,
    "n": "Yogurt, fruit, low fat, 10 grams protein per 8 ounce, fortified with vitamin D",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 372
      },
      {
        "s": "1 container (6 oz)",
        "c": 258
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 172
      },
      {
        "s": "1 container, Dannon Sprinkl'ins (4.1 oz)",
        "c": 176
      },
      {
        "s": "1 container (8 oz)",
        "c": 345
      }
    ]
  },
  {
    "i": 2171,
    "n": "Yogurt, fruit, low fat, 9 grams protein per 8 ounce, fortified with vitamin D",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 235
      },
      {
        "s": "1 container (8 oz)",
        "c": 313
      },
      {
        "s": "1 container (4.4 oz)",
        "c": 172
      },
      {
        "s": "1 container (5 oz)",
        "c": 196
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 338
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 156
      }
    ]
  },
  {
    "i": 2172,
    "n": "Milk, dry, whole, without added vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 1170
      },
      {
        "s": "0.25 cup",
        "c": 292
      }
    ]
  },
  {
    "i": 2173,
    "n": "Yogurt, vanilla or lemon flavor, nonfat milk, sweetened with low-calorie sweetener",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 243
      }
    ]
  },
  {
    "i": 2176,
    "n": "Cheese, parmesan, dry grated, reduced fat",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 55.4
      },
      {
        "s": "1 cup",
        "c": 1110
      },
      {
        "s": "1 oz",
        "c": 314
      }
    ]
  },
  {
    "i": 2178,
    "n": "Milk, chocolate, fluid, commercial, reduced fat, with added calcium",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 60.5
      },
      {
        "s": "1 cup",
        "c": 485
      },
      {
        "s": "1 quart",
        "c": 1940
      }
    ]
  },
  {
    "i": 2180,
    "n": "Yogurt, fruit, lowfat, with low calorie sweetener",
    "ms": [
      {
        "s": "1 container (8 oz)",
        "c": 345
      },
      {
        "s": "1 container (6 oz)",
        "c": 258
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 372
      }
    ]
  },
  {
    "i": 2181,
    "n": "Milk, fluid, 1% fat, without added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 305
      },
      {
        "s": "1 quart",
        "c": 1220
      }
    ]
  },
  {
    "i": 2182,
    "n": "Cheese, low fat, cheddar or colby",
    "ms": [
      {
        "s": "1 oz",
        "c": 118
      },
      {
        "s": "1 slice (1 oz)",
        "c": 116
      },
      {
        "s": "1 cup, diced",
        "c": 548
      },
      {
        "s": "1 cup, shredded",
        "c": 469
      },
      {
        "s": "1 cubic inch",
        "c": 70.6
      }
    ]
  },
  {
    "i": 2183,
    "n": "Sour cream, reduced fat",
    "ms": [
      {
        "s": "1 cup",
        "c": 324
      },
      {
        "s": "1 tablespoon",
        "c": 16.9
      }
    ]
  },
  {
    "i": 2184,
    "n": "Sour cream, light",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 16.9
      },
      {
        "s": "1 cup",
        "c": 324
      }
    ]
  },
  {
    "i": 2185,
    "n": "Cheese, low-sodium, cheddar or colby",
    "ms": [
      {
        "s": "1 oz",
        "c": 199
      },
      {
        "s": "1 cup, shredded",
        "c": 794
      },
      {
        "s": "1 slice (1 oz)",
        "c": 197
      },
      {
        "s": "1 cup, diced",
        "c": 928
      },
      {
        "s": "1 cubic inch",
        "c": 120
      }
    ]
  },
  {
    "i": 2187,
    "n": "Cheese, mexican, queso chihuahua",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 736
      },
      {
        "s": "1 oz",
        "c": 185
      },
      {
        "s": "1 cubic inch",
        "c": 111
      },
      {
        "s": "1 slice (1 oz)",
        "c": 182
      },
      {
        "s": "1 cup, diced",
        "c": 859
      }
    ]
  },
  {
    "i": 2188,
    "n": "Cheese, goat, soft type",
    "ms": [
      {
        "s": "1 oz",
        "c": 39.7
      }
    ]
  },
  {
    "i": 2189,
    "n": "Cheese, goat, semisoft type",
    "ms": [
      {
        "s": "1 oz",
        "c": 84.5
      }
    ]
  },
  {
    "i": 2190,
    "n": "Egg, yolk, raw, frozen, salted, pasteurized",
    "ms": [
      {
        "s": "0.5 lb",
        "c": 257
      },
      {
        "s": "1 oz",
        "c": 32
      }
    ]
  },
  {
    "i": 2191,
    "n": "Cheese, mexican, queso asadero",
    "ms": [
      {
        "s": "1 slice (1 oz)",
        "c": 185
      },
      {
        "s": "1 cup, shredded",
        "c": 747
      },
      {
        "s": "1 cup, diced",
        "c": 873
      },
      {
        "s": "1 oz",
        "c": 187
      },
      {
        "s": "1 cubic inch",
        "c": 119
      }
    ]
  },
  {
    "i": 2193,
    "n": "Butter*",
    "ms": [
      {
        "s": "1 cup",
        "c": 54.5
      },
      {
        "s": "1 stick",
        "c": 27.1
      },
      {
        "s": "1 tbsp",
        "c": 3.41
      },
      {
        "s": "1 pat (1 sq, 1/3 high)",
        "c": 1.2
      }
    ]
  },
  {
    "i": 2194,
    "n": "Egg substitute, powder",
    "ms": [
      {
        "s": "0.35 oz",
        "c": 32.3
      },
      {
        "s": "0.7 oz",
        "c": 65.2
      }
    ]
  },
  {
    "i": 2195,
    "n": "Milk, nonfat, fluid, without added vitamin A and vitamin D (fat free or skim)",
    "ms": [
      {
        "s": "1 cup",
        "c": 299
      },
      {
        "s": "1 quart",
        "c": 1200
      }
    ]
  },
  {
    "i": 2196,
    "n": "Cheese, parmesan, shredded",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 62.6
      }
    ]
  },
  {
    "i": 2197,
    "n": "Egg, yolk, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 11.6
      },
      {
        "s": "1 cup, sifted",
        "c": 194
      }
    ]
  },
  {
    "i": 2198,
    "n": "Egg, whole, cooked, fried",
    "ms": [
      {
        "s": "1 large",
        "c": 28.5
      }
    ]
  },
  {
    "i": 2199,
    "n": "Egg, whole, cooked, hard-boiled",
    "ms": [
      {
        "s": "1 large",
        "c": 25
      },
      {
        "s": "1 cup, chopped",
        "c": 68
      },
      {
        "s": "1 tbsp",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2200,
    "n": "Egg, white, dried, flakes, stabilized, glucose reduced",
    "ms": [
      {
        "s": "1 oz",
        "c": 23.5
      },
      {
        "s": "0.5 lb",
        "c": 188
      }
    ]
  },
  {
    "i": 2201,
    "n": "Egg, yolk, raw, frozen, sugared, pasteurized",
    "ms": [
      {
        "s": "0.5 lb",
        "c": 281
      },
      {
        "s": "1 oz",
        "c": 35.2
      }
    ]
  },
  {
    "i": 2202,
    "n": "Egg, white, dried, powder, stabilized, glucose reduced",
    "ms": [
      {
        "s": "1 cup, sifted",
        "c": 95.2
      },
      {
        "s": "1 tbsp",
        "c": 6.23
      }
    ]
  },
  {
    "i": 2203,
    "n": "Egg, whole, dried, stabilized, glucose reduced",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 11.1
      },
      {
        "s": "1 cup, sifted",
        "c": 189
      }
    ]
  },
  {
    "i": 2204,
    "n": "Cheese, cream",
    "ms": [
      {
        "s": "1 oz",
        "c": 27.5
      },
      {
        "s": "1 tbsp",
        "c": 14.1
      },
      {
        "s": "1 package, small (3 oz)",
        "c": 82.4
      },
      {
        "s": "1 tbsp, whipped",
        "c": 9.7
      },
      {
        "s": "1 cup",
        "c": 225
      },
      {
        "s": "1 cubic inch",
        "c": 15.5
      }
    ]
  },
  {
    "i": 2206,
    "n": "Cheese, edam",
    "ms": [
      {
        "s": "1 package (7 oz)",
        "c": 1450
      },
      {
        "s": "1 oz",
        "c": 207
      }
    ]
  },
  {
    "i": 2207,
    "n": "Cheese, feta",
    "ms": [
      {
        "s": "1 wedge (1.33 oz)",
        "c": 187
      },
      {
        "s": "1 cubic inch",
        "c": 83.8
      },
      {
        "s": "1 oz",
        "c": 140
      },
      {
        "s": "1 cup, crumbled",
        "c": 740
      }
    ]
  },
  {
    "i": 2208,
    "n": "Cheese, cheshire",
    "ms": [
      {
        "s": "1 oz",
        "c": 182
      }
    ]
  },
  {
    "i": 2209,
    "n": "Cheese, caraway",
    "ms": [
      {
        "s": "1 oz",
        "c": 191
      }
    ]
  },
  {
    "i": 2210,
    "n": "Cheese, cottage, lowfat, 1% milkfat",
    "ms": [
      {
        "s": "1 cup (not packed)",
        "c": 138
      },
      {
        "s": "4 oz",
        "c": 68.9
      }
    ]
  },
  {
    "i": 2211,
    "n": "Cheese, colby",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 116
      },
      {
        "s": "1 slice (1 oz)",
        "c": 192
      },
      {
        "s": "1 cup, diced",
        "c": 904
      },
      {
        "s": "1 oz",
        "c": 194
      },
      {
        "s": "1 cup, shredded",
        "c": 774
      }
    ]
  },
  {
    "i": 2214,
    "n": "Beef, loin, top sirloin petite roast/filet, boneless, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 fillet",
        "c": 9.5
      },
      {
        "s": "1 roast",
        "c": 50.6
      }
    ]
  },
  {
    "i": 2215,
    "n": "Butter, whipped, with salt",
    "ms": [
      {
        "s": "1 stick",
        "c": 17.5
      },
      {
        "s": "1 pat (1 sq, 1/3 high)",
        "c": 0.874
      },
      {
        "s": "1 tbsp",
        "c": 2.16
      },
      {
        "s": "1 cup",
        "c": 34.7
      }
    ]
  },
  {
    "i": 2216,
    "n": "Beef, loin, top sirloin cap steak, boneless, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 9.95
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 2217,
    "n": "Butter oil, anhydrous",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.512
      },
      {
        "s": "1 cup",
        "c": 8.2
      }
    ]
  },
  {
    "i": 2218,
    "n": "Beef, rib eye steak, boneless, lip off, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      },
      {
        "s": "1 steak",
        "c": 25.3
      }
    ]
  },
  {
    "i": 2219,
    "n": "Beef, rib, back ribs, bone-in, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 ribs",
        "c": 144
      }
    ]
  },
  {
    "i": 2220,
    "n": "Beef, rib, back ribs, bone-in, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 ribs",
        "c": 156
      },
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 2221,
    "n": "Beef, rib eye steak, boneless, lip off, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 steak",
        "c": 23.8
      }
    ]
  },
  {
    "i": 2222,
    "n": "Beef, loin, top sirloin petite roast, boneless, separable lean only, trimmed to 0 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 40.3
      },
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2225,
    "n": "Beef, plate steak, boneless, outside skirt, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 16
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 2227,
    "n": "Beef, rib eye steak, boneless, lip off, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      },
      {
        "s": "1 steak",
        "c": 26.1
      }
    ]
  },
  {
    "i": 2231,
    "n": "Beef, rib eye steak/roast, boneless, lip-on, separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 26.3
      },
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 roast",
        "c": 154
      }
    ]
  },
  {
    "i": 2232,
    "n": "Beef, rib eye steak/roast, boneless, lip-on, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 170
      },
      {
        "s": "1 steak",
        "c": 28
      },
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 2237,
    "n": "Beef, Rib Eye Steak, Bone-In, Lip-On, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 18.7
      },
      {
        "s": "1 steak",
        "c": 83.2
      }
    ]
  },
  {
    "i": 2239,
    "n": "Beef, Rib Eye Steak, Bone-In, Lip-On, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 18.7
      },
      {
        "s": "1 steak",
        "c": 83.8
      }
    ]
  },
  {
    "i": 2240,
    "n": "Beef, rib eye roast, bone-in, lip-on, separable lean and fat, trimmed to 1/8 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 266
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 2249,
    "n": "Beef, plate steak, boneless, outside skirt, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 steak",
        "c": 13.4
      }
    ]
  },
  {
    "i": 2253,
    "n": "Beef, rib eye roast, boneless, lip-on, separable lean only, trimmed to 1/8 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 roast",
        "c": 134
      }
    ]
  },
  {
    "i": 2254,
    "n": "Beef, round, knuckle, tip side, steak, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 steak",
        "c": 10.4
      }
    ]
  },
  {
    "i": 2257,
    "n": "Beef, round, knuckle, tip center, steak, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 steak",
        "c": 9.85
      }
    ]
  },
  {
    "i": 2258,
    "n": "Beef, round, outside round, bottom round, steak, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 15.2
      },
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2259,
    "n": "Beef, round, knuckle, tip center, steak, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 10.2
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 2263,
    "n": "Beef, chuck, shoulder clod, shoulder tender, medallion, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 2264,
    "n": "Beef, chuck, shoulder clod, top blade, steak, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 14.6
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 2265,
    "n": "Beef, round, knuckle, tip center, steak, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 steak",
        "c": 10.4
      }
    ]
  },
  {
    "i": 2268,
    "n": "Beef, chuck, shoulder clod, shoulder tender, medallion, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 medallion",
        "c": 2.2
      }
    ]
  },
  {
    "i": 2269,
    "n": "Beef, round, knuckle, tip side, steak, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 steak",
        "c": 9.55
      }
    ]
  },
  {
    "i": 2271,
    "n": "Beef, chuck, shoulder clod, shoulder top and center steaks, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 steak",
        "c": 9.84
      }
    ]
  },
  {
    "i": 2273,
    "n": "Beef, short loin, t-bone steak, separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 26
      },
      {
        "s": "1 steak",
        "c": 105
      }
    ]
  },
  {
    "i": 2275,
    "n": "Beef, short loin, porterhouse steak, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 21.5
      },
      {
        "s": "1 steak",
        "c": 101
      }
    ]
  },
  {
    "i": 2279,
    "n": "Pulled pork in barbecue sauce",
    "ms": [
      {
        "s": "1 cup",
        "c": 110
      }
    ]
  },
  {
    "i": 2282,
    "n": "Macaroni and cheese, dry mix, prepared with 2% milk and 80% stick margarine from dry mix",
    "ms": [
      {
        "s": "1 cup",
        "c": 125
      }
    ]
  },
  {
    "i": 2283,
    "n": "Potato salad with egg",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 18.8
      }
    ]
  },
  {
    "i": 2284,
    "n": "Macaroni and cheese, frozen entree",
    "ms": [
      {
        "s": "1 container (mean weight over brands)",
        "c": 323
      },
      {
        "s": "1 cup",
        "c": 156
      }
    ]
  },
  {
    "i": 2285,
    "n": "Macaroni and cheese dinner with dry sauce mix, boxed, uncooked",
    "ms": [
      {
        "s": "1 serving (makes about 1 cup prepared)",
        "c": 102
      }
    ]
  },
  {
    "i": 2287,
    "n": "Burrito, bean and cheese, frozen",
    "ms": [
      {
        "s": "1 burrito",
        "c": 67.1
      }
    ]
  },
  {
    "i": 2288,
    "n": "Macaroni and Cheese, canned, microwavable",
    "ms": [
      {
        "s": "7.5 oz 1 serving",
        "c": 121
      }
    ]
  },
  {
    "i": 2291,
    "n": "Lasagna, cheese, frozen, prepared",
    "ms": [
      {
        "s": "1 cup 1 serving",
        "c": 250
      }
    ]
  },
  {
    "i": 2299,
    "n": "Ravioli, cheese-filled, canned",
    "ms": [
      {
        "s": "1 cup",
        "c": 79.9
      }
    ]
  },
  {
    "i": 2303,
    "n": "Light Ice Cream, soft serve, blended with milk chocolate candies",
    "ms": [
      {
        "s": "12 fl oz cup",
        "c": 470
      }
    ]
  },
  {
    "i": 2360,
    "n": "Continental Mills, Krusteaz Almond Poppyseed Muffin Mix, Artificially Flavored, dry",
    "ms": [
      {
        "s": "1 serving",
        "c": 32.8
      }
    ]
  },
  {
    "i": 2364,
    "n": "Pasta, gluten-free, corn and rice flour, cooked",
    "ms": [
      {
        "s": "1 cup spaghetti",
        "c": 2.82
      }
    ]
  },
  {
    "i": 2366,
    "n": "Sorghum flour, refined, unenriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 9.66
      }
    ]
  },
  {
    "i": 2377,
    "n": "Cake, yellow, light, dry mix",
    "ms": [
      {
        "s": "1 oz",
        "c": 43.9
      },
      {
        "s": "1 package (18.50 oz)",
        "c": 812
      }
    ]
  },
  {
    "i": 2378,
    "n": "Tortillas, ready-to-bake or -fry, flour, without added calcium",
    "ms": [
      {
        "s": "1 tortilla (approx 10 dia)",
        "c": 28.1
      },
      {
        "s": "1 tortilla, medium (approx 6 dia)",
        "c": 12.5
      },
      {
        "s": "1 oz",
        "c": 11.1
      },
      {
        "s": "1 tortilla (approx 7-8 dia)",
        "c": 19.1
      },
      {
        "s": "1 tortilla (approx 12 dia)",
        "c": 45.6
      }
    ]
  },
  {
    "i": 2381,
    "n": "English Muffins, Plain*",
    "ms": [
      {
        "s": "1 oz",
        "c": 14.7
      },
      {
        "s": "1 muffin",
        "c": 29.6
      }
    ]
  },
  {
    "i": 2382,
    "n": "Pie, fried pies, cherry",
    "ms": [
      {
        "s": "1 oz",
        "c": 6.24
      },
      {
        "s": "1 pie (5 x 3-3/4)",
        "c": 28.2
      }
    ]
  },
  {
    "i": 2383,
    "n": "Tortillas, ready-to-bake or -fry, corn, without added salt",
    "ms": [
      {
        "s": "1 oz",
        "c": 49.6
      },
      {
        "s": "1 tortilla, medium (approx 6 dia)",
        "c": 45.5
      }
    ]
  },
  {
    "i": 2384,
    "n": "Beverages, Orange-flavor drink, breakfast type, low calorie, powder",
    "ms": [
      {
        "s": "1 portion, amount of dry mix to make 8 fl oz prepared",
        "c": 34.4
      }
    ]
  },
  {
    "i": 2386,
    "n": "Beverages, orange-flavor drink, breakfast type, powder",
    "ms": [
      {
        "s": "1 serving 2 tbsp",
        "c": 100
      }
    ]
  },
  {
    "i": 2389,
    "n": "Beverages, tea, instant, lemon, diet",
    "ms": [
      {
        "s": "1 serving 6 fl oz",
        "c": 5.37
      },
      {
        "s": "1 serving 8 fl oz",
        "c": 7.14
      },
      {
        "s": "1 fl oz",
        "c": 0.894
      }
    ]
  },
  {
    "i": 2391,
    "n": "Beverages, tea, instant, decaffeinated, lemon, sweetened",
    "ms": [
      {
        "s": "1 serving (3 heaping tsp)",
        "c": 0.46
      },
      {
        "s": "1 cup",
        "c": 3.64
      }
    ]
  },
  {
    "i": 2393,
    "n": "Beverages, tea, instant, unsweetened, powder",
    "ms": [
      {
        "s": "1 serving 1 tsp",
        "c": 0.826
      }
    ]
  },
  {
    "i": 2394,
    "n": "Beverages, tea, instant, decaffeinated, lemon, diet",
    "ms": [
      {
        "s": "2 tsp",
        "c": 0.336
      }
    ]
  },
  {
    "i": 2395,
    "n": "Beverages, tea, herb, other than chamomile, brewed",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 4.74
      },
      {
        "s": "6 fl oz",
        "c": 3.56
      },
      {
        "s": "1 fl oz",
        "c": 0.592
      }
    ]
  },
  {
    "i": 2398,
    "n": "Beverages, pineapple and orange juice drink, canned",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.56
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 12.5
      }
    ]
  },
  {
    "i": 2399,
    "n": "Beverages, pineapple and grapefruit juice drink, canned",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 17.5
      },
      {
        "s": "1 fl oz",
        "c": 2.19
      }
    ]
  },
  {
    "i": 2401,
    "n": "Beverages, orange and apricot juice drink, canned",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 12.5
      },
      {
        "s": "1 fl oz",
        "c": 1.56
      }
    ]
  },
  {
    "i": 2402,
    "n": "Beverages, grape juice drink, canned",
    "ms": [
      {
        "s": "1 serving",
        "c": 15.9
      },
      {
        "s": "6 fl oz",
        "c": 13.2
      },
      {
        "s": "8 fl oz",
        "c": 17.5
      },
      {
        "s": "1 fl oz",
        "c": 2.19
      }
    ]
  },
  {
    "i": 2403,
    "n": "Beverages, Cranberry juice cocktail",
    "ms": [
      {
        "s": "1 cup",
        "c": 8.13
      }
    ]
  },
  {
    "i": 2405,
    "n": "Beverages, tea, black, ready to drink, decaffeinated",
    "ms": [
      {
        "s": "1 cup",
        "c": 26.4
      }
    ]
  },
  {
    "i": 2409,
    "n": "Beverages, Malted drink mix, natural, powder, dairy based.",
    "ms": [
      {
        "s": "1 serving (3 heaping tsp or 1 envelope)",
        "c": 62.6
      }
    ]
  },
  {
    "i": 2411,
    "n": "Beverages, carbonated, lemon-lime soda, no caffeine",
    "ms": [
      {
        "s": "1 drink (12 fl oz)",
        "c": 7.36
      },
      {
        "s": "1 fl oz",
        "c": 0.616
      },
      {
        "s": "1 drink, extra large (44 fl oz)",
        "c": 27
      },
      {
        "s": "1 drink, small (16 fl oz)",
        "c": 9.82
      },
      {
        "s": "1 drink, medium (22 fl oz)",
        "c": 13.5
      },
      {
        "s": "1 drink, large (32 fl oz)",
        "c": 19.6
      }
    ]
  },
  {
    "i": 2412,
    "n": "Beverages, carbonated, pepper-type, contains caffeine",
    "ms": [
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 14.7
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 11
      },
      {
        "s": "1 fl oz",
        "c": 0.921
      }
    ]
  },
  {
    "i": 2414,
    "n": "Beverages, carbonated, low calorie, other than cola or pepper, with aspartame, contains caffeine",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.18
      },
      {
        "s": "1 can (12 fl oz)",
        "c": 14.2
      }
    ]
  },
  {
    "i": 2415,
    "n": "Beverages, tea, black, ready to drink, decaffeinated, diet",
    "ms": [
      {
        "s": "1 cup",
        "c": 26.4
      }
    ]
  },
  {
    "i": 2417,
    "n": "Alcoholic beverage, wine, table, red",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.35
      },
      {
        "s": "1 serving (5 fl oz)",
        "c": 11.8
      }
    ]
  },
  {
    "i": 2418,
    "n": "Beverages, carbonated, low calorie, other than cola or pepper,  without caffeine",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.18
      },
      {
        "s": "1 can (12 fl oz)",
        "c": 14.2
      }
    ]
  },
  {
    "i": 2419,
    "n": "Carbonated beverage, cream soda",
    "ms": [
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 24.7
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 18.6
      },
      {
        "s": "1 fl oz",
        "c": 1.54
      }
    ]
  },
  {
    "i": 2420,
    "n": "Beverages, carbonated, grape soda",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.93
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 11.2
      }
    ]
  },
  {
    "i": 2421,
    "n": "Beverages, Mixed vegetable and fruit juice drink, with added nutrients",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 7.41
      }
    ]
  },
  {
    "i": 2422,
    "n": "Alcoholic beverage, wine, table, all",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.36
      },
      {
        "s": "1 serving (5 fl oz)",
        "c": 11.8
      }
    ]
  },
  {
    "i": 2424,
    "n": "Beverages, chocolate malt, powder, prepared with fat free milk",
    "ms": [
      {
        "s": "1 serving",
        "c": 599
      }
    ]
  },
  {
    "i": 2426,
    "n": "Beverages, rich chocolate, powder",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 100
      }
    ]
  },
  {
    "i": 2427,
    "n": "Beverages, chocolate almond milk, unsweetened, shelf-stable, fortified with vitamin D2 and E",
    "ms": [
      {
        "s": "1 cup",
        "c": 451
      }
    ]
  },
  {
    "i": 2430,
    "n": "Alcoholic beverage, wine, dessert, sweet",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.36
      },
      {
        "s": "1 glass (3.5 fl oz)",
        "c": 8.24
      }
    ]
  },
  {
    "i": 2432,
    "n": "Beverages, Protein powder soy based",
    "ms": [
      {
        "s": "1 scoop",
        "c": 80.1
      }
    ]
  },
  {
    "i": 2433,
    "n": "Beverages, Protein powder whey based",
    "ms": [
      {
        "s": "0.33 cup",
        "c": 150
      }
    ]
  },
  {
    "i": 2434,
    "n": "Beverages, Whey protein powder isolate",
    "ms": [
      {
        "s": "3 scoop",
        "c": 600
      }
    ]
  },
  {
    "i": 2435,
    "n": "Beverages, Acai berry drink, fortified",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 50.5
      },
      {
        "s": "2 fl oz",
        "c": 11.4
      }
    ]
  },
  {
    "i": 2436,
    "n": "Beverages, Orange juice, light, No pulp",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 2437,
    "n": "Alcoholic beverage, creme de menthe, 72 proof",
    "ms": [
      {
        "s": "1 jigger 1.5 fl oz",
        "c": 0
      },
      {
        "s": "1 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 2444,
    "n": "Beverages, water, bottled, yumberry, pomegranate with anti-oxidants, zero calories",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 0
      }
    ]
  },
  {
    "i": 2448,
    "n": "Beverages, Whiskey sour mix, powder",
    "ms": [
      {
        "s": "1 packet",
        "c": 46.2
      }
    ]
  },
  {
    "i": 2449,
    "n": "Rice crackers",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 2452,
    "n": "Snacks, peas, roasted, wasabi-flavored",
    "ms": [
      {
        "s": "1 serving",
        "c": 34.4
      }
    ]
  },
  {
    "i": 2454,
    "n": "Snacks, shrimp cracker",
    "ms": [
      {
        "s": "1 serving",
        "c": 5.6
      }
    ]
  },
  {
    "i": 2456,
    "n": "Snacks, yucca (cassava) chips, salted",
    "ms": [
      {
        "s": "10 chips",
        "c": 8.84
      },
      {
        "s": "1 oz",
        "c": 14.7
      },
      {
        "s": "1 bag",
        "c": 54.6
      }
    ]
  },
  {
    "i": 2457,
    "n": "Snacks, brown rice chips",
    "ms": [
      {
        "s": "1 cake",
        "c": 0.99
      },
      {
        "s": "2 cakes",
        "c": 1.98
      }
    ]
  },
  {
    "i": 2460,
    "n": "Formulated bar, high fiber, chewy, oats and chocolate",
    "ms": [
      {
        "s": "1 bar",
        "c": 100
      }
    ]
  },
  {
    "i": 2461,
    "n": "Snacks, pita chips, salted",
    "ms": [
      {
        "s": "1 bag",
        "c": 44.5
      },
      {
        "s": "1 oz",
        "c": 4.82
      }
    ]
  },
  {
    "i": 2462,
    "n": "Snacks, bagel chips, plain",
    "ms": [
      {
        "s": "1 bag",
        "c": 42
      },
      {
        "s": "1 oz",
        "c": 6.8
      },
      {
        "s": "6 piece chips",
        "c": 6.72
      }
    ]
  },
  {
    "i": 2463,
    "n": "Snacks, granola bars, soft, almond, confectioners coating",
    "ms": [
      {
        "s": "1 bar",
        "c": 47.6
      }
    ]
  },
  {
    "i": 2465,
    "n": "Snacks, granola bites, mixed flavors",
    "ms": [
      {
        "s": "1 package",
        "c": 8.2
      }
    ]
  },
  {
    "i": 2466,
    "n": "Tortilla chips, yellow, plain, salted",
    "ms": [
      {
        "s": "1 oz",
        "c": 29.5
      }
    ]
  },
  {
    "i": 2467,
    "n": "Snacks, granola bar, chewy, reduced sugar, all flavors",
    "ms": [
      {
        "s": "1 bar",
        "c": 100
      }
    ]
  },
  {
    "i": 2470,
    "n": "Snacks, soy chips or crisps, salted",
    "ms": [
      {
        "s": "1 oz",
        "c": 48.5
      }
    ]
  },
  {
    "i": 2471,
    "n": "Snacks, plantain chips, salted",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 2472,
    "n": "Popcorn, microwave, regular (butter) flavor, made with palm oil",
    "ms": [
      {
        "s": "1 bag",
        "c": 20
      },
      {
        "s": "1 cup",
        "c": 1.82
      }
    ]
  },
  {
    "i": 2476,
    "n": "Snacks, popcorn, microwave, 94% fat free",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.97
      }
    ]
  },
  {
    "i": 2481,
    "n": "Beef, round, tip round, roast, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 232
      },
      {
        "s": "4 oz",
        "c": 20.3
      }
    ]
  },
  {
    "i": 2482,
    "n": "Beef, round, tip round, roast, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 22.6
      },
      {
        "s": "1 roast",
        "c": 237
      }
    ]
  },
  {
    "i": 2484,
    "n": "Beef, round, tip round, roast, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 20.3
      },
      {
        "s": "1 roast",
        "c": 251
      }
    ]
  },
  {
    "i": 2487,
    "n": "Beef, bottom sirloin, tri-tip roast, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 24.9
      },
      {
        "s": "1 roast",
        "c": 55.4
      }
    ]
  },
  {
    "i": 2488,
    "n": "Beef, round, eye of round, roast, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 99.8
      },
      {
        "s": "4 oz",
        "c": 24.9
      }
    ]
  },
  {
    "i": 2489,
    "n": "Beef, round, top round, steak, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 24.9
      },
      {
        "s": "1 lb",
        "c": 99.8
      }
    ]
  },
  {
    "i": 2491,
    "n": "Beef, round, bottom round, roast, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 23.7
      },
      {
        "s": "1 lb",
        "c": 95.3
      }
    ]
  },
  {
    "i": 2494,
    "n": "Beef, ground, 97% lean meat / 3% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2496,
    "n": "Beef, short loin, top loin, steak, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 32.8
      },
      {
        "s": "1 lb",
        "c": 132
      }
    ]
  },
  {
    "i": 2497,
    "n": "Beef, ground, 93% lean meat / 7% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 2498,
    "n": "Beef, ground, 97% lean meat /3% fat, patty, cooked, pan-broiled",
    "ms": [
      {
        "s": "1 portion (yield from 1/2 lb raw meat )",
        "c": 9.73
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 2499,
    "n": "Beef, ground, 97% lean meat / 3% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 2500,
    "n": "Beef, ground, 97% lean meat / 3% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "1 patty",
        "c": 3.5
      },
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2505,
    "n": "Beef, New Zealand, Imported, Tenderloin, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 2507,
    "n": "Beef, New Zealand, Imported, Flat, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 2508,
    "n": "Beef, New Zealand, imported, chuck eye roll, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 2513,
    "n": "Beef, New Zealand, imported, variety meats and by-products, tripe uncooked, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 127
      }
    ]
  },
  {
    "i": 2515,
    "n": "Beef, New Zealand, imported, variety meats and by-products, tripe cooked, boiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 134
      }
    ]
  },
  {
    "i": 2516,
    "n": "Beef, New Zealand, imported, sweetbread, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 2518,
    "n": "Beef, New Zealand, imported, subcutaneous fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 22.6
      }
    ]
  },
  {
    "i": 2524,
    "n": "Beef, New Zealand, imported, manufacturing beef, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 2526,
    "n": "Beef, New Zealand, imported, intermuscular fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 2528,
    "n": "Beef, New Zealand, imported, knuckle, cooked, fast fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2542,
    "n": "Beef, Australian, imported, grass-fed, ground, 85% lean / 15% fat, raw",
    "ms": [
      {
        "s": "4 oz (4 oz)",
        "c": 6.78
      }
    ]
  },
  {
    "i": 2549,
    "n": "Beef, ribeye petite roast, boneless, separable lean only, trimmed to 0 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 35.7
      },
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2551,
    "n": "Beef, ribeye petite roast, boneless, separable lean only, trimmed to 0 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 40.5
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2552,
    "n": "Beef, ribeye cap steak, boneless, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 15.4
      }
    ]
  },
  {
    "i": 2553,
    "n": "Beef, ribeye petite roast, boneless, separable lean only, trimmed to 0 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 41.9
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2556,
    "n": "Beef, loin, top sirloin petite roast/filet, boneless, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 9
      },
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 48.5
      }
    ]
  },
  {
    "i": 2558,
    "n": "Beef, loin, top sirloin petite roast, boneless, separable lean only, trimmed to 0 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "1 roast",
        "c": 45.9
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2560,
    "n": "Beef, loin, top sirloin filet, boneless, separable lean only, trimmed to 0 fat, select, cooked, grilled",
    "ms": [
      {
        "s": "1 fillet",
        "c": 6.9
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2561,
    "n": "Beef, loin, top sirloin petite roast, boneless, separable lean only, trimmed to 0 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      },
      {
        "s": "1 roast",
        "c": 38.4
      }
    ]
  },
  {
    "i": 2565,
    "n": "Groundcherries, (cape-gooseberries or poha), raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 12.6
      }
    ]
  },
  {
    "i": 2566,
    "n": "Guavas, strawberry, raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 1.26
      },
      {
        "s": "1 cup",
        "c": 51.2
      }
    ]
  },
  {
    "i": 2567,
    "n": "Grape juice, canned or bottled, unsweetened, with added ascorbic acid",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.48
      },
      {
        "s": "1 cup",
        "c": 27.8
      }
    ]
  },
  {
    "i": 2568,
    "n": "Grapefruit juice, white, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 22.2
      },
      {
        "s": "1 fl oz",
        "c": 2.78
      },
      {
        "s": "1 fruit yields",
        "c": 17.6
      }
    ]
  },
  {
    "i": 2569,
    "n": "Guavas, common, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 29.7
      },
      {
        "s": "1 fruit, without refuse",
        "c": 9.9
      }
    ]
  },
  {
    "i": 2570,
    "n": "Grapes, muscadine, raw",
    "ms": [
      {
        "s": "1 grape",
        "c": 2.22
      }
    ]
  },
  {
    "i": 2571,
    "n": "Grape juice, canned or bottled, unsweetened, without added ascorbic acid",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.48
      },
      {
        "s": "1 cup",
        "c": 27.8
      }
    ]
  },
  {
    "i": 2572,
    "n": "Grapefruit, sections, canned, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 37.4
      }
    ]
  },
  {
    "i": 2574,
    "n": "Grapefruit, raw, pink and red and white, all areas",
    "ms": [
      {
        "s": "0.5 large (approx 4-1/2 dia)",
        "c": 19.9
      },
      {
        "s": "0.5 medium (approx 4 dia)",
        "c": 15.4
      },
      {
        "s": "0.5 small (approx 3-1/2 dia)",
        "c": 12
      },
      {
        "s": "1 cup sections, with juice",
        "c": 27.6
      }
    ]
  },
  {
    "i": 2575,
    "n": "Grapefruit, raw, white, Florida",
    "ms": [
      {
        "s": "0.5 fruit (3-3/4 dia)",
        "c": 17.7
      },
      {
        "s": "1 cup sections, with juice",
        "c": 34.5
      }
    ]
  },
  {
    "i": 2577,
    "n": "Grapefruit juice, pink or red, with added calcium",
    "ms": [
      {
        "s": "1 cup",
        "c": 368
      },
      {
        "s": "8 fl oz",
        "c": 350
      }
    ]
  },
  {
    "i": 2580,
    "n": "Gooseberries, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 37.5
      }
    ]
  },
  {
    "i": 2581,
    "n": "Goji berries, dried",
    "ms": [
      {
        "s": "5 tbsp",
        "c": 53.2
      }
    ]
  },
  {
    "i": 2582,
    "n": "Fruit cocktail, (peach and pineapple and pear and grape and cherry), canned, heavy syrup, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.9
      }
    ]
  },
  {
    "i": 2583,
    "n": "Fruit cocktail, (peach and pineapple and pear and grape and cherry), canned, light syrup, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.5
      }
    ]
  },
  {
    "i": 2584,
    "n": "Fruit cocktail, (peach and pineapple and pear and grape and cherry), canned, extra heavy syrup, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 15.6
      },
      {
        "s": "0.5 cup",
        "c": 7.8
      }
    ]
  },
  {
    "i": 2585,
    "n": "Fruit cocktail, (peach and pineapple and pear and grape and cherry), canned, extra light syrup, solids and liquids",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 9.84
      }
    ]
  },
  {
    "i": 2589,
    "n": "Figs, raw",
    "ms": [
      {
        "s": "1 small (1-1/2 dia)",
        "c": 14
      },
      {
        "s": "1 large (2-1/2 dia)",
        "c": 22.4
      },
      {
        "s": "1 medium (2-1/4 dia)",
        "c": 17.5
      }
    ]
  },
  {
    "i": 2605,
    "n": "Rice and Wheat cereal bar",
    "ms": [
      {
        "s": "1 bar",
        "c": 6.82
      }
    ]
  },
  {
    "i": 2635,
    "n": "Pork sausage, link/patty, fully cooked, microwaved",
    "ms": [
      {
        "s": "1 serving",
        "c": 8.16
      },
      {
        "s": "1 patty",
        "c": 5.1
      },
      {
        "s": "1 link",
        "c": 3.57
      }
    ]
  },
  {
    "i": 2638,
    "n": "Cereals ready-to-eat, chocolate-flavored frosted puffed corn",
    "ms": [
      {
        "s": "1 cup",
        "c": 21
      }
    ]
  },
  {
    "i": 2640,
    "n": "Frankfurter, meat",
    "ms": [
      {
        "s": "1 serving (1 hot dog)",
        "c": 51.5
      }
    ]
  },
  {
    "i": 2641,
    "n": "Pate, truffle flavor",
    "ms": [
      {
        "s": "1 serving 2 oz",
        "c": 39.2
      }
    ]
  },
  {
    "i": 2642,
    "n": "Bologna, chicken, turkey, pork",
    "ms": [
      {
        "s": "1 slice",
        "c": 23
      },
      {
        "s": "1 serving",
        "c": 23
      }
    ]
  },
  {
    "i": 2643,
    "n": "Salami, Italian, pork and beef, dry, sliced, 50% less sodium",
    "ms": [
      {
        "s": "1 serving 5 slices",
        "c": 2.24
      }
    ]
  },
  {
    "i": 2644,
    "n": "Macaroni and cheese loaf, chicken, pork and beef",
    "ms": [
      {
        "s": "1 slice",
        "c": 46.4
      }
    ]
  },
  {
    "i": 2645,
    "n": "Scrapple, pork",
    "ms": [
      {
        "s": "1 oz cooked",
        "c": 1.75
      },
      {
        "s": "1 cubic inch",
        "c": 1.19
      },
      {
        "s": "2 oz",
        "c": 3.92
      }
    ]
  },
  {
    "i": 2646,
    "n": "Frankfurter, pork",
    "ms": [
      {
        "s": "1 link",
        "c": 203
      }
    ]
  },
  {
    "i": 2647,
    "n": "Bratwurst, chicken, cooked",
    "ms": [
      {
        "s": "1 serving 2.96 oz",
        "c": 9.24
      }
    ]
  },
  {
    "i": 2648,
    "n": "Beerwurst, pork and beef",
    "ms": [
      {
        "s": "1 serving 2 oz",
        "c": 15.1
      }
    ]
  },
  {
    "i": 2649,
    "n": "Yachtwurst, with pistachio nuts, cooked",
    "ms": [
      {
        "s": "1 serving 2 oz",
        "c": 10.6
      }
    ]
  },
  {
    "i": 2650,
    "n": "Bratwurst, pork, beef and turkey, lite, smoked",
    "ms": [
      {
        "s": "1 serving 2.33 oz",
        "c": 9.24
      }
    ]
  },
  {
    "i": 2651,
    "n": "Pastrami, beef, 98% fat-free",
    "ms": [
      {
        "s": "1 serving 6 slices",
        "c": 5.13
      }
    ]
  },
  {
    "i": 2652,
    "n": "Chicken breast, fat-free, mesquite flavor, sliced",
    "ms": [
      {
        "s": "1 serving 2 slices",
        "c": 1.68
      }
    ]
  },
  {
    "i": 2653,
    "n": "Chicken breast, oven-roasted, fat-free, sliced",
    "ms": [
      {
        "s": "1 serving 2 slices",
        "c": 2.52
      }
    ]
  },
  {
    "i": 2654,
    "n": "Sausage, Italian, sweet, links",
    "ms": [
      {
        "s": "1 link 3 oz",
        "c": 21
      }
    ]
  },
  {
    "i": 2656,
    "n": "Bratwurst, beef and pork, smoked",
    "ms": [
      {
        "s": "1 serving 2.33 oz",
        "c": 4.62
      }
    ]
  },
  {
    "i": 2657,
    "n": "Sausage, pork and beef, with cheddar cheese, smoked",
    "ms": [
      {
        "s": "12 oz serving 2.7 oz",
        "c": 43.9
      }
    ]
  },
  {
    "i": 2658,
    "n": "Sausage, Polish, pork and beef, smoked",
    "ms": [
      {
        "s": "1 serving 2.67 oz",
        "c": 5.32
      }
    ]
  },
  {
    "i": 2659,
    "n": "Sausage, Polish, beef with chicken, hot",
    "ms": [
      {
        "s": "1 serving 5 pieces",
        "c": 6.6
      },
      {
        "s": "5 pieces",
        "c": 6.6
      }
    ]
  },
  {
    "i": 2662,
    "n": "Honey roll sausage, beef",
    "ms": [
      {
        "s": "1 slice (4 dia x 1/8 thick)",
        "c": 2.07
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 2664,
    "n": "Sausage, turkey, pork, and beef, low fat, smoked",
    "ms": [
      {
        "s": "1 lb 16 oz",
        "c": 45.4
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 2667,
    "n": "Frankfurter, beef, pork, and turkey, fat free",
    "ms": [
      {
        "s": "1 frank 1 NLEA serving",
        "c": 30.8
      }
    ]
  },
  {
    "i": 2670,
    "n": "Thuringer, cervelat, summer sausage, beef, pork",
    "ms": [
      {
        "s": "2 oz 1 serving",
        "c": 5.04
      }
    ]
  },
  {
    "i": 2671,
    "n": "Turkey breast, sliced, prepackaged",
    "ms": [
      {
        "s": "1 slice",
        "c": 2.24
      }
    ]
  },
  {
    "i": 2672,
    "n": "Salami, cooked, turkey",
    "ms": [
      {
        "s": "1 serving",
        "c": 11.2
      }
    ]
  },
  {
    "i": 2673,
    "n": "Salami, dry or hard, pork",
    "ms": [
      {
        "s": "1 package (4 oz)",
        "c": 14.7
      },
      {
        "s": "1 slice (3-1/8 dia x 1/16 thick)",
        "c": 1.3
      }
    ]
  },
  {
    "i": 2675,
    "n": "Salami, cooked, beef and pork",
    "ms": [
      {
        "s": "1 slice round",
        "c": 1.84
      }
    ]
  },
  {
    "i": 2676,
    "n": "Picnic loaf, pork, beef",
    "ms": [
      {
        "s": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
        "c": 13.2
      },
      {
        "s": "2 slices",
        "c": 26.8
      }
    ]
  },
  {
    "i": 2677,
    "n": "Mother's loaf, pork",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      },
      {
        "s": "1 slice (4-1/4 x 4-1/4 x 1/16)",
        "c": 9.03
      }
    ]
  },
  {
    "i": 2678,
    "n": "Salami, cooked, beef",
    "ms": [
      {
        "s": "1 slice",
        "c": 1.56
      },
      {
        "s": "1 oz",
        "c": 1.7
      }
    ]
  },
  {
    "i": 2679,
    "n": "Pastrami, turkey",
    "ms": [
      {
        "s": "2 slices",
        "c": 6.27
      },
      {
        "s": "1 package (8 oz)",
        "c": 25
      }
    ]
  },
  {
    "i": 2681,
    "n": "Olive loaf, pork",
    "ms": [
      {
        "s": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
        "c": 30.5
      },
      {
        "s": "2 slices",
        "c": 62.1
      }
    ]
  },
  {
    "i": 2682,
    "n": "Luxury loaf, pork",
    "ms": [
      {
        "s": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
        "c": 10.1
      },
      {
        "s": "2 slices",
        "c": 20.5
      }
    ]
  },
  {
    "i": 2685,
    "n": "Soup, vegetable with beef broth, canned, prepared with equal volume water",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 21.7
      },
      {
        "s": "1 can (10.5 oz), prepared",
        "c": 52.7
      }
    ]
  },
  {
    "i": 2708,
    "n": "Soup, cream of potato, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 166
      },
      {
        "s": "1 can (10.75 oz), prepared",
        "c": 403
      }
    ]
  },
  {
    "i": 2709,
    "n": "Soup, tomato bisque, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 186
      },
      {
        "s": "1 can (11 oz), prepared",
        "c": 451
      }
    ]
  },
  {
    "i": 2710,
    "n": "Soup, cream of shrimp, canned, prepared with equal volume low fat (2%) milk",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 21.8
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 175
      }
    ]
  },
  {
    "i": 2714,
    "n": "Soup, cheese, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 can (11 oz), prepared",
        "c": 700
      },
      {
        "s": "1 cup",
        "c": 289
      }
    ]
  },
  {
    "i": 2715,
    "n": "Soup, oyster stew, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 can (10.5 oz), prepared",
        "c": 405
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 167
      }
    ]
  },
  {
    "i": 2716,
    "n": "Sauce, Teriyaki, Ready-To-Serve*",
    "ms": [
      {
        "s": "2 Tbsp",
        "c": 9
      }
    ]
  },
  {
    "i": 2717,
    "n": "Soup, cream of celery, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 186
      },
      {
        "s": "1 can (10.75 oz), prepared",
        "c": 452
      }
    ]
  },
  {
    "i": 2718,
    "n": "Soup, pea, green, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 173
      },
      {
        "s": "1 can (11.25 oz), prepared",
        "c": 419
      }
    ]
  },
  {
    "i": 2719,
    "n": "Soup, chicken vegetable with potato and cheese, chunky, ready-to-serve",
    "ms": [
      {
        "s": "1 cup",
        "c": 36.8
      }
    ]
  },
  {
    "i": 2720,
    "n": "Soup, cream of asparagus, canned, prepared with equal volume milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 174
      },
      {
        "s": "1 can (10.75 oz), prepared",
        "c": 421
      }
    ]
  },
  {
    "i": 2722,
    "n": "Sauce, hoisin, ready-to-serve",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 5.12
      }
    ]
  },
  {
    "i": 2724,
    "n": "Soup, chicken broth, less/reduced sodium, ready to serve",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.2
      }
    ]
  },
  {
    "i": 2728,
    "n": "Soup, beef broth, less/reduced sodium, ready to serve",
    "ms": [
      {
        "s": "1 carton (32 oz)",
        "c": 27.7
      },
      {
        "s": "1 can (14.5 oz)",
        "c": 12.2
      },
      {
        "s": "1 cup",
        "c": 6.57
      }
    ]
  },
  {
    "i": 2730,
    "n": "Sauce, plum, ready-to-serve",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.28
      },
      {
        "s": "1 cup",
        "c": 36.6
      }
    ]
  },
  {
    "i": 2734,
    "n": "Turkey, retail parts, drumstick, meat only, raw",
    "ms": [
      {
        "s": "1 drumstick",
        "c": 35.6
      },
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 2735,
    "n": "Turkey, skin, from retail parts, from dark meat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 2738,
    "n": "Turkey, breast, from whole bird, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 63.4
      },
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 breast",
        "c": 295
      }
    ]
  },
  {
    "i": 2739,
    "n": "Turkey, Whole, Meat Only, With Added Solution, R*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 bird",
        "c": 581
      }
    ]
  },
  {
    "i": 2741,
    "n": "Turkey, whole, meat and skin, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 bird",
        "c": 800
      }
    ]
  },
  {
    "i": 2742,
    "n": "Turkey, skin from whole (light and dark), with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 2744,
    "n": "Turkey, skin from whole, (light and dark), with added solution, roasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.09
      }
    ]
  },
  {
    "i": 2747,
    "n": "Chicken, dark meat, thigh, meat and skin, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      },
      {
        "s": "1 thigh",
        "c": 14.5
      },
      {
        "s": "1 thigh without skin",
        "c": 11.8
      }
    ]
  },
  {
    "i": 2749,
    "n": "Turkey from whole, light meat, meat only, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      }
    ]
  },
  {
    "i": 2750,
    "n": "Chicken, dark meat, thigh, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 thigh without skin",
        "c": 11.8
      },
      {
        "s": "1 thigh with skin",
        "c": 15.3
      },
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 2753,
    "n": "Chicken, dark meat, drumstick, meat and skin, with added solution, raw",
    "ms": [
      {
        "s": "1 drumstick with skin",
        "c": 11.4
      },
      {
        "s": "1 drumstick without skin",
        "c": 10.4
      },
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 2756,
    "n": "Chicken, skin (drumsticks and thighs), raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 lb",
        "c": 27.2
      }
    ]
  },
  {
    "i": 2758,
    "n": "Turkey, ground, fat free, patties, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 patty",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2759,
    "n": "Turkey, Ground, 93% Lean, 7% Fat, Pan-Broiled Crumbles*",
    "ms": [
      {
        "s": "3 oz",
        "c": 26.4
      }
    ]
  },
  {
    "i": 2760,
    "n": "Turkey, ground, 93% lean, 7% fat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 95.1
      },
      {
        "s": "4 oz",
        "c": 23.7
      },
      {
        "s": "1 serving (cooked from 4 oz)",
        "c": 17.8
      }
    ]
  },
  {
    "i": 2763,
    "n": "Turkey, ground, fat free, pan-broiled crumbles",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2765,
    "n": "Turkey, ground, fat free, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 13.6
      },
      {
        "s": "1 patty (cooked from 4 oz raw)",
        "c": 2.55
      },
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 2780,
    "n": "English muffins, plain, unenriched, with calcium propionate (includes sourdough)",
    "ms": [
      {
        "s": "1 oz",
        "c": 49.3
      },
      {
        "s": "1 muffin",
        "c": 99.2
      }
    ]
  },
  {
    "i": 2781,
    "n": "Quail, breast, meat only, raw",
    "ms": [
      {
        "s": "1 breast",
        "c": 5.6
      },
      {
        "s": "1 unit (yield from 1 lb ready-to cook quail)",
        "c": 20.8
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 2782,
    "n": "Danish pastry, lemon, unenriched",
    "ms": [
      {
        "s": "1 pastry",
        "c": 32.7
      },
      {
        "s": "1 oz",
        "c": 13
      }
    ]
  },
  {
    "i": 2783,
    "n": "Bread, white, commercially prepared, toasted, low sodium no salt",
    "ms": [
      {
        "s": "1 slice",
        "c": 27.4
      },
      {
        "s": "1 oz",
        "c": 33.7
      }
    ]
  },
  {
    "i": 2784,
    "n": "Ruffed Grouse, breast meat, skinless, raw",
    "ms": [
      {
        "s": "1 breast",
        "c": 11
      },
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 bird",
        "c": 31.4
      }
    ]
  },
  {
    "i": 2785,
    "n": "Danish Pastry, Fruit*",
    "ms": [
      {
        "s": "1 container (3 oz)",
        "c": 65.3
      },
      {
        "s": "1 oz",
        "c": 13
      },
      {
        "s": "1 piece (1/8 of 15 oz ring)",
        "c": 24.4
      },
      {
        "s": "1 small or frozen (approx 3 dia)",
        "c": 16.1
      },
      {
        "s": "1 pastry (4-1/4 dia)",
        "c": 32.7
      },
      {
        "s": "1 Toaster Strudel",
        "c": 24.4
      }
    ]
  },
  {
    "i": 2787,
    "n": "Bread, white, commercially prepared, low sodium, no salt",
    "ms": [
      {
        "s": "1 slice, large",
        "c": 32.4
      },
      {
        "s": "1 slice",
        "c": 27
      },
      {
        "s": "1 cup, cubes",
        "c": 37.8
      },
      {
        "s": "1 cup, crumbs",
        "c": 48.6
      },
      {
        "s": "1 oz",
        "c": 30.6
      },
      {
        "s": "1 slice, thin",
        "c": 21.6
      }
    ]
  },
  {
    "i": 2788,
    "n": "Crackers, Melba Toast, Plain*",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 13.2
      },
      {
        "s": "1 cup, rounds",
        "c": 30.7
      },
      {
        "s": "1 cup pieces",
        "c": 27.9
      },
      {
        "s": "1 toast",
        "c": 4.65
      },
      {
        "s": "1 cup, crushed",
        "c": 65.1
      },
      {
        "s": "1 melba round",
        "c": 2.79
      },
      {
        "s": "1 piece (3-3/4 x 1-3/4 x 1/8)",
        "c": 4.65
      }
    ]
  },
  {
    "i": 2789,
    "n": "Cookies, Butter, Commercially Prepared*",
    "ms": [
      {
        "s": "1 cookie",
        "c": 1.45
      },
      {
        "s": "1 oz",
        "c": 8.22
      }
    ]
  },
  {
    "i": 2790,
    "n": "Danish Pastry, Cinnamon*",
    "ms": [
      {
        "s": "1 piece (1/8 of 15 oz ring)",
        "c": 37.6
      },
      {
        "s": "1 Toaster Strudel",
        "c": 37.6
      },
      {
        "s": "1 oz",
        "c": 20.1
      },
      {
        "s": "1 large (approx 7 dia)",
        "c": 101
      },
      {
        "s": "1 small or frozen (approx 3 dia)",
        "c": 24.8
      },
      {
        "s": "1 pastry (4-1/4 dia)",
        "c": 46.2
      }
    ]
  },
  {
    "i": 2791,
    "n": "Crackers, whole-wheat, low salt",
    "ms": [
      {
        "s": "10 Triscuit Bits",
        "c": 5
      },
      {
        "s": "0.5 oz",
        "c": 7.1
      },
      {
        "s": "1 cup, crushed",
        "c": 47
      },
      {
        "s": "1 cracker, square",
        "c": 2
      },
      {
        "s": "1 cracker",
        "c": 2
      }
    ]
  },
  {
    "i": 2792,
    "n": "Cookies, ladyfingers, without lemon juice and rind",
    "ms": [
      {
        "s": "1 ladyfinger",
        "c": 5.17
      },
      {
        "s": "1 breakfast treat (approx 4 x 2 x 7/8)",
        "c": 11.3
      },
      {
        "s": "1 anisette sponge (4 x 1-1/8 x 7/8)",
        "c": 6.11
      },
      {
        "s": "1 oz",
        "c": 13.3
      }
    ]
  },
  {
    "i": 2797,
    "n": "Crackers, matzo, egg and onion",
    "ms": [
      {
        "s": "1 matzo",
        "c": 10.1
      },
      {
        "s": "0.5 oz",
        "c": 5.11
      }
    ]
  },
  {
    "i": 2798,
    "n": "Bread, Raisin*",
    "ms": [
      {
        "s": "1 slice",
        "c": 17.2
      },
      {
        "s": "1 slice, large",
        "c": 21.1
      },
      {
        "s": "1 slice, thin",
        "c": 15.2
      },
      {
        "s": "1 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 2799,
    "n": "Bread, Pita, White*",
    "ms": [
      {
        "s": "1 oz",
        "c": 24.4
      },
      {
        "s": "1 pita, large (6-1/2 dia)",
        "c": 51.6
      }
    ]
  },
  {
    "i": 2800,
    "n": "Bread, protein, (includes gluten), toasted",
    "ms": [
      {
        "s": "1 slice",
        "c": 23.1
      },
      {
        "s": "1 oz",
        "c": 38.6
      }
    ]
  },
  {
    "i": 2801,
    "n": "Cookies, chocolate chip, prepared from recipe, made with butter",
    "ms": [
      {
        "s": "1 oz",
        "c": 10.8
      },
      {
        "s": "1 cookie, medium (2-1/4 dia)",
        "c": 6.08
      }
    ]
  },
  {
    "i": 2802,
    "n": "Bread, crumbs, dry, grated, seasoned",
    "ms": [
      {
        "s": "1 oz",
        "c": 51.6
      },
      {
        "s": "1 cup",
        "c": 218
      }
    ]
  },
  {
    "i": 2803,
    "n": "Rolls, dinner, plain, prepared from recipe, made with low fat (2%) milk",
    "ms": [
      {
        "s": "1 large roll or bun (3-1/2 dia)",
        "c": 25.8
      },
      {
        "s": "1 roll (2-1/2 dia)",
        "c": 21
      },
      {
        "s": "1 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 2804,
    "n": "Leavening agents, baking powder, low-sodium",
    "ms": [
      {
        "s": "1 tsp",
        "c": 217
      },
      {
        "s": "0.5 tsp",
        "c": 108
      }
    ]
  },
  {
    "i": 2806,
    "n": "Wonton wrappers (includes egg roll wrappers)",
    "ms": [
      {
        "s": "1 wrapper, wonton (3-1/2 square)",
        "c": 3.76
      },
      {
        "s": "1 oz",
        "c": 13.3
      },
      {
        "s": "1 wrapper, eggroll (7 square)",
        "c": 15
      }
    ]
  },
  {
    "i": 2807,
    "n": "Sweet rolls, cinnamon, refrigerated dough with frosting, baked",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.64
      },
      {
        "s": "1 roll",
        "c": 10.2
      }
    ]
  },
  {
    "i": 2808,
    "n": "Leavening agents, baking powder, double-acting, sodium aluminum sulfate",
    "ms": [
      {
        "s": "1 tsp",
        "c": 270
      },
      {
        "s": "0.5 tsp",
        "c": 135
      }
    ]
  },
  {
    "i": 2809,
    "n": "Taco shells, baked",
    "ms": [
      {
        "s": "1 taco",
        "c": 12.7
      },
      {
        "s": "1 medium (approx 5 dia)",
        "c": 13.3
      },
      {
        "s": "1 oz",
        "c": 28.4
      },
      {
        "s": "1 large (6-1/2 dia)",
        "c": 21
      },
      {
        "s": "1 miniature (3 dia)",
        "c": 5
      },
      {
        "s": "1 shell",
        "c": 12.9
      }
    ]
  },
  {
    "i": 2810,
    "n": "Toaster pastries, brown-sugar-cinnamon",
    "ms": [
      {
        "s": "1 pastry",
        "c": 149
      },
      {
        "s": "1 oz",
        "c": 83.1
      }
    ]
  },
  {
    "i": 2811,
    "n": "Leavening agents, baking powder, double-acting, straight phosphate",
    "ms": [
      {
        "s": "1 tsp",
        "c": 339
      },
      {
        "s": "0.5 tsp",
        "c": 169
      }
    ]
  },
  {
    "i": 2812,
    "n": "Rolls, dinner, whole-wheat",
    "ms": [
      {
        "s": "1 roll (1 oz)",
        "c": 29.7
      },
      {
        "s": "1 medium (2-1/2 dia)",
        "c": 38.2
      },
      {
        "s": "1 roll medium submarine, hoagie",
        "c": 99.6
      },
      {
        "s": "1 roll (hamburger, frankfurter roll)",
        "c": 45.6
      },
      {
        "s": "1 roll (small submarine, hoagie roll)",
        "c": 68.9
      },
      {
        "s": "1 roll, large submarine, hoagie",
        "c": 143
      }
    ]
  },
  {
    "i": 2813,
    "n": "Rolls, hamburger or hotdog, mixed-grain",
    "ms": [
      {
        "s": "1 roll",
        "c": 40.8
      },
      {
        "s": "1 oz",
        "c": 26.9
      }
    ]
  },
  {
    "i": 2814,
    "n": "Rolls, hamburger or hotdog, plain",
    "ms": [
      {
        "s": "1 roll 1 serving",
        "c": 63.4
      },
      {
        "s": "1 oz",
        "c": 40.8
      }
    ]
  },
  {
    "i": 2815,
    "n": "Rolls, french",
    "ms": [
      {
        "s": "1 roll",
        "c": 34.6
      },
      {
        "s": "1 oz",
        "c": 25.8
      }
    ]
  },
  {
    "i": 2820,
    "n": "Phyllo dough",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      },
      {
        "s": "1 sheet dough",
        "c": 2.09
      }
    ]
  },
  {
    "i": 2826,
    "n": "Pie, egg custard, commercially prepared",
    "ms": [
      {
        "s": "1 piece (1/6 of 8 pie)",
        "c": 84
      },
      {
        "s": "1 oz",
        "c": 22.7
      }
    ]
  },
  {
    "i": 2829,
    "n": "Pie, fried pies, fruit",
    "ms": [
      {
        "s": "1 pie (5 x 3-3/4)",
        "c": 28.2
      },
      {
        "s": "1 oz",
        "c": 6.24
      }
    ]
  },
  {
    "i": 2833,
    "n": "Pancakes, special dietary, dry mix",
    "ms": [
      {
        "s": "1 package (8 oz)",
        "c": 225
      },
      {
        "s": "1 oz",
        "c": 28.1
      }
    ]
  },
  {
    "i": 2838,
    "n": "Muffins, wheat bran, dry mix",
    "ms": [
      {
        "s": "1 package (7 oz)",
        "c": 71.3
      },
      {
        "s": "1 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 2839,
    "n": "Muffins, oat bran",
    "ms": [
      {
        "s": "1 oz",
        "c": 17.9
      },
      {
        "s": "1 large",
        "c": 87.6
      },
      {
        "s": "1 medium",
        "c": 71.2
      },
      {
        "s": "1 mini",
        "c": 10.7
      },
      {
        "s": "1 small",
        "c": 41.6
      },
      {
        "s": "1 extra large",
        "c": 106
      }
    ]
  },
  {
    "i": 2840,
    "n": "Pancakes, buckwheat, dry mix, incomplete",
    "ms": [
      {
        "s": "1 cup, poured from box",
        "c": 581
      },
      {
        "s": "1 oz",
        "c": 135
      }
    ]
  },
  {
    "i": 2842,
    "n": "Muffins, blueberry, prepared from recipe, made with low fat (2%) milk",
    "ms": [
      {
        "s": "1 muffin",
        "c": 108
      },
      {
        "s": "1 oz",
        "c": 53.6
      }
    ]
  },
  {
    "i": 2843,
    "n": "Muffins, blueberry, dry mix",
    "ms": [
      {
        "s": "1 serving",
        "c": 7.74
      },
      {
        "s": "1 package, mix + drained berries",
        "c": 64.1
      },
      {
        "s": "1 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2844,
    "n": "Muffins, plain, prepared from recipe, made with low fat (2%) milk",
    "ms": [
      {
        "s": "1 oz",
        "c": 56.7
      },
      {
        "s": "1 muffin",
        "c": 114
      }
    ]
  },
  {
    "i": 2847,
    "n": "Muffins, blueberry, toaster-type",
    "ms": [
      {
        "s": "1 muffin, toaster",
        "c": 4.29
      },
      {
        "s": "1 oz",
        "c": 3.69
      }
    ]
  },
  {
    "i": 2849,
    "n": "Muffins, English, raisin-cinnamon, toasted (includes apple-cinnamon)",
    "ms": [
      {
        "s": "1 muffin",
        "c": 72.3
      },
      {
        "s": "1 oz",
        "c": 39.4
      }
    ]
  },
  {
    "i": 2850,
    "n": "Muffins, English, whole-wheat",
    "ms": [
      {
        "s": "1 muffin",
        "c": 175
      },
      {
        "s": "1 oz",
        "c": 75.1
      }
    ]
  },
  {
    "i": 2851,
    "n": "Doughnuts, yeast-leavened, with jelly filling",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.09
      },
      {
        "s": "1 doughnut oval (3-1/2 x 2-1/2)",
        "c": 21.2
      }
    ]
  },
  {
    "i": 2852,
    "n": "Muffins, English, wheat",
    "ms": [
      {
        "s": "1 muffin",
        "c": 101
      },
      {
        "s": "1 oz",
        "c": 50.5
      }
    ]
  },
  {
    "i": 2853,
    "n": "Doughnuts, french crullers, glazed",
    "ms": [
      {
        "s": "1 cruller (3 dia)",
        "c": 10.7
      },
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 2856,
    "n": "Doughnuts, yeast-leavened, with creme filling",
    "ms": [
      {
        "s": "1 doughnut oval (3-1/2 x 2-1/2)",
        "c": 21.2
      },
      {
        "s": "1 oz",
        "c": 7.09
      }
    ]
  },
  {
    "i": 2857,
    "n": "Danish pastry, cheese",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.92
      },
      {
        "s": "1 pastry",
        "c": 24.8
      }
    ]
  },
  {
    "i": 2858,
    "n": "Croutons, seasoned",
    "ms": [
      {
        "s": "1 package, fast food",
        "c": 9.6
      },
      {
        "s": "1 cup",
        "c": 38.4
      },
      {
        "s": "4 cubes",
        "c": 0.96
      },
      {
        "s": "0.5 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 2859,
    "n": "Cracker, meal",
    "ms": [
      {
        "s": "1 cup",
        "c": 26.4
      },
      {
        "s": "1 oz",
        "c": 6.52
      }
    ]
  },
  {
    "i": 2860,
    "n": "Crackers, wheat, sandwich, with peanut butter filling",
    "ms": [
      {
        "s": "1 cracker, sandwich",
        "c": 11.9
      },
      {
        "s": "0.5 oz",
        "c": 24.1
      }
    ]
  },
  {
    "i": 2861,
    "n": "Croutons, plain",
    "ms": [
      {
        "s": "1 cup",
        "c": 22.8
      },
      {
        "s": "0.5 oz",
        "c": 10.8
      }
    ]
  },
  {
    "i": 2862,
    "n": "Crackers, whole-wheat",
    "ms": [
      {
        "s": "1 cup, crushed",
        "c": 33.8
      },
      {
        "s": "10 Triscuit Bits",
        "c": 3.6
      },
      {
        "s": "0.5 oz",
        "c": 5.11
      },
      {
        "s": "6 crackers, Triscuits, regular size",
        "c": 10.1
      },
      {
        "s": "1 cracker",
        "c": 1.66
      },
      {
        "s": "1 serving",
        "c": 10.1
      }
    ]
  },
  {
    "i": 2863,
    "n": "Crackers, wheat, sandwich, with cheese filling",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 29
      },
      {
        "s": "1 cracker, sandwich",
        "c": 14.3
      }
    ]
  },
  {
    "i": 2864,
    "n": "Crackers, rye, sandwich-type with cheese filling",
    "ms": [
      {
        "s": "1 cracker, sandwich",
        "c": 15.5
      },
      {
        "s": "0.5 oz",
        "c": 31.5
      }
    ]
  },
  {
    "i": 2865,
    "n": "Crackers, rye, wafers, seasoned",
    "ms": [
      {
        "s": "1 cracker, triple",
        "c": 9.68
      },
      {
        "s": "0.5 oz",
        "c": 6.25
      }
    ]
  },
  {
    "i": 2866,
    "n": "Crackers, saltines (includes oyster, soda, soup)",
    "ms": [
      {
        "s": "1 cracker, rectangle",
        "c": 1.14
      },
      {
        "s": "1 cracker, oyster",
        "c": 0.19
      },
      {
        "s": "0.5 oz",
        "c": 2.7
      },
      {
        "s": "1 cracker, round large",
        "c": 1.9
      },
      {
        "s": "5 crackers square (1 serving)",
        "c": 2.85
      },
      {
        "s": "1 cup, crushed",
        "c": 13.3
      },
      {
        "s": "5 crackers",
        "c": 2.83
      },
      {
        "s": "1 cup oyster crackers",
        "c": 8.55
      },
      {
        "s": "1 cracker square",
        "c": 0.57
      }
    ]
  },
  {
    "i": 2867,
    "n": "Crackers, rye, wafers, plain",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 5.68
      },
      {
        "s": "1 cracker, triple",
        "c": 10
      },
      {
        "s": "1 cracker (4-1/2 x 2-1/2 x 1/8)",
        "c": 4.4
      },
      {
        "s": "1 cup, crushed",
        "c": 24.4
      }
    ]
  },
  {
    "i": 2868,
    "n": "Crackers, matzo, whole-wheat",
    "ms": [
      {
        "s": "1 matzo",
        "c": 6.44
      },
      {
        "s": "0.5 oz",
        "c": 3.27
      }
    ]
  },
  {
    "i": 2869,
    "n": "Crackers, matzo, egg",
    "ms": [
      {
        "s": "1 matzo",
        "c": 11.2
      },
      {
        "s": "0.5 oz",
        "c": 5.68
      }
    ]
  },
  {
    "i": 2870,
    "n": "Cookies, vanilla sandwich with creme filling",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.65
      },
      {
        "s": "1 cookie, oval (3-1/8 x 1-1/4 x 3/8)",
        "c": 4.05
      },
      {
        "s": "1 cookie, round (1-3/4 dia)",
        "c": 2.7
      }
    ]
  },
  {
    "i": 2871,
    "n": "Cookies, sugar wafers with creme filling, regular",
    "ms": [
      {
        "s": "3 cookies",
        "c": 9.72
      },
      {
        "s": "1 oz",
        "c": 7.65
      },
      {
        "s": "1 cookie",
        "c": 2.73
      }
    ]
  },
  {
    "i": 2873,
    "n": "Crackers, crispbread, rye",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 4.4
      },
      {
        "s": "1 wafer, thin",
        "c": 0.62
      },
      {
        "s": "1 wafer, Rye Krisp (triple cracker)",
        "c": 7.75
      },
      {
        "s": "1 cracker, Norwegian flatbread (4-3/4 x 2-3/4 x 1/16)",
        "c": 1.8
      },
      {
        "s": "1 crispbread, Wasa rye",
        "c": 3.1
      },
      {
        "s": "1 crispbread",
        "c": 3.1
      },
      {
        "s": "1 cup, crushed",
        "c": 17
      },
      {
        "s": "1 wafer",
        "c": 3.1
      }
    ]
  },
  {
    "i": 2874,
    "n": "Crackers, matzo, plain",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 1.85
      },
      {
        "s": "1 matzo",
        "c": 3.64
      }
    ]
  },
  {
    "i": 2875,
    "n": "Cookies, brownies, dry mix, sugar free",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.4
      },
      {
        "s": "1 package (8.5 oz)",
        "c": 28.9
      }
    ]
  },
  {
    "i": 2878,
    "n": "Cookies, peanut butter, refrigerated dough, baked",
    "ms": [
      {
        "s": "1 oz",
        "c": 31.5
      },
      {
        "s": "1 cookie",
        "c": 13.3
      }
    ]
  },
  {
    "i": 2879,
    "n": "Cookies, chocolate sandwich, with creme filling, special dietary",
    "ms": [
      {
        "s": "1 cookie",
        "c": 9.8
      },
      {
        "s": "1 oz",
        "c": 27.8
      }
    ]
  },
  {
    "i": 2883,
    "n": "Cookies, peanut butter, commercially prepared, soft-type",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.4
      },
      {
        "s": "1 cookie",
        "c": 1.8
      }
    ]
  },
  {
    "i": 2884,
    "n": "Cookies, molasses",
    "ms": [
      {
        "s": "1 large (3-1/2 to 4 dia) (include Archway brand)",
        "c": 23.7
      },
      {
        "s": "1 oz",
        "c": 21
      },
      {
        "s": "1 medium",
        "c": 11.1
      },
      {
        "s": "1 cookie, Little Debbie",
        "c": 14.8
      }
    ]
  },
  {
    "i": 2886,
    "n": "Cookies, peanut butter, commercially prepared, regular",
    "ms": [
      {
        "s": "1 cookie",
        "c": 12.7
      },
      {
        "s": "1 oz",
        "c": 11.6
      }
    ]
  },
  {
    "i": 2887,
    "n": "Cookies, chocolate sandwich, with creme filling, regular, chocolate-coated",
    "ms": [
      {
        "s": "1 cookie",
        "c": 5.95
      },
      {
        "s": "1 oz",
        "c": 9.92
      }
    ]
  },
  {
    "i": 2888,
    "n": "Cookies, fortune",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.4
      },
      {
        "s": "1 cookie",
        "c": 0.96
      }
    ]
  },
  {
    "i": 2889,
    "n": "Cookies, chocolate sandwich, with creme filling, regular",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.95
      },
      {
        "s": "3 cookie",
        "c": 7.56
      }
    ]
  },
  {
    "i": 2890,
    "n": "Cookies, fig bars",
    "ms": [
      {
        "s": "1 cookie",
        "c": 10.2
      },
      {
        "s": "1 individual package (2 oz package containing 2 3 bars)",
        "c": 36.5
      },
      {
        "s": "1 Figaroo (2 square halves)",
        "c": 27.5
      },
      {
        "s": "1 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 2891,
    "n": "Cookies, marshmallow, chocolate-coated (includes marshmallow pies)",
    "ms": [
      {
        "s": "1 Fudge Marshmallow",
        "c": 12.9
      },
      {
        "s": "1 cookie, small (1-3/4 dia x 3/4)",
        "c": 5.98
      },
      {
        "s": "1 oz",
        "c": 13
      },
      {
        "s": "1 pie, marshmallow (3 dia x 3/4)",
        "c": 17.9
      }
    ]
  },
  {
    "i": 2892,
    "n": "Cookies, chocolate sandwich, with extra creme filling",
    "ms": [
      {
        "s": "1 cookie",
        "c": 2.08
      },
      {
        "s": "1 oz",
        "c": 4.54
      }
    ]
  },
  {
    "i": 2893,
    "n": "Cookies, chocolate wafers",
    "ms": [
      {
        "s": "1 wafer",
        "c": 1.86
      },
      {
        "s": "1 cup, crumbs",
        "c": 34.7
      },
      {
        "s": "1 oz",
        "c": 8.79
      }
    ]
  },
  {
    "i": 2904,
    "n": "Cake, pound, commercially prepared, butter (includes fresh and frozen)",
    "ms": [
      {
        "s": "1 piece individually wrapped cake",
        "c": 23
      },
      {
        "s": "0.16 loaf 1/6 of the loaf",
        "c": 28.7
      }
    ]
  },
  {
    "i": 2906,
    "n": "Cake, white, dry mix, special dietary (includes lemon-flavored)",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.37
      },
      {
        "s": "1 package (8 oz)",
        "c": 59
      }
    ]
  },
  {
    "i": 2908,
    "n": "Cake, gingerbread, dry mix",
    "ms": [
      {
        "s": "1 package (14.5 oz)",
        "c": 386
      },
      {
        "s": "1 oz",
        "c": 26.6
      }
    ]
  },
  {
    "i": 2914,
    "n": "Cake, coffeecake, cheese",
    "ms": [
      {
        "s": "1 oz",
        "c": 16.7
      },
      {
        "s": "1 piece (1/6 of 16 oz cake)",
        "c": 44.8
      }
    ]
  },
  {
    "i": 2915,
    "n": "Bread, stuffing, cornbread, dry mix",
    "ms": [
      {
        "s": "1 package (6 oz)",
        "c": 133
      },
      {
        "s": "1 oz",
        "c": 22.1
      }
    ]
  },
  {
    "i": 2916,
    "n": "Bread, whole-wheat, prepared from recipe",
    "ms": [
      {
        "s": "1 slice, thin (3-3/4 x 5 x 3/8)",
        "c": 10.9
      },
      {
        "s": "1 oz",
        "c": 9.36
      },
      {
        "s": "1 slice, regular (4 x 5 x 3/4)",
        "c": 15.2
      }
    ]
  },
  {
    "i": 2919,
    "n": "Bread, whole-wheat, prepared from recipe, toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 10.2
      },
      {
        "s": "1 slice, thin (3-3/4 x 5 x 3/8)",
        "c": 10.8
      },
      {
        "s": "1 slice",
        "c": 15.1
      }
    ]
  },
  {
    "i": 2921,
    "n": "Bread, wheat, toasted",
    "ms": [
      {
        "s": "1 slice",
        "c": 39.6
      },
      {
        "s": "1 oz",
        "c": 46.8
      }
    ]
  },
  {
    "i": 2922,
    "n": "Bread, whole-wheat, commercially prepared, toasted",
    "ms": [
      {
        "s": "1 slice",
        "c": 32.5
      },
      {
        "s": "1 oz",
        "c": 36.9
      }
    ]
  },
  {
    "i": 2923,
    "n": "Bread, wheat",
    "ms": [
      {
        "s": "1 slice",
        "c": 36.2
      }
    ]
  },
  {
    "i": 2924,
    "n": "Bread, whole-wheat, commercially prepared",
    "ms": [
      {
        "s": "1 slice",
        "c": 51.5
      },
      {
        "s": "1 oz",
        "c": 45.6
      }
    ]
  },
  {
    "i": 2925,
    "n": "Bread, reduced-calorie, oat bran, toasted",
    "ms": [
      {
        "s": "1 slice",
        "c": 12.9
      },
      {
        "s": "1 oz",
        "c": 19.3
      }
    ]
  },
  {
    "i": 2926,
    "n": "Bread, rye",
    "ms": [
      {
        "s": "1 slice, regular",
        "c": 23.4
      },
      {
        "s": "1 oz",
        "c": 20.7
      },
      {
        "s": "1 slice, thin",
        "c": 18.2
      },
      {
        "s": "1 slice, snack-size",
        "c": 5.11
      }
    ]
  },
  {
    "i": 2927,
    "n": "Bread, rye, toasted",
    "ms": [
      {
        "s": "1 slice, large",
        "c": 23.2
      },
      {
        "s": "1 oz",
        "c": 22.7
      },
      {
        "s": "1 slice, thin",
        "c": 14.4
      },
      {
        "s": "1 slice, regular",
        "c": 19.2
      }
    ]
  },
  {
    "i": 2929,
    "n": "Bread, raisin, enriched, toasted",
    "ms": [
      {
        "s": "1 slice, thin",
        "c": 15.1
      },
      {
        "s": "1 slice, large",
        "c": 20.9
      },
      {
        "s": "1 slice",
        "c": 17.3
      },
      {
        "s": "1 oz",
        "c": 20.4
      }
    ]
  },
  {
    "i": 2930,
    "n": "Bread, reduced-calorie, oat bran",
    "ms": [
      {
        "s": "1 slice",
        "c": 13.1
      },
      {
        "s": "1 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 2931,
    "n": "Bread, oat bran, toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 20.1
      },
      {
        "s": "1 slice",
        "c": 19.2
      }
    ]
  },
  {
    "i": 2932,
    "n": "Bread, french or vienna (includes sourdough)",
    "ms": [
      {
        "s": "1 slice",
        "c": 72.3
      },
      {
        "s": "1 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 2933,
    "n": "Bread, oatmeal, toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 20.4
      },
      {
        "s": "1 slice",
        "c": 18
      }
    ]
  },
  {
    "i": 2934,
    "n": "Bread, oatmeal",
    "ms": [
      {
        "s": "1 oz",
        "c": 18.7
      },
      {
        "s": "1 slice",
        "c": 17.8
      }
    ]
  },
  {
    "i": 2935,
    "n": "Bread, oat bran",
    "ms": [
      {
        "s": "1 oz",
        "c": 18.4
      },
      {
        "s": "1 slice",
        "c": 19.5
      }
    ]
  },
  {
    "i": 2936,
    "n": "Biscuits, mixed grain, refrigerated dough",
    "ms": [
      {
        "s": "1 biscuit (2-1/2 dia)",
        "c": 7.48
      },
      {
        "s": "1 oz",
        "c": 4.82
      }
    ]
  },
  {
    "i": 2937,
    "n": "Bread, egg",
    "ms": [
      {
        "s": "1 slice (5 x 3 x 1/2)",
        "c": 37.2
      },
      {
        "s": "1 oz",
        "c": 26.4
      }
    ]
  },
  {
    "i": 2938,
    "n": "Bread, cracked-wheat",
    "ms": [
      {
        "s": "1 slice, large or thick",
        "c": 12.9
      },
      {
        "s": "1 slice, thin",
        "c": 8.6
      },
      {
        "s": "1 slice, regular",
        "c": 10.8
      },
      {
        "s": "1 slice thin, crust not eaten",
        "c": 4.04
      },
      {
        "s": "1 cubic inch",
        "c": 1.38
      },
      {
        "s": "1 oz",
        "c": 12.2
      },
      {
        "s": "1 slice regular, crust not eaten",
        "c": 5.25
      },
      {
        "s": "1 slice",
        "c": 10.8
      }
    ]
  },
  {
    "i": 2940,
    "n": "Bread, egg, toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 28.9
      },
      {
        "s": "1 slice (5 x 3 x 1/2)",
        "c": 37.7
      }
    ]
  },
  {
    "i": 2941,
    "n": "Biscuits, plain or buttermilk, refrigerated dough, higher fat, baked",
    "ms": [
      {
        "s": "1 biscuit",
        "c": 13.8
      },
      {
        "s": "1 oz",
        "c": 7.65
      },
      {
        "s": "1 biscuit (2-1/2 dia)",
        "c": 7.29
      }
    ]
  },
  {
    "i": 2943,
    "n": "Bagels, cinnamon-raisin",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.39
      },
      {
        "s": "1 mini bagel (2-1/2 dia)",
        "c": 4.94
      },
      {
        "s": "1 large bagel (4-1/2 dia)",
        "c": 24.9
      },
      {
        "s": "1 medium bagel (3-1/2 to 4 dia)",
        "c": 20
      },
      {
        "s": "1 small bagel (3 dia)",
        "c": 13.1
      }
    ]
  },
  {
    "i": 2945,
    "n": "Bagels, oat bran",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.4
      },
      {
        "s": "1 mini bagel (2-1/2 dia)",
        "c": 3.12
      },
      {
        "s": "1 small bagel (3 dia)",
        "c": 8.28
      },
      {
        "s": "1 large bagel (4-1/2 dia)",
        "c": 15.7
      },
      {
        "s": "1 medium bagel (3-1/2 to 4 dia)",
        "c": 12.6
      }
    ]
  },
  {
    "i": 2947,
    "n": "Bagels, cinnamon-raisin, toasted",
    "ms": [
      {
        "s": "1 small bagel (3-1/2 to 4dia)",
        "c": 13
      },
      {
        "s": "1 large bagel (4-1/2 dia)",
        "c": 24.6
      },
      {
        "s": "1 medium bagel (4 dia)",
        "c": 19.8
      },
      {
        "s": "1 oz",
        "c": 5.67
      },
      {
        "s": "1 mini bagel (2-1/2 dia)",
        "c": 4.8
      }
    ]
  },
  {
    "i": 2948,
    "n": "Lamb, Australian, imported, fresh, leg, bottom, boneless, separable lean and fat, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "1 leg bottom, boneless",
        "c": 29.7
      },
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 2951,
    "n": "Lamb, Australian, Imported, Fresh, Tenderloin, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 2.26
      },
      {
        "s": "1 roast",
        "c": 2.92
      }
    ]
  },
  {
    "i": 2954,
    "n": "Lamb, Australian, imported, fresh, seam fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 2956,
    "n": "Lamb, Australian, Imported, Fresh, Leg, Trotter Off, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "1 leg trotter off",
        "c": 80.2
      },
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 2957,
    "n": "Veal, foreshank, osso buco, separable lean and fat, cooked, braised",
    "ms": [
      {
        "s": "1 shank cross cut",
        "c": 41.1
      },
      {
        "s": "3 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 2961,
    "n": "Veal, loin, chop, separable lean and fat, cooked, grilled",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      },
      {
        "s": "1 chop",
        "c": 26
      }
    ]
  },
  {
    "i": 2962,
    "n": "Veal, shank, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 shank whole",
        "c": 152
      },
      {
        "s": "1 serving",
        "c": 13.6
      }
    ]
  },
  {
    "i": 2969,
    "n": "Lamb, New Zealand, Imported, Rack - Fully Frenched, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 2970,
    "n": "Veal, leg, top round, cap off, cutlet, boneless, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 cutlet",
        "c": 2.2
      },
      {
        "s": "1 serving",
        "c": 4.52
      }
    ]
  },
  {
    "i": 2973,
    "n": "Lamb, New Zealand, Imported, Netted Shoulder, Rolled, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 2975,
    "n": "Lamb, New Zealand, Imported, Tenderloin, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2989,
    "n": "Lamb, New Zealand, imported, tongue - swiss cut, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 2990,
    "n": "Lamb, New Zealand, imported, tongue - swiss cut, cooked, soaked and simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 2992,
    "n": "Lamb, New Zealand, imported, testes, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 2993,
    "n": "Lamb, New Zealand, imported, testes, cooked, soaked and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 2994,
    "n": "Lamb, New Zealand, imported, ground lamb, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 2995,
    "n": "Lamb, New Zealand, imported, chump, boneless, separable lean only, cooked, fast roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 2996,
    "n": "Lamb, New Zealand, imported, liver, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 2998,
    "n": "Lamb, New Zealand, imported, liver, cooked, soaked and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 2999,
    "n": "Lamb, New Zealand, imported, breast, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 3000,
    "n": "Veal, Australian, shank, hind, bone-in, separable lean and fat, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 13.6
      },
      {
        "s": "1 roast with bone",
        "c": 52.8
      }
    ]
  },
  {
    "i": 3002,
    "n": "Lamb, Australian, ground,  85% lean / 15% fat, raw",
    "ms": [
      {
        "s": "1 serving (4 oz)",
        "c": 10.2
      }
    ]
  },
  {
    "i": 3020,
    "n": "Lamb, Australian, Imported, Fresh, Loin, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 12.8
      },
      {
        "s": "1 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 3024,
    "n": "Lamb, Australian, Imported, Fresh, Rib Chop, Frenched, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 chop",
        "c": 5.94
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 26.5
      }
    ]
  },
  {
    "i": 3025,
    "n": "Lamb, Australian, imported, fresh, leg, shank half, separable lean only, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 oz",
        "c": 1.98
      },
      {
        "s": "1 lb",
        "c": 31.8
      }
    ]
  },
  {
    "i": 3028,
    "n": "Lamb, Australian, imported, fresh, leg, sirloin chops, boneless, separable lean only, trimmed to 1/8 fat, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 3034,
    "n": "Lamb, Australian, imported, fresh, separable fat, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.39
      },
      {
        "s": "3 oz",
        "c": 16.2
      },
      {
        "s": "1 lb",
        "c": 86.2
      }
    ]
  },
  {
    "i": 3044,
    "n": "Veal, breast, separable fat, cooked",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.7
      }
    ]
  },
  {
    "i": 3059,
    "n": "Lamb, leg, sirloin half, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "1 lb",
        "c": 45.4
      }
    ]
  },
  {
    "i": 3061,
    "n": "Lamb, foreshank, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      },
      {
        "s": "1 lb",
        "c": 49.9
      }
    ]
  },
  {
    "i": 3070,
    "n": "Veal, variety meats and by-products, thymus, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 0.85
      },
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 3071,
    "n": "Veal, variety meats and by-products, spleen, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 oz",
        "c": 1.7
      }
    ]
  },
  {
    "i": 3072,
    "n": "Veal, variety meats and by-products, liver, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 lb",
        "c": 22.6
      }
    ]
  },
  {
    "i": 3075,
    "n": "Lamb, variety meats and by-products, mechanically separated, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 45.9
      },
      {
        "s": "8 oz",
        "c": 368
      }
    ]
  },
  {
    "i": 3078,
    "n": "Lamb, variety meats and by-products, pancreas, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 3081,
    "n": "Lamb, variety meats and by-products, liver, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 3082,
    "n": "Lamb, variety meats and by-products, brain, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      },
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 3083,
    "n": "Veal, variety meats and by-products, heart, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.42
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 3084,
    "n": "Lamb, variety meats and by-products, heart, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 oz",
        "c": 1.7
      }
    ]
  },
  {
    "i": 3099,
    "n": "Lamb, New Zealand, Imported, Fore-Shank, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 serving",
        "c": 8.05
      }
    ]
  },
  {
    "i": 3103,
    "n": "Lamb, cubed for stew or kabob (leg and shoulder), separable lean only, trimmed to 1/4 fat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 40.8
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 3121,
    "n": "Lamb, foreshank, separable lean only, trimmed to 1/4 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      },
      {
        "s": "1 lb",
        "c": 40.8
      }
    ]
  },
  {
    "i": 3134,
    "n": "Peanut butter with omega-3, creamy",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.2
      }
    ]
  },
  {
    "i": 3138,
    "n": "Soy sauce, reduced sodium, made from hydrolyzed vegetable protein",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 6.38
      },
      {
        "s": "1 tsp",
        "c": 0.539
      },
      {
        "s": "1 tbsp",
        "c": 1.65
      }
    ]
  },
  {
    "i": 3144,
    "n": "Peanut Butter, Smooth Style, With*",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 15.7
      },
      {
        "s": "1 cup",
        "c": 126
      }
    ]
  },
  {
    "i": 3146,
    "n": "Peanut spread, reduced sugar",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 22.3
      }
    ]
  },
  {
    "i": 3149,
    "n": "Peanut butter, smooth, reduced fat",
    "ms": [
      {
        "s": "2 tablespoon",
        "c": 12.6
      }
    ]
  },
  {
    "i": 3151,
    "n": "Peanut butter, smooth, vitamin and mineral fortified",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 13.8
      },
      {
        "s": "1 cup",
        "c": 111
      }
    ]
  },
  {
    "i": 3153,
    "n": "Peanut butter, chunky, vitamin and mineral fortified",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 14.4
      },
      {
        "s": "1 cup",
        "c": 116
      }
    ]
  },
  {
    "i": 3155,
    "n": "Okara",
    "ms": [
      {
        "s": "1 cup",
        "c": 97.6
      }
    ]
  },
  {
    "i": 3156,
    "n": "Soymilk, original and vanilla, with added calcium, vitamins A and D",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 37.6
      },
      {
        "s": "1 cup",
        "c": 299
      }
    ]
  },
  {
    "i": 3158,
    "n": "Tofu, fried",
    "ms": [
      {
        "s": "1 piece",
        "c": 48.4
      },
      {
        "s": "1 oz",
        "c": 105
      }
    ]
  },
  {
    "i": 3161,
    "n": "Soy meal, defatted, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 298
      }
    ]
  },
  {
    "i": 3164,
    "n": "Soymilk, original and vanilla, unfortified",
    "ms": [
      {
        "s": "1 cup",
        "c": 60.8
      },
      {
        "s": "1 fl oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 3165,
    "n": "Soy protein concentrate, produced by alcohol extraction",
    "ms": [
      {
        "s": "1 oz",
        "c": 103
      }
    ]
  },
  {
    "i": 3166,
    "n": "Soy flour, low-fat",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 15.7
      },
      {
        "s": "1 cup, stirred",
        "c": 251
      }
    ]
  },
  {
    "i": 3167,
    "n": "Bacon, meatless",
    "ms": [
      {
        "s": "1 oz cooked, yield",
        "c": 3.68
      },
      {
        "s": "1 strip",
        "c": 1.15
      },
      {
        "s": "1 cup",
        "c": 33.1
      }
    ]
  },
  {
    "i": 3169,
    "n": "Miso",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 9.69
      },
      {
        "s": "1 cup",
        "c": 157
      }
    ]
  },
  {
    "i": 3170,
    "n": "Natto",
    "ms": [
      {
        "s": "1 cup",
        "c": 380
      }
    ]
  },
  {
    "i": 3171,
    "n": "Soybeans, mature seeds, dry roasted",
    "ms": [
      {
        "s": "1 cup",
        "c": 130
      }
    ]
  },
  {
    "i": 3173,
    "n": "Pigeon peas (red gram), mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 266
      }
    ]
  },
  {
    "i": 3174,
    "n": "Peanuts, virginia, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 130
      },
      {
        "s": "1 oz",
        "c": 25.2
      }
    ]
  },
  {
    "i": 3177,
    "n": "Peanut flour, low fat",
    "ms": [
      {
        "s": "1 cup",
        "c": 78
      },
      {
        "s": "1 oz",
        "c": 36.9
      }
    ]
  },
  {
    "i": 3178,
    "n": "Peanuts, valencia, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 17.6
      },
      {
        "s": "1 cup",
        "c": 90.5
      }
    ]
  },
  {
    "i": 3180,
    "n": "Peanuts, all types, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 134
      },
      {
        "s": "1 oz",
        "c": 26.1
      }
    ]
  },
  {
    "i": 3183,
    "n": "Peas, green, split, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 90.2
      }
    ]
  },
  {
    "i": 3184,
    "n": "Lentils, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 67.2
      },
      {
        "s": "1 tablespoon",
        "c": 4.2
      }
    ]
  },
  {
    "i": 3185,
    "n": "Mothbeans, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 294
      }
    ]
  },
  {
    "i": 3186,
    "n": "Lentils, Mature Seeds, Cooked, Boiled, With*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.34
      },
      {
        "s": "1 cup",
        "c": 37.6
      }
    ]
  },
  {
    "i": 3188,
    "n": "Lupins, mature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 317
      }
    ]
  },
  {
    "i": 3192,
    "n": "Guinea hen, meat and skin, raw",
    "ms": [
      {
        "s": "0.5 guinea",
        "c": 38
      },
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook guinea)",
        "c": 39.5
      }
    ]
  },
  {
    "i": 3194,
    "n": "Goose, domesticated, meat only, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook goose)",
        "c": 24
      },
      {
        "s": "0.5 goose",
        "c": 99.6
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 3195,
    "n": "Quail, meat and skin, raw",
    "ms": [
      {
        "s": "1 quail",
        "c": 14.2
      },
      {
        "s": "1 unit (yield from 1 lb ready-to cook quail)",
        "c": 52.6
      }
    ]
  },
  {
    "i": 3196,
    "n": "Goose, liver, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook goose)",
        "c": 4.73
      },
      {
        "s": "1 liver",
        "c": 40.4
      }
    ]
  },
  {
    "i": 3197,
    "n": "Quail, meat only, raw",
    "ms": [
      {
        "s": "1 quail",
        "c": 12
      },
      {
        "s": "1 unit (yield from 1 lb ready-to cook quail)",
        "c": 44.5
      }
    ]
  },
  {
    "i": 3198,
    "n": "Duck, domesticated, meat and skin, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "0.5 duck",
        "c": 69.7
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 31.6
      }
    ]
  },
  {
    "i": 3199,
    "n": "Duck, domesticated, meat only, raw",
    "ms": [
      {
        "s": "0.5 duck",
        "c": 33.3
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 15.1
      }
    ]
  },
  {
    "i": 3204,
    "n": "Chicken, stewing, dark meat, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 16.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 8.76
      }
    ]
  },
  {
    "i": 3205,
    "n": "Chicken, stewing, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "0.5 chicken, bone removed",
        "c": 33.9
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 23.1
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 3206,
    "n": "Chicken, stewing, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 18.2
      },
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 17.8
      }
    ]
  },
  {
    "i": 3207,
    "n": "Chicken, stewing, dark meat, meat only, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 10.5
      },
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 15.4
      }
    ]
  },
  {
    "i": 3208,
    "n": "Chicken, capons, meat and skin and giblets and neck, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 capon",
        "c": 237
      }
    ]
  },
  {
    "i": 3209,
    "n": "Chicken, stewing, meat only, raw",
    "ms": [
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 28.4
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 19.4
      },
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 3211,
    "n": "Chicken, roasting, light meat, meat only, raw",
    "ms": [
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 24.2
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 10.9
      }
    ]
  },
  {
    "i": 3212,
    "n": "Chicken, roasting, giblets, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.5
      },
      {
        "s": "1 giblets",
        "c": 11.3
      }
    ]
  },
  {
    "i": 3213,
    "n": "Chicken, roasting, giblets, cooked, simmered",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 1.8
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 17.4
      }
    ]
  },
  {
    "i": 3214,
    "n": "Chicken, stewing, meat and skin, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 27.1
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 39.8
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 3215,
    "n": "Chicken, stewing, meat and skin, and giblets and neck, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 20.8
      },
      {
        "s": "1 chicken, bone removed",
        "c": 77.1
      },
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 26.3
      }
    ]
  },
  {
    "i": 3216,
    "n": "Chicken, roasting, meat and skin and giblets and neck, raw",
    "ms": [
      {
        "s": "1 chicken",
        "c": 151
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 3219,
    "n": "Chicken, broilers or fryers, wing, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 18.2
      },
      {
        "s": "1 wing, bone and skin removed",
        "c": 3.12
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 1.82
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 3220,
    "n": "Chicken, broilers or fryers, thigh, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 15.4
      },
      {
        "s": "1 thigh, bone and skin removed",
        "c": 6.05
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 3.63
      }
    ]
  },
  {
    "i": 3221,
    "n": "Chicken, broilers or fryers, wing, meat and skin, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 11.8
      },
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 package",
        "c": 126
      }
    ]
  },
  {
    "i": 3222,
    "n": "Chicken, broilers or fryers, neck, meat only, cooked, simmered",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.2
      },
      {
        "s": "3 oz",
        "c": 37.4
      },
      {
        "s": "1 neck, bone and skin removed",
        "c": 7.92
      }
    ]
  },
  {
    "i": 3223,
    "n": "Chicken, broilers or fryers, thigh, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "1 thigh, bone removed",
        "c": 15.5
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 9.36
      }
    ]
  },
  {
    "i": 3224,
    "n": "Chicken, broilers or fryers, thigh, meat only, cooked, fried",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 4.03
      },
      {
        "s": "1 thigh, bone and skin removed",
        "c": 6.76
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 3225,
    "n": "Chicken, broilers or fryers, thigh, meat and skin, raw",
    "ms": [
      {
        "s": "1 thigh with skin",
        "c": 13.5
      },
      {
        "s": "4 oz",
        "c": 7.91
      }
    ]
  },
  {
    "i": 3228,
    "n": "Chicken, broilers or fryers, neck, meat and skin, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.7
      },
      {
        "s": "1 neck, bone removed",
        "c": 9
      }
    ]
  },
  {
    "i": 3229,
    "n": "Chicken, broilers or fryers, leg, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 17.6
      },
      {
        "s": "1 leg, bone and skin removed",
        "c": 11.1
      },
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 6.6
      }
    ]
  },
  {
    "i": 3232,
    "n": "Chicken, broilers or fryers, leg, meat and skin, raw",
    "ms": [
      {
        "s": "1 thigh with skin",
        "c": 16.6
      },
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 drumstick with skin",
        "c": 9.99
      },
      {
        "s": "1 back with skin",
        "c": 4.41
      },
      {
        "s": "1 leg, with skin (Sum of drumstick+thigh+back)",
        "c": 31
      }
    ]
  },
  {
    "i": 3233,
    "n": "Chicken, broilers or fryers, drumstick, meat only, cooked, stewed",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 17.6
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 3.08
      },
      {
        "s": "1 drumstick, bone and skin removed",
        "c": 5.06
      }
    ]
  },
  {
    "i": 3235,
    "n": "Chicken, broilers or fryers, drumstick, meat and skin, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      },
      {
        "s": "1 drumstick with skin",
        "c": 10.6
      },
      {
        "s": "1 drumstick",
        "c": 10.4
      }
    ]
  },
  {
    "i": 3236,
    "n": "Chicken, broilers or fryers, drumstick, meat only, cooked, fried",
    "ms": [
      {
        "s": "1 drumstick, bone and skin removed",
        "c": 5.04
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 3
      }
    ]
  },
  {
    "i": 3237,
    "n": "Chicken, broilers or fryers, drumstick, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 7.31
      },
      {
        "s": "1 drumstick, bone removed",
        "c": 12.2
      }
    ]
  },
  {
    "i": 3238,
    "n": "Oil, vegetable, soybean, refined",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 3239,
    "n": "Oil, industrial, palm and palm kernel, filling fat (non-hydrogenated)",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.045
      },
      {
        "s": "1 cup",
        "c": 2.18
      },
      {
        "s": "1 tbsp",
        "c": 0.136
      }
    ]
  },
  {
    "i": 3240,
    "n": "Oil, industrial, coconut (hydrogenated), used for whipped toppings and coffee whiteners",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.18
      },
      {
        "s": "1 tsp",
        "c": 0.045
      },
      {
        "s": "1 tbsp",
        "c": 0.136
      }
    ]
  },
  {
    "i": 3241,
    "n": "Margarine, industrial, soy and partially hydrogenated soy oil, use for baking, sauces and candy",
    "ms": [
      {
        "s": "1 cup",
        "c": 6.81
      },
      {
        "s": "1 tsp",
        "c": 0.141
      },
      {
        "s": "1 tbsp",
        "c": 0.42
      }
    ]
  },
  {
    "i": 3243,
    "n": "Oil, industrial, soy ( partially hydrogenated), all purpose",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3244,
    "n": "Oil, industrial, coconut, confection fat, typical basis for ice cream coatings",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.09
      },
      {
        "s": "1 tbsp",
        "c": 0.272
      },
      {
        "s": "1 cup",
        "c": 4.36
      }
    ]
  },
  {
    "i": 3245,
    "n": "Oil, industrial, palm kernel (hydrogenated) , used for whipped toppings, non-dairy",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.045
      },
      {
        "s": "1 tbsp",
        "c": 0.136
      },
      {
        "s": "1 cup",
        "c": 2.18
      }
    ]
  },
  {
    "i": 3246,
    "n": "Oil, industrial, soy (partially hydrogenated)  and cottonseed, principal use as a tortilla shortening",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3247,
    "n": "Oil, industrial, soy (partially hydrogenated ) and soy (winterized), pourable clear fry",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3248,
    "n": "Oil, industrial, mid-oleic, sunflower",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      }
    ]
  },
  {
    "i": 3249,
    "n": "Oil, industrial, soy (partially hydrogenated), multiuse for non-dairy butter flavor",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3250,
    "n": "Oil, industrial, canola (partially hydrogenated) oil for deep fat frying",
    "ms": [
      {
        "s": "1 teaspoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 3251,
    "n": "Oil, industrial, canola with antifoaming agent, principal uses salads, woks and light frying",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3252,
    "n": "Oil, industrial, canola for salads, woks and light frying",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 3253,
    "n": "Margarine-Like, Vegetable Oil Spread, 60% Fat, Stick/Tub/Bottle, With*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.94
      }
    ]
  },
  {
    "i": 3254,
    "n": "Margarine-like spread with yogurt, 70% fat, stick, with salt",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 2.8
      }
    ]
  },
  {
    "i": 3255,
    "n": "Salad dressing, thousand island dressing, fat-free",
    "ms": [
      {
        "s": "1 cup",
        "c": 28.2
      },
      {
        "s": "1 tbsp",
        "c": 1.76
      }
    ]
  },
  {
    "i": 3256,
    "n": "Margarine-Like, Vegetable Oil Spread, 20% Fat, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3257,
    "n": "Margarine-like, vegetable oil spread, fat free, liquid, with salt",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 5.7
      }
    ]
  },
  {
    "i": 3258,
    "n": "Margarine-like, vegetable oil spread, fat-free, tub",
    "ms": [
      {
        "s": "1 cup",
        "c": 18.6
      },
      {
        "s": "1 tbsp",
        "c": 1.17
      }
    ]
  },
  {
    "i": 3260,
    "n": "Margarine, Regular, 80% Fat, Composite, Tub, With*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.426
      },
      {
        "s": "1 cup",
        "c": 6.81
      }
    ]
  },
  {
    "i": 3262,
    "n": "Butter, Light, Stick, With*",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 6.72
      }
    ]
  },
  {
    "i": 3263,
    "n": "Animal fat, bacon grease",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3265,
    "n": "Margarine-like, vegetable oil spread, 60% fat, stick, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 48.1
      },
      {
        "s": "1 tsp",
        "c": 1.01
      },
      {
        "s": "1 tbsp",
        "c": 3
      }
    ]
  },
  {
    "i": 3266,
    "n": "Oil, canola",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3267,
    "n": "Fish oil, menhaden, fully hydrogenated",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3268,
    "n": "Fish oil, herring",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3269,
    "n": "Oil, sunflower, high oleic (70% and over)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3270,
    "n": "Fish oil, menhaden",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3271,
    "n": "Margarine-like, margarine-butter blend, soybean oil and butter",
    "ms": [
      {
        "s": "1 cup",
        "c": 22.7
      },
      {
        "s": "1 tsp",
        "c": 0.47
      },
      {
        "s": "1 stick",
        "c": 11.1
      },
      {
        "s": "1 tbsp",
        "c": 1.41
      }
    ]
  },
  {
    "i": 3272,
    "n": "Oil, mustard",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3273,
    "n": "Fish oil, salmon",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3274,
    "n": "Shortening, confectionery, fractionated palm",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3275,
    "n": "Shortening cake mix, soybean (hydrogenated) and cottonseed (hydrogenated)",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3276,
    "n": "Shortening frying (heavy duty), soybean (hydrogenated), linoleic (less than 1%)",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3277,
    "n": "Shortening frying (heavy duty), palm (hydrogenated)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3278,
    "n": "Shortening household soybean (hydrogenated) and palm",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3279,
    "n": "Oil, nutmeg butter",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3280,
    "n": "Shortening, household, lard and vegetable oil",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3282,
    "n": "Oil, Sunflower, Linoleic*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3285,
    "n": "Shortening bread, soybean (hydrogenated) and cottonseed",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 3365,
    "n": "Vinegar, balsamic",
    "ms": [
      {
        "s": "1 cup",
        "c": 68.8
      },
      {
        "s": "1 tsp",
        "c": 1.43
      },
      {
        "s": "1 tbsp",
        "c": 4.32
      }
    ]
  },
  {
    "i": 3367,
    "n": "Vanilla extract, imitation, no alcohol",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.126
      },
      {
        "s": "1 tbsp",
        "c": 0.39
      }
    ]
  },
  {
    "i": 3368,
    "n": "Vinegar, red wine",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.3
      },
      {
        "s": "1 cup",
        "c": 14.3
      },
      {
        "s": "1 tbsp",
        "c": 0.894
      }
    ]
  },
  {
    "i": 3369,
    "n": "Seasoning mix, dry, sazon, coriander & annatto",
    "ms": [
      {
        "s": "0.25 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3370,
    "n": "Seasoning mix, dry, taco, original",
    "ms": [
      {
        "s": "2 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3371,
    "n": "Vanilla extract, imitation, alcohol",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 3372,
    "n": "Spearmint, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 23.8
      },
      {
        "s": "1 tsp",
        "c": 7.44
      }
    ]
  },
  {
    "i": 3374,
    "n": "Vinegar, distilled",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.3
      },
      {
        "s": "1 tsp",
        "c": 0.3
      },
      {
        "s": "1 tbsp",
        "c": 0.894
      }
    ]
  },
  {
    "i": 3375,
    "n": "Ice cream sandwich, vanilla, light, no sugar added",
    "ms": [
      {
        "s": "1 serving",
        "c": 60.2
      }
    ]
  },
  {
    "i": 3376,
    "n": "Spices, turmeric, ground",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 15.8
      },
      {
        "s": "1 tsp",
        "c": 5.04
      }
    ]
  },
  {
    "i": 3377,
    "n": "Basil, fresh",
    "ms": [
      {
        "s": "0.25 cup leaves, whole",
        "c": 10.6
      },
      {
        "s": "5 leaves",
        "c": 4.42
      },
      {
        "s": "2 tbsp, chopped",
        "c": 9.38
      }
    ]
  },
  {
    "i": 3379,
    "n": "Dill weed, fresh",
    "ms": [
      {
        "s": "1 cup sprigs",
        "c": 18.5
      },
      {
        "s": "5 sprigs",
        "c": 2.08
      }
    ]
  },
  {
    "i": 3380,
    "n": "Milk, buttermilk, fluid, whole",
    "ms": [
      {
        "s": "1 cup",
        "c": 282
      }
    ]
  },
  {
    "i": 3381,
    "n": "Ice cream cone, chocolate covered, with nuts, flavors other than chocolate",
    "ms": [
      {
        "s": "1 unit",
        "c": 60.5
      }
    ]
  },
  {
    "i": 3382,
    "n": "Cheese, white, queso blanco",
    "ms": [
      {
        "s": "1 cup, crumbled",
        "c": 814
      }
    ]
  },
  {
    "i": 3383,
    "n": "Ice cream sandwich",
    "ms": [
      {
        "s": "1 serving",
        "c": 60.2
      }
    ]
  },
  {
    "i": 3384,
    "n": "Ice cream sandwich, made with light ice cream, vanilla",
    "ms": [
      {
        "s": "1 serving",
        "c": 21
      }
    ]
  },
  {
    "i": 3385,
    "n": "Ice cream cookie sandwich",
    "ms": [
      {
        "s": "1 serving",
        "c": 59.9
      }
    ]
  },
  {
    "i": 3386,
    "n": "Yogurt, vanilla or lemon flavor, nonfat milk, sweetened with low-calorie sweetener, fortified with vitamin D",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 243
      }
    ]
  },
  {
    "i": 3387,
    "n": "Cheese, fresh, queso fresco",
    "ms": [
      {
        "s": "1 cup, crumbled",
        "c": 691
      }
    ]
  },
  {
    "i": 3388,
    "n": "Yogurt, chocolate, nonfat milk, fortified with vitamin D",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 150
      }
    ]
  },
  {
    "i": 3390,
    "n": "Yogurt, vanilla, low fat, fortified with vitamin D",
    "ms": [
      {
        "s": "1 container (8 oz)",
        "c": 388
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 419
      },
      {
        "s": "1 container (6 oz)",
        "c": 291
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 193
      }
    ]
  },
  {
    "i": 3391,
    "n": "Yogurt, fruit, lowfat, with low calorie sweetener, fortified with vitamin D",
    "ms": [
      {
        "s": "1 container (8 oz)",
        "c": 345
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 372
      },
      {
        "s": "1 container (6 oz)",
        "c": 258
      }
    ]
  },
  {
    "i": 3393,
    "n": "Cheese, Provolone*",
    "ms": [
      {
        "s": "1 package (6 oz)",
        "c": 1290
      },
      {
        "s": "1 cup, diced",
        "c": 998
      },
      {
        "s": "1 oz",
        "c": 214
      },
      {
        "s": "1 cup, shredded",
        "c": 854
      },
      {
        "s": "1 cubic inch",
        "c": 108
      },
      {
        "s": "1 slice (1 oz)",
        "c": 212
      }
    ]
  },
  {
    "i": 3394,
    "n": "Cream substitute, flavored, powdered",
    "ms": [
      {
        "s": "4 tsp",
        "c": 0.6
      }
    ]
  },
  {
    "i": 3395,
    "n": "Cheese, Mexican, blend, reduced fat",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 321
      },
      {
        "s": "1 oz",
        "c": 325
      }
    ]
  },
  {
    "i": 3396,
    "n": "Milk, whole, 3.25% milkfat, without added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 276
      },
      {
        "s": "1 quart",
        "c": 1100
      },
      {
        "s": "1 tbsp",
        "c": 17
      },
      {
        "s": "1 fl oz",
        "c": 34.5
      }
    ]
  },
  {
    "i": 3397,
    "n": "Yogurt, chocolate, nonfat milk",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 150
      }
    ]
  },
  {
    "i": 3401,
    "n": "Parmesan cheese topping, fat free",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 40
      }
    ]
  },
  {
    "i": 3403,
    "n": "Milk, reduced fat, fluid, 2% milkfat, without added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 quart",
        "c": 1180
      },
      {
        "s": "1 cup",
        "c": 295
      }
    ]
  },
  {
    "i": 3404,
    "n": "Cream, half and half, fat free",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 27.8
      },
      {
        "s": "1 pint",
        "c": 465
      }
    ]
  },
  {
    "i": 3406,
    "n": "Cheese sauce, prepared from recipe",
    "ms": [
      {
        "s": "1 cup",
        "c": 756
      },
      {
        "s": "2 tbsp",
        "c": 93.3
      }
    ]
  },
  {
    "i": 3407,
    "n": "Egg, white, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 17.4
      }
    ]
  },
  {
    "i": 3408,
    "n": "Egg, white, raw, frozen, pasteurized",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.24
      }
    ]
  },
  {
    "i": 3409,
    "n": "Cheese, mexican, queso anejo",
    "ms": [
      {
        "s": "1 oz",
        "c": 193
      },
      {
        "s": "1 cup, crumbled",
        "c": 898
      }
    ]
  },
  {
    "i": 3410,
    "n": "Milk, canned, evaporated, with added vitamin A",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 329
      },
      {
        "s": "1 fl oz",
        "c": 82.2
      }
    ]
  },
  {
    "i": 3412,
    "n": "Milk, dry, nonfat, regular, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 377
      },
      {
        "s": "1 cup",
        "c": 1510
      }
    ]
  },
  {
    "i": 3413,
    "n": "Cheese, goat, hard type",
    "ms": [
      {
        "s": "1 oz",
        "c": 254
      }
    ]
  },
  {
    "i": 3414,
    "n": "Cheese substitute, mozzarella",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 110
      },
      {
        "s": "1 slice",
        "c": 171
      },
      {
        "s": "3 oz",
        "c": 518
      },
      {
        "s": "1 cup, shredded",
        "c": 689
      },
      {
        "s": "1 oz",
        "c": 173
      }
    ]
  },
  {
    "i": 3415,
    "n": "Milk, dry, nonfat, instant, without added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 837
      },
      {
        "s": "1 envelope (1-1/3 cup)",
        "c": 1120
      }
    ]
  },
  {
    "i": 3416,
    "n": "Egg, duck, whole, fresh, raw",
    "ms": [
      {
        "s": "1 egg",
        "c": 44.8
      }
    ]
  },
  {
    "i": 3417,
    "n": "Milk, reduced fat, fluid, 2% milkfat, with added nonfat milk solids, without added vitamin A",
    "ms": [
      {
        "s": "1 quart",
        "c": 1400
      },
      {
        "s": "1 cup",
        "c": 350
      }
    ]
  },
  {
    "i": 3418,
    "n": "Egg, turkey, whole, fresh, raw",
    "ms": [
      {
        "s": "1 egg",
        "c": 78.2
      }
    ]
  },
  {
    "i": 3419,
    "n": "Egg, whole, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 12.2
      },
      {
        "s": "1 cup, sifted",
        "c": 207
      }
    ]
  },
  {
    "i": 3420,
    "n": "Egg, goose, whole, fresh, raw",
    "ms": [
      {
        "s": "1 egg",
        "c": 86.4
      }
    ]
  },
  {
    "i": 3421,
    "n": "Egg, quail, whole, fresh, raw",
    "ms": [
      {
        "s": "1 egg",
        "c": 5.76
      }
    ]
  },
  {
    "i": 3422,
    "n": "Egg, white, raw, fresh",
    "ms": [
      {
        "s": "1 large",
        "c": 2.31
      },
      {
        "s": "1 cup",
        "c": 17
      }
    ]
  },
  {
    "i": 3423,
    "n": "Egg, whole, cooked, poached",
    "ms": [
      {
        "s": "1 large",
        "c": 28
      }
    ]
  },
  {
    "i": 3424,
    "n": "Egg, whole, cooked, omelet",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.2
      },
      {
        "s": "1 large",
        "c": 29.3
      }
    ]
  },
  {
    "i": 3425,
    "n": "Egg, yolk, raw, fresh",
    "ms": [
      {
        "s": "1 cup",
        "c": 313
      },
      {
        "s": "1 large",
        "c": 21.9
      }
    ]
  },
  {
    "i": 3426,
    "n": "Egg, whole, cooked, scrambled",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 9.04
      },
      {
        "s": "1 large",
        "c": 40.3
      },
      {
        "s": "1 cup",
        "c": 145
      }
    ]
  },
  {
    "i": 3427,
    "n": "Cheese, cottage, creamed, large or small curd",
    "ms": [
      {
        "s": "1 cup, small curd (not packed)",
        "c": 187
      },
      {
        "s": "1 cup, large curd (not packed)",
        "c": 174
      },
      {
        "s": "4 oz",
        "c": 93.8
      }
    ]
  },
  {
    "i": 3428,
    "n": "Cheese, cottage, nonfat, uncreamed, dry, large or small curd",
    "ms": [
      {
        "s": "4 oz",
        "c": 97.2
      },
      {
        "s": "1 cup (not packed)",
        "c": 125
      }
    ]
  },
  {
    "i": 3429,
    "n": "Cheese, cottage, creamed, with fruit",
    "ms": [
      {
        "s": "1 cup (not packed)",
        "c": 120
      },
      {
        "s": "4 oz",
        "c": 59.9
      }
    ]
  },
  {
    "i": 3430,
    "n": "Cheese, cottage, lowfat, 2% milkfat",
    "ms": [
      {
        "s": "4 oz",
        "c": 125
      },
      {
        "s": "1 cup (not packed)",
        "c": 251
      }
    ]
  },
  {
    "i": 3432,
    "n": "Cheese, camembert",
    "ms": [
      {
        "s": "1 wedge (1.33 oz)",
        "c": 147
      },
      {
        "s": "1 cubic inch",
        "c": 66
      },
      {
        "s": "1 cup",
        "c": 954
      },
      {
        "s": "1 oz",
        "c": 110
      }
    ]
  },
  {
    "i": 3433,
    "n": "Cheese, brick",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 115
      },
      {
        "s": "1 oz",
        "c": 191
      },
      {
        "s": "1 cup, diced",
        "c": 890
      },
      {
        "s": "1 cup, shredded",
        "c": 762
      },
      {
        "s": "1 slice (1 oz)",
        "c": 189
      }
    ]
  },
  {
    "i": 3434,
    "n": "Cheese, blue",
    "ms": [
      {
        "s": "1 cup, crumbled, not packed",
        "c": 713
      },
      {
        "s": "1 oz",
        "c": 150
      },
      {
        "s": "1 cubic inch",
        "c": 89.8
      }
    ]
  },
  {
    "i": 3435,
    "n": "Cheese, brie",
    "ms": [
      {
        "s": "1 package (4.5 oz)",
        "c": 236
      },
      {
        "s": "1 cup, sliced",
        "c": 265
      },
      {
        "s": "1 cubic inch",
        "c": 31.3
      },
      {
        "s": "1 oz",
        "c": 52.2
      },
      {
        "s": "1 cup, melted",
        "c": 442
      }
    ]
  },
  {
    "i": 3440,
    "n": "Beef, rib, back ribs, bone-in, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 ribs",
        "c": 159
      }
    ]
  },
  {
    "i": 3448,
    "n": "Beef, ground, unspecified fat content, cooked",
    "ms": [
      {
        "s": "3 oz",
        "c": 21.2
      }
    ]
  },
  {
    "i": 3450,
    "n": "Beef, Plate Steak, Boneless, Inside Skirt, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 23.3
      }
    ]
  },
  {
    "i": 3451,
    "n": "Beef, Plate Steak, Boneless, Inside Skirt, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 22.9
      }
    ]
  },
  {
    "i": 3453,
    "n": "Beef, rib eye steak/roast, boneless, lip-on, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 172
      },
      {
        "s": "4 oz",
        "c": 9.04
      },
      {
        "s": "1 steak",
        "c": 28.9
      }
    ]
  },
  {
    "i": 3459,
    "n": "Beef, rib eye roast, bone-in, lip-on, separable lean and fat, trimmed to 1/8 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 roast",
        "c": 277
      }
    ]
  },
  {
    "i": 3466,
    "n": "Beef, Plate Steak, Boneless, Outside Skirt, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 15.8
      }
    ]
  },
  {
    "i": 3473,
    "n": "Beef, Plate Steak, Boneless, Inside Skirt, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 22.4
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 3474,
    "n": "Beef, chuck, shoulder clod, shoulder top and center steaks, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 steak",
        "c": 9.64
      }
    ]
  },
  {
    "i": 3478,
    "n": "Beef, chuck, shoulder clod, top blade, steak, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 15
      }
    ]
  },
  {
    "i": 3480,
    "n": "Beef, round, outside round, bottom round, steak, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 16.2
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 3482,
    "n": "Beef, round, outside round, bottom round, steak, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 14.6
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 3483,
    "n": "Beef, chuck, shoulder clod, shoulder top and center steaks, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 9.32
      },
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 3485,
    "n": "Beef, chuck, shoulder clod, top blade, steak, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 steak",
        "c": 12.7
      }
    ]
  },
  {
    "i": 3486,
    "n": "Beef, chuck, shoulder clod, shoulder tender, medallion, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 medallion",
        "c": 2
      }
    ]
  },
  {
    "i": 3489,
    "n": "Beef, round, knuckle, tip side, steak, separable lean and fat , trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 10
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 3491,
    "n": "Beef, short loin, t-bone steak, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 96.6
      },
      {
        "s": "4 oz",
        "c": 23.7
      }
    ]
  },
  {
    "i": 3493,
    "n": "Ravioli, cheese with tomato sauce, frozen, not prepared, includes regular and light entrees",
    "ms": [
      {
        "s": "1 cup",
        "c": 126
      }
    ]
  },
  {
    "i": 3499,
    "n": "Chili with beans, microwavable bowls",
    "ms": [
      {
        "s": "1 cup",
        "c": 83
      },
      {
        "s": "1 container",
        "c": 143
      }
    ]
  },
  {
    "i": 3501,
    "n": "Egg rolls, vegetable, frozen, prepared",
    "ms": [
      {
        "s": "1 oz",
        "c": 14.2
      },
      {
        "s": "1 egg roll",
        "c": 34
      }
    ]
  },
  {
    "i": 3503,
    "n": "Lasagna, Vegetable, frozen, baked",
    "ms": [
      {
        "s": "1 cup",
        "c": 339
      },
      {
        "s": "1 serving",
        "c": 340
      },
      {
        "s": "1 oz",
        "c": 42.5
      }
    ]
  },
  {
    "i": 3505,
    "n": "Egg rolls, pork, refrigerated, heated",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.64
      },
      {
        "s": "1 roll",
        "c": 28.9
      }
    ]
  },
  {
    "i": 3508,
    "n": "Burrito, beef and bean, microwaved",
    "ms": [
      {
        "s": "1 burrito cooked",
        "c": 45.2
      },
      {
        "s": "1 oz",
        "c": 11.1
      }
    ]
  },
  {
    "i": 3510,
    "n": "Egg rolls, chicken, refrigerated, heated",
    "ms": [
      {
        "s": "1 roll",
        "c": 37.6
      },
      {
        "s": "1 oz",
        "c": 13.3
      }
    ]
  },
  {
    "i": 3519,
    "n": "Tortellini, pasta with cheese filling, fresh-refrigerated, as purchased",
    "ms": [
      {
        "s": "0.75 cup",
        "c": 123
      }
    ]
  },
  {
    "i": 3524,
    "n": "Light Ice Cream, soft serve, blended with cookie pieces",
    "ms": [
      {
        "s": "12 fl oz cup",
        "c": 435
      }
    ]
  },
  {
    "i": 3584,
    "n": "Millet flour",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.7
      }
    ]
  },
  {
    "i": 3588,
    "n": "Wheat Flour, White (Industrial), 15% Protein, Bleached*",
    "ms": [
      {
        "s": "100 g",
        "c": 17
      }
    ]
  },
  {
    "i": 3589,
    "n": "Cornmeal, Degermed*",
    "ms": [
      {
        "s": "1 cup",
        "c": 4.71
      }
    ]
  },
  {
    "i": 3592,
    "n": "Wheat Flour, White (Industrial), 9% Protein, Bleached*",
    "ms": [
      {
        "s": "100 g",
        "c": 20
      }
    ]
  },
  {
    "i": 3593,
    "n": "Wheat Flour, White (Industrial), 10% Protein, Bleached*",
    "ms": [
      {
        "s": "100 g",
        "c": 20
      }
    ]
  },
  {
    "i": 3594,
    "n": "Bologna, beef",
    "ms": [
      {
        "s": "1 serving",
        "c": 5.88
      },
      {
        "s": "1 slice",
        "c": 6.3
      }
    ]
  },
  {
    "i": 3595,
    "n": "Pasta, Cooked*",
    "ms": [
      {
        "s": "1 cup rotini",
        "c": 7.49
      },
      {
        "s": "1 cup lasagne",
        "c": 8.12
      },
      {
        "s": "1 cup elbows packed",
        "c": 9.24
      },
      {
        "s": "1 cup shells",
        "c": 7.35
      },
      {
        "s": "1 cup penne",
        "c": 7.49
      },
      {
        "s": "1 cup farfalle",
        "c": 7.49
      },
      {
        "s": "1 cup spaghetti not packed",
        "c": 8.68
      },
      {
        "s": "1 cup elbows not packed",
        "c": 8.4
      },
      {
        "s": "1 cup spaghetti packed",
        "c": 10.6
      }
    ]
  },
  {
    "i": 3596,
    "n": "Beerwurst, beer salami, pork and beef",
    "ms": [
      {
        "s": "2 oz",
        "c": 15.1
      }
    ]
  },
  {
    "i": 3597,
    "n": "Bologna, beef and pork",
    "ms": [
      {
        "s": "3.52 oz",
        "c": 85
      }
    ]
  },
  {
    "i": 3598,
    "n": "Mollusks, cuttlefish, mixed species, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 153
      }
    ]
  },
  {
    "i": 3599,
    "n": "Crustaceans, spiny lobster, mixed species, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 53.6
      },
      {
        "s": "1 lobster",
        "c": 103
      }
    ]
  },
  {
    "i": 3600,
    "n": "Fish, tuna, yellowfin, fresh, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 3601,
    "n": "Fish, sunfish, pumpkin seed, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 87.6
      },
      {
        "s": "1 fillet",
        "c": 38.1
      }
    ]
  },
  {
    "i": 3602,
    "n": "Fish, tuna, skipjack, fresh, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 31.4
      },
      {
        "s": "0.5 fillet",
        "c": 57
      }
    ]
  },
  {
    "i": 3603,
    "n": "Crustaceans, crab, dungeness, cooked, moist heat",
    "ms": [
      {
        "s": "1 crab",
        "c": 74.9
      },
      {
        "s": "3 oz",
        "c": 50.2
      }
    ]
  },
  {
    "i": 3604,
    "n": "Fish, trout, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 46.8
      },
      {
        "s": "1 fillet",
        "c": 34.1
      }
    ]
  },
  {
    "i": 3605,
    "n": "Crustaceans, crab, queen, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 28
      }
    ]
  },
  {
    "i": 3606,
    "n": "Fish, salmon, Atlantic, wild, cooked, dry heat",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 23.1
      },
      {
        "s": "3 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 3607,
    "n": "Fish, salmon, pink, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "0.5 fillet",
        "c": 9.92
      }
    ]
  },
  {
    "i": 3608,
    "n": "Fish, sucker, white, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 112
      },
      {
        "s": "3 oz",
        "c": 76.5
      }
    ]
  },
  {
    "i": 3609,
    "n": "Fish, pike, walleye, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 175
      },
      {
        "s": "3 oz",
        "c": 120
      }
    ]
  },
  {
    "i": 3610,
    "n": "Fish, monkfish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 3611,
    "n": "Fish, salmon, chinook, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 23.8
      },
      {
        "s": "0.5 fillet",
        "c": 43.1
      }
    ]
  },
  {
    "i": 3612,
    "n": "Fish, salmon, chum, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "0.5 fillet",
        "c": 21.6
      }
    ]
  },
  {
    "i": 3613,
    "n": "Fish, cusk, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 fillet",
        "c": 12.4
      }
    ]
  },
  {
    "i": 3614,
    "n": "Fish, milkfish, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 55.2
      }
    ]
  },
  {
    "i": 3615,
    "n": "Fish, cod, Pacific, cooked, dry heat (may contain additives to retain moisture)",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      },
      {
        "s": "1 fillet",
        "c": 9
      }
    ]
  },
  {
    "i": 3616,
    "n": "Fish, mahimahi, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 30.2
      },
      {
        "s": "3 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 3617,
    "n": "Fish, mackerel, Pacific and jack, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "1 oz, boneless",
        "c": 8.22
      },
      {
        "s": "3 oz",
        "c": 24.6
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 4.93
      },
      {
        "s": "1 fillet",
        "c": 51
      }
    ]
  },
  {
    "i": 3618,
    "n": "Fish, drum, freshwater, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 65.4
      },
      {
        "s": "1 fillet",
        "c": 119
      }
    ]
  },
  {
    "i": 3622,
    "n": "Fish, salmon, chinook, smoked, (lox), regular",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      },
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 3626,
    "n": "Fish, bass, freshwater, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 87.6
      },
      {
        "s": "1 fillet",
        "c": 63.9
      }
    ]
  },
  {
    "i": 3627,
    "n": "Mollusks, oyster, eastern, cooked, breaded and fried",
    "ms": [
      {
        "s": "6 medium",
        "c": 54.6
      },
      {
        "s": "3 oz",
        "c": 52.7
      }
    ]
  },
  {
    "i": 3628,
    "n": "Mollusks, oyster, eastern, wild, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 98.6
      },
      {
        "s": "6 medium",
        "c": 48.7
      }
    ]
  },
  {
    "i": 3629,
    "n": "Mollusks, oyster, eastern, wild, raw",
    "ms": [
      {
        "s": "6 medium",
        "c": 49.6
      },
      {
        "s": "1 cup",
        "c": 146
      }
    ]
  },
  {
    "i": 3632,
    "n": "Mollusks, clam, mixed species, cooked, breaded and fried",
    "ms": [
      {
        "s": "20 small",
        "c": 118
      },
      {
        "s": "3 oz",
        "c": 53.6
      }
    ]
  },
  {
    "i": 3633,
    "n": "Crustaceans, shrimp, mixed species, cooked, moist heat (may contain additives to retain moisture)",
    "ms": [
      {
        "s": "4 large",
        "c": 20
      },
      {
        "s": "3 oz",
        "c": 77.4
      }
    ]
  },
  {
    "i": 3636,
    "n": "Mollusks, clam, mixed species, cooked, moist heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 78.2
      },
      {
        "s": "20 small",
        "c": 175
      }
    ]
  },
  {
    "i": 3637,
    "n": "Crustaceans, shrimp, mixed species, imitation, made from surimi",
    "ms": [
      {
        "s": "3 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 3638,
    "n": "Fish, halibut, Greenland, raw",
    "ms": [
      {
        "s": "0.5 fillet",
        "c": 6.12
      },
      {
        "s": "3 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 3639,
    "n": "Crustaceans, crab, dungeness, raw",
    "ms": [
      {
        "s": "1 crab",
        "c": 75
      },
      {
        "s": "3 oz",
        "c": 39.1
      }
    ]
  },
  {
    "i": 3640,
    "n": "Crustaceans, shrimp, mixed species, cooked, breaded and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 57
      },
      {
        "s": "4 large",
        "c": 20.1
      }
    ]
  },
  {
    "i": 3642,
    "n": "Crustaceans, crab, queen, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 22.1
      }
    ]
  },
  {
    "i": 3643,
    "n": "Crustaceans, crab, blue, crab cakes, home recipe",
    "ms": [
      {
        "s": "1 cake",
        "c": 63
      }
    ]
  },
  {
    "i": 3644,
    "n": "Fish, Haddock, Raw*",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 fillet",
        "c": 21.2
      }
    ]
  },
  {
    "i": 3645,
    "n": "Fish, gefiltefish, commercial, sweet recipe",
    "ms": [
      {
        "s": "1 piece",
        "c": 9.66
      }
    ]
  },
  {
    "i": 3646,
    "n": "Fish, grouper, mixed species, cooked, dry heat",
    "ms": [
      {
        "s": "3 oz",
        "c": 17.8
      },
      {
        "s": "1 fillet",
        "c": 42.4
      }
    ]
  },
  {
    "i": 3647,
    "n": "Fish, mahimahi, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 30.6
      },
      {
        "s": "3 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 3648,
    "n": "Fish, grouper, mixed species, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 23
      },
      {
        "s": "1 fillet",
        "c": 69.9
      }
    ]
  },
  {
    "i": 3649,
    "n": "Fish, drum, freshwater, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 119
      },
      {
        "s": "3 oz",
        "c": 51
      }
    ]
  },
  {
    "i": 3650,
    "n": "Fish, cisco, smoked",
    "ms": [
      {
        "s": "3 oz",
        "c": 22.1
      },
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 3651,
    "n": "Fish, cod, Atlantic, cooked, dry heat",
    "ms": [
      {
        "s": "1 fillet",
        "c": 25.2
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 3652,
    "n": "Fish, croaker, Atlantic, cooked, breaded and fried",
    "ms": [
      {
        "s": "3 oz",
        "c": 27.2
      },
      {
        "s": "1 fillet",
        "c": 27.8
      }
    ]
  },
  {
    "i": 3653,
    "n": "Fish, cusk, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 12.2
      },
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 3654,
    "n": "Fish, cod, Atlantic, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 13.6
      },
      {
        "s": "1 fillet",
        "c": 37
      }
    ]
  },
  {
    "i": 3655,
    "n": "Fish, cisco, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 9.48
      },
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 3656,
    "n": "Fish, bluefish, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 fillet",
        "c": 10.5
      }
    ]
  },
  {
    "i": 3657,
    "n": "Fish, butterfish, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 7.04
      },
      {
        "s": "3 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 3658,
    "n": "Beverages, fruit juice drink, greater than 3% juice, high vitamin C",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 7.14
      }
    ]
  },
  {
    "i": 3659,
    "n": "Fish, carp, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 34.8
      },
      {
        "s": "1 fillet",
        "c": 89.4
      }
    ]
  },
  {
    "i": 3660,
    "n": "Fish, bass, striped, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 12.8
      },
      {
        "s": "1 fillet",
        "c": 23.8
      }
    ]
  },
  {
    "i": 3661,
    "n": "Beverages, tea, hibiscus, brewed",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 19
      }
    ]
  },
  {
    "i": 3662,
    "n": "Fish, burbot, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 58
      },
      {
        "s": "3 oz",
        "c": 42.5
      }
    ]
  },
  {
    "i": 3663,
    "n": "Beverages, Fruit flavored drink, reduced sugar, greater than 3% fruit juice, high vitamin C, added calcium",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 101
      },
      {
        "s": "1 fl oz",
        "c": 13.1
      }
    ]
  },
  {
    "i": 3664,
    "n": "Water, with corn syrup and/or sugar and low calorie sweetener, fruit flavored",
    "ms": [
      {
        "s": "1 pouch",
        "c": 34
      }
    ]
  },
  {
    "i": 3666,
    "n": "Beverages, fruit juice drink, greater than 3% fruit juice, high vitamin C and added thiamin",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 7.11
      }
    ]
  },
  {
    "i": 3669,
    "n": "Beverages, rice milk, unsweetened",
    "ms": [
      {
        "s": "8 fl oz (approximate weight, 1 serving)",
        "c": 283
      }
    ]
  },
  {
    "i": 3671,
    "n": "Beverages, Energy Drink, Monster, fortified with vitamins C, B2, B3, B6, B12",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3674,
    "n": "Water, non-carbonated, bottles, natural fruit flavors, sweetened with low calorie sweetener",
    "ms": [
      {
        "s": "1 ml",
        "c": 0.011
      },
      {
        "s": "1 serving (8 fl oz)",
        "c": 2.37
      },
      {
        "s": "1 fl oz",
        "c": 0.296
      }
    ]
  },
  {
    "i": 3677,
    "n": "Beverages, Powerade Zero Ion4, calorie-free, assorted flavors",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 4.74
      },
      {
        "s": "12 fl oz",
        "c": 7.1
      }
    ]
  },
  {
    "i": 3680,
    "n": "Alcoholic Beverage, wine, table, red, Merlot",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.35
      },
      {
        "s": "1 serving 5 fl oz",
        "c": 11.8
      }
    ]
  },
  {
    "i": 3682,
    "n": "Beverages, tea, instant, lemon, with added ascorbic acid",
    "ms": [
      {
        "s": "1 serving (3 heaping tsp)",
        "c": 0.69
      },
      {
        "s": "1 cup",
        "c": 5.46
      }
    ]
  },
  {
    "i": 3684,
    "n": "Carbonated beverage, chocolate-flavored soda",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.24
      },
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 19.7
      },
      {
        "s": "1 can (12 fl oz)",
        "c": 14.8
      }
    ]
  },
  {
    "i": 3686,
    "n": "Beverages, tea, green, brewed, regular",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3687,
    "n": "Beverages, Tropical Punch, ready-to-drink",
    "ms": [
      {
        "s": "200 ml",
        "c": 0
      },
      {
        "s": "1 NLEA Serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3688,
    "n": "Beverages, fruit punch drink, without added nutrients, canned",
    "ms": [
      {
        "s": "6.75 fl oz",
        "c": 16.8
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 19.8
      }
    ]
  },
  {
    "i": 3689,
    "n": "Beverages, citrus fruit juice drink, frozen concentrate, prepared with water",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.79
      },
      {
        "s": "1 serving 8 fl oz",
        "c": 22.3
      }
    ]
  },
  {
    "i": 3690,
    "n": "Beverages, citrus fruit juice drink, frozen concentrate",
    "ms": [
      {
        "s": "1 can (12 fl oz)",
        "c": 106
      },
      {
        "s": "1 fl oz",
        "c": 8.8
      }
    ]
  },
  {
    "i": 3691,
    "n": "Beverages, tea, green, ready to drink, unsweetened",
    "ms": [
      {
        "s": "16 fl oz",
        "c": 4.73
      }
    ]
  },
  {
    "i": 3692,
    "n": "Beverages, tea, green, brewed, decaffeinated",
    "ms": [
      {
        "s": "240 ml",
        "c": 0
      }
    ]
  },
  {
    "i": 3694,
    "n": "Alcoholic beverages, beer, higher alcohol",
    "ms": [
      {
        "s": "1 bottle",
        "c": 28.4
      },
      {
        "s": "1 fl oz",
        "c": 2.45
      }
    ]
  },
  {
    "i": 3695,
    "n": "Beverages, Malt liquor beverage",
    "ms": [
      {
        "s": "1 bottle",
        "c": 35.5
      }
    ]
  },
  {
    "i": 3696,
    "n": "Alcoholic beverages, wine, rose",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.03
      }
    ]
  },
  {
    "i": 3698,
    "n": "Cranberry juice cocktail, bottled, low calorie, with calcium, saccharin and corn sweetener",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.66
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 21.3
      }
    ]
  },
  {
    "i": 3700,
    "n": "Cranberry juice cocktail, bottled",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 7.59
      },
      {
        "s": "1 fl oz",
        "c": 0.948
      }
    ]
  },
  {
    "i": 3703,
    "n": "Beverages, coffee, instant, with chicory",
    "ms": [
      {
        "s": "1 tsp, rounded",
        "c": 1.85
      }
    ]
  },
  {
    "i": 3704,
    "n": "Beverages, cranberry-grape juice drink, bottled",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 19.6
      },
      {
        "s": "1 fl oz",
        "c": 2.45
      }
    ]
  },
  {
    "i": 3710,
    "n": "Beverages, coffee, instant, regular, powder",
    "ms": [
      {
        "s": "1 tsp",
        "c": 1.41
      },
      {
        "s": "1 packet",
        "c": 2.82
      }
    ]
  },
  {
    "i": 3713,
    "n": "Beverages, tea, black, ready-to-drink, lemon, diet",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 3714,
    "n": "Beverages, tea, green, ready-to-drink, diet",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.69
      }
    ]
  },
  {
    "i": 3715,
    "n": "Beverages, Cocoa mix, no sugar added, powder",
    "ms": [
      {
        "s": "1 envelope Alba (.675 oz)",
        "c": 109
      },
      {
        "s": "1 envelope  Swiss Miss (.53 oz)",
        "c": 86.4
      }
    ]
  },
  {
    "i": 3716,
    "n": "Beverages, tea, green, ready to drink, ginseng and honey, sweetened",
    "ms": [
      {
        "s": "1 cup",
        "c": 7.8
      }
    ]
  },
  {
    "i": 3717,
    "n": "Beverages, tea, black, ready-to-drink, lemon, sweetened",
    "ms": [
      {
        "s": "1 cup",
        "c": 10.8
      }
    ]
  },
  {
    "i": 3720,
    "n": "Beverages, Lemonade fruit juice drink light, fortified with vitamin E and C",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 4.8
      }
    ]
  },
  {
    "i": 3722,
    "n": "Beverages, coffee, ready to drink, vanilla, light, milk based, sweetened",
    "ms": [
      {
        "s": "9.5 fl oz",
        "c": 200
      }
    ]
  },
  {
    "i": 3723,
    "n": "Beverages, carbonated, low calorie, cola or pepper-types, with sodium saccharin, contains caffeine",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.18
      },
      {
        "s": "1 can (12 fl oz)",
        "c": 14.2
      },
      {
        "s": "1 bottle (16 fl oz)",
        "c": 19
      }
    ]
  },
  {
    "i": 3724,
    "n": "Beverages, coffee, brewed, breakfast blend",
    "ms": [
      {
        "s": "1 cup",
        "c": 4.96
      }
    ]
  },
  {
    "i": 3725,
    "n": "Beverages, coffee, ready to drink, milk based, sweetened",
    "ms": [
      {
        "s": "1 cup",
        "c": 194
      }
    ]
  },
  {
    "i": 3726,
    "n": "Beverages, Clam and tomato juice, canned",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.42
      },
      {
        "s": "1 can (5.5 oz)",
        "c": 13.3
      }
    ]
  },
  {
    "i": 3727,
    "n": "Beverages, carbonated, root beer",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.54
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 18.5
      },
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 24.6
      }
    ]
  },
  {
    "i": 3728,
    "n": "Beverages, chocolate malt powder, prepared with 1% milk, fortified",
    "ms": [
      {
        "s": "1 cup prepared",
        "c": 402
      },
      {
        "s": "1 cup dry mix",
        "c": 157
      }
    ]
  },
  {
    "i": 3730,
    "n": "Beverages, carbonated, limeade, high caffeine",
    "ms": [
      {
        "s": "1 cup",
        "c": 5.06
      }
    ]
  },
  {
    "i": 3731,
    "n": "Beverages, carbonated, tonic water",
    "ms": [
      {
        "s": "1 bottle (11 fl oz)",
        "c": 3.36
      },
      {
        "s": "1 can or bottle (16 fl oz)",
        "c": 4.88
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 3.66
      },
      {
        "s": "1 fl oz",
        "c": 0.305
      }
    ]
  },
  {
    "i": 3732,
    "n": "Beverages, chocolate drink, milk and soy based, ready to drink, fortified",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 301
      }
    ]
  },
  {
    "i": 3734,
    "n": "Rolls, gluten-free, whole grain, made with tapioca starch and brown rice flour",
    "ms": [
      {
        "s": "1 roll",
        "c": 51.9
      }
    ]
  },
  {
    "i": 3735,
    "n": "Rolls, gluten-free, white, made with brown rice flour, tapioca starch, and sorghum flour",
    "ms": [
      {
        "s": "1 roll",
        "c": 28.3
      }
    ]
  },
  {
    "i": 3736,
    "n": "Cookies, chocolate cream covered biscuit sticks",
    "ms": [
      {
        "s": "1 serving",
        "c": 20
      }
    ]
  },
  {
    "i": 3737,
    "n": "Cookies, oatmeal, reduced fat",
    "ms": [
      {
        "s": "1 cookie",
        "c": 0
      }
    ]
  },
  {
    "i": 3738,
    "n": "Cookies, Marie biscuit",
    "ms": [
      {
        "s": "5 cookie",
        "c": 0
      }
    ]
  },
  {
    "i": 3739,
    "n": "Rolls, gluten-free, white, made with brown rice flour, tapioca starch, and potato starch",
    "ms": [
      {
        "s": "1 roll",
        "c": 29.5
      }
    ]
  },
  {
    "i": 3740,
    "n": "Rolls, gluten-free, white, made with rice flour, rice starch, and corn starch",
    "ms": [
      {
        "s": "1 roll",
        "c": 140
      }
    ]
  },
  {
    "i": 3741,
    "n": "Cookies, gluten-free, vanilla sandwich, with creme filling",
    "ms": [
      {
        "s": "3 cookies",
        "c": 6.16
      }
    ]
  },
  {
    "i": 3742,
    "n": "Cookies, gluten-free, lemon wafer",
    "ms": [
      {
        "s": "3 cookies",
        "c": 2.7
      }
    ]
  },
  {
    "i": 3743,
    "n": "Crackers, water biscuits",
    "ms": [
      {
        "s": "4 cracker 1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3744,
    "n": "Cookies, gluten-free, chocolate wafer",
    "ms": [
      {
        "s": "3 cookies",
        "c": 25.1
      }
    ]
  },
  {
    "i": 3745,
    "n": "Cookies, gluten-free, chocolate sandwich, with creme filling",
    "ms": [
      {
        "s": "3 cookies",
        "c": 8.36
      }
    ]
  },
  {
    "i": 3746,
    "n": "Crackers, whole grain, sandwich-type, with peanut butter filling",
    "ms": [
      {
        "s": "6 cracker 1 serving",
        "c": 14.2
      }
    ]
  },
  {
    "i": 3747,
    "n": "Bread, wheat, sprouted, toasted",
    "ms": [
      {
        "s": "1 slice 1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3748,
    "n": "Bagels, multigrain",
    "ms": [
      {
        "s": "1 piece bagel",
        "c": 100
      }
    ]
  },
  {
    "i": 3749,
    "n": "Bread, cinnamon",
    "ms": [
      {
        "s": "1 slice 1 serving",
        "c": 19.9
      }
    ]
  },
  {
    "i": 3750,
    "n": "Crackers, toast thins, low sodium",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3751,
    "n": "Pancakes, whole wheat, dry mix, incomplete",
    "ms": [
      {
        "s": "0.25 cup mix 1 serving",
        "c": 60
      }
    ]
  },
  {
    "i": 3752,
    "n": "Bread, wheat, sprouted",
    "ms": [
      {
        "s": "1 slice 1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3753,
    "n": "Cookies, coconut macaroon",
    "ms": [
      {
        "s": "2 cookie 1 serving",
        "c": 1.8
      }
    ]
  },
  {
    "i": 3754,
    "n": "Bread, naan, plain, commercially prepared, refrigerated",
    "ms": [
      {
        "s": "1 piece",
        "c": 75.6
      }
    ]
  },
  {
    "i": 3755,
    "n": "Bread, chapati or roti, plain, commercially prepared",
    "ms": [
      {
        "s": "1 piece",
        "c": 63.2
      }
    ]
  },
  {
    "i": 3756,
    "n": "Crackers, sandwich-type, peanut butter filled, reduced fat",
    "ms": [
      {
        "s": "1 package",
        "c": 0
      }
    ]
  },
  {
    "i": 3758,
    "n": "Crackers, multigrain",
    "ms": [
      {
        "s": "4 crackers",
        "c": 1.96
      }
    ]
  },
  {
    "i": 3759,
    "n": "Cookies, chocolate sandwich, with creme filling, reduced fat",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3760,
    "n": "Cookies, peanut butter, commercially prepared, sugar free",
    "ms": [
      {
        "s": "1 serving 3 cookies",
        "c": 0
      }
    ]
  },
  {
    "i": 3761,
    "n": "Cookies, oatmeal sandwich, with creme filling",
    "ms": [
      {
        "s": "1 cookie 1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 3764,
    "n": "Cookie, vanilla with caramel, coconut, and chocolate coating",
    "ms": [
      {
        "s": "2 cookies",
        "c": 11.6
      }
    ]
  },
  {
    "i": 3766,
    "n": "Cookie, with peanut butter filling, chocolate-coated",
    "ms": [
      {
        "s": "2 cookies",
        "c": 8.75
      }
    ]
  },
  {
    "i": 3767,
    "n": "Sauce, horseradish",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.672
      }
    ]
  },
  {
    "i": 3768,
    "n": "Cookies, animal, with frosting or icing",
    "ms": [
      {
        "s": "8 cookies 1 serving",
        "c": 1.86
      },
      {
        "s": "1 package (40 g)",
        "c": 2.4
      }
    ]
  },
  {
    "i": 3769,
    "n": "Wasabi",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 8.2
      },
      {
        "s": "1 teaspoon",
        "c": 2.66
      }
    ]
  },
  {
    "i": 3770,
    "n": "Sauce, tartar, ready-to-serve",
    "ms": [
      {
        "s": "2 tablespoons",
        "c": 7.8
      }
    ]
  },
  {
    "i": 3773,
    "n": "Dip, bean, original flavor",
    "ms": [
      {
        "s": "1 container (9 oz)",
        "c": 67.3
      },
      {
        "s": "2 tbsp",
        "c": 9.36
      }
    ]
  },
  {
    "i": 3776,
    "n": "Soup, ramen noodle, dry, any flavor, reduced fat, reduced sodium",
    "ms": [
      {
        "s": "1.41 oz dry (half noodle block)",
        "c": 8.8
      }
    ]
  },
  {
    "i": 3777,
    "n": "Sauce, salsa, verde, ready-to-serve",
    "ms": [
      {
        "s": "2 Tbsp",
        "c": 2.7
      }
    ]
  },
  {
    "i": 3778,
    "n": "Sauce, steak, tomato based",
    "ms": [
      {
        "s": "2 Tbsp",
        "c": 6.46
      }
    ]
  },
  {
    "i": 3779,
    "n": "Beef, round, top round, steak, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 90.7
      },
      {
        "s": "4 oz",
        "c": 22.6
      }
    ]
  },
  {
    "i": 3780,
    "n": "Sauce, duck, ready-to-serve",
    "ms": [
      {
        "s": "2 Tbsp",
        "c": 3.63
      }
    ]
  },
  {
    "i": 3784,
    "n": "Beef, round, top round, steak, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 22.6
      },
      {
        "s": "1 lb",
        "c": 90.7
      }
    ]
  },
  {
    "i": 3786,
    "n": "Beef, round, eye of round, roast, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 90.7
      },
      {
        "s": "4 oz",
        "c": 22.6
      }
    ]
  },
  {
    "i": 3789,
    "n": "Beef, tenderloin, steak, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 27.1
      },
      {
        "s": "1 lb",
        "c": 109
      }
    ]
  },
  {
    "i": 3790,
    "n": "Beef, short loin, top loin steak, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 113
      },
      {
        "s": "4 oz",
        "c": 28.2
      }
    ]
  },
  {
    "i": 3792,
    "n": "Beef, rib, small end (ribs 10-12), separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 27.1
      },
      {
        "s": "1 lb",
        "c": 109
      }
    ]
  },
  {
    "i": 3793,
    "n": "Beef, top sirloin, steak, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 99.8
      },
      {
        "s": "4 oz",
        "c": 24.9
      }
    ]
  },
  {
    "i": 3798,
    "n": "Beef, ground, 75% lean meat / 25% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "3 oz",
        "c": 23.8
      }
    ]
  },
  {
    "i": 3799,
    "n": "Beef, ground, 80% lean meat / 20% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "3 oz",
        "c": 19.6
      }
    ]
  },
  {
    "i": 3800,
    "n": "Beef, Tenderloin, Steak, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 24.9
      }
    ]
  },
  {
    "i": 3801,
    "n": "Beef, ground, 80% lean meat / 20% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 23.8
      }
    ]
  },
  {
    "i": 3803,
    "n": "Beef, ground, 80% lean meat / 20% fat, patty, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 22.1
      }
    ]
  },
  {
    "i": 3804,
    "n": "Beef, ground, 80% lean meat / 20% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 20.4
      }
    ]
  },
  {
    "i": 3805,
    "n": "Beef, ground, 90% lean meat / 10% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 13.6
      },
      {
        "s": "1 portion ( yield from 1/2 lb raw meat )",
        "c": 24.6
      }
    ]
  },
  {
    "i": 3807,
    "n": "Beef, ground, 90% lean meat / 10% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 3808,
    "n": "Beef, ground, 95% lean meat / 5% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 3809,
    "n": "Beef, ground, 95% lean meat / 5% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 3810,
    "n": "Beef, ground, 90% lean meat / 10% fat, patty, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 3812,
    "n": "Beef, ground, 95% lean meat / 5% fat, patty, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 3813,
    "n": "Beef, Plate, Inside Skirt Steak, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 lb",
        "c": 49.9
      }
    ]
  },
  {
    "i": 3817,
    "n": "Beef, plate, outside skirt steak, separable lean and fat, trimmed to 0 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 lb",
        "c": 49.9
      }
    ]
  },
  {
    "i": 3818,
    "n": "Beef, Composite Of Trimmed Retail Cuts, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 19.2
      }
    ]
  },
  {
    "i": 3819,
    "n": "Beef, chuck, clod steak, separable lean only, trimmed to 1/4 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 lb",
        "c": 36.3
      }
    ]
  },
  {
    "i": 3822,
    "n": "Beef, Shoulder Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 3824,
    "n": "Beef, composite of trimmed retail cuts, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 3834,
    "n": "Beef, Loin, Top Loin Steak, Boneless, Lip Off, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 steak",
        "c": 37.5
      }
    ]
  },
  {
    "i": 3840,
    "n": "Beef, round, eye of round steak, boneless, separable lean only, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 steak",
        "c": 17.3
      }
    ]
  },
  {
    "i": 3841,
    "n": "Beef, Round, Top Round Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 steak",
        "c": 44.7
      }
    ]
  },
  {
    "i": 3843,
    "n": "Beef, Round, Top Round Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 98.5
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 3851,
    "n": "Beef, Loin, Top Loin Steak, Boneless, Lip Off, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 40
      },
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 3854,
    "n": "Beef, Round, Top Round Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 96.2
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 3857,
    "n": "Beef, Round, Eye Of Round Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 85.5
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 3858,
    "n": "Beef, Round, Eye Of Round Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 90.9
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 3859,
    "n": "Beef, Australian, imported, Wagyu, rib, small end rib steak/roast, boneless, separable lean and fat, Aust. marble score 9, raw",
    "ms": [
      {
        "s": "1 roast",
        "c": 11.3
      },
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 3860,
    "n": "Beef, Australian, Imported, Wagyu, Rib, Small End Rib Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 roast",
        "c": 13.7
      }
    ]
  },
  {
    "i": 3864,
    "n": "Beef, Australian, Imported, Grass-Fed, Loin, Top Sirloin Cap-Off Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 22.4
      }
    ]
  },
  {
    "i": 3866,
    "n": "Beef, Australian, Imported, Grass-Fed, Loin, Top Loin Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 17
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 3867,
    "n": "Beef, Australian, imported, Wagyu, external fat, Aust. marble score 4/5, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 2.26
      }
    ]
  },
  {
    "i": 3869,
    "n": "Beef, Australian, imported, Wagyu, seam fat, Aust. marble score 4/5, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 2.26
      }
    ]
  },
  {
    "i": 3870,
    "n": "Beef, Australian, imported, Wagyu, loin, top loin steak/roast, boneless, separable lean only, Aust. marble score 9, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 roast",
        "c": 14.4
      }
    ]
  },
  {
    "i": 3871,
    "n": "Beef, Australian, Imported, Wagyu, Loin, Tenderloin Steak/Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 6.08
      },
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 3872,
    "n": "Currants, zante, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 127
      }
    ]
  },
  {
    "i": 3873,
    "n": "Beef, Australian, imported, grass-fed, seam fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 3874,
    "n": "Beef, Australian, imported, grass-fed,  external fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 3876,
    "n": "Dates, deglet noor",
    "ms": [
      {
        "s": "1 date, pitted",
        "c": 2.77
      },
      {
        "s": "1 cup, chopped",
        "c": 57.3
      }
    ]
  },
  {
    "i": 3877,
    "n": "Elderberries, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 55.1
      }
    ]
  },
  {
    "i": 3878,
    "n": "Custard-apple, (bullock's-heart), raw",
    "ms": [
      {
        "s": "100 g",
        "c": 30
      }
    ]
  },
  {
    "i": 3879,
    "n": "Cranberries, raw",
    "ms": [
      {
        "s": "1 cup, whole",
        "c": 8
      },
      {
        "s": "1 cup, chopped",
        "c": 8.8
      }
    ]
  },
  {
    "i": 3881,
    "n": "Crabapples, raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 19.8
      }
    ]
  },
  {
    "i": 3884,
    "n": "Cherries, sweet, raw",
    "ms": [
      {
        "s": "1 cherry",
        "c": 1.07
      },
      {
        "s": "1 cup, with pits, yields",
        "c": 17.9
      },
      {
        "s": "1 NLEA serving",
        "c": 18.2
      },
      {
        "s": "1 cup, without pits",
        "c": 20
      }
    ]
  },
  {
    "i": 3888,
    "n": "Blueberries, raw",
    "ms": [
      {
        "s": "50 berries",
        "c": 4.08
      },
      {
        "s": "1 cup",
        "c": 8.88
      }
    ]
  },
  {
    "i": 3889,
    "n": "Breadfruit, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 37.4
      },
      {
        "s": "0.25 fruit, small",
        "c": 16.3
      }
    ]
  },
  {
    "i": 3891,
    "n": "Carambola, (starfruit), raw",
    "ms": [
      {
        "s": "1 large (4-1/2 long)",
        "c": 3.72
      },
      {
        "s": "1 cup, sliced",
        "c": 3.24
      },
      {
        "s": "1 medium (3-5/8 long)",
        "c": 2.73
      },
      {
        "s": "1 cup, cubes",
        "c": 3.96
      },
      {
        "s": "1 small (3-1/8 long)",
        "c": 2.1
      }
    ]
  },
  {
    "i": 3892,
    "n": "Avocados, raw, California",
    "ms": [
      {
        "s": "1 NLEA serving",
        "c": 6.5
      },
      {
        "s": "1 cup, pureed",
        "c": 29.9
      },
      {
        "s": "1 fruit, without skin and seed",
        "c": 17.7
      }
    ]
  },
  {
    "i": 3894,
    "n": "Avocados, raw, all commercial varieties",
    "ms": [
      {
        "s": "1 avocado, NS as to Florida or California",
        "c": 24.1
      },
      {
        "s": "1 NLEA Serving",
        "c": 6
      },
      {
        "s": "1 cup, sliced",
        "c": 17.5
      },
      {
        "s": "1 cup, cubes",
        "c": 18
      },
      {
        "s": "1 cup, pureed",
        "c": 27.6
      }
    ]
  },
  {
    "i": 3895,
    "n": "Avocados, raw, Florida",
    "ms": [
      {
        "s": "1 cup, pureed",
        "c": 23
      },
      {
        "s": "1 NLEA Serving",
        "c": 5
      },
      {
        "s": "1 fruit without skin and seeds",
        "c": 30.4
      }
    ]
  },
  {
    "i": 3897,
    "n": "Apricots, dehydrated (low-moisture), sulfured, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 72.6
      }
    ]
  },
  {
    "i": 3904,
    "n": "Apples, dried, sulfured, stewed, with added sugar",
    "ms": [
      {
        "s": "1 cup",
        "c": 8.4
      }
    ]
  },
  {
    "i": 3907,
    "n": "Apples, dried, sulfured, stewed, without added sugar",
    "ms": [
      {
        "s": "1 cup",
        "c": 7.65
      }
    ]
  },
  {
    "i": 3909,
    "n": "Apricots, raw",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 21.4
      },
      {
        "s": "1 cup, halves",
        "c": 20.2
      },
      {
        "s": "1 apricot",
        "c": 4.55
      }
    ]
  },
  {
    "i": 3910,
    "n": "Acerola, (west indian cherry), raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 11.8
      },
      {
        "s": "1 fruit without refuse",
        "c": 0.576
      }
    ]
  },
  {
    "i": 3911,
    "n": "Apples, dehydrated (low moisture), sulfured, stewed",
    "ms": [
      {
        "s": "1 cup",
        "c": 7.72
      }
    ]
  },
  {
    "i": 3914,
    "n": "Acerola juice, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 24.2
      },
      {
        "s": "1 fl oz",
        "c": 3.02
      }
    ]
  },
  {
    "i": 3915,
    "n": "Apples, dried, sulfured, uncooked",
    "ms": [
      {
        "s": "1 ring",
        "c": 0.896
      },
      {
        "s": "1 cup",
        "c": 12
      }
    ]
  },
  {
    "i": 3917,
    "n": "Cereals, oats, regular and quick and instant, unenriched, cooked with water (includes boiling and microwaving), with salt",
    "ms": [
      {
        "s": "0.75 cup",
        "c": 15.8
      },
      {
        "s": "1 cup",
        "c": 21.1
      }
    ]
  },
  {
    "i": 3923,
    "n": "Cereals, Whole Wheat Hot Natural Cereal, Cooked With Water, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.9
      },
      {
        "s": "0.75 cup",
        "c": 12.7
      }
    ]
  },
  {
    "i": 3928,
    "n": "Cereals, corn grits, yellow, regular and quick, unenriched, dry",
    "ms": [
      {
        "s": "1 cup",
        "c": 3.12
      },
      {
        "s": "1 tbsp",
        "c": 0.194
      }
    ]
  },
  {
    "i": 3930,
    "n": "Cereals, corn grits, yellow, regular, quick, enriched, cooked with water, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.33
      }
    ]
  },
  {
    "i": 3931,
    "n": "Cereals, corn grits, yellow, regular and quick, enriched, cooked with water, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.33
      }
    ]
  },
  {
    "i": 3932,
    "n": "Cereals, Corn Grits, White, Regular And Quick, Enriched, Cooked With Water, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.57
      },
      {
        "s": "1 tablespoon",
        "c": 0.16
      }
    ]
  },
  {
    "i": 3933,
    "n": "Cereals, whole wheat hot natural cereal, dry",
    "ms": [
      {
        "s": "1 cup",
        "c": 37.6
      },
      {
        "s": "0.33 cup",
        "c": 12.4
      }
    ]
  },
  {
    "i": 3936,
    "n": "Cereals, oats, instant, fortified, with cinnamon and spice, dry",
    "ms": [
      {
        "s": "1 packet",
        "c": 105
      }
    ]
  },
  {
    "i": 3942,
    "n": "Cereals, oats, instant, fortified, plain, dry",
    "ms": [
      {
        "s": "1 packet",
        "c": 98.3
      }
    ]
  },
  {
    "i": 3948,
    "n": "Cereals, corn grits, white, regular and quick, enriched, dry",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.388
      },
      {
        "s": "1 cup",
        "c": 6.24
      }
    ]
  },
  {
    "i": 3950,
    "n": "Cereals ready-to-eat, granola, homemade",
    "ms": [
      {
        "s": "1 cup",
        "c": 92.7
      },
      {
        "s": "1 oz",
        "c": 21.5
      }
    ]
  },
  {
    "i": 3962,
    "n": "Bacon, turkey, microwaved",
    "ms": [
      {
        "s": "1 slice",
        "c": 13.2
      }
    ]
  },
  {
    "i": 3964,
    "n": "Bologna, meat and poultry",
    "ms": [
      {
        "s": "1 slice",
        "c": 41.2
      }
    ]
  },
  {
    "i": 3966,
    "n": "Pork sausage, link/patty, reduced fat, unprepared",
    "ms": [
      {
        "s": "3 oz",
        "c": 12.8
      },
      {
        "s": "1 package",
        "c": 51.4
      }
    ]
  },
  {
    "i": 3967,
    "n": "Frankfurter, meat and poultry, cooked, grilled",
    "ms": [
      {
        "s": "1 frankfurter",
        "c": 56.6
      }
    ]
  },
  {
    "i": 3969,
    "n": "Sausage, pork and turkey, pre-cooked",
    "ms": [
      {
        "s": "1 serving",
        "c": 42.2
      }
    ]
  },
  {
    "i": 3970,
    "n": "Headcheese, pork",
    "ms": [
      {
        "s": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
        "c": 4.48
      },
      {
        "s": "45 g",
        "c": 7.2
      }
    ]
  },
  {
    "i": 3971,
    "n": "Ham and cheese spread",
    "ms": [
      {
        "s": "1 oz",
        "c": 61.5
      },
      {
        "s": "1 tbsp",
        "c": 32.6
      }
    ]
  },
  {
    "i": 3972,
    "n": "Sausage, Italian, pork, mild, raw",
    "ms": [
      {
        "s": "1 link",
        "c": 12.1
      }
    ]
  },
  {
    "i": 3973,
    "n": "Ham and cheese loaf or roll",
    "ms": [
      {
        "s": "2 slices",
        "c": 33.1
      },
      {
        "s": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
        "c": 16.2
      }
    ]
  },
  {
    "i": 3976,
    "n": "Braunschweiger (a liver sausage), pork",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      },
      {
        "s": "1 slice (2-1/2 dia x 1/4 thick)",
        "c": 1.62
      }
    ]
  },
  {
    "i": 3977,
    "n": "Frankfurter, turkey",
    "ms": [
      {
        "s": "1 frankfurter",
        "c": 66.6
      },
      {
        "s": "1 oz",
        "c": 42
      }
    ]
  },
  {
    "i": 3978,
    "n": "Cheesefurter, cheese smokie, pork, beef",
    "ms": [
      {
        "s": "2.33 links",
        "c": 58
      }
    ]
  },
  {
    "i": 3979,
    "n": "Frankfurter, chicken",
    "ms": [
      {
        "s": "1 link",
        "c": 33.3
      },
      {
        "s": "3 oz",
        "c": 62.9
      }
    ]
  },
  {
    "i": 3980,
    "n": "Bratwurst, pork, beef, link",
    "ms": [
      {
        "s": "1 link",
        "c": 33.6
      }
    ]
  },
  {
    "i": 3981,
    "n": "Soup, ramen noodle, chicken flavor, dry",
    "ms": [
      {
        "s": "1 packet",
        "c": 1.32
      },
      {
        "s": "1 package without flavor packet",
        "c": 17.8
      }
    ]
  },
  {
    "i": 3982,
    "n": "Bratwurst, pork, cooked",
    "ms": [
      {
        "s": "1 link cooked",
        "c": 23.8
      }
    ]
  },
  {
    "i": 3983,
    "n": "Beerwurst, beer salami, pork",
    "ms": [
      {
        "s": "1 slice (2-3/4 dia x 1/16)",
        "c": 0.48
      },
      {
        "s": "1 slice (4 dia x 1/8 thick)",
        "c": 1.84
      }
    ]
  },
  {
    "i": 3984,
    "n": "Blood sausage",
    "ms": [
      {
        "s": "4 slices",
        "c": 6
      }
    ]
  },
  {
    "i": 3985,
    "n": "Sausage, Berliner, pork, beef",
    "ms": [
      {
        "s": "1 slice",
        "c": 2.76
      },
      {
        "s": "1 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 3986,
    "n": "Bockwurst, pork, veal, raw",
    "ms": [
      {
        "s": "1 sausage",
        "c": 37.3
      }
    ]
  },
  {
    "i": 3987,
    "n": "Potato soup, instant, dry mix",
    "ms": [
      {
        "s": "1 serving 1/3 cup",
        "c": 67.1
      }
    ]
  },
  {
    "i": 3988,
    "n": "Soup, bouillon cubes and granules, low sodium, dry",
    "ms": [
      {
        "s": "1 cube",
        "c": 6.73
      },
      {
        "s": "1 tsp",
        "c": 4.86
      }
    ]
  },
  {
    "i": 3989,
    "n": "Soup, ramen noodle, beef flavor, dry",
    "ms": [
      {
        "s": "1 package without flavor packet",
        "c": 17.2
      },
      {
        "s": "1 packet",
        "c": 1.18
      }
    ]
  },
  {
    "i": 3991,
    "n": "Soup, beef and mushroom, low sodium, chunk style",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.6
      }
    ]
  },
  {
    "i": 3993,
    "n": "Sauce, worcestershire",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 18.2
      },
      {
        "s": "1 cup",
        "c": 294
      }
    ]
  },
  {
    "i": 3997,
    "n": "Fish broth",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 9.15
      },
      {
        "s": "1 cup",
        "c": 73.2
      }
    ]
  },
  {
    "i": 3999,
    "n": "Sauce, alfredo mix, dry",
    "ms": [
      {
        "s": "100 g",
        "c": 467
      }
    ]
  },
  {
    "i": 4001,
    "n": "Sauce, tomato chili sauce, bottled, with salt",
    "ms": [
      {
        "s": "1 packet",
        "c": 1.2
      },
      {
        "s": "1 cup",
        "c": 54.6
      }
    ]
  },
  {
    "i": 4004,
    "n": "Soup, vegetable chicken, canned, prepared with water, low sodium",
    "ms": [
      {
        "s": "1 cup",
        "c": 26.5
      }
    ]
  },
  {
    "i": 4006,
    "n": "Barbecue loaf, pork, beef",
    "ms": [
      {
        "s": "1 slice (5-7/8 x 3-1/2 x 1/16)",
        "c": 12.6
      },
      {
        "s": "1 oz",
        "c": 15.6
      }
    ]
  },
  {
    "i": 4007,
    "n": "Gravy, instant turkey, dry",
    "ms": [
      {
        "s": "1 serving",
        "c": 7.7
      },
      {
        "s": "1 package (16 oz)",
        "c": 522
      }
    ]
  },
  {
    "i": 4008,
    "n": "Gravy, brown instant, dry",
    "ms": [
      {
        "s": "1 serving",
        "c": 7.77
      },
      {
        "s": "1 package",
        "c": 527
      }
    ]
  },
  {
    "i": 4010,
    "n": "Gravy, instant beef, dry",
    "ms": [
      {
        "s": "1 serving",
        "c": 9.45
      },
      {
        "s": "1 package (16 oz)",
        "c": 640
      }
    ]
  },
  {
    "i": 4011,
    "n": "Soup, tomato, low sodium, with water",
    "ms": [
      {
        "s": "1 serving 1 cup",
        "c": 19.8
      },
      {
        "s": "1 fl oz",
        "c": 2.48
      }
    ]
  },
  {
    "i": 4013,
    "n": "Soup, vegetable soup, condensed, low sodium, prepared with equal volume water",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.4
      }
    ]
  },
  {
    "i": 4016,
    "n": "Sauce, cheese sauce mix, dry",
    "ms": [
      {
        "s": "100 g",
        "c": 204
      }
    ]
  },
  {
    "i": 4017,
    "n": "Soup, vegetable broth, ready to serve",
    "ms": [
      {
        "s": "1 cup",
        "c": 6.63
      },
      {
        "s": "1 carton (32 oz)",
        "c": 27.8
      },
      {
        "s": "1 can",
        "c": 11.7
      }
    ]
  },
  {
    "i": 4023,
    "n": "Sauce, pesto, ready-to-serve, refrigerated",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 193
      }
    ]
  },
  {
    "i": 4026,
    "n": "Sauce, pesto, ready-to-serve, shelf stable",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 106
      }
    ]
  },
  {
    "i": 4027,
    "n": "Sauce, peanut, made from coconut, water, sugar, peanuts",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.53
      }
    ]
  },
  {
    "i": 4028,
    "n": "Gravy, brown, dry",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.92
      }
    ]
  },
  {
    "i": 4030,
    "n": "Soup, chicken noodle, dry, mix",
    "ms": [
      {
        "s": "1 packet",
        "c": 40.7
      },
      {
        "s": "1 packet (6 fl oz)",
        "c": 6.1
      }
    ]
  },
  {
    "i": 4031,
    "n": "Gravy, chicken, dry",
    "ms": [
      {
        "s": "1 serving",
        "c": 11.7
      },
      {
        "s": "1 tbsp",
        "c": 11.7
      }
    ]
  },
  {
    "i": 4032,
    "n": "Gravy, turkey, dry",
    "ms": [
      {
        "s": "1 serving",
        "c": 10.2
      }
    ]
  },
  {
    "i": 4033,
    "n": "Gravy, unspecified type, dry",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 37.5
      }
    ]
  },
  {
    "i": 4037,
    "n": "Soup, beef broth or bouillon, powder, dry",
    "ms": [
      {
        "s": "1 cube",
        "c": 2.16
      },
      {
        "s": "1 packet",
        "c": 3.6
      }
    ]
  },
  {
    "i": 4039,
    "n": "Soup, beef broth, cubed, dry",
    "ms": [
      {
        "s": "1 cube",
        "c": 2.16
      }
    ]
  },
  {
    "i": 4040,
    "n": "Soup, chicken broth or bouillon, dry",
    "ms": [
      {
        "s": "1 cube",
        "c": 7.48
      },
      {
        "s": "1 teaspoon",
        "c": 3.74
      }
    ]
  },
  {
    "i": 4041,
    "n": "Soup, chicken broth cubes, dry",
    "ms": [
      {
        "s": "1 cube",
        "c": 9.12
      }
    ]
  },
  {
    "i": 4054,
    "n": "Soup, chicken and vegetable, canned, ready-to-serve",
    "ms": [
      {
        "s": "1 cup",
        "c": 35.7
      }
    ]
  },
  {
    "i": 4058,
    "n": "Soup, cheese, canned, condensed",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 44.6
      }
    ]
  },
  {
    "i": 4062,
    "n": "Chicken, broiler or fryers, breast, skinless, boneless, meat only, with added solution, cooked, grilled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 piece",
        "c": 11.5
      }
    ]
  },
  {
    "i": 4066,
    "n": "Turkey, thigh, from whole bird, meat only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 thigh",
        "c": 40.4
      }
    ]
  },
  {
    "i": 4069,
    "n": "Turkey, retail parts, thigh, meat and skin, raw",
    "ms": [
      {
        "s": "1 thigh",
        "c": 18.2
      },
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 4072,
    "n": "Turkey, wing, from whole bird, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 wing",
        "c": 50.1
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 4073,
    "n": "Turkey, retail parts, breast, meat and skin, raw",
    "ms": [
      {
        "s": "1 breast",
        "c": 104
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 4074,
    "n": "Turkey, drumstick, from whole bird, meat only, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      },
      {
        "s": "1 drumstick",
        "c": 53.8
      }
    ]
  },
  {
    "i": 4075,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, wing, meat and skin, cooked",
    "ms": [
      {
        "s": "1 wing",
        "c": 15.4
      },
      {
        "s": "1 serving (3 oz)",
        "c": 24.6
      },
      {
        "s": "1 oz",
        "c": 8.22
      }
    ]
  },
  {
    "i": 4077,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, thigh, meat and skin, cooked",
    "ms": [
      {
        "s": "1 thigh",
        "c": 13.4
      },
      {
        "s": "1 serving",
        "c": 12.8
      }
    ]
  },
  {
    "i": 4078,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, skin only, cooked",
    "ms": [
      {
        "s": "3 oz",
        "c": 21.2
      }
    ]
  },
  {
    "i": 4079,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, breast, meat only, cooked",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 oz",
        "c": 3.69
      },
      {
        "s": "1 breast breast with skin and bone",
        "c": 62.8
      }
    ]
  },
  {
    "i": 4080,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, back, meat only, cooked",
    "ms": [
      {
        "s": "1 oz",
        "c": 10.8
      },
      {
        "s": "1 serving (3 oz)",
        "c": 32.3
      },
      {
        "s": "1 back",
        "c": 38.8
      }
    ]
  },
  {
    "i": 4081,
    "n": "Chicken, broilers or fryers, drumstick, rotisserie, original seasoning, meat only, cooked",
    "ms": [
      {
        "s": "1 drumstick",
        "c": 11.1
      },
      {
        "s": "1 oz",
        "c": 5.95
      },
      {
        "s": "1 serving (3oz)",
        "c": 17.8
      }
    ]
  },
  {
    "i": 4082,
    "n": "Chicken, broilers or fryers,  rotisserie, original seasoning, drumstick, meat and skin, cooked",
    "ms": [
      {
        "s": "1 serving (3 oz)",
        "c": 17.8
      },
      {
        "s": "1 oz",
        "c": 5.95
      },
      {
        "s": "1 drumstick",
        "c": 11.1
      }
    ]
  },
  {
    "i": 4084,
    "n": "Chicken breast tenders, breaded, uncooked",
    "ms": [
      {
        "s": "4 pieces",
        "c": 11.8
      },
      {
        "s": "1 piece",
        "c": 2.85
      },
      {
        "s": "3 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 4085,
    "n": "Chicken breast tenders, breaded, cooked, microwaved",
    "ms": [
      {
        "s": "4 pieces",
        "c": 8.68
      },
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 piece",
        "c": 2.1
      }
    ]
  },
  {
    "i": 4089,
    "n": "Duck, young duckling, domesticated, White Pekin, breast, meat only, boneless, cooked without skin, broiled",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 3.96
      },
      {
        "s": "0.5 breast, bone and skin removed",
        "c": 8.55
      },
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 15.7
      }
    ]
  },
  {
    "i": 4090,
    "n": "Duck, young duckling, domesticated, White Pekin, breast, meat and skin, boneless, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "0.5 breast, bone removed",
        "c": 9.6
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 4.48
      }
    ]
  },
  {
    "i": 4091,
    "n": "Chicken, cornish game hens, meat and skin, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "0.5 bird",
        "c": 18.5
      }
    ]
  },
  {
    "i": 4092,
    "n": "Chicken, broilers or fryers, breast, skinless, boneless, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 13.2
      },
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "0.5 breast",
        "c": 5.9
      }
    ]
  },
  {
    "i": 4095,
    "n": "Turkey breast, pre-basted, meat and skin, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "0.5 breast, bone removed",
        "c": 77.8
      }
    ]
  },
  {
    "i": 4097,
    "n": "Turkey thigh, pre-basted, meat and skin, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 thigh, bone removed",
        "c": 25.1
      }
    ]
  },
  {
    "i": 4098,
    "n": "Turkey, mechanically deboned, from turkey frames, raw",
    "ms": [
      {
        "s": "0.5 lb",
        "c": 329
      }
    ]
  },
  {
    "i": 4100,
    "n": "Turkey, young hen, skin only, cooked, roasted",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook turkey)",
        "c": 9.92
      },
      {
        "s": "0.5 turkey, skin only",
        "c": 62.7
      }
    ]
  },
  {
    "i": 4103,
    "n": "Turkey, whole, wing, meat only, raw",
    "ms": [
      {
        "s": "1 wing",
        "c": 38.1
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4104,
    "n": "Turkey, all classes, light meat, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 4107,
    "n": "Turkey, whole, light meat, raw",
    "ms": [
      {
        "s": "1 serving",
        "c": 9.35
      }
    ]
  },
  {
    "i": 4108,
    "n": "Turkey, all classes, leg, meat and skin, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook turkey)",
        "c": 17.8
      },
      {
        "s": "1 leg, bone removed",
        "c": 139
      }
    ]
  },
  {
    "i": 4109,
    "n": "Turkey, all classes, wing, meat and skin, raw",
    "ms": [
      {
        "s": "1 wing, bone removed",
        "c": 35.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook turkey)",
        "c": 4.62
      }
    ]
  },
  {
    "i": 4110,
    "n": "Turkey, all classes, liver, cooked, simmered",
    "ms": [
      {
        "s": "1 liver cooked",
        "c": 10.1
      },
      {
        "s": "3 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 4111,
    "n": "Turkey, all classes, liver, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 22.6
      },
      {
        "s": "1 raw liver",
        "c": 15.6
      }
    ]
  },
  {
    "i": 4112,
    "n": "Turkey, dark meat, meat and skin, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 49.8
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4113,
    "n": "Turkey, whole, dark meat, meat and skin, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 4114,
    "n": "Turkey, all classes, heart, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 4.32
      },
      {
        "s": "4 oz",
        "c": 20.3
      }
    ]
  },
  {
    "i": 4115,
    "n": "Turkey, all classes, heart, cooked, simmered",
    "ms": [
      {
        "s": "1 heart",
        "c": 4.2
      },
      {
        "s": "3 oz",
        "c": 17.8
      }
    ]
  },
  {
    "i": 4116,
    "n": "Turkey, all classes, gizzard, cooked, simmered",
    "ms": [
      {
        "s": "1 gizzard cooked",
        "c": 7.65
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 4117,
    "n": "Turkey, whole, skin (light and dark), raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 58.9
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 4120,
    "n": "Turkey, whole, meat only, raw",
    "ms": [
      {
        "s": "1 bird",
        "c": 550
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4121,
    "n": "Chicken, broilers or fryers, breast, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "0.5 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 16.8
      },
      {
        "s": "3 oz",
        "c": 17
      },
      {
        "s": "0 breast, bone removed",
        "c": 28
      }
    ]
  },
  {
    "i": 4122,
    "n": "Chicken, broilers or fryers, breast, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "0.5 breast, bone removed",
        "c": 15.7
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 9.44
      }
    ]
  },
  {
    "i": 4123,
    "n": "Chicken, broilers or fryers, breast, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 7.41
      },
      {
        "s": "0.5 breast, bone and skin removed",
        "c": 12.4
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 18.2
      }
    ]
  },
  {
    "i": 4124,
    "n": "Chicken, broilers or fryers, breast, meat and skin, raw",
    "ms": [
      {
        "s": "0.5 breast, bone removed",
        "c": 16
      },
      {
        "s": "0.5 breast, bone removed (yield from 1 lb ready-to-cook chicken)",
        "c": 9.57
      }
    ]
  },
  {
    "i": 4125,
    "n": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
    "ms": [
      {
        "s": "0.5 breast, bone and skin removed",
        "c": 12.9
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 7.8
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 21
      }
    ]
  },
  {
    "i": 4126,
    "n": "Chicken, broilers or fryers, back, meat only, cooked, stewed",
    "ms": [
      {
        "s": "0.5 back, bone and skin removed",
        "c": 8.82
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 5.46
      }
    ]
  },
  {
    "i": 4127,
    "n": "Chicken, broilers or fryers, back, meat and skin, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 7.67
      },
      {
        "s": "0.5 back, bone removed",
        "c": 12.9
      }
    ]
  },
  {
    "i": 4128,
    "n": "Chicken, broilers or fryers, back, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 18.7
      },
      {
        "s": "0.5 back, bone removed",
        "c": 31.2
      }
    ]
  },
  {
    "i": 4129,
    "n": "Chicken, broilers or fryers, light meat, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 9.23
      },
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 15.5
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 18.2
      }
    ]
  },
  {
    "i": 4130,
    "n": "Chicken, broilers or fryers, separable fat, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.24
      },
      {
        "s": "1 tbsp",
        "c": 0.896
      },
      {
        "s": "0.5 chicken, separable fat",
        "c": 3.64
      }
    ]
  },
  {
    "i": 4131,
    "n": "Chicken, broilers or fryers, back, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 10.6
      },
      {
        "s": "0.5 back, bone removed",
        "c": 17.3
      }
    ]
  },
  {
    "i": 4133,
    "n": "Chicken, broilers or fryers, light meat, meat only, raw",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 10.6
      },
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 17.6
      }
    ]
  },
  {
    "i": 4135,
    "n": "Chicken, broilers or fryers, dark meat, meat and skin, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 29.3
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 17.6
      }
    ]
  },
  {
    "i": 4137,
    "n": "Chicken, broilers or fryers, light meat, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "0.5 chicken, bone removed",
        "c": 19.5
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 11.7
      }
    ]
  },
  {
    "i": 4139,
    "n": "Chicken, heart, all classes, raw",
    "ms": [
      {
        "s": "1 heart",
        "c": 0.732
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 0.216
      }
    ]
  },
  {
    "i": 4140,
    "n": "Chicken, broilers or fryers, light meat, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 12.5
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 20.8
      }
    ]
  },
  {
    "i": 4141,
    "n": "Chicken, gizzard, all classes, cooked, simmered",
    "ms": [
      {
        "s": "1 cup chopped or dice",
        "c": 24.6
      }
    ]
  },
  {
    "i": 4142,
    "n": "Chicken, gizzard, all classes, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 lb",
        "c": 49.8
      }
    ]
  },
  {
    "i": 4143,
    "n": "Chicken, broilers or fryers, giblets, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 cup chopped or dice",
        "c": 20.3
      }
    ]
  },
  {
    "i": 4144,
    "n": "Chicken, broilers or fryers, light meat, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "0.5 chicken, bone removed",
        "c": 37.6
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 22.6
      }
    ]
  },
  {
    "i": 4145,
    "n": "Chicken, broilers or fryers, skin only, cooked, fried, batter",
    "ms": [
      {
        "s": "0 chicken, skin only",
        "c": 49.4
      },
      {
        "s": "0.5 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 29.6
      },
      {
        "s": "3 oz",
        "c": 22.1
      }
    ]
  },
  {
    "i": 4146,
    "n": "Chicken, broilers or fryers, skin only, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 4.62
      },
      {
        "s": "0.5 chicken, skin only",
        "c": 7.84
      }
    ]
  },
  {
    "i": 4147,
    "n": "Chicken, broilers or fryers, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 22
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 19.6
      },
      {
        "s": "1 tbsp",
        "c": 1.22
      }
    ]
  },
  {
    "i": 4149,
    "n": "Chicken, broilers or fryers, skin only, raw",
    "ms": [
      {
        "s": "0.5 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 5.17
      },
      {
        "s": "0 chicken, skin only",
        "c": 8.69
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4150,
    "n": "Chicken, broilers or fryers, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 32
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 53.4
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 4151,
    "n": "Mayonnaise, reduced fat, with olive oil",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4152,
    "n": "Salad dressing, mayonnaise-type, light",
    "ms": [
      {
        "s": "100 g",
        "c": 5
      }
    ]
  },
  {
    "i": 4154,
    "n": "Chicken, broilers or fryers, meat and skin, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 30.4
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 50.6
      }
    ]
  },
  {
    "i": 4155,
    "n": "Oil, flaxseed, contains added sliced flaxseed",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.7
      },
      {
        "s": "1 tablespoon",
        "c": 1.23
      }
    ]
  },
  {
    "i": 4156,
    "n": "Chicken, broilers or fryers, meat and skin and giblets and neck, stewed",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 chicken",
        "c": 105
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 31.5
      }
    ]
  },
  {
    "i": 4157,
    "n": "Chicken, broilers or fryers, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "3 oz",
        "c": 17.8
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 97.9
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 58.8
      }
    ]
  },
  {
    "i": 4158,
    "n": "Oil, industrial, soy, fully hydrogenated",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4159,
    "n": "Oil, industrial, soy, low linolenic",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4160,
    "n": "Oil, industrial, cottonseed, fully hydrogenated",
    "ms": [
      {
        "s": "1 teaspoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4161,
    "n": "Margarine-like, vegetable oil spread, 60% fat, stick, with salt, with added vitamin D",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.94
      }
    ]
  },
  {
    "i": 4162,
    "n": "Oil, industrial, soy, ultra low linolenic",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4163,
    "n": "Margarine-like, vegetable oil spread, approximately 37% fat, unspecified oils, with salt, with added vitamin D",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.894
      }
    ]
  },
  {
    "i": 4165,
    "n": "Margarine, regular, 80% fat, composite, tub, with salt, with added vitamin D",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.42
      }
    ]
  },
  {
    "i": 4166,
    "n": "Oil, babassu",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4167,
    "n": "Oil, teaseed",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4168,
    "n": "Oil, sheanut",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4169,
    "n": "Oil, hazelnut",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4171,
    "n": "Oil, soybean lecithin",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4172,
    "n": "Oil, cocoa butter",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4173,
    "n": "Salad dressing, home recipe, vinegar and oil",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4174,
    "n": "Salad dressing, french dressing, fat-free",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0.8
      },
      {
        "s": "1 cup",
        "c": 12.8
      }
    ]
  },
  {
    "i": 4175,
    "n": "Oil, tomatoseed",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4176,
    "n": "Oil, poppyseed",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4177,
    "n": "Salad dressing, french, cottonseed, oil, home recipe",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0.84
      },
      {
        "s": "1 cup",
        "c": 13.2
      }
    ]
  },
  {
    "i": 4178,
    "n": "Vegetable oil, palm kernel",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "2 tbsp (1/8 cup)",
        "c": 0
      }
    ]
  },
  {
    "i": 4179,
    "n": "Salad dressing, mayonnaise, soybean oil, without salt",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 2.48
      },
      {
        "s": "1 cup",
        "c": 39.6
      }
    ]
  },
  {
    "i": 4180,
    "n": "Salad dressing, french dressing, commercial, regular",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 4.32
      },
      {
        "s": "1 cup",
        "c": 67.5
      },
      {
        "s": "1 individual packet",
        "c": 3.32
      }
    ]
  },
  {
    "i": 4182,
    "n": "Oil, olive, salad or cooking",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.16
      },
      {
        "s": "1 tsp",
        "c": 0.045
      },
      {
        "s": "1 tablespoon",
        "c": 0.135
      }
    ]
  },
  {
    "i": 4183,
    "n": "Salad dressing, french, home recipe",
    "ms": [
      {
        "s": "1 cup",
        "c": 13.2
      },
      {
        "s": "1 tablespoon",
        "c": 0.84
      }
    ]
  },
  {
    "i": 4184,
    "n": "Margarine,spread, 35-39% fat, tub",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.288
      },
      {
        "s": "1 cup",
        "c": 13.9
      }
    ]
  },
  {
    "i": 4185,
    "n": "Salad dressing, mayonnaise, imitation, soybean without cholesterol",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4186,
    "n": "Oil, Soybean, Salad Or Cooking*",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4187,
    "n": "Oil, peanut, salad or cooking",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4188,
    "n": "Sandwich spread, with chopped pickle, regular, unspecified oils",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 2.1
      },
      {
        "s": "1 cup",
        "c": 34.3
      }
    ]
  },
  {
    "i": 4189,
    "n": "Salad dressing, mayonnaise, imitation, milk cream",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 10.8
      },
      {
        "s": "1 cup",
        "c": 173
      }
    ]
  },
  {
    "i": 4190,
    "n": "Salad dressing, italian dressing, commercial, reduced fat",
    "ms": [
      {
        "s": "1 cup",
        "c": 36
      },
      {
        "s": "1 tablespoon",
        "c": 2.25
      }
    ]
  },
  {
    "i": 4191,
    "n": "Salad dressing, mayonnaise type, regular, with salt",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.735
      },
      {
        "s": "1 cup",
        "c": 11.8
      }
    ]
  },
  {
    "i": 4192,
    "n": "Salad dressing, mayonnaise, imitation, soybean",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4193,
    "n": "Salad Dressing, French Dressing, Reduced Fat*",
    "ms": [
      {
        "s": "1 cup",
        "c": 28.6
      },
      {
        "s": "1 tablespoon",
        "c": 1.76
      },
      {
        "s": "1 serving (2 tbsp)",
        "c": 3.3
      }
    ]
  },
  {
    "i": 4194,
    "n": "Fat, beef tallow",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4196,
    "n": "Salad dressing, thousand island, commercial, regular",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.72
      },
      {
        "s": "1 serving (2 tbsp)",
        "c": 5.1
      },
      {
        "s": "1 cup",
        "c": 42.5
      }
    ]
  },
  {
    "i": 4198,
    "n": "Lard",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4225,
    "n": "Zwieback",
    "ms": [
      {
        "s": "1 toast, Gerber Zwieback",
        "c": 1.4
      },
      {
        "s": "1 oz",
        "c": 5.67
      },
      {
        "s": "1 piece",
        "c": 1.4
      },
      {
        "s": "1 rusk",
        "c": 2
      }
    ]
  },
  {
    "i": 4263,
    "n": "Spices, poppy seed",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 127
      },
      {
        "s": "1 tsp",
        "c": 40.3
      }
    ]
  },
  {
    "i": 4264,
    "n": "Spices, oregano, dried",
    "ms": [
      {
        "s": "1 tsp, ground",
        "c": 28.7
      },
      {
        "s": "1 tsp, leaves",
        "c": 16
      }
    ]
  },
  {
    "i": 4265,
    "n": "Spices, paprika",
    "ms": [
      {
        "s": "1 tsp",
        "c": 5.27
      },
      {
        "s": "1 tbsp",
        "c": 15.6
      }
    ]
  },
  {
    "i": 4266,
    "n": "Spices, pumpkin pie spice",
    "ms": [
      {
        "s": "1 tsp",
        "c": 11.6
      },
      {
        "s": "1 tbsp",
        "c": 38.2
      }
    ]
  },
  {
    "i": 4267,
    "n": "Spices, rosemary, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 42.2
      },
      {
        "s": "1 tsp",
        "c": 15.4
      }
    ]
  },
  {
    "i": 4268,
    "n": "Spices, poultry seasoning",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 43.8
      },
      {
        "s": "1 tsp",
        "c": 14.9
      }
    ]
  },
  {
    "i": 4269,
    "n": "Spices, garlic powder",
    "ms": [
      {
        "s": "1 tsp",
        "c": 2.45
      },
      {
        "s": "1 tbsp",
        "c": 7.66
      }
    ]
  },
  {
    "i": 4270,
    "n": "Spices, nutmeg, ground",
    "ms": [
      {
        "s": "1 tsp",
        "c": 4.05
      },
      {
        "s": "1 tbsp",
        "c": 12.9
      }
    ]
  },
  {
    "i": 4271,
    "n": "Spices, onion powder",
    "ms": [
      {
        "s": "1 tsp",
        "c": 9.22
      },
      {
        "s": "1 tbsp",
        "c": 26.5
      }
    ]
  },
  {
    "i": 4272,
    "n": "Spices, dill weed, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 55.3
      },
      {
        "s": "1 tsp",
        "c": 17.8
      }
    ]
  },
  {
    "i": 4273,
    "n": "Spices, fenugreek seed",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 19.5
      },
      {
        "s": "1 tsp",
        "c": 6.51
      }
    ]
  },
  {
    "i": 4274,
    "n": "Spices, fennel seed",
    "ms": [
      {
        "s": "1 tsp, whole",
        "c": 23.9
      },
      {
        "s": "1 tbsp, whole",
        "c": 69.4
      }
    ]
  },
  {
    "i": 4275,
    "n": "Spices, cinnamon, ground",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 78.2
      },
      {
        "s": "1 tsp",
        "c": 26.1
      }
    ]
  },
  {
    "i": 4276,
    "n": "Spices, chili powder",
    "ms": [
      {
        "s": "1 tsp",
        "c": 8.91
      },
      {
        "s": "1 tbsp",
        "c": 26.4
      }
    ]
  },
  {
    "i": 4277,
    "n": "Spices, basil, dried",
    "ms": [
      {
        "s": "1 tsp, ground",
        "c": 31.4
      },
      {
        "s": "1 tbsp, ground",
        "c": 101
      },
      {
        "s": "1 tsp, leaves",
        "c": 15.7
      },
      {
        "s": "1 tbsp, leaves",
        "c": 47
      }
    ]
  },
  {
    "i": 4278,
    "n": "Spices, cloves, ground",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 41.1
      },
      {
        "s": "1 tsp",
        "c": 13.3
      }
    ]
  },
  {
    "i": 4279,
    "n": "Spices, chervil, dried",
    "ms": [
      {
        "s": "1 tsp",
        "c": 8.08
      },
      {
        "s": "1 tbsp",
        "c": 25.6
      }
    ]
  },
  {
    "i": 4281,
    "n": "Spices, anise seed",
    "ms": [
      {
        "s": "1 tsp, whole",
        "c": 13.6
      },
      {
        "s": "1 tbsp, whole",
        "c": 43.3
      }
    ]
  },
  {
    "i": 4284,
    "n": "Cream, half and half, lowfat",
    "ms": [
      {
        "s": "100 g",
        "c": 133
      }
    ]
  },
  {
    "i": 4285,
    "n": "Spices, allspice, ground",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 39.7
      },
      {
        "s": "1 tsp",
        "c": 12.6
      }
    ]
  },
  {
    "i": 4287,
    "n": "Butter, Clarified butter (ghee)",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 4289,
    "n": "Ice cream sundae cone",
    "ms": [
      {
        "s": "100 g",
        "c": 60
      }
    ]
  },
  {
    "i": 4290,
    "n": "Light ice cream, Creamsicle",
    "ms": [
      {
        "s": "100 g",
        "c": 62
      }
    ]
  },
  {
    "i": 4291,
    "n": "Milk, chocolate, fat free, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 39.6
      },
      {
        "s": "1 cup",
        "c": 318
      },
      {
        "s": "1 quart",
        "c": 1270
      }
    ]
  },
  {
    "i": 4292,
    "n": "Milk, evaporated, 2% fat, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 can (13 oz)",
        "c": 985
      },
      {
        "s": "1 fl oz",
        "c": 84.1
      },
      {
        "s": "1 cup",
        "c": 673
      },
      {
        "s": "0.5 cup",
        "c": 336
      }
    ]
  },
  {
    "i": 4293,
    "n": "Yogurt, Greek, plain, whole milk",
    "ms": [
      {
        "s": "100 g",
        "c": 100
      }
    ]
  },
  {
    "i": 4294,
    "n": "Ice cream bar, covered with chocolate and nuts",
    "ms": [
      {
        "s": "100 g",
        "c": 90
      }
    ]
  },
  {
    "i": 4297,
    "n": "Yogurt, Greek, strawberry, lowfat",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 150
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 216
      },
      {
        "s": "1 container, Dannon Sprinkl'ins (4.1 oz)",
        "c": 102
      },
      {
        "s": "1 container (8 oz)",
        "c": 200
      },
      {
        "s": "1 container (5.3 oz)",
        "c": 132
      },
      {
        "s": "0 container (4 oz)",
        "c": 99.4
      }
    ]
  },
  {
    "i": 4300,
    "n": "Ice cream bar, stick or nugget, with crunch coating",
    "ms": [
      {
        "s": "26 pieces",
        "c": 59.8
      }
    ]
  },
  {
    "i": 4301,
    "n": "Cheese food, pasteurized process, American, without added vitamin D",
    "ms": [
      {
        "s": "1 oz",
        "c": 193
      },
      {
        "s": "1 slice (3/4 oz)",
        "c": 143
      },
      {
        "s": "1 cup",
        "c": 771
      },
      {
        "s": "1 package (8 oz)",
        "c": 1550
      }
    ]
  },
  {
    "i": 4304,
    "n": "Ice cream, light, soft serve, chocolate",
    "ms": [
      {
        "s": "1 medium",
        "c": 399
      }
    ]
  },
  {
    "i": 4305,
    "n": "Cheese, cheddar, nonfat or fat free",
    "ms": [
      {
        "s": "1 serving",
        "c": 250
      }
    ]
  },
  {
    "i": 4306,
    "n": "Egg, whole, raw, fresh",
    "ms": [
      {
        "s": "1 large",
        "c": 28
      },
      {
        "s": "1 jumbo",
        "c": 35.3
      },
      {
        "s": "1 small",
        "c": 21.3
      },
      {
        "s": "1 extra large",
        "c": 31.4
      },
      {
        "s": "1 medium",
        "c": 24.6
      },
      {
        "s": "1 cup (4.86 large eggs)",
        "c": 136
      }
    ]
  },
  {
    "i": 4307,
    "n": "Cheese product, pasteurized process, American, vitamin D fortified",
    "ms": [
      {
        "s": "1 slice (3/4 oz)",
        "c": 289
      },
      {
        "s": "1 slice (2/3 oz)",
        "c": 261
      }
    ]
  },
  {
    "i": 4308,
    "n": "Cheese, Mexican blend",
    "ms": [
      {
        "s": "0.25 cup shredded",
        "c": 185
      }
    ]
  },
  {
    "i": 4309,
    "n": "Cheese, pasteurized process, American, without added vitamin D",
    "ms": [
      {
        "s": "1 slice (3/4 oz)",
        "c": 219
      },
      {
        "s": "1 cup, melted",
        "c": 2550
      },
      {
        "s": "1 cubic inch",
        "c": 188
      },
      {
        "s": "1 oz",
        "c": 296
      },
      {
        "s": "1 cup, diced",
        "c": 1460
      },
      {
        "s": "1 cup, shredded",
        "c": 1180
      },
      {
        "s": "1 slice (1 oz)",
        "c": 293
      }
    ]
  },
  {
    "i": 4310,
    "n": "Yogurt, fruit, low fat, 10 grams protein per 8 ounce",
    "ms": [
      {
        "s": "1 container, Dannon Sprinkl'ins (4.1 oz)",
        "c": 176
      },
      {
        "s": "1 container (8 oz)",
        "c": 345
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 372
      },
      {
        "s": "1 container (6 oz)",
        "c": 258
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 172
      }
    ]
  },
  {
    "i": 4311,
    "n": "Whey, sweet, fluid",
    "ms": [
      {
        "s": "1 cup",
        "c": 116
      },
      {
        "s": "1 quart",
        "c": 462
      }
    ]
  },
  {
    "i": 4312,
    "n": "Yogurt, fruit, low fat, 11g protein/8 oz",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 287
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 191
      },
      {
        "s": "1 container (8 oz)",
        "c": 384
      }
    ]
  },
  {
    "i": 4313,
    "n": "Whey, sweet, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 1150
      },
      {
        "s": "1 tbsp",
        "c": 59.7
      }
    ]
  },
  {
    "i": 4314,
    "n": "Yogurt, plain, whole milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 296
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 137
      },
      {
        "s": "1 container (6 oz)",
        "c": 206
      },
      {
        "s": "1 container (8 oz)",
        "c": 275
      }
    ]
  },
  {
    "i": 4315,
    "n": "Milk, indian buffalo, fluid",
    "ms": [
      {
        "s": "1 cup",
        "c": 412
      },
      {
        "s": "1 quart",
        "c": 1650
      }
    ]
  },
  {
    "i": 4316,
    "n": "Whey, acid, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 1170
      },
      {
        "s": "1 tbsp",
        "c": 59.6
      }
    ]
  },
  {
    "i": 4317,
    "n": "Milk, goat, fluid, with added vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 327
      },
      {
        "s": "1 quart",
        "c": 1310
      },
      {
        "s": "1 fl oz",
        "c": 40.9
      }
    ]
  },
  {
    "i": 4318,
    "n": "Milk, canned, evaporated, with added vitamin D and without added vitamin A",
    "ms": [
      {
        "s": "1 cup",
        "c": 658
      },
      {
        "s": "0.5 cup",
        "c": 329
      },
      {
        "s": "1 fl oz",
        "c": 82.2
      },
      {
        "s": "1 can (13 oz)",
        "c": 963
      }
    ]
  },
  {
    "i": 4319,
    "n": "Milk, human, mature, fluid (For Reference Only)",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 9.86
      },
      {
        "s": "1 cup",
        "c": 78.7
      }
    ]
  },
  {
    "i": 4320,
    "n": "Milk, chocolate beverage, hot cocoa, homemade",
    "ms": [
      {
        "s": "1 cup",
        "c": 285
      },
      {
        "s": "1 fl oz",
        "c": 35.6
      }
    ]
  },
  {
    "i": 4321,
    "n": "Milk, canned, condensed, sweetened",
    "ms": [
      {
        "s": "1 cup",
        "c": 869
      },
      {
        "s": "1 fl oz",
        "c": 108
      }
    ]
  },
  {
    "i": 4322,
    "n": "Milk, nonfat, fluid, protein fortified, with added vitamin A and vitamin D (fat free and skim)",
    "ms": [
      {
        "s": "1 cup",
        "c": 352
      },
      {
        "s": "1 quart",
        "c": 1410
      }
    ]
  },
  {
    "i": 4323,
    "n": "Milk, nonfat, fluid, with added nonfat milk solids, vitamin A and vitamin D (fat free or skim)",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 39.5
      },
      {
        "s": "1 cup",
        "c": 316
      },
      {
        "s": "1 quart",
        "c": 1260
      }
    ]
  },
  {
    "i": 4324,
    "n": "Milk, dry, nonfat, instant, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 837
      },
      {
        "s": "1 envelope (1-1/3 cup)",
        "c": 1120
      },
      {
        "s": "0.33 cup (makes 1 cup reconstituted milk)",
        "c": 283
      }
    ]
  },
  {
    "i": 4325,
    "n": "Milk, buttermilk, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 77
      },
      {
        "s": "0.25 cup",
        "c": 355
      },
      {
        "s": "1 cup",
        "c": 1420
      }
    ]
  },
  {
    "i": 4326,
    "n": "Milk, dry, nonfat, calcium reduced",
    "ms": [
      {
        "s": "0.25 lb",
        "c": 316
      },
      {
        "s": "1 oz",
        "c": 79.4
      }
    ]
  },
  {
    "i": 4327,
    "n": "Milk, producer, fluid, 3.7% milkfat",
    "ms": [
      {
        "s": "1 quart",
        "c": 1160
      },
      {
        "s": "1 cup",
        "c": 290
      }
    ]
  },
  {
    "i": 4328,
    "n": "Milk, reduced fat, fluid, 2% milkfat, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 36.6
      },
      {
        "s": "1 cup",
        "c": 293
      },
      {
        "s": "1 quart",
        "c": 1170
      }
    ]
  },
  {
    "i": 4329,
    "n": "Milk, lowfat, fluid, 1% milkfat, protein fortified, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 349
      },
      {
        "s": "1 quart",
        "c": 1400
      }
    ]
  },
  {
    "i": 4330,
    "n": "Milk, whole, 3.25% milkfat, with added vitamin D",
    "ms": [
      {
        "s": "1 quart",
        "c": 1100
      },
      {
        "s": "1 tbsp",
        "c": 17
      },
      {
        "s": "1 cup",
        "c": 276
      },
      {
        "s": "1 fl oz",
        "c": 34.5
      }
    ]
  },
  {
    "i": 4332,
    "n": "Milk substitutes, fluid, with lauric acid oil",
    "ms": [
      {
        "s": "1 cup",
        "c": 80.5
      },
      {
        "s": "1 quart",
        "c": 322
      }
    ]
  },
  {
    "i": 4333,
    "n": "Cream substitute, liquid, with lauric acid oil and sodium caseinate",
    "ms": [
      {
        "s": "1 container, individual",
        "c": 1.35
      },
      {
        "s": "0.5 cup",
        "c": 10.8
      }
    ]
  },
  {
    "i": 4334,
    "n": "Cream substitute, liquid, with hydrogenated vegetable oil and soy protein",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.7
      },
      {
        "s": "1 cup",
        "c": 21.6
      },
      {
        "s": "0.5 cup",
        "c": 10.8
      },
      {
        "s": "1 container, individual",
        "c": 1.35
      }
    ]
  },
  {
    "i": 4335,
    "n": "Cream substitute, powdered",
    "ms": [
      {
        "s": "1 packet",
        "c": 0.06
      },
      {
        "s": "1 cup",
        "c": 1.88
      },
      {
        "s": "1 tsp",
        "c": 0.04
      }
    ]
  },
  {
    "i": 4336,
    "n": "Sour dressing, non-butterfat, cultured, filled cream-type",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 13.6
      },
      {
        "s": "1 cup",
        "c": 266
      }
    ]
  },
  {
    "i": 4338,
    "n": "Cream, sour, cultured",
    "ms": [
      {
        "s": "1 cup",
        "c": 232
      },
      {
        "s": "1 tbsp",
        "c": 12.1
      }
    ]
  },
  {
    "i": 4339,
    "n": "Cream, fluid, half and half",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 32.3
      },
      {
        "s": "1 container, individual (.5 fl oz)",
        "c": 16
      },
      {
        "s": "1 cup",
        "c": 259
      },
      {
        "s": "1 tbsp",
        "c": 16
      }
    ]
  },
  {
    "i": 4340,
    "n": "Eggnog",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 41.3
      },
      {
        "s": "1 quart",
        "c": 1320
      },
      {
        "s": "1 cup",
        "c": 330
      }
    ]
  },
  {
    "i": 4341,
    "n": "Cream, sour, reduced fat, cultured",
    "ms": [
      {
        "s": "1 cup",
        "c": 252
      },
      {
        "s": "1 tbsp",
        "c": 15.6
      }
    ]
  },
  {
    "i": 4342,
    "n": "Cheese food, pasteurized process, American, vitamin D fortified",
    "ms": [
      {
        "s": "1 slice (3/4 oz)",
        "c": 143
      },
      {
        "s": "1 cup",
        "c": 771
      },
      {
        "s": "1 oz",
        "c": 193
      },
      {
        "s": "1 package (8 oz)",
        "c": 1550
      }
    ]
  },
  {
    "i": 4343,
    "n": "Cheese, roquefort",
    "ms": [
      {
        "s": "1 oz",
        "c": 188
      },
      {
        "s": "1 package (3 oz)",
        "c": 563
      }
    ]
  },
  {
    "i": 4344,
    "n": "Cheese food, pasteurized process, swiss",
    "ms": [
      {
        "s": "1 oz",
        "c": 205
      },
      {
        "s": "1 package (8 oz)",
        "c": 1640
      }
    ]
  },
  {
    "i": 4345,
    "n": "Cheese spread, pasteurized process, American",
    "ms": [
      {
        "s": "1 slice, thin",
        "c": 78.7
      },
      {
        "s": "1 jar (5 oz)",
        "c": 798
      },
      {
        "s": "1 cup, diced",
        "c": 787
      },
      {
        "s": "1 slice",
        "c": 191
      },
      {
        "s": "1 cup",
        "c": 1370
      },
      {
        "s": "1 jar (5 oz)",
        "c": 719
      },
      {
        "s": "1 cubic inch",
        "c": 101
      }
    ]
  },
  {
    "i": 4346,
    "n": "Cheese, Swiss*",
    "ms": [
      {
        "s": "1 slice (1 oz)",
        "c": 249
      },
      {
        "s": "1 cup, diced",
        "c": 1170
      },
      {
        "s": "1 oz",
        "c": 252
      },
      {
        "s": "1 cubic inch",
        "c": 134
      },
      {
        "s": "1 cup, shredded",
        "c": 961
      },
      {
        "s": "1 cup, melted",
        "c": 2170
      }
    ]
  },
  {
    "i": 4347,
    "n": "Cheese, muenster",
    "ms": [
      {
        "s": "1 cup, diced",
        "c": 946
      },
      {
        "s": "1 cubic inch",
        "c": 129
      },
      {
        "s": "1 package (6 oz)",
        "c": 1220
      },
      {
        "s": "1 cup, shredded",
        "c": 810
      },
      {
        "s": "1 slice (1 oz)",
        "c": 201
      },
      {
        "s": "1 oz",
        "c": 203
      }
    ]
  },
  {
    "i": 4348,
    "n": "Cheese, parmesan, grated",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 42.6
      },
      {
        "s": "1 cup",
        "c": 853
      },
      {
        "s": "1 oz",
        "c": 242
      }
    ]
  },
  {
    "i": 4349,
    "n": "Cheese, romano",
    "ms": [
      {
        "s": "1 oz",
        "c": 302
      },
      {
        "s": "5 package (5 oz)",
        "c": 1510
      }
    ]
  },
  {
    "i": 4350,
    "n": "Cheese, ricotta, part skim milk",
    "ms": [
      {
        "s": "1 oz",
        "c": 77.1
      },
      {
        "s": "1 cup",
        "c": 669
      },
      {
        "s": "0.5 cup",
        "c": 337
      }
    ]
  },
  {
    "i": 4351,
    "n": "Cheese, neufchatel",
    "ms": [
      {
        "s": "1 package (3 oz)",
        "c": 99.4
      },
      {
        "s": "1 oz",
        "c": 33.2
      }
    ]
  },
  {
    "i": 4352,
    "n": "Cheese, gjetost",
    "ms": [
      {
        "s": "1 package (8 oz)",
        "c": 908
      },
      {
        "s": "1 oz",
        "c": 113
      }
    ]
  },
  {
    "i": 4353,
    "n": "Cheese, gouda",
    "ms": [
      {
        "s": "1 package (7 oz)",
        "c": 1390
      },
      {
        "s": "1 oz",
        "c": 198
      }
    ]
  },
  {
    "i": 4354,
    "n": "Cheese, gruyere",
    "ms": [
      {
        "s": "1 package (6 oz)",
        "c": 1720
      },
      {
        "s": "1 cup, diced",
        "c": 1330
      },
      {
        "s": "1 slice (1 oz)",
        "c": 283
      },
      {
        "s": "1 cup, shredded",
        "c": 1090
      },
      {
        "s": "1 oz",
        "c": 287
      },
      {
        "s": "1 cubic inch",
        "c": 152
      }
    ]
  },
  {
    "i": 4355,
    "n": "Cheese, mozzarella, low moisture, part-skim",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 788
      },
      {
        "s": "1 cubic inch",
        "c": 125
      },
      {
        "s": "1 slice (1 oz)",
        "c": 195
      },
      {
        "s": "1 cup, diced",
        "c": 920
      },
      {
        "s": "1 oz",
        "c": 198
      }
    ]
  },
  {
    "i": 4357,
    "n": "Cheese, limburger",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 89.5
      },
      {
        "s": "1 oz",
        "c": 141
      },
      {
        "s": "1 package (8 oz)",
        "c": 1130
      },
      {
        "s": "1 box",
        "c": 562
      },
      {
        "s": "1 cup",
        "c": 666
      }
    ]
  },
  {
    "i": 4361,
    "n": "Beef, Rib Eye Steak, Bone-In, Lip-On, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 84.7
      },
      {
        "s": "3 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 4362,
    "n": "Beef, chuck eye steak, boneless, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 53.8
      },
      {
        "s": "4 oz",
        "c": 15.8
      }
    ]
  },
  {
    "i": 4369,
    "n": "Beef, Shoulder Pot Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 roast",
        "c": 101
      }
    ]
  },
  {
    "i": 4371,
    "n": "Beef, Shoulder Pot Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 roast",
        "c": 103
      }
    ]
  },
  {
    "i": 4376,
    "n": "Beef, Chuck, Mock Tender Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 steak",
        "c": 21
      }
    ]
  },
  {
    "i": 4379,
    "n": "Beef, Chuck, Mock Tender Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 steak",
        "c": 22.4
      }
    ]
  },
  {
    "i": 4383,
    "n": "Beef, chuck, under blade center steak, boneless, Denver Cut, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 steak",
        "c": 53.1
      }
    ]
  },
  {
    "i": 4386,
    "n": "Beef, Chuck, Under Blade Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 4388,
    "n": "Beef, Chuck, Under Blade Pot Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 4393,
    "n": "Beef, chuck for stew, separable lean and fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 4394,
    "n": "Beef, Shoulder Pot Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 102
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 4400,
    "n": "Beef, Chuck, Short Ribs, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 piece",
        "c": 51.5
      }
    ]
  },
  {
    "i": 4402,
    "n": "Beef, chuck eye Country-Style ribs, boneless, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 51
      },
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 4403,
    "n": "Beef, chuck eye Country-Style ribs, boneless, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      },
      {
        "s": "1 piece",
        "c": 49.6
      }
    ]
  },
  {
    "i": 4404,
    "n": "Sauce, hot chile, sriracha",
    "ms": [
      {
        "s": "1 tsp",
        "c": 1.17
      }
    ]
  },
  {
    "i": 4406,
    "n": "Sauce, cheese, ready-to-serve",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 116
      }
    ]
  },
  {
    "i": 4416,
    "n": "Soup, ramen noodle, any flavor, dry",
    "ms": [
      {
        "s": "1 package without flavor packet",
        "c": 17
      },
      {
        "s": "1 packet",
        "c": 1.22
      }
    ]
  },
  {
    "i": 4418,
    "n": "Soup, broccoli cheese, canned, condensed, commercial",
    "ms": [
      {
        "s": "1 serving 1/2 cup",
        "c": 49.6
      },
      {
        "s": "1 can 10.7 oz (10.75 oz)",
        "c": 124
      }
    ]
  },
  {
    "i": 4422,
    "n": "Gravy, mushroom, dry, powder",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 48.3
      }
    ]
  },
  {
    "i": 4423,
    "n": "Gravy, onion, dry, mix",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 67.2
      }
    ]
  },
  {
    "i": 4424,
    "n": "Gravy, pork, dry, powder",
    "ms": [
      {
        "s": "1 serving",
        "c": 9.31
      }
    ]
  },
  {
    "i": 4427,
    "n": "Gravy, au jus, dry",
    "ms": [
      {
        "s": "1 tsp",
        "c": 4.2
      }
    ]
  },
  {
    "i": 4428,
    "n": "Soup, onion, dry, mix",
    "ms": [
      {
        "s": "1 packet",
        "c": 55.8
      },
      {
        "s": "1 serving 1 tbsp",
        "c": 10.7
      }
    ]
  },
  {
    "i": 4429,
    "n": "Soup, vegetable beef, canned, condensed",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 16.4
      },
      {
        "s": "1 can (10.75 oz)",
        "c": 39.6
      }
    ]
  },
  {
    "i": 4431,
    "n": "Soup, vegetable with beef broth, canned, condensed",
    "ms": [
      {
        "s": "1 can (10.5 oz)",
        "c": 41.7
      },
      {
        "s": "0.5 cup",
        "c": 17.2
      }
    ]
  },
  {
    "i": 4432,
    "n": "Soup, vegetarian vegetable, canned, condensed",
    "ms": [
      {
        "s": "1 can (10.5 oz)",
        "c": 50.7
      },
      {
        "s": "0.5 cup",
        "c": 21.4
      }
    ]
  },
  {
    "i": 4434,
    "n": "Soup, cream of vegetable, dry, powder",
    "ms": [
      {
        "s": "1 packet",
        "c": 24.1
      }
    ]
  },
  {
    "i": 4444,
    "n": "Soup, chicken vegetable, canned, condensed",
    "ms": [
      {
        "s": "1 can (10.7 oz)",
        "c": 42.4
      },
      {
        "s": "0.5 cup",
        "c": 16.9
      }
    ]
  },
  {
    "i": 4457,
    "n": "Turkey, back, from whole bird, meat and skin, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 back",
        "c": 174
      }
    ]
  },
  {
    "i": 4460,
    "n": "Turkey, retail parts, drumstick, meat and skin, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 drumstick",
        "c": 32
      }
    ]
  },
  {
    "i": 4462,
    "n": "Turkey, drumstick, from whole bird, meat only, raw",
    "ms": [
      {
        "s": "1 drumstick",
        "c": 37.1
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4464,
    "n": "Turkey, retail parts, wing, meat and skin, raw",
    "ms": [
      {
        "s": "1 wing",
        "c": 41.4
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 4465,
    "n": "Turkey, retail parts, breast, meat and skin, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 breast",
        "c": 105
      }
    ]
  },
  {
    "i": 4468,
    "n": "Turkey, thigh, from whole bird, meat only, with added solution, raw",
    "ms": [
      {
        "s": "1 thigh",
        "c": 63.6
      },
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 4472,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, breast, meat and skin, cooked",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.25
      },
      {
        "s": "1 breast",
        "c": 51.4
      },
      {
        "s": "1 serving (3 oz)",
        "c": 12.8
      }
    ]
  },
  {
    "i": 4473,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, back, meat and skin, cooked",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.92
      },
      {
        "s": "1 serving (3 oz)",
        "c": 29.8
      },
      {
        "s": "1 back",
        "c": 35.7
      }
    ]
  },
  {
    "i": 4474,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, wing, meat only, cooked",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.07
      },
      {
        "s": "1 wing",
        "c": 17
      },
      {
        "s": "1 serving (3 oz)",
        "c": 27.2
      }
    ]
  },
  {
    "i": 4475,
    "n": "Chicken, ground, raw",
    "ms": [
      {
        "s": "4 oz crumbled",
        "c": 6.78
      }
    ]
  },
  {
    "i": 4476,
    "n": "Chicken, ground, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz crumbled",
        "c": 6.8
      }
    ]
  },
  {
    "i": 4477,
    "n": "Chicken, broilers or fryers, rotisserie, original seasoning, thigh, meat only, cooked",
    "ms": [
      {
        "s": "1 thigh",
        "c": 11.6
      },
      {
        "s": "1 serving (3 oz)",
        "c": 11
      },
      {
        "s": "1 oz",
        "c": 3.69
      }
    ]
  },
  {
    "i": 4478,
    "n": "Chicken, feet, boiled",
    "ms": [
      {
        "s": "1 lb",
        "c": 399
      },
      {
        "s": "3 oz",
        "c": 74.8
      }
    ]
  },
  {
    "i": 4480,
    "n": "Duck, young duckling, domesticated, White Pekin, leg, meat only, bone in, cooked without skin, braised",
    "ms": [
      {
        "s": "1 leg, bone and skin removed",
        "c": 7.5
      },
      {
        "s": "3 oz",
        "c": 8.5
      },
      {
        "s": "1 cup chopped or diced, cooked",
        "c": 17.4
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 3.5
      }
    ]
  },
  {
    "i": 4483,
    "n": "Duck, young duckling, domesticated, White Pekin, leg, meat and skin, bone in, cooked, roasted",
    "ms": [
      {
        "s": "1 leg, bone removed (yield after cooking)",
        "c": 9.2
      },
      {
        "s": "3 oz",
        "c": 8.5
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook duck)",
        "c": 4.3
      }
    ]
  },
  {
    "i": 4488,
    "n": "Chicken, cornish game hens, meat only, raw",
    "ms": [
      {
        "s": "1 bird whole",
        "c": 28.7
      },
      {
        "s": "3 oz",
        "c": 10.2
      },
      {
        "s": "0.5 bird",
        "c": 14.4
      }
    ]
  },
  {
    "i": 4489,
    "n": "Poultry, mechanically deboned, from backs and necks without skin, raw",
    "ms": [
      {
        "s": "0.5 lb",
        "c": 279
      }
    ]
  },
  {
    "i": 4490,
    "n": "Turkey sticks, breaded, battered, fried",
    "ms": [
      {
        "s": "1 stick (2.25 oz)",
        "c": 8.96
      }
    ]
  },
  {
    "i": 4491,
    "n": "Poultry, mechanically deboned, from mature hens, raw",
    "ms": [
      {
        "s": "0.5 lb",
        "c": 424
      }
    ]
  },
  {
    "i": 4492,
    "n": "Poultry, mechanically deboned, from backs and necks with skin, raw",
    "ms": [
      {
        "s": "0.5 lb",
        "c": 313
      }
    ]
  },
  {
    "i": 4495,
    "n": "Turkey, diced, light and dark meat, seasoned",
    "ms": [
      {
        "s": "0.5 lb",
        "c": 2.27
      },
      {
        "s": "1 oz",
        "c": 0.284
      }
    ]
  },
  {
    "i": 4497,
    "n": "Turkey, whole, breast, meat only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 breast",
        "c": 195
      }
    ]
  },
  {
    "i": 4499,
    "n": "Turkey, whole, back, meat only, raw",
    "ms": [
      {
        "s": "1 back",
        "c": 124
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4501,
    "n": "Turkey, all classes, back, meat and skin, cooked, roasted",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 46.2
      },
      {
        "s": "0.5 back, bone removed",
        "c": 86.5
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook turkey)",
        "c": 11.2
      }
    ]
  },
  {
    "i": 4502,
    "n": "Turkey, all classes, breast, meat and skin, raw",
    "ms": [
      {
        "s": "0.5 breast, bone removed",
        "c": 147
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook turkey)",
        "c": 19
      }
    ]
  },
  {
    "i": 4503,
    "n": "Turkey, fryer-roasters, meat and skin, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 18.7
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook turkey)",
        "c": 50.4
      },
      {
        "s": "0.5 turkey, bone removed",
        "c": 178
      }
    ]
  },
  {
    "i": 4505,
    "n": "Turkey, whole, dark meat, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 4506,
    "n": "Turkey, whole, dark meat, meat only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 serving",
        "c": 9.35
      }
    ]
  },
  {
    "i": 4507,
    "n": "Turkey, whole, light meat, meat and skin, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 49.8
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4508,
    "n": "Turkey, whole, neck, meat only, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 109
      },
      {
        "s": "1 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 4509,
    "n": "Turkey, whole, giblets, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 20.3
      },
      {
        "s": "1 giblets",
        "c": 28.3
      }
    ]
  },
  {
    "i": 4510,
    "n": "Turkey, gizzard, all classes, raw",
    "ms": [
      {
        "s": "1 raw gizzard",
        "c": 10.1
      },
      {
        "s": "4 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 4511,
    "n": "Turkey, whole, giblets, cooked, simmered",
    "ms": [
      {
        "s": "1 giblets",
        "c": 17.1
      },
      {
        "s": "3 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 4512,
    "n": "Turkey, whole, neck, meat only, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 49.3
      }
    ]
  },
  {
    "i": 4513,
    "n": "Turkey, whole, meat and skin, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 bird",
        "c": 550
      }
    ]
  },
  {
    "i": 4515,
    "n": "Squab, (pigeon), light meat without skin, raw",
    "ms": [
      {
        "s": "1 breast, bone removed",
        "c": 10.1
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook squab)",
        "c": 15.1
      }
    ]
  },
  {
    "i": 4517,
    "n": "Squab, (pigeon), meat only, raw",
    "ms": [
      {
        "s": "1 squab",
        "c": 21.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook squab)",
        "c": 32.6
      }
    ]
  },
  {
    "i": 4518,
    "n": "Chicken, broilers or fryers, back, meat only, raw",
    "ms": [
      {
        "s": "0.5 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 5.27
      },
      {
        "s": "0 back, bone and skin removed",
        "c": 8.67
      },
      {
        "s": "4 oz",
        "c": 19.2
      }
    ]
  },
  {
    "i": 4519,
    "n": "Chicken, broiler or fryers, breast, skinless, boneless, meat only, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 13.6
      },
      {
        "s": "1 package",
        "c": 46.3
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 4521,
    "n": "Chicken, broilers or fryers, breast, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 18.2
      },
      {
        "s": "0.5 breast, bone removed",
        "c": 14.3
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 8.58
      }
    ]
  },
  {
    "i": 4525,
    "n": "Chicken, broilers or fryers, back, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 28.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 6.48
      },
      {
        "s": "3 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 4527,
    "n": "Chicken, broilers or fryers, dark meat, meat only, raw",
    "ms": [
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 21.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 13.1
      }
    ]
  },
  {
    "i": 4528,
    "n": "Chicken, broilers or fryers, dark meat, meat only, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 19.6
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 12
      },
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 20
      }
    ]
  },
  {
    "i": 4530,
    "n": "Chicken, liver, all classes, cooked, simmered",
    "ms": [
      {
        "s": "1 liver",
        "c": 4.84
      },
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 4531,
    "n": "Chicken, broilers or fryers, light meat, meat and skin, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "0.5 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 12.8
      },
      {
        "s": "0 chicken, bone removed",
        "c": 21.3
      }
    ]
  },
  {
    "i": 4532,
    "n": "Chicken, broilers or fryers, dark meat, meat and skin, cooked, fried, flour",
    "ms": [
      {
        "s": "0.5 chicken, bone removed",
        "c": 31.3
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 18.7
      }
    ]
  },
  {
    "i": 4533,
    "n": "Chicken, broilers or fryers, dark meat, meat and skin, cooked, fried, batter",
    "ms": [
      {
        "s": "3 oz",
        "c": 17.8
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 35.1
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 58.4
      }
    ]
  },
  {
    "i": 4534,
    "n": "Chicken, broilers or fryers, dark meat, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 15.4
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 25.8
      }
    ]
  },
  {
    "i": 4535,
    "n": "Chicken, heart, all classes, cooked, simmered",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 27.6
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 0.19
      }
    ]
  },
  {
    "i": 4537,
    "n": "Chicken, broilers or fryers, skin only, cooked, stewed",
    "ms": [
      {
        "s": "0.5 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 5.28
      },
      {
        "s": "0 chicken, skin only",
        "c": 8.64
      },
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 4539,
    "n": "Chicken, liver, all classes, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 9.04
      },
      {
        "s": "1 liver",
        "c": 3.52
      }
    ]
  },
  {
    "i": 4540,
    "n": "Chicken, broilers or fryers, giblets, raw",
    "ms": [
      {
        "s": "1 giblets",
        "c": 7.5
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 2.3
      }
    ]
  },
  {
    "i": 4542,
    "n": "Chicken, broilers or fryers, meat only, raw",
    "ms": [
      {
        "s": "0.5 chicken, bone and skin removed",
        "c": 39.5
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 23.6
      },
      {
        "s": "4 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 4544,
    "n": "Chicken, broilers or fryers, meat and skin, cooked, stewed",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 18.2
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 26
      },
      {
        "s": "0.5 chicken, bone removed",
        "c": 43.4
      }
    ]
  },
  {
    "i": 4546,
    "n": "Salad dressing, honey mustard, regular",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 3.6
      }
    ]
  },
  {
    "i": 4547,
    "n": "Salad dressing, poppyseed, creamy",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 19.5
      }
    ]
  },
  {
    "i": 4548,
    "n": "Chicken, broilers or fryers, meat and skin and giblets and neck, cooked, fried, flour",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      },
      {
        "s": "1 chicken",
        "c": 120
      },
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 36
      }
    ]
  },
  {
    "i": 4549,
    "n": "Salad dressing, caesar, fat-free",
    "ms": [
      {
        "s": "2 tbsp (1 NLEA serving)",
        "c": 11.2
      }
    ]
  },
  {
    "i": 4550,
    "n": "Chicken, broilers or fryers, meat and skin and giblets and neck, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 9.35
      },
      {
        "s": "1 chicken",
        "c": 115
      }
    ]
  },
  {
    "i": 4551,
    "n": "Dressing, honey mustard, fat-free",
    "ms": [
      {
        "s": "2 tbsp (1 NLEA serving)",
        "c": 7.2
      }
    ]
  },
  {
    "i": 4552,
    "n": "Chicken, broilers or fryers, meat and skin and giblets and neck, cooked, fried, batter",
    "ms": [
      {
        "s": "1 unit (yield from 1 lb ready-to-cook chicken)",
        "c": 64.7
      },
      {
        "s": "1 chicken",
        "c": 216
      },
      {
        "s": "3 oz",
        "c": 17.8
      }
    ]
  },
  {
    "i": 4553,
    "n": "Margarine-like, vegetable oil spread, 60% fat, tub, with salt, with added vitamin D",
    "ms": [
      {
        "s": "1 teaspoon",
        "c": 1.01
      },
      {
        "s": "1 cup",
        "c": 48.1
      },
      {
        "s": "1 tbsp",
        "c": 2.94
      }
    ]
  },
  {
    "i": 4554,
    "n": "Margarine-like vegetable-oil spread, stick/tub/bottle, 60% fat, with added vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 48.1
      },
      {
        "s": "1 tbsp",
        "c": 2.94
      },
      {
        "s": "1 teaspoon",
        "c": 1.01
      }
    ]
  },
  {
    "i": 4556,
    "n": "Margarine-like, vegetable oil spread, 60% fat, stick/tub/bottle, without salt, with added vitamin D",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.94
      }
    ]
  },
  {
    "i": 4557,
    "n": "Margarine, Regular, 80% Fat, Composite, Stick, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 6.87
      },
      {
        "s": "1 tbsp",
        "c": 0.42
      },
      {
        "s": "1 teaspoon",
        "c": 0.144
      }
    ]
  },
  {
    "i": 4558,
    "n": "Oil, industrial, canola, high oleic",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4559,
    "n": "Salad dressing, spray-style dressing, assorted flavors",
    "ms": [
      {
        "s": "1 serving (approximately 10 sprays)",
        "c": 0.48
      }
    ]
  },
  {
    "i": 4560,
    "n": "Salad dressing, honey mustard dressing, reduced calorie",
    "ms": [
      {
        "s": "2 tbsp (1 serving)",
        "c": 20.1
      }
    ]
  },
  {
    "i": 4562,
    "n": "Oil, apricot kernel",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4563,
    "n": "Oil, walnut",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4564,
    "n": "Oil, almond",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4565,
    "n": "Oil, safflower, salad or cooking, linoleic, (over 70%)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4566,
    "n": "Oil, grapeseed",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4567,
    "n": "Oil, corn, industrial and retail, all purpose salad or cooking",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4568,
    "n": "Oil, safflower, salad or cooking, high oleic (primary safflower oil of commerce)",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4571,
    "n": "Salad dressing, italian dressing, reduced fat, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 21.6
      },
      {
        "s": "1 tablespoon",
        "c": 1.35
      }
    ]
  },
  {
    "i": 4572,
    "n": "Salad dressing, italian dressing, commercial, regular, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.4
      },
      {
        "s": "1 tablespoon",
        "c": 1.03
      }
    ]
  },
  {
    "i": 4574,
    "n": "Oil, cottonseed, salad or cooking",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4575,
    "n": "Margarine, regular, hard, soybean (hydrogenated)",
    "ms": [
      {
        "s": "1 tsp",
        "c": 1.41
      },
      {
        "s": "1 stick",
        "c": 33.9
      }
    ]
  },
  {
    "i": 4577,
    "n": "Oil, rice bran",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4578,
    "n": "Oil, sesame, salad or cooking",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4579,
    "n": "Oil, palm",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      }
    ]
  },
  {
    "i": 4581,
    "n": "Oil, wheat germ",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 4582,
    "n": "Salad dressing, mayonnaise, soybean and safflower oil, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 39.6
      },
      {
        "s": "1 tablespoon",
        "c": 2.48
      }
    ]
  },
  {
    "i": 4583,
    "n": "Salad dressing, thousand island dressing, reduced fat",
    "ms": [
      {
        "s": "1 serving (2 tbsp)",
        "c": 4.05
      },
      {
        "s": "1 cup",
        "c": 66.2
      },
      {
        "s": "1 tablespoon",
        "c": 4.05
      }
    ]
  },
  {
    "i": 4584,
    "n": "Shortening, household, soybean (partially hydrogenated)-cottonseed (partially hydrogenated)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 4586,
    "n": "Salad dressing, mayonnaise, regular",
    "ms": [
      {
        "s": "1 packet",
        "c": 0.8
      },
      {
        "s": "1 cup",
        "c": 17.6
      },
      {
        "s": "1 tbsp",
        "c": 1.1
      }
    ]
  },
  {
    "i": 4587,
    "n": "Salad dressing, sesame seed dressing, regular",
    "ms": [
      {
        "s": "1 cup",
        "c": 46.6
      },
      {
        "s": "1 tablespoon",
        "c": 2.85
      }
    ]
  },
  {
    "i": 4588,
    "n": "Salad dressing, russian dressing",
    "ms": [
      {
        "s": "1 cup",
        "c": 31.8
      },
      {
        "s": "1 tbsp",
        "c": 1.95
      },
      {
        "s": "1 serving (2 tbsp)",
        "c": 3.9
      }
    ]
  },
  {
    "i": 4590,
    "n": "Salad dressing, russian dressing, low calorie",
    "ms": [
      {
        "s": "1 cup",
        "c": 49.4
      },
      {
        "s": "1 tablespoon",
        "c": 3.04
      }
    ]
  },
  {
    "i": 4655,
    "n": "Spices, tarragon, dried",
    "ms": [
      {
        "s": "1 tbsp, ground",
        "c": 54.7
      },
      {
        "s": "1 tsp, leaves",
        "c": 6.83
      },
      {
        "s": "1 tbsp, leaves",
        "c": 20.5
      },
      {
        "s": "1 tsp, ground",
        "c": 18.2
      }
    ]
  },
  {
    "i": 4656,
    "n": "Spices, sage, ground",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 33
      },
      {
        "s": "1 tsp",
        "c": 11.6
      }
    ]
  },
  {
    "i": 4658,
    "n": "Spices, thyme, dried",
    "ms": [
      {
        "s": "1 tsp, ground",
        "c": 26.5
      },
      {
        "s": "1 tbsp, leaves",
        "c": 51
      },
      {
        "s": "1 tbsp, ground",
        "c": 81.3
      },
      {
        "s": "1 tsp, leaves",
        "c": 18.9
      }
    ]
  },
  {
    "i": 4659,
    "n": "Spices, pepper, white",
    "ms": [
      {
        "s": "1 tsp, ground",
        "c": 6.36
      },
      {
        "s": "1 tbsp, ground",
        "c": 18.8
      }
    ]
  },
  {
    "i": 4660,
    "n": "Spices, savory, ground",
    "ms": [
      {
        "s": "1 tsp",
        "c": 29.8
      },
      {
        "s": "1 tbsp",
        "c": 93.8
      }
    ]
  },
  {
    "i": 4661,
    "n": "Spices, saffron",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.33
      },
      {
        "s": "1 tsp",
        "c": 0.777
      }
    ]
  },
  {
    "i": 4662,
    "n": "Spices, pepper, red or cayenne",
    "ms": [
      {
        "s": "1 tsp",
        "c": 2.66
      },
      {
        "s": "1 tbsp",
        "c": 7.84
      }
    ]
  },
  {
    "i": 4663,
    "n": "Spices, parsley, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 18.2
      },
      {
        "s": "1 tsp",
        "c": 5.7
      }
    ]
  },
  {
    "i": 4664,
    "n": "Spices, marjoram, dried",
    "ms": [
      {
        "s": "1 tsp",
        "c": 11.9
      },
      {
        "s": "1 tbsp",
        "c": 33.8
      }
    ]
  },
  {
    "i": 4665,
    "n": "Spices, mustard seed, ground",
    "ms": [
      {
        "s": "1 tsp",
        "c": 5.32
      },
      {
        "s": "1 tbsp",
        "c": 16.8
      }
    ]
  },
  {
    "i": 4666,
    "n": "Spices, pepper, black",
    "ms": [
      {
        "s": "1 tsp, whole",
        "c": 12.8
      },
      {
        "s": "1 tsp, ground",
        "c": 10.2
      },
      {
        "s": "1 dash",
        "c": 0.443
      },
      {
        "s": "1 tbsp, ground",
        "c": 30.6
      }
    ]
  },
  {
    "i": 4667,
    "n": "Spices, coriander seed",
    "ms": [
      {
        "s": "1 tsp",
        "c": 12.8
      },
      {
        "s": "1 tbsp",
        "c": 35.4
      }
    ]
  },
  {
    "i": 4668,
    "n": "Spices, dill seed",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 100
      },
      {
        "s": "1 tsp",
        "c": 31.8
      }
    ]
  },
  {
    "i": 4669,
    "n": "Spices, ginger, ground",
    "ms": [
      {
        "s": "1 tsp",
        "c": 2.05
      },
      {
        "s": "1 tbsp",
        "c": 5.93
      }
    ]
  },
  {
    "i": 4670,
    "n": "Spices, mace, ground",
    "ms": [
      {
        "s": "1 tsp",
        "c": 4.28
      },
      {
        "s": "1 tbsp",
        "c": 13.4
      }
    ]
  },
  {
    "i": 4671,
    "n": "Spices, curry powder",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 33.1
      },
      {
        "s": "1 tsp",
        "c": 10.5
      }
    ]
  },
  {
    "i": 4672,
    "n": "Spices, cumin seed",
    "ms": [
      {
        "s": "1 tbsp, whole",
        "c": 55.9
      },
      {
        "s": "1 tsp, whole",
        "c": 19.6
      }
    ]
  },
  {
    "i": 4673,
    "n": "Spices, cardamom",
    "ms": [
      {
        "s": "1 tbsp, ground",
        "c": 22.2
      },
      {
        "s": "1 tsp, ground",
        "c": 7.66
      }
    ]
  },
  {
    "i": 4674,
    "n": "Spices, bay leaf",
    "ms": [
      {
        "s": "1 tsp, crumbled",
        "c": 5
      },
      {
        "s": "1 tbsp, crumbled",
        "c": 15
      }
    ]
  },
  {
    "i": 4675,
    "n": "Spices, caraway seed",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 46.2
      },
      {
        "s": "1 tsp",
        "c": 14.5
      }
    ]
  },
  {
    "i": 4678,
    "n": "Spices, celery seed",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 115
      },
      {
        "s": "1 tsp",
        "c": 35.3
      }
    ]
  },
  {
    "i": 4680,
    "n": "Spices, coriander leaf, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 22.4
      },
      {
        "s": "1 tsp",
        "c": 7.48
      }
    ]
  },
  {
    "i": 4683,
    "n": "Milk, chocolate, lowfat, reduced sugar",
    "ms": [
      {
        "s": "100 g",
        "c": 122
      }
    ]
  },
  {
    "i": 4685,
    "n": "Ice cream, lowfat, no sugar added, cone, added peanuts and chocolate sauce",
    "ms": [
      {
        "s": "100 g",
        "c": 133
      }
    ]
  },
  {
    "i": 4686,
    "n": "Yogurt, frozen, flavors other than chocolate, lowfat",
    "ms": [
      {
        "s": "100 g",
        "c": 200
      }
    ]
  },
  {
    "i": 4687,
    "n": "Yogurt, Greek, vanilla, lowfat",
    "ms": [
      {
        "s": "100 g",
        "c": 100
      }
    ]
  },
  {
    "i": 4688,
    "n": "Yogurt, Greek, plain, lowfat",
    "ms": [
      {
        "s": "1 container (7 oz)",
        "c": 230
      }
    ]
  },
  {
    "i": 4689,
    "n": "Yogurt, Greek, fruit, whole milk",
    "ms": [
      {
        "s": "100 g",
        "c": 100
      }
    ]
  },
  {
    "i": 4691,
    "n": "Yogurt, vanilla, non-fat",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 289
      },
      {
        "s": "1 container (8 oz)",
        "c": 268
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 133
      }
    ]
  },
  {
    "i": 4692,
    "n": "Yogurt, Greek, vanilla, nonfat",
    "ms": [
      {
        "s": "1 container (5.3 oz)",
        "c": 148
      }
    ]
  },
  {
    "i": 4693,
    "n": "Cheese, cheddar, sharp, sliced",
    "ms": [
      {
        "s": "1 slice (2/3 oz)",
        "c": 135
      },
      {
        "s": "1 slice (3/4 oz)",
        "c": 149
      },
      {
        "s": "1 slice (1 oz)",
        "c": 199
      }
    ]
  },
  {
    "i": 4694,
    "n": "Cheese, mexican, queso cotija",
    "ms": [
      {
        "s": "2 tsp",
        "c": 40
      }
    ]
  },
  {
    "i": 4696,
    "n": "Cheese, mozzarella, low moisture, part-skim, shredded",
    "ms": [
      {
        "s": "1 cup",
        "c": 616
      }
    ]
  },
  {
    "i": 4697,
    "n": "Cheese, Swiss, nonfat or fat free",
    "ms": [
      {
        "s": "1 serving",
        "c": 269
      }
    ]
  },
  {
    "i": 4699,
    "n": "Egg, white, dried, stabilized, glucose reduced",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.07
      },
      {
        "s": "1 cup, sifted",
        "c": 108
      }
    ]
  },
  {
    "i": 4701,
    "n": "Cheese spread, American or Cheddar cheese base, reduced fat",
    "ms": [
      {
        "s": "1 piece",
        "c": 117
      },
      {
        "s": "1 package",
        "c": 3150
      }
    ]
  },
  {
    "i": 4702,
    "n": "Nutritional supplement for people with diabetes, liquid",
    "ms": [
      {
        "s": "1 can",
        "c": 250
      }
    ]
  },
  {
    "i": 4703,
    "n": "Yogurt, plain, skim milk",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 488
      },
      {
        "s": "1 container (6 oz)",
        "c": 338
      },
      {
        "s": "1 container (8 oz)",
        "c": 452
      }
    ]
  },
  {
    "i": 4704,
    "n": "Milk dessert bar, frozen, made from lowfat milk",
    "ms": [
      {
        "s": "1 bar",
        "c": 125
      }
    ]
  },
  {
    "i": 4705,
    "n": "Yogurt, vanilla, low fat.",
    "ms": [
      {
        "s": "1 container (8 oz)",
        "c": 388
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 419
      },
      {
        "s": "1 container (6 oz)",
        "c": 291
      }
    ]
  },
  {
    "i": 4707,
    "n": "Yogurt, fruit, low fat,9 g protein/8 oz",
    "ms": [
      {
        "s": "1 container (8 oz)",
        "c": 313
      },
      {
        "s": "1 container (6 oz)",
        "c": 235
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 338
      },
      {
        "s": "1 container (4.4 oz)",
        "c": 172
      },
      {
        "s": "1 container (5 oz)",
        "c": 196
      },
      {
        "s": "0.5 container (4 oz)",
        "c": 156
      }
    ]
  },
  {
    "i": 4708,
    "n": "Milk, sheep, fluid",
    "ms": [
      {
        "s": "1 quart",
        "c": 1890
      },
      {
        "s": "1 cup",
        "c": 473
      }
    ]
  },
  {
    "i": 4709,
    "n": "Milk, chocolate, lowfat, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 322
      },
      {
        "s": "1 quart",
        "c": 1290
      }
    ]
  },
  {
    "i": 4710,
    "n": "Whey, acid, fluid",
    "ms": [
      {
        "s": "1 cup",
        "c": 253
      },
      {
        "s": "1 quart",
        "c": 1010
      }
    ]
  },
  {
    "i": 4711,
    "n": "Milk shakes, thick vanilla",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 41.5
      },
      {
        "s": "1 container (11 oz)",
        "c": 457
      }
    ]
  },
  {
    "i": 4713,
    "n": "Milk shakes, thick chocolate",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 37.5
      },
      {
        "s": "1 container (10.6 oz)",
        "c": 396
      }
    ]
  },
  {
    "i": 4714,
    "n": "Milk, dry, whole, with added vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 1170
      },
      {
        "s": "0.25 cup",
        "c": 292
      }
    ]
  },
  {
    "i": 4715,
    "n": "Milk, chocolate, fluid, commercial, whole, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 quart",
        "c": 1120
      },
      {
        "s": "1 cup",
        "c": 280
      },
      {
        "s": "1 fl oz",
        "c": 34.9
      }
    ]
  },
  {
    "i": 4716,
    "n": "Milk, canned, evaporated, nonfat, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 742
      },
      {
        "s": "0.5 cup",
        "c": 371
      },
      {
        "s": "1 fl oz",
        "c": 92.5
      }
    ]
  },
  {
    "i": 4717,
    "n": "Milk, chocolate, fluid, commercial, reduced fat, with added vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 272
      },
      {
        "s": "1 fl oz",
        "c": 34
      },
      {
        "s": "1 quart",
        "c": 1090
      }
    ]
  },
  {
    "i": 4718,
    "n": "Milk, dry, nonfat, regular, without added vitamin A and vitamin D",
    "ms": [
      {
        "s": "5 tbsp",
        "c": 289
      },
      {
        "s": "0.25 cup",
        "c": 377
      },
      {
        "s": "1 cup",
        "c": 1510
      }
    ]
  },
  {
    "i": 4719,
    "n": "Milk, lowfat, fluid, 1% milkfat, with added nonfat milk solids, vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 cup",
        "c": 314
      },
      {
        "s": "1 quart",
        "c": 1250
      }
    ]
  },
  {
    "i": 4720,
    "n": "Milk, buttermilk, fluid, cultured, lowfat",
    "ms": [
      {
        "s": "1 cup",
        "c": 284
      },
      {
        "s": "1 quart",
        "c": 1140
      },
      {
        "s": "1 fl oz",
        "c": 35.5
      }
    ]
  },
  {
    "i": 4722,
    "n": "Milk, low sodium, fluid",
    "ms": [
      {
        "s": "1 quart",
        "c": 986
      },
      {
        "s": "1 cup",
        "c": 246
      },
      {
        "s": "1 fl oz",
        "c": 30.8
      }
    ]
  },
  {
    "i": 4723,
    "n": "Milk, reduced fat, fluid, 2% milkfat, with added nonfat milk solids and vitamin A and vitamin D",
    "ms": [
      {
        "s": "1 quart",
        "c": 1250
      },
      {
        "s": "1 cup",
        "c": 314
      }
    ]
  },
  {
    "i": 4725,
    "n": "Dessert topping, pressurized",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.2
      },
      {
        "s": "1 cup",
        "c": 3.5
      }
    ]
  },
  {
    "i": 4726,
    "n": "Dessert topping, powdered, 1.5 ounce prepared with 1/2 cup milk",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.6
      },
      {
        "s": "1 cup",
        "c": 72
      },
      {
        "s": "1 package yields",
        "c": 144
      }
    ]
  },
  {
    "i": 4727,
    "n": "Dessert topping, powdered",
    "ms": [
      {
        "s": "1.5 oz",
        "c": 7.31
      },
      {
        "s": "1 portion, amount to make 1 tbsp",
        "c": 0.221
      }
    ]
  },
  {
    "i": 4729,
    "n": "Sour cream, imitation, cultured",
    "ms": [
      {
        "s": "1 oz",
        "c": 0.85
      },
      {
        "s": "1 cup",
        "c": 6.9
      }
    ]
  },
  {
    "i": 4730,
    "n": "Cheese, American, nonfat or fat free",
    "ms": [
      {
        "s": "1 serving",
        "c": 150
      }
    ]
  },
  {
    "i": 4731,
    "n": "Milk, filled, fluid, with blend of hydrogenated vegetable oils",
    "ms": [
      {
        "s": "1 cup",
        "c": 312
      },
      {
        "s": "1 quart",
        "c": 1250
      }
    ]
  },
  {
    "i": 4732,
    "n": "Cream, whipped, cream topping, pressurized",
    "ms": [
      {
        "s": "1 cup",
        "c": 60.6
      },
      {
        "s": "1 tbsp",
        "c": 3.03
      }
    ]
  },
  {
    "i": 4733,
    "n": "Milk, filled, fluid, with lauric acid oil",
    "ms": [
      {
        "s": "1 quart",
        "c": 1250
      },
      {
        "s": "1 cup",
        "c": 312
      },
      {
        "s": "1 fl oz",
        "c": 39
      }
    ]
  },
  {
    "i": 4735,
    "n": "Cream, fluid, heavy whipping",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 19.7
      },
      {
        "s": "1 tbsp",
        "c": 9.9
      },
      {
        "s": "1 cup, fluid (yields 2 cups whipped)",
        "c": 157
      },
      {
        "s": "1 cup, whipped",
        "c": 79.2
      }
    ]
  },
  {
    "i": 4736,
    "n": "Cheese, pasteurized process, swiss",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 139
      },
      {
        "s": "1 slice (3/4 oz)",
        "c": 162
      },
      {
        "s": "1 cup, diced",
        "c": 1080
      },
      {
        "s": "1 cup, shredded",
        "c": 872
      },
      {
        "s": "1 oz",
        "c": 219
      }
    ]
  },
  {
    "i": 4737,
    "n": "Cheese food, cold pack, American",
    "ms": [
      {
        "s": "1 package (8 oz)",
        "c": 1130
      },
      {
        "s": "1 oz",
        "c": 141
      }
    ]
  },
  {
    "i": 4738,
    "n": "Cream, fluid, light whipping",
    "ms": [
      {
        "s": "1 cup, whipped",
        "c": 82.8
      },
      {
        "s": "1 tbsp",
        "c": 10.4
      },
      {
        "s": "1 cup, fluid (yields 2 cups whipped)",
        "c": 165
      }
    ]
  },
  {
    "i": 4739,
    "n": "Cheese, pasteurized process, pimento",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 694
      },
      {
        "s": "1 cup, diced",
        "c": 860
      },
      {
        "s": "1 cup, melted",
        "c": 1500
      },
      {
        "s": "1 slice (3/4 oz)",
        "c": 129
      },
      {
        "s": "1 cubic inch",
        "c": 111
      },
      {
        "s": "1 oz",
        "c": 174
      }
    ]
  },
  {
    "i": 4740,
    "n": "Cream, fluid, light (coffee cream or table cream)",
    "ms": [
      {
        "s": "1 cup",
        "c": 218
      },
      {
        "s": "1 tbsp",
        "c": 13.6
      },
      {
        "s": "1 fl oz",
        "c": 27.3
      },
      {
        "s": "1 container, individual",
        "c": 10.1
      }
    ]
  },
  {
    "i": 4741,
    "n": "Cheese, pasteurized process, American, fortified with vitamin D",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 188
      },
      {
        "s": "1 oz",
        "c": 296
      },
      {
        "s": "1 slice (3/4 oz)",
        "c": 219
      },
      {
        "s": "1 cup, melted",
        "c": 2550
      },
      {
        "s": "1 cup, diced",
        "c": 1460
      },
      {
        "s": "1 slice (1 oz)",
        "c": 293
      },
      {
        "s": "1 cup, shredded",
        "c": 1180
      }
    ]
  },
  {
    "i": 4742,
    "n": "Cheese, ricotta, whole milk",
    "ms": [
      {
        "s": "1 cup",
        "c": 507
      },
      {
        "s": "0.5 cup",
        "c": 255
      }
    ]
  },
  {
    "i": 4744,
    "n": "Cheese, tilsit",
    "ms": [
      {
        "s": "1 oz",
        "c": 198
      },
      {
        "s": "1 package (6 oz)",
        "c": 1190
      }
    ]
  },
  {
    "i": 4745,
    "n": "Cheese, port de salut",
    "ms": [
      {
        "s": "1 slice (1 oz)",
        "c": 182
      },
      {
        "s": "1 package (6 oz)",
        "c": 1100
      },
      {
        "s": "1 oz",
        "c": 184
      },
      {
        "s": "1 cup, diced",
        "c": 858
      },
      {
        "s": "1 cubic inch",
        "c": 110
      },
      {
        "s": "1 cup, shredded",
        "c": 734
      }
    ]
  },
  {
    "i": 4746,
    "n": "Cheese, mozzarella, whole milk",
    "ms": [
      {
        "s": "6 slices",
        "c": 858
      },
      {
        "s": "1 cup, shredded",
        "c": 566
      },
      {
        "s": "1 oz",
        "c": 143
      }
    ]
  },
  {
    "i": 4748,
    "n": "Cheese, monterey",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 843
      },
      {
        "s": "1 package (6 oz)",
        "c": 1270
      },
      {
        "s": "1 oz",
        "c": 211
      },
      {
        "s": "1 cubic inch",
        "c": 127
      },
      {
        "s": "1 cup, diced",
        "c": 985
      },
      {
        "s": "1 slice (1 oz)",
        "c": 209
      }
    ]
  },
  {
    "i": 4749,
    "n": "Cheese, fontina",
    "ms": [
      {
        "s": "1 slice (1 oz)",
        "c": 154
      },
      {
        "s": "1 cup, diced",
        "c": 726
      },
      {
        "s": "1 package (8 oz)",
        "c": 1250
      },
      {
        "s": "1 cubic inch",
        "c": 82.5
      },
      {
        "s": "1 oz",
        "c": 156
      },
      {
        "s": "1 cup, shredded",
        "c": 594
      }
    ]
  },
  {
    "i": 4750,
    "n": "Cheese, parmesan, hard",
    "ms": [
      {
        "s": "1 oz",
        "c": 336
      },
      {
        "s": "5 package (5 oz)",
        "c": 1680
      },
      {
        "s": "1 cubic inch",
        "c": 122
      }
    ]
  },
  {
    "i": 4751,
    "n": "Cheese, mozzarella, part skim milk",
    "ms": [
      {
        "s": "1 oz",
        "c": 222
      }
    ]
  },
  {
    "i": 4758,
    "n": "Beef, chuck eye steak, boneless, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 steak",
        "c": 54
      }
    ]
  },
  {
    "i": 4762,
    "n": "Beef, chuck eye steak, boneless, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      },
      {
        "s": "1 steak",
        "c": 53.5
      }
    ]
  },
  {
    "i": 4764,
    "n": "Beef, Chuck Eye Country-Style Ribs, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 piece",
        "c": 48.8
      },
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 4766,
    "n": "Beef, Chuck, Short Ribs, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 piece",
        "c": 51.8
      }
    ]
  },
  {
    "i": 4768,
    "n": "Beef, Chuck, Short Ribs, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 piece",
        "c": 47.7
      }
    ]
  },
  {
    "i": 4773,
    "n": "Beef, Chuck, Mock Tender Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 21.8
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 4779,
    "n": "Beef, Chuck, Under Blade Pot Roast Or Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 steak",
        "c": 81.5
      },
      {
        "s": "1 roast",
        "c": 115
      }
    ]
  },
  {
    "i": 4780,
    "n": "Beef, Chuck, Under Blade Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 steak",
        "c": 62.3
      }
    ]
  },
  {
    "i": 4782,
    "n": "Beef, Chuck, Under Blade Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 4786,
    "n": "Beef, chuck for stew, separable lean and fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 15.8
      }
    ]
  },
  {
    "i": 4788,
    "n": "Beef, chuck for stew, separable lean and fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 4800,
    "n": "School Lunch, pizza, cheese topping, thin crust, whole grain, frozen, cooked",
    "ms": [
      {
        "s": "1 piece 4x6",
        "c": 283
      }
    ]
  },
  {
    "i": 4801,
    "n": "School Lunch, chicken patty, whole grain breaded",
    "ms": [
      {
        "s": "1 patty",
        "c": 29.2
      }
    ]
  },
  {
    "i": 4803,
    "n": "School Lunch, chicken nuggets, whole grain breaded",
    "ms": [
      {
        "s": "5 pieces",
        "c": 28.2
      }
    ]
  },
  {
    "i": 4818,
    "n": "School Lunch, pizza, cheese topping, thick crust, whole grain, frozen, cooked",
    "ms": [
      {
        "s": "1 slice per 1/8 pizza",
        "c": 299
      },
      {
        "s": "1 slice per 1/10 pizza",
        "c": 239
      }
    ]
  },
  {
    "i": 4879,
    "n": "Pizza, meat and vegetable topping, rising crust, frozen, cooked",
    "ms": [
      {
        "s": "1 serving 3 servings per 14.3 oz package",
        "c": 214
      },
      {
        "s": "1 serving 6 servings per 34.98 oz package",
        "c": 264
      },
      {
        "s": "1 package 14.3 oz pizza",
        "c": 643
      },
      {
        "s": "1 serving 6 servings per 30.7 oz package",
        "c": 231
      },
      {
        "s": "1 package 34.98 oz pizza",
        "c": 1580
      },
      {
        "s": "1 package 30.7 oz pizza",
        "c": 1380
      }
    ]
  },
  {
    "i": 4880,
    "n": "Pizza, meat and vegetable topping, regular crust, frozen, cooked",
    "ms": [
      {
        "s": "1 package 22.85 oz pizza",
        "c": 979
      },
      {
        "s": "1 serving 2 servings per 10.9 oz package",
        "c": 269
      },
      {
        "s": "1 package 10.9 oz pizza",
        "c": 538
      },
      {
        "s": "1 package 24.2 oz pizza",
        "c": 1080
      },
      {
        "s": "1 serving 5 servings per 24.2 oz package",
        "c": 217
      },
      {
        "s": "1 serving 5 servings per 22.85 oz package",
        "c": 196
      }
    ]
  },
  {
    "i": 4881,
    "n": "Pizza, cheese topping, rising crust, frozen, cooked",
    "ms": [
      {
        "s": "1 serving 6 servings per 29.25 oz package",
        "c": 246
      },
      {
        "s": "1 package 29.25 oz pizza",
        "c": 1480
      },
      {
        "s": "1 serving 4 servings per 19.7 oz package",
        "c": 264
      },
      {
        "s": "1 package 19.7 oz pizza",
        "c": 1050
      }
    ]
  },
  {
    "i": 4904,
    "n": "Buckwheat flour, whole-groat",
    "ms": [
      {
        "s": "1 cup",
        "c": 49.2
      }
    ]
  },
  {
    "i": 4906,
    "n": "Buckwheat groats, roasted, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 11.8
      }
    ]
  },
  {
    "i": 4910,
    "n": "Amaranth grain, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 307
      }
    ]
  },
  {
    "i": 4911,
    "n": "Arrowroot flour",
    "ms": [
      {
        "s": "1 cup",
        "c": 51.2
      }
    ]
  },
  {
    "i": 4912,
    "n": "Amaranth grain, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 116
      }
    ]
  },
  {
    "i": 4914,
    "n": "Buckwheat groats, roasted, dry",
    "ms": [
      {
        "s": "1 cup",
        "c": 27.9
      }
    ]
  },
  {
    "i": 4915,
    "n": "Sweetener, herbal extract powder from Stevia leaf",
    "ms": [
      {
        "s": "1 package",
        "c": 0
      }
    ]
  },
  {
    "i": 4916,
    "n": "Ice creams, regular, low carbohydrate, vanilla",
    "ms": [
      {
        "s": "0.5 cup (4 fl oz)",
        "c": 84.5
      },
      {
        "s": "1 individual (3.5 fl oz)",
        "c": 74.2
      }
    ]
  },
  {
    "i": 4917,
    "n": "Sweeteners, for baking, contains sugar and sucralose",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.02
      },
      {
        "s": "1 tbsp",
        "c": 0.145
      }
    ]
  },
  {
    "i": 4918,
    "n": "Sugar, turbinado",
    "ms": [
      {
        "s": "1 cup",
        "c": 24.2
      },
      {
        "s": "1 tsp",
        "c": 0.552
      }
    ]
  },
  {
    "i": 4920,
    "n": "Sweeteners, for baking, brown, contains sugar and sucralose",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 8.13
      },
      {
        "s": "1 cup",
        "c": 119
      }
    ]
  },
  {
    "i": 4922,
    "n": "Sweeteners, sugar substitute, granulated, brown",
    "ms": [
      {
        "s": "1 tsp",
        "c": 4.4
      },
      {
        "s": "1 cup",
        "c": 202
      }
    ]
  },
  {
    "i": 4924,
    "n": "Candies, soft fruit and nut squares",
    "ms": [
      {
        "s": "3 pieces",
        "c": 7.14
      }
    ]
  },
  {
    "i": 4926,
    "n": "Cocoa, dry powder, hi-fat or breakfast, processed with alkali",
    "ms": [
      {
        "s": "1 tablespoon Ghirardelli label 2011",
        "c": 7.32
      },
      {
        "s": "1 tablespoon Hershey's label 2011",
        "c": 6.1
      },
      {
        "s": "1 container Ghirardelli label 2011",
        "c": 345
      }
    ]
  },
  {
    "i": 4936,
    "n": "Ice creams, vanilla, fat free",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 99.8
      }
    ]
  },
  {
    "i": 4938,
    "n": "Snacks, Sesame Sticks, Wheat-Based*",
    "ms": [
      {
        "s": "1 oz",
        "c": 48.2
      },
      {
        "s": "2 oz",
        "c": 96.9
      }
    ]
  },
  {
    "i": 4939,
    "n": "Candies, sugar-coated almonds",
    "ms": [
      {
        "s": "1 piece",
        "c": 3.5
      }
    ]
  },
  {
    "i": 4942,
    "n": "Snacks, Trail Mix, Regular, With Chocolate Chips*",
    "ms": [
      {
        "s": "1.5 oz",
        "c": 45.8
      },
      {
        "s": "1 cup",
        "c": 159
      },
      {
        "s": "1 oz",
        "c": 30.9
      }
    ]
  },
  {
    "i": 4944,
    "n": "Snacks, potato chips, plain, unsalted",
    "ms": [
      {
        "s": "1 bag (8 oz)",
        "c": 54.5
      },
      {
        "s": "1 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 4945,
    "n": "Snacks, Pretzels, Hard, Plain, Made With*",
    "ms": [
      {
        "s": "1 oz",
        "c": 10.2
      },
      {
        "s": "10 twists",
        "c": 21.6
      }
    ]
  },
  {
    "i": 4946,
    "n": "Syrups, table blends, pancake, with 2% maple, with added potassium",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1
      },
      {
        "s": "1 cup",
        "c": 15.8
      }
    ]
  },
  {
    "i": 4947,
    "n": "Jams and preserves, apricot",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 4
      },
      {
        "s": "1 packet (0.5 oz)",
        "c": 2.8
      }
    ]
  },
  {
    "i": 4949,
    "n": "Snacks, corn cakes, very low sodium",
    "ms": [
      {
        "s": "1 cake",
        "c": 1.71
      },
      {
        "s": "2 cakes",
        "c": 3.42
      }
    ]
  },
  {
    "i": 4950,
    "n": "Snacks, Potato Chips, Plain, Made With Partially Hydrogenated Soybean Oil*",
    "ms": [
      {
        "s": "1 bag (8 oz)",
        "c": 54.5
      },
      {
        "s": "1 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 4951,
    "n": "Puddings, vanilla, dry mix, regular, with added oil",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 3.3
      },
      {
        "s": "1 package (3.12 oz)",
        "c": 13.2
      }
    ]
  },
  {
    "i": 4953,
    "n": "Beef, round, top round, separable lean and fat, trimmed to 0 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 10.7
      },
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 4954,
    "n": "Beef, Round, Top Round, Separable Lean*",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 10.7
      },
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 4964,
    "n": "Beef, round, bottom round, steak, separable lean only, trimmed to 0 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 steak (yield from 290 g raw meat)",
        "c": 13
      }
    ]
  },
  {
    "i": 4966,
    "n": "Beef, round, bottom round, roast, separable lean only, trimmed to 0 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 roast (yield from 600 g raw meat)",
        "c": 29.3
      }
    ]
  },
  {
    "i": 4967,
    "n": "Beef, round, bottom round, roast, separable lean and fat, trimmed to 0 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "1 roast (yield from 572 g raw meat)",
        "c": 32.5
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 4968,
    "n": "Beef, rib, small end (ribs 10-12), separable lean only, trimmed to 0 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 16.2
      },
      {
        "s": "1 steak (yield from 296 g raw meat)",
        "c": 44.3
      }
    ]
  },
  {
    "i": 4969,
    "n": "Beef, Rib, Small End (Ribs 10-12), Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 28.6
      }
    ]
  },
  {
    "i": 4970,
    "n": "Beef, rib, large end (ribs 6-9), separable lean only, trimmed to 0 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 16.6
      }
    ]
  },
  {
    "i": 4971,
    "n": "Beef, Rib, Small End (Ribs 10-12), Separable Lean*",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 28.6
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 4973,
    "n": "Beef, Chuck, Blade Roast, Separable Lean*",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 30.6
      },
      {
        "s": "3 oz",
        "c": 11
      }
    ]
  },
  {
    "i": 4975,
    "n": "Beef, rib, large end (ribs 6-9), separable lean only, trimmed to 0 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 17.1
      }
    ]
  },
  {
    "i": 4976,
    "n": "Beef, Chuck, Arm Pot Roast, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 14.4
      },
      {
        "s": "1 roast (yield from 1675 g raw meat)",
        "c": 210
      }
    ]
  },
  {
    "i": 4977,
    "n": "Beef, rib, large end (ribs 6-9), separable lean and fat, trimmed to 0 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 25.7
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 4978,
    "n": "Beef, Chuck, Under Blade Pot Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 roast",
        "c": 92.1
      }
    ]
  },
  {
    "i": 4980,
    "n": "Beef, brisket, whole, separable lean and fat, trimmed to 0 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 22
      }
    ]
  },
  {
    "i": 4982,
    "n": "Beef, brisket, flat half, separable lean and fat, trimmed to 0 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 16.2
      },
      {
        "s": "1 steak (Yield from 418 g raw meat)",
        "c": 51.3
      }
    ]
  },
  {
    "i": 4983,
    "n": "Beef, chuck, arm pot roast, separable lean only, trimmed to 0 fat, choice, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 roast (yield from 1528g raw meat)",
        "c": 153
      }
    ]
  },
  {
    "i": 4984,
    "n": "Beef, chopped, cured, smoked",
    "ms": [
      {
        "s": "1 slice (1 oz)",
        "c": 2.24
      }
    ]
  },
  {
    "i": 4988,
    "n": "Sausage, beef, cured, cooked, smoked",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.98
      },
      {
        "s": "1 sausage",
        "c": 3.01
      }
    ]
  },
  {
    "i": 4990,
    "n": "Beef, Chuck, Under Blade Pot Roast Or Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 117
      },
      {
        "s": "1 steak",
        "c": 87.8
      },
      {
        "s": "4 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 4991,
    "n": "Beef, brisket, flat half, separable lean only, trimmed to 0 fat, choice, cooked, braised",
    "ms": [
      {
        "s": "1 steak",
        "c": 41
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 4993,
    "n": "Beef, cured, dried",
    "ms": [
      {
        "s": "10 slices",
        "c": 2.24
      }
    ]
  },
  {
    "i": 4994,
    "n": "Beef, sandwich steaks, flaked, chopped, formed and thinly sliced, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 6.72
      },
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 package",
        "c": 47.5
      }
    ]
  },
  {
    "i": 4995,
    "n": "Nuts, walnuts, glazed",
    "ms": [
      {
        "s": "1 oz",
        "c": 19.9
      }
    ]
  },
  {
    "i": 4996,
    "n": "Seeds, cottonseed kernels, roasted (glandless)",
    "ms": [
      {
        "s": "1 cup",
        "c": 149
      },
      {
        "s": "1 tbsp",
        "c": 10
      }
    ]
  },
  {
    "i": 4997,
    "n": "Beef, variety meats and by-products, tongue, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 4998,
    "n": "Nuts, walnuts, dry roasted, with salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 19.9
      }
    ]
  },
  {
    "i": 4999,
    "n": "Beef, variety meats and by-products, tripe, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 19.6
      },
      {
        "s": "4 oz",
        "c": 78
      }
    ]
  },
  {
    "i": 5002,
    "n": "Nuts, pilinuts, dried",
    "ms": [
      {
        "s": "1 oz (15 kernels)",
        "c": 41.1
      },
      {
        "s": "1 cup",
        "c": 174
      }
    ]
  },
  {
    "i": 5003,
    "n": "Nuts, Pecans, Oil Roasted, With*",
    "ms": [
      {
        "s": "1 oz (15 halves)",
        "c": 19
      },
      {
        "s": "1 cup",
        "c": 73.7
      }
    ]
  },
  {
    "i": 5004,
    "n": "Nuts, Mixed Nuts, Oil Roasted, With Peanuts, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 157
      },
      {
        "s": "1 oz",
        "c": 33.2
      }
    ]
  },
  {
    "i": 5005,
    "n": "Nuts, pine nuts, pinyon, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "10 nuts",
        "c": 0.08
      }
    ]
  },
  {
    "i": 5006,
    "n": "Nuts, pine nuts, dried",
    "ms": [
      {
        "s": "10 nuts",
        "c": 0.272
      },
      {
        "s": "1 cup",
        "c": 21.6
      },
      {
        "s": "1 oz (167 kernels)",
        "c": 4.54
      }
    ]
  },
  {
    "i": 5007,
    "n": "Nuts, Mixed Nuts, Oil Roasted, Without Peanuts, With*",
    "ms": [
      {
        "s": "1 oz",
        "c": 30.1
      },
      {
        "s": "1 cup",
        "c": 153
      }
    ]
  },
  {
    "i": 5008,
    "n": "Nuts, ginkgo nuts, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 0.567
      }
    ]
  },
  {
    "i": 5010,
    "n": "Nuts, hazelnuts or filberts, dry roasted, without salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 34.9
      }
    ]
  },
  {
    "i": 5011,
    "n": "Nuts, mixed nuts, dry roasted, with peanuts, without salt added",
    "ms": [
      {
        "s": "1 cup",
        "c": 114
      },
      {
        "s": "1 oz",
        "c": 24.7
      }
    ]
  },
  {
    "i": 5012,
    "n": "Nuts, hazelnuts or filberts, blanched",
    "ms": [
      {
        "s": "1 oz",
        "c": 42.2
      }
    ]
  },
  {
    "i": 5013,
    "n": "Nuts, coconut meat, dried (desiccated), toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 5015,
    "n": "Nuts, coconut cream, raw (liquid expressed from grated meat)",
    "ms": [
      {
        "s": "1 cup",
        "c": 26.4
      },
      {
        "s": "1 tbsp",
        "c": 1.65
      }
    ]
  },
  {
    "i": 5018,
    "n": "Nuts, chestnuts, european, dried, unpeeled",
    "ms": [
      {
        "s": "1 oz",
        "c": 19
      }
    ]
  },
  {
    "i": 5019,
    "n": "Nuts, butternuts, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 63.6
      },
      {
        "s": "1 nutmeat",
        "c": 1.59
      },
      {
        "s": "1 oz",
        "c": 15
      }
    ]
  },
  {
    "i": 5021,
    "n": "Nuts, Cashew Nuts, Dry Roasted, With*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.87
      },
      {
        "s": "1 cup, halves and whole",
        "c": 61.6
      },
      {
        "s": "1 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 5022,
    "n": "Nuts, chestnuts, european, raw, peeled",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.39
      }
    ]
  },
  {
    "i": 5023,
    "n": "Nuts, chestnuts, european, raw, unpeeled",
    "ms": [
      {
        "s": "1 cup",
        "c": 39.2
      },
      {
        "s": "1 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 5024,
    "n": "Nuts, Cashew Nuts, Oil Roasted, With*",
    "ms": [
      {
        "s": "1 oz (18 kernels)",
        "c": 12.2
      },
      {
        "s": "1 cup, halves and pieces",
        "c": 55.5
      },
      {
        "s": "1 cup, whole",
        "c": 55.5
      }
    ]
  },
  {
    "i": 5025,
    "n": "Nuts, acorns, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 5026,
    "n": "Nuts, almonds",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 247
      },
      {
        "s": "1 cup, ground",
        "c": 256
      },
      {
        "s": "1 cup, slivered",
        "c": 291
      },
      {
        "s": "1 cup, whole",
        "c": 385
      },
      {
        "s": "1 almond",
        "c": 3.23
      },
      {
        "s": "1 oz (23 whole kernels)",
        "c": 76.3
      }
    ]
  },
  {
    "i": 5027,
    "n": "Nuts, acorn flour, full fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      }
    ]
  },
  {
    "i": 5028,
    "n": "Nuts, almonds, blanched",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 21.5
      },
      {
        "s": "1 cup whole kernels",
        "c": 342
      },
      {
        "s": "1 oz",
        "c": 66.9
      }
    ]
  },
  {
    "i": 5029,
    "n": "Nuts, brazilnuts, dried, unblanched",
    "ms": [
      {
        "s": "1 cup, whole",
        "c": 213
      },
      {
        "s": "1 oz (6 kernels)",
        "c": 45.4
      },
      {
        "s": "1 kernel",
        "c": 8
      }
    ]
  },
  {
    "i": 5030,
    "n": "Seeds, sesame meal, partially defatted",
    "ms": [
      {
        "s": "1 oz",
        "c": 43.4
      }
    ]
  },
  {
    "i": 5031,
    "n": "Seeds, sunflower seed kernels, dried",
    "ms": [
      {
        "s": "1 cup, with hulls, edible yield",
        "c": 35.9
      },
      {
        "s": "1 cup",
        "c": 109
      }
    ]
  },
  {
    "i": 5032,
    "n": "Seeds, safflower seed meal, partially defatted",
    "ms": [
      {
        "s": "1 oz",
        "c": 21.8
      }
    ]
  },
  {
    "i": 5033,
    "n": "Seeds, sesame flour, low-fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 42.2
      }
    ]
  },
  {
    "i": 5034,
    "n": "Seeds, sunflower seed kernels, oil roasted, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 117
      },
      {
        "s": "1 oz",
        "c": 24.7
      }
    ]
  },
  {
    "i": 5035,
    "n": "Seeds, sunflower seed kernels, dry roasted, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 89.6
      },
      {
        "s": "1 oz",
        "c": 19.8
      }
    ]
  },
  {
    "i": 5036,
    "n": "Seeds, safflower seed kernels, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 22.1
      }
    ]
  },
  {
    "i": 5037,
    "n": "Seeds, cottonseed flour, partially defatted (glandless)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 23.9
      },
      {
        "s": "1 cup",
        "c": 449
      }
    ]
  },
  {
    "i": 5038,
    "n": "Seeds, pumpkin and squash seed kernels, roasted, without salt",
    "ms": [
      {
        "s": "1 oz",
        "c": 14.7
      },
      {
        "s": "1 cup",
        "c": 61.4
      }
    ]
  },
  {
    "i": 5039,
    "n": "Seeds, pumpkin and squash seed kernels, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 13
      },
      {
        "s": "1 cup",
        "c": 59.3
      }
    ]
  },
  {
    "i": 5040,
    "n": "Seeds, breadnut tree seeds, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 26.6
      },
      {
        "s": "1 cup",
        "c": 150
      }
    ]
  },
  {
    "i": 5041,
    "n": "Seeds, chia seeds, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 179
      }
    ]
  },
  {
    "i": 5042,
    "n": "Yam, Cooked, Boiled, Drained, Or Baked, With*",
    "ms": [
      {
        "s": "0.5 cup, cubes",
        "c": 9.52
      },
      {
        "s": "1 cup, cubes",
        "c": 19
      }
    ]
  },
  {
    "i": 5043,
    "n": "Waxgourd, (Chinese Preserving Melon), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 31.5
      }
    ]
  },
  {
    "i": 5044,
    "n": "Seeds, breadnut tree seeds, raw",
    "ms": [
      {
        "s": "1 oz (8-14 seeds)",
        "c": 27.8
      }
    ]
  },
  {
    "i": 5046,
    "n": "Winged bean, immature seeds, cooked, boiled, drained, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 37.8
      },
      {
        "s": "0.5 cup",
        "c": 18.9
      }
    ]
  },
  {
    "i": 5047,
    "n": "Turnips, cooked, boiled, drained, with salt",
    "ms": [
      {
        "s": "1 cup, mashed",
        "c": 50.6
      },
      {
        "s": "1 cup, cubes",
        "c": 34.3
      }
    ]
  },
  {
    "i": 5049,
    "n": "Taro, leaves, cooked, steamed, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 125
      }
    ]
  },
  {
    "i": 5053,
    "n": "Tomato Juice, Canned, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 24.3
      },
      {
        "s": "6 fl oz",
        "c": 18.2
      },
      {
        "s": "1 fl oz",
        "c": 3.04
      }
    ]
  },
  {
    "i": 5056,
    "n": "Squash, Winter, Spaghetti, Cooked, Boiled, Drained, Or Baked, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.6
      }
    ]
  },
  {
    "i": 5057,
    "n": "Succotash, (Corn And Limas), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.6
      }
    ]
  },
  {
    "i": 5060,
    "n": "Squash, Winter, Hubbard, Cooked, Boiled, Mashed, With*",
    "ms": [
      {
        "s": "1 cup, mashed",
        "c": 23.6
      }
    ]
  },
  {
    "i": 5061,
    "n": "Rutabagas, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.5 cup, mashed",
        "c": 21.6
      }
    ]
  },
  {
    "i": 5062,
    "n": "Salsify, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 63.4
      }
    ]
  },
  {
    "i": 5063,
    "n": "Spinach, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 245
      }
    ]
  },
  {
    "i": 5065,
    "n": "Squash, Summer, Scallop, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 13.5
      },
      {
        "s": "0.5 cup, mashed",
        "c": 18
      }
    ]
  },
  {
    "i": 5066,
    "n": "Soybeans, Green, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 261
      }
    ]
  },
  {
    "i": 5069,
    "n": "Pumpkin, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, mashed",
        "c": 36.8
      }
    ]
  },
  {
    "i": 5071,
    "n": "Potatoes, microwaved, cooked, in skin, flesh and skin, with salt",
    "ms": [
      {
        "s": "1 potato (2-1/3 x 4-3/4)",
        "c": 22.2
      }
    ]
  },
  {
    "i": 5077,
    "n": "Peppers, Sweet, Red, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.08
      },
      {
        "s": "0.5 cup, chopped",
        "c": 8.28
      },
      {
        "s": "1 pepper",
        "c": 6.57
      }
    ]
  },
  {
    "i": 5078,
    "n": "Pigeonpeas, Immature Seeds, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 62.7
      }
    ]
  },
  {
    "i": 5082,
    "n": "Peas, edible-podded, cooked, boiled, drained, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 67.2
      }
    ]
  },
  {
    "i": 5084,
    "n": "Parsnips, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 28.9
      },
      {
        "s": "1 parsnip (9 long)",
        "c": 59.2
      }
    ]
  },
  {
    "i": 5088,
    "n": "Carrot, dehydrated",
    "ms": [
      {
        "s": "1 cup",
        "c": 157
      }
    ]
  },
  {
    "i": 5091,
    "n": "Mustard Greens, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 165
      }
    ]
  },
  {
    "i": 5092,
    "n": "Mustard Spinach, (Tendergreen), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 284
      }
    ]
  },
  {
    "i": 5093,
    "n": "Tomatoes, orange, raw",
    "ms": [
      {
        "s": "1 tomato",
        "c": 5.55
      },
      {
        "s": "1 cup, chopped",
        "c": 7.9
      }
    ]
  },
  {
    "i": 5094,
    "n": "New*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 86.4
      }
    ]
  },
  {
    "i": 5096,
    "n": "Shallots, raw",
    "ms": [
      {
        "s": "1 tbsp chopped",
        "c": 3.7
      }
    ]
  },
  {
    "i": 5097,
    "n": "Seaweed, spirulina, dried",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 8.4
      },
      {
        "s": "1 cup",
        "c": 134
      }
    ]
  },
  {
    "i": 5098,
    "n": "Seaweed, wakame, raw",
    "ms": [
      {
        "s": "2 tbsp (1/8 cup)",
        "c": 15
      }
    ]
  },
  {
    "i": 5099,
    "n": "Peppers, hot chili, green, raw",
    "ms": [
      {
        "s": "0.5 cup, chopped or diced",
        "c": 13.5
      },
      {
        "s": "1 pepper",
        "c": 8.1
      }
    ]
  },
  {
    "i": 5100,
    "n": "Spinach souffle",
    "ms": [
      {
        "s": "1 cup",
        "c": 224
      },
      {
        "s": "1 recipe yield",
        "c": 1340
      }
    ]
  },
  {
    "i": 5102,
    "n": "Squash, winter, all varieties, raw",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 32.5
      }
    ]
  },
  {
    "i": 5105,
    "n": "Carrot juice, canned",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 7.08
      },
      {
        "s": "1 cup",
        "c": 56.6
      }
    ]
  },
  {
    "i": 5106,
    "n": "Borage, raw",
    "ms": [
      {
        "s": "1 cup (1 pieces)",
        "c": 82.8
      }
    ]
  },
  {
    "i": 5107,
    "n": "Parsley, freeze-dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.704
      },
      {
        "s": "0.25 cup",
        "c": 2.46
      }
    ]
  },
  {
    "i": 5108,
    "n": "Drumstick Pods, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 23.6
      }
    ]
  },
  {
    "i": 5110,
    "n": "Squash, summer, all varieties, raw",
    "ms": [
      {
        "s": "1 large",
        "c": 48.4
      },
      {
        "s": "1 medium",
        "c": 29.4
      },
      {
        "s": "1 small",
        "c": 17.7
      },
      {
        "s": "1 cup, sliced",
        "c": 17
      },
      {
        "s": "1 slice",
        "c": 1.48
      }
    ]
  },
  {
    "i": 5111,
    "n": "Squash, Summer, All Varieties, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 48.6
      }
    ]
  },
  {
    "i": 5112,
    "n": "Drumstick pods, raw",
    "ms": [
      {
        "s": "1 pod (15-1/3 long)",
        "c": 3.3
      },
      {
        "s": "1 cup slices",
        "c": 30
      }
    ]
  },
  {
    "i": 5114,
    "n": "Leeks, (bulb and lower-leaf portion), freeze-dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.72
      },
      {
        "s": "0.25 cup",
        "c": 2.88
      }
    ]
  },
  {
    "i": 5115,
    "n": "Winged bean leaves, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 224
      }
    ]
  },
  {
    "i": 5118,
    "n": "Winged beans, immature seeds, raw",
    "ms": [
      {
        "s": "1 pod",
        "c": 13.4
      },
      {
        "s": "1 cup slices",
        "c": 37
      }
    ]
  },
  {
    "i": 5119,
    "n": "Winged beans, immature seeds, cooked, boiled, drained, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 37.8
      }
    ]
  },
  {
    "i": 5120,
    "n": "Vinespinach, (basella), raw",
    "ms": [
      {
        "s": "100 g",
        "c": 109
      }
    ]
  },
  {
    "i": 5121,
    "n": "Vegetable juice cocktail, low sodium, canned",
    "ms": [
      {
        "s": "1 cup",
        "c": 38.1
      },
      {
        "s": "6 fl oz",
        "c": 27.3
      }
    ]
  },
  {
    "i": 5133,
    "n": "Tomato powder",
    "ms": [
      {
        "s": "100 g",
        "c": 166
      }
    ]
  },
  {
    "i": 5134,
    "n": "Turnips, raw",
    "ms": [
      {
        "s": "1 large",
        "c": 54.9
      },
      {
        "s": "1 small",
        "c": 18.3
      },
      {
        "s": "0.5 cup, cubes",
        "c": 19.5
      },
      {
        "s": "1 cup, cubes",
        "c": 39
      },
      {
        "s": "1 slice",
        "c": 4.5
      },
      {
        "s": "1 medium",
        "c": 36.6
      }
    ]
  },
  {
    "i": 5135,
    "n": "Tomatoes, red, ripe, raw, year round average",
    "ms": [
      {
        "s": "1 plum tomato",
        "c": 6.2
      },
      {
        "s": "1 NLEA serving",
        "c": 14.8
      },
      {
        "s": "1 wedge (1/4 of medium tomato)",
        "c": 3.1
      },
      {
        "s": "1 cup cherry tomatoes",
        "c": 14.9
      },
      {
        "s": "1 slice, thick/large (1/2 thick)",
        "c": 2.7
      },
      {
        "s": "1 small whole (2-2/5 dia)",
        "c": 9.1
      },
      {
        "s": "1 cup, chopped or sliced",
        "c": 18
      },
      {
        "s": "1 slice, thin/small",
        "c": 1.5
      },
      {
        "s": "1 Italian tomato",
        "c": 6.2
      },
      {
        "s": "1 cherry",
        "c": 1.7
      },
      {
        "s": "1 large whole (3 dia)",
        "c": 18.2
      },
      {
        "s": "1 slice, medium (1/4 thick)",
        "c": 2
      },
      {
        "s": "1 medium whole (2-3/5 dia)",
        "c": 12.3
      }
    ]
  },
  {
    "i": 5138,
    "n": "Tomatoes, green, raw",
    "ms": [
      {
        "s": "1 slice or wedge",
        "c": 2.6
      },
      {
        "s": "1 cup",
        "c": 23.4
      },
      {
        "s": "1 large",
        "c": 23.7
      },
      {
        "s": "1 small",
        "c": 11.8
      },
      {
        "s": "1 medium",
        "c": 16
      }
    ]
  },
  {
    "i": 5142,
    "n": "Potatoes, scalloped, dry mix, prepared with water, whole milk and butter",
    "ms": [
      {
        "s": "1 cup (unprepared)",
        "c": 88.2
      },
      {
        "s": "0.16 package (5.5 oz) yields",
        "c": 49.3
      },
      {
        "s": "1 package yield, 5.5 oz",
        "c": 296
      }
    ]
  },
  {
    "i": 5145,
    "n": "Potatoes, scalloped, dry mix, unprepared",
    "ms": [
      {
        "s": "1 package (5.5 oz)",
        "c": 96.7
      },
      {
        "s": "0.16 package (5.5 oz)",
        "c": 16.1
      }
    ]
  },
  {
    "i": 5146,
    "n": "Potatoes, au gratin, dry mix, prepared with water, whole milk and butter",
    "ms": [
      {
        "s": "0.16 package (5.5 oz) yields",
        "c": 114
      },
      {
        "s": "1 package yield, 5.5 oz",
        "c": 682
      }
    ]
  },
  {
    "i": 5147,
    "n": "Potatoes, au gratin, dry mix, unprepared",
    "ms": [
      {
        "s": "0.16 package (5.5 oz)",
        "c": 80.9
      },
      {
        "s": "1 package (5.5 oz)",
        "c": 485
      }
    ]
  },
  {
    "i": 5148,
    "n": "Potatoes, mashed, dehydrated, prepared from flakes without milk, whole milk and butter added",
    "ms": [
      {
        "s": "1 cup",
        "c": 67.2
      }
    ]
  },
  {
    "i": 5149,
    "n": "Potatoes, mashed, dehydrated, flakes without milk, dry form",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.2
      }
    ]
  },
  {
    "i": 5155,
    "n": "Potatoes, Microwaved, Cooked In Skin, Flesh, With*",
    "ms": [
      {
        "s": "1 potato (2-1/3 x 4-3/4)",
        "c": 7.8
      },
      {
        "s": "0.5 cup",
        "c": 3.9
      }
    ]
  },
  {
    "i": 5156,
    "n": "Potatoes, Boiled, Cooked Without Skin, Flesh, With*",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 6.24
      },
      {
        "s": "1 medium (2-1/4 to 3-1/4 dia.)",
        "c": 13.4
      },
      {
        "s": "1 large (3 to 4-1/4 dia.)",
        "c": 24
      },
      {
        "s": "1 small (1-3/4 to 2-1/2 dia.)",
        "c": 10
      }
    ]
  },
  {
    "i": 5157,
    "n": "Potatoes, Boiled, Cooked In Skin, Skin, With*",
    "ms": [
      {
        "s": "1 skin",
        "c": 15.3
      }
    ]
  },
  {
    "i": 5158,
    "n": "Potatoes, au gratin, home-prepared from recipe using butter",
    "ms": [
      {
        "s": "1 cup",
        "c": 292
      }
    ]
  },
  {
    "i": 5162,
    "n": "Pokeberry shoots, (poke), raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 84.8
      }
    ]
  },
  {
    "i": 5163,
    "n": "Poi",
    "ms": [
      {
        "s": "1 cup",
        "c": 38.4
      }
    ]
  },
  {
    "i": 5164,
    "n": "Pokeberry Shoots, (Poke), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 5.3
      },
      {
        "s": "1 cup",
        "c": 87.4
      }
    ]
  },
  {
    "i": 5166,
    "n": "Peppers, sweet, green, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.93
      },
      {
        "s": "1 small",
        "c": 7.4
      },
      {
        "s": "1 medium (approx 2-3/4 long, 2-1/2 dia)",
        "c": 11.9
      },
      {
        "s": "1 large (2-1/4 per lb, approx 3-3/4 long, 3 dia)",
        "c": 16.4
      },
      {
        "s": "10 strips",
        "c": 2.7
      },
      {
        "s": "1 ring (3 dia, 1/4 thick)",
        "c": 1
      },
      {
        "s": "1 cup, sliced",
        "c": 9.2
      },
      {
        "s": "1 cup, chopped",
        "c": 14.9
      }
    ]
  },
  {
    "i": 5169,
    "n": "Peppers, Sweet, Green, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 tablespoon, chopped",
        "c": 1.04
      },
      {
        "s": "1 cup, chopped or strips",
        "c": 12.2
      }
    ]
  },
  {
    "i": 5170,
    "n": "Peas, mature seeds, sprouted, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 43.2
      }
    ]
  },
  {
    "i": 5172,
    "n": "Peas, green, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 36.2
      }
    ]
  },
  {
    "i": 5173,
    "n": "Peas, Green, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 43.2
      }
    ]
  },
  {
    "i": 5174,
    "n": "Peas, Mature Seeds, Sprouted, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 26
      }
    ]
  },
  {
    "i": 5176,
    "n": "Parsley, fresh",
    "ms": [
      {
        "s": "10 sprigs",
        "c": 13.8
      },
      {
        "s": "1 tbsp",
        "c": 5.24
      },
      {
        "s": "1 cup chopped",
        "c": 82.8
      }
    ]
  },
  {
    "i": 5180,
    "n": "Parsnips, raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 47.9
      }
    ]
  },
  {
    "i": 5187,
    "n": "Collards, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 268
      }
    ]
  },
  {
    "i": 5188,
    "n": "Chayote, Fruit, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup (1 pieces)",
        "c": 20.8
      }
    ]
  },
  {
    "i": 5189,
    "n": "Chicory, witloof, raw",
    "ms": [
      {
        "s": "1 head",
        "c": 10.1
      },
      {
        "s": "0.5 cup",
        "c": 8.55
      }
    ]
  },
  {
    "i": 5190,
    "n": "Chayote, fruit, raw",
    "ms": [
      {
        "s": "1 chayote (5-3/4)",
        "c": 34.5
      },
      {
        "s": "1 cup (1 pieces)",
        "c": 22.4
      }
    ]
  },
  {
    "i": 5191,
    "n": "Chard, Swiss, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 102
      }
    ]
  },
  {
    "i": 5192,
    "n": "Collards, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 83.5
      }
    ]
  },
  {
    "i": 5199,
    "n": "Celeriac, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 67.1
      }
    ]
  },
  {
    "i": 5200,
    "n": "Cabbage, chinese (pak-choi), raw",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 73.5
      },
      {
        "s": "1 leaf",
        "c": 14.7
      },
      {
        "s": "1 head",
        "c": 882
      }
    ]
  },
  {
    "i": 5201,
    "n": "Cabbage, Chinese (Pak-Choi), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 158
      }
    ]
  },
  {
    "i": 5202,
    "n": "Carrots, raw",
    "ms": [
      {
        "s": "1 cup strips or slices",
        "c": 40.3
      },
      {
        "s": "1 strip medium",
        "c": 1.32
      },
      {
        "s": "1 cup chopped",
        "c": 42.2
      },
      {
        "s": "1 large (7-1/4 to 8-/1/2 long)",
        "c": 23.8
      },
      {
        "s": "1 medium",
        "c": 20.1
      },
      {
        "s": "1 small (5-1/2 long)",
        "c": 16.5
      },
      {
        "s": "1 strip large (3 long)",
        "c": 2.31
      },
      {
        "s": "1 slice",
        "c": 0.99
      },
      {
        "s": "1 cup grated",
        "c": 36.3
      }
    ]
  },
  {
    "i": 5203,
    "n": "Carrots, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 23.4
      },
      {
        "s": "1 tbsp",
        "c": 2.91
      },
      {
        "s": "1 carrot",
        "c": 13.8
      }
    ]
  },
  {
    "i": 5204,
    "n": "Cabbage, kimchi",
    "ms": [
      {
        "s": "1 cup",
        "c": 49.5
      }
    ]
  },
  {
    "i": 5205,
    "n": "Brussels sprouts, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 37
      },
      {
        "s": "1 sprout",
        "c": 7.98
      }
    ]
  },
  {
    "i": 5206,
    "n": "Butterbur, (fuki), raw",
    "ms": [
      {
        "s": "1 petiole",
        "c": 5.15
      },
      {
        "s": "1 cup",
        "c": 96.8
      }
    ]
  },
  {
    "i": 5208,
    "n": "Cabbage, savoy, raw",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 24.5
      }
    ]
  },
  {
    "i": 5209,
    "n": "Burdock Root, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup (1 pieces)",
        "c": 61.2
      },
      {
        "s": "1 root",
        "c": 81.3
      }
    ]
  },
  {
    "i": 5210,
    "n": "Cabbage, Savoy, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 43.5
      }
    ]
  },
  {
    "i": 5215,
    "n": "Broccoli, raw",
    "ms": [
      {
        "s": "1 cup chopped",
        "c": 42.8
      },
      {
        "s": "1 NLEA serving",
        "c": 69.6
      },
      {
        "s": "1 spear (about 5 long)",
        "c": 14.6
      },
      {
        "s": "1 stalk",
        "c": 71
      },
      {
        "s": "0.5 cup, chopped or diced",
        "c": 20.7
      },
      {
        "s": "1 bunch",
        "c": 286
      }
    ]
  },
  {
    "i": 5216,
    "n": "Broccoli raab, raw",
    "ms": [
      {
        "s": "1 stalk",
        "c": 20.5
      },
      {
        "s": "1 cup chopped",
        "c": 43.2
      }
    ]
  },
  {
    "i": 5217,
    "n": "Beet Greens, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.5 cup (1 pieces)",
        "c": 82.1
      },
      {
        "s": "1 cup (1 pieces)",
        "c": 164
      }
    ]
  },
  {
    "i": 5218,
    "n": "Pizza, cheese topping, thin crust, frozen, cooked",
    "ms": [
      {
        "s": "1 pie",
        "c": 1270
      },
      {
        "s": "1 slice",
        "c": 157
      }
    ]
  },
  {
    "i": 5220,
    "n": "Beet greens, raw",
    "ms": [
      {
        "s": "0.5 cup (1 pieces)",
        "c": 22.2
      },
      {
        "s": "1 leaf",
        "c": 37.4
      },
      {
        "s": "1 cup",
        "c": 44.5
      }
    ]
  },
  {
    "i": 5222,
    "n": "Broadbeans, immature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 24
      },
      {
        "s": "1 broadbean",
        "c": 1.76
      }
    ]
  },
  {
    "i": 5241,
    "n": "Yogurt parfait, lowfat, with fruit and granola",
    "ms": [
      {
        "s": "1 item",
        "c": 156
      }
    ]
  },
  {
    "i": 5277,
    "n": "Pizza, cheese topping, regular crust, frozen, cooked",
    "ms": [
      {
        "s": "1 package 8 oz pizza",
        "c": 356
      },
      {
        "s": "1 serving 1 serving per 8 oz box",
        "c": 356
      },
      {
        "s": "1 serving 2 servings per 9.8 oz package",
        "c": 261
      },
      {
        "s": "1 package 9.8 oz pizza",
        "c": 524
      },
      {
        "s": "1 package 24 oz pizza",
        "c": 1300
      },
      {
        "s": "1 package 15.1 oz pizza",
        "c": 809
      },
      {
        "s": "1 serving 3 servings per 15.1 oz package",
        "c": 270
      },
      {
        "s": "1 serving 9 servings per 24 oz package",
        "c": 145
      }
    ]
  },
  {
    "i": 5303,
    "n": "Bulgur, cooked",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.84
      },
      {
        "s": "1 cup",
        "c": 18.2
      }
    ]
  },
  {
    "i": 5304,
    "n": "Corn bran, crude",
    "ms": [
      {
        "s": "1 cup",
        "c": 31.9
      }
    ]
  },
  {
    "i": 5305,
    "n": "Corn flour, whole-grain, yellow",
    "ms": [
      {
        "s": "1 cup",
        "c": 8.19
      }
    ]
  },
  {
    "i": 5307,
    "n": "Corn grain, yellow",
    "ms": [
      {
        "s": "1 cup",
        "c": 11.6
      }
    ]
  },
  {
    "i": 5308,
    "n": "Buckwheat",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.6
      }
    ]
  },
  {
    "i": 5309,
    "n": "Candies, coconut bar, not chocolate covered",
    "ms": [
      {
        "s": "1 bar",
        "c": 20.2
      }
    ]
  },
  {
    "i": 5311,
    "n": "Barley, pearled, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 58
      }
    ]
  },
  {
    "i": 5312,
    "n": "Barley, hulled",
    "ms": [
      {
        "s": "1 cup",
        "c": 60.7
      }
    ]
  },
  {
    "i": 5313,
    "n": "Candies, Tamarind",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 5314,
    "n": "Jams, preserves, marmalades, sweetened with fruit juice",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 2.09
      }
    ]
  },
  {
    "i": 5316,
    "n": "Candies, crispy bar with peanut butter filling",
    "ms": [
      {
        "s": "1 serving 1.5 oz",
        "c": 29.4
      }
    ]
  },
  {
    "i": 5317,
    "n": "Candies, fruit snacks, with high vitamin C",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 5318,
    "n": "Syrup, maple, Canadian",
    "ms": [
      {
        "s": "60 milliliter",
        "c": 87.2
      }
    ]
  },
  {
    "i": 5320,
    "n": "Sweetener, syrup, agave",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 0.55
      },
      {
        "s": "1 tsp",
        "c": 0.069
      }
    ]
  },
  {
    "i": 5325,
    "n": "Chocolate, dark, 45- 59% cacao solids",
    "ms": [
      {
        "s": "1 oz",
        "c": 15.9
      },
      {
        "s": "1 bar",
        "c": 90.7
      }
    ]
  },
  {
    "i": 5328,
    "n": "Chocolate, dark, 70-85% cacao solids",
    "ms": [
      {
        "s": "1 bar",
        "c": 73.7
      },
      {
        "s": "1 oz",
        "c": 20.7
      }
    ]
  },
  {
    "i": 5329,
    "n": "Ice creams, regular, low carbohydrate, chocolate",
    "ms": [
      {
        "s": "1 individual (3.5 fl oz)",
        "c": 63.2
      }
    ]
  },
  {
    "i": 5330,
    "n": "Chocolate, dark, 60-69% cacao solids",
    "ms": [
      {
        "s": "1 bar",
        "c": 69.4
      },
      {
        "s": "1 oz",
        "c": 17.6
      }
    ]
  },
  {
    "i": 5336,
    "n": "Snacks, tortilla chips, low fat, unsalted",
    "ms": [
      {
        "s": "1 oz",
        "c": 45.1
      }
    ]
  },
  {
    "i": 5339,
    "n": "Snacks, tortilla chips, nacho-flavor, made with enriched masa flour",
    "ms": [
      {
        "s": "1 oz",
        "c": 41.7
      }
    ]
  },
  {
    "i": 5340,
    "n": "Potato chips, without salt, reduced fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 5345,
    "n": "Snacks, popcorn, air-popped (Unsalted)",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "1 cup",
        "c": 0.8
      }
    ]
  },
  {
    "i": 5347,
    "n": "Snacks, rice cakes, brown rice, plain, unsalted",
    "ms": [
      {
        "s": "2 cakes",
        "c": 1.98
      },
      {
        "s": "1 cake",
        "c": 0.99
      }
    ]
  },
  {
    "i": 5348,
    "n": "Snacks, corn-based, extruded, chips, barbecue-flavor, made with enriched masa flour",
    "ms": [
      {
        "s": "1 oz",
        "c": 37.1
      }
    ]
  },
  {
    "i": 5349,
    "n": "Snacks, popcorn, oil-popped, white popcorn, salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "1 cup",
        "c": 1.1
      }
    ]
  },
  {
    "i": 5350,
    "n": "Snacks, corn-based, extruded, puffs or twists, cheese-flavor, unenriched",
    "ms": [
      {
        "s": "1 oz",
        "c": 16.4
      },
      {
        "s": "1 bag (8 oz)",
        "c": 132
      }
    ]
  },
  {
    "i": 5351,
    "n": "Puddings, banana, dry mix, regular, with added oil",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 4.4
      },
      {
        "s": "1 package (3.12 oz)",
        "c": 17.6
      }
    ]
  },
  {
    "i": 5353,
    "n": "Puddings, tapioca, dry mix, with no added salt",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 0.92
      },
      {
        "s": "1 package (3.5 oz)",
        "c": 3.68
      }
    ]
  },
  {
    "i": 5355,
    "n": "Beef, Round, Top Round, Separable Lean*",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 10.7
      },
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 5364,
    "n": "Beef, round, bottom round roast, separable lean only, trimmed to 0 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 roast (yield from 572 g raw meat)",
        "c": 27.8
      }
    ]
  },
  {
    "i": 5365,
    "n": "Beef, round, bottom round, steak, separable lean only, trimmed to 0 fat, select, cooked, braised",
    "ms": [
      {
        "s": "1 steak (yield from 281 g raw meat)",
        "c": 12.5
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 5369,
    "n": "Beef, Round, Bottom Round, Roast, Separable Lean*",
    "ms": [
      {
        "s": "1 roast (yield from 627 g raw meat)",
        "c": 30.9
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 5373,
    "n": "Beef, Round, Bottom Round, Steak, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 steak (yield from 299 g raw meat)",
        "c": 13.4
      }
    ]
  },
  {
    "i": 5379,
    "n": "Beef, Chuck, Under Blade Pot Roast, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 88.1
      },
      {
        "s": "3 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 5380,
    "n": "Beef, chuck, arm pot roast, separable lean and fat, trimmed to 0 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 13.6
      },
      {
        "s": "1 roast (yield from 1601 g raw meat)",
        "c": 187
      }
    ]
  },
  {
    "i": 5382,
    "n": "Beef, brisket, point half, separable lean only, trimmed to 0 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 13.9
      }
    ]
  },
  {
    "i": 5388,
    "n": "Beef, Chuck, Under Blade Center Steak, Boneless, Denver Cut, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 52
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 5389,
    "n": "Beef, cured, pastrami",
    "ms": [
      {
        "s": "1 package, 2.5 oz",
        "c": 7.1
      },
      {
        "s": "1 slice (1 oz)",
        "c": 2.8
      }
    ]
  },
  {
    "i": 5392,
    "n": "Beef, cured, breakfast strips, cooked",
    "ms": [
      {
        "s": "3 slices",
        "c": 3.06
      },
      {
        "s": "1 package, cooked (yield from 12 oz raw product)",
        "c": 15.3
      }
    ]
  },
  {
    "i": 5393,
    "n": "Beef, cured, corned beef, brisket, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 31.8
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 5395,
    "n": "Beef, cured, luncheon meat, jellied",
    "ms": [
      {
        "s": "1 slice (1 oz) (4 x 4 x 3/32 thick)",
        "c": 2.8
      }
    ]
  },
  {
    "i": 5396,
    "n": "Beef, variety meats and by-products, thymus, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 5397,
    "n": "Beef, variety meats and by-products, suet, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 2.26
      },
      {
        "s": "1 oz",
        "c": 0.567
      }
    ]
  },
  {
    "i": 5399,
    "n": "Beef, cured, breakfast strips, raw or unheated",
    "ms": [
      {
        "s": "1 package (net weight, 12 oz)",
        "c": 13.6
      },
      {
        "s": "3 slices",
        "c": 2.72
      }
    ]
  },
  {
    "i": 5400,
    "n": "Seeds, sesame butter, paste",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 154
      }
    ]
  },
  {
    "i": 5401,
    "n": "Seeds, sesame flour, high-fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 45.1
      }
    ]
  },
  {
    "i": 5402,
    "n": "Beef, variety meats and by-products, tongue, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.7
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 5403,
    "n": "Seeds, sesame butter, tahini, from roasted and toasted kernels (most common type)",
    "ms": [
      {
        "s": "1 oz",
        "c": 121
      },
      {
        "s": "1 tbsp",
        "c": 63.9
      }
    ]
  },
  {
    "i": 5404,
    "n": "Nuts, walnuts, black, dried",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 76.2
      },
      {
        "s": "1 tbsp",
        "c": 4.76
      },
      {
        "s": "1 oz",
        "c": 17.3
      }
    ]
  },
  {
    "i": 5405,
    "n": "Nuts, chestnuts, european, roasted",
    "ms": [
      {
        "s": "1 cup",
        "c": 41.5
      },
      {
        "s": "10 kernels",
        "c": 24.4
      },
      {
        "s": "1 oz",
        "c": 8.22
      }
    ]
  },
  {
    "i": 5406,
    "n": "Seeds, pumpkin and squash seeds, whole, roasted, without salt",
    "ms": [
      {
        "s": "1 oz (85 seeds)",
        "c": 15.6
      },
      {
        "s": "1 cup",
        "c": 35.2
      }
    ]
  },
  {
    "i": 5407,
    "n": "Nuts, Pistachio Nuts, Dry Roasted, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 132
      },
      {
        "s": "1 oz (49 kernels)",
        "c": 30.3
      },
      {
        "s": "1 kernel",
        "c": 0.749
      }
    ]
  },
  {
    "i": 5408,
    "n": "Nuts, walnuts, english",
    "ms": [
      {
        "s": "1 oz (14 halves)",
        "c": 27.8
      },
      {
        "s": "1 cup shelled (50 halves)",
        "c": 98
      },
      {
        "s": "1 cup pieces or chips",
        "c": 118
      },
      {
        "s": "1 cup, in shell, edible yield (7 nuts)",
        "c": 27.4
      },
      {
        "s": "1 cup, chopped",
        "c": 115
      },
      {
        "s": "1 cup, ground",
        "c": 78.4
      }
    ]
  },
  {
    "i": 5409,
    "n": "Nuts, pecans",
    "ms": [
      {
        "s": "1 cup, halves",
        "c": 69.3
      },
      {
        "s": "1 cup, chopped",
        "c": 76.3
      },
      {
        "s": "1 oz (19 halves)",
        "c": 19.8
      }
    ]
  },
  {
    "i": 5410,
    "n": "Nuts, pistachio nuts, raw",
    "ms": [
      {
        "s": "1 kernel",
        "c": 0.735
      },
      {
        "s": "1 cup",
        "c": 129
      },
      {
        "s": "1 oz (49 kernels)",
        "c": 29.8
      }
    ]
  },
  {
    "i": 5412,
    "n": "Nuts, Pecans, Dry Roasted, With*",
    "ms": [
      {
        "s": "1 oz",
        "c": 20.4
      }
    ]
  },
  {
    "i": 5413,
    "n": "Nuts, macadamia nuts, raw",
    "ms": [
      {
        "s": "1 oz (10-12 kernels)",
        "c": 24.1
      },
      {
        "s": "1 cup, whole or halves",
        "c": 114
      }
    ]
  },
  {
    "i": 5414,
    "n": "Nuts, hickorynuts, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 73.2
      },
      {
        "s": "1 oz",
        "c": 17.3
      },
      {
        "s": "1 nut",
        "c": 1.83
      }
    ]
  },
  {
    "i": 5415,
    "n": "Nuts, ginkgo nuts, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.67
      }
    ]
  },
  {
    "i": 5417,
    "n": "Nuts, formulated, wheat-based, unflavored, with salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 5419,
    "n": "Nuts, coconut meat, raw",
    "ms": [
      {
        "s": "1 piece (2 x 2 x 1/2)",
        "c": 6.3
      },
      {
        "s": "1 medium",
        "c": 55.6
      },
      {
        "s": "1 cup, shredded",
        "c": 11.2
      }
    ]
  },
  {
    "i": 5421,
    "n": "Nuts, coconut milk, raw (liquid expressed from grated meat and water)",
    "ms": [
      {
        "s": "1 cup",
        "c": 38.4
      },
      {
        "s": "1 tbsp",
        "c": 2.4
      }
    ]
  },
  {
    "i": 5423,
    "n": "Nuts, coconut water (liquid from coconuts)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.6
      },
      {
        "s": "1 cup",
        "c": 57.6
      },
      {
        "s": "1 coconut yields",
        "c": 49.4
      }
    ]
  },
  {
    "i": 5424,
    "n": "Nuts, coconut meat, dried (desiccated), not sweetened",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 5425,
    "n": "Nuts, cashew nuts, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 10.5
      }
    ]
  },
  {
    "i": 5426,
    "n": "Nuts, chestnuts, chinese, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 8.22
      }
    ]
  },
  {
    "i": 5427,
    "n": "Nuts, chestnuts, european, boiled and steamed",
    "ms": [
      {
        "s": "1 oz",
        "c": 13
      }
    ]
  },
  {
    "i": 5428,
    "n": "Nuts, chestnuts, european, dried, peeled",
    "ms": [
      {
        "s": "1 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 5429,
    "n": "Nuts, chestnuts, chinese, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 5430,
    "n": "Nuts, chestnuts, chinese, boiled and steamed",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 5431,
    "n": "Nuts, cashew butter, plain, without salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      },
      {
        "s": "1 tbsp",
        "c": 6.88
      }
    ]
  },
  {
    "i": 5433,
    "n": "Nuts, almond paste",
    "ms": [
      {
        "s": "1 oz",
        "c": 48.8
      },
      {
        "s": "1 cup, firmly packed",
        "c": 390
      }
    ]
  },
  {
    "i": 5434,
    "n": "Nuts, Almonds, Dry Roasted, With*",
    "ms": [
      {
        "s": "1 oz (22 whole kernels)",
        "c": 76
      },
      {
        "s": "1 cup whole kernels",
        "c": 370
      }
    ]
  },
  {
    "i": 5435,
    "n": "Nuts, beechnuts, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 0.284
      }
    ]
  },
  {
    "i": 5436,
    "n": "Nuts, acorns, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 11.6
      }
    ]
  },
  {
    "i": 5437,
    "n": "Seeds, sunflower seed flour, partially defatted",
    "ms": [
      {
        "s": "1 cup",
        "c": 73
      },
      {
        "s": "1 tbsp",
        "c": 4.56
      }
    ]
  },
  {
    "i": 5438,
    "n": "Seeds, Sesame Seed Kernels, Toasted, With*",
    "ms": [
      {
        "s": "1 oz",
        "c": 37.1
      },
      {
        "s": "1 cup",
        "c": 168
      }
    ]
  },
  {
    "i": 5439,
    "n": "Seeds, sesame flour, partially defatted",
    "ms": [
      {
        "s": "1 oz",
        "c": 42.5
      }
    ]
  },
  {
    "i": 5440,
    "n": "Seeds, sesame seeds, whole, dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 87.8
      },
      {
        "s": "1 cup",
        "c": 1400
      }
    ]
  },
  {
    "i": 5441,
    "n": "Seeds, sunflower seed butter, without salt",
    "ms": [
      {
        "s": "1 oz",
        "c": 18.1
      },
      {
        "s": "1 tbsp",
        "c": 10.2
      }
    ]
  },
  {
    "i": 5442,
    "n": "Seeds, sunflower seed kernels, toasted, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 76.4
      },
      {
        "s": "1 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 5443,
    "n": "Seeds, sesame seeds, whole, roasted and toasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 280
      }
    ]
  },
  {
    "i": 5444,
    "n": "Seeds, cottonseed meal, partially defatted (glandless)",
    "ms": [
      {
        "s": "1 oz",
        "c": 143
      }
    ]
  },
  {
    "i": 5446,
    "n": "Mushrooms, portabella, exposed to ultraviolet light, raw",
    "ms": [
      {
        "s": "1 cup diced",
        "c": 2.58
      },
      {
        "s": "1 piece whole",
        "c": 2.52
      }
    ]
  },
  {
    "i": 5448,
    "n": "Seeds, hemp seed, hulled",
    "ms": [
      {
        "s": "3 tbsp",
        "c": 21
      }
    ]
  },
  {
    "i": 5449,
    "n": "Seeds, lotus seeds, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 52.2
      },
      {
        "s": "1 oz (42 medium seeds)",
        "c": 46.2
      }
    ]
  },
  {
    "i": 5450,
    "n": "Seeds, cottonseed flour, low fat (glandless)",
    "ms": [
      {
        "s": "1 oz",
        "c": 134
      }
    ]
  },
  {
    "i": 5451,
    "n": "Seeds, breadfruit seeds, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 5453,
    "n": "Tomatoes, Red, Ripe, Canned, Packed In Tomato Juice*",
    "ms": [
      {
        "s": "1 cup",
        "c": 79.2
      },
      {
        "s": "1 small",
        "c": 27.1
      },
      {
        "s": "0.5 cup",
        "c": 39.6
      },
      {
        "s": "1 medium",
        "c": 36.6
      },
      {
        "s": "1 can",
        "c": 62.7
      },
      {
        "s": "1 tbsp",
        "c": 4.95
      },
      {
        "s": "1 large",
        "c": 54.1
      }
    ]
  },
  {
    "i": 5454,
    "n": "Tomatoes, Red, Ripe, Cooked*",
    "ms": [
      {
        "s": "1 NLEA serving",
        "c": 13.3
      },
      {
        "s": "0.5 cup",
        "c": 13.2
      },
      {
        "s": "1 cup",
        "c": 26.4
      }
    ]
  },
  {
    "i": 5457,
    "n": "Taro, shoots, cooked, with salt",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 19.6
      }
    ]
  },
  {
    "i": 5459,
    "n": "Squash, Winter, Acorn, Cooked, Boiled, Mashed, With*",
    "ms": [
      {
        "s": "1 cup, mashed",
        "c": 63.7
      }
    ]
  },
  {
    "i": 5464,
    "n": "Water Convolvulus, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 52.9
      }
    ]
  },
  {
    "i": 5469,
    "n": "Squash, Summer, Crookneck And Straightneck, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 39.6
      }
    ]
  },
  {
    "i": 5471,
    "n": "Purslane, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 89.7
      }
    ]
  },
  {
    "i": 5472,
    "n": "Pumpkin Leaves, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.5
      }
    ]
  },
  {
    "i": 5474,
    "n": "Radishes, Oriental, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 25
      }
    ]
  },
  {
    "i": 5476,
    "n": "Pumpkin, flowers, cooked, boiled, drained, with salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 49.6
      }
    ]
  },
  {
    "i": 5478,
    "n": "Potatoes, microwaved, cooked, in skin, skin with salt",
    "ms": [
      {
        "s": "1 skin",
        "c": 26.7
      }
    ]
  },
  {
    "i": 5479,
    "n": "Potatoes, baked, skin only, with salt",
    "ms": [
      {
        "s": "1 skin",
        "c": 19.7
      }
    ]
  },
  {
    "i": 5483,
    "n": "Potatoes, Boiled, Cooked In Skin, Flesh, With*",
    "ms": [
      {
        "s": "1 potato (2-1/2 dia, sphere)",
        "c": 6.8
      },
      {
        "s": "0.5 cup",
        "c": 3.9
      }
    ]
  },
  {
    "i": 5485,
    "n": "Peppers, hot chili, red, raw",
    "ms": [
      {
        "s": "0.5 cup, chopped or diced",
        "c": 10.5
      },
      {
        "s": "1 pepper",
        "c": 6.3
      }
    ]
  },
  {
    "i": 5488,
    "n": "Peppers, sweet, red, raw",
    "ms": [
      {
        "s": "1 small",
        "c": 5.18
      },
      {
        "s": "1 medium (approx 2-3/4 long, 2-1/2 dia.)",
        "c": 8.33
      },
      {
        "s": "1 ring (3 dia., 1/4 thick)",
        "c": 0.7
      },
      {
        "s": "1 cup, chopped",
        "c": 10.4
      },
      {
        "s": "1 cup, sliced",
        "c": 6.44
      },
      {
        "s": "1 tablespoon",
        "c": 0.651
      },
      {
        "s": "1 large (2-1/4 per pound, approx 3-3/4 long, 3 dia.)",
        "c": 11.5
      }
    ]
  },
  {
    "i": 5494,
    "n": "Onions, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 slice large (1/4 thick)",
        "c": 7.04
      },
      {
        "s": "1 medium",
        "c": 20.7
      },
      {
        "s": "1 slice medium (1/8 thick)",
        "c": 2.64
      },
      {
        "s": "1 slice thin",
        "c": 1.76
      },
      {
        "s": "1 cup",
        "c": 46.2
      },
      {
        "s": "1 small",
        "c": 13.2
      },
      {
        "s": "1 large",
        "c": 28.2
      },
      {
        "s": "1 tbsp chopped",
        "c": 3.3
      }
    ]
  },
  {
    "i": 5497,
    "n": "Tomatoes, yellow, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 15.3
      },
      {
        "s": "1 tomato",
        "c": 23.3
      }
    ]
  },
  {
    "i": 5498,
    "n": "Radish seeds, sprouted, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.4
      }
    ]
  },
  {
    "i": 5501,
    "n": "Tomatoes, red, ripe, cooked, stewed",
    "ms": [
      {
        "s": "1 cup",
        "c": 26.3
      },
      {
        "s": "1 recipe yield",
        "c": 157
      }
    ]
  },
  {
    "i": 5502,
    "n": "Seaweed, agar, dried",
    "ms": [
      {
        "s": "100 g",
        "c": 625
      }
    ]
  },
  {
    "i": 5504,
    "n": "Potato pancakes",
    "ms": [
      {
        "s": "1 small 2-3/4 in. dia., 5/8 in. thick.",
        "c": 7.04
      },
      {
        "s": "1 medium 3-1/4 in. x 3-5/8 in., 5/8 in. thick.",
        "c": 11.8
      }
    ]
  },
  {
    "i": 5506,
    "n": "Seaweed, spirulina, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 12
      }
    ]
  },
  {
    "i": 5507,
    "n": "Radishes, white icicle, raw",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 13.5
      },
      {
        "s": "1 radish (7 long)",
        "c": 4.59
      }
    ]
  },
  {
    "i": 5508,
    "n": "Shallots, freeze-dried",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 6.59
      },
      {
        "s": "1 tbsp",
        "c": 1.65
      }
    ]
  },
  {
    "i": 5512,
    "n": "Beans, pinto, mature seeds, sprouted, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 43
      }
    ]
  },
  {
    "i": 5516,
    "n": "Chives, freeze-dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.63
      },
      {
        "s": "0.25 cup",
        "c": 6.5
      }
    ]
  },
  {
    "i": 5517,
    "n": "Yambean (jicama), raw",
    "ms": [
      {
        "s": "1 large",
        "c": 144
      },
      {
        "s": "1 cup slices",
        "c": 14.4
      },
      {
        "s": "1 cup",
        "c": 15.6
      },
      {
        "s": "1 small",
        "c": 43.8
      },
      {
        "s": "1 medium",
        "c": 79.1
      },
      {
        "s": "1 slice",
        "c": 0.72
      }
    ]
  },
  {
    "i": 5519,
    "n": "Eppaw, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 110
      }
    ]
  },
  {
    "i": 5520,
    "n": "Dock, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 58.5
      }
    ]
  },
  {
    "i": 5522,
    "n": "Winged bean tuber, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 30
      }
    ]
  },
  {
    "i": 5523,
    "n": "Waterchestnuts, chinese, (matai), raw",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 6.82
      },
      {
        "s": "4 waterchestnuts",
        "c": 3.96
      }
    ]
  },
  {
    "i": 5524,
    "n": "Yam, raw",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 25.5
      }
    ]
  },
  {
    "i": 5525,
    "n": "Waxgourd, (chinese preserving melon), raw",
    "ms": [
      {
        "s": "1 waxgourd",
        "c": 1080
      },
      {
        "s": "1 cup, cubes",
        "c": 25.1
      }
    ]
  },
  {
    "i": 5527,
    "n": "Watercress, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 40.8
      },
      {
        "s": "1 sprig",
        "c": 3
      },
      {
        "s": "10 sprigs",
        "c": 30
      }
    ]
  },
  {
    "i": 5529,
    "n": "Turnip greens, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 104
      }
    ]
  },
  {
    "i": 5537,
    "n": "Tomato products, canned, sauce, with herbs and cheese",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 45.1
      },
      {
        "s": "1 can, 15 oz (303 x 406)",
        "c": 157
      }
    ]
  },
  {
    "i": 5547,
    "n": "Potatoes, hash brown, frozen, with butter sauce, prepared",
    "ms": [
      {
        "s": "100 g",
        "c": 33
      }
    ]
  },
  {
    "i": 5551,
    "n": "Potatoes, mashed, dehydrated, granules with milk, dry form",
    "ms": [
      {
        "s": "1 cup",
        "c": 284
      }
    ]
  },
  {
    "i": 5552,
    "n": "Potatoes, mashed, dehydrated, prepared from granules with milk, water and margarine added",
    "ms": [
      {
        "s": "1 cup",
        "c": 73.5
      }
    ]
  },
  {
    "i": 5553,
    "n": "Potatoes, mashed, dehydrated, prepared from granules without milk, whole milk and butter added",
    "ms": [
      {
        "s": "1 cup",
        "c": 73.5
      }
    ]
  },
  {
    "i": 5554,
    "n": "Potatoes, scalloped, home-prepared with butter",
    "ms": [
      {
        "s": "1 cup",
        "c": 140
      }
    ]
  },
  {
    "i": 5556,
    "n": "Potatoes, mashed, dehydrated, granules without milk, dry form",
    "ms": [
      {
        "s": "1 cup",
        "c": 82
      }
    ]
  },
  {
    "i": 5559,
    "n": "Potatoes, Baked, Flesh, With*",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 3.05
      },
      {
        "s": "1 potato (2-1/3 x 4-3/4)",
        "c": 7.8
      }
    ]
  },
  {
    "i": 5560,
    "n": "Potatoes, raw, skin",
    "ms": [
      {
        "s": "1 skin",
        "c": 11.4
      }
    ]
  },
  {
    "i": 5563,
    "n": "Pigeonpeas, immature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 64.7
      },
      {
        "s": "10 seeds",
        "c": 1.68
      }
    ]
  },
  {
    "i": 5564,
    "n": "Potatoes, flesh and skin, raw",
    "ms": [
      {
        "s": "1 Potato medium (2-1/4 to 3-1/4 dia)",
        "c": 25.6
      },
      {
        "s": "1 Potato large (3 to 4-1/4 dia)",
        "c": 44.3
      },
      {
        "s": "0.5 cup, diced",
        "c": 9
      },
      {
        "s": "1 Potato small (1-3/4 to 2-1/2 dia)",
        "c": 20.4
      }
    ]
  },
  {
    "i": 5565,
    "n": "Potatoes, white, flesh and skin, raw",
    "ms": [
      {
        "s": "0.5 cup, diced",
        "c": 6.75
      },
      {
        "s": "1 medium (2+-1/4 to 3-1/4 dia.)",
        "c": 19.2
      },
      {
        "s": "1 large (3 to 4-1/4 dia.)",
        "c": 33.2
      },
      {
        "s": "1 small (1-3/4 to 2-1/4 dia.)",
        "c": 8.28
      }
    ]
  },
  {
    "i": 5566,
    "n": "Peppers, sweet, green, sauteed",
    "ms": [
      {
        "s": "1 cup chopped",
        "c": 9.2
      }
    ]
  },
  {
    "i": 5568,
    "n": "Potatoes, Russet, flesh and skin, baked",
    "ms": [
      {
        "s": "1 potato small (1-3/4 to 2-1/2 dia.)",
        "c": 24.8
      },
      {
        "s": "1 potato large (3 to 4-1/4 dia.",
        "c": 53.8
      },
      {
        "s": "1 potato medium (2-1/4 to 3-1/4 dia.)",
        "c": 31.1
      }
    ]
  },
  {
    "i": 5569,
    "n": "Potatoes, red, flesh and skin, raw",
    "ms": [
      {
        "s": "1 potato medium (2-1/4 to 3-1/4 dia)",
        "c": 21.3
      },
      {
        "s": "0.5 cup, diced",
        "c": 7.5
      },
      {
        "s": "1 potato small (1-3/4 to 2-1/4 dia)",
        "c": 17
      },
      {
        "s": "1 potato large (3 to 4-1/4 dia)",
        "c": 36.9
      }
    ]
  },
  {
    "i": 5582,
    "n": "Onions, young green, tops only",
    "ms": [
      {
        "s": "1 stalk",
        "c": 6.24
      },
      {
        "s": "1 tbsp",
        "c": 3.12
      },
      {
        "s": "1 cup chopped",
        "c": 36.9
      }
    ]
  },
  {
    "i": 5583,
    "n": "Onions, welsh, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 18
      }
    ]
  },
  {
    "i": 5585,
    "n": "Peas, edible-podded, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 42.1
      },
      {
        "s": "10 pea pods",
        "c": 14.6
      },
      {
        "s": "1 cup, whole",
        "c": 27.1
      }
    ]
  },
  {
    "i": 5586,
    "n": "Onions, sweet, raw",
    "ms": [
      {
        "s": "1 onion",
        "c": 66.2
      },
      {
        "s": "1 NLEA serving",
        "c": 29.6
      }
    ]
  },
  {
    "i": 5588,
    "n": "Onions, yellow, sauteed",
    "ms": [
      {
        "s": "1 cup chopped",
        "c": 17.4
      }
    ]
  },
  {
    "i": 5589,
    "n": "Onions, spring or scallions (includes tops and bulb), raw",
    "ms": [
      {
        "s": "1 large",
        "c": 18
      },
      {
        "s": "1 medium (4-1/8 long)",
        "c": 10.8
      },
      {
        "s": "1 cup, chopped",
        "c": 72
      },
      {
        "s": "1 tbsp chopped",
        "c": 4.32
      },
      {
        "s": "1 small (3 long)",
        "c": 3.6
      }
    ]
  },
  {
    "i": 5592,
    "n": "Onions, dehydrated flakes",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 36
      },
      {
        "s": "1 tbsp",
        "c": 12.8
      }
    ]
  },
  {
    "i": 5594,
    "n": "Onions, raw",
    "ms": [
      {
        "s": "1 slice, large (1/4 thick)",
        "c": 8.74
      },
      {
        "s": "1 small",
        "c": 16.1
      },
      {
        "s": "1 slice, thin",
        "c": 2.07
      },
      {
        "s": "1 cup, sliced",
        "c": 26.4
      },
      {
        "s": "1 tbsp chopped",
        "c": 2.3
      },
      {
        "s": "10 rings",
        "c": 13.8
      },
      {
        "s": "1 large",
        "c": 34.5
      },
      {
        "s": "1 medium (2-1/2 dia)",
        "c": 25.3
      },
      {
        "s": "1 slice, medium (1/8 thick)",
        "c": 3.22
      },
      {
        "s": "1 cup, chopped",
        "c": 36.8
      }
    ]
  },
  {
    "i": 5596,
    "n": "Coriander (cilantro) leaves, raw",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 2.68
      },
      {
        "s": "9 sprigs",
        "c": 13.4
      }
    ]
  },
  {
    "i": 5597,
    "n": "Corn, sweet, yellow, raw",
    "ms": [
      {
        "s": "1 ear, large (7-3/4 to 9 long) yields",
        "c": 2.86
      },
      {
        "s": "1 ear, small (5-1/2 to 6-1/2 long)",
        "c": 1.46
      },
      {
        "s": "1 cup",
        "c": 2.9
      },
      {
        "s": "1 ear, medium (6-3/4 to 7-1/2 long) yields",
        "c": 2.04
      }
    ]
  },
  {
    "i": 5598,
    "n": "Chives, raw",
    "ms": [
      {
        "s": "1 tbsp chopped",
        "c": 2.76
      },
      {
        "s": "1 tsp chopped",
        "c": 0.92
      }
    ]
  },
  {
    "i": 5599,
    "n": "Chard, swiss, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 18.4
      },
      {
        "s": "1 leaf",
        "c": 24.5
      }
    ]
  },
  {
    "i": 5601,
    "n": "Chicory greens, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 29
      }
    ]
  },
  {
    "i": 5603,
    "n": "Celtuce, raw",
    "ms": [
      {
        "s": "1 leaf",
        "c": 3.12
      }
    ]
  },
  {
    "i": 5604,
    "n": "Chicory roots, raw",
    "ms": [
      {
        "s": "1 root",
        "c": 24.6
      },
      {
        "s": "0.5 cup (1 pieces)",
        "c": 18.4
      }
    ]
  },
  {
    "i": 5605,
    "n": "Cassava, raw",
    "ms": [
      {
        "s": "1 root",
        "c": 65.3
      },
      {
        "s": "1 cup",
        "c": 33
      }
    ]
  },
  {
    "i": 5607,
    "n": "Celery, raw",
    "ms": [
      {
        "s": "1 stalk, large (11-12 long)",
        "c": 25.6
      },
      {
        "s": "1 NLEA serving",
        "c": 44
      },
      {
        "s": "1 strip (4 long)",
        "c": 1.6
      },
      {
        "s": "1 cup chopped",
        "c": 40.4
      },
      {
        "s": "1 stalk, small (5 long)",
        "c": 6.8
      },
      {
        "s": "1 stalk, medium (7-1/2 - 8 long)",
        "c": 16
      },
      {
        "s": "1 tbsp",
        "c": 3
      }
    ]
  },
  {
    "i": 5608,
    "n": "Celeriac, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup pieces",
        "c": 40.3
      }
    ]
  },
  {
    "i": 5609,
    "n": "Cauliflower, raw",
    "ms": [
      {
        "s": "1 cup chopped (1/2 pieces)",
        "c": 23.5
      },
      {
        "s": "1 head large (6-7 dia.)",
        "c": 185
      },
      {
        "s": "1 head small (4 dia.)",
        "c": 58.3
      },
      {
        "s": "1 head medium (5-6 dia.)",
        "c": 129
      },
      {
        "s": "1 floweret",
        "c": 2.86
      }
    ]
  },
  {
    "i": 5611,
    "n": "Cabbage, red, raw",
    "ms": [
      {
        "s": "1 head, small (4 dia)",
        "c": 255
      },
      {
        "s": "1 head, large (about 5-1/2 dia)",
        "c": 510
      },
      {
        "s": "1 head, medium (about 5 dia)",
        "c": 378
      },
      {
        "s": "1 leaf",
        "c": 10.4
      },
      {
        "s": "1 cup, chopped",
        "c": 40
      },
      {
        "s": "1 cup, shredded",
        "c": 31.5
      }
    ]
  },
  {
    "i": 5614,
    "n": "Cardoon, raw",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 125
      }
    ]
  },
  {
    "i": 5619,
    "n": "Burdock root, raw",
    "ms": [
      {
        "s": "1 cup (1 pieces)",
        "c": 48.4
      },
      {
        "s": "1 root",
        "c": 64
      }
    ]
  },
  {
    "i": 5620,
    "n": "Cabbage, raw",
    "ms": [
      {
        "s": "1 head, small (about 4-1/2 dia)",
        "c": 286
      },
      {
        "s": "1 head, large (about 7 dia)",
        "c": 499
      },
      {
        "s": "1 leaf",
        "c": 6
      },
      {
        "s": "1 leaf, medium",
        "c": 9.2
      },
      {
        "s": "1 cup, shredded",
        "c": 28
      },
      {
        "s": "1 cup, chopped",
        "c": 35.6
      },
      {
        "s": "1 head, medium (about 5-3/4 dia)",
        "c": 363
      },
      {
        "s": "1 leaf, large",
        "c": 13.2
      }
    ]
  },
  {
    "i": 5621,
    "n": "Cabbage, cooked, boiled, drained, without salt",
    "ms": [
      {
        "s": "1 head",
        "c": 606
      },
      {
        "s": "0.5 cup, shredded",
        "c": 36
      }
    ]
  },
  {
    "i": 5628,
    "n": "Beans, Snap, Green*",
    "ms": [
      {
        "s": "1 cup 1/2 pieces",
        "c": 37
      },
      {
        "s": "10 beans (4 long)",
        "c": 20.4
      }
    ]
  },
  {
    "i": 5632,
    "n": "Beans, snap, green, microwaved",
    "ms": [
      {
        "s": "1 cup 1/2 pieces",
        "c": 63.8
      }
    ]
  },
  {
    "i": 5638,
    "n": "Mung beans, mature seeds, sprouted, raw",
    "ms": [
      {
        "s": "1 package (12 oz)",
        "c": 44.2
      },
      {
        "s": "1 cup",
        "c": 13.5
      }
    ]
  },
  {
    "i": 5641,
    "n": "Plums, raw",
    "ms": [
      {
        "s": "1 fruit (2-1/8 dia)",
        "c": 3.96
      },
      {
        "s": "1 cup, sliced",
        "c": 9.9
      },
      {
        "s": "1 NLEA serving",
        "c": 9.06
      }
    ]
  },
  {
    "i": 5642,
    "n": "Pineapple juice, frozen concentrate, unsweetened, undiluted",
    "ms": [
      {
        "s": "1 can (6 fl oz)",
        "c": 84.2
      }
    ]
  },
  {
    "i": 5643,
    "n": "Plums, canned, purple, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 plum with liquid",
        "c": 4.6
      },
      {
        "s": "1 cup, pitted",
        "c": 25.2
      }
    ]
  },
  {
    "i": 5646,
    "n": "Pineapple juice, canned or bottled, unsweetened, without added ascorbic acid",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.5
      },
      {
        "s": "1 fl oz",
        "c": 4.07
      }
    ]
  },
  {
    "i": 5647,
    "n": "Persimmons, japanese, dried",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 8.5
      }
    ]
  },
  {
    "i": 5649,
    "n": "Persimmons, native, raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 6.75
      }
    ]
  },
  {
    "i": 5652,
    "n": "Persimmons, japanese, raw",
    "ms": [
      {
        "s": "1 fruit (2-1/2 dia)",
        "c": 13.4
      }
    ]
  },
  {
    "i": 5654,
    "n": "Peaches, dried, sulfured, stewed, without added sugar",
    "ms": [
      {
        "s": "1 cup",
        "c": 23.2
      }
    ]
  },
  {
    "i": 5656,
    "n": "Pears, canned, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup, halves",
        "c": 22.3
      },
      {
        "s": "1 half, with liquid",
        "c": 6.84
      }
    ]
  },
  {
    "i": 5659,
    "n": "Peaches, dried, sulfured, uncooked",
    "ms": [
      {
        "s": "1 half",
        "c": 3.64
      },
      {
        "s": "1 cup, halves",
        "c": 44.8
      }
    ]
  },
  {
    "i": 5661,
    "n": "Peaches, canned, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 15
      },
      {
        "s": "1 half, with liquid",
        "c": 5.88
      },
      {
        "s": "1 cup, halves or slices",
        "c": 14.9
      }
    ]
  },
  {
    "i": 5662,
    "n": "Peaches, yellow, raw",
    "ms": [
      {
        "s": "1 extra large (3 dia)",
        "c": 13.4
      },
      {
        "s": "1 cup slices",
        "c": 9.24
      },
      {
        "s": "1 medium (2-2/3 dia)",
        "c": 9
      },
      {
        "s": "1 large (2-3/4 dia)",
        "c": 10.5
      },
      {
        "s": "1 NLEA serving",
        "c": 8.82
      },
      {
        "s": "1 small (2-1/2 dia)",
        "c": 7.8
      }
    ]
  },
  {
    "i": 5663,
    "n": "Peaches, dehydrated (low-moisture), sulfured, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 44.1
      }
    ]
  },
  {
    "i": 5665,
    "n": "Peaches, dehydrated (low-moisture), sulfured, stewed",
    "ms": [
      {
        "s": "1 cup",
        "c": 38.7
      }
    ]
  },
  {
    "i": 5666,
    "n": "Tangerine juice, raw",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 5.56
      },
      {
        "s": "1 cup",
        "c": 44.5
      }
    ]
  },
  {
    "i": 5668,
    "n": "Orange juice, frozen concentrate, unsweetened, undiluted",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 12.5
      },
      {
        "s": "1 cup",
        "c": 99.6
      }
    ]
  },
  {
    "i": 5670,
    "n": "Papayas, raw",
    "ms": [
      {
        "s": "1 cup 1 pieces",
        "c": 29
      },
      {
        "s": "1 cup, mashed",
        "c": 46
      },
      {
        "s": "1 fruit, large",
        "c": 156
      },
      {
        "s": "1 fruit, small",
        "c": 31.4
      }
    ]
  },
  {
    "i": 5671,
    "n": "Orange juice, chilled, includes from concentrate, with added calcium",
    "ms": [
      {
        "s": "1 cup",
        "c": 349
      },
      {
        "s": "1 fl oz",
        "c": 43.5
      }
    ]
  },
  {
    "i": 5672,
    "n": "Oranges, raw, with peel",
    "ms": [
      {
        "s": "1 cup",
        "c": 119
      },
      {
        "s": "1 fruit without seeds",
        "c": 111
      }
    ]
  },
  {
    "i": 5673,
    "n": "Orange juice, frozen concentrate, unsweetened, diluted with 3 volume water, with added calcium",
    "ms": [
      {
        "s": "1 cup",
        "c": 366
      },
      {
        "s": "1 fl oz",
        "c": 45.7
      }
    ]
  },
  {
    "i": 5674,
    "n": "Orange juice, frozen concentrate, unsweetened, undiluted, with added calcium",
    "ms": [
      {
        "s": "1 cup",
        "c": 1510
      },
      {
        "s": "1 fl oz",
        "c": 191
      }
    ]
  },
  {
    "i": 5675,
    "n": "Oranges, raw, Florida",
    "ms": [
      {
        "s": "1 cup sections, without membranes",
        "c": 79.6
      },
      {
        "s": "1 fruit (2-5/8 dia)",
        "c": 60.6
      },
      {
        "s": "1 fruit (2-11/16 dia)",
        "c": 64.9
      }
    ]
  },
  {
    "i": 5676,
    "n": "Oranges, raw, California, valencias",
    "ms": [
      {
        "s": "1 fruit (2-5/8 dia)",
        "c": 48.4
      },
      {
        "s": "1 cup sections, without membranes",
        "c": 72
      }
    ]
  },
  {
    "i": 5678,
    "n": "Oheloberries, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 9.8
      },
      {
        "s": "10 fruit",
        "c": 0.77
      }
    ]
  },
  {
    "i": 5679,
    "n": "Nectarines, raw",
    "ms": [
      {
        "s": "1 small (2-1/3 dia)",
        "c": 7.74
      },
      {
        "s": "1 large (2-3/4 dia)",
        "c": 9.36
      },
      {
        "s": "1 NLEA serving",
        "c": 8.4
      },
      {
        "s": "1 cup slices",
        "c": 8.58
      },
      {
        "s": "1 medium (2-1/2 dia)",
        "c": 8.52
      }
    ]
  },
  {
    "i": 5680,
    "n": "Melon balls, frozen",
    "ms": [
      {
        "s": "1 cup, unthawed",
        "c": 17.3
      }
    ]
  },
  {
    "i": 5681,
    "n": "Mulberries, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 54.6
      },
      {
        "s": "10 fruit",
        "c": 5.85
      }
    ]
  },
  {
    "i": 5682,
    "n": "Dove, cooked (includes squab)",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 23.8
      }
    ]
  },
  {
    "i": 5683,
    "n": "Loquats, raw",
    "ms": [
      {
        "s": "1 small",
        "c": 2.18
      },
      {
        "s": "1 cup, cubed",
        "c": 23.8
      },
      {
        "s": "1 large",
        "c": 3.2
      },
      {
        "s": "1 medium",
        "c": 2.56
      }
    ]
  },
  {
    "i": 5684,
    "n": "Melons, honeydew, raw",
    "ms": [
      {
        "s": "1 wedge (1/8 of 6 to 7 dia melon)",
        "c": 9.6
      },
      {
        "s": "1 NLEA serving",
        "c": 8.04
      },
      {
        "s": "1 wedge (1/8 of 5-1/4 dia melon)",
        "c": 7.5
      },
      {
        "s": "1 melon (5-1/4 dia)",
        "c": 60
      },
      {
        "s": "10 honeydew balls",
        "c": 8.28
      },
      {
        "s": "1 cup, diced (approx 20 pieces per cup)",
        "c": 10.2
      },
      {
        "s": "1 cup, balls",
        "c": 10.6
      },
      {
        "s": "1 melon (6 - 7 dia)",
        "c": 76.8
      }
    ]
  },
  {
    "i": 5685,
    "n": "Mammy-apple, (mamey), raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 93.1
      }
    ]
  },
  {
    "i": 5686,
    "n": "Longans, dried",
    "ms": [
      {
        "s": "1 fruit",
        "c": 0.765
      }
    ]
  },
  {
    "i": 5687,
    "n": "Mangos, raw",
    "ms": [
      {
        "s": "1 cup pieces",
        "c": 18.2
      },
      {
        "s": "1 fruit without refuse",
        "c": 37
      }
    ]
  },
  {
    "i": 5688,
    "n": "Pork, Cured, Ham, Boneless*",
    "ms": [
      {
        "s": "3 oz, boneless",
        "c": 6.8
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 1.36
      }
    ]
  },
  {
    "i": 5689,
    "n": "Cheese, american cheddar, imitation",
    "ms": [
      {
        "s": "1 cup",
        "c": 1260
      },
      {
        "s": "1 cubic inch",
        "c": 101
      },
      {
        "s": "1 slice",
        "c": 118
      }
    ]
  },
  {
    "i": 5690,
    "n": "Yogurt, fruit variety, nonfat",
    "ms": [
      {
        "s": "1 container (6 oz)",
        "c": 258
      },
      {
        "s": "1 container (4.4 oz)",
        "c": 190
      },
      {
        "s": "1 container (8 oz)",
        "c": 345
      },
      {
        "s": "1 cup (8 fl oz)",
        "c": 372
      }
    ]
  },
  {
    "i": 5691,
    "n": "Quail, cooked, total edible",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.25
      },
      {
        "s": "1 lb",
        "c": 68
      }
    ]
  },
  {
    "i": 5693,
    "n": "Whipped cream substitute, dietetic, made from powdered mix",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.4
      }
    ]
  },
  {
    "i": 5695,
    "n": "Pheasant, cooked, total edible",
    "ms": [
      {
        "s": "1 cup, chopped or diced",
        "c": 22.4
      }
    ]
  },
  {
    "i": 5696,
    "n": "Bacon bits, meatless",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.07
      }
    ]
  },
  {
    "i": 5697,
    "n": "Sweeteners, tabletop, fructose, dry, powder",
    "ms": [
      {
        "s": "1 individual packet",
        "c": 0
      },
      {
        "s": "1 tsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 5698,
    "n": "Cabbage, mustard, salted",
    "ms": [
      {
        "s": "1 cup",
        "c": 85.8
      }
    ]
  },
  {
    "i": 5699,
    "n": "Beverage, instant breakfast powder, chocolate, sugar-free, not reconstituted",
    "ms": [
      {
        "s": "1 envelope",
        "c": 100
      },
      {
        "s": "1 tbsp",
        "c": 28
      }
    ]
  },
  {
    "i": 5700,
    "n": "Salad dressing, buttermilk, lite",
    "ms": [
      {
        "s": "1 serving (2 tbsp)",
        "c": 12
      },
      {
        "s": "1 tablespoon",
        "c": 6
      }
    ]
  },
  {
    "i": 5701,
    "n": "Butter replacement, without fat, powder",
    "ms": [
      {
        "s": "1 cup",
        "c": 18.4
      }
    ]
  },
  {
    "i": 5702,
    "n": "Eggplant, pickled",
    "ms": [
      {
        "s": "1 cup",
        "c": 34
      }
    ]
  },
  {
    "i": 5703,
    "n": "Vegetarian meatloaf or patties",
    "ms": [
      {
        "s": "1 slice",
        "c": 16.2
      }
    ]
  },
  {
    "i": 5704,
    "n": "Cabbage, japanese style, fresh, pickled",
    "ms": [
      {
        "s": "1 cup",
        "c": 72
      }
    ]
  },
  {
    "i": 5705,
    "n": "Radishes, hawaiian style, pickled",
    "ms": [
      {
        "s": "1 cup",
        "c": 42
      }
    ]
  },
  {
    "i": 5706,
    "n": "Frankfurter, meatless",
    "ms": [
      {
        "s": "1 frankfurter",
        "c": 23.1
      },
      {
        "s": "1 cup, sliced",
        "c": 46.2
      }
    ]
  },
  {
    "i": 5707,
    "n": "Beans, liquid from stewed kidney beans",
    "ms": [
      {
        "s": "1 cup",
        "c": 31.2
      }
    ]
  },
  {
    "i": 5708,
    "n": "Chicken, meatless",
    "ms": [
      {
        "s": "1 cup",
        "c": 58.8
      }
    ]
  },
  {
    "i": 5710,
    "n": "Candies, chocolate covered, low sugar or low calorie",
    "ms": [
      {
        "s": "1 serving",
        "c": 103
      }
    ]
  },
  {
    "i": 5711,
    "n": "Jellies, no sugar (with sodium saccharin), any flavors",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 5.89
      },
      {
        "s": "1 cup",
        "c": 93
      }
    ]
  },
  {
    "i": 5712,
    "n": "Chewing gum, sugarless",
    "ms": [
      {
        "s": "1 piece",
        "c": 0.4
      }
    ]
  },
  {
    "i": 5713,
    "n": "Syrups, sugar free",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 5714,
    "n": "Candies, hard, dietetic or low calorie (sorbitol)",
    "ms": [
      {
        "s": "1 piece",
        "c": 0
      }
    ]
  },
  {
    "i": 5715,
    "n": "Vermicelli, made from soy",
    "ms": [
      {
        "s": "1 cup",
        "c": 77
      }
    ]
  },
  {
    "i": 5716,
    "n": "Salad dressing, blue or roquefort cheese, low calorie",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 13.4
      },
      {
        "s": "1 cup",
        "c": 218
      }
    ]
  },
  {
    "i": 5722,
    "n": "Salad dressing, sweet and sour",
    "ms": [
      {
        "s": "1 cup",
        "c": 10
      },
      {
        "s": "1 tbsp",
        "c": 0.64
      }
    ]
  },
  {
    "i": 5723,
    "n": "Salad dressing, caesar, low calorie",
    "ms": [
      {
        "s": "1 cup",
        "c": 57.6
      },
      {
        "s": "1 tbsp",
        "c": 3.6
      }
    ]
  },
  {
    "i": 5726,
    "n": "Oil, corn and canola",
    "ms": [
      {
        "s": "1 teaspoon",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 5727,
    "n": "Milk, fluid, nonfat, calcium fortified (fat free or skim)",
    "ms": [
      {
        "s": "1 cup",
        "c": 504
      },
      {
        "s": "1 fl oz",
        "c": 63
      }
    ]
  },
  {
    "i": 5729,
    "n": "Peanut butter, reduced sodium",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 6.56
      }
    ]
  },
  {
    "i": 5732,
    "n": "Margarine-like, vegetable oil spread, stick or tub, sweetened",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 5735,
    "n": "Snacks, granola bar, with coconut, chocolate coated",
    "ms": [
      {
        "s": "1 oz",
        "c": 11.9
      }
    ]
  },
  {
    "i": 5736,
    "n": "Restaurant, Mexican, cheese tamales",
    "ms": [
      {
        "s": "1 serving serving size varied from 1 to 3 tamales",
        "c": 335
      },
      {
        "s": "1 tamale",
        "c": 199
      },
      {
        "s": "3 tamale",
        "c": 610
      },
      {
        "s": "2 tamale",
        "c": 390
      }
    ]
  },
  {
    "i": 5737,
    "n": "Restaurant, Mexican, cheese enchilada",
    "ms": [
      {
        "s": "2 enchilada",
        "c": 807
      },
      {
        "s": "1 enchilada",
        "c": 430
      },
      {
        "s": "1 serving serving size varied from 1 to 3 enchiladas",
        "c": 766
      },
      {
        "s": "3 enchilada",
        "c": 1150
      }
    ]
  },
  {
    "i": 5755,
    "n": "Restaurant, family style, macaroni & cheese, from kids' menu",
    "ms": [
      {
        "s": "1 cup",
        "c": 135
      },
      {
        "s": "1 serving",
        "c": 208
      }
    ]
  },
  {
    "i": 5776,
    "n": "Agave, raw (Southwest)",
    "ms": [
      {
        "s": "100 g",
        "c": 417
      }
    ]
  },
  {
    "i": 5804,
    "n": "Turnover, chicken- or turkey-, and vegetable-filled, reduced fat, frozen",
    "ms": [
      {
        "s": "1 piece turnover 1 serving",
        "c": 199
      }
    ]
  },
  {
    "i": 5805,
    "n": "Dumpling, potato- or cheese-filled, frozen",
    "ms": [
      {
        "s": "3 pieces pierogies",
        "c": 39.9
      }
    ]
  },
  {
    "i": 5806,
    "n": "Sausage, egg and cheese breakfast biscuit",
    "ms": [
      {
        "s": "1 box",
        "c": 715
      },
      {
        "s": "1 biscuit",
        "c": 171
      }
    ]
  },
  {
    "i": 5807,
    "n": "Rice mix, cheese flavor, dry mix, unprepared",
    "ms": [
      {
        "s": "0.25 cup dry rice mix",
        "c": 79.8
      }
    ]
  },
  {
    "i": 5808,
    "n": "Macaroni or noodles with cheese, microwaveable, unprepared",
    "ms": [
      {
        "s": "1 serving 1 pouch",
        "c": 200
      }
    ]
  },
  {
    "i": 5809,
    "n": "Potsticker or wonton, pork and vegetable, frozen, unprepared",
    "ms": [
      {
        "s": "5 pieces 1 serving",
        "c": 40.6
      }
    ]
  },
  {
    "i": 5810,
    "n": "Macaroni or noodles with cheese, made from reduced fat packaged mix, unprepared",
    "ms": [
      {
        "s": "1 serving (3.5 oz)",
        "c": 200
      }
    ]
  },
  {
    "i": 5812,
    "n": "Taquitos, frozen, beef and cheese, oven-heated",
    "ms": [
      {
        "s": "1 piece",
        "c": 40.7
      }
    ]
  },
  {
    "i": 5813,
    "n": "Turnover, cheese-filled, tomato-based sauce, frozen, unprepared",
    "ms": [
      {
        "s": "1 serving 4.5 oz",
        "c": 351
      }
    ]
  },
  {
    "i": 5814,
    "n": "Taquitos, frozen, chicken and cheese, oven-heated",
    "ms": [
      {
        "s": "1 piece",
        "c": 43.7
      }
    ]
  },
  {
    "i": 5815,
    "n": "Macaroni and cheese, box mix with cheese sauce, prepared",
    "ms": [
      {
        "s": "1 cup prepared",
        "c": 161
      }
    ]
  },
  {
    "i": 5817,
    "n": "Potatoes, mashed, ready-to-eat",
    "ms": [
      {
        "s": "1 cup",
        "c": 77.9
      },
      {
        "s": "1 container",
        "c": 238
      }
    ]
  },
  {
    "i": 5818,
    "n": "Noodles, Egg, Cooked*",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.2
      }
    ]
  },
  {
    "i": 5824,
    "n": "Wheat flour, white, all-purpose, unenriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 18.8
      }
    ]
  },
  {
    "i": 5825,
    "n": "Rice, White, Long-Grain, Regular, Raw*",
    "ms": [
      {
        "s": "1 cup",
        "c": 51.8
      }
    ]
  },
  {
    "i": 5826,
    "n": "Rice, White, Long-Grain, Parboiled*",
    "ms": [
      {
        "s": "1 cup",
        "c": 30
      }
    ]
  },
  {
    "i": 5827,
    "n": "Rice, White, Long-Grain, Parboiled*",
    "ms": [
      {
        "s": "1 cup",
        "c": 131
      }
    ]
  },
  {
    "i": 5829,
    "n": "Rice, White, Medium-Grain, Raw*",
    "ms": [
      {
        "s": "1 cup",
        "c": 17.6
      }
    ]
  },
  {
    "i": 5832,
    "n": "Cornmeal, whole-grain, white",
    "ms": [
      {
        "s": "1 cup",
        "c": 7.32
      }
    ]
  },
  {
    "i": 5834,
    "n": "Noodles, Egg, Dry*",
    "ms": [
      {
        "s": "1 cup",
        "c": 13.3
      }
    ]
  },
  {
    "i": 5836,
    "n": "Wheat, khorasan, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 40.9
      }
    ]
  },
  {
    "i": 5837,
    "n": "Spelt, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 47
      }
    ]
  },
  {
    "i": 5838,
    "n": "Corn flour, whole-grain, white",
    "ms": [
      {
        "s": "1 cup",
        "c": 8.19
      }
    ]
  },
  {
    "i": 5839,
    "n": "Teff, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 347
      }
    ]
  },
  {
    "i": 5840,
    "n": "Corn flour, yellow, masa, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 157
      }
    ]
  },
  {
    "i": 5841,
    "n": "Wheat, khorasan, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 15.5
      }
    ]
  },
  {
    "i": 5842,
    "n": "Spelt, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.4
      }
    ]
  },
  {
    "i": 5844,
    "n": "Rice noodles, dry",
    "ms": [
      {
        "s": "2 oz",
        "c": 10.3
      }
    ]
  },
  {
    "i": 5845,
    "n": "Barley flour or meal",
    "ms": [
      {
        "s": "1 cup",
        "c": 47.4
      }
    ]
  },
  {
    "i": 5846,
    "n": "Oat flour, partially debranned",
    "ms": [
      {
        "s": "1 cup",
        "c": 57.2
      }
    ]
  },
  {
    "i": 5847,
    "n": "Barley malt flour",
    "ms": [
      {
        "s": "1 cup",
        "c": 59.9
      }
    ]
  },
  {
    "i": 5848,
    "n": "Noodles, egg, spinach, enriched, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.4
      }
    ]
  },
  {
    "i": 5850,
    "n": "Pasta, Dry*",
    "ms": [
      {
        "s": "1 cup lasagna",
        "c": 18.9
      },
      {
        "s": "1 cup farfalle",
        "c": 17
      },
      {
        "s": "1 cup penne",
        "c": 20
      },
      {
        "s": "1 cup spaghetti",
        "c": 19.1
      },
      {
        "s": "1 cup elbows",
        "c": 25.6
      },
      {
        "s": "1 cup rotini",
        "c": 20.2
      },
      {
        "s": "2 oz",
        "c": 12
      },
      {
        "s": "1 cup shells",
        "c": 13.4
      }
    ]
  },
  {
    "i": 5851,
    "n": "Pasta, Cooked*",
    "ms": [
      {
        "s": "1 cup spaghetti packed",
        "c": 10.6
      },
      {
        "s": "1 cup penne",
        "c": 7.49
      },
      {
        "s": "1 cup rotini",
        "c": 7.49
      },
      {
        "s": "1 cup elbows not packed",
        "c": 8.4
      },
      {
        "s": "1 cup elbows packed",
        "c": 9.24
      },
      {
        "s": "1 cup spaghetti not packed",
        "c": 8.68
      },
      {
        "s": "1 cup farfalle",
        "c": 7.49
      },
      {
        "s": "1 cup shells",
        "c": 7.35
      },
      {
        "s": "1 cup lasagne",
        "c": 8.12
      }
    ]
  },
  {
    "i": 5852,
    "n": "Noodles, egg, spinach, enriched, dry",
    "ms": [
      {
        "s": "1 cup",
        "c": 21.3
      },
      {
        "s": "2 oz",
        "c": 31.9
      }
    ]
  },
  {
    "i": 5853,
    "n": "Pasta, fresh-refrigerated, plain, as purchased",
    "ms": [
      {
        "s": "4.5 oz",
        "c": 19.2
      }
    ]
  },
  {
    "i": 5854,
    "n": "Pasta, fresh-refrigerated, spinach, cooked",
    "ms": [
      {
        "s": "2 oz",
        "c": 10.3
      }
    ]
  },
  {
    "i": 5856,
    "n": "Pasta, fresh-refrigerated, plain, cooked",
    "ms": [
      {
        "s": "2 oz",
        "c": 7.68
      }
    ]
  },
  {
    "i": 5857,
    "n": "Noodles, egg, enriched, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.2
      }
    ]
  },
  {
    "i": 5858,
    "n": "Wild rice, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 33.6
      }
    ]
  },
  {
    "i": 5859,
    "n": "Pasta, fresh-refrigerated, spinach, as purchased",
    "ms": [
      {
        "s": "4.5 oz",
        "c": 55
      }
    ]
  },
  {
    "i": 5860,
    "n": "Wheat, sprouted",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.2
      }
    ]
  },
  {
    "i": 5861,
    "n": "Wheat flour, white, tortilla mix, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 228
      }
    ]
  },
  {
    "i": 5862,
    "n": "Wheat, soft white",
    "ms": [
      {
        "s": "1 cup",
        "c": 57.1
      }
    ]
  },
  {
    "i": 5863,
    "n": "Wheat bran, crude",
    "ms": [
      {
        "s": "1 cup",
        "c": 42.3
      }
    ]
  },
  {
    "i": 5864,
    "n": "Wheat, durum",
    "ms": [
      {
        "s": "1 cup",
        "c": 65.3
      }
    ]
  },
  {
    "i": 5865,
    "n": "Wheat flour, white, cake, enriched",
    "ms": [
      {
        "s": "1 cup unsifted, dipped",
        "c": 19.2
      }
    ]
  },
  {
    "i": 5866,
    "n": "Sorghum grain",
    "ms": [
      {
        "s": "1 cup",
        "c": 25
      }
    ]
  },
  {
    "i": 5867,
    "n": "Rice bran, crude",
    "ms": [
      {
        "s": "1 cup",
        "c": 67.3
      }
    ]
  },
  {
    "i": 5868,
    "n": "Triticale",
    "ms": [
      {
        "s": "1 cup",
        "c": 71
      }
    ]
  },
  {
    "i": 5869,
    "n": "Tapioca, pearl, dry",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.4
      }
    ]
  },
  {
    "i": 5870,
    "n": "Rice flour, white, unenriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 15.8
      }
    ]
  },
  {
    "i": 5871,
    "n": "Semolina*",
    "ms": [
      {
        "s": "1 cup",
        "c": 28.4
      }
    ]
  },
  {
    "i": 5872,
    "n": "Wheat, hard white",
    "ms": [
      {
        "s": "1 cup",
        "c": 61.4
      }
    ]
  },
  {
    "i": 5875,
    "n": "Rice, white, long-grain, precooked or instant, enriched, dry",
    "ms": [
      {
        "s": "1 cup",
        "c": 20.9
      }
    ]
  },
  {
    "i": 5876,
    "n": "Rice, white, glutinous, unenriched, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 3.48
      }
    ]
  },
  {
    "i": 5884,
    "n": "Cornmeal, whole-grain, yellow",
    "ms": [
      {
        "s": "1 cup",
        "c": 7.32
      }
    ]
  },
  {
    "i": 5885,
    "n": "Millet, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 16
      }
    ]
  },
  {
    "i": 5886,
    "n": "Couscous, cooked",
    "ms": [
      {
        "s": "1 oz, dry, yields",
        "c": 6.88
      },
      {
        "s": "1 cup, cooked",
        "c": 12.6
      },
      {
        "s": "1 cup, dry, yields",
        "c": 42.2
      }
    ]
  },
  {
    "i": 5887,
    "n": "Cornstarch",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.56
      }
    ]
  },
  {
    "i": 5888,
    "n": "Couscous, dry",
    "ms": [
      {
        "s": "1 cup",
        "c": 41.5
      }
    ]
  },
  {
    "i": 5889,
    "n": "Corn Flour, Masa*",
    "ms": [
      {
        "s": "1 cup",
        "c": 157
      }
    ]
  },
  {
    "i": 5890,
    "n": "Candies, semisweet chocolate, made with butter",
    "ms": [
      {
        "s": "1 cup chips (6 oz package)",
        "c": 54.4
      },
      {
        "s": "1 cup large chips",
        "c": 58.2
      },
      {
        "s": "1 cup mini chips",
        "c": 55.4
      },
      {
        "s": "1 oz (approx 60 pcs)",
        "c": 9.07
      }
    ]
  },
  {
    "i": 5891,
    "n": "Gelatin desserts, dry mix, reduced calorie, with aspartame, no added sodium",
    "ms": [
      {
        "s": "1 package (0.35 oz)",
        "c": 0.2
      },
      {
        "s": "1 tbsp",
        "c": 0.18
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 0.05
      }
    ]
  },
  {
    "i": 5892,
    "n": "Gelatin desserts, dry mix, with added ascorbic acid, sodium-citrate and salt",
    "ms": [
      {
        "s": "1 package (3 oz)",
        "c": 2.55
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 0.63
      }
    ]
  },
  {
    "i": 5894,
    "n": "Gelatin desserts, dry mix, reduced calorie, with aspartame, added phosphorus, potassium, sodium, vitamin C",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.18
      },
      {
        "s": "1 package (0.35 oz)",
        "c": 0.2
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 0.05
      }
    ]
  },
  {
    "i": 5895,
    "n": "Corn flour, yellow, degermed, unenriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.52
      }
    ]
  },
  {
    "i": 5896,
    "n": "Snacks, potato chips, fat-free, made with olestra",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.92
      }
    ]
  },
  {
    "i": 5897,
    "n": "Snacks, potato chips, reduced fat",
    "ms": [
      {
        "s": "1 bag (6 oz)",
        "c": 35.7
      },
      {
        "s": "1 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 5898,
    "n": "Popcorn, sugar syrup/caramel, fat-free",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 5900,
    "n": "Snacks, potato chips, cheese-flavor",
    "ms": [
      {
        "s": "1 bag (6 oz)",
        "c": 122
      },
      {
        "s": "1 oz",
        "c": 20.4
      }
    ]
  },
  {
    "i": 5904,
    "n": "Snacks, granola bars, hard, peanut butter",
    "ms": [
      {
        "s": "1 oz",
        "c": 11.6
      },
      {
        "s": "1 bar",
        "c": 9.84
      }
    ]
  },
  {
    "i": 5905,
    "n": "Snacks, rice cakes, brown rice, corn",
    "ms": [
      {
        "s": "1 cake",
        "c": 0.81
      },
      {
        "s": "2 cakes",
        "c": 1.62
      }
    ]
  },
  {
    "i": 5906,
    "n": "Snacks, granola bars, soft, uncoated, nut and raisin",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 23.5
      }
    ]
  },
  {
    "i": 5907,
    "n": "Snacks, potato chips, made from dried potatoes, cheese-flavor",
    "ms": [
      {
        "s": "1 can (6.25 oz)",
        "c": 210
      },
      {
        "s": "1 oz",
        "c": 31.2
      }
    ]
  },
  {
    "i": 5908,
    "n": "Snacks, Rice Cakes, Brown Rice, Multigrain*",
    "ms": [
      {
        "s": "2 cakes",
        "c": 3.78
      },
      {
        "s": "1 cake",
        "c": 1.89
      }
    ]
  },
  {
    "i": 5910,
    "n": "Snacks, granola bars, soft, uncoated, chocolate chip",
    "ms": [
      {
        "s": "1 bar (1.5 oz)",
        "c": 17.6
      },
      {
        "s": "1 bar (1 oz)",
        "c": 11.5
      }
    ]
  },
  {
    "i": 5912,
    "n": "Snacks, crisped rice bar, almond",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 20.7
      }
    ]
  },
  {
    "i": 5913,
    "n": "Snacks, cornnuts, barbecue-flavor",
    "ms": [
      {
        "s": "2 oz",
        "c": 9.69
      },
      {
        "s": "1 oz",
        "c": 4.82
      }
    ]
  },
  {
    "i": 5915,
    "n": "Snacks, granola bars, soft, uncoated, chocolate chip, graham and marshmallow",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 24.9
      }
    ]
  },
  {
    "i": 5918,
    "n": "Syrups, sorghum",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 31.5
      },
      {
        "s": "1 cup",
        "c": 495
      }
    ]
  },
  {
    "i": 5919,
    "n": "Toppings, nuts in syrup",
    "ms": [
      {
        "s": "1 cup",
        "c": 115
      },
      {
        "s": "2 tbsp",
        "c": 14.4
      }
    ]
  },
  {
    "i": 5920,
    "n": "Syrups, maple",
    "ms": [
      {
        "s": "1 serving 1/4 cup",
        "c": 84.7
      },
      {
        "s": "1 cup",
        "c": 321
      },
      {
        "s": "1 tbsp",
        "c": 20.4
      }
    ]
  },
  {
    "i": 5921,
    "n": "Toppings, marshmallow cream",
    "ms": [
      {
        "s": "1 jar",
        "c": 5.94
      },
      {
        "s": "1 oz",
        "c": 0.85
      }
    ]
  },
  {
    "i": 5922,
    "n": "Toppings, pineapple",
    "ms": [
      {
        "s": "1 cup",
        "c": 20.4
      },
      {
        "s": "2 tbsp",
        "c": 2.52
      }
    ]
  },
  {
    "i": 5925,
    "n": "Syrups, corn, high-fructose",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 5926,
    "n": "Sugars, maple",
    "ms": [
      {
        "s": "1 piece (1-3/4 x 1-1/4 x 1/2)",
        "c": 25.2
      },
      {
        "s": "1 oz",
        "c": 25.5
      },
      {
        "s": "1 tsp",
        "c": 2.7
      }
    ]
  },
  {
    "i": 5928,
    "n": "Puddings, lemon, dry mix, instant",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 0.5
      },
      {
        "s": "1 package (3.5 oz)",
        "c": 1.98
      }
    ]
  },
  {
    "i": 5929,
    "n": "Syrups, malt",
    "ms": [
      {
        "s": "1 cup",
        "c": 203
      },
      {
        "s": "1 tbsp",
        "c": 12.8
      }
    ]
  },
  {
    "i": 5930,
    "n": "Sugars, powdered",
    "ms": [
      {
        "s": "1 cup unsifted",
        "c": 1.2
      },
      {
        "s": "1 tbsp unsifted",
        "c": 0.08
      },
      {
        "s": "1 tsp",
        "c": 0.025
      },
      {
        "s": "1 cup sifted",
        "c": 1
      }
    ]
  },
  {
    "i": 5931,
    "n": "Sugars, Granulated*",
    "ms": [
      {
        "s": "1 serving packet",
        "c": 0.028
      },
      {
        "s": "1 tsp",
        "c": 0.042
      },
      {
        "s": "1 serving 1 cube",
        "c": 0.023
      },
      {
        "s": "1 cup",
        "c": 2
      }
    ]
  },
  {
    "i": 5933,
    "n": "Puddings, banana, dry mix, regular",
    "ms": [
      {
        "s": "1 package (3.12 oz)",
        "c": 17.6
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 4.4
      }
    ]
  },
  {
    "i": 5939,
    "n": "Jellies",
    "ms": [
      {
        "s": "1 serving 1 tbsp",
        "c": 1.47
      },
      {
        "s": "1 packet (0.5 oz)",
        "c": 0.98
      }
    ]
  },
  {
    "i": 5941,
    "n": "Puddings, banana, dry mix, instant",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 1.5
      },
      {
        "s": "1 package (3.5 oz)",
        "c": 5.94
      }
    ]
  },
  {
    "i": 5945,
    "n": "Candies, dark chocolate coated coffee beans",
    "ms": [
      {
        "s": "1 serving 28 pieces",
        "c": 40
      }
    ]
  },
  {
    "i": 5946,
    "n": "Candies, milk chocolate coated coffee beans",
    "ms": [
      {
        "s": "1 oz",
        "c": 47.9
      }
    ]
  },
  {
    "i": 5947,
    "n": "Honey",
    "ms": [
      {
        "s": "1 packet (0.5 oz)",
        "c": 0.84
      },
      {
        "s": "1 tbsp",
        "c": 1.26
      },
      {
        "s": "1 cup",
        "c": 20.3
      }
    ]
  },
  {
    "i": 5948,
    "n": "Jams and preserves",
    "ms": [
      {
        "s": "1 packet (0.5 oz)",
        "c": 2.8
      },
      {
        "s": "1 tbsp",
        "c": 4
      }
    ]
  },
  {
    "i": 5950,
    "n": "Snacks, fruit leather, pieces, with vitamin C",
    "ms": [
      {
        "s": "1 packet",
        "c": 2.56
      },
      {
        "s": "1 serving",
        "c": 3.78
      }
    ]
  },
  {
    "i": 5953,
    "n": "Ice creams, vanilla, light, no sugar added",
    "ms": [
      {
        "s": "1 serving 1/2 cup",
        "c": 92.5
      }
    ]
  },
  {
    "i": 5956,
    "n": "Ice creams, chocolate, light, no sugar added",
    "ms": [
      {
        "s": "1 serving 1/2 cup",
        "c": 87.1
      }
    ]
  },
  {
    "i": 5957,
    "n": "Frostings, chocolate, creamy, dry mix",
    "ms": [
      {
        "s": "1 package",
        "c": 42.7
      }
    ]
  },
  {
    "i": 5958,
    "n": "Frozen novelties, fruit and juice bars",
    "ms": [
      {
        "s": "1 bar (3 fl oz)",
        "c": 4.6
      },
      {
        "s": "1 bar (2.5 fl oz)",
        "c": 3.85
      }
    ]
  },
  {
    "i": 5961,
    "n": "Flan, caramel custard, dry mix, prepared with 2% milk",
    "ms": [
      {
        "s": "0 cup",
        "c": 159
      }
    ]
  },
  {
    "i": 5962,
    "n": "Frostings, coconut-nut, ready-to-eat",
    "ms": [
      {
        "s": "1 package (16 oz)",
        "c": 60.1
      },
      {
        "s": "0.08 package",
        "c": 4.94
      },
      {
        "s": "2 tbsp",
        "c": 4.55
      }
    ]
  },
  {
    "i": 5963,
    "n": "Frostings, cream cheese-flavor, ready-to-eat",
    "ms": [
      {
        "s": "2 tbsp creamy",
        "c": 0.99
      },
      {
        "s": "2 tbsp whipped",
        "c": 0.72
      }
    ]
  },
  {
    "i": 5964,
    "n": "Frostings, vanilla, creamy, ready-to-eat",
    "ms": [
      {
        "s": "1 package (16 oz)",
        "c": 13.9
      },
      {
        "s": "2 tbsp creamy",
        "c": 0.99
      },
      {
        "s": "0.08 package",
        "c": 1.14
      }
    ]
  },
  {
    "i": 5968,
    "n": "Desserts, rennin, chocolate, dry mix",
    "ms": [
      {
        "s": "1 package (2 oz)",
        "c": 94.6
      },
      {
        "s": "1 tbsp",
        "c": 14.9
      }
    ]
  },
  {
    "i": 5969,
    "n": "Frozen novelties, ice type, fruit, no sugar added",
    "ms": [
      {
        "s": "1 bar",
        "c": 1.02
      }
    ]
  },
  {
    "i": 5970,
    "n": "Puddings, coconut cream, dry mix, regular, prepared with 2% milk",
    "ms": [
      {
        "s": "1 package yield (2 cups)",
        "c": 632
      },
      {
        "s": "0.5 cup",
        "c": 158
      }
    ]
  },
  {
    "i": 5971,
    "n": "Puddings, rice, dry mix, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 134
      }
    ]
  },
  {
    "i": 5972,
    "n": "Puddings, tapioca, ready-to-eat",
    "ms": [
      {
        "s": "1 oz",
        "c": 20.1
      },
      {
        "s": "1 container",
        "c": 68.9
      },
      {
        "s": "1 container refrigerated 4 oz",
        "c": 78.1
      }
    ]
  },
  {
    "i": 5973,
    "n": "Puddings, tapioca, dry mix, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 134
      }
    ]
  },
  {
    "i": 5974,
    "n": "Puddings, vanilla, ready-to-eat",
    "ms": [
      {
        "s": "1 oz",
        "c": 13.9
      },
      {
        "s": "1 container shelf stable 3.5 oz",
        "c": 47.5
      },
      {
        "s": "1 container refrigerated 4 oz",
        "c": 53.9
      }
    ]
  },
  {
    "i": 5976,
    "n": "Puddings, chocolate, dry mix, regular",
    "ms": [
      {
        "s": "1 package (3.5 oz)",
        "c": 52.5
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 13.2
      }
    ]
  },
  {
    "i": 5977,
    "n": "Puddings, vanilla, dry mix, regular",
    "ms": [
      {
        "s": "1 package (3.12 oz)",
        "c": 4.4
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 1.1
      }
    ]
  },
  {
    "i": 5980,
    "n": "Puddings, tapioca, dry mix",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 0.92
      },
      {
        "s": "1 package (3.5 oz)",
        "c": 3.68
      }
    ]
  },
  {
    "i": 5981,
    "n": "Gelatin desserts, dry mix, reduced calorie, with aspartame",
    "ms": [
      {
        "s": "1 serving",
        "c": 0.512
      }
    ]
  },
  {
    "i": 5984,
    "n": "Gelatins, dry powder, unsweetened",
    "ms": [
      {
        "s": "1 envelope (1 tbsp)",
        "c": 3.85
      },
      {
        "s": "1 package (1 oz)",
        "c": 15.4
      }
    ]
  },
  {
    "i": 5985,
    "n": "Flan, caramel custard, dry mix",
    "ms": [
      {
        "s": "1 package (3 oz)",
        "c": 20.4
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 5.04
      }
    ]
  },
  {
    "i": 5990,
    "n": "Desserts, egg custard, baked, prepared-from-recipe",
    "ms": [
      {
        "s": "1 recipe yield",
        "c": 602
      },
      {
        "s": "0.5 cup",
        "c": 151
      }
    ]
  },
  {
    "i": 5991,
    "n": "Cocoa, dry powder, unsweetened, processed with alkali",
    "ms": [
      {
        "s": "1 cup",
        "c": 95.5
      },
      {
        "s": "1 tbsp",
        "c": 5.99
      }
    ]
  },
  {
    "i": 5993,
    "n": "Cocoa, dry powder, unsweetened",
    "ms": [
      {
        "s": "1 cup",
        "c": 110
      },
      {
        "s": "1 tbsp",
        "c": 6.91
      }
    ]
  },
  {
    "i": 5997,
    "n": "Candies, peanut bar",
    "ms": [
      {
        "s": "1 bar (1.6 oz)",
        "c": 35.1
      },
      {
        "s": "1 bar (1.75 fl oz)",
        "c": 39
      },
      {
        "s": "1 oz",
        "c": 22.1
      },
      {
        "s": "1 bar (1.4 oz)",
        "c": 31.2
      }
    ]
  },
  {
    "i": 5998,
    "n": "Candies, sesame crunch",
    "ms": [
      {
        "s": "1 oz",
        "c": 181
      },
      {
        "s": "20 pieces",
        "c": 224
      },
      {
        "s": "1 piece",
        "c": 11.5
      }
    ]
  },
  {
    "i": 6003,
    "n": "Syrups, table blends, pancake",
    "ms": [
      {
        "s": "1 cup",
        "c": 9.42
      },
      {
        "s": "1 tbsp",
        "c": 0.6
      }
    ]
  },
  {
    "i": 6007,
    "n": "Alcoholic beverage, beer, light, low carb",
    "ms": [
      {
        "s": "12 fl oz",
        "c": 14.2
      },
      {
        "s": "1 fl oz",
        "c": 1.18
      }
    ]
  },
  {
    "i": 6008,
    "n": "Candies, milk chocolate coated raisins",
    "ms": [
      {
        "s": "1 cup",
        "c": 155
      },
      {
        "s": "10 pieces",
        "c": 8.6
      }
    ]
  },
  {
    "i": 6009,
    "n": "Syrups, table blends, pancake, reduced-calorie",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "1 serving 1/4 cup",
        "c": 7.3
      },
      {
        "s": "1 tbsp",
        "c": 1.5
      },
      {
        "s": "1 cup",
        "c": 24
      }
    ]
  },
  {
    "i": 6013,
    "n": "Beef, brisket, flat half, boneless, separable lean and fat, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 piece",
        "c": 61.7
      }
    ]
  },
  {
    "i": 6014,
    "n": "Beef, loin, bottom sirloin butt, tri-tip roast, separable lean only, trimmed to 0 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "1 serving",
        "c": 14.4
      },
      {
        "s": "1 roast",
        "c": 96.7
      },
      {
        "s": "3 oz",
        "c": 14.4
      }
    ]
  },
  {
    "i": 6018,
    "n": "Beef, chuck, mock tender steak, separable lean only, trimmed to 0 fat, select, cooked, broiled",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      }
    ]
  },
  {
    "i": 6021,
    "n": "Beef, chuck eye roast, boneless, America's Beef Roast, separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 20.3
      },
      {
        "s": "1 roast",
        "c": 232
      }
    ]
  },
  {
    "i": 6022,
    "n": "Beef, rib eye, small end (ribs 10-12), separable lean and fat, trimmed to 0 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 17
      },
      {
        "s": "1 steak (yield from 295 g raw meat)",
        "c": 46.6
      }
    ]
  },
  {
    "i": 6023,
    "n": "Beef, chuck, mock tender steak, separable lean only, trimmed to 0 fat, choice, cooked, broiled",
    "ms": [
      {
        "s": "3 oz (1 serving)",
        "c": 6.8
      }
    ]
  },
  {
    "i": 6031,
    "n": "Beef, brisket, flat half, separable lean and fat, trimmed to 0 fat, select, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 17
      },
      {
        "s": "1 steak (yield from 388 g raw meat)",
        "c": 49.4
      }
    ]
  },
  {
    "i": 6034,
    "n": "Beef, tenderloin, separable lean and fat, trimmed to 1/8 fat, prime, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 31.8
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 6036,
    "n": "Beef, tenderloin, roast, separable lean and fat, trimmed to 1/8 fat, prime, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 26.1
      }
    ]
  },
  {
    "i": 6037,
    "n": "Beef, tenderloin, roast, separable lean and fat, trimmed to 1/8 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 29.6
      }
    ]
  },
  {
    "i": 6038,
    "n": "Beef, tenderloin, steak, separable lean and fat, trimmed to 1/8 fat, prime, cooked, broiled",
    "ms": [
      {
        "s": "1 steak, excluding refuse (yield from 1 raw steak, with refuse, weighing 154 g)",
        "c": 8.48
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 6040,
    "n": "Beef, tenderloin, roast, separable lean and fat, trimmed to 1/8 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 29.7
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 6041,
    "n": "Beef, loin, top loin, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 steak",
        "c": 18.1
      }
    ]
  },
  {
    "i": 6042,
    "n": "Beef, short loin, top loin, separable lean and fat, trimmed to 1/8 fat, prime, cooked, broiled",
    "ms": [
      {
        "s": "1 steak, excluding refuse (yield from 1 raw steak, with refuse, weighing 242 g)",
        "c": 15
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 6044,
    "n": "Beef, loin, top loin, separable lean and fat, trimmed to 1/8 fat, all grades, cooked, grilled",
    "ms": [
      {
        "s": "3 oz",
        "c": 16.2
      },
      {
        "s": "1 steak",
        "c": 40.5
      }
    ]
  },
  {
    "i": 6045,
    "n": "Beef, short loin, top loin, steak, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 27.1
      }
    ]
  },
  {
    "i": 6046,
    "n": "Beef, round, top round, steak, separable lean and fat, trimmed to 1/8 fat, prime, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 19.9
      }
    ]
  },
  {
    "i": 6048,
    "n": "Beef, Shoulder Top Blade Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 steak",
        "c": 30.2
      }
    ]
  },
  {
    "i": 6049,
    "n": "Beef, round, top round, separable lean and fat, trimmed to 1/8 fat, prime, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 13.6
      },
      {
        "s": "4 oz",
        "c": 3.39
      }
    ]
  },
  {
    "i": 6050,
    "n": "Beef, round, top round, separable lean and fat, trimmed to 1/8 fat, all grades, cooked, braised",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 14.3
      },
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 6051,
    "n": "Beef, round, tip round, roast, separable lean and fat, trimmed to 1/8 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 19.5
      }
    ]
  },
  {
    "i": 6052,
    "n": "Beef, round, top round steak, separable lean and fat, trimmed to 1/8 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 22.8
      }
    ]
  },
  {
    "i": 6056,
    "n": "Beef, round, tip round, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 lb",
        "c": 22.7
      }
    ]
  },
  {
    "i": 6057,
    "n": "Beef, round, tip round, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 22.7
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 6059,
    "n": "Beef, round, tip round, roast, separable lean and fat, trimmed to 1/8 fat, all grades, cooked, roasted",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 19.6
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6063,
    "n": "Beef, round, full cut, separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      },
      {
        "s": "1 lb",
        "c": 18.1
      }
    ]
  },
  {
    "i": 6066,
    "n": "Beef, round, bottom round, steak, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 90.7
      },
      {
        "s": "4 oz",
        "c": 22.6
      }
    ]
  },
  {
    "i": 6072,
    "n": "Beef, rib, small end (ribs 10-12), separable lean and fat, trimmed to 1/8 fat, prime, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 lb",
        "c": 45.4
      }
    ]
  },
  {
    "i": 6077,
    "n": "Beef, rib, large end (ribs 6-9), separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "1 lb",
        "c": 36.3
      }
    ]
  },
  {
    "i": 6079,
    "n": "Beef, rib, large end (ribs 6-9), separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 36.3
      },
      {
        "s": "1 oz",
        "c": 2.27
      }
    ]
  },
  {
    "i": 6085,
    "n": "Beef, rib, whole (ribs 6-12), separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      },
      {
        "s": "1 lb",
        "c": 40.8
      }
    ]
  },
  {
    "i": 6091,
    "n": "Beef, chuck, blade roast, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 lb",
        "c": 45.4
      }
    ]
  },
  {
    "i": 6092,
    "n": "Beef, chuck, blade roast, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 lb",
        "c": 45.4
      }
    ]
  },
  {
    "i": 6094,
    "n": "Beef, brisket, point half, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 27.2
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 6098,
    "n": "Beef, Shoulder Pot Roast Or Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 roast",
        "c": 158
      },
      {
        "s": "1 steak",
        "c": 133
      }
    ]
  },
  {
    "i": 6102,
    "n": "Beef, Shoulder Pot Roast Or Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 6105,
    "n": "Beef, Shoulder Pot Roast Or Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 123
      },
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 roast",
        "c": 158
      }
    ]
  },
  {
    "i": 6106,
    "n": "Beef, Shoulder Top Blade Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 steak",
        "c": 173
      }
    ]
  },
  {
    "i": 6107,
    "n": "Beef, ground, 70% lean meat / 30% fat, crumbles, cooked, pan-browned",
    "ms": [
      {
        "s": "3 oz",
        "c": 34.8
      },
      {
        "s": "1 portion (yield from 1/2 lb raw meat )",
        "c": 57
      }
    ]
  },
  {
    "i": 6108,
    "n": "Beef, ground, 70% lean meat / 30% fat, loaf, cooked, baked",
    "ms": [
      {
        "s": "1 loaf ( yield from 1 lb raw meat )",
        "c": 93.7
      },
      {
        "s": "3 oz",
        "c": 28
      }
    ]
  },
  {
    "i": 6115,
    "n": "Beef, short loin, t-bone steak, separable lean only, trimmed to 0 fat, select, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      },
      {
        "s": "1 serving",
        "c": 3.4
      },
      {
        "s": "1 piece, cooked, excluding refuse",
        "c": 10.6
      }
    ]
  },
  {
    "i": 6117,
    "n": "Beef, short loin, t-bone steak, separable lean and fat, trimmed to 0 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "1 lb",
        "c": 22.7
      },
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 6120,
    "n": "Beef, short loin, porterhouse steak, separable lean only, trimmed to 0 fat, select, cooked, broiled",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse",
        "c": 15.4
      },
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 serving",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6124,
    "n": "Beef, top sirloin, steak, separable lean and fat, trimmed to 0 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "1 steak (yield from 518 g raw meat)",
        "c": 84.5
      },
      {
        "s": "3 oz",
        "c": 18.7
      }
    ]
  },
  {
    "i": 6125,
    "n": "Beef, short loin, porterhouse steak, separable lean and fat, trimmed to 0 fat, all grades, cooked, broiled",
    "ms": [
      {
        "s": "1 lb",
        "c": 31.8
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 6127,
    "n": "Beef, top sirloin, steak, separable lean and fat, trimmed to 0 fat, choice, cooked, broiled",
    "ms": [
      {
        "s": "1 steak (yield from 532 g raw meat)",
        "c": 74.7
      },
      {
        "s": "3 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 6128,
    "n": "Beef, variety meats and by-products, spleen, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 6129,
    "n": "Beef, variety meats and by-products, liver, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 6132,
    "n": "Beef, variety meats and by-products, pancreas, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.55
      },
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 6133,
    "n": "Beef, variety meats and by-products, kidneys, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 6136,
    "n": "Beef, variety meats and by-products, kidneys, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.69
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 6137,
    "n": "Beef, variety meats and by-products, heart, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      }
    ]
  },
  {
    "i": 6138,
    "n": "Beef, Chuck, Under Blade Pot Roast Or Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 77.8
      },
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 roast",
        "c": 114
      }
    ]
  },
  {
    "i": 6139,
    "n": "Beef, short loin, porterhouse steak, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 97
      },
      {
        "s": "4 oz",
        "c": 20.3
      }
    ]
  },
  {
    "i": 6140,
    "n": "Beef, shank crosscuts, separable lean only, trimmed to 1/4 fat, choice, cooked, simmered",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 54.4
      },
      {
        "s": "3 oz",
        "c": 27.2
      }
    ]
  },
  {
    "i": 6142,
    "n": "Beef, rib, shortribs, separable lean and fat, choice, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 lb",
        "c": 40.8
      }
    ]
  },
  {
    "i": 6143,
    "n": "Beef, shank crosscuts, separable lean only, trimmed to 1/4 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.67
      },
      {
        "s": "1 lb",
        "c": 90.7
      }
    ]
  },
  {
    "i": 6149,
    "n": "Beef, Rib, Eye, Small End (Ribs 10-12), Separable Lean*",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "1 lb",
        "c": 45.4
      }
    ]
  },
  {
    "i": 6150,
    "n": "Beef, grass-fed, strip steaks, lean only, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 19.3
      },
      {
        "s": "4 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 6151,
    "n": "Beef, flank, steak, separable lean and fat, trimmed to 0 fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.65
      },
      {
        "s": "1 steak",
        "c": 54.5
      },
      {
        "s": "4 oz",
        "c": 30.5
      }
    ]
  },
  {
    "i": 6152,
    "n": "Nuts, mixed nuts, oil roasted, without peanuts, lightly salted",
    "ms": [
      {
        "s": "1 oz",
        "c": 36.9
      }
    ]
  },
  {
    "i": 6153,
    "n": "Beef, carcass, separable lean and fat, select, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 36.3
      },
      {
        "s": "1 oz",
        "c": 2.27
      }
    ]
  },
  {
    "i": 6154,
    "n": "Beef, carcass, separable lean and fat, choice, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "1 lb",
        "c": 36.3
      }
    ]
  },
  {
    "i": 6160,
    "n": "Nuts, mixed nuts, oil roasted, with peanuts, lightly salted",
    "ms": [
      {
        "s": "1 oz",
        "c": 33.2
      }
    ]
  },
  {
    "i": 6162,
    "n": "Nuts, almonds, oil roasted, with salt added, smoke flavor",
    "ms": [
      {
        "s": "1 oz (28 almonds)",
        "c": 80.1
      }
    ]
  },
  {
    "i": 6164,
    "n": "Seeds, sunflower seed kernels, dry roasted, with salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 19.8
      },
      {
        "s": "1 cup",
        "c": 89.6
      }
    ]
  },
  {
    "i": 6165,
    "n": "Seeds, sunflower seed kernels from shell, dry roasted, with salt added",
    "ms": [
      {
        "s": "1 cup",
        "c": 89.6
      },
      {
        "s": "1 oz",
        "c": 19.8
      },
      {
        "s": "1 package (1.875 oz) yields",
        "c": 18.9
      }
    ]
  },
  {
    "i": 6166,
    "n": "Nuts, Almonds, Oil Roasted, With*",
    "ms": [
      {
        "s": "1 oz (22 whole kernels)",
        "c": 82.5
      },
      {
        "s": "1 cup whole kernels",
        "c": 457
      }
    ]
  },
  {
    "i": 6167,
    "n": "Nuts, chestnuts, japanese, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 8.79
      }
    ]
  },
  {
    "i": 6168,
    "n": "Seeds, pumpkin and squash seed kernels, roasted, with salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 14.7
      },
      {
        "s": "1 cup",
        "c": 61.4
      }
    ]
  },
  {
    "i": 6169,
    "n": "Seeds, flaxseed",
    "ms": [
      {
        "s": "1 tsp, whole",
        "c": 8.67
      },
      {
        "s": "1 tbsp, whole",
        "c": 26.3
      },
      {
        "s": "1 cup, whole",
        "c": 428
      },
      {
        "s": "1 tbsp, ground",
        "c": 17.8
      },
      {
        "s": "1 tsp, ground",
        "c": 6.38
      }
    ]
  },
  {
    "i": 6171,
    "n": "Nuts, chestnuts, japanese, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 20.4
      },
      {
        "s": "1 cup",
        "c": 112
      }
    ]
  },
  {
    "i": 6172,
    "n": "Seeds, sesame butter, tahini, from unroasted kernels (non-chemically removed seed coat)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 19.7
      },
      {
        "s": "1 oz",
        "c": 40
      }
    ]
  },
  {
    "i": 6173,
    "n": "Seeds, sesame seed kernels, dried (decorticated)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 4.8
      },
      {
        "s": "1 tsp",
        "c": 1.62
      },
      {
        "s": "1 cup",
        "c": 90
      }
    ]
  },
  {
    "i": 6175,
    "n": "Nuts, formulated, wheat-based, all flavors except macadamia, without salt",
    "ms": [
      {
        "s": "1 oz",
        "c": 6.24
      }
    ]
  },
  {
    "i": 6176,
    "n": "Seeds, watermelon seed kernels, dried",
    "ms": [
      {
        "s": "1 oz",
        "c": 15.3
      },
      {
        "s": "1 cup",
        "c": 58.3
      }
    ]
  },
  {
    "i": 6177,
    "n": "Fiddlehead ferns, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 32
      }
    ]
  },
  {
    "i": 6178,
    "n": "Seeds, sesame butter, tahini, from raw and stone ground kernels",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 63
      },
      {
        "s": "1 oz",
        "c": 119
      }
    ]
  },
  {
    "i": 6179,
    "n": "Malabar spinach, cooked",
    "ms": [
      {
        "s": "1 bunch",
        "c": 21.1
      },
      {
        "s": "1 cup",
        "c": 54.6
      }
    ]
  },
  {
    "i": 6180,
    "n": "Mushrooms, maitake, raw",
    "ms": [
      {
        "s": "1 piece whole",
        "c": 0.011
      },
      {
        "s": "1 cup diced",
        "c": 0.7
      }
    ]
  },
  {
    "i": 6181,
    "n": "Yautia (tannier), raw",
    "ms": [
      {
        "s": "1 root",
        "c": 27.4
      },
      {
        "s": "1 cup, sliced",
        "c": 12.2
      }
    ]
  },
  {
    "i": 6182,
    "n": "Mushrooms, white, microwaved",
    "ms": [
      {
        "s": "100 g",
        "c": 6
      }
    ]
  },
  {
    "i": 6183,
    "n": "Broccoli, chinese, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 105
      }
    ]
  },
  {
    "i": 6184,
    "n": "Epazote, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.2
      },
      {
        "s": "1 sprig",
        "c": 5.5
      }
    ]
  },
  {
    "i": 6185,
    "n": "Fireweed, leaves, raw",
    "ms": [
      {
        "s": "1 plant",
        "c": 94.4
      },
      {
        "s": "1 cup, chopped",
        "c": 98.7
      }
    ]
  },
  {
    "i": 6187,
    "n": "Peppers, serrano, raw",
    "ms": [
      {
        "s": "1 pepper",
        "c": 0.671
      },
      {
        "s": "1 cup, chopped",
        "c": 11.6
      }
    ]
  },
  {
    "i": 6188,
    "n": "Peppers, ancho, dried",
    "ms": [
      {
        "s": "1 pepper",
        "c": 10.4
      }
    ]
  },
  {
    "i": 6189,
    "n": "Pepper, banana, raw",
    "ms": [
      {
        "s": "1 small (4 long)",
        "c": 4.62
      },
      {
        "s": "1 large (5 long)",
        "c": 10.5
      },
      {
        "s": "1 medium (4-1/2 long)",
        "c": 6.44
      },
      {
        "s": "1 cup",
        "c": 17.4
      }
    ]
  },
  {
    "i": 6191,
    "n": "Pickles, chowchow, with cauliflower onion mustard, sweet",
    "ms": [
      {
        "s": "1 cup",
        "c": 56.4
      }
    ]
  },
  {
    "i": 6194,
    "n": "Arugula, raw",
    "ms": [
      {
        "s": "1 leaf",
        "c": 3.2
      },
      {
        "s": "0.5 cup",
        "c": 16
      }
    ]
  },
  {
    "i": 6195,
    "n": "Cauliflower, green, raw",
    "ms": [
      {
        "s": "1 floweret",
        "c": 8.25
      },
      {
        "s": "1 cup",
        "c": 21.1
      },
      {
        "s": "1 head, large (6-7 dia)",
        "c": 169
      },
      {
        "s": "1 head, medium (5-6 dia)",
        "c": 142
      },
      {
        "s": "1 head, small (4 dia)",
        "c": 107
      }
    ]
  },
  {
    "i": 6197,
    "n": "Pickle relish, hamburger",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.6
      },
      {
        "s": "0.5 cup",
        "c": 4.88
      }
    ]
  },
  {
    "i": 6198,
    "n": "Fennel, bulb, raw",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 42.6
      },
      {
        "s": "1 bulb",
        "c": 115
      }
    ]
  },
  {
    "i": 6199,
    "n": "Mushrooms, enoki, raw",
    "ms": [
      {
        "s": "1 cup whole",
        "c": 0
      },
      {
        "s": "1 cup sliced",
        "c": 0
      },
      {
        "s": "1 medium",
        "c": 0
      },
      {
        "s": "1 large",
        "c": 0
      }
    ]
  },
  {
    "i": 6200,
    "n": "Pickles, cucumber, sweet, low sodium (includes bread and butter pickles)",
    "ms": [
      {
        "s": "1 medium",
        "c": 1.4
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 6.4
      },
      {
        "s": "1 slice",
        "c": 0.24
      },
      {
        "s": "1 large",
        "c": 1.4
      },
      {
        "s": "1 cup, sliced",
        "c": 6.8
      },
      {
        "s": "1 small",
        "c": 0.6
      }
    ]
  },
  {
    "i": 6202,
    "n": "Peppers, sweet, yellow, raw",
    "ms": [
      {
        "s": "1 pepper, large (3-3/4 long, 3 dia)",
        "c": 20.5
      },
      {
        "s": "10 strips",
        "c": 5.72
      }
    ]
  },
  {
    "i": 6203,
    "n": "Tomatoes, sun-dried, packed in oil, drained",
    "ms": [
      {
        "s": "1 piece",
        "c": 1.41
      },
      {
        "s": "1 cup",
        "c": 51.7
      }
    ]
  },
  {
    "i": 6204,
    "n": "Catsup*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.55
      },
      {
        "s": "1 cup",
        "c": 36
      },
      {
        "s": "1 packet",
        "c": 1.35
      }
    ]
  },
  {
    "i": 6209,
    "n": "Mushroom, white, exposed to ultraviolet light, raw",
    "ms": [
      {
        "s": "1 medium",
        "c": 0.54
      },
      {
        "s": "1 cup pieces or slices",
        "c": 2.1
      },
      {
        "s": "1 large",
        "c": 0.69
      },
      {
        "s": "1 cup whole",
        "c": 2.88
      },
      {
        "s": "1 small",
        "c": 0.3
      },
      {
        "s": "1 slice",
        "c": 0.18
      }
    ]
  },
  {
    "i": 6213,
    "n": "Dock, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 38
      }
    ]
  },
  {
    "i": 6214,
    "n": "Peppers, sweet, red, freeze-dried",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.536
      },
      {
        "s": "0.25 cup",
        "c": 2.14
      }
    ]
  },
  {
    "i": 6215,
    "n": "Potatoes, mashed, dehydrated, prepared from flakes without milk, whole milk and margarine added",
    "ms": [
      {
        "s": "1 cup",
        "c": 103
      }
    ]
  },
  {
    "i": 6224,
    "n": "Jute, Potherb, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 184
      }
    ]
  },
  {
    "i": 6225,
    "n": "Yambean (Jicama), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 11
      }
    ]
  },
  {
    "i": 6226,
    "n": "Gourd, White-Flowered (Calabash), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup (1 cubes)",
        "c": 35
      }
    ]
  },
  {
    "i": 6227,
    "n": "Yardlong Bean, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 45.8
      },
      {
        "s": "1 pod",
        "c": 6.16
      }
    ]
  },
  {
    "i": 6229,
    "n": "Kale, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 177
      }
    ]
  },
  {
    "i": 6230,
    "n": "Kohlrabi, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 41.2
      }
    ]
  },
  {
    "i": 6232,
    "n": "Cress, Garden, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 82.4
      }
    ]
  },
  {
    "i": 6233,
    "n": "Dandelion Greens, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 147
      }
    ]
  },
  {
    "i": 6236,
    "n": "Eggplant, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup (1 cubes)",
        "c": 5.94
      }
    ]
  },
  {
    "i": 6239,
    "n": "Celery, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "2 stalks",
        "c": 31.5
      },
      {
        "s": "1 cup, diced",
        "c": 63
      }
    ]
  },
  {
    "i": 6246,
    "n": "Cabbage, common (danish, domestic, and pointed types), stored, raw",
    "ms": [
      {
        "s": "0.5 cup, shredded",
        "c": 16.4
      },
      {
        "s": "1 head",
        "c": 427
      }
    ]
  },
  {
    "i": 6248,
    "n": "Cardoon, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 72
      }
    ]
  },
  {
    "i": 6249,
    "n": "Butterbur, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 59
      }
    ]
  },
  {
    "i": 6250,
    "n": "Cabbage, common (danish, domestic, and pointed types), freshly harvest, raw",
    "ms": [
      {
        "s": "0.5 cup, shredded",
        "c": 16.4
      },
      {
        "s": "1 head",
        "c": 427
      }
    ]
  },
  {
    "i": 6254,
    "n": "Broadbeans, Immature Seeds, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 18
      }
    ]
  },
  {
    "i": 6255,
    "n": "Broccoli, stalks, raw",
    "ms": [
      {
        "s": "1 stalk",
        "c": 54.7
      }
    ]
  },
  {
    "i": 6256,
    "n": "Broccoli, leaves, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 48
      }
    ]
  },
  {
    "i": 6257,
    "n": "Broccoli, flower clusters, raw",
    "ms": [
      {
        "s": "1 cup flowerets",
        "c": 34.1
      },
      {
        "s": "1 floweret",
        "c": 5.28
      }
    ]
  },
  {
    "i": 6258,
    "n": "Beans, Snap, Green, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 55
      }
    ]
  },
  {
    "i": 6259,
    "n": "Beans, Snap, Yellow, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 57.5
      }
    ]
  },
  {
    "i": 6262,
    "n": "Beans, snap, yellow, raw",
    "ms": [
      {
        "s": "1 cup 1/2 pieces",
        "c": 37
      },
      {
        "s": "10 beans (4 long)",
        "c": 20.4
      }
    ]
  },
  {
    "i": 6264,
    "n": "Beans, Pinto, Mature Seeds, Sprouted, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 15
      }
    ]
  },
  {
    "i": 6266,
    "n": "Asparagus, Cooked, Boiled, Drained*",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 20.7
      },
      {
        "s": "4 spears (1/2 base)",
        "c": 13.8
      }
    ]
  },
  {
    "i": 6269,
    "n": "Lima Beans, Immature Seeds, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 54.4
      }
    ]
  },
  {
    "i": 6271,
    "n": "Taro, tahitian, raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 161
      }
    ]
  },
  {
    "i": 6275,
    "n": "Taro, raw",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 44.7
      }
    ]
  },
  {
    "i": 6279,
    "n": "Squash, winter, spaghetti, raw",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 23.2
      }
    ]
  },
  {
    "i": 6280,
    "n": "Sweet potato leaves, raw",
    "ms": [
      {
        "s": "1 leaf (12-1/4 long)",
        "c": 12.5
      },
      {
        "s": "1 cup, chopped",
        "c": 27.3
      }
    ]
  },
  {
    "i": 6281,
    "n": "Water convolvulus,raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 43.1
      },
      {
        "s": "1 shoot",
        "c": 10
      }
    ]
  },
  {
    "i": 6282,
    "n": "Succotash, (corn and limas), raw",
    "ms": [
      {
        "s": "100 g",
        "c": 18
      }
    ]
  },
  {
    "i": 6289,
    "n": "Squash, winter, butternut, raw",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 67.2
      }
    ]
  },
  {
    "i": 6290,
    "n": "Squash, Summer, Zucchini, Includes Skin, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 32.4
      },
      {
        "s": "0.5 cup, mashed",
        "c": 21.6
      }
    ]
  },
  {
    "i": 6295,
    "n": "Squash, summer, zucchini, includes skin, raw",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 18.1
      },
      {
        "s": "1 cup, chopped",
        "c": 19.8
      },
      {
        "s": "1 small",
        "c": 18.9
      },
      {
        "s": "1 slice",
        "c": 1.58
      },
      {
        "s": "1 medium",
        "c": 31.4
      },
      {
        "s": "1 large",
        "c": 51.7
      }
    ]
  },
  {
    "i": 6296,
    "n": "Squash, summer, scallop, raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 24.7
      }
    ]
  },
  {
    "i": 6298,
    "n": "Soybeans, mature seeds, sprouted, raw",
    "ms": [
      {
        "s": "10 sprouts",
        "c": 6.7
      },
      {
        "s": "0.5 cup",
        "c": 23.4
      }
    ]
  },
  {
    "i": 6300,
    "n": "Seaweed, agar, raw",
    "ms": [
      {
        "s": "2 tbsp (1/8 cup)",
        "c": 5.4
      }
    ]
  },
  {
    "i": 6302,
    "n": "Soybeans, green, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 504
      }
    ]
  },
  {
    "i": 6308,
    "n": "Radishes, raw",
    "ms": [
      {
        "s": "1 large (1 to 1-1/4 dia)",
        "c": 2.25
      },
      {
        "s": "1 slice",
        "c": 0.25
      },
      {
        "s": "0.5 cup slices",
        "c": 14.5
      },
      {
        "s": "1 cup slices",
        "c": 29
      },
      {
        "s": "1 small",
        "c": 0.5
      },
      {
        "s": "1 medium (3/4 to 1 dia)",
        "c": 1.12
      }
    ]
  },
  {
    "i": 6309,
    "n": "Purslane, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 28
      },
      {
        "s": "1 plant",
        "c": 1.95
      }
    ]
  },
  {
    "i": 6310,
    "n": "Salsify, (vegetable oyster), raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 79.8
      }
    ]
  },
  {
    "i": 6314,
    "n": "Pumpkin leaves, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 15.2
      }
    ]
  },
  {
    "i": 6315,
    "n": "Pumpkin flowers, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 12.9
      },
      {
        "s": "1 flower",
        "c": 0.78
      }
    ]
  },
  {
    "i": 6317,
    "n": "Pumpkin flowers, cooked, boiled, drained, without salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 49.6
      }
    ]
  },
  {
    "i": 6320,
    "n": "Okra, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "8 pods (3 long)",
        "c": 65.4
      },
      {
        "s": "0.5 cup slices",
        "c": 61.6
      }
    ]
  },
  {
    "i": 6321,
    "n": "Okra, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 82
      },
      {
        "s": "8 pods (3 long)",
        "c": 77.9
      }
    ]
  },
  {
    "i": 6326,
    "n": "Mustard greens, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 64.4
      }
    ]
  },
  {
    "i": 6327,
    "n": "Mushrooms, portabella, raw",
    "ms": [
      {
        "s": "1 cup diced",
        "c": 2.58
      },
      {
        "s": "1 piece whole",
        "c": 2.52
      }
    ]
  },
  {
    "i": 6330,
    "n": "Lotus root, raw",
    "ms": [
      {
        "s": "1 root (9-1/2 long)",
        "c": 51.8
      },
      {
        "s": "10 slices (2-1/2 dia)",
        "c": 36.4
      }
    ]
  },
  {
    "i": 6331,
    "n": "Mushrooms, White, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.588
      },
      {
        "s": "1 mushroom",
        "c": 0.72
      },
      {
        "s": "1 cup pieces",
        "c": 9.36
      }
    ]
  },
  {
    "i": 6332,
    "n": "Mushrooms, white, raw",
    "ms": [
      {
        "s": "0.5 cup pieces",
        "c": 1.05
      },
      {
        "s": "1 large",
        "c": 0.69
      },
      {
        "s": "1 medium",
        "c": 0.54
      },
      {
        "s": "1 cup, whole",
        "c": 2.88
      },
      {
        "s": "1 slice",
        "c": 0.18
      },
      {
        "s": "1 cup, pieces or slices",
        "c": 2.1
      },
      {
        "s": "1 small",
        "c": 0.3
      }
    ]
  },
  {
    "i": 6333,
    "n": "Lettuce, green leaf, raw",
    "ms": [
      {
        "s": "1 cup shredded",
        "c": 13
      },
      {
        "s": "1 leaf outer",
        "c": 8.64
      },
      {
        "s": "1 leaf inner",
        "c": 1.73
      },
      {
        "s": "1 head",
        "c": 130
      }
    ]
  },
  {
    "i": 6334,
    "n": "Mushrooms, white, stir-fried",
    "ms": [
      {
        "s": "1 cup sliced",
        "c": 4.32
      }
    ]
  },
  {
    "i": 6335,
    "n": "Lettuce, cos or romaine, raw",
    "ms": [
      {
        "s": "1 NLEA serving",
        "c": 28
      },
      {
        "s": "1 leaf outer",
        "c": 9.24
      },
      {
        "s": "1 head",
        "c": 207
      },
      {
        "s": "1 leaf inner",
        "c": 1.98
      },
      {
        "s": "1 cup shredded",
        "c": 15.5
      }
    ]
  },
  {
    "i": 6336,
    "n": "Lettuce, iceberg (includes crisphead types), raw",
    "ms": [
      {
        "s": "1 leaf, medium",
        "c": 1.44
      },
      {
        "s": "1 NLEA Serving",
        "c": 16
      },
      {
        "s": "1 head, small",
        "c": 58.3
      },
      {
        "s": "1 leaf, small",
        "c": 0.9
      },
      {
        "s": "1 cup shredded",
        "c": 13
      },
      {
        "s": "1 leaf, large",
        "c": 2.7
      },
      {
        "s": "1 head, medium (6 dia)",
        "c": 97
      },
      {
        "s": "1 head, large",
        "c": 136
      },
      {
        "s": "1 cup, chopped (1/2 pieces, loosely packed)",
        "c": 10.3
      }
    ]
  },
  {
    "i": 6337,
    "n": "Lambsquarters, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 464
      }
    ]
  },
  {
    "i": 6338,
    "n": "Lambsquarters, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 309
      }
    ]
  },
  {
    "i": 6339,
    "n": "Leeks, (bulb and lower leaf-portion), raw",
    "ms": [
      {
        "s": "1 slice",
        "c": 3.54
      },
      {
        "s": "1 leek",
        "c": 52.5
      },
      {
        "s": "1 cup",
        "c": 52.5
      }
    ]
  },
  {
    "i": 6340,
    "n": "Mushrooms, shiitake, raw",
    "ms": [
      {
        "s": "1 piece whole",
        "c": 0.38
      }
    ]
  },
  {
    "i": 6341,
    "n": "Kanpyo, (dried gourd strips)",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 75.6
      },
      {
        "s": "1 strip",
        "c": 17.6
      }
    ]
  },
  {
    "i": 6346,
    "n": "Gourd, white-flowered (calabash), raw",
    "ms": [
      {
        "s": "0.5 cup (1 pieces)",
        "c": 15.1
      },
      {
        "s": "1 gourd",
        "c": 200
      }
    ]
  },
  {
    "i": 6347,
    "n": "Hyacinth-Beans, Immature Seeds, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 35.7
      }
    ]
  },
  {
    "i": 6348,
    "n": "Jerusalem-artichokes, raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 21
      }
    ]
  },
  {
    "i": 6349,
    "n": "Jew's ear, (pepeao), raw",
    "ms": [
      {
        "s": "1 cup slices",
        "c": 15.8
      },
      {
        "s": "1 piece",
        "c": 0.96
      }
    ]
  },
  {
    "i": 6350,
    "n": "Hyacinth-beans, immature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 40
      }
    ]
  },
  {
    "i": 6352,
    "n": "Ginger root, raw",
    "ms": [
      {
        "s": "1 tsp",
        "c": 0.32
      },
      {
        "s": "0.25 cup slices (1 dia)",
        "c": 3.84
      },
      {
        "s": "5 slices (1 dia)",
        "c": 1.76
      }
    ]
  },
  {
    "i": 6354,
    "n": "Eggplant, raw",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 7.38
      },
      {
        "s": "1 eggplant, peeled (yield from 1-1/4 lb)",
        "c": 41.2
      },
      {
        "s": "1 eggplant, unpeeled (approx 1-1/4 lb)",
        "c": 49.3
      }
    ]
  },
  {
    "i": 6355,
    "n": "Garlic, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 246
      },
      {
        "s": "3 cloves",
        "c": 16.3
      },
      {
        "s": "1 clove",
        "c": 5.43
      },
      {
        "s": "1 tsp",
        "c": 5.07
      }
    ]
  },
  {
    "i": 6356,
    "n": "Cucumber, peeled, raw",
    "ms": [
      {
        "s": "1 cup, pared, chopped",
        "c": 18.6
      },
      {
        "s": "1 medium",
        "c": 28.1
      },
      {
        "s": "1 stick (4 long)",
        "c": 1.26
      },
      {
        "s": "1 small (6-3/8 long)",
        "c": 22.1
      },
      {
        "s": "1 large (8-1/4 long)",
        "c": 39.2
      },
      {
        "s": "1 cup, sliced",
        "c": 16.7
      },
      {
        "s": "1 slice",
        "c": 0.98
      }
    ]
  },
  {
    "i": 6357,
    "n": "Dandelion greens, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 103
      }
    ]
  },
  {
    "i": 6360,
    "n": "Cowpeas, leafy tips, raw",
    "ms": [
      {
        "s": "1 leaf",
        "c": 1.89
      },
      {
        "s": "1 cup, chopped",
        "c": 22.7
      }
    ]
  },
  {
    "i": 6361,
    "n": "Cowpeas, Young Pods With Seeds, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 52.2
      }
    ]
  },
  {
    "i": 6362,
    "n": "Cornsalad, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 21.3
      }
    ]
  },
  {
    "i": 6365,
    "n": "Cowpeas (blackeyes), immature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 183
      }
    ]
  },
  {
    "i": 6366,
    "n": "Yardlong bean, raw",
    "ms": [
      {
        "s": "1 pod",
        "c": 6
      },
      {
        "s": "1 cup slices",
        "c": 45.5
      }
    ]
  },
  {
    "i": 6370,
    "n": "Beans, kidney, mature seeds, sprouted, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 31.3
      }
    ]
  },
  {
    "i": 6372,
    "n": "Bamboo shoots, raw",
    "ms": [
      {
        "s": "0.5 cup (1/2 pieces)",
        "c": 9.88
      },
      {
        "s": "1 cup (1/2 slices)",
        "c": 19.6
      }
    ]
  },
  {
    "i": 6375,
    "n": "Artichokes, (globe or french), raw",
    "ms": [
      {
        "s": "1 artichoke, large",
        "c": 71.3
      },
      {
        "s": "1 artichoke, medium",
        "c": 56.3
      }
    ]
  },
  {
    "i": 6380,
    "n": "Amaranth Leaves, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 276
      }
    ]
  },
  {
    "i": 6381,
    "n": "Pork, fresh, loin, country-style ribs, separable lean and fat, boneless, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 11
      },
      {
        "s": "1 rack",
        "c": 17.9
      }
    ]
  },
  {
    "i": 6382,
    "n": "Pork, fresh, loin, country-style ribs, separable lean and fat, bone-in, cooked, broiled",
    "ms": [
      {
        "s": "1 rack",
        "c": 69.5
      },
      {
        "s": "3 oz",
        "c": 48.4
      }
    ]
  },
  {
    "i": 6384,
    "n": "Arrowhead, raw",
    "ms": [
      {
        "s": "1 large",
        "c": 2.5
      },
      {
        "s": "1 medium",
        "c": 1.2
      }
    ]
  },
  {
    "i": 6388,
    "n": "Pork, fresh, loin, blade (chops), boneless, separable lean only, boneless, cooked, broiled",
    "ms": [
      {
        "s": "1 chop",
        "c": 9.17
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 6389,
    "n": "Pork, ground, 72% lean / 28% fat, cooked, crumbles",
    "ms": [
      {
        "s": "4 oz",
        "c": 22.6
      }
    ]
  },
  {
    "i": 6390,
    "n": "Pork, fresh, loin, blade (chops or roasts), boneless, separable lean only, raw",
    "ms": [
      {
        "s": "1 chop",
        "c": 10.6
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 6391,
    "n": "Pork, ground, 96% lean / 4% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 6392,
    "n": "Pork, ground, 96% lean / 4% fat, cooked, crumbles",
    "ms": [
      {
        "s": "3 oz grilled patties",
        "c": 16.2
      }
    ]
  },
  {
    "i": 6393,
    "n": "Pork, ground, 84% lean / 16% fat, cooked, crumbles",
    "ms": [
      {
        "s": "3 oz grilled patties",
        "c": 17
      }
    ]
  },
  {
    "i": 6394,
    "n": "Pork, Leg Cap Steak, boneless, separable lean and fat, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 16.2
      },
      {
        "s": "4 oz",
        "c": 7.91
      }
    ]
  },
  {
    "i": 6396,
    "n": "Pork, shoulder, petite tender, boneless, separable lean and fat, cooked, broiled",
    "ms": [
      {
        "s": "1 piece",
        "c": 7.36
      }
    ]
  },
  {
    "i": 6398,
    "n": "Pork, Shoulder breast, boneless, separable lean and fat, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 30.1
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 6399,
    "n": "Pork, fresh, loin, top loin (chops), boneless, separable lean and fat, with added solution, raw",
    "ms": [
      {
        "s": "1 chop",
        "c": 13.1
      }
    ]
  },
  {
    "i": 6400,
    "n": "Pork, fresh, loin, tenderloin, separable lean and fat, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 26.8
      }
    ]
  },
  {
    "i": 6405,
    "n": "Pork, cured, ham, slice, bone-in, separable lean and fat, unheated",
    "ms": [
      {
        "s": "1 slice",
        "c": 51
      },
      {
        "s": "3 oz (3 oz)",
        "c": 10.2
      }
    ]
  },
  {
    "i": 6407,
    "n": "Pork, fresh, composite of separable fat, with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 24.9
      },
      {
        "s": "1 lb",
        "c": 99.7
      }
    ]
  },
  {
    "i": 6408,
    "n": "Pork, cured, ham, rump, bone-in, separable lean only, heated, roasted",
    "ms": [
      {
        "s": "1 roast rump",
        "c": 230
      },
      {
        "s": "3 oz (3 oz)",
        "c": 6.8
      }
    ]
  },
  {
    "i": 6409,
    "n": "Pork, Cured, Ham, Shank, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz (3 oz)",
        "c": 5.95
      },
      {
        "s": "1 roast shank",
        "c": 196
      }
    ]
  },
  {
    "i": 6410,
    "n": "Pork, Cured, Ham, Rump, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 lb",
        "c": 31.8
      }
    ]
  },
  {
    "i": 6413,
    "n": "Pork, Cured, Ham With Natural Juices, Slice, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz (3 oz)",
        "c": 10.2
      },
      {
        "s": "1 slice",
        "c": 53.4
      }
    ]
  },
  {
    "i": 6414,
    "n": "Pork, Cured, Ham With Natural Juices, Rump, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz (3 oz)",
        "c": 8.5
      },
      {
        "s": "1 roast rump",
        "c": 267
      }
    ]
  },
  {
    "i": 6419,
    "n": "Pork, cured, ham and water product, rump, bone-in, separable lean and fat, unheated",
    "ms": [
      {
        "s": "1 lb rump",
        "c": 40.8
      },
      {
        "s": "3 oz rump",
        "c": 7.65
      }
    ]
  },
  {
    "i": 6421,
    "n": "Pork, cured, ham and water product, shank, bone-in, separable lean and fat, unheated",
    "ms": [
      {
        "s": "3 oz shank",
        "c": 5.1
      },
      {
        "s": "1 lb shank",
        "c": 27.2
      }
    ]
  },
  {
    "i": 6423,
    "n": "Pork, cured, ham and water product, slice, bone-in, separable lean and fat, unheated",
    "ms": [
      {
        "s": "1 lb",
        "c": 36.3
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 6424,
    "n": "Pork, cured, ham, slice, bone-in, separable lean only, heated, pan-broil",
    "ms": [
      {
        "s": "3 oz (3 oz)",
        "c": 12.8
      },
      {
        "s": "1 slice",
        "c": 54.9
      }
    ]
  },
  {
    "i": 6425,
    "n": "Pork, pickled pork hocks",
    "ms": [
      {
        "s": "3 oz",
        "c": 22.2
      }
    ]
  },
  {
    "i": 6426,
    "n": "Pork, Cured, Ham With Natural Juices, Whole, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz whole",
        "c": 5.1
      },
      {
        "s": "1 lb whole",
        "c": 27.2
      }
    ]
  },
  {
    "i": 6427,
    "n": "Pork, cured, ham, separable fat, boneless, unheated",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 6428,
    "n": "Pork, cured, ham -- water added, slice, bone-in, separable lean only, unheated",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 6431,
    "n": "Pork, cured, ham, separable fat, boneless, heated",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6432,
    "n": "Pork, cured, ham and water product, shank, bone-in, unheated, separable lean only",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 6434,
    "n": "Pork, cured, ham and water product, shank, bone-in, separable lean only, heated, roasted",
    "ms": [
      {
        "s": "1 roast shank",
        "c": 288
      },
      {
        "s": "3 oz (3 oz)",
        "c": 7.65
      }
    ]
  },
  {
    "i": 6438,
    "n": "Beets, cooked, boiled, drained",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 13.6
      },
      {
        "s": "2 beets (2 dia, sphere)",
        "c": 16
      }
    ]
  },
  {
    "i": 6439,
    "n": "Beets, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 21.8
      },
      {
        "s": "1 beet (2 dia)",
        "c": 13.1
      }
    ]
  },
  {
    "i": 6443,
    "n": "Mung Beans, Mature Seeds, Sprouted, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.9
      }
    ]
  },
  {
    "i": 6446,
    "n": "Mung beans, mature seeds, sprouted, cooked, stir-fried",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.1
      }
    ]
  },
  {
    "i": 6447,
    "n": "Beans, navy, mature seeds, sprouted, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 15.6
      }
    ]
  },
  {
    "i": 6449,
    "n": "Plantains, Yellow*",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 4.44
      },
      {
        "s": "1 plantain",
        "c": 8.1
      }
    ]
  },
  {
    "i": 6450,
    "n": "Pitanga, (surinam-cherry), raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 0.63
      },
      {
        "s": "1 cup",
        "c": 15.6
      }
    ]
  },
  {
    "i": 6451,
    "n": "Pineapple juice, frozen concentrate, unsweetened, diluted with 3 volume water",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.5
      },
      {
        "s": "1 fl oz",
        "c": 4.06
      }
    ]
  },
  {
    "i": 6455,
    "n": "Pomegranates, raw",
    "ms": [
      {
        "s": "0.5 cup arils (seed/juice sacs)",
        "c": 8.7
      },
      {
        "s": "1 pomegranate (4 dia)",
        "c": 28.2
      }
    ]
  },
  {
    "i": 6456,
    "n": "Pineapple, raw, all varieties",
    "ms": [
      {
        "s": "1 slice (3-1/2 dia x 3/4 thick)",
        "c": 10.9
      },
      {
        "s": "1 cup, chunks",
        "c": 21.4
      },
      {
        "s": "1 fruit",
        "c": 118
      },
      {
        "s": "1 slice (4-2/3 dia x 3/4 thick)",
        "c": 21.6
      },
      {
        "s": "1 slice, thin (3-1/2 dia x 1/2 thick)",
        "c": 7.28
      }
    ]
  },
  {
    "i": 6458,
    "n": "Pears, dried, sulfured, stewed, with added sugar",
    "ms": [
      {
        "s": "1 cup, halves",
        "c": 42
      }
    ]
  },
  {
    "i": 6459,
    "n": "Pineapple, canned, juice pack, solids and liquids",
    "ms": [
      {
        "s": "1 slice or ring (3 dia) with liquid",
        "c": 6.58
      },
      {
        "s": "1 cup, crushed, sliced, or chunks",
        "c": 34.9
      }
    ]
  },
  {
    "i": 6463,
    "n": "Pears, dried, sulfured, stewed, without added sugar",
    "ms": [
      {
        "s": "1 cup, halves",
        "c": 40.8
      }
    ]
  },
  {
    "i": 6465,
    "n": "Pears, dried, sulfured, uncooked",
    "ms": [
      {
        "s": "1 half",
        "c": 6.12
      },
      {
        "s": "1 cup, halves",
        "c": 61.2
      },
      {
        "s": "10 halves",
        "c": 59.5
      }
    ]
  },
  {
    "i": 6466,
    "n": "Pears, raw",
    "ms": [
      {
        "s": "1 cup, slices",
        "c": 12.6
      },
      {
        "s": "1 small",
        "c": 13.3
      },
      {
        "s": "1 cup, cubes",
        "c": 14.5
      },
      {
        "s": "1 NLEA serving",
        "c": 14.9
      },
      {
        "s": "1 large",
        "c": 20.7
      },
      {
        "s": "1 medium",
        "c": 16
      }
    ]
  },
  {
    "i": 6469,
    "n": "Peaches, dried, sulfured, stewed, with added sugar",
    "ms": [
      {
        "s": "1 cup",
        "c": 21.6
      }
    ]
  },
  {
    "i": 6474,
    "n": "Passion-fruit juice, yellow, raw",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.24
      },
      {
        "s": "1 cup",
        "c": 9.88
      }
    ]
  },
  {
    "i": 6475,
    "n": "Passion-fruit, (granadilla), purple, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 28.3
      },
      {
        "s": "1 fruit without refuse",
        "c": 2.16
      }
    ]
  },
  {
    "i": 6476,
    "n": "Tangerines, (mandarin oranges), raw",
    "ms": [
      {
        "s": "1 NLEA serving",
        "c": 40.3
      },
      {
        "s": "1 cup, sections",
        "c": 72.2
      },
      {
        "s": "1 large (2-3/4 dia)",
        "c": 44.4
      },
      {
        "s": "1 small (2-1/4 dia)",
        "c": 28.1
      },
      {
        "s": "1 medium (2-1/2 dia)",
        "c": 32.6
      }
    ]
  },
  {
    "i": 6477,
    "n": "Passion-fruit juice, purple, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 9.88
      },
      {
        "s": "1 fl oz",
        "c": 1.24
      }
    ]
  },
  {
    "i": 6478,
    "n": "Tangerines, (mandarin oranges), canned, juice pack",
    "ms": [
      {
        "s": "1 cup",
        "c": 27.4
      }
    ]
  },
  {
    "i": 6479,
    "n": "Orange Juice*",
    "ms": [
      {
        "s": "1 cup",
        "c": 27.4
      },
      {
        "s": "1 fl oz",
        "c": 3.42
      }
    ]
  },
  {
    "i": 6480,
    "n": "Orange juice, chilled, includes from concentrate, with added calcium and vitamin D",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 43.5
      },
      {
        "s": "1 cup",
        "c": 349
      }
    ]
  },
  {
    "i": 6481,
    "n": "Orange juice, frozen concentrate, unsweetened, diluted with 3 volume water",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.73
      },
      {
        "s": "1 cup",
        "c": 29.9
      }
    ]
  },
  {
    "i": 6482,
    "n": "Orange peel, raw",
    "ms": [
      {
        "s": "1 tsp",
        "c": 3.22
      },
      {
        "s": "1 tbsp",
        "c": 9.66
      }
    ]
  },
  {
    "i": 6483,
    "n": "Orange-grapefruit juice, canned or bottled, unsweetened",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.47
      },
      {
        "s": "1 cup",
        "c": 19.8
      }
    ]
  },
  {
    "i": 6484,
    "n": "Orange juice, canned, unsweetened",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.11
      },
      {
        "s": "1 cup",
        "c": 24.9
      },
      {
        "s": "1 drink box (8.45 fl oz)",
        "c": 26.3
      }
    ]
  },
  {
    "i": 6488,
    "n": "Oranges, raw, all commercial varieties",
    "ms": [
      {
        "s": "1 fruit (2-5/8 dia)",
        "c": 52.4
      },
      {
        "s": "1 cup, sections",
        "c": 72
      },
      {
        "s": "1 large (3-1/16 dia)",
        "c": 73.6
      },
      {
        "s": "1 small (2-3/8 dia)",
        "c": 38.4
      }
    ]
  },
  {
    "i": 6490,
    "n": "Longans, raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 0.032
      }
    ]
  },
  {
    "i": 6492,
    "n": "Melons, Cantaloupe, Raw*",
    "ms": [
      {
        "s": "10 cantaloupe balls",
        "c": 12.4
      },
      {
        "s": "1 wedge, small (1/8 of small melon)",
        "c": 4.95
      },
      {
        "s": "1 cup, balls",
        "c": 15.9
      },
      {
        "s": "1 melon, medium (about 5 dia)",
        "c": 49.7
      },
      {
        "s": "1 NLEA serving",
        "c": 12.1
      },
      {
        "s": "1 melon, large (about 6-1/2 dia)",
        "c": 73.3
      },
      {
        "s": "1 cup, diced",
        "c": 14
      },
      {
        "s": "1 cup, cubes",
        "c": 14.4
      },
      {
        "s": "1 wedge, medium (1/8 of medium melon)",
        "c": 6.21
      },
      {
        "s": "1 wedge, large (1/8 of large melon)",
        "c": 9.18
      },
      {
        "s": "1 melon, small (about 4-1/4 dia)",
        "c": 39.7
      }
    ]
  },
  {
    "i": 6493,
    "n": "Mango, dried, sweetened",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 6495,
    "n": "Melons, casaba, raw",
    "ms": [
      {
        "s": "0.1 fruit",
        "c": 18
      },
      {
        "s": "1 cup, cubes",
        "c": 18.7
      },
      {
        "s": "1 melon",
        "c": 180
      }
    ]
  },
  {
    "i": 6496,
    "n": "Litchis, dried",
    "ms": [
      {
        "s": "1 fruit",
        "c": 0.825
      }
    ]
  },
  {
    "i": 6497,
    "n": "Litchis, raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 0.48
      },
      {
        "s": "1 cup",
        "c": 9.5
      }
    ]
  },
  {
    "i": 6498,
    "n": "Cheese, pasteurized process, American, low fat",
    "ms": [
      {
        "s": "1 slice (3/4 oz)",
        "c": 144
      },
      {
        "s": "1 cup, diced",
        "c": 958
      },
      {
        "s": "1 cup, shredded",
        "c": 773
      },
      {
        "s": "1 cubic inch",
        "c": 123
      }
    ]
  },
  {
    "i": 6499,
    "n": "Cheese spread, cream cheese base",
    "ms": [
      {
        "s": "1 cup",
        "c": 170
      },
      {
        "s": "1 oz",
        "c": 20.1
      }
    ]
  },
  {
    "i": 6500,
    "n": "Soybean, curd cheese",
    "ms": [
      {
        "s": "1 cup",
        "c": 423
      }
    ]
  },
  {
    "i": 6503,
    "n": "Pork, oriental style, dehydrated",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.2
      }
    ]
  },
  {
    "i": 6506,
    "n": "Cereals ready-to-eat, wheat and bran, presweetened with nuts and fruits",
    "ms": [
      {
        "s": "1 cup (1 NLEA serving)",
        "c": 23.6
      }
    ]
  },
  {
    "i": 6507,
    "n": "Cheese, cottage, with vegetables",
    "ms": [
      {
        "s": "4 oz",
        "c": 63.3
      },
      {
        "s": "1 cup",
        "c": 127
      }
    ]
  },
  {
    "i": 6510,
    "n": "Sandwich spread, meatless",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 6.6
      }
    ]
  },
  {
    "i": 6511,
    "n": "Meatballs, meatless",
    "ms": [
      {
        "s": "1 cup",
        "c": 36
      }
    ]
  },
  {
    "i": 6512,
    "n": "Alcoholic beverage, wine, cooking",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.61
      },
      {
        "s": "1 tsp",
        "c": 0.441
      }
    ]
  },
  {
    "i": 6513,
    "n": "Beverage, instant breakfast powder, chocolate, not reconstituted",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 21.1
      },
      {
        "s": "1 envelope",
        "c": 105
      }
    ]
  },
  {
    "i": 6514,
    "n": "Alcoholic beverage, wine, light",
    "ms": [
      {
        "s": "1 serving 5 fl oz",
        "c": 13.3
      },
      {
        "s": "1 fl oz",
        "c": 2.66
      }
    ]
  },
  {
    "i": 6515,
    "n": "Vegetarian fillets",
    "ms": [
      {
        "s": "1 fillet",
        "c": 80.8
      }
    ]
  },
  {
    "i": 6516,
    "n": "Sweeteners, tabletop, saccharin (sodium saccharin)",
    "ms": [
      {
        "s": "1 serving 1 packet",
        "c": 0
      },
      {
        "s": "1 serving 1 packet SUGAR TWIN",
        "c": 0
      }
    ]
  },
  {
    "i": 6517,
    "n": "Breakfast bars, oats, sugar, raisins, coconut (include granola bar)",
    "ms": [
      {
        "s": "1 bar",
        "c": 25.8
      }
    ]
  },
  {
    "i": 6518,
    "n": "Candies, gum drops, no sugar or low calorie (sorbitol)",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 piece",
        "c": 0
      }
    ]
  },
  {
    "i": 6519,
    "n": "Luncheon slices, meatless",
    "ms": [
      {
        "s": "1 slice, thin",
        "c": 5.74
      }
    ]
  },
  {
    "i": 6520,
    "n": "Candies, nougat, with almonds",
    "ms": [
      {
        "s": "1 piece",
        "c": 4.48
      }
    ]
  },
  {
    "i": 6521,
    "n": "Beans, chili, barbecue, ranch style, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 78.4
      }
    ]
  },
  {
    "i": 6522,
    "n": "Pie fillings, cherry, low calorie",
    "ms": [
      {
        "s": "1 serving",
        "c": 9.35
      },
      {
        "s": "1 cup",
        "c": 29
      }
    ]
  },
  {
    "i": 6523,
    "n": "Pretzels, Soft*",
    "ms": [
      {
        "s": "1 small",
        "c": 14.3
      },
      {
        "s": "1 medium",
        "c": 26.4
      },
      {
        "s": "1 large",
        "c": 32.9
      }
    ]
  },
  {
    "i": 6525,
    "n": "Candies, chocolate covered, caramel with nuts",
    "ms": [
      {
        "s": "1 piece",
        "c": 10.9
      }
    ]
  },
  {
    "i": 6526,
    "n": "Salad dressing, green goddess, regular",
    "ms": [
      {
        "s": "1 cup",
        "c": 83.3
      },
      {
        "s": "1 tbsp",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6527,
    "n": "Salad dressing, coleslaw",
    "ms": [
      {
        "s": "1 cup",
        "c": 26
      },
      {
        "s": "1 tbsp",
        "c": 1.71
      }
    ]
  },
  {
    "i": 6528,
    "n": "Jams and preserves, no sugar (with sodium saccharin), any flavor",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.26
      },
      {
        "s": "1 cup",
        "c": 20.2
      }
    ]
  },
  {
    "i": 6529,
    "n": "Salad dressing, caesar dressing, regular",
    "ms": [
      {
        "s": "1 cup",
        "c": 113
      },
      {
        "s": "1 serving (2 tbsp)",
        "c": 14.4
      },
      {
        "s": "1 tbsp",
        "c": 7.06
      }
    ]
  },
  {
    "i": 6531,
    "n": "Margarine-like, butter-margarine blend, 80% fat, stick, without salt",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 3.92
      }
    ]
  },
  {
    "i": 6533,
    "n": "Margarine-like, vegetable oil-butter spread, reduced calorie, tub, with salt",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 3.92
      }
    ]
  },
  {
    "i": 6538,
    "n": "Beverages, Orange juice drink",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 0.622
      },
      {
        "s": "1 cup",
        "c": 4.98
      },
      {
        "s": "1 drink box (8.45 fl oz)",
        "c": 5.26
      }
    ]
  },
  {
    "i": 6541,
    "n": "Gums, seed gums (includes locust bean, guar)",
    "ms": [
      {
        "s": "1 oz",
        "c": 83.3
      }
    ]
  },
  {
    "i": 6542,
    "n": "Snacks, potato chips, white, restructured, baked",
    "ms": [
      {
        "s": "1 cup",
        "c": 42.5
      },
      {
        "s": "10 chips",
        "c": 15
      }
    ]
  },
  {
    "i": 6544,
    "n": "Cereals ready-to-eat, frosted oat cereal with marshmallows",
    "ms": [
      {
        "s": "0.75 cup (1 NLEA serving)",
        "c": 99.9
      }
    ]
  },
  {
    "i": 6546,
    "n": "Restaurant, Mexican, cheese quesadilla",
    "ms": [
      {
        "s": "1 serving serving size varied on diameter and count of quesadila",
        "c": 882
      },
      {
        "s": "3 quesadilla 5-6 inch diameter",
        "c": 1200
      },
      {
        "s": "1 quesadilla 8-10 inch diameter",
        "c": 834
      }
    ]
  },
  {
    "i": 6547,
    "n": "Restaurant, Italian, cheese ravioli with marinara sauce",
    "ms": [
      {
        "s": "1 serving serving size varied by diameter and count of raviloi",
        "c": 512
      }
    ]
  },
  {
    "i": 6586,
    "n": "Agave, dried (Southwest)",
    "ms": [
      {
        "s": "100 g",
        "c": 770
      }
    ]
  },
  {
    "i": 6615,
    "n": "Turnover, filled with egg, meat and cheese, frozen",
    "ms": [
      {
        "s": "1 piece turnover 1 serving",
        "c": 100
      }
    ]
  },
  {
    "i": 6620,
    "n": "Rice mix, white and wild, flavored, unprepared",
    "ms": [
      {
        "s": "1 cup",
        "c": 66.8
      }
    ]
  },
  {
    "i": 6624,
    "n": "Pasta mix, Italian four cheese lasagna, unprepared",
    "ms": [
      {
        "s": "1 package",
        "c": 64.4
      },
      {
        "s": "1 packet",
        "c": 23.1
      }
    ]
  },
  {
    "i": 6625,
    "n": "Turnover, meat- and cheese-filled, tomato-based sauce, reduced fat, frozen",
    "ms": [
      {
        "s": "1 piece turnover 1 serving",
        "c": 250
      }
    ]
  },
  {
    "i": 6626,
    "n": "Yellow rice with seasoning, dry packet mix, unprepared",
    "ms": [
      {
        "s": "1 serving (2 oz)",
        "c": 20
      }
    ]
  },
  {
    "i": 6627,
    "n": "Pasta mix, classic cheeseburger macaroni, unprepared",
    "ms": [
      {
        "s": "1 packet",
        "c": 14.3
      },
      {
        "s": "1 package",
        "c": 34.4
      }
    ]
  },
  {
    "i": 6629,
    "n": "Pasta mix, classic beef, unprepared",
    "ms": [
      {
        "s": "1 package",
        "c": 25.6
      },
      {
        "s": "1 packet",
        "c": 9.24
      }
    ]
  },
  {
    "i": 6630,
    "n": "Pasta mix, Italian lasagna, unprepared",
    "ms": [
      {
        "s": "1 package",
        "c": 73.3
      },
      {
        "s": "1 packet",
        "c": 41.1
      }
    ]
  },
  {
    "i": 6632,
    "n": "Rice and vermicelli mix, rice pilaf flavor, unprepared",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.97
      },
      {
        "s": "0.33 cup",
        "c": 56.4
      }
    ]
  },
  {
    "i": 6634,
    "n": "Rice and vermicelli mix, beef flavor, unprepared",
    "ms": [
      {
        "s": "0.33 cup",
        "c": 19.5
      },
      {
        "s": "1 tbsp",
        "c": 2.88
      }
    ]
  },
  {
    "i": 6637,
    "n": "Wheat flour, whole-grain, soft wheat",
    "ms": [
      {
        "s": "100 g",
        "c": 33
      }
    ]
  },
  {
    "i": 6640,
    "n": "Sorghum flour, whole-grain",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.5
      }
    ]
  },
  {
    "i": 6642,
    "n": "Wheat flour, white (industrial), 11.5% protein, unbleached, enriched",
    "ms": [
      {
        "s": "100 g",
        "c": 20
      }
    ]
  },
  {
    "i": 6643,
    "n": "Wheat Flour, White (Industrial), 13% Protein, Bleached*",
    "ms": [
      {
        "s": "100 g",
        "c": 24
      }
    ]
  },
  {
    "i": 6644,
    "n": "Wheat Flour, White (Industrial), 11.5% Protein, Bleached*",
    "ms": [
      {
        "s": "100 g",
        "c": 20
      }
    ]
  },
  {
    "i": 6645,
    "n": "Wheat flour, white (industrial), 10% protein, unbleached, enriched",
    "ms": [
      {
        "s": "100 g",
        "c": 20
      }
    ]
  },
  {
    "i": 6646,
    "n": "Spaghetti, protein-fortified, cooked, enriched (n x 6.25)",
    "ms": [
      {
        "s": "1 cup",
        "c": 14
      }
    ]
  },
  {
    "i": 6648,
    "n": "Wheat flour, white, all-purpose, enriched, unbleached",
    "ms": [
      {
        "s": "1 cup",
        "c": 18.8
      }
    ]
  },
  {
    "i": 6650,
    "n": "Spaghetti, protein-fortified, dry, enriched (n x 6.25)",
    "ms": [
      {
        "s": "2 oz",
        "c": 22.2
      }
    ]
  },
  {
    "i": 6652,
    "n": "Rice, white, short-grain, raw, unenriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 6
      }
    ]
  },
  {
    "i": 6655,
    "n": "Cornmeal, Degermed*",
    "ms": [
      {
        "s": "1 cup",
        "c": 4.71
      }
    ]
  },
  {
    "i": 6657,
    "n": "Corn flour, whole-grain, blue (harina de maiz morado)",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.345
      }
    ]
  },
  {
    "i": 6658,
    "n": "Cornmeal, white, self-rising, bolted, plain, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 440
      }
    ]
  },
  {
    "i": 6660,
    "n": "Cornmeal, white, self-rising, degermed, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 483
      }
    ]
  },
  {
    "i": 6661,
    "n": "Cornmeal, white, self-rising, bolted, with wheat flour added, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 508
      }
    ]
  },
  {
    "i": 6662,
    "n": "Corn grain, white",
    "ms": [
      {
        "s": "1 cup",
        "c": 11.6
      }
    ]
  },
  {
    "i": 6663,
    "n": "Noodles, egg, unenriched, cooked, without added salt",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.2
      }
    ]
  },
  {
    "i": 6664,
    "n": "Teff, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 123
      }
    ]
  },
  {
    "i": 6665,
    "n": "Pasta, whole grain, 51% whole wheat, remaining unenriched semolina, dry",
    "ms": [
      {
        "s": "1 cup spaghetti",
        "c": 24.6
      },
      {
        "s": "1 cup rotini",
        "c": 25.9
      },
      {
        "s": "1 cup farfalle",
        "c": 21.9
      },
      {
        "s": "1 cup penne",
        "c": 25.6
      },
      {
        "s": "1 cup elbows",
        "c": 32.9
      },
      {
        "s": "1 cup lasagne",
        "c": 24.3
      },
      {
        "s": "1 cup shells",
        "c": 17.3
      }
    ]
  },
  {
    "i": 6667,
    "n": "Quinoa, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 31.4
      }
    ]
  },
  {
    "i": 6668,
    "n": "Pasta, whole grain, 51% whole wheat, remaining unenriched semolina, cooked",
    "ms": [
      {
        "s": "1 cup spaghetti not packed",
        "c": 13.9
      },
      {
        "s": "1 cup lasagne",
        "c": 13.9
      },
      {
        "s": "1 cup penne",
        "c": 11.6
      },
      {
        "s": "1 cup shells",
        "c": 12.6
      },
      {
        "s": "1 cup spaghetti packed",
        "c": 18.1
      },
      {
        "s": "1 cup elbows not packed",
        "c": 14
      },
      {
        "s": "1 cup rotini",
        "c": 12.8
      },
      {
        "s": "1 cup farfalle",
        "c": 12.8
      }
    ]
  },
  {
    "i": 6669,
    "n": "Spaghetti, spinach, dry",
    "ms": [
      {
        "s": "2 oz",
        "c": 33.1
      }
    ]
  },
  {
    "i": 6670,
    "n": "Spaghetti, spinach, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 42
      }
    ]
  },
  {
    "i": 6671,
    "n": "Wheat flours, bread, unenriched",
    "ms": [
      {
        "s": "1 cup unsifted, dipped",
        "c": 20.6
      }
    ]
  },
  {
    "i": 6672,
    "n": "Noodles, japanese, somen, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.1
      }
    ]
  },
  {
    "i": 6673,
    "n": "Rice noodles, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 7.04
      }
    ]
  },
  {
    "i": 6675,
    "n": "Noodles, chinese, chow mein",
    "ms": [
      {
        "s": "1.5 oz",
        "c": 0
      },
      {
        "s": "0.5 cup dry",
        "c": 0
      }
    ]
  },
  {
    "i": 6676,
    "n": "Macaroni, vegetable, enriched, cooked",
    "ms": [
      {
        "s": "1 cup spiral shaped",
        "c": 14.7
      }
    ]
  },
  {
    "i": 6677,
    "n": "Noodles, japanese, soba, dry",
    "ms": [
      {
        "s": "2 oz",
        "c": 20
      }
    ]
  },
  {
    "i": 6678,
    "n": "Noodles, japanese, somen, dry",
    "ms": [
      {
        "s": "2 oz",
        "c": 13.1
      }
    ]
  },
  {
    "i": 6679,
    "n": "Noodles, japanese, soba, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 4.56
      }
    ]
  },
  {
    "i": 6680,
    "n": "Pasta, homemade, made without egg, cooked",
    "ms": [
      {
        "s": "2 oz",
        "c": 3.42
      }
    ]
  },
  {
    "i": 6681,
    "n": "Macaroni, vegetable, enriched, dry",
    "ms": [
      {
        "s": "2 oz",
        "c": 19.4
      },
      {
        "s": "1 cup spiral shaped",
        "c": 28.6
      }
    ]
  },
  {
    "i": 6682,
    "n": "Rice flour, brown",
    "ms": [
      {
        "s": "1 cup",
        "c": 17.4
      }
    ]
  },
  {
    "i": 6683,
    "n": "Wheat flour, white, bread, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 20.6
      }
    ]
  },
  {
    "i": 6684,
    "n": "Pasta, homemade, made with egg, cooked",
    "ms": [
      {
        "s": "2 oz",
        "c": 5.7
      }
    ]
  },
  {
    "i": 6685,
    "n": "Pasta, gluten-free, corn, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 1.4
      }
    ]
  },
  {
    "i": 6686,
    "n": "Pasta, gluten-free, corn, dry",
    "ms": [
      {
        "s": "2 oz",
        "c": 2.28
      },
      {
        "s": "1 cup",
        "c": 4.2
      }
    ]
  },
  {
    "i": 6688,
    "n": "Wheat, hard red winter",
    "ms": [
      {
        "s": "1 cup",
        "c": 55.7
      }
    ]
  },
  {
    "i": 6689,
    "n": "Wheat flour, white, all-purpose, enriched, bleached",
    "ms": [
      {
        "s": "1 cup",
        "c": 18.8
      }
    ]
  },
  {
    "i": 6691,
    "n": "Wheat flour, white, all-purpose, self-rising, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 422
      }
    ]
  },
  {
    "i": 6692,
    "n": "Wheat, soft red winter",
    "ms": [
      {
        "s": "1 cup",
        "c": 45.4
      }
    ]
  },
  {
    "i": 6693,
    "n": "Wheat germ, crude",
    "ms": [
      {
        "s": "1 cup",
        "c": 44.8
      }
    ]
  },
  {
    "i": 6694,
    "n": "Rye flour, medium",
    "ms": [
      {
        "s": "1 cup",
        "c": 24.5
      }
    ]
  },
  {
    "i": 6695,
    "n": "Wheat, hard red spring",
    "ms": [
      {
        "s": "1 cup",
        "c": 48
      }
    ]
  },
  {
    "i": 6696,
    "n": "Rye grain",
    "ms": [
      {
        "s": "1 cup",
        "c": 40.6
      }
    ]
  },
  {
    "i": 6697,
    "n": "Triticale flour, whole-grain",
    "ms": [
      {
        "s": "1 cup",
        "c": 45.5
      }
    ]
  },
  {
    "i": 6698,
    "n": "Rye flour, dark",
    "ms": [
      {
        "s": "1 cup",
        "c": 47.4
      }
    ]
  },
  {
    "i": 6699,
    "n": "Rye flour, light",
    "ms": [
      {
        "s": "1 cup",
        "c": 13.3
      }
    ]
  },
  {
    "i": 6705,
    "n": "Rice, white, glutinous, unenriched, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 20.4
      }
    ]
  },
  {
    "i": 6706,
    "n": "Rice, white, short-grain, enriched, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 6
      }
    ]
  },
  {
    "i": 6708,
    "n": "Oat bran, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 54.5
      }
    ]
  },
  {
    "i": 6711,
    "n": "Quinoa, uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 79.9
      }
    ]
  },
  {
    "i": 6713,
    "n": "Puddings, banana, dry mix, instant, with added oil",
    "ms": [
      {
        "s": "1 package (3.5 oz)",
        "c": 5.94
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 1.5
      }
    ]
  },
  {
    "i": 6715,
    "n": "Snacks, potato chips, made from dried potatoes, fat-free, made with olestra",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.67
      }
    ]
  },
  {
    "i": 6716,
    "n": "Cornmeal, yellow, self-rising, bolted, plain, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 440
      }
    ]
  },
  {
    "i": 6717,
    "n": "Cornmeal, yellow, self-rising, degermed, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 483
      }
    ]
  },
  {
    "i": 6718,
    "n": "Snacks, taro chips",
    "ms": [
      {
        "s": "10 chips",
        "c": 13.8
      },
      {
        "s": "1 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 6719,
    "n": "Cornmeal, yellow, self-rising, bolted, with wheat flour added, enriched",
    "ms": [
      {
        "s": "1 cup",
        "c": 508
      }
    ]
  },
  {
    "i": 6720,
    "n": "Tortilla chips, low fat, baked without fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 45.1
      }
    ]
  },
  {
    "i": 6721,
    "n": "Snacks, granola bar, fruit-filled, nonfat",
    "ms": [
      {
        "s": "100 g",
        "c": 3
      }
    ]
  },
  {
    "i": 6722,
    "n": "Cheese puffs and twists, corn based, baked, low fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 101
      }
    ]
  },
  {
    "i": 6724,
    "n": "Snacks, tortilla chips, low fat, made with olestra, nacho cheese",
    "ms": [
      {
        "s": "1 oz",
        "c": 36.3
      }
    ]
  },
  {
    "i": 6725,
    "n": "Snacks, rice cakes, brown rice, rye",
    "ms": [
      {
        "s": "2 cakes",
        "c": 3.78
      },
      {
        "s": "1 cake",
        "c": 1.89
      }
    ]
  },
  {
    "i": 6726,
    "n": "Snacks, potato sticks",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 3.24
      },
      {
        "s": "1 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6727,
    "n": "Snacks, tortilla chips, nacho-flavor, reduced fat",
    "ms": [
      {
        "s": "1 bag (6 oz)",
        "c": 270
      },
      {
        "s": "1 oz",
        "c": 45.1
      }
    ]
  },
  {
    "i": 6729,
    "n": "Snacks, corn cakes",
    "ms": [
      {
        "s": "1 cake",
        "c": 1.71
      },
      {
        "s": "2 cakes",
        "c": 3.42
      }
    ]
  },
  {
    "i": 6733,
    "n": "Snacks, banana chips",
    "ms": [
      {
        "s": "3 oz",
        "c": 15.3
      },
      {
        "s": "1.5 oz",
        "c": 7.56
      },
      {
        "s": "1 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6734,
    "n": "Snacks, pork skins, barbecue-flavor",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      },
      {
        "s": "0.5 oz",
        "c": 6.11
      }
    ]
  },
  {
    "i": 6735,
    "n": "Snacks, beef sticks, smoked",
    "ms": [
      {
        "s": "1 stick",
        "c": 13.6
      },
      {
        "s": "1 oz",
        "c": 19.3
      }
    ]
  },
  {
    "i": 6740,
    "n": "Syrups, corn, light",
    "ms": [
      {
        "s": "1 cup",
        "c": 44.3
      },
      {
        "s": "1 tbsp",
        "c": 2.86
      }
    ]
  },
  {
    "i": 6742,
    "n": "Syrups, table blends, corn, refiner, and sugar",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 4.6
      },
      {
        "s": "1 cup",
        "c": 72.7
      }
    ]
  },
  {
    "i": 6744,
    "n": "Toppings, butterscotch or caramel",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 20.1
      }
    ]
  },
  {
    "i": 6746,
    "n": "Syrups, table blends, pancake, with 2% maple",
    "ms": [
      {
        "s": "1 serving 1/4 cup",
        "c": 4.15
      },
      {
        "s": "1 tbsp",
        "c": 1
      },
      {
        "s": "1 cup",
        "c": 15.8
      }
    ]
  },
  {
    "i": 6747,
    "n": "Syrups, corn, dark",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.6
      },
      {
        "s": "1 cup",
        "c": 59
      }
    ]
  },
  {
    "i": 6748,
    "n": "Puddings, lemon, dry mix, regular",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 1.05
      },
      {
        "s": "1 package (3 oz)",
        "c": 4.25
      }
    ]
  },
  {
    "i": 6749,
    "n": "Pudding, lemon, dry mix, regular, prepared with sugar, egg yolk and water",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 10.2
      }
    ]
  },
  {
    "i": 6750,
    "n": "Syrups, chocolate, fudge-type",
    "ms": [
      {
        "s": "1 cup",
        "c": 149
      },
      {
        "s": "2 tbsp",
        "c": 18.6
      }
    ]
  },
  {
    "i": 6753,
    "n": "Sugars, brown",
    "ms": [
      {
        "s": "1 tsp brownulated",
        "c": 2.66
      },
      {
        "s": "1 tsp unpacked",
        "c": 2.49
      },
      {
        "s": "1 cup unpacked",
        "c": 120
      },
      {
        "s": "1 tsp packed",
        "c": 3.82
      },
      {
        "s": "1 cup packed",
        "c": 183
      }
    ]
  },
  {
    "i": 6756,
    "n": "Puddings, coconut cream, dry mix, instant",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 2
      },
      {
        "s": "1 package (3.5 oz)",
        "c": 7.92
      }
    ]
  },
  {
    "i": 6759,
    "n": "Puddings, coconut cream, dry mix, regular",
    "ms": [
      {
        "s": "1 package (3.12 oz)",
        "c": 7.04
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 2
      }
    ]
  },
  {
    "i": 6762,
    "n": "Molasses",
    "ms": [
      {
        "s": "1 cup",
        "c": 691
      },
      {
        "s": "1 serving 1 tbsp",
        "c": 41
      }
    ]
  },
  {
    "i": 6764,
    "n": "Pectin, unsweetened, dry mix",
    "ms": [
      {
        "s": "1 package (1.75 oz)",
        "c": 3.5
      }
    ]
  },
  {
    "i": 6765,
    "n": "Fruit butters, apple",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 2.38
      },
      {
        "s": "1 serving",
        "c": 2.38
      },
      {
        "s": "1 cup",
        "c": 39.5
      }
    ]
  },
  {
    "i": 6766,
    "n": "Marmalade, orange",
    "ms": [
      {
        "s": "1 package (0.5 oz)",
        "c": 5.32
      },
      {
        "s": "1 serving",
        "c": 7.6
      },
      {
        "s": "1 tbsp",
        "c": 7.6
      },
      {
        "s": "1 cup",
        "c": 122
      }
    ]
  },
  {
    "i": 6769,
    "n": "Frostings, vanilla, creamy, dry mix",
    "ms": [
      {
        "s": "0.08 package",
        "c": 1.02
      },
      {
        "s": "1 package",
        "c": 12.3
      }
    ]
  },
  {
    "i": 6770,
    "n": "Ice creams, strawberry",
    "ms": [
      {
        "s": "0.5 cup (4 fl oz)",
        "c": 79.2
      },
      {
        "s": "1 individual (3.5 fl oz)",
        "c": 69.6
      }
    ]
  },
  {
    "i": 6771,
    "n": "Frostings, white, fluffy, dry mix",
    "ms": [
      {
        "s": "1 package",
        "c": 8.28
      },
      {
        "s": "0.08 package",
        "c": 0.68
      }
    ]
  },
  {
    "i": 6777,
    "n": "Ice creams, chocolate",
    "ms": [
      {
        "s": "0.5 cup (4 fl oz)",
        "c": 71.9
      },
      {
        "s": "1 individual (3.5 fl oz)",
        "c": 63.2
      }
    ]
  },
  {
    "i": 6781,
    "n": "Frostings, chocolate, creamy, ready-to-eat",
    "ms": [
      {
        "s": "2 tbsp creamy",
        "c": 3.28
      }
    ]
  },
  {
    "i": 6782,
    "n": "Frostings, chocolate, creamy, dry mix, prepared with butter",
    "ms": [
      {
        "s": "2 tablespoon",
        "c": 3.96
      }
    ]
  },
  {
    "i": 6786,
    "n": "Puddings, chocolate, ready-to-eat, fat free",
    "ms": [
      {
        "s": "1 serving 4 oz",
        "c": 44.1
      }
    ]
  },
  {
    "i": 6787,
    "n": "Rennin, chocolate, dry mix, prepared with 2% milk",
    "ms": [
      {
        "s": "0 cup",
        "c": 179
      }
    ]
  },
  {
    "i": 6788,
    "n": "Desserts, rennin, vanilla, dry mix",
    "ms": [
      {
        "s": "1 package (1.5 oz)",
        "c": 50.3
      },
      {
        "s": "1 tbsp",
        "c": 12.6
      }
    ]
  },
  {
    "i": 6789,
    "n": "Rennin, vanilla, dry mix, prepared with 2% milk",
    "ms": [
      {
        "s": "0 cup",
        "c": 172
      }
    ]
  },
  {
    "i": 6790,
    "n": "Desserts, rennin, tablets, unsweetened",
    "ms": [
      {
        "s": "1 package (0.35 oz)",
        "c": 370
      }
    ]
  },
  {
    "i": 6792,
    "n": "Puddings, vanilla, dry mix, regular, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 138
      }
    ]
  },
  {
    "i": 6795,
    "n": "Puddings, lemon, dry mix, instant, prepared with 2% milk",
    "ms": [
      {
        "s": "1 package",
        "c": 32.3
      },
      {
        "s": "1 serving",
        "c": 8.08
      }
    ]
  },
  {
    "i": 6796,
    "n": "Puddings, rice, ready-to-eat",
    "ms": [
      {
        "s": "1 can (5 oz)",
        "c": 135
      },
      {
        "s": "1 serving 4 oz pudding cup",
        "c": 107
      },
      {
        "s": "1 oz",
        "c": 26.9
      },
      {
        "s": "0.5 cup",
        "c": 87.4
      },
      {
        "s": "1 cup",
        "c": 163
      }
    ]
  },
  {
    "i": 6797,
    "n": "Egg custards, dry mix, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 206
      }
    ]
  },
  {
    "i": 6798,
    "n": "Puddings, rice, dry mix",
    "ms": [
      {
        "s": "1 package",
        "c": 14.8
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 3.78
      }
    ]
  },
  {
    "i": 6799,
    "n": "Puddings, vanilla, dry mix, instant",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 3
      },
      {
        "s": "1 package (3.5 oz)",
        "c": 11.9
      }
    ]
  },
  {
    "i": 6800,
    "n": "Puddings, coconut cream, dry mix, instant, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 150
      },
      {
        "s": "1 package yield (2 cups)",
        "c": 599
      }
    ]
  },
  {
    "i": 6802,
    "n": "Puddings, chocolate, dry mix, instant",
    "ms": [
      {
        "s": "1 package (3.5 oz)",
        "c": 11.9
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 3
      }
    ]
  },
  {
    "i": 6805,
    "n": "Puddings, chocolate, dry mix, regular, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 143
      }
    ]
  },
  {
    "i": 6807,
    "n": "Egg custards, dry mix, prepared with whole milk",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 196
      }
    ]
  },
  {
    "i": 6808,
    "n": "Chewing gum",
    "ms": [
      {
        "s": "1 stick",
        "c": 0
      },
      {
        "s": "1 block",
        "c": 0
      },
      {
        "s": "10 Chiclets",
        "c": 0
      }
    ]
  },
  {
    "i": 6810,
    "n": "Egg custards, dry mix",
    "ms": [
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 47.9
      },
      {
        "s": "1 package (3 oz)",
        "c": 194
      }
    ]
  },
  {
    "i": 6811,
    "n": "Gelatin desserts, dry mix",
    "ms": [
      {
        "s": "1 package (3 oz)",
        "c": 2.55
      },
      {
        "s": "1 portion, amount to make 1/2 cup",
        "c": 0.63
      }
    ]
  },
  {
    "i": 6825,
    "n": "Toppings, strawberry",
    "ms": [
      {
        "s": "1 cup",
        "c": 20.4
      },
      {
        "s": "2 tbsp",
        "c": 2.52
      },
      {
        "s": "1 serving",
        "c": 2.4
      }
    ]
  },
  {
    "i": 6827,
    "n": "Candies, milk chocolate, with rice cereal",
    "ms": [
      {
        "s": "1 bar (1.65 oz)",
        "c": 87.9
      },
      {
        "s": "1 bar, miniature",
        "c": 18.7
      },
      {
        "s": "1 bar (1.55 oz)",
        "c": 82.3
      },
      {
        "s": "1 bar (1.45 oz)",
        "c": 84.2
      },
      {
        "s": "1 bar (1.4 oz)",
        "c": 74.8
      }
    ]
  },
  {
    "i": 6828,
    "n": "Alcoholic beverage, beer, light",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.18
      },
      {
        "s": "1 can or bottle (12 fl oz)",
        "c": 14.2
      }
    ]
  },
  {
    "i": 6829,
    "n": "Candies, milk chocolate, with almonds",
    "ms": [
      {
        "s": "1 bar (1.55 oz)",
        "c": 98.6
      },
      {
        "s": "1 bar (1.45 oz)",
        "c": 91.8
      }
    ]
  },
  {
    "i": 6831,
    "n": "Beverages, almond milk, sweetened, vanilla flavor, ready-to-drink",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 451
      },
      {
        "s": "1 cup",
        "c": 451
      }
    ]
  },
  {
    "i": 6835,
    "n": "Beef, Brisket, Flat Half, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 14.7
      },
      {
        "s": "1 piece",
        "c": 231
      }
    ]
  },
  {
    "i": 6837,
    "n": "Alcoholic beverage, beer, regular, all",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.19
      },
      {
        "s": "1 can",
        "c": 14.2
      }
    ]
  },
  {
    "i": 6838,
    "n": "Beef, chuck eye roast, boneless, America's Beef Roast, separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 21.5
      },
      {
        "s": "1 roast",
        "c": 252
      }
    ]
  },
  {
    "i": 6841,
    "n": "Beef, Chuck, Top Blade, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 6844,
    "n": "Beef, Chuck, Top Blade, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 6847,
    "n": "Beef, Shoulder Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz ( 1 serving )",
        "c": 10.2
      }
    ]
  },
  {
    "i": 6848,
    "n": "Beef, Shoulder Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 10.2
      }
    ]
  },
  {
    "i": 6854,
    "n": "Beef, Chuck, Clod Roast, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 6856,
    "n": "Beef, short loin, top loin, steak, separable lean and fat, trimmed to 1/8 fat, prime, raw",
    "ms": [
      {
        "s": "1 steak, excluding refuse (yield from 1 raw steak, with refuse, weighing 242 g)",
        "c": 13.6
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 6861,
    "n": "Beef, tenderloin, roast, separable lean and fat, trimmed to 1/8 fat, choice, cooked, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 29.6
      }
    ]
  },
  {
    "i": 6863,
    "n": "Beef, short loin, t-bone steak, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 96.8
      },
      {
        "s": "4 oz",
        "c": 23.7
      }
    ]
  },
  {
    "i": 6865,
    "n": "Beef, loin, top loin, separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 26
      }
    ]
  },
  {
    "i": 6867,
    "n": "Beef, round, top round, separable lean and fat, trimmed to 1/8 fat, select, cooked, braised",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 11.4
      }
    ]
  },
  {
    "i": 6869,
    "n": "Beef, Round, Top Round, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 17
      }
    ]
  },
  {
    "i": 6870,
    "n": "Beef, brisket, flat half, boneless, separable lean and fat, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 241
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 6873,
    "n": "Beef, Shoulder Top Blade Steak, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 steak",
        "c": 27.7
      }
    ]
  },
  {
    "i": 6874,
    "n": "Beef, round, tip round, separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 22.7
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 6875,
    "n": "Beef, round, tip round, roast, separable lean and fat, trimmed to 1/8 fat, select, cooked, roasted",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 19.6
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6879,
    "n": "Beef, round, bottom round, steak, separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 26
      },
      {
        "s": "1 steak",
        "c": 71.8
      }
    ]
  },
  {
    "i": 6883,
    "n": "Beef, round, full cut, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 18.1
      },
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 6887,
    "n": "Beef, round, bottom round, steak, separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 72.6
      },
      {
        "s": "4 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 6892,
    "n": "Beef, Rib, Small End (Ribs 10-12), Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 24.9
      },
      {
        "s": "1 steak",
        "c": 73.7
      }
    ]
  },
  {
    "i": 6895,
    "n": "Beef, rib, large end (ribs 6-9), separable lean and fat, trimmed to 1/8 fat, prime, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 36.3
      },
      {
        "s": "4 oz",
        "c": 9.04
      }
    ]
  },
  {
    "i": 6905,
    "n": "Beef, rib, whole (ribs 6-12), separable lean and fat, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 40.8
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 6906,
    "n": "Beef, rib, whole (ribs 6-12), separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 40.8
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 6907,
    "n": "Beef, rib, large end (ribs 6-9), separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "1 lb",
        "c": 36.3
      }
    ]
  },
  {
    "i": 6908,
    "n": "Beef, chuck, blade roast, separable lean and fat, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 45.4
      },
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 6910,
    "n": "Beef, Chuck, Arm Pot Roast, Separable Lean*",
    "ms": [
      {
        "s": "1 lb",
        "c": 81.6
      },
      {
        "s": "1 roast",
        "c": 321
      },
      {
        "s": "4 oz",
        "c": 20.3
      }
    ]
  },
  {
    "i": 6913,
    "n": "Beef, brisket, whole, separable lean and fat, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 27.2
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 6922,
    "n": "Beef, Chuck Eye Roast, Boneless, America'S Beef Roast, Separable Lean*",
    "ms": [
      {
        "s": "4 oz",
        "c": 19.2
      },
      {
        "s": "1 roast",
        "c": 119
      }
    ]
  },
  {
    "i": 6926,
    "n": "Beef, brisket, flat half, boneless separable lean only, trimmed to 0 fat, all grades, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 241
      },
      {
        "s": "4 oz",
        "c": 14.7
      }
    ]
  },
  {
    "i": 6928,
    "n": "Beef, ground, 70% lean meat / 30% fat, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 6.8
      },
      {
        "s": "4 oz",
        "c": 27.1
      }
    ]
  },
  {
    "i": 6930,
    "n": "Beef, ground, 70% lean meat / 30% fat, patty, cooked, broiled",
    "ms": [
      {
        "s": "1 patty",
        "c": 24.5
      },
      {
        "s": "3 oz",
        "c": 29.8
      }
    ]
  },
  {
    "i": 6931,
    "n": "Beef, ground, 70% lean meat / 30% fat, patty cooked, pan-broiled",
    "ms": [
      {
        "s": "1 patty",
        "c": 28.5
      },
      {
        "s": "3 oz",
        "c": 31.4
      }
    ]
  },
  {
    "i": 6932,
    "n": "Beef, Chuck, Under Blade Center Steak, Boneless, Denver Cut, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 50.4
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 6934,
    "n": "Beef, short loin, t-bone steak, bone-in, separable lean only, trimmed to 1/8 fat, select, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 105
      },
      {
        "s": "4 oz",
        "c": 26
      }
    ]
  },
  {
    "i": 6935,
    "n": "Beef, short loin, t-bone steak, separable lean only, trimmed to 0 fat, choice, cooked, broiled",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse",
        "c": 10.8
      },
      {
        "s": "3 oz",
        "c": 3.4
      },
      {
        "s": "1 serving",
        "c": 3.4
      }
    ]
  },
  {
    "i": 6937,
    "n": "Beef, rib, eye, small end (ribs 10- 12) separable lean only, trimmed to 0 fat, select, cooked, broiled",
    "ms": [
      {
        "s": "1 steak",
        "c": 48.5
      },
      {
        "s": "3 oz",
        "c": 17.8
      }
    ]
  },
  {
    "i": 6940,
    "n": "Beef, short loin, porterhouse steak, separable lean only, trimmed to 0 fat, choice, cooked, broiled",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse",
        "c": 16
      },
      {
        "s": "1 serving",
        "c": 5.1
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 6941,
    "n": "Beef, short loin, t-bone steak, bone-in, separable lean only, trimmed to 1/8 fat, all grades, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 96.6
      },
      {
        "s": "4 oz",
        "c": 23.7
      }
    ]
  },
  {
    "i": 6942,
    "n": "Beef, Short Loin, Porterhouse Steak, Separable Lean*",
    "ms": [
      {
        "s": "1 steak",
        "c": 99.9
      },
      {
        "s": "4 oz",
        "c": 21.5
      }
    ]
  },
  {
    "i": 6946,
    "n": "Beef, top sirloin, steak, separable lean only, trimmed to 0 fat, select, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 18.7
      },
      {
        "s": "1 steak (yield from 505 g raw meat)",
        "c": 82.5
      }
    ]
  },
  {
    "i": 6948,
    "n": "Beef, variety meats and by-products, mechanically separated beef, raw",
    "ms": [
      {
        "s": "8 oz",
        "c": 1100
      },
      {
        "s": "1 oz",
        "c": 137
      }
    ]
  },
  {
    "i": 6952,
    "n": "Beef, variety meats and by-products, lungs, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 oz",
        "c": 2.84
      }
    ]
  },
  {
    "i": 6954,
    "n": "Beef, variety meats and by-products, heart, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 6955,
    "n": "Beef, variety meats and by-products, brain, cooked, simmered",
    "ms": [
      {
        "s": "1 piece, cooked, excluding refuse",
        "c": 35.2
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 6960,
    "n": "Beef, rib eye, small end (ribs 10-12), separable lean only, trimmed to 0 fat, select, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 6961,
    "n": "Beef, short loin, t-bone steak, bone-in, separable lean only, trimmed to 1/8 fat, choice, raw",
    "ms": [
      {
        "s": "1 steak",
        "c": 96.8
      },
      {
        "s": "4 oz",
        "c": 23.7
      }
    ]
  },
  {
    "i": 6963,
    "n": "Beef, variety meats and by-products, brain, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 48.6
      },
      {
        "s": "1 oz",
        "c": 12.2
      }
    ]
  },
  {
    "i": 6964,
    "n": "Beef, round, full cut, separable lean only, trimmed to 1/4 fat, choice, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 14.2
      }
    ]
  },
  {
    "i": 6966,
    "n": "Beef, round, full cut, separable lean only, trimmed to 1/4 fat, select, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 14.1
      }
    ]
  },
  {
    "i": 6972,
    "n": "Beef, brisket, whole, separable lean only, all grades, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 lb",
        "c": 22.7
      }
    ]
  },
  {
    "i": 6973,
    "n": "Beef, grass-fed, ground, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 13.6
      },
      {
        "s": "1 serving",
        "c": 10.2
      }
    ]
  },
  {
    "i": 6976,
    "n": "Seeds, pumpkin and squash seeds, whole, roasted, with salt added",
    "ms": [
      {
        "s": "1 cup",
        "c": 35.2
      },
      {
        "s": "1 oz (85 seeds)",
        "c": 15.6
      }
    ]
  },
  {
    "i": 6977,
    "n": "Nuts, almonds, oil roasted, lightly salted",
    "ms": [
      {
        "s": "1 oz (22 whole kernels)",
        "c": 82.5
      },
      {
        "s": "1 cup whole kernels",
        "c": 457
      }
    ]
  },
  {
    "i": 6979,
    "n": "Nuts, Almond Butter, Plain, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 868
      },
      {
        "s": "1 tbsp",
        "c": 55.5
      }
    ]
  },
  {
    "i": 6980,
    "n": "Seeds, sesame butter, tahini, type of kernels unspecified",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 21.2
      }
    ]
  },
  {
    "i": 6981,
    "n": "Beef, retail cuts, separable fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 29.4
      },
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 6982,
    "n": "Nuts, Macadamia Nuts, Dry Roasted, With*",
    "ms": [
      {
        "s": "1 oz (10-12 kernels)",
        "c": 19.8
      },
      {
        "s": "1 cup, whole or halves",
        "c": 92.4
      }
    ]
  },
  {
    "i": 6986,
    "n": "Seeds, lotus seeds, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.5
      }
    ]
  },
  {
    "i": 6987,
    "n": "Seeds, sunflower seed kernels, oil roasted, with salt added",
    "ms": [
      {
        "s": "1 oz",
        "c": 24.7
      },
      {
        "s": "1 cup",
        "c": 117
      }
    ]
  },
  {
    "i": 6989,
    "n": "Seeds, sunflower seed kernels, toasted, with salt added",
    "ms": [
      {
        "s": "1 cup",
        "c": 76.4
      },
      {
        "s": "1 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 6991,
    "n": "Nuts, almonds, honey roasted, unblanched",
    "ms": [
      {
        "s": "1 oz",
        "c": 74.6
      },
      {
        "s": "1 cup whole kernels",
        "c": 379
      }
    ]
  },
  {
    "i": 6993,
    "n": "Nuts, coconut meat, dried (desiccated), sweetened, shredded",
    "ms": [
      {
        "s": "1 package (7 oz)",
        "c": 29.8
      },
      {
        "s": "1 cup, shredded",
        "c": 14
      }
    ]
  },
  {
    "i": 6994,
    "n": "Fungi, Cloud ears, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 44.5
      },
      {
        "s": "1 piece",
        "c": 7.16
      }
    ]
  },
  {
    "i": 6996,
    "n": "Wasabi, root, raw",
    "ms": [
      {
        "s": "1 root",
        "c": 216
      },
      {
        "s": "1 cup, sliced",
        "c": 166
      }
    ]
  },
  {
    "i": 6998,
    "n": "Seeds, sisymbrium sp. seeds, whole, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 1210
      },
      {
        "s": "1 oz",
        "c": 463
      }
    ]
  },
  {
    "i": 6999,
    "n": "Nuts, chestnuts, japanese, boiled and steamed",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      }
    ]
  },
  {
    "i": 7000,
    "n": "Nuts, coconut meat, dried (desiccated), creamed",
    "ms": [
      {
        "s": "1 oz",
        "c": 7.37
      }
    ]
  },
  {
    "i": 7001,
    "n": "Peppers, jalapeno, raw",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 10.8
      },
      {
        "s": "1 pepper",
        "c": 1.68
      }
    ]
  },
  {
    "i": 7002,
    "n": "Grape leaves, raw",
    "ms": [
      {
        "s": "1 leaf",
        "c": 10.9
      },
      {
        "s": "1 cup",
        "c": 50.8
      }
    ]
  },
  {
    "i": 7004,
    "n": "Mushrooms, oyster, raw",
    "ms": [
      {
        "s": "1 cup sliced",
        "c": 2.58
      },
      {
        "s": "1 large",
        "c": 4.44
      },
      {
        "s": "1 small",
        "c": 0.45
      }
    ]
  },
  {
    "i": 7005,
    "n": "Peppers, pasilla, dried",
    "ms": [
      {
        "s": "1 pepper",
        "c": 6.79
      }
    ]
  },
  {
    "i": 7006,
    "n": "Peppers, hungarian, raw",
    "ms": [
      {
        "s": "1 pepper",
        "c": 3.24
      }
    ]
  },
  {
    "i": 7007,
    "n": "Carrots, baby, raw",
    "ms": [
      {
        "s": "1 large",
        "c": 4.8
      },
      {
        "s": "1 medium",
        "c": 3.2
      },
      {
        "s": "1 NLEA serving",
        "c": 27.2
      }
    ]
  },
  {
    "i": 7009,
    "n": "Peppers, hot chile, sun-dried",
    "ms": [
      {
        "s": "1 pepper",
        "c": 0.225
      },
      {
        "s": "1 cup",
        "c": 16.6
      }
    ]
  },
  {
    "i": 7010,
    "n": "Beans, fava, in pod, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 46.6
      },
      {
        "s": "1 pod",
        "c": 2.26
      }
    ]
  },
  {
    "i": 7011,
    "n": "Nopales*",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 141
      }
    ]
  },
  {
    "i": 7012,
    "n": "Lemon grass (citronella), raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 3.12
      },
      {
        "s": "1 cup",
        "c": 43.6
      }
    ]
  },
  {
    "i": 7013,
    "n": "Cabbage, napa, cooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 31.6
      }
    ]
  },
  {
    "i": 7014,
    "n": "Radicchio, raw",
    "ms": [
      {
        "s": "1 leaf",
        "c": 1.52
      },
      {
        "s": "1 cup, shredded",
        "c": 7.6
      }
    ]
  },
  {
    "i": 7015,
    "n": "Squash, zucchini, baby, raw",
    "ms": [
      {
        "s": "1 medium",
        "c": 2.31
      },
      {
        "s": "1 large",
        "c": 3.36
      }
    ]
  },
  {
    "i": 7016,
    "n": "Tomatoes, sun-dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 59.4
      },
      {
        "s": "1 piece",
        "c": 2.2
      }
    ]
  },
  {
    "i": 7017,
    "n": "Pickles, Cucumber, Sour*",
    "ms": [
      {
        "s": "1 spear",
        "c": 0
      },
      {
        "s": "1 slice",
        "c": 0
      },
      {
        "s": "1 cup (about 23 slices)",
        "c": 0
      },
      {
        "s": "1 large (4 long)",
        "c": 0
      },
      {
        "s": "1 small",
        "c": 0
      },
      {
        "s": "1 medium (3-3/4 long)",
        "c": 0
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 0
      }
    ]
  },
  {
    "i": 7018,
    "n": "Pickles, cucumber, dill, reduced sodium",
    "ms": [
      {
        "s": "1 cup, (about 23 slices)",
        "c": 88.4
      },
      {
        "s": "1 spear, small",
        "c": 20
      },
      {
        "s": "1 large (4 long)",
        "c": 77
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 81.5
      },
      {
        "s": "1 slice",
        "c": 3.99
      }
    ]
  },
  {
    "i": 7019,
    "n": "Tomatillos, raw",
    "ms": [
      {
        "s": "0.5 cup, chopped or diced",
        "c": 4.62
      },
      {
        "s": "1 medium",
        "c": 2.38
      }
    ]
  },
  {
    "i": 7021,
    "n": "Pickle relish, hot dog",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 6.1
      },
      {
        "s": "1 tbsp",
        "c": 0.75
      }
    ]
  },
  {
    "i": 7022,
    "n": "Pickle relish, sweet",
    "ms": [
      {
        "s": "1 cup",
        "c": 7.35
      },
      {
        "s": "1 packet (2/3 tbsp)",
        "c": 0.3
      },
      {
        "s": "1 tbsp",
        "c": 0.45
      }
    ]
  },
  {
    "i": 7024,
    "n": "Pickles, cucumber, dill or kosher dill",
    "ms": [
      {
        "s": "1 spear, small",
        "c": 20
      },
      {
        "s": "1 cup, chopped or diced",
        "c": 81.5
      },
      {
        "s": "1 slice",
        "c": 3.99
      },
      {
        "s": "1 large (4 long)",
        "c": 77
      },
      {
        "s": "1 cup (about 23 slices)",
        "c": 88.4
      }
    ]
  },
  {
    "i": 7025,
    "n": "Mushrooms, brown, italian, or crimini, exposed to ultraviolet light, raw",
    "ms": [
      {
        "s": "1 cup whole",
        "c": 15.7
      },
      {
        "s": "1 piece whole",
        "c": 3.6
      },
      {
        "s": "1 cup sliced",
        "c": 13
      }
    ]
  },
  {
    "i": 7026,
    "n": "Potatoes, mashed, home-prepared, whole milk and butter added",
    "ms": [
      {
        "s": "1 cup",
        "c": 50.4
      }
    ]
  },
  {
    "i": 7027,
    "n": "Potatoes, mashed, prepared from granules, without milk, whole milk and margarine",
    "ms": [
      {
        "s": "1 cup",
        "c": 73.5
      }
    ]
  },
  {
    "i": 7029,
    "n": "Tree Fern, Cooked, With*",
    "ms": [
      {
        "s": "0.5 cup, chopped or diced",
        "c": 5.68
      },
      {
        "s": "1 frond (6-1/2 long)",
        "c": 2.48
      }
    ]
  },
  {
    "i": 7031,
    "n": "Peppers, sweet, red, sauteed",
    "ms": [
      {
        "s": "1 cup chopped",
        "c": 7.42
      }
    ]
  },
  {
    "i": 7040,
    "n": "Corn, sweet, white, raw",
    "ms": [
      {
        "s": "1 ear, medium (6-3/4 to 7-1/2 long)",
        "c": 1.8
      },
      {
        "s": "1 ear, small (5-1/2 to 6-1/2 long)",
        "c": 1.46
      },
      {
        "s": "1 cup kernels",
        "c": 3.08
      },
      {
        "s": "1 ear, large (7-3/4 to 9 long)",
        "c": 2.86
      }
    ]
  },
  {
    "i": 7042,
    "n": "Corn, Sweet, White, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 ear, yields",
        "c": 1.54
      },
      {
        "s": "1 ear, medium (6-3/4 to 7-1/2 long)",
        "c": 2.06
      },
      {
        "s": "1 ear, small (5-1/2 to 6-1/2 long)",
        "c": 1.78
      },
      {
        "s": "1 cup cut",
        "c": 3.14
      },
      {
        "s": "1 ear, large (7-3/4 to 9 long)",
        "c": 2.36
      }
    ]
  },
  {
    "i": 7046,
    "n": "Leeks, (Bulb And Lower Leaf-Portion), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.25 cup, chopped",
        "c": 7.8
      },
      {
        "s": "1 leek",
        "c": 37.2
      }
    ]
  },
  {
    "i": 7047,
    "n": "Gourd, Dishcloth (Towelgourd), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup (1 pieces)",
        "c": 16
      },
      {
        "s": "0.5 cup (1 slices)",
        "c": 8.01
      }
    ]
  },
  {
    "i": 7048,
    "n": "Lotus Root, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 15.6
      },
      {
        "s": "10 slices (2-1/2 dia)",
        "c": 23.1
      }
    ]
  },
  {
    "i": 7051,
    "n": "Drumstick Leaves, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 63.4
      }
    ]
  },
  {
    "i": 7052,
    "n": "Cowpeas (Blackeyes), Immature Seeds, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 211
      }
    ]
  },
  {
    "i": 7054,
    "n": "Cowpeas, Leafy Tips, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 36.6
      }
    ]
  },
  {
    "i": 7058,
    "n": "Corn, Sweet, Yellow, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 ear, yields",
        "c": 2.31
      },
      {
        "s": "1 ear medium (6-3/4 to 7-1/2 long)",
        "c": 3.09
      },
      {
        "s": "1 ear large (7-3/4 to 9 long)",
        "c": 3.54
      },
      {
        "s": "1 baby ear",
        "c": 0.24
      },
      {
        "s": "1 ear small (5-1/2 to 6-1/2 long)",
        "c": 2.67
      },
      {
        "s": "1 cup",
        "c": 4.47
      }
    ]
  },
  {
    "i": 7066,
    "n": "Broccoli, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 stalk, small (5 long)",
        "c": 56
      },
      {
        "s": "1 stalk, medium (7-1/2 - 8 long)",
        "c": 72
      },
      {
        "s": "0.5 cup, chopped",
        "c": 31.2
      },
      {
        "s": "1 spear (about 5 long)",
        "c": 14.8
      },
      {
        "s": "1 stalk, large (11-12 long)",
        "c": 112
      }
    ]
  },
  {
    "i": 7069,
    "n": "Cabbage, common, cooked, boiled, drained, with salt",
    "ms": [
      {
        "s": "1 head",
        "c": 606
      },
      {
        "s": "0.5 cup, shredded",
        "c": 36
      }
    ]
  },
  {
    "i": 7071,
    "n": "Cabbage, Red, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 leaf",
        "c": 9.24
      },
      {
        "s": "0.5 cup, shredded",
        "c": 31.5
      }
    ]
  },
  {
    "i": 7076,
    "n": "Beets, cooked, boiled. drained, with salt",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 13.6
      },
      {
        "s": "2 beets (2 dia, sphere)",
        "c": 16
      }
    ]
  },
  {
    "i": 7077,
    "n": "Borage, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 102
      }
    ]
  },
  {
    "i": 7079,
    "n": "Beans, Navy, Mature Seeds, Sprouted, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 16
      }
    ]
  },
  {
    "i": 7083,
    "n": "Bamboo Shoots, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup (1/2 slices)",
        "c": 14.4
      },
      {
        "s": "1 shoot",
        "c": 17.3
      }
    ]
  },
  {
    "i": 7086,
    "n": "Taro shoots, raw",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 5.16
      },
      {
        "s": "1 shoot",
        "c": 9.96
      }
    ]
  },
  {
    "i": 7089,
    "n": "Balsam-Pear (Bitter Gourd), Leafy Tips, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup",
        "c": 24.4
      }
    ]
  },
  {
    "i": 7090,
    "n": "Arrowroot, raw",
    "ms": [
      {
        "s": "1 root",
        "c": 1.98
      },
      {
        "s": "1 cup, sliced",
        "c": 7.2
      }
    ]
  },
  {
    "i": 7091,
    "n": "Taro leaves, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 30
      },
      {
        "s": "1 leaf (11 x 6-1/2)",
        "c": 10.7
      }
    ]
  },
  {
    "i": 7092,
    "n": "Balsam-Pear (Bitter Gourd), Pods, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 cup (1/2 pieces)",
        "c": 11.2
      }
    ]
  },
  {
    "i": 7094,
    "n": "Arrowhead, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "1 corm, medium",
        "c": 0.84
      }
    ]
  },
  {
    "i": 7097,
    "n": "Sweet Potato, Cooked, Boiled, Without Skin*",
    "ms": [
      {
        "s": "1 cup, mashed",
        "c": 88.6
      },
      {
        "s": "1 medium",
        "c": 40.8
      }
    ]
  },
  {
    "i": 7098,
    "n": "Sweet Potato, Cooked, Baked In Skin, Flesh, With*",
    "ms": [
      {
        "s": "1 medium (2 dia, 5 long, raw)",
        "c": 43.3
      },
      {
        "s": "1 cup",
        "c": 76
      },
      {
        "s": "1 small",
        "c": 22.8
      },
      {
        "s": "1 large",
        "c": 68.4
      }
    ]
  },
  {
    "i": 7106,
    "n": "Squash, winter, acorn, raw",
    "ms": [
      {
        "s": "1 squash (4 inch dia)",
        "c": 142
      },
      {
        "s": "1 cup, cubes",
        "c": 46.2
      }
    ]
  },
  {
    "i": 7107,
    "n": "Squash, winter, hubbard, raw",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 16.2
      }
    ]
  },
  {
    "i": 7117,
    "n": "Seaweed, laver, raw",
    "ms": [
      {
        "s": "2 tbsp (1/8 cup)",
        "c": 7
      },
      {
        "s": "10 sheets",
        "c": 18.2
      }
    ]
  },
  {
    "i": 7118,
    "n": "Squash, summer, crookneck and straightneck, raw",
    "ms": [
      {
        "s": "1 cup sliced",
        "c": 26.7
      }
    ]
  },
  {
    "i": 7119,
    "n": "Soybeans, Mature Seeds, Sprouted, Cooked, Stir-Fried*",
    "ms": [
      {
        "s": "100 g",
        "c": 82
      }
    ]
  },
  {
    "i": 7121,
    "n": "Sesbania flower, raw",
    "ms": [
      {
        "s": "1 flower",
        "c": 0.57
      },
      {
        "s": "1 cup flowers",
        "c": 3.8
      }
    ]
  },
  {
    "i": 7122,
    "n": "Spinach, raw",
    "ms": [
      {
        "s": "1 package (10 oz)",
        "c": 281
      },
      {
        "s": "1 cup",
        "c": 29.7
      },
      {
        "s": "1 leaf",
        "c": 9.9
      },
      {
        "s": "1 bunch",
        "c": 337
      }
    ]
  },
  {
    "i": 7124,
    "n": "Radishes, oriental, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 730
      }
    ]
  },
  {
    "i": 7126,
    "n": "Seaweed, irishmoss, raw",
    "ms": [
      {
        "s": "2 tbsp (1/8 cup)",
        "c": 7.2
      }
    ]
  },
  {
    "i": 7127,
    "n": "Seaweed, kelp, raw",
    "ms": [
      {
        "s": "2 tbsp (1/8 cup)",
        "c": 16.8
      }
    ]
  },
  {
    "i": 7128,
    "n": "Rutabagas, raw",
    "ms": [
      {
        "s": "1 cup, cubes",
        "c": 60.2
      },
      {
        "s": "1 medium",
        "c": 166
      },
      {
        "s": "1 small",
        "c": 82.6
      },
      {
        "s": "1 large",
        "c": 332
      }
    ]
  },
  {
    "i": 7132,
    "n": "Radishes, oriental, raw",
    "ms": [
      {
        "s": "1 radish (7 long)",
        "c": 91.3
      },
      {
        "s": "1 cup slices",
        "c": 31.3
      }
    ]
  },
  {
    "i": 7134,
    "n": "Pumpkin, raw",
    "ms": [
      {
        "s": "1 cup (1 cubes)",
        "c": 24.4
      }
    ]
  },
  {
    "i": 7135,
    "n": "Potato flour",
    "ms": [
      {
        "s": "1 cup",
        "c": 104
      }
    ]
  },
  {
    "i": 7139,
    "n": "New Zealand spinach, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 32.5
      }
    ]
  },
  {
    "i": 7143,
    "n": "Mushrooms, shiitake, dried",
    "ms": [
      {
        "s": "1 mushroom",
        "c": 0.396
      },
      {
        "s": "4 mushrooms",
        "c": 1.65
      }
    ]
  },
  {
    "i": 7145,
    "n": "Mustard spinach, (tendergreen), raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 315
      }
    ]
  },
  {
    "i": 7146,
    "n": "Mushrooms, brown, italian, or crimini, raw",
    "ms": [
      {
        "s": "1 piece whole",
        "c": 3.6
      },
      {
        "s": "1 cup whole",
        "c": 15.7
      },
      {
        "s": "1 cup sliced",
        "c": 13
      }
    ]
  },
  {
    "i": 7148,
    "n": "Mushrooms, shiitake, stir-fried",
    "ms": [
      {
        "s": "1 cup whole",
        "c": 1.78
      },
      {
        "s": "1 cup sliced",
        "c": 1.94
      },
      {
        "s": "1 piece whole",
        "c": 0.38
      }
    ]
  },
  {
    "i": 7150,
    "n": "Lettuce, butterhead (includes boston and bibb types), raw",
    "ms": [
      {
        "s": "1 head (5 dia)",
        "c": 57
      },
      {
        "s": "1 leaf, medium",
        "c": 2.62
      },
      {
        "s": "1 leaf",
        "c": 1.75
      },
      {
        "s": "1 leaf, large",
        "c": 5.25
      },
      {
        "s": "1 cup, shredded or chopped",
        "c": 19.2
      }
    ]
  },
  {
    "i": 7151,
    "n": "Mountain yam, hawaii, raw",
    "ms": [
      {
        "s": "0.5 cup, cubes",
        "c": 17.7
      },
      {
        "s": "1 yam",
        "c": 109
      }
    ]
  },
  {
    "i": 7152,
    "n": "Lentils, Sprouted, Cooked, Stir-Fried, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 14
      }
    ]
  },
  {
    "i": 7153,
    "n": "Lettuce, red leaf, raw",
    "ms": [
      {
        "s": "1 cup shredded",
        "c": 9.24
      },
      {
        "s": "1 NLEA serving",
        "c": 28
      },
      {
        "s": "1 head",
        "c": 102
      },
      {
        "s": "1 leaf inner",
        "c": 0.858
      },
      {
        "s": "1 leaf outer",
        "c": 5.61
      }
    ]
  },
  {
    "i": 7154,
    "n": "Mushrooms, morel, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 5.55
      },
      {
        "s": "1 cup",
        "c": 28.4
      }
    ]
  },
  {
    "i": 7155,
    "n": "Lentils, sprouted, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 19.2
      }
    ]
  },
  {
    "i": 7156,
    "n": "Mushrooms, Chanterelle, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 8.1
      },
      {
        "s": "1 piece",
        "c": 0.81
      }
    ]
  },
  {
    "i": 7160,
    "n": "Kohlrabi, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.4
      },
      {
        "s": "1 slice",
        "c": 3.84
      }
    ]
  },
  {
    "i": 7161,
    "n": "Pepeao, dried",
    "ms": [
      {
        "s": "1 cup",
        "c": 27.1
      }
    ]
  },
  {
    "i": 7162,
    "n": "Jute, potherb, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 58.2
      }
    ]
  },
  {
    "i": 7163,
    "n": "Gourd, dishcloth (towelgourd), raw",
    "ms": [
      {
        "s": "1 cup (1 pieces)",
        "c": 19
      },
      {
        "s": "1 gourd",
        "c": 35.6
      }
    ]
  },
  {
    "i": 7164,
    "n": "Escarole, cooked, boiled, drained, no salt added",
    "ms": [
      {
        "s": "1 cup",
        "c": 69
      }
    ]
  },
  {
    "i": 7166,
    "n": "Drumstick leaves, raw",
    "ms": [
      {
        "s": "1 cup, chopped",
        "c": 38.8
      }
    ]
  },
  {
    "i": 7169,
    "n": "Cucumber, with peel, raw",
    "ms": [
      {
        "s": "0.5 cup slices",
        "c": 8.32
      },
      {
        "s": "1 cucumber (8-1/4)",
        "c": 48.2
      }
    ]
  },
  {
    "i": 7170,
    "n": "Endive, raw",
    "ms": [
      {
        "s": "1 head",
        "c": 267
      },
      {
        "s": "0.5 cup, chopped",
        "c": 13
      }
    ]
  },
  {
    "i": 7174,
    "n": "Cress, garden, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 40.5
      },
      {
        "s": "1 sprig",
        "c": 0.81
      }
    ]
  },
  {
    "i": 7179,
    "n": "Cowpeas, young pods with seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 61.1
      },
      {
        "s": "1 pod",
        "c": 7.8
      }
    ]
  },
  {
    "i": 7185,
    "n": "Lima beans, immature seeds, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 53
      }
    ]
  },
  {
    "i": 7187,
    "n": "Asparagus, raw",
    "ms": [
      {
        "s": "1 spear, small (5 long or less)",
        "c": 2.88
      },
      {
        "s": "1 spear, medium (5-1/4 to 7 long)",
        "c": 3.84
      },
      {
        "s": "1 spear tip (2 long or less)",
        "c": 0.84
      },
      {
        "s": "1 spear, large (7-1/4 to 8-1/2)",
        "c": 4.8
      },
      {
        "s": "1 spear, extra large (8-3/4 to 10 long)",
        "c": 5.76
      },
      {
        "s": "1 cup",
        "c": 32.2
      }
    ]
  },
  {
    "i": 7189,
    "n": "Balsam-pear (bitter gourd), pods, raw",
    "ms": [
      {
        "s": "1 balsam-pear",
        "c": 23.6
      },
      {
        "s": "1 cup (1/2 pieces)",
        "c": 17.7
      }
    ]
  },
  {
    "i": 7190,
    "n": "Balsam-pear (bitter gourd), leafy tips, raw",
    "ms": [
      {
        "s": "1 leaf",
        "c": 3.36
      },
      {
        "s": "0.5 cup",
        "c": 20.2
      }
    ]
  },
  {
    "i": 7192,
    "n": "Beans, Kidney, Mature Seeds, Sprouted, Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "100 g",
        "c": 19
      }
    ]
  },
  {
    "i": 7193,
    "n": "Canadian bacon, cooked, pan-fried",
    "ms": [
      {
        "s": "1 slice",
        "c": 0.966
      }
    ]
  },
  {
    "i": 7194,
    "n": "Artichokes, (Globe Or French), Cooked, Boiled, Drained, With*",
    "ms": [
      {
        "s": "0.5 cup hearts",
        "c": 17.6
      },
      {
        "s": "1 artichoke, medium",
        "c": 25.2
      }
    ]
  },
  {
    "i": 7195,
    "n": "Alfalfa seeds, sprouted, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.96
      },
      {
        "s": "1 cup",
        "c": 10.6
      }
    ]
  },
  {
    "i": 7197,
    "n": "Bacon, pre-sliced, reduced/low sodium, unprepared",
    "ms": [
      {
        "s": "1 slice",
        "c": 1.04
      },
      {
        "s": "1 package",
        "c": 17.8
      }
    ]
  },
  {
    "i": 7199,
    "n": "Amaranth leaves, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 60.2
      },
      {
        "s": "1 leaf",
        "c": 30.1
      }
    ]
  },
  {
    "i": 7201,
    "n": "Pork, fresh, loin, blade (chops or roasts), boneless, separable lean and fat only, raw",
    "ms": [
      {
        "s": "1 chop",
        "c": 10.6
      },
      {
        "s": "4 oz",
        "c": 6.78
      }
    ]
  },
  {
    "i": 7203,
    "n": "Pork, fresh, blade, (chops), boneless, separable lean and fat, cooked, broiled",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 chop",
        "c": 10.5
      }
    ]
  },
  {
    "i": 7204,
    "n": "Pork, ground, 96% lean / 4% fat, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz grilled patties",
        "c": 17
      }
    ]
  },
  {
    "i": 7205,
    "n": "Pork, ground, 84% lean / 16% fat, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz grilled patties",
        "c": 17
      }
    ]
  },
  {
    "i": 7206,
    "n": "Pork loin, fresh, backribs, bone-in, raw, lean only",
    "ms": [
      {
        "s": "1 ribs",
        "c": 278
      },
      {
        "s": "4 oz",
        "c": 29.4
      }
    ]
  },
  {
    "i": 7207,
    "n": "Pork loin, fresh, backribs, bone-in, cooked-roasted, lean only",
    "ms": [
      {
        "s": "3 oz",
        "c": 37.4
      },
      {
        "s": "1 ribs",
        "c": 386
      }
    ]
  },
  {
    "i": 7208,
    "n": "Pork, ground, 72% lean / 28% fat, cooked, pan-broiled",
    "ms": [
      {
        "s": "3 oz grilled patties",
        "c": 17
      }
    ]
  },
  {
    "i": 7209,
    "n": "Pork, Shoulder petite tender, boneless, separable lean and fat, raw",
    "ms": [
      {
        "s": "1 piece",
        "c": 6.3
      }
    ]
  },
  {
    "i": 7211,
    "n": "Pork, Leg sirloin tip roast, boneless, separable lean and fat, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      },
      {
        "s": "1 piece",
        "c": 38.2
      }
    ]
  },
  {
    "i": 7212,
    "n": "Pork, ground, 84% lean / 16% fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 7213,
    "n": "Pork, loin, leg cap steak, boneless, separable lean and fat, cooked, broiled",
    "ms": [
      {
        "s": "1 piece",
        "c": 13.6
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 7214,
    "n": "Pork, fresh, shoulder, (Boston butt), blade (steaks), separable lean and fat,with added solution, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      },
      {
        "s": "1 steak",
        "c": 59
      }
    ]
  },
  {
    "i": 7218,
    "n": "Pork, fresh, enhanced, loin, tenderloin, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 7223,
    "n": "Pork, Cured, Ham, Shank, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "1 lb",
        "c": 27.2
      },
      {
        "s": "3 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 7226,
    "n": "Pork, Cured, Ham With Natural Juices, Whole, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz (3 oz)",
        "c": 5.1
      },
      {
        "s": "1 roast",
        "c": 89.8
      }
    ]
  },
  {
    "i": 7227,
    "n": "Pork, cured, ham with natural juices, spiral slice, boneless, separable lean and fat, heated, roasted",
    "ms": [
      {
        "s": "3 oz (3 oz)",
        "c": 3.4
      },
      {
        "s": "1 roast",
        "c": 36.8
      },
      {
        "s": "1 slice",
        "c": 5.8
      }
    ]
  },
  {
    "i": 7231,
    "n": "Pork, cured, ham -- water added, rump, bone-in, separable lean and fat, unheated",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.1
      },
      {
        "s": "1 lb",
        "c": 27.2
      }
    ]
  },
  {
    "i": 7233,
    "n": "Pork, Cured, Ham -- Water Added, Whole, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 roast",
        "c": 168
      },
      {
        "s": "3 oz (3 oz)",
        "c": 7.65
      }
    ]
  },
  {
    "i": 7235,
    "n": "Pork, cured, ham with natural juices, rump, bone-in, separable lean and fat, unheated",
    "ms": [
      {
        "s": "3 oz rump",
        "c": 6.8
      },
      {
        "s": "1 lb rump",
        "c": 36.3
      }
    ]
  },
  {
    "i": 7237,
    "n": "Pork, Cured, Ham -- Water Added, Whole, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz whole",
        "c": 6.8
      },
      {
        "s": "1 lb whole",
        "c": 36.3
      }
    ]
  },
  {
    "i": 7238,
    "n": "Pork, cured, ham with natural juices, shank, bone-in, separable lean and fat, unheated",
    "ms": [
      {
        "s": "1 lb shank",
        "c": 27.2
      },
      {
        "s": "3 oz shank",
        "c": 5.1
      }
    ]
  },
  {
    "i": 7239,
    "n": "Pork, Cured, Ham With Natural Juices, Slice, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 7.65
      },
      {
        "s": "1 slice",
        "c": 38.7
      }
    ]
  },
  {
    "i": 7240,
    "n": "Pork, Cured, Ham With Natural Juices, Spiral Slice, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 lb spiral slice",
        "c": 18.1
      },
      {
        "s": "3 oz spiral slice",
        "c": 3.4
      }
    ]
  },
  {
    "i": 7243,
    "n": "Pork, Cured, Ham -- Water Added, Shank, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 7248,
    "n": "Pork, cured, ham with natural juices, spiral slice, meat only, boneless, separable lean only, heated, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 3.4
      },
      {
        "s": "1 slice",
        "c": 5.8
      },
      {
        "s": "1 roast",
        "c": 36.8
      },
      {
        "s": "1 serving (3 oz)",
        "c": 3.4
      }
    ]
  },
  {
    "i": 7250,
    "n": "Pork, Cured, Ham And Water Product, Rump, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "1 roast rump",
        "c": 253
      },
      {
        "s": "3 oz (3 oz)",
        "c": 8.5
      }
    ]
  },
  {
    "i": 7251,
    "n": "Pork, Cured, Ham And Water Product, Whole, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 7252,
    "n": "Pork, Cured, Ham And Water Product, Whole, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 roast",
        "c": 160
      },
      {
        "s": "1 serving (3 oz)",
        "c": 6.8
      }
    ]
  },
  {
    "i": 7256,
    "n": "Pork, bacon, rendered fat, cooked",
    "ms": [
      {
        "s": "3 oz",
        "c": 0.85
      }
    ]
  },
  {
    "i": 7257,
    "n": "Pork, fresh, variety meats and by-products, stomach, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 12.8
      }
    ]
  },
  {
    "i": 7258,
    "n": "Pork, Cured, Ham And Water Product, Slice, Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz (3 oz)",
        "c": 6.8
      },
      {
        "s": "1 slice",
        "c": 11
      }
    ]
  },
  {
    "i": 7259,
    "n": "Pork, cured, bacon, pre-sliced, cooked, pan-fried",
    "ms": [
      {
        "s": "1 slice",
        "c": 1.26
      },
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 7260,
    "n": "Pork, cured, bacon, cooked, microwaved",
    "ms": [
      {
        "s": "1 slice cooked",
        "c": 1.18
      }
    ]
  },
  {
    "i": 7263,
    "n": "Pork, fresh, composite of trimmed retail cuts (loin and shoulder blade), separable lean and fat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 72.6
      },
      {
        "s": "1 oz",
        "c": 4.54
      }
    ]
  },
  {
    "i": 7265,
    "n": "Pork, Fresh, Loin, Top Loin (*",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 roast",
        "c": 110
      }
    ]
  },
  {
    "i": 7268,
    "n": "Pork, fresh, loin, tenderloin, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 roast (Yield from 1 raw roast, with refuse, weighing 504g)",
        "c": 30.3
      }
    ]
  },
  {
    "i": 7276,
    "n": "Pork, fresh, loin, country-style ribs, separable lean only, raw",
    "ms": [
      {
        "s": "1 rib",
        "c": 41.4
      },
      {
        "s": "4 oz",
        "c": 23.7
      }
    ]
  },
  {
    "i": 7282,
    "n": "Pork, fresh, loin, center loin (chops), boneless, separable lean and fat, cooked, pan-broiled",
    "ms": [
      {
        "s": "1 chop",
        "c": 12.3
      },
      {
        "s": "3 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 7285,
    "n": "Pork, fresh, backribs, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 35
      }
    ]
  },
  {
    "i": 7286,
    "n": "Pork, cured, ham, boneless, extra lean and regular, unheated",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 cup",
        "c": 9.8
      },
      {
        "s": "1 slice (6-1/4 x 4 x 1/16) (1 oz)",
        "c": 1.96
      }
    ]
  },
  {
    "i": 7287,
    "n": "Pork, fresh, variety meats and by-products, feet, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 0
      }
    ]
  },
  {
    "i": 7291,
    "n": "Pork, fresh, variety meats and by-products, tail, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.1
      },
      {
        "s": "4 oz",
        "c": 20.3
      }
    ]
  },
  {
    "i": 7293,
    "n": "Pork, cured, salt pork, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "8 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 7294,
    "n": "Pork, cured, shoulder, blade roll, separable lean and fat, roasted",
    "ms": [
      {
        "s": "1 piece, cooked (yield from 1 lb unheated product)",
        "c": 26.3
      },
      {
        "s": "3 oz",
        "c": 5.95
      }
    ]
  },
  {
    "i": 7296,
    "n": "Pork, cured, shoulder, blade roll, separable lean and fat, unheated",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.98
      },
      {
        "s": "4 oz",
        "c": 7.91
      }
    ]
  },
  {
    "i": 7299,
    "n": "Pork, cured, ham, center slice, country-style, separable lean only, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 7300,
    "n": "Pork, cured, ham, whole, separable lean only, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 5.95
      },
      {
        "s": "1 cup",
        "c": 9.8
      }
    ]
  },
  {
    "i": 7302,
    "n": "Pork, cured, ham, center slice, separable lean and fat, unheated",
    "ms": [
      {
        "s": "4 oz",
        "c": 7.91
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 7303,
    "n": "Pork, cured, breakfast strips, raw or unheated",
    "ms": [
      {
        "s": "3 slices",
        "c": 5.44
      },
      {
        "s": "1 package (12 oz)",
        "c": 27.2
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 7305,
    "n": "Pork, fresh, variety meats and by-products, pancreas, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 oz",
        "c": 3.12
      }
    ]
  },
  {
    "i": 7306,
    "n": "Pork, fresh, variety meats and by-products, mechanically separated, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 89.3
      },
      {
        "s": "1 lb",
        "c": 1430
      }
    ]
  },
  {
    "i": 7308,
    "n": "Pork, fresh, variety meats and by-products, tongue, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 4.54
      },
      {
        "s": "4 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 7309,
    "n": "Pork, cured, bacon, unprepared",
    "ms": [
      {
        "s": "4 oz",
        "c": 6.78
      },
      {
        "s": "1 slice raw",
        "c": 1.68
      },
      {
        "s": "1 package",
        "c": 26.5
      }
    ]
  },
  {
    "i": 7310,
    "n": "Pork, fresh, variety meats and by-products, jowl, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.13
      },
      {
        "s": "4 oz",
        "c": 4.52
      }
    ]
  },
  {
    "i": 7312,
    "n": "Pork, fresh, variety meats and by-products, chitterlings, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 7313,
    "n": "Pork, fresh, variety meats and by-products, kidneys, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 kidney",
        "c": 21
      }
    ]
  },
  {
    "i": 7315,
    "n": "Pork, fresh, variety meats and by-products, heart, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.42
      },
      {
        "s": "1 heart",
        "c": 11.3
      }
    ]
  },
  {
    "i": 7318,
    "n": "Pork, fresh, shoulder, blade, boston (steaks), separable lean only, cooked, broiled",
    "ms": [
      {
        "s": "1 steak, excluding refuse (yield from 1 raw steak, with refuse, weighing 300 g)",
        "c": 48.5
      },
      {
        "s": "3 oz",
        "c": 28
      }
    ]
  },
  {
    "i": 7319,
    "n": "Pork, fresh, variety meats and by-products, brain, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 11.3
      },
      {
        "s": "1 oz",
        "c": 2.84
      }
    ]
  },
  {
    "i": 7323,
    "n": "Pork, fresh, shoulder, arm picnic, separable lean only, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 12.4
      },
      {
        "s": "1 roast",
        "c": 302
      }
    ]
  },
  {
    "i": 7355,
    "n": "Pork, Fresh, Leg (Ham), Shank Half, Separable Lean*",
    "ms": [
      {
        "s": "1 lb",
        "c": 54.4
      },
      {
        "s": "1 roast",
        "c": 464
      },
      {
        "s": "4 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 7359,
    "n": "Pork, fresh, carcass, separable lean and fat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 86.2
      },
      {
        "s": "1 oz",
        "c": 5.39
      }
    ]
  },
  {
    "i": 7365,
    "n": "Plantains, green, raw",
    "ms": [
      {
        "s": "1 plantain",
        "c": 5.34
      }
    ]
  },
  {
    "i": 7366,
    "n": "Raspberry juice concentrate",
    "ms": [
      {
        "s": "100 g",
        "c": 97
      }
    ]
  },
  {
    "i": 7372,
    "n": "Cranberry juice blend, 100% juice, bottled, with added vitamin C and calcium",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 45.6
      },
      {
        "s": "6.75 fl oz",
        "c": 38
      }
    ]
  },
  {
    "i": 7375,
    "n": "Grape juice, canned or bottled, unsweetened, with added ascorbic acid and calcium",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 13.3
      },
      {
        "s": "1 cup",
        "c": 106
      }
    ]
  },
  {
    "i": 7376,
    "n": "Apples, raw, golden delicious, with skin",
    "ms": [
      {
        "s": "1 small",
        "c": 7.74
      },
      {
        "s": "1 cup, sliced",
        "c": 6.54
      },
      {
        "s": "1 medium",
        "c": 10.1
      },
      {
        "s": "1 large",
        "c": 12.9
      }
    ]
  },
  {
    "i": 7377,
    "n": "Pineapple juice, canned, not from concentrate, unsweetened, with added vitamins A, C and E",
    "ms": [
      {
        "s": "1 cup",
        "c": 35
      },
      {
        "s": "1 fl oz",
        "c": 4.38
      }
    ]
  },
  {
    "i": 7383,
    "n": "Pineapple, raw, extra sweet variety",
    "ms": [
      {
        "s": "1 NLEA serving",
        "c": 14.6
      },
      {
        "s": "1 fruit",
        "c": 118
      },
      {
        "s": "1 cup, chunks",
        "c": 21.4
      },
      {
        "s": "1 slice (4-2/3 dia x 3/4 thick)",
        "c": 21.6
      }
    ]
  },
  {
    "i": 7384,
    "n": "Juice, apple, grape and pear blend, with added ascorbic acid and calcium",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 180
      }
    ]
  },
  {
    "i": 7386,
    "n": "Clementines, raw",
    "ms": [
      {
        "s": "1 fruit",
        "c": 22.2
      }
    ]
  },
  {
    "i": 7387,
    "n": "Pineapple, raw, traditional varieties",
    "ms": [
      {
        "s": "1 cup, chunks",
        "c": 21.4
      },
      {
        "s": "1 slice (4-2/3 dia x 3/4 thick)",
        "c": 22.8
      },
      {
        "s": "1 NLEA serving",
        "c": 14.6
      },
      {
        "s": "1 fruit",
        "c": 130
      }
    ]
  },
  {
    "i": 7388,
    "n": "Juice, apple and grape blend, with added ascorbic acid",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 27.5
      }
    ]
  },
  {
    "i": 7392,
    "n": "Apple juice, frozen concentrate, unsweetened, undiluted, with added ascorbic acid",
    "ms": [
      {
        "s": "1 can (6 fl oz)",
        "c": 42.2
      }
    ]
  },
  {
    "i": 7394,
    "n": "Pineapple juice, canned or bottled, unsweetened, with added ascorbic acid",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.5
      },
      {
        "s": "1 fl oz",
        "c": 4.07
      }
    ]
  },
  {
    "i": 7396,
    "n": "Dates, medjool",
    "ms": [
      {
        "s": "1 date, pitted",
        "c": 15.4
      }
    ]
  },
  {
    "i": 7398,
    "n": "Pears, asian, raw",
    "ms": [
      {
        "s": "1 fruit 2-1/4 high x 2-1/2 dia",
        "c": 4.88
      },
      {
        "s": "1 fruit 3-3/8 high x 3 diameter",
        "c": 11
      }
    ]
  },
  {
    "i": 7402,
    "n": "Fruit cocktail, canned, heavy syrup, drained",
    "ms": [
      {
        "s": "1 cup",
        "c": 15
      }
    ]
  },
  {
    "i": 7405,
    "n": "Sugar-apples, (sweetsop), raw",
    "ms": [
      {
        "s": "1 cup, pulp",
        "c": 60
      },
      {
        "s": "1 fruit (2-7/8 dia)",
        "c": 37.2
      }
    ]
  },
  {
    "i": 7409,
    "n": "Feijoa, raw",
    "ms": [
      {
        "s": "1 cup 1/2 chunks",
        "c": 34.8
      },
      {
        "s": "1 cup, pureed",
        "c": 41.3
      },
      {
        "s": "1 fruit without peel",
        "c": 7.14
      }
    ]
  },
  {
    "i": 7410,
    "n": "Rose-apples, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 29
      }
    ]
  },
  {
    "i": 7412,
    "n": "Raisins, golden, seedless",
    "ms": [
      {
        "s": "1 cup, packed",
        "c": 106
      },
      {
        "s": "1 cup (not packed)",
        "c": 92.8
      }
    ]
  },
  {
    "i": 7413,
    "n": "Roselle, raw",
    "ms": [
      {
        "s": "1 cup, without refuse",
        "c": 123
      }
    ]
  },
  {
    "i": 7416,
    "n": "Raisins, seeded",
    "ms": [
      {
        "s": "1 cup (not packed)",
        "c": 40.6
      },
      {
        "s": "1 cup, packed",
        "c": 46.2
      }
    ]
  },
  {
    "i": 7418,
    "n": "Plums, dried (prunes), uncooked",
    "ms": [
      {
        "s": "1 prune, pitted",
        "c": 4.08
      },
      {
        "s": "1 cup, pitted",
        "c": 74.8
      }
    ]
  },
  {
    "i": 7419,
    "n": "Lime juice, raw",
    "ms": [
      {
        "s": "1 lime yields",
        "c": 6.16
      },
      {
        "s": "1 fl oz",
        "c": 4.31
      },
      {
        "s": "1 cup",
        "c": 33.9
      }
    ]
  },
  {
    "i": 7420,
    "n": "Prunes, dehydrated (low-moisture), stewed",
    "ms": [
      {
        "s": "1 cup",
        "c": 67.2
      }
    ]
  },
  {
    "i": 7421,
    "n": "Lime juice, canned or bottled, unsweetened",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.7
      },
      {
        "s": "1 cup",
        "c": 29.5
      }
    ]
  },
  {
    "i": 7422,
    "n": "Prunes, dehydrated (low-moisture), uncooked",
    "ms": [
      {
        "s": "1 cup",
        "c": 95
      }
    ]
  },
  {
    "i": 7423,
    "n": "Blueberries, dried, sweetened",
    "ms": [
      {
        "s": "0.25 cup",
        "c": 7.6
      }
    ]
  },
  {
    "i": 7424,
    "n": "Quinces, raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 10.1
      }
    ]
  },
  {
    "i": 7426,
    "n": "Frog legs, raw",
    "ms": [
      {
        "s": "1 leg",
        "c": 8.1
      }
    ]
  },
  {
    "i": 7427,
    "n": "Fish, mackerel, salted",
    "ms": [
      {
        "s": "1 piece (5-1/2 x 1-1/2 x 1/2)",
        "c": 52.8
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 11.2
      },
      {
        "s": "1 cup, cooked",
        "c": 89.8
      }
    ]
  },
  {
    "i": 7428,
    "n": "Kiwifruit, green, raw",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 61.2
      },
      {
        "s": "1 NLEA serving",
        "c": 50.3
      },
      {
        "s": "1 fruit (2 dia)",
        "c": 23.5
      }
    ]
  },
  {
    "i": 7429,
    "n": "Limes, raw",
    "ms": [
      {
        "s": "1 NLEA serving",
        "c": 22.1
      },
      {
        "s": "1 fruit (2 dia)",
        "c": 22.1
      }
    ]
  },
  {
    "i": 7430,
    "n": "Jujube, Chinese, fresh, dried",
    "ms": [
      {
        "s": "100 g",
        "c": 63
      }
    ]
  },
  {
    "i": 7431,
    "n": "Kumquats, raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 11.8
      }
    ]
  },
  {
    "i": 7432,
    "n": "Jujube, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 21
      }
    ]
  },
  {
    "i": 7433,
    "n": "Java-plum, (jambolan), raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 25.6
      },
      {
        "s": "3 fruit",
        "c": 1.71
      }
    ]
  },
  {
    "i": 7434,
    "n": "Jellies, reduced sugar, home preserved",
    "ms": [
      {
        "s": "1 cup",
        "c": 15
      },
      {
        "s": "1 tbsp",
        "c": 0.95
      }
    ]
  },
  {
    "i": 7435,
    "n": "Sweeteners, tabletop, fructose, liquid",
    "ms": [
      {
        "s": "1 serving",
        "c": 0.001
      }
    ]
  },
  {
    "i": 7436,
    "n": "Puddings, chocolate flavor, low calorie, instant, dry mix",
    "ms": [
      {
        "s": "1 package 1.4 oz box, 4 servings",
        "c": 50.4
      },
      {
        "s": "1 serving",
        "c": 12.5
      }
    ]
  },
  {
    "i": 7438,
    "n": "Vital wheat gluten",
    "ms": [
      {
        "s": "100 g",
        "c": 142
      }
    ]
  },
  {
    "i": 7440,
    "n": "Puddings, all flavors except chocolate, low calorie, instant, dry mix",
    "ms": [
      {
        "s": "1 serving",
        "c": 11.4
      },
      {
        "s": "1 package 4 servings",
        "c": 45.8
      }
    ]
  },
  {
    "i": 7441,
    "n": "Popcorn, microwave, low fat and sodium",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      }
    ]
  },
  {
    "i": 7444,
    "n": "Ice creams, chocolate, rich",
    "ms": [
      {
        "s": "1 cup",
        "c": 210
      },
      {
        "s": "1 cubic inch",
        "c": 14.5
      }
    ]
  },
  {
    "i": 7445,
    "n": "Snacks, tortilla chips, light (baked with less oil)",
    "ms": [
      {
        "s": "10 chips",
        "c": 25.4
      },
      {
        "s": "1 cup, crushed",
        "c": 100
      }
    ]
  },
  {
    "i": 7447,
    "n": "Jellyfish, dried, salted",
    "ms": [
      {
        "s": "1 cup",
        "c": 1.16
      }
    ]
  },
  {
    "i": 7448,
    "n": "Frankfurter, low sodium",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 30.2
      },
      {
        "s": "1 frankfurter",
        "c": 11.4
      }
    ]
  },
  {
    "i": 7455,
    "n": "Beverages, coffee, instant, with whitener, reduced calorie",
    "ms": [
      {
        "s": "1 tsp dry",
        "c": 0.306
      }
    ]
  },
  {
    "i": 7456,
    "n": "Snacks, corn-based, extruded, chips, unsalted",
    "ms": [
      {
        "s": "1 bag, single serving",
        "c": 34.7
      },
      {
        "s": "10 chips",
        "c": 22.3
      },
      {
        "s": "1 cup, crushed",
        "c": 109
      }
    ]
  },
  {
    "i": 7457,
    "n": "Beverages, cranberry-apple juice drink, low calorie, with vitamin C added",
    "ms": [
      {
        "s": "1 cup (8 fl oz)",
        "c": 24
      },
      {
        "s": "1 fl oz",
        "c": 3
      }
    ]
  },
  {
    "i": 7458,
    "n": "Rolls, pumpernickel",
    "ms": [
      {
        "s": "1 medium (2-1/2 dia)",
        "c": 24.1
      },
      {
        "s": "1 roll (pan, dinner, or small roll) (2 square, 2 high)",
        "c": 18.8
      }
    ]
  },
  {
    "i": 7459,
    "n": "Cheese, pasteurized process, cheddar or American, low sodium",
    "ms": [
      {
        "s": "1 cup, shredded",
        "c": 696
      },
      {
        "s": "1 slice",
        "c": 129
      },
      {
        "s": "1 cup, diced",
        "c": 862
      },
      {
        "s": "1 cubic inch",
        "c": 111
      }
    ]
  },
  {
    "i": 7461,
    "n": "Mayonnaise, low sodium, low calorie or diet",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0
      },
      {
        "s": "1 cup",
        "c": 0
      }
    ]
  },
  {
    "i": 7462,
    "n": "Cranberry juice, unsweetened",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.53
      },
      {
        "s": "1 cup",
        "c": 20.2
      }
    ]
  },
  {
    "i": 7463,
    "n": "Snacks, tortilla chips, unsalted, white corn",
    "ms": [
      {
        "s": "1 cup",
        "c": 45.2
      },
      {
        "s": "1 bag, single serving",
        "c": 48.7
      },
      {
        "s": "10 chips",
        "c": 31.3
      }
    ]
  },
  {
    "i": 7464,
    "n": "Beef, bologna, reduced sodium",
    "ms": [
      {
        "s": "1 cup pieces",
        "c": 16.6
      },
      {
        "s": "1 slice, medium",
        "c": 3.36
      },
      {
        "s": "1 slice, thin",
        "c": 1.68
      },
      {
        "s": "1 slice, thick",
        "c": 5.16
      }
    ]
  },
  {
    "i": 7465,
    "n": "Turkey, light or dark meat, smoked, cooked, with skin, bone removed",
    "ms": [
      {
        "s": "3 oz, boneless",
        "c": 22.1
      },
      {
        "s": "1 medium slice (approx 3 x 2 x 1/4)",
        "c": 7.28
      },
      {
        "s": "1 thick slice (approx 3 x 2 x 3/8)",
        "c": 10.9
      }
    ]
  },
  {
    "i": 7467,
    "n": "Cheese, cottage, lowfat, 1% milkfat, no sodium added",
    "ms": [
      {
        "s": "1 cup",
        "c": 138
      },
      {
        "s": "4 oz",
        "c": 68.9
      }
    ]
  },
  {
    "i": 7469,
    "n": "Rice cake, cracker (include hain mini rice cakes)",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 0.462
      }
    ]
  },
  {
    "i": 7471,
    "n": "Salad dressing, mayonnaise and mayonnaise-type, low calorie",
    "ms": [
      {
        "s": "1 cup",
        "c": 32.5
      },
      {
        "s": "1 tbsp",
        "c": 2.03
      }
    ]
  },
  {
    "i": 7473,
    "n": "Pork, cured, ham, low sodium, lean and fat, cooked",
    "ms": [
      {
        "s": "3 oz, boneless",
        "c": 6.8
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 1.36
      }
    ]
  },
  {
    "i": 7474,
    "n": "Frozen novelties, juice type, orange",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.68
      },
      {
        "s": "1 bar",
        "c": 6.66
      }
    ]
  },
  {
    "i": 7478,
    "n": "Papad",
    "ms": [
      {
        "s": "100 g",
        "c": 143
      }
    ]
  },
  {
    "i": 7480,
    "n": "Frozen yogurts, chocolate, nonfat milk, sweetened without sugar",
    "ms": [
      {
        "s": "1 cup",
        "c": 296
      }
    ]
  },
  {
    "i": 7481,
    "n": "Granola bar, soft, milk chocolate coated, peanut butter",
    "ms": [
      {
        "s": "1 oz",
        "c": 30.6
      }
    ]
  },
  {
    "i": 7482,
    "n": "Salad dressing, italian dressing, reduced calorie",
    "ms": [
      {
        "s": "1 cup",
        "c": 13
      },
      {
        "s": "1 tbsp",
        "c": 0.84
      }
    ]
  },
  {
    "i": 7483,
    "n": "Cream substitute, liquid, light",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.42
      },
      {
        "s": "1 fl oz",
        "c": 0.3
      }
    ]
  },
  {
    "i": 7484,
    "n": "Creamy dressing, made with sour cream and/or buttermilk and oil, reduced calorie, cholesterol-free",
    "ms": [
      {
        "s": "1 cup",
        "c": 84.2
      },
      {
        "s": "1 tbsp",
        "c": 5.4
      }
    ]
  },
  {
    "i": 7486,
    "n": "Creamy dressing, made with sour cream and/or buttermilk and oil, reduced calorie, fat-free",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 6.12
      },
      {
        "s": "1 cup",
        "c": 95
      }
    ]
  },
  {
    "i": 7487,
    "n": "Mayonnaise, reduced-calorie or diet, cholesterol-free",
    "ms": [
      {
        "s": "1 cup",
        "c": 0
      },
      {
        "s": "1 tbsp",
        "c": 0
      }
    ]
  },
  {
    "i": 7489,
    "n": "Salad dressing, peppercorn dressing, commercial, regular",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 5.72
      },
      {
        "s": "1 tbsp",
        "c": 2.95
      }
    ]
  },
  {
    "i": 7491,
    "n": "Ham, turkey, sliced, extra lean, prepackaged or deli",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 1
      },
      {
        "s": "1 cup pieces",
        "c": 6.9
      }
    ]
  },
  {
    "i": 7492,
    "n": "Imitation cheese, american or cheddar, low cholesterol",
    "ms": [
      {
        "s": "1 cubic inch",
        "c": 127
      },
      {
        "s": "1 cup, shredded",
        "c": 797
      }
    ]
  },
  {
    "i": 7494,
    "n": "Syrups, grenadine",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.2
      },
      {
        "s": "1 tsp",
        "c": 0.402
      }
    ]
  },
  {
    "i": 7497,
    "n": "Restaurant, Chinese, vegetable chow mein, without meat or noodles",
    "ms": [
      {
        "s": "1 order",
        "c": 194
      },
      {
        "s": "1 cup",
        "c": 48.8
      }
    ]
  },
  {
    "i": 7561,
    "n": "Cookies, animal crackers (includes arrowroot, tea biscuits)",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      },
      {
        "s": "1 cracker",
        "c": 1.08
      },
      {
        "s": "1 individual box (2 oz)",
        "c": 24.5
      },
      {
        "s": "1 Arrowroot biscuit (include Arrowroot cookie)",
        "c": 2.11
      }
    ]
  },
  {
    "i": 7564,
    "n": "Bread, multi-grain (includes whole-grain)",
    "ms": [
      {
        "s": "1 oz",
        "c": 29.2
      },
      {
        "s": "1 slice regular",
        "c": 26.8
      },
      {
        "s": "1 slice large",
        "c": 42.2
      }
    ]
  },
  {
    "i": 7570,
    "n": "Candies, milk chocolate coated peanuts",
    "ms": [
      {
        "s": "1 cup",
        "c": 155
      },
      {
        "s": "10 pieces",
        "c": 41.6
      }
    ]
  },
  {
    "i": 7574,
    "n": "Chocolate-flavored hazelnut spread",
    "ms": [
      {
        "s": "1 serving 2 TBSP",
        "c": 40
      }
    ]
  },
  {
    "i": 7575,
    "n": "Candies, halavah, plain",
    "ms": [
      {
        "s": "1 oz",
        "c": 9.36
      }
    ]
  },
  {
    "i": 7577,
    "n": "Puddings, chocolate, dry mix, instant, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup From 19211",
        "c": 148
      }
    ]
  },
  {
    "i": 7578,
    "n": "Candies, marshmallows",
    "ms": [
      {
        "s": "1 regular",
        "c": 0.216
      },
      {
        "s": "1 cup of miniature",
        "c": 1.5
      },
      {
        "s": "10 miniatures",
        "c": 0.21
      }
    ]
  },
  {
    "i": 7579,
    "n": "Baking chocolate, mexican, squares",
    "ms": [
      {
        "s": "1 tablet",
        "c": 6.8
      }
    ]
  },
  {
    "i": 7581,
    "n": "Candies, hard",
    "ms": [
      {
        "s": "1 piece",
        "c": 0.18
      },
      {
        "s": "1 oz",
        "c": 0.85
      },
      {
        "s": "1 piece, small",
        "c": 0.09
      }
    ]
  },
  {
    "i": 7582,
    "n": "Candies, gumdrops, starch jelly pieces",
    "ms": [
      {
        "s": "10 gummy bears",
        "c": 0.66
      },
      {
        "s": "10 gummy worms",
        "c": 2.22
      },
      {
        "s": "10 gummy fish",
        "c": 1.5
      },
      {
        "s": "1 jelly ring (1-1/4 dia)",
        "c": 0.3
      },
      {
        "s": "1 spice stick",
        "c": 0.285
      },
      {
        "s": "1 gumdrop, large (1 dia)",
        "c": 0.348
      },
      {
        "s": "1 gumdrop, medium (3/4 dia)",
        "c": 0.126
      },
      {
        "s": "10 gumdrops",
        "c": 1.08
      },
      {
        "s": "1 spice drop",
        "c": 0.72
      },
      {
        "s": "1 cup gumdrops",
        "c": 5.46
      },
      {
        "s": "10 gummy dinosaurs",
        "c": 1.89
      },
      {
        "s": "1 gumdrop, small (1/2 dia)",
        "c": 0.096
      }
    ]
  },
  {
    "i": 7583,
    "n": "Candies, jellybeans",
    "ms": [
      {
        "s": "10 large (1 oz)",
        "c": 0.84
      },
      {
        "s": "10 small",
        "c": 0.33
      }
    ]
  },
  {
    "i": 7588,
    "n": "Ice creams, french vanilla, soft-serve",
    "ms": [
      {
        "s": "0.5 cup (4 fl oz)",
        "c": 113
      }
    ]
  },
  {
    "i": 7590,
    "n": "Candies, sweet chocolate coated fondant",
    "ms": [
      {
        "s": "1 patty, large",
        "c": 7.31
      },
      {
        "s": "1 patty, small",
        "c": 1.87
      }
    ]
  },
  {
    "i": 7591,
    "n": "Candies, confectioner's coating, butterscotch",
    "ms": [
      {
        "s": "1 cup chips",
        "c": 57.8
      },
      {
        "s": "1 oz",
        "c": 9.64
      }
    ]
  },
  {
    "i": 7597,
    "n": "Candies, carob, unsweetened",
    "ms": [
      {
        "s": "1 bar (3 oz)",
        "c": 264
      },
      {
        "s": "1 oz",
        "c": 85.9
      }
    ]
  },
  {
    "i": 7598,
    "n": "Candies, semisweet chocolate",
    "ms": [
      {
        "s": "1 cup large chips",
        "c": 58.2
      },
      {
        "s": "1 oz (approx 60 pcs)",
        "c": 9.07
      },
      {
        "s": "1 serving",
        "c": 4.64
      },
      {
        "s": "1 cup chips (6 oz package)",
        "c": 53.8
      },
      {
        "s": "1 cup mini chips",
        "c": 55.4
      }
    ]
  },
  {
    "i": 7599,
    "n": "Candies, butterscotch",
    "ms": [
      {
        "s": "3 pieces",
        "c": 0.64
      },
      {
        "s": "1 oz",
        "c": 1.13
      }
    ]
  },
  {
    "i": 7600,
    "n": "Candies, caramels",
    "ms": [
      {
        "s": "1 package (2.5 oz)",
        "c": 98
      },
      {
        "s": "1 piece",
        "c": 13.9
      }
    ]
  },
  {
    "i": 7602,
    "n": "Candies, sweet chocolate",
    "ms": [
      {
        "s": "1 oz",
        "c": 6.8
      },
      {
        "s": "1 bar (1.45 oz)",
        "c": 9.84
      }
    ]
  },
  {
    "i": 7603,
    "n": "Snacks, tortilla chips, taco-flavor",
    "ms": [
      {
        "s": "1 oz",
        "c": 43.9
      },
      {
        "s": "1 bag (8 oz)",
        "c": 352
      }
    ]
  },
  {
    "i": 7605,
    "n": "Snacks, rice cracker brown rice, plain",
    "ms": [
      {
        "s": "1 cake",
        "c": 0.99
      },
      {
        "s": "2 cakes",
        "c": 1.98
      }
    ]
  },
  {
    "i": 7606,
    "n": "Snacks, trail mix, tropical",
    "ms": [
      {
        "s": "1.5 oz",
        "c": 23.9
      },
      {
        "s": "1 cup",
        "c": 79.8
      },
      {
        "s": "1 oz",
        "c": 16.2
      }
    ]
  },
  {
    "i": 7607,
    "n": "Snacks, pretzels, hard, whole-wheat including both salted and unsalted",
    "ms": [
      {
        "s": "2 oz",
        "c": 16
      },
      {
        "s": "1 oz",
        "c": 7.94
      }
    ]
  },
  {
    "i": 7608,
    "n": "Snacks, Rice Cakes, Brown Rice, Buckwheat*",
    "ms": [
      {
        "s": "2 cakes",
        "c": 1.98
      },
      {
        "s": "1 cake",
        "c": 0.99
      }
    ]
  },
  {
    "i": 7610,
    "n": "Snacks, pork skins, plain",
    "ms": [
      {
        "s": "0.5 oz",
        "c": 4.26
      },
      {
        "s": "1 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 7611,
    "n": "Snacks, potato chips, sour-cream-and-onion-flavor",
    "ms": [
      {
        "s": "1 oz",
        "c": 20.4
      },
      {
        "s": "1 bag (7 oz)",
        "c": 143
      }
    ]
  },
  {
    "i": 7613,
    "n": "Snacks, potato chips, barbecue-flavor",
    "ms": [
      {
        "s": "1 bag (7 oz)",
        "c": 63.4
      },
      {
        "s": "1 oz",
        "c": 9.07
      }
    ]
  },
  {
    "i": 7614,
    "n": "Snacks, popcorn, cheese-flavor",
    "ms": [
      {
        "s": "1 cup",
        "c": 12.4
      },
      {
        "s": "1 oz",
        "c": 32
      }
    ]
  },
  {
    "i": 7616,
    "n": "Syrup, fruit flavored",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 7617,
    "n": "Snacks, granola bars, soft, uncoated, peanut butter",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 25.5
      }
    ]
  },
  {
    "i": 7618,
    "n": "Snacks, granola bars, soft, uncoated, plain",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 29.4
      }
    ]
  },
  {
    "i": 7619,
    "n": "Snacks, oriental mix, rice-based",
    "ms": [
      {
        "s": "1 oz",
        "c": 15.3
      },
      {
        "s": "2 oz",
        "c": 30.8
      }
    ]
  },
  {
    "i": 7621,
    "n": "Snacks, crisped rice bar, chocolate chip",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 5.88
      }
    ]
  },
  {
    "i": 7622,
    "n": "Fruit syrup",
    "ms": [
      {
        "s": "1 cup",
        "c": 26.7
      },
      {
        "s": "0.25 cup",
        "c": 6.72
      }
    ]
  },
  {
    "i": 7623,
    "n": "Snacks, granola bars, hard, chocolate chip",
    "ms": [
      {
        "s": "1 oz",
        "c": 21.8
      },
      {
        "s": "1 bar",
        "c": 18.5
      }
    ]
  },
  {
    "i": 7624,
    "n": "Snacks, corn-based, extruded, onion-flavor",
    "ms": [
      {
        "s": "1 oz",
        "c": 8.22
      },
      {
        "s": "2 oz",
        "c": 16.5
      }
    ]
  },
  {
    "i": 7626,
    "n": "Bread, cheese",
    "ms": [
      {
        "s": "1 slice",
        "c": 43.2
      }
    ]
  },
  {
    "i": 7627,
    "n": "Focaccia, Italian flatbread, plain",
    "ms": [
      {
        "s": "1 piece",
        "c": 20
      }
    ]
  },
  {
    "i": 7629,
    "n": "Bread, potato",
    "ms": [
      {
        "s": "1 slice",
        "c": 60.2
      }
    ]
  },
  {
    "i": 7631,
    "n": "Crackers, saltines, whole wheat (includes multi-grain)",
    "ms": [
      {
        "s": "1 serving",
        "c": 0
      }
    ]
  },
  {
    "i": 7632,
    "n": "Cinnamon buns, frosted (includes honey buns)",
    "ms": [
      {
        "s": "1 bun",
        "c": 119
      }
    ]
  },
  {
    "i": 7634,
    "n": "Garlic bread, frozen",
    "ms": [
      {
        "s": "1 slice",
        "c": 15.9
      },
      {
        "s": "1 slice presliced",
        "c": 11.6
      }
    ]
  },
  {
    "i": 7635,
    "n": "Cake, pound, Bimbo Bakeries USA, Panque Casero, home baked style",
    "ms": [
      {
        "s": "1 loaf",
        "c": 162
      },
      {
        "s": "1 slice",
        "c": 20.3
      }
    ]
  },
  {
    "i": 7636,
    "n": "Pan Dulce, La Ricura, Salpora de Arroz con Azucar, cookie-like, contains wheat flour and rice flour",
    "ms": [
      {
        "s": "1 piece (1 serving)",
        "c": 21.8
      }
    ]
  },
  {
    "i": 7637,
    "n": "Keikitos (muffins), Latino bakery item",
    "ms": [
      {
        "s": "1 piece",
        "c": 26.5
      }
    ]
  },
  {
    "i": 7638,
    "n": "Bread, pan dulce, sweet yeast bread",
    "ms": [
      {
        "s": "1 slice (average weight of 1 slice)",
        "c": 54.2
      }
    ]
  },
  {
    "i": 7639,
    "n": "Crackers, wheat, reduced fat",
    "ms": [
      {
        "s": "1 cracker",
        "c": 1.44
      },
      {
        "s": "16 crackers, Wheat Thins",
        "c": 23.2
      },
      {
        "s": "1 serving",
        "c": 23.2
      }
    ]
  },
  {
    "i": 7641,
    "n": "Pie crust, refrigerated, regular, unbaked",
    "ms": [
      {
        "s": "1 pie crust (average weight)",
        "c": 22.9
      }
    ]
  },
  {
    "i": 7642,
    "n": "Toaster Pastries, fruit, frosted (include apples, blueberry, cherry, strawberry)",
    "ms": [
      {
        "s": "1 piece",
        "c": 6.36
      },
      {
        "s": "1 oz",
        "c": 3.4
      }
    ]
  },
  {
    "i": 7643,
    "n": "Pie crust, refrigerated, regular, baked",
    "ms": [
      {
        "s": "1 pie crust",
        "c": 23.8
      }
    ]
  },
  {
    "i": 7647,
    "n": "Toaster pastries, fruit, toasted (include apple, blueberry, cherry, strawberry)",
    "ms": [
      {
        "s": "1 pastry",
        "c": 5.61
      }
    ]
  },
  {
    "i": 7649,
    "n": "Pork, Cured, Ham With Natural Juices, Shank, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "1 serving (3 oz)",
        "c": 5.95
      },
      {
        "s": "1 roast shank",
        "c": 222
      }
    ]
  },
  {
    "i": 7651,
    "n": "Crackers, cheese, sandwich-type with cheese filling",
    "ms": [
      {
        "s": "1 sandwich",
        "c": 5.78
      },
      {
        "s": "6 cracker 1 cracker = 6.5g",
        "c": 34.7
      }
    ]
  },
  {
    "i": 7655,
    "n": "Pork, Cured, Ham -- Water Added, Rump, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "1 roast rump",
        "c": 238
      },
      {
        "s": "3 serving (3 oz)",
        "c": 6.8
      }
    ]
  },
  {
    "i": 7656,
    "n": "Pork, Cured, Ham -- Water Added, Shank, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "1 roast shank",
        "c": 275
      },
      {
        "s": "3 oz (3 oz)",
        "c": 7.65
      }
    ]
  },
  {
    "i": 7659,
    "n": "Pork, Cured, Ham -- Water Added, Slice, Bone-In, Separable Lean*",
    "ms": [
      {
        "s": "1 slice",
        "c": 48
      },
      {
        "s": "3 oz (3 oz)",
        "c": 9.35
      }
    ]
  },
  {
    "i": 7661,
    "n": "Pork, Fresh, Loin, Top Loin (Chops), Boneless, Separable Lean*",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      },
      {
        "s": "1 chop boneless",
        "c": 15
      }
    ]
  },
  {
    "i": 7669,
    "n": "Pork, fresh, ground, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.97
      },
      {
        "s": "4 oz",
        "c": 15.8
      }
    ]
  },
  {
    "i": 7682,
    "n": "Pork, Fresh, Loin, Center Rib (Chops Or Roasts), Boneless, Separable Lean*",
    "ms": [
      {
        "s": "1 chop, excluding refuse (yield from 1 raw chop, with refuse, weighing 113 g)",
        "c": 5.05
      },
      {
        "s": "4 oz",
        "c": 5.65
      }
    ]
  },
  {
    "i": 7692,
    "n": "Pork, fresh, variety meats and by-products, tail, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 11.9
      },
      {
        "s": "1 piece, cooked, excluding refuse (yield from 1 lb raw meat with refuse)",
        "c": 38.5
      }
    ]
  },
  {
    "i": 7693,
    "n": "Pork, cured, shoulder, arm picnic, separable lean and fat, roasted",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      },
      {
        "s": "1 cup",
        "c": 14
      }
    ]
  },
  {
    "i": 7694,
    "n": "Pork, cured, separable fat (from ham and arm picnic), unheated",
    "ms": [
      {
        "s": "3 oz",
        "c": 4.25
      },
      {
        "s": "1 oz",
        "c": 1.42
      }
    ]
  },
  {
    "i": 7698,
    "n": "Pork, cured, separable fat (from ham and arm picnic), roasted",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.27
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 7699,
    "n": "Pork, cured, ham, patties, unheated",
    "ms": [
      {
        "s": "1 patty",
        "c": 5.2
      },
      {
        "s": "1 oz",
        "c": 2.27
      }
    ]
  },
  {
    "i": 7700,
    "n": "Pork, Cured, Ham, Boneless*",
    "ms": [
      {
        "s": "3 oz",
        "c": 6.8
      },
      {
        "s": "1 cup",
        "c": 11.2
      }
    ]
  },
  {
    "i": 7701,
    "n": "Pork, cured, feet, pickled",
    "ms": [
      {
        "s": "1 lb",
        "c": 145
      },
      {
        "s": "3 oz",
        "c": 27.2
      }
    ]
  },
  {
    "i": 7702,
    "n": "Pork, cured, ham, boneless, regular (approximately 11% fat), roasted",
    "ms": [
      {
        "s": "1 cup",
        "c": 11.2
      },
      {
        "s": "3 oz",
        "c": 6.8
      }
    ]
  },
  {
    "i": 7703,
    "n": "Pork, cured, ham, steak, boneless, extra lean, unheated",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.13
      },
      {
        "s": "1 slice",
        "c": 2.28
      }
    ]
  },
  {
    "i": 7704,
    "n": "Pork, fresh, variety meats and by-products, stomach, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 3.12
      },
      {
        "s": "4 oz",
        "c": 12.4
      }
    ]
  },
  {
    "i": 7708,
    "n": "Pork, fresh, variety meats and by-products, lungs, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 31.8
      },
      {
        "s": "1 oz",
        "c": 1.98
      }
    ]
  },
  {
    "i": 7709,
    "n": "Pork, fresh, variety meats and by-products, spleen, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 2.84
      },
      {
        "s": "4 oz",
        "c": 11.3
      }
    ]
  },
  {
    "i": 7713,
    "n": "Pork, fresh, variety meats and by-products, feet, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 79.1
      }
    ]
  },
  {
    "i": 7714,
    "n": "Pork, fresh, variety meats and by-products, liver, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 10.2
      },
      {
        "s": "1 oz",
        "c": 2.55
      }
    ]
  },
  {
    "i": 7715,
    "n": "Pork, fresh, variety meats and by-products, leaf fat, raw",
    "ms": [
      {
        "s": "1 oz",
        "c": 0.284
      },
      {
        "s": "4 oz",
        "c": 1.13
      }
    ]
  },
  {
    "i": 7716,
    "n": "Pork, fresh, variety meats and by-products, chitterlings, cooked, simmered",
    "ms": [
      {
        "s": "3 oz",
        "c": 21.2
      }
    ]
  },
  {
    "i": 7720,
    "n": "Pork, fresh, spareribs, separable lean and fat, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 17
      }
    ]
  },
  {
    "i": 7758,
    "n": "Pork, fresh, backfat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 9.07
      },
      {
        "s": "4 oz",
        "c": 2.26
      }
    ]
  },
  {
    "i": 7759,
    "n": "Pork, fresh, composite of trimmed leg, loin, shoulder, and spareribs, (includes cuts to be cured), separable lean and fat, raw",
    "ms": [
      {
        "s": "1 lb",
        "c": 49.9
      },
      {
        "s": "1 oz",
        "c": 3.12
      }
    ]
  },
  {
    "i": 7760,
    "n": "Pork, Fresh, Leg (Ham), Rump Half, Separable Lean*",
    "ms": [
      {
        "s": "1 lb",
        "c": 54.4
      },
      {
        "s": "4 oz",
        "c": 13.6
      }
    ]
  },
  {
    "i": 7763,
    "n": "Pork, fresh, belly, raw",
    "ms": [
      {
        "s": "4 oz",
        "c": 5.65
      },
      {
        "s": "1 lb",
        "c": 22.7
      }
    ]
  },
  {
    "i": 7764,
    "n": "Raspberries, puree, with seeds",
    "ms": [
      {
        "s": "100 g",
        "c": 23
      }
    ]
  },
  {
    "i": 7765,
    "n": "Baobab powder",
    "ms": [
      {
        "s": "100 g",
        "c": 342
      }
    ]
  },
  {
    "i": 7768,
    "n": "Cherry juice, tart",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 4.1
      },
      {
        "s": "1 cup",
        "c": 35
      }
    ]
  },
  {
    "i": 7771,
    "n": "Raspberries, puree, seedless",
    "ms": [
      {
        "s": "100 g",
        "c": 14
      }
    ]
  },
  {
    "i": 7773,
    "n": "Apple juice, canned or bottled, unsweetened, with added ascorbic acid, calcium, and potassium",
    "ms": [
      {
        "s": "10 fl oz",
        "c": 206
      },
      {
        "s": "6 fl oz",
        "c": 124
      }
    ]
  },
  {
    "i": 7779,
    "n": "Pomegranate juice, bottled",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.45
      },
      {
        "s": "1 cup",
        "c": 27.4
      }
    ]
  },
  {
    "i": 7780,
    "n": "Orange juice, chilled, includes from concentrate, with added calcium and vitamins A, D, E",
    "ms": [
      {
        "s": "1 cup",
        "c": 364
      },
      {
        "s": "1 fl oz",
        "c": 45.4
      }
    ]
  },
  {
    "i": 7784,
    "n": "Orange Pineapple Juice Blend",
    "ms": [
      {
        "s": "8 fl oz",
        "c": 19.7
      }
    ]
  },
  {
    "i": 7790,
    "n": "Abiyuch, raw",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 9.12
      }
    ]
  },
  {
    "i": 7791,
    "n": "Candied fruit",
    "ms": [
      {
        "s": "100 g",
        "c": 18
      }
    ]
  },
  {
    "i": 7793,
    "n": "Pears, raw, red anjou",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 15.4
      },
      {
        "s": "1 large",
        "c": 24.5
      },
      {
        "s": "1 medium",
        "c": 17.3
      },
      {
        "s": "1 small",
        "c": 13.9
      }
    ]
  },
  {
    "i": 7794,
    "n": "Rowal, raw",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 17.1
      }
    ]
  },
  {
    "i": 7797,
    "n": "Prune puree",
    "ms": [
      {
        "s": "2 tbsp",
        "c": 11.2
      }
    ]
  },
  {
    "i": 7798,
    "n": "Apple juice, canned or bottled, unsweetened, with added ascorbic acid",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 2.48
      },
      {
        "s": "1 cup",
        "c": 19.8
      }
    ]
  },
  {
    "i": 7799,
    "n": "Apple juice, frozen concentrate, unsweetened, diluted with 3 volume water, with added ascorbic acid",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.79
      },
      {
        "s": "1 cup",
        "c": 14.3
      }
    ]
  },
  {
    "i": 7801,
    "n": "Grapefruit juice, pink, raw",
    "ms": [
      {
        "s": "1 fruit yields",
        "c": 17.6
      },
      {
        "s": "1 cup",
        "c": 22.2
      }
    ]
  },
  {
    "i": 7806,
    "n": "Tamarinds, raw",
    "ms": [
      {
        "s": "1 fruit (3 x 1)",
        "c": 1.48
      },
      {
        "s": "1 cup, pulp",
        "c": 88.8
      }
    ]
  },
  {
    "i": 7807,
    "n": "Watermelon, raw",
    "ms": [
      {
        "s": "1 melon (15 long x 7-1/2 dia)",
        "c": 316
      },
      {
        "s": "1 wedge (approx 1/16 of melon)",
        "c": 20
      },
      {
        "s": "1 cup, balls",
        "c": 10.8
      },
      {
        "s": "10 watermelon balls",
        "c": 8.54
      },
      {
        "s": "1 cup, diced",
        "c": 10.6
      },
      {
        "s": "1 NLEA serving",
        "c": 19.6
      }
    ]
  },
  {
    "i": 7808,
    "n": "Fruit salad, (pineapple and papaya and banana and guava), tropical, canned, heavy syrup, solids and liquids",
    "ms": [
      {
        "s": "1 cup",
        "c": 33.4
      }
    ]
  },
  {
    "i": 7809,
    "n": "Strawberries, raw",
    "ms": [
      {
        "s": "1 small (1 dia)",
        "c": 1.12
      },
      {
        "s": "1 cup, whole",
        "c": 23
      },
      {
        "s": "1 NLEA serving",
        "c": 23.5
      },
      {
        "s": "1 extra large (1-5/8 dia)",
        "c": 4.32
      },
      {
        "s": "1 medium (1-1/4 dia)",
        "c": 1.92
      },
      {
        "s": "1 cup, halves",
        "c": 24.3
      },
      {
        "s": "1 pint as purchased, yields",
        "c": 57.1
      },
      {
        "s": "1 cup, sliced",
        "c": 26.6
      },
      {
        "s": "1 large (1-3/8 dia)",
        "c": 2.88
      },
      {
        "s": "1 cup, pureed",
        "c": 37.1
      }
    ]
  },
  {
    "i": 7812,
    "n": "Sapodilla, raw",
    "ms": [
      {
        "s": "1 sapodilla",
        "c": 35.7
      },
      {
        "s": "1 cup, pulp",
        "c": 50.6
      }
    ]
  },
  {
    "i": 7813,
    "n": "Soursop, raw",
    "ms": [
      {
        "s": "1 cup, pulp",
        "c": 31.5
      },
      {
        "s": "1 fruit (7 x 5-1/4 dia)",
        "c": 87.5
      }
    ]
  },
  {
    "i": 7814,
    "n": "Sapote, mamey, raw",
    "ms": [
      {
        "s": "1 cup 1 pieces",
        "c": 31.5
      },
      {
        "s": "1 fruit without refuse",
        "c": 100
      }
    ]
  },
  {
    "i": 7817,
    "n": "Rhubarb, raw",
    "ms": [
      {
        "s": "1 cup, diced",
        "c": 105
      },
      {
        "s": "1 stalk",
        "c": 43.9
      }
    ]
  },
  {
    "i": 7818,
    "n": "Plums, dried (prunes), stewed, with added sugar",
    "ms": [
      {
        "s": "1 cup, pitted",
        "c": 52.1
      }
    ]
  },
  {
    "i": 7819,
    "n": "Prune juice, canned",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.7
      },
      {
        "s": "1 fl oz",
        "c": 3.84
      }
    ]
  },
  {
    "i": 7820,
    "n": "Raspberries, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 30.8
      },
      {
        "s": "10 raspberries",
        "c": 4.75
      },
      {
        "s": "1 pint as purchased, yields",
        "c": 78
      }
    ]
  },
  {
    "i": 7821,
    "n": "Prickly pears, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 83.4
      },
      {
        "s": "1 fruit without refuse",
        "c": 57.7
      }
    ]
  },
  {
    "i": 7822,
    "n": "Lemon peel, raw",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 8.04
      },
      {
        "s": "1 tsp",
        "c": 2.68
      }
    ]
  },
  {
    "i": 7823,
    "n": "Plums, dried (prunes), stewed, without added sugar",
    "ms": [
      {
        "s": "1 cup, pitted",
        "c": 47.1
      }
    ]
  },
  {
    "i": 7824,
    "n": "Pummelo, raw",
    "ms": [
      {
        "s": "1 fruit without refuse",
        "c": 24.4
      },
      {
        "s": "1 cup, sections",
        "c": 7.6
      }
    ]
  },
  {
    "i": 7825,
    "n": "Turtle, green, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 100
      }
    ]
  },
  {
    "i": 7826,
    "n": "Syrup, Cane",
    "ms": [
      {
        "s": "1 serving",
        "c": 2.73
      }
    ]
  },
  {
    "i": 7827,
    "n": "Lemon juice from concentrate, canned or bottled",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 1.5
      },
      {
        "s": "1 fl oz",
        "c": 3.05
      },
      {
        "s": "1 cup",
        "c": 24.4
      },
      {
        "s": "1 tsp",
        "c": 0.5
      }
    ]
  },
  {
    "i": 7828,
    "n": "Mollusks, snail, raw",
    "ms": [
      {
        "s": "3 oz",
        "c": 8.5
      }
    ]
  },
  {
    "i": 7829,
    "n": "Lemons, raw, without peel",
    "ms": [
      {
        "s": "1 wedge or slice (1/8 of one 2-1/8 dia lemon)",
        "c": 1.82
      },
      {
        "s": "1 NLEA serving",
        "c": 15.1
      },
      {
        "s": "1 fruit (2-1/8 dia)",
        "c": 15.1
      },
      {
        "s": "1 fruit (2-3/8 dia)",
        "c": 21.8
      },
      {
        "s": "1 cup, sections",
        "c": 55.1
      }
    ]
  },
  {
    "i": 7831,
    "n": "Lemon juice, raw",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.83
      },
      {
        "s": "1 cup",
        "c": 14.6
      },
      {
        "s": "1 lemon yields",
        "c": 2.88
      },
      {
        "s": "1 wedge yields",
        "c": 0.354
      }
    ]
  },
  {
    "i": 7833,
    "n": "Mayonnaise dressing, no cholesterol",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.7
      },
      {
        "s": "1 tbsp",
        "c": 1.05
      }
    ]
  },
  {
    "i": 7834,
    "n": "Oil, corn, peanut, and olive",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      },
      {
        "s": "1 teaspoon",
        "c": 0
      }
    ]
  },
  {
    "i": 7835,
    "n": "Puddings, all flavors except chocolate, low calorie, regular, dry mix",
    "ms": [
      {
        "s": "1 serving",
        "c": 55.4
      },
      {
        "s": "1 cup",
        "c": 127
      }
    ]
  },
  {
    "i": 7837,
    "n": "Puddings, chocolate flavor, low calorie, regular, dry mix",
    "ms": [
      {
        "s": "1 serving",
        "c": 4.95
      },
      {
        "s": "1 package",
        "c": 20
      }
    ]
  },
  {
    "i": 7841,
    "n": "Breakfast bar, corn flake crust with fruit",
    "ms": [
      {
        "s": "1 oz",
        "c": 11.6
      },
      {
        "s": "1 bar",
        "c": 15.2
      }
    ]
  },
  {
    "i": 7844,
    "n": "Milk, imitation, non-soy",
    "ms": [
      {
        "s": "1 cup",
        "c": 200
      },
      {
        "s": "1 fl oz",
        "c": 25
      }
    ]
  },
  {
    "i": 7846,
    "n": "Millet, puffed",
    "ms": [
      {
        "s": "1 cup",
        "c": 1.68
      }
    ]
  },
  {
    "i": 7847,
    "n": "Alcoholic beverage, rice (sake)",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 1.46
      }
    ]
  },
  {
    "i": 7851,
    "n": "Tofu yogurt",
    "ms": [
      {
        "s": "1 cup",
        "c": 309
      }
    ]
  },
  {
    "i": 7853,
    "n": "Hearts of palm, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 18
      }
    ]
  },
  {
    "i": 7857,
    "n": "Frozen novelties, juice type, juice with cream",
    "ms": [
      {
        "s": "2.5 oz",
        "c": 100
      }
    ]
  },
  {
    "i": 7858,
    "n": "Yeast extract spread",
    "ms": [
      {
        "s": "1 tsp",
        "c": 4.02
      }
    ]
  },
  {
    "i": 7859,
    "n": "Cheese, cottage, lowfat, 1% milkfat, with vegetables",
    "ms": [
      {
        "s": "4 oz",
        "c": 63.3
      },
      {
        "s": "1 cup",
        "c": 127
      }
    ]
  },
  {
    "i": 7860,
    "n": "Tomato and vegetable juice, low sodium",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 3.32
      },
      {
        "s": "1 cup",
        "c": 26.6
      }
    ]
  },
  {
    "i": 7861,
    "n": "Turkey, drumstick, smoked, cooked, with skin, bone removed",
    "ms": [
      {
        "s": "1 cubic inch, boneless",
        "c": 5.44
      },
      {
        "s": "3 oz with bone, cooked (yield after bone removed)",
        "c": 27.2
      }
    ]
  },
  {
    "i": 7862,
    "n": "Beverages, Chocolate-flavored drink, whey and milk based",
    "ms": [
      {
        "s": "1 cup",
        "c": 244
      },
      {
        "s": "1 fl oz",
        "c": 30.5
      }
    ]
  },
  {
    "i": 7863,
    "n": "Turkey, light or dark meat, smoked, cooked, skin and bone removed",
    "ms": [
      {
        "s": "1 medium slice (approx 3 x 2 x 1/4)",
        "c": 7
      },
      {
        "s": "1 thick slice (approx 3 x 2 x 3/8)",
        "c": 10.5
      },
      {
        "s": "3 oz",
        "c": 21.2
      }
    ]
  },
  {
    "i": 7864,
    "n": "Pork, cured, bacon, cooked, broiled, pan-fried or roasted, reduced sodium",
    "ms": [
      {
        "s": "1 slice cooked",
        "c": 0.88
      },
      {
        "s": "3 oz",
        "c": 9.35
      }
    ]
  },
  {
    "i": 7865,
    "n": "Turkey, wing, smoked, cooked, with skin, bone removed",
    "ms": [
      {
        "s": "3 oz with bone, cooked (yield after bone removed)",
        "c": 20.4
      },
      {
        "s": "1 cubic inch, boneless",
        "c": 4.08
      }
    ]
  },
  {
    "i": 7866,
    "n": "Cheese, cottage, lowfat, 1% milkfat, lactose reduced",
    "ms": [
      {
        "s": "4 oz",
        "c": 59.9
      },
      {
        "s": "1 cup",
        "c": 120
      }
    ]
  },
  {
    "i": 7867,
    "n": "Beverages, fruit-flavored drink, powder, with high vitamin C with other added vitamins, low calorie",
    "ms": [
      {
        "s": "1 tsp",
        "c": 16
      }
    ]
  },
  {
    "i": 7868,
    "n": "Cheese, parmesan, low sodium",
    "ms": [
      {
        "s": "1 cup, grated",
        "c": 800
      },
      {
        "s": "1 tbsp",
        "c": 40
      }
    ]
  },
  {
    "i": 7869,
    "n": "Salad dressing, bacon and tomato",
    "ms": [
      {
        "s": "1 cup",
        "c": 9.6
      },
      {
        "s": "1 tbsp",
        "c": 0.6
      }
    ]
  },
  {
    "i": 7871,
    "n": "Oil, flaxseed, cold pressed",
    "ms": [
      {
        "s": "1 cup",
        "c": 2.18
      },
      {
        "s": "1 tbsp",
        "c": 0.136
      }
    ]
  },
  {
    "i": 7872,
    "n": "Jams, preserves, marmalade, reduced sugar",
    "ms": [
      {
        "s": "1 tablespoon",
        "c": 0
      }
    ]
  },
  {
    "i": 7873,
    "n": "Pork sausage rice links, brown and serve, cooked",
    "ms": [
      {
        "s": "2 links 1 NLEA serving",
        "c": 6.75
      },
      {
        "s": "3 links 1 NLEA serving",
        "c": 9
      }
    ]
  },
  {
    "i": 7874,
    "n": "Frankfurter, beef, low fat",
    "ms": [
      {
        "s": "1 cup, sliced",
        "c": 12.1
      },
      {
        "s": "1 frankfurter",
        "c": 4.56
      }
    ]
  },
  {
    "i": 7875,
    "n": "Salad dressing, blue or roquefort cheese dressing, fat-free",
    "ms": [
      {
        "s": "1 cup",
        "c": 135
      },
      {
        "s": "1 tbsp",
        "c": 8.67
      }
    ]
  },
  {
    "i": 7876,
    "n": "Salad Dressing, mayonnaise-like, fat-free",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 0.96
      },
      {
        "s": "1 cup",
        "c": 15.4
      }
    ]
  },
  {
    "i": 7877,
    "n": "Mayonnaise, made with tofu",
    "ms": [
      {
        "s": "1 tbsp",
        "c": 7.95
      },
      {
        "s": "1 cup",
        "c": 127
      }
    ]
  },
  {
    "i": 7878,
    "n": "Milk, buttermilk, fluid, cultured, reduced fat",
    "ms": [
      {
        "s": "1 fl oz",
        "c": 43.8
      },
      {
        "s": "1 cup",
        "c": 350
      }
    ]
  },
  {
    "i": 7879,
    "n": "Salad dressing, french dressing, reduced calorie",
    "ms": [
      {
        "s": "1 cup",
        "c": 28.6
      },
      {
        "s": "1 tbsp",
        "c": 1.76
      }
    ]
  },
  {
    "i": 7880,
    "n": "Salad dressing, blue or roquefort cheese dressing, light",
    "ms": [
      {
        "s": "1 cup",
        "c": 169
      },
      {
        "s": "1 tbsp",
        "c": 10.9
      }
    ]
  },
  {
    "i": 7882,
    "n": "Sausage, turkey and pork, fresh, bulk, patty or link, cooked",
    "ms": [
      {
        "s": "1 cup, cooked",
        "c": 41.6
      },
      {
        "s": "1 patty, cooked",
        "c": 8
      },
      {
        "s": "1 oz cooked, yield",
        "c": 6.72
      },
      {
        "s": "1 oz",
        "c": 8.96
      }
    ]
  },
  {
    "i": 7883,
    "n": "Vegetable oil-butter spread, reduced calorie",
    "ms": [
      {
        "s": "1 cup",
        "c": 12.4
      },
      {
        "s": "1 tbsp",
        "c": 0.78
      }
    ]
  },
  {
    "i": 7884,
    "n": "Cream substitute, powdered, light",
    "ms": [
      {
        "s": "1 cup",
        "c": 0.94
      },
      {
        "s": "1 packet",
        "c": 0.03
      }
    ]
  },
  {
    "i": 7886,
    "n": "Beverages, fruit-flavored drink, dry powdered mix, low calorie, with aspartame",
    "ms": [
      {
        "s": "1 tsp",
        "c": 83.8
      }
    ]
  },
  {
    "i": 7887,
    "n": "Milk dessert, frozen, milk-fat free, chocolate",
    "ms": [
      {
        "s": "1 cup",
        "c": 211
      }
    ]
  },
  {
    "i": 7889,
    "n": "Pectin, liquid",
    "ms": [
      {
        "s": "1 fl oz assumed specific gravity of honey",
        "c": 0
      }
    ]
  },
  {
    "i": 7890,
    "n": "Creamy dressing, made with sour cream and/or buttermilk and oil, reduced calorie",
    "ms": [
      {
        "s": "1 cup",
        "c": 14.7
      },
      {
        "s": "1 tbsp",
        "c": 0.9
      }
    ]
  },
  {
    "i": 7898,
    "n": "Restaurant, Chinese, vegetable lo mein, without meat",
    "ms": [
      {
        "s": "1 order",
        "c": 156
      },
      {
        "s": "1 cup",
        "c": 28.6
      }
    ]
  },
  {
    "i": 7907,
    "n": "Restaurant, Chinese, egg rolls, assorted",
    "ms": [
      {
        "s": "1 piece",
        "c": 35.6
      }
    ]
  },
  {
    "i": 7917,
    "n": "Restaurant, Mexican, soft taco with ground beef, cheese and lettuce",
    "ms": [
      {
        "s": "3 taco",
        "c": 451
      },
      {
        "s": "2 taco",
        "c": 324
      },
      {
        "s": "1 taco",
        "c": 155
      },
      {
        "s": "1 serving varied from 1 to 3 tacos per serving",
        "c": 326
      }
    ]
  },
  {
    "i": 7963,
    "n": "Potatoes, hash brown, refrigerated, unprepared",
    "ms": [
      {
        "s": "1 cup unprepared",
        "c": 9.54
      }
    ]
  },
  {
    "i": 7976,
    "n": "Puddings, banana, dry mix, instant, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup From 19191",
        "c": 150
      }
    ]
  },
  {
    "i": 7977,
    "n": "Puddings, banana, dry mix, regular, prepared with 2% milk",
    "ms": [
      {
        "s": "0.5 cup From 19211",
        "c": 155
      }
    ]
  },
  {
    "i": 7980,
    "n": "Candies, milk chocolate",
    "ms": [
      {
        "s": "1 bar (1.55 oz)",
        "c": 83.2
      },
      {
        "s": "1 cup chips",
        "c": 318
      },
      {
        "s": "1 bar, miniature",
        "c": 13.2
      }
    ]
  },
  {
    "i": 7982,
    "n": "Candies, fudge, vanilla with nuts",
    "ms": [
      {
        "s": "1 oz",
        "c": 13.3
      }
    ]
  },
  {
    "i": 7985,
    "n": "Syrups, table blends, pancake, with butter",
    "ms": [
      {
        "s": "1 serving 1/4 cup",
        "c": 1.46
      }
    ]
  },
  {
    "i": 7988,
    "n": "Ice creams, chocolate, light",
    "ms": [
      {
        "s": "1 serving",
        "c": 108
      },
      {
        "s": "1 unit",
        "c": 159
      }
    ]
  },
  {
    "i": 7990,
    "n": "Ice creams, vanilla, light, soft-serve",
    "ms": [
      {
        "s": "1 serving 1/2 cup",
        "c": 138
      }
    ]
  },
  {
    "i": 7993,
    "n": "Ice creams, vanilla, rich",
    "ms": [
      {
        "s": "0.5 cup",
        "c": 125
      }
    ]
  },
  {
    "i": 7994,
    "n": "Candies, fudge, peanut butter, prepared-from-recipe",
    "ms": [
      {
        "s": "1 piece",
        "c": 6.72
      }
    ]
  },
  {
    "i": 7995,
    "n": "Sherbet, orange",
    "ms": [
      {
        "s": "0.5 cup (4 fl oz)",
        "c": 40
      },
      {
        "s": "1 bar (2.75 fl oz)",
        "c": 35.6
      }
    ]
  },
  {
    "i": 7996,
    "n": "Ice creams, vanilla, light",
    "ms": [
      {
        "s": "1 serving 1/2 cup",
        "c": 122
      }
    ]
  },
  {
    "i": 7997,
    "n": "Baking chocolate, unsweetened, squares",
    "ms": [
      {
        "s": "1 oz square Bakers",
        "c": 29.3
      },
      {
        "s": "1 cup, grated",
        "c": 133
      },
      {
        "s": "0.5 oz Hersheys",
        "c": 14.3
      }
    ]
  },
  {
    "i": 7998,
    "n": "Candies, confectioner's coating, yogurt",
    "ms": [
      {
        "s": "1 cup chips",
        "c": 348
      }
    ]
  },
  {
    "i": 7999,
    "n": "Candies, confectioner's coating, peanut butter",
    "ms": [
      {
        "s": "1 oz",
        "c": 31.2
      },
      {
        "s": "1 cup chips",
        "c": 185
      }
    ]
  },
  {
    "i": 8000,
    "n": "Candies, white chocolate",
    "ms": [
      {
        "s": "1 cup chips",
        "c": 338
      },
      {
        "s": "1 tbsp",
        "c": 27.9
      },
      {
        "s": "1 bar (3 oz)",
        "c": 169
      }
    ]
  },
  {
    "i": 8001,
    "n": "Baking chocolate, unsweetened, liquid",
    "ms": [
      {
        "s": "1 oz",
        "c": 15.3
      }
    ]
  },
  {
    "i": 8004,
    "n": "Snacks, tortilla chips, nacho cheese",
    "ms": [
      {
        "s": "1 oz",
        "c": 38.8
      }
    ]
  },
  {
    "i": 8006,
    "n": "Snacks, tortilla chips, ranch-flavor",
    "ms": [
      {
        "s": "1 oz",
        "c": 38
      },
      {
        "s": "1 bag (7 oz)",
        "c": 265
      }
    ]
  },
  {
    "i": 8007,
    "n": "Snacks, Trail Mix, Regular*",
    "ms": [
      {
        "s": "1 oz",
        "c": 22.1
      },
      {
        "s": "1.5 oz",
        "c": 32.8
      },
      {
        "s": "1 cup",
        "c": 117
      }
    ]
  },
  {
    "i": 8009,
    "n": "George Weston Bakeries, Thomas English Muffins",
    "ms": [
      {
        "s": "1 serving",
        "c": 103
      }
    ]
  },
  {
    "i": 8014,
    "n": "Pie Crust, Cookie-type, Graham Cracker, Ready Crust",
    "ms": [
      {
        "s": "1 oz",
        "c": 8.22
      },
      {
        "s": "1 crust",
        "c": 53.1
      }
    ]
  },
  {
    "i": 8015,
    "n": "Tostada shells, corn",
    "ms": [
      {
        "s": "3 pieces (mean serving weight, aggregated over brands)",
        "c": 28.1
      },
      {
        "s": "1 piece",
        "c": 9.35
      }
    ]
  },
  {
    "i": 8016,
    "n": "Pie Crust, Cookie-type, Chocolate, Ready Crust",
    "ms": [
      {
        "s": "1 crust",
        "c": 58.2
      }
    ]
  },
  {
    "i": 8020,
    "n": "Bread, pound cake type, pan de torta salvadoran",
    "ms": [
      {
        "s": "1 cake square",
        "c": 286
      },
      {
        "s": "1 serving",
        "c": 25.3
      }
    ]
  },
  {
    "i": 8022,
    "n": "Crackers, cream, Gamesa Sabrosas",
    "ms": [
      {
        "s": "1 cracker",
        "c": 0.806
      },
      {
        "s": "11 crackers (1 NLEA serving)",
        "c": 8.06
      }
    ]
  },
  {
    "i": 8023,
    "n": "Bread, salvadoran sweet cheese (quesadilla salvadorena)",
    "ms": [
      {
        "s": "1 cake square (average weight of whole item)",
        "c": 291
      },
      {
        "s": "1 serving (approximate serving size)",
        "c": 40.2
      }
    ]
  },
  {
    "i": 8024,
    "n": "Pastry, Pastelitos de Guava (guava pastries)",
    "ms": [
      {
        "s": "1 piece",
        "c": 12
      }
    ]
  },
  {
    "i": 8025,
    "n": "Crackers, cream, La Moderna Rikis Cream Crackers",
    "ms": [
      {
        "s": "10 crackers (1 NLEA serving)",
        "c": 235
      },
      {
        "s": "1 cracker",
        "c": 22.8
      }
    ]
  },
  {
    "i": 8026,
    "n": "Snacks, beef jerky, chopped and formed",
    "ms": [
      {
        "s": "1 oz",
        "c": 5.67
      },
      {
        "s": "1 piece, large",
        "c": 4
      }
    ]
  },
  {
    "i": 8027,
    "n": "Bread, white wheat",
    "ms": [
      {
        "s": "1 slice",
        "c": 192
      }
    ]
  },
  {
    "i": 8028,
    "n": "Tortillas, ready-to-bake or -fry, flour, shelf stable",
    "ms": [
      {
        "s": "1 package",
        "c": 789
      },
      {
        "s": "1 tortilla",
        "c": 79.9
      }
    ]
  },
  {
    "i": 8029,
    "n": "Cream puff, eclair, custard or cream filled, iced",
    "ms": [
      {
        "s": "4 oz",
        "c": 39.6
      }
    ]
  },
  {
    "i": 8030,
    "n": "Bagels, wheat",
    "ms": [
      {
        "s": "1 bagel",
        "c": 19.6
      }
    ]
  },
  {
    "i": 8031,
    "n": "Snacks, corn-based, extruded, chips, plain",
    "ms": [
      {
        "s": "1 bag (7 oz)",
        "c": 273
      },
      {
        "s": "1 oz",
        "c": 39.1
      },
      {
        "s": "1 oz",
        "c": 38.6
      }
    ]
  },
  {
    "i": 8032,
    "n": "Snacks, corn-based, extruded, cones, plain",
    "ms": [
      {
        "s": "1 oz",
        "c": 0.85
      }
    ]
  },
  {
    "i": 8033,
    "n": "Snacks, fruit leather, pieces",
    "ms": [
      {
        "s": "1 package",
        "c": 4.86
      },
      {
        "s": "1 packet (.75 oz)",
        "c": 3.78
      },
      {
        "s": "1 oz",
        "c": 5.1
      }
    ]
  },
  {
    "i": 8034,
    "n": "Snacks, fruit leather, rolls",
    "ms": [
      {
        "s": "1 large",
        "c": 6.72
      },
      {
        "s": "1 small",
        "c": 4.48
      }
    ]
  },
  {
    "i": 8035,
    "n": "Snacks, granola bars, hard, plain",
    "ms": [
      {
        "s": "1 bar",
        "c": 15.2
      },
      {
        "s": "1 bar (1 oz)",
        "c": 17.1
      },
      {
        "s": "1 bar",
        "c": 12.8
      }
    ]
  },
  {
    "i": 8036,
    "n": "Snacks, corn-based, extruded, chips, barbecue-flavor",
    "ms": [
      {
        "s": "1 oz",
        "c": 37.1
      },
      {
        "s": "1 bag (7 oz)",
        "c": 259
      }
    ]
  },
  {
    "i": 8037,
    "n": "Candies, honey-combed, with peanut butter",
    "ms": [
      {
        "s": "1 serving",
        "c": 8.4
      }
    ]
  },
  {
    "i": 8038,
    "n": "Snacks, granola bars, soft, coated, milk chocolate coating, peanut butter",
    "ms": [
      {
        "s": "1 oz",
        "c": 30.6
      },
      {
        "s": "1 bar",
        "c": 40
      }
    ]
  },
  {
    "i": 8039,
    "n": "Snacks, granola bars, soft, uncoated, peanut butter and chocolate chip",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 22.4
      }
    ]
  },
  {
    "i": 8040,
    "n": "Snacks, granola bars, soft, uncoated, raisin",
    "ms": [
      {
        "s": "1 bar (1.5 oz)",
        "c": 43.4
      },
      {
        "s": "1 bar (1 oz)",
        "c": 28.3
      }
    ]
  },
  {
    "i": 8041,
    "n": "Snacks, granola bars, hard, almond",
    "ms": [
      {
        "s": "1 bar",
        "c": 7.68
      },
      {
        "s": "1 oz",
        "c": 9.07
      }
    ]
  },
  {
    "i": 8042,
    "n": "Snacks, granola bars, soft, coated, milk chocolate coating, chocolate chip",
    "ms": [
      {
        "s": "1 bar (1 oz)",
        "c": 28.8
      },
      {
        "s": "1 bar (1.25 oz)",
        "c": 36
      }
    ]
  },
  {
    "i": 8043,
    "n": "Snacks, popcorn, oil-popped, microwave, regular flavor, no trans fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 1.13
      },
      {
        "s": "1 cup",
        "c": 0.44
      }
    ]
  },
  {
    "i": 8044,
    "n": "Snacks, popcorn, caramel-coated, with peanuts",
    "ms": [
      {
        "s": "1 oz (approx 2/3 cup)",
        "c": 18.7
      },
      {
        "s": "2 oz",
        "c": 37.6
      }
    ]
  },
  {
    "i": 8045,
    "n": "Snacks, popcorn, cakes",
    "ms": [
      {
        "s": "1 cake",
        "c": 0.9
      },
      {
        "s": "2 cakes",
        "c": 1.8
      }
    ]
  },
  {
    "i": 8046,
    "n": "Snacks, potato chips, made from dried potatoes, reduced fat",
    "ms": [
      {
        "s": "1 oz",
        "c": 8.22
      },
      {
        "s": "1 can (6 oz)",
        "c": 49.3
      }
    ]
  },
  {
    "i": 8047,
    "n": "Snacks, popcorn, caramel-coated, without peanuts",
    "ms": [
      {
        "s": "1 oz",
        "c": 12.2
      }
    ]
  },
  {
    "i": 8048,
    "n": "Snacks, pretzels, hard, confectioner's coating, chocolate-flavor",
    "ms": [
      {
        "s": "1 pretzel",
        "c": 8.14
      },
      {
        "s": "1 oz",
        "c": 21
      }
    ]
  },
  {
    "i": 8049,
    "n": "Snacks, Rice Cakes, Brown Rice, Sesame Seed*",
    "ms": [
      {
        "s": "1 cake",
        "c": 1.08
      },
      {
        "s": "2 cakes",
        "c": 2.16
      }
    ]
  },
  {
    "i": 8050,
    "n": "Snacks, potato chips, made from dried potatoes, sour-cream and onion-flavor",
    "ms": [
      {
        "s": "1 can (6.75 oz)",
        "c": 127
      },
      {
        "s": "1 oz",
        "c": 18.1
      }
    ]
  },
  {
    "i": 8051,
    "n": "Snacks, pretzels, hard, plain, salted",
    "ms": [
      {
        "s": "10 twists",
        "c": 16.2
      },
      {
        "s": "1 oz",
        "c": 7.65
      }
    ]
  },
  {
    "i": 8052,
    "n": "Snacks, tortilla chips, plain, white corn, salted",
    "ms": [
      {
        "s": "1 oz",
        "c": 30.1
      },
      {
        "s": "1 bag",
        "c": 226
      }
    ]
  },
  {
    "i": 8054,
    "n": "Candies, caramels, chocolate-flavor roll",
    "ms": [
      {
        "s": "1 bar 2.25 oz",
        "c": 23
      },
      {
        "s": "1 serving 6 pieces",
        "c": 14.4
      },
      {
        "s": "1 piece",
        "c": 2.38
      }
    ]
  },
  {
    "i": 8055,
    "n": "Beef, top sirloin steak, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 3.7
      }
    ]
  },
  {
    "i": 8056,
    "n": "Bison, ground, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 6.83
      }
    ]
  },
  {
    "i": 8057,
    "n": "Squash, spaghetti, peeled, seeded, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 16.6
      }
    ]
  },
  {
    "i": 8060,
    "n": "Chicken, breast, meat and skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 6.9
      }
    ]
  },
  {
    "i": 8061,
    "n": "Cabbage, napa, leaf, destemmed, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 35
      }
    ]
  },
  {
    "i": 8062,
    "n": "Rutabaga, peeled, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 42
      }
    ]
  },
  {
    "i": 8063,
    "n": "Chicken, drumstick, meat and skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 8.28
      }
    ]
  },
  {
    "i": 8064,
    "n": "Beef, tenderloin steak, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.09
      }
    ]
  },
  {
    "i": 8065,
    "n": "Tomatillos, dehusked, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 7.14
      }
    ]
  },
  {
    "i": 8066,
    "n": "Juice, tart cherry, from concentrate, shelf-stable",
    "ms": [
      {
        "s": "100 g",
        "c": 16.2
      }
    ]
  },
  {
    "i": 8067,
    "n": "Chicken, thigh, meat and skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.73
      }
    ]
  },
  {
    "i": 8068,
    "n": "Green onion, (scallion), bulb and greens, root removed, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 59.4
      }
    ]
  },
  {
    "i": 8069,
    "n": "Pork, chop, center cut, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.12
      }
    ]
  },
  {
    "i": 8070,
    "n": "Beef, short loin (NY strip steak), raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.04
      }
    ]
  },
  {
    "i": 8071,
    "n": "Shallots, bulb, peeled, root removed, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 26.1
      }
    ]
  },
  {
    "i": 8072,
    "n": "Chicken, wing, meat and skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 13.6
      }
    ]
  },
  {
    "i": 8073,
    "n": "Squash, pie pumpkin, peeled, seeded, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 16.4
      }
    ]
  },
  {
    "i": 8074,
    "n": "Pork, belly, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.2
      }
    ]
  },
  {
    "i": 8075,
    "n": "Leeks, bulb and greens, root removed, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 51.4
      }
    ]
  },
  {
    "i": 8076,
    "n": "Juice, prune, shelf-stable",
    "ms": [
      {
        "s": "100 g",
        "c": 16.2
      }
    ]
  },
  {
    "i": 8077,
    "n": "Pawpaw, peeled, seeded, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 9.91
      }
    ]
  },
  {
    "i": 8078,
    "n": "Juice, pomegranate, from concentrate, shelf-stable",
    "ms": [
      {
        "s": "100 g",
        "c": 11
      }
    ]
  },
  {
    "i": 8079,
    "n": "Apricot, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 11.6
      }
    ]
  },
  {
    "i": 8080,
    "n": "Bulgur, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 34.1
      }
    ]
  },
  {
    "i": 8081,
    "n": "Corn, sweet, yellow and white kernels,  fresh, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 0.656
      }
    ]
  },
  {
    "i": 8082,
    "n": "Khorasan, grain, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 24.1
      }
    ]
  },
  {
    "i": 8083,
    "n": "Corn flour, masa harina, white or yellow, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 112
      }
    ]
  },
  {
    "i": 8084,
    "n": "Mandarin, seedless, peeled, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 44
      }
    ]
  },
  {
    "i": 8085,
    "n": "Plum, black, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.03
      }
    ]
  },
  {
    "i": 8086,
    "n": "Asparagus, green, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 20.6
      }
    ]
  },
  {
    "i": 8087,
    "n": "Farro, pearled, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 25.9
      }
    ]
  },
  {
    "i": 8088,
    "n": "Arugula, baby, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 204
      }
    ]
  },
  {
    "i": 8089,
    "n": "Pear, Anjou, green, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 9.99
      }
    ]
  },
  {
    "i": 8090,
    "n": "Fonio, grain, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 11.6
      }
    ]
  },
  {
    "i": 8091,
    "n": "Chia seeds, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 595
      }
    ]
  },
  {
    "i": 8092,
    "n": "Sorghum bran, white, unenriched, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 61.7
      }
    ]
  },
  {
    "i": 8093,
    "n": "Plantains, ripe, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 3.82
      }
    ]
  },
  {
    "i": 8095,
    "n": "Mango, Tommy Atkins, peeled, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 12.4
      }
    ]
  },
  {
    "i": 8096,
    "n": "Sorghum flour, white, pearled, unenriched, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 7.89
      }
    ]
  },
  {
    "i": 8097,
    "n": "Sorghum grain, white, pearled, unenriched, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 7.45
      }
    ]
  },
  {
    "i": 8098,
    "n": "Plantains, underripe, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.83
      }
    ]
  },
  {
    "i": 8099,
    "n": "Wild rice, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 7.97
      }
    ]
  },
  {
    "i": 8100,
    "n": "Mango, Ataulfo, peeled, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 10
      }
    ]
  },
  {
    "i": 8101,
    "n": "Kiwifruit (kiwi), green, peeled, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 24.4
      }
    ]
  },
  {
    "i": 8102,
    "n": "Plantains, overripe, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 3.9
      }
    ]
  },
  {
    "i": 8103,
    "n": "Sorghum, whole grain, white, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 14.9
      }
    ]
  },
  {
    "i": 8104,
    "n": "Rice, red, unenriched, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 9.22
      }
    ]
  },
  {
    "i": 8105,
    "n": "Einkorn, grain, dry, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 41.4
      }
    ]
  },
  {
    "i": 8106,
    "n": "Rice, black, unenriched, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 14.4
      }
    ]
  },
  {
    "i": 8107,
    "n": "Avocado, Hass, peeled, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 14.5
      }
    ]
  },
  {
    "i": 8114,
    "n": "Squash, summer, green, zucchini, includes skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 20.8
      }
    ]
  },
  {
    "i": 8117,
    "n": "Cabbage, bok choy, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 61.9
      }
    ]
  },
  {
    "i": 8119,
    "n": "Squash, summer, yellow, includes skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 22.7
      }
    ]
  },
  {
    "i": 8123,
    "n": "Crustaceans, shrimp, farm raised, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 64.6
      }
    ]
  },
  {
    "i": 8124,
    "n": "Fish, salmon, Atlantic, farm raised, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 9.42
      }
    ]
  },
  {
    "i": 8125,
    "n": "Fish, tilapia, farm raised, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 8.63
      }
    ]
  },
  {
    "i": 8126,
    "n": "Fish, catfish, farm raised, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 7.8
      }
    ]
  },
  {
    "i": 8127,
    "n": "Fish, cod, Atlantic, wild caught, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 6.59
      }
    ]
  },
  {
    "i": 8128,
    "n": "Crustaceans, crab, blue swimming, lump, pasteurized, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 111
      }
    ]
  },
  {
    "i": 8129,
    "n": "Fish, salmon, sockeye, wild caught, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 14.8
      }
    ]
  },
  {
    "i": 8130,
    "n": "Cheese, cotija, solid",
    "ms": [
      {
        "s": "100 g",
        "c": 700
      }
    ]
  },
  {
    "i": 8131,
    "n": "Cheese, provolone, sliced",
    "ms": [
      {
        "s": "100 g",
        "c": 749
      }
    ]
  },
  {
    "i": 8133,
    "n": "Cheese, oaxaca, solid",
    "ms": [
      {
        "s": "100 g",
        "c": 532
      }
    ]
  },
  {
    "i": 8134,
    "n": "Cheese, pasteurized process cheese food or product, American, singles",
    "ms": [
      {
        "s": "100 g",
        "c": 1500
      }
    ]
  },
  {
    "i": 8135,
    "n": "Cheese, monterey jack, solid",
    "ms": [
      {
        "s": "100 g",
        "c": 715
      }
    ]
  },
  {
    "i": 8136,
    "n": "Cheese, queso fresco, solid",
    "ms": [
      {
        "s": "100 g",
        "c": 602
      }
    ]
  },
  {
    "i": 8137,
    "n": "Pork, loin, tenderloin, boneless, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.53
      }
    ]
  },
  {
    "i": 8138,
    "n": "Pork, loin, boneless, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.11
      }
    ]
  },
  {
    "i": 8139,
    "n": "Beef, flank, steak, boneless, choice, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 3.84
      }
    ]
  },
  {
    "i": 8140,
    "n": "Beef, chuck, roast, boneless, choice, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.58
      }
    ]
  },
  {
    "i": 8141,
    "n": "Beef, round, top round, boneless, choice, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.07
      }
    ]
  },
  {
    "i": 8142,
    "n": "Chicken, thigh, boneless, skinless, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.65
      }
    ]
  },
  {
    "i": 8143,
    "n": "Beef, ribeye, steak, boneless, choice, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.17
      }
    ]
  },
  {
    "i": 8144,
    "n": "Chicken, breast, boneless, skinless, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 3.94
      }
    ]
  },
  {
    "i": 8145,
    "n": "Blackeye pea, dry",
    "ms": [
      {
        "s": "100 g",
        "c": 71.4
      }
    ]
  },
  {
    "i": 8148,
    "n": "Beans, cannellini, dry",
    "ms": [
      {
        "s": "100 g",
        "c": 143
      }
    ]
  },
  {
    "i": 8154,
    "n": "Lentils, dry",
    "ms": [
      {
        "s": "100 g",
        "c": 61.8
      }
    ]
  },
  {
    "i": 8157,
    "n": "Chickpeas, (garbanzo beans, bengal gram), dry",
    "ms": [
      {
        "s": "100 g",
        "c": 111
      }
    ]
  },
  {
    "i": 8159,
    "n": "Flour, coconut",
    "ms": [
      {
        "s": "100 g",
        "c": 36
      }
    ]
  },
  {
    "i": 8160,
    "n": "Seeds, sunflower seed, kernel, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 116
      }
    ]
  },
  {
    "i": 8163,
    "n": "Nuts, brazilnuts, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 168
      }
    ]
  },
  {
    "i": 8164,
    "n": "Nuts, hazelnuts or filberts, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 135
      }
    ]
  },
  {
    "i": 8165,
    "n": "Flour, chestnut",
    "ms": [
      {
        "s": "100 g",
        "c": 55.8
      }
    ]
  },
  {
    "i": 8166,
    "n": "Seeds, pumpkin seeds (pepitas), raw",
    "ms": [
      {
        "s": "100 g",
        "c": 37.4
      }
    ]
  },
  {
    "i": 8169,
    "n": "Turkey, ground, 93% lean/ 7% fat, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 23.6
      }
    ]
  },
  {
    "i": 8171,
    "n": "Chicken, ground, with additives, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.82
      }
    ]
  },
  {
    "i": 8172,
    "n": "Pork, ground, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.86
      }
    ]
  },
  {
    "i": 8174,
    "n": "Flour, barley",
    "ms": [
      {
        "s": "100 g",
        "c": 35.6
      }
    ]
  },
  {
    "i": 8175,
    "n": "Millet, whole grain",
    "ms": [
      {
        "s": "100 g",
        "c": 9.1
      }
    ]
  },
  {
    "i": 8176,
    "n": "Flour, quinoa",
    "ms": [
      {
        "s": "100 g",
        "c": 37.6
      }
    ]
  },
  {
    "i": 8177,
    "n": "Flour, buckwheat",
    "ms": [
      {
        "s": "100 g",
        "c": 30.6
      }
    ]
  },
  {
    "i": 8178,
    "n": "Flour, rye",
    "ms": [
      {
        "s": "100 g",
        "c": 32.2
      }
    ]
  },
  {
    "i": 8179,
    "n": "Flour, cassava",
    "ms": [
      {
        "s": "100 g",
        "c": 74.6
      }
    ]
  },
  {
    "i": 8180,
    "n": "Buckwheat, whole grain",
    "ms": [
      {
        "s": "100 g",
        "c": 13.6
      }
    ]
  },
  {
    "i": 8181,
    "n": "Flour, amaranth",
    "ms": [
      {
        "s": "100 g",
        "c": 135
      }
    ]
  },
  {
    "i": 8182,
    "n": "Rice, brown, long grain, unenriched, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 8.06
      }
    ]
  },
  {
    "i": 8183,
    "n": "Rice, white, long grain, unenriched, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.46
      }
    ]
  },
  {
    "i": 8184,
    "n": "Flour, sorghum",
    "ms": [
      {
        "s": "100 g",
        "c": 11.4
      }
    ]
  },
  {
    "i": 8185,
    "n": "Nuts, almonds, whole, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 254
      }
    ]
  },
  {
    "i": 8186,
    "n": "Nuts, pine nuts, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 8.74
      }
    ]
  },
  {
    "i": 8187,
    "n": "Pineapple, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 12.5
      }
    ]
  },
  {
    "i": 8188,
    "n": "Cherries, sweet, dark red, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 12.3
      }
    ]
  },
  {
    "i": 8189,
    "n": "Oats, whole grain, rolled, old fashioned",
    "ms": [
      {
        "s": "100 g",
        "c": 45.5
      }
    ]
  },
  {
    "i": 8190,
    "n": "Oats, whole grain, steel cut",
    "ms": [
      {
        "s": "100 g",
        "c": 51.3
      }
    ]
  },
  {
    "i": 8191,
    "n": "Lettuce, romaine, green, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 27.6
      }
    ]
  },
  {
    "i": 8193,
    "n": "Nuts, pecans, halves, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 54.8
      }
    ]
  },
  {
    "i": 8194,
    "n": "Cabbage, green, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 41.8
      }
    ]
  },
  {
    "i": 8195,
    "n": "Lettuce, leaf, green, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 39.8
      }
    ]
  },
  {
    "i": 8196,
    "n": "Cream, sour, full fat",
    "ms": [
      {
        "s": "100 g",
        "c": 107
      }
    ]
  },
  {
    "i": 8198,
    "n": "Nuts, walnuts, English, halves, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 88.3
      }
    ]
  },
  {
    "i": 8199,
    "n": "Lettuce, leaf, red, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 42.6
      }
    ]
  },
  {
    "i": 8201,
    "n": "Grapes, red, seedless, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 10.2
      }
    ]
  },
  {
    "i": 8203,
    "n": "Cream cheese, full fat, block",
    "ms": [
      {
        "s": "100 g",
        "c": 97.1
      }
    ]
  },
  {
    "i": 8204,
    "n": "Cottage cheese, full fat, large or small curd",
    "ms": [
      {
        "s": "100 g",
        "c": 88.3
      }
    ]
  },
  {
    "i": 8206,
    "n": "Cream, heavy",
    "ms": [
      {
        "s": "100 g",
        "c": 61.2
      }
    ]
  },
  {
    "i": 8208,
    "n": "Applesauce, unsweetened, with added vitamin C",
    "ms": [
      {
        "s": "100 g",
        "c": 3.82
      }
    ]
  },
  {
    "i": 8211,
    "n": "Sweet potatoes, orange flesh, without skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 22.3
      }
    ]
  },
  {
    "i": 8212,
    "n": "Grapes, green, seedless, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 9.9
      }
    ]
  },
  {
    "i": 8213,
    "n": "Potatoes, red, without skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.13
      }
    ]
  },
  {
    "i": 8214,
    "n": "Potatoes, gold, without skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.94
      }
    ]
  },
  {
    "i": 8215,
    "n": "Potatoes, russet, without skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 7.8
      }
    ]
  },
  {
    "i": 8216,
    "n": "Flaxseed, ground",
    "ms": [
      {
        "s": "100 g",
        "c": 230
      }
    ]
  },
  {
    "i": 8217,
    "n": "Peanut butter, creamy",
    "ms": [
      {
        "s": "100 g",
        "c": 49.8
      }
    ]
  },
  {
    "i": 8218,
    "n": "Almond butter, creamy",
    "ms": [
      {
        "s": "100 g",
        "c": 264
      }
    ]
  },
  {
    "i": 8219,
    "n": "Sesame butter, creamy",
    "ms": [
      {
        "s": "100 g",
        "c": 116
      }
    ]
  },
  {
    "i": 8220,
    "n": "Flour, oat, whole grain",
    "ms": [
      {
        "s": "100 g",
        "c": 42.8
      }
    ]
  },
  {
    "i": 8221,
    "n": "Flour, potato",
    "ms": [
      {
        "s": "100 g",
        "c": 44.1
      }
    ]
  },
  {
    "i": 8222,
    "n": "Flour, almond",
    "ms": [
      {
        "s": "100 g",
        "c": 232
      }
    ]
  },
  {
    "i": 8224,
    "n": "Buttermilk, low fat",
    "ms": [
      {
        "s": "100 g",
        "c": 120
      }
    ]
  },
  {
    "i": 8226,
    "n": "Cheese, feta, whole milk, crumbled",
    "ms": [
      {
        "s": "100 g",
        "c": 371
      }
    ]
  },
  {
    "i": 8227,
    "n": "Cheese, parmesan, grated, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 950
      }
    ]
  },
  {
    "i": 8228,
    "n": "Peppers, bell, orange, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.9
      }
    ]
  },
  {
    "i": 8229,
    "n": "Peppers, bell, green, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 7.5
      }
    ]
  },
  {
    "i": 8230,
    "n": "Peppers, bell, red, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 6.36
      }
    ]
  },
  {
    "i": 8231,
    "n": "Carrots, mature, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 30.5
      }
    ]
  },
  {
    "i": 8233,
    "n": "Peppers, bell, yellow, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 6.69
      }
    ]
  },
  {
    "i": 8234,
    "n": "Soy milk, sweetened, plain, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 155
      }
    ]
  },
  {
    "i": 8235,
    "n": "Almond milk, unsweetened, plain, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 158
      }
    ]
  },
  {
    "i": 8236,
    "n": "Oat milk, unsweetened, plain, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 148
      }
    ]
  },
  {
    "i": 8237,
    "n": "Mushroom, king oyster",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 8238,
    "n": "Flour, semolina, coarse and semi-coarse",
    "ms": [
      {
        "s": "100 g",
        "c": 17.2
      }
    ]
  },
  {
    "i": 8239,
    "n": "Mushroom, portabella",
    "ms": [
      {
        "s": "100 g",
        "c": 3.24
      }
    ]
  },
  {
    "i": 8240,
    "n": "Flour, spelt, whole grain",
    "ms": [
      {
        "s": "100 g",
        "c": 30
      }
    ]
  },
  {
    "i": 8241,
    "n": "Grape juice, purple, with added vitamin C, from concentrate, shelf stable",
    "ms": [
      {
        "s": "100 g",
        "c": 9.74
      }
    ]
  },
  {
    "i": 8242,
    "n": "Cranberry juice, not fortified, from concentrate, shelf stable",
    "ms": [
      {
        "s": "100 g",
        "c": 6.64
      }
    ]
  },
  {
    "i": 8243,
    "n": "Mushroom, enoki",
    "ms": [
      {
        "s": "100 g",
        "c": 1.43
      }
    ]
  },
  {
    "i": 8244,
    "n": "Mushroom, pioppini",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 8245,
    "n": "Apple juice, with added vitamin C, from concentrate, shelf stable",
    "ms": [
      {
        "s": "100 g",
        "c": 7.1
      }
    ]
  },
  {
    "i": 8246,
    "n": "Grapefruit juice, red, not fortified, not from concentrate, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 8.88
      }
    ]
  },
  {
    "i": 8247,
    "n": "Grape juice, white, with added vitamin C, from concentrate, shelf stable",
    "ms": [
      {
        "s": "100 g",
        "c": 7.32
      }
    ]
  },
  {
    "i": 8248,
    "n": "Flour, semolina, fine",
    "ms": [
      {
        "s": "100 g",
        "c": 19.8
      }
    ]
  },
  {
    "i": 8249,
    "n": "Mushroom, crimini",
    "ms": [
      {
        "s": "100 g",
        "c": 4.1
      }
    ]
  },
  {
    "i": 8250,
    "n": "Flour, 00",
    "ms": [
      {
        "s": "100 g",
        "c": 18.7
      }
    ]
  },
  {
    "i": 8251,
    "n": "Mushroom, maitake",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 8252,
    "n": "Mushroom, beech",
    "ms": [
      {
        "s": "100 g",
        "c": 0.432
      }
    ]
  },
  {
    "i": 8253,
    "n": "Orange juice, no pulp, not fortified, not from concentrate, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 9.29
      }
    ]
  },
  {
    "i": 8254,
    "n": "Orange juice, no pulp, not fortified, from concentrate, refrigerated",
    "ms": [
      {
        "s": "100 g",
        "c": 12.8
      }
    ]
  },
  {
    "i": 8255,
    "n": "Tomato juice, with added ingredients, from concentrate, shelf stable",
    "ms": [
      {
        "s": "100 g",
        "c": 9.74
      }
    ]
  },
  {
    "i": 8256,
    "n": "Mushrooms, white button",
    "ms": [
      {
        "s": "100 g",
        "c": 5.46
      }
    ]
  },
  {
    "i": 8257,
    "n": "Spinach, mature",
    "ms": [
      {
        "s": "100 g",
        "c": 66.6
      }
    ]
  },
  {
    "i": 8258,
    "n": "Tomato, roma",
    "ms": [
      {
        "s": "100 g",
        "c": 9.96
      }
    ]
  },
  {
    "i": 8259,
    "n": "Mushroom, lion's mane",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 8261,
    "n": "Spinach, baby",
    "ms": [
      {
        "s": "100 g",
        "c": 68.4
      }
    ]
  },
  {
    "i": 8262,
    "n": "Mushroom, oyster",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 8263,
    "n": "Almond milk, unsweetened, plain, shelf stable",
    "ms": [
      {
        "s": "100 g",
        "c": 173
      }
    ]
  },
  {
    "i": 8264,
    "n": "Soy milk, unsweetened, plain, shelf stable",
    "ms": [
      {
        "s": "100 g",
        "c": 101
      }
    ]
  },
  {
    "i": 8265,
    "n": "Apples, fuji, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.98
      }
    ]
  },
  {
    "i": 8266,
    "n": "Apples, honeycrisp, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 3.87
      }
    ]
  },
  {
    "i": 8267,
    "n": "Apples, gala, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 6.64
      }
    ]
  },
  {
    "i": 8268,
    "n": "Apples, red delicious, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 4.66
      }
    ]
  },
  {
    "i": 8269,
    "n": "Apples, granny smith, with skin, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 5.48
      }
    ]
  },
  {
    "i": 8270,
    "n": "Bananas, ripe and slightly ripe, raw",
    "ms": [
      {
        "s": "1 Banana, Peeled",
        "c": 5.75
      }
    ]
  },
  {
    "i": 8271,
    "n": "Flour, pastry, unenriched, unbleached",
    "ms": [
      {
        "s": "100 g",
        "c": 17
      }
    ]
  },
  {
    "i": 8272,
    "n": "Flour, rice, glutinous",
    "ms": [
      {
        "s": "100 g",
        "c": 10
      }
    ]
  },
  {
    "i": 8273,
    "n": "Onions, white, raw",
    "ms": [
      {
        "s": "100 g",
        "c": 21
      }
    ]
  },
  {
    "i": 8274,
    "n": "Flour, rice, brown",
    "ms": [
      {
        "s": "100 g",
        "c": 10
      }
    ]
  },
  {
    "i": 8275,
    "n": "Flour, soy, defatted",
    "ms": [
      {
        "s": "100 g",
        "c": 338
      }
    ]
  },
  {
    "i": 8276,
    "n": "Flour, soy, full-fat",
    "ms": [
      {
        "s": "100 g",
        "c": 258
      }
    ]
  },
  {
    "i": 8277,
    "n": "Onions, yellow, raw",
    "ms": [
      {
        "s": "1 Onion, Edible",
        "c": 21.4
      }
    ]
  },
  {
    "i": 8278,
    "n": "Butter, stick, salted",
    "ms": [
      {
        "s": "100 g",
        "c": 21
      }
    ]
  },
  {
    "i": 8279,
    "n": "Onions, red, raw",
    "ms": [
      {
        "s": "1 Onion, Edible",
        "c": 33.5
      }
    ]
  },
  {
    "i": 8280,
    "n": "Flour, bread, white, enriched, unbleached",
    "ms": [
      {
        "s": "100 g",
        "c": 19
      }
    ]
  },
  {
    "i": 8281,
    "n": "Flour, corn, yellow, fine meal, enriched",
    "ms": [
      {
        "s": "100 g",
        "c": 0
      }
    ]
  },
  {
    "i": 8282,
    "n": "Flour, rice, white, unenriched",
    "ms": [
      {
        "s": "100 g",
        "c": 6
      }
    ]
  },
  {
    "i": 8283,
    "n": "Flour, wheat, all-purpose, enriched, bleached",
    "ms": [
      {
        "s": "100 g",
        "c": 19
      }
    ]
  },
  {
    "i": 8284,
    "n": "Flour, wheat, all-purpose, enriched, unbleached",
    "ms": [
      {
        "s": "100 g",
        "c": 21
      }
    ]
  },
  {
    "i": 8286,
    "n": "Flour, whole wheat, unenriched",
    "ms": [
      {
        "s": "100 g",
        "c": 38
      }
    ]
  },
  {
    "i": 8289,
    "n": "Eggs, Grade A, Large, egg whole",
    "ms": [
      {
        "s": "1 egg, whole without shell",
        "c": 24.1
      }
    ]
  },
  {
    "i": 8291,
    "n": "Beans, Dry, Flor de Mayo (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 180
      }
    ]
  },
  {
    "i": 8292,
    "n": "Beans, Dry, Carioca (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 194
      }
    ]
  },
  {
    "i": 8293,
    "n": "Beans, Dry, Light Red Kidney (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 103
      }
    ]
  },
  {
    "i": 8294,
    "n": "Beans, Dry, Light Tan (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 98
      }
    ]
  },
  {
    "i": 8296,
    "n": "Beans, Dry, Small Red (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 149
      }
    ]
  },
  {
    "i": 8297,
    "n": "Beans, Dry, Great Northern (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 192
      }
    ]
  },
  {
    "i": 8298,
    "n": "Beans, Dry, Black (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 191
      }
    ]
  },
  {
    "i": 8299,
    "n": "Beans, Dry, Pinto (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 161
      }
    ]
  },
  {
    "i": 8300,
    "n": "Beans, Dry, Small White (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 236
      }
    ]
  },
  {
    "i": 8301,
    "n": "Beans, Dry, Tan (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 178
      }
    ]
  },
  {
    "i": 8302,
    "n": "Beans, Dry, Navy (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 229
      }
    ]
  },
  {
    "i": 8303,
    "n": "Beans, Dry, Cranberry (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 152
      }
    ]
  },
  {
    "i": 8304,
    "n": "Beans, Dry, Dark Red Kidney (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 98
      }
    ]
  },
  {
    "i": 8305,
    "n": "Beans, Dry, Brown (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 158
      }
    ]
  },
  {
    "i": 8306,
    "n": "Beans, Dry, Pink (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 137
      }
    ]
  },
  {
    "i": 8307,
    "n": "Beans, Dry, Medium Red (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 193
      }
    ]
  },
  {
    "i": 8308,
    "n": "Beans, Dry, Red (0% moisture)",
    "ms": [
      {
        "s": "100 g",
        "c": 148
      }
    ]
  },
  {
    "i": 8309,
    "n": "Cheese, American, restaurant",
    "ms": [
      {
        "s": "1 slice",
        "c": 81.3
      }
    ]
  },
  {
    "i": 8320,
    "n": "Salt, table, iodized",
    "ms": [
      {
        "s": "1 teaspoon",
        "c": 3.05
      }
    ]
  },
  {
    "i": 8323,
    "n": "Pears, raw, bartlett",
    "ms": [
      {
        "s": "1 each, small",
        "c": 11.8
      },
      {
        "s": "1 each, large",
        "c": 18.4
      },
      {
        "s": "1 each, medium",
        "c": 14.2
      },
      {
        "s": "1 cup, slices",
        "c": 11.2
      }
    ]
  },
  {
    "i": 8328,
    "n": "Figs, Dried, Uncooked*",
    "ms": [
      {
        "s": "1 cup",
        "c": 241
      },
      {
        "s": "1 each",
        "c": 13.6
      }
    ]
  },
  {
    "i": 8329,
    "n": "Cheese, Dry White, Queso Seco*",
    "ms": [
      {
        "s": "1 cup, grated",
        "c": 643
      }
    ]
  },
  {
    "i": 8344,
    "n": "Fish, pollock, raw",
    "ms": [
      {
        "s": "1 fillet",
        "c": 26.6
      }
    ]
  },
  {
    "i": 8347,
    "n": "Cookies, oatmeal, soft, with raisins",
    "ms": [
      {
        "s": "1 cookie",
        "c": 7.83
      }
    ]
  },
  {
    "i": 8348,
    "n": "Olives, green, Manzanilla, stuffed with pimiento",
    "ms": [
      {
        "s": "1 olive",
        "c": 3.87
      }
    ]
  },
  {
    "i": 8350,
    "n": "Sauce, Pasta, Spaghetti/Marinara, Ready-To-Serve*",
    "ms": [
      {
        "s": "1 serving, 1/2 cup",
        "c": 36.4
      }
    ]
  },
  {
    "i": 8353,
    "n": "Oil, Coconut*",
    "ms": [
      {
        "s": "1 tablespoon, liquid oil",
        "c": 0.116
      }
    ]
  },
  {
    "i": 8354,
    "n": "Yogurt, Greek, Strawberry, Nonfat*",
    "ms": [
      {
        "s": "1 container, 5.3 oz",
        "c": 146
      }
    ]
  },
  {
    "i": 8361,
    "n": "Cheese, cheddar",
    "ms": [
      {
        "s": "1 cup",
        "c": 742
      },
      {
        "s": "1 slice",
        "c": 120
      }
    ]
  },
  {
    "i": 8369,
    "n": "Grapefruit Juice, White, Canned Or Bottled, Unsweetened*",
    "ms": [
      {
        "s": "1 cup",
        "c": 41.1
      }
    ]
  },
  {
    "i": 8375,
    "n": "Egg, Whole, Raw, Frozen*",
    "ms": [
      {
        "s": "1 oz",
        "c": 15.6
      }
    ]
  },
  {
    "i": 8377,
    "n": "Kale, Raw*",
    "ms": [
      {
        "s": "1 cup, pieces of ~1",
        "c": 52.3
      }
    ]
  },
  {
    "i": 8381,
    "n": "Tomatoes, grape, raw",
    "ms": [
      {
        "s": "1 cup",
        "c": 16.7
      },
      {
        "s": "5 tomatoes",
        "c": 5.47
      }
    ]
  }
];

// Format flag
export const __minified__ = true;

// Database metadata
export const DATABASE_METADATA = {
  "source": "USDA-FDC",
  "label": "USDA FoodData Central",
  "name": "USDA FoodData Central - Foundation & SR Legacy",
  "description": "Comprehensive food database combining USDA FoodData Central (Foundation and SR Legacy sources) with calcium content data for nutrition tracking",
  "version": "2025.2",
  "created": "2025-09-08",
  "author": "USDA Agricultural Research Service",
  "sourceUrls": [
    {
      "name": "USDA FoodData Central",
      "url": "https://fdc.nal.usda.gov/food-search"
    },
    {
      "name": "USDA Abridged List Ordered by Calcium Nutrient Content in Household Measure",
      "url": "https://www.nal.usda.gov/sites/default/files/page-files/calcium.pdf"
    }
  ],
  "notes": "This database was curated from USDA FoodData Central, combining multiple raw data files into a simplified format optimized for calcium tracking. The curation process assigned unique identifiers to each food, selected the most practical serving sizes, and merged nutritionally similar foods (those with identical calcium content) under single representative entries. To optimize app performance, branded foods were filtered out (except essential staples), cooking method variations were simplified, and foods with very low calcium content that only had technical 100-gram measurements (rather than practical serving sizes) were removed, while preserving nutritional accuracy through developer-maintained keep and exclusion lists.\n\nCustom curation lists applied:\n• Foods explicitly preserved: almonds, bison, ground, cheese, swiss, milk, whole, spinach, yogurt, plain\n• Foods explicitly excluded: alaska native, apache, babyfood, elk, emu, fast food, game meat, gluten free, hopi, kiwano, klamath, navajo, northern plains indians, ostrich, shoshone bannock",
  "recordCount": 3876
};
