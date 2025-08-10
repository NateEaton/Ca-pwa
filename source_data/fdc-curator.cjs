#!/usr/bin/env node
/**
 * Offline-first USDA Calcium Foods Curator
 * Focus: Foundation + SR Legacy, realistic default serving sizes, per-100g values
 */

require("dotenv").config();
const API_KEY = process.env.FDC_API_KEY;

if (!API_KEY) {
  console.error("FDC_API_KEY not found in .env file");
  process.exit(1);
}

const fs = require("fs-extra");
const path = require("path");

let fetch =
  globalThis.fetch ||
  ((...args) => import("node-fetch").then(({ default: f }) => f(...args)));

class FDCCurator {
  constructor(apiKey) {
    this.apiKey = apiKey || "DEMO_KEY";
    this.baseUrl = "https://api.nal.usda.gov/fdc/v1";
    this.rateLimit = 1000;
    this.results = [];
    this.existingFoods = this.loadExistingFoods();
  }

  loadExistingFoods() {
    try {
      const existingData = require("./existing-usda-data.json");
      return new Set(existingData.map((f) => this.normalizeName(f.name)));
    } catch {
      return new Set();
    }
  }

  normalizeName(name) {
    if (!name) return "";
    let clean = name
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s*,\s*/g, ", ");
    clean = clean.replace(/\b\w/g, (c) => c.toUpperCase());
    return clean;
  }

  normalizeUnit(unit) {
    if (!unit) return "";
    return unit
      .replace(/\s+/g, " ")
      .replace(/^cup$/, "cup")
      .replace(/^cups$/, "cups")
      .replace(/^tbsp$/, "tablespoon")
      .replace(/^tsp$/, "teaspoon")
      .trim();
  }

  foodsEqual(a, b) {
    return (
      a.name === b.name && Math.abs(a.calciumPer100g - b.calciumPer100g) <= 5
    );
  }

  async searchFoodsByDataType(dataType, minCalcium = 50, pageSize = 200) {
    let pageNumber = 1,
      hasMore = true;

    while (hasMore && pageNumber <= 50) {
      const response = await fetch(
        `${this.baseUrl}/foods/search?api_key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: "",
            pageSize,
            pageNumber,
            sortBy: "dataType.keyword",
            sortOrder: "asc",
            dataType: [dataType],
            nutrients: { 1087: { min: minCalcium } },
          }),
        }
      );

      if (!response.ok) break;

      const data = await response.json();
      if (!data.foods?.length) break;

      const processed = this.processFoodsPage(data.foods);
      for (const food of processed) {
        if (!this.results.some((f) => this.foodsEqual(f, food))) {
          this.results.push(food);
        }
      }

      hasMore = data.foods.length === pageSize;
      pageNumber++;
      await new Promise((r) => setTimeout(r, this.rateLimit));
    }
  }

  processFoodsPage(foods) {
    return foods.map((food) => {
      const calciumNutrient = food.foodNutrients?.find(
        (n) => n.nutrientId === 1087
      );
      const calciumPer100g = calciumNutrient
        ? Math.round(calciumNutrient.value || 0)
        : 0;

      const serving = this.extractServingSize(food);
      const calciumPerServing = Math.round(
        (calciumPer100g * serving.gramWeight) / 100
      );

      return {
        id: food.fdcId,
        name: this.normalizeName(food.description),
        defaultServing: serving,
        calciumPer100g,
        calcium: calciumPerServing,
        isCustom: false,
      };
    });
  }

  extractServingSize(food) {
    if (food.foodPortions?.length) {
      // Prioritize household-friendly units
      const preferredKeywords = [
        "cup",
        "slice",
        "tablespoon",
        "tbsp",
        "teaspoon",
        "tsp",
        "oz",
        "piece",
        "package",
        "patty",
      ];
      // First: try to find household measure
      let portion = food.foodPortions.find(
        (p) =>
          p.gramWeight > 0 &&
          p.modifier &&
          preferredKeywords.some((k) => p.modifier.toLowerCase().includes(k))
      );
      // Second: fallback to any with a valid gramWeight & not "quantity not specified"
      if (!portion) {
        portion = food.foodPortions.find(
          (p) =>
            p.gramWeight > 0 &&
            p.modifier &&
            !/quantity not specified/i.test(p.modifier)
        );
      }
      // Third: fallback to first valid portion
      if (!portion) {
        portion =
          food.foodPortions.find((p) => p.gramWeight > 0) ||
          food.foodPortions[0];
      }
      if (portion) {
        return {
          amount: portion.amount || 1,
          unit: this.normalizeUnit(portion.modifier || "g"),
          gramWeight: portion.gramWeight || 100,
        };
      }
    }
    // Final fallback: 100 g
    return { amount: 100, unit: "g", gramWeight: 100 };
  }

  async saveResults(outputDir = "./fdc-calcium-data") {
    await fs.ensureDir(outputDir);
    this.results.sort((a, b) => b.calcium - a.calcium);
    await fs.writeJson(
      path.join(outputDir, "calcium-foods.json"),
      this.results,
      { spaces: 2 }
    );
    console.log(`💾 Saved ${this.results.length} foods to ${outputDir}`);
  }
}

async function main() {
  const minCalcium =
    parseInt(
      process.argv.find((a) => a.startsWith("--min-calcium="))?.split("=")[1]
    ) || 50;
  const apiKey = process.env.FDC_API_KEY || "DEMO_KEY";

  const curator = new FDCCurator(apiKey);
  // Foundation + SR Legacy only
  await curator.searchFoodsByDataType("Foundation", minCalcium);
  await curator.searchFoodsByDataType("SR Legacy", minCalcium);
  await curator.saveResults();
}

if (require.main === module) {
  main();
}
