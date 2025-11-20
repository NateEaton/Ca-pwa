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

/**
 * @fileoverview Enhanced search service that provides unified, intelligent food search
 * across the application with context-aware results and false positive elimination.
 */

import { getPrimaryMeasure } from '../data/foodDatabase.js';

export interface SearchOptions {
  mode?: 'add_food' | 'database';
  favorites?: Set<number>;
  hiddenFoods?: Set<number>;
  customFoods?: any[];
  maxResults?: number;
}

export interface SearchResult {
  food: any;
  score: number;
  matchType: 'exact' | 'phrase' | 'all_words' | 'partial';
  highlights?: string[];
}

interface SearchContext {
  originalQuery: string;
  keywords: string[];
  isMultiWord: boolean;
  mode: string;
  favorites: Set<number>;
  hiddenFoods: Set<number>;
}

interface KeywordAnalysis {
  totalScore: number;
  hasAnyMatch: boolean;
  exactMatches: number;
  partialMatches: number;
  keywordsFound: number;
  allKeywordsFound: boolean;
}

export class SearchService {
  private static readonly SEARCH_STOPWORDS = [
    "with", "without", "and", "or", "the", "of", "in", "on", "at", "to", "for", 
    "from", "by", "added", "prepared", "cooked", "raw", "fresh", "frozen", 
    "canned", "dried", "chopped", "sliced", "diced", "whole", "ground", 
    "boiled", "baked", "fried", "roasted", "steamed"
  ];

  private static readonly SCORING = {
    EXACT_WORD_MATCH: 10,
    PARTIAL_WORD_MATCH: 5,
    NAME_START_BONUS: 15,
    FAVORITE_BONUS: 10000,
    CUSTOM_FOOD_BONUS: 5000,
    PARTIAL_WORD_PENALTY: -200,
    CALCIUM_BONUS_MULTIPLIER: 0.5
  };

  /**
   * Enhanced search with word boundary detection and multi-keyword requirements
   */
  static searchFoods(
    query: string, 
    foods: any[], 
    options: SearchOptions = {}
  ): SearchResult[] {
    if (!query || query.length < 2) return [];

    const searchContext = this.createSearchContext(query, options);
    const results = this.performEnhancedSearch(foods, searchContext);
    
    return this.rankAndLimit(results, options);
  }

  private static createSearchContext(query: string, options: SearchOptions): SearchContext {
    const keywords = this.extractKeywords(query);
    
    return {
      originalQuery: query,
      keywords,
      isMultiWord: keywords.length > 1,
      mode: options.mode || 'add_food',
      favorites: options.favorites || new Set(),
      hiddenFoods: options.hiddenFoods || new Set()
    };
  }

  private static extractKeywords(query: string): string[] {
    return query
      .toLowerCase()
      .split(/[,\s]+/)
      .filter(word => word.length > 1)
      .filter(word => !this.SEARCH_STOPWORDS.includes(word));
  }

  private static performEnhancedSearch(foods: any[], context: SearchContext): SearchResult[] {
    return foods
      .map(food => this.scoreFoodMatch(food, context))
      .filter(result => result !== null)
      .filter(result => this.passesContextFilters(result, context));
  }

  private static scoreFoodMatch(food: any, context: SearchContext): SearchResult | null {
    const searchText = food.name.toLowerCase();
    const keywordAnalysis = this.analyzeKeywordMatches(searchText, context.keywords);
    
    // For multi-word queries, require ALL keywords in both modes
    if (context.isMultiWord && !keywordAnalysis.allKeywordsFound) {
      return null;
    }

    // Must match at least one keyword
    if (!keywordAnalysis.hasAnyMatch) {
      return null;
    }

    const baseScore = this.calculateBaseScore(keywordAnalysis);
    const finalScore = this.applyBonuses(food, context, baseScore, keywordAnalysis);

    return {
      food,
      score: finalScore,
      matchType: this.determineMatchType(keywordAnalysis),
      highlights: this.generateHighlights(food.name, context.keywords)
    };
  }

