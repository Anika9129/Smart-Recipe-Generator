const Fuse = require('fuse.js');

class IngredientService {
  constructor() {
    this.allIngredients = new Set();
    this.fuse = null;
    this.substitutions = {
      'milk': ['almond milk', 'soy milk', 'oat milk', 'coconut milk'],
      'butter': ['margarine', 'coconut oil', 'olive oil', 'vegetable oil'],
      'eggs': ['flax eggs', 'chia eggs', 'applesauce'],
      'ground beef': ['ground turkey', 'ground chicken', 'lentils', 'mushrooms'],
      'flour': ['almond flour', 'rice flour', 'coconut flour', 'oat flour'],
      'sugar': ['honey', 'maple syrup', 'stevia', 'brown sugar'],
      'soy sauce': ['tamari', 'coconut aminos', 'fish sauce'],
      'chicken breast': ['chicken thighs', 'turkey breast', 'tofu', 'tempeh'],
      'heavy cream': ['coconut cream', 'cashew cream', 'greek yogurt'],
      'parmesan cheese': ['nutritional yeast', 'romano cheese', 'pecorino']
    };
  }

  initialize(recipes) {
    // Extract all unique ingredients from recipes
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        this.allIngredients.add(ingredient.name.toLowerCase());
      });
    });

    // Initialize fuzzy search
    const ingredientsList = Array.from(this.allIngredients);
    this.fuse = new Fuse(ingredientsList, {
      threshold: 0.3, // Lower threshold means more strict matching
      includeScore: true,
      keys: [{ name: 'ingredient', getFn: (item) => item }]
    });

    console.log(`Initialized ingredient service with ${ingredientsList.length} ingredients`);
  }

  getIngredientSuggestions(input, limit = 10) {
    if (!input || input.length < 2) {
      return { suggestions: [] };
    }

    const searchResults = this.fuse.search(input.toLowerCase());
    const suggestions = searchResults
      .slice(0, limit)
      .map(result => ({
        ingredient: result.item,
        confidence: 1 - result.score
      }));

    return { suggestions, query: input };
  }

  normalizeIngredient(ingredient) {
    // Basic normalization - remove common descriptors
    const normalized = ingredient.toLowerCase()
      .replace(/\b(fresh|dried|chopped|sliced|diced|minced|grated|ground)\b/g, '')
      .replace(/\b(organic|extra virgin|unsalted|low-fat|fat-free)\b/g, '')
      .trim()
      .replace(/\s+/g, ' ');
    
    return normalized;
  }

  findIngredientMatches(userIngredient) {
    const normalized = this.normalizeIngredient(userIngredient);
    
    // Direct match
    if (this.allIngredients.has(normalized)) {
      return [{ ingredient: normalized, matchType: 'exact', confidence: 1.0 }];
    }

    // Fuzzy match
    const fuzzyResults = this.fuse.search(normalized);
    const matches = [];

    if (fuzzyResults.length > 0) {
      matches.push({
        ingredient: fuzzyResults[0].item,
        matchType: 'fuzzy',
        confidence: 1 - fuzzyResults[0].score
      });
    }

    // Check for substitutions
    for (const [baseIngredient, substitutes] of Object.entries(this.substitutions)) {
      if (normalized.includes(baseIngredient) || substitutes.some(sub => normalized.includes(sub))) {
        matches.push({
          ingredient: baseIngredient,
          matchType: 'substitution',
          confidence: 0.8,
          substitutes: substitutes
        });
        break;
      }
    }

    return matches;
  }

  calculateIngredientMatch(recipeIngredients, userIngredients) {
    if (userIngredients.length === 0) return 0;
    
    const normalizedUserIngredients = userIngredients.map(ing => 
      this.normalizeIngredient(ing)
    );
    
    const normalizedRecipeIngredients = recipeIngredients.map(ing => 
      this.normalizeIngredient(ing)
    );

    let matches = 0;
    const totalRecipeIngredients = normalizedRecipeIngredients.length;

    normalizedRecipeIngredients.forEach(recipeIng => {
      const isDirectMatch = normalizedUserIngredients.some(userIng => 
        userIng.includes(recipeIng) || recipeIng.includes(userIng)
      );

      if (isDirectMatch) {
        matches++;
      } else {
        // Check for substitutions
        const hasSubstitution = normalizedUserIngredients.some(userIng => {
          const substitutes = this.substitutions[recipeIng] || [];
          return substitutes.some(sub => userIng.includes(sub) || sub.includes(userIng));
        });
        
        if (hasSubstitution) {
          matches += 0.8; // Partial credit for substitutions
        }
      }
    });

    return Math.min(matches / totalRecipeIngredients, 1.0);
  }

  findRecipesByIngredients(recipes, userIngredients, exactMatch = false) {
    const normalizedUserIngredients = userIngredients.map(ing => 
      this.normalizeIngredient(ing)
    );

    const matchingRecipes = [];

    recipes.forEach(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.name);
      const matchScore = this.calculateIngredientMatch(recipeIngredients, userIngredients);

      // Include recipe if it has at least one matching ingredient (or all for exact match)
      const minimumMatch = exactMatch ? 1.0 : 0.1;
      
      if (matchScore >= minimumMatch) {
        const missingIngredients = this.getMissingIngredients(recipeIngredients, userIngredients);
        
        matchingRecipes.push({
          ...recipe,
          matchScore,
          missingIngredients,
          substitutionSuggestions: this.getSubstitutionSuggestions(missingIngredients)
        });
      }
    });

    return matchingRecipes;
  }

  getMissingIngredients(recipeIngredients, userIngredients) {
    const normalizedUserIngredients = userIngredients.map(ing => 
      this.normalizeIngredient(ing)
    );
    
    const missing = [];
    
    recipeIngredients.forEach(recipeIng => {
      const normalized = this.normalizeIngredient(recipeIng);
      const hasIngredient = normalizedUserIngredients.some(userIng => 
        userIng.includes(normalized) || normalized.includes(userIng)
      );
      
      if (!hasIngredient) {
        // Check if user has a substitute
        const hasSubstitute = normalizedUserIngredients.some(userIng => {
          const substitutes = this.substitutions[normalized] || [];
          return substitutes.some(sub => userIng.includes(sub) || sub.includes(userIng));
        });
        
        if (!hasSubstitute) {
          missing.push(recipeIng);
        }
      }
    });
    
    return missing;
  }

  getSubstitutionSuggestions(missingIngredients) {
    const suggestions = {};
    
    missingIngredients.forEach(ingredient => {
      const normalized = this.normalizeIngredient(ingredient);
      if (this.substitutions[normalized]) {
        suggestions[ingredient] = this.substitutions[normalized];
      }
    });
    
    return suggestions;
  }

  getAllIngredients() {
    return Array.from(this.allIngredients).sort();
  }
}

const ingredientService = new IngredientService();
module.exports = ingredientService;