  private static analyzeKeywordMatches(searchText: string, keywords: string[]): KeywordAnalysis {
    const searchWords = searchText.split(/\s+/);
    let totalScore = 0;
    let hasAnyMatch = false;
    let exactMatches = 0;
    let partialMatches = 0;
    let keywordsFound = 0;

    keywords.forEach(keyword => {
      let keywordFound = false;
      
      // Check for exact word match
      if (searchWords.includes(keyword)) {
        totalScore += this.SCORING.EXACT_WORD_MATCH;
        exactMatches++;
        keywordFound = true;
        hasAnyMatch = true;
      }
      // Check for partial match (but apply penalty for partial words)
      else if (searchText.includes(keyword)) {
        // Word boundary check: prevent "butter" matching "Butterbur"
        const isPartialWordMatch = this.isPartialWordMatch(searchText, keyword);
        
        if (isPartialWordMatch) {
          totalScore += this.SCORING.PARTIAL_WORD_MATCH;
          totalScore += this.SCORING.PARTIAL_WORD_PENALTY; // Apply penalty
          partialMatches++;
        } else {
          totalScore += this.SCORING.PARTIAL_WORD_MATCH;
        }
        
        keywordFound = true;
        hasAnyMatch = true;
      }

      if (keywordFound) {
        keywordsFound++;
        
        // Boost score if keyword appears at start
        if (searchText.startsWith(keyword)) {
          totalScore += this.SCORING.NAME_START_BONUS;
        }
      }
    });

    return {
      totalScore,
      hasAnyMatch,
      exactMatches,
      partialMatches,
      keywordsFound,
      allKeywordsFound: keywordsFound === keywords.length
    };
  }

  private static isPartialWordMatch(searchText: string, keyword: string): boolean {
    if (!searchText.includes(keyword)) return false;

    // Escape regex special characters to prevent ReDoS attacks
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create word boundary regex to check if keyword appears as complete word
    const wordBoundaryRegex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');
    return !wordBoundaryRegex.test(searchText);
  }

  private static calculateBaseScore(analysis: KeywordAnalysis): number {
    return analysis.totalScore;
  }

  private static applyBonuses(food: any, context: SearchContext, baseScore: number, analysis: KeywordAnalysis): number {
    let score = baseScore;

    // Prioritize favorites (highest priority)
    if (context.favorites.has(food.id)) {
      score += this.SCORING.FAVORITE_BONUS;
    }

    // Prioritize custom foods (second priority)
    if (food.isCustom) {
      score += this.SCORING.CUSTOM_FOOD_BONUS;
    }

    // Boost score for foods with higher calcium content (use primary measure for compatibility)
    const primaryMeasure = getPrimaryMeasure(food);
    score += Math.log(primaryMeasure.calcium + 1) * this.SCORING.CALCIUM_BONUS_MULTIPLIER;

    return score;
  }

  private static passesContextFilters(result: SearchResult, context: SearchContext): boolean {
    const food = result.food;

    // Exclude hidden foods (custom foods can't be hidden)
    if (!food.isCustom && context.hiddenFoods.has(food.id)) {
      return false;
    }

    return true;
  }

  private static determineMatchType(analysis: KeywordAnalysis): 'exact' | 'phrase' | 'all_words' | 'partial' {
    if (analysis.exactMatches === analysis.keywordsFound) return 'exact';
    if (analysis.exactMatches > 0) return 'phrase';
    if (analysis.allKeywordsFound) return 'all_words';
    return 'partial';
  }

  private static generateHighlights(foodName: string, keywords: string[]): string[] {
    // Optional: return matched portions for highlighting in UI
    return keywords.filter(keyword => 
      foodName.toLowerCase().includes(keyword)
    );
  }

  private static rankAndLimit(results: SearchResult[], options: SearchOptions): SearchResult[] {
    const maxResults = options.maxResults || 15;
    
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }
}