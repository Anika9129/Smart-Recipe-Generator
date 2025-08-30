import axios from 'axios';

class RecipeService {
  constructor() {
    this.recipes = [];
  }

  async loadRecipes() {
    if (this.recipes.length === 0) {
      try {
        const response = await axios.get('/recipes.json');
        this.recipes = response.data.recipes || [];
      } catch (error) {
        console.error('Error loading recipes:', error);
        this.recipes = [];
      }
    }
  }

  async getAllRecipes(limit = null, page = 1) {
    await this.loadRecipes();
    let recipes = [...this.recipes];
    if (limit) {
      const startIndex = (page - 1) * limit;
      recipes = recipes.slice(startIndex, startIndex + limit);
    }
    return {
      recipes,
      total: this.recipes.length,
      page,
      totalPages: limit ? Math.ceil(this.recipes.length / limit) : 1,
    };
  }

  async getRecipeById(id) {
    await this.loadRecipes();
    const recipe = this.recipes.find((r) => r.id === parseInt(id));
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return { recipe };
  }

  async searchByIngredients(ingredients, exactMatch = false) {
    await this.loadRecipes();
    const searchTerms = ingredients.map((ing) => ing.toLowerCase());
    const matchedRecipes = this.recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((ing) =>
        ing.name.toLowerCase()
      );
      if (exactMatch) {
        return searchTerms.every((term) =>
          recipeIngredients.some((ing) => ing.includes(term))
        );
      } else {
        return searchTerms.some((term) =>
          recipeIngredients.some((ing) => ing.includes(term))
        );
      }
    });
    return {
      recipes: matchedRecipes,
      total: matchedRecipes.length,
    };
  }

  async filterRecipes(filters) {
    await this.loadRecipes();
    let filteredRecipes = [...this.recipes];
    // ... (rest of the filtering logic is the same as before)
    if (filters.dietary && filters.dietary.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          filters.dietary.some(diet =>
            recipe.dietary && recipe.dietary.some(recipeDiet =>
              recipeDiet.toLowerCase() === diet.toLowerCase()
            )
          )
        );
      }
      if (filters.difficulty) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.difficulty && recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }
      if (filters.maxCookingTime) {
        const maxTime = parseInt(filters.maxCookingTime);
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.cookingTime && recipe.cookingTime <= maxTime
        );
      }
      if (filters.maxCalories) {
        const maxCals = parseInt(filters.maxCalories);
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.nutrition && recipe.nutrition.calories <= maxCals
        );
      }
      if (filters.cuisine) {
        filteredRecipes = filteredRecipes.filter(recipe =>
          recipe.cuisine && recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
        );
      }
    return {
      recipes: filteredRecipes,
      total: filteredRecipes.length,
    };
  }

    async searchWithFilters(ingredients = [], filters = {}) {
    await this.loadRecipes();
    let results = [...this.recipes];
    if (ingredients && ingredients.length > 0) {
      const searchTerms = ingredients.map((ing) => ing.toLowerCase());
      results = results.filter((recipe) => {
        const recipeIngredients = recipe.ingredients.map((ing) =>
          ing.name.toLowerCase()
        );
        return searchTerms.some((term) =>
          recipeIngredients.some((ing) => ing.includes(term))
        );
      });
    }
    if (filters.dietary && filters.dietary.length > 0) {
        results = results.filter(recipe =>
          filters.dietary.some(diet =>
            recipe.dietary && recipe.dietary.some(recipeDiet =>
              recipeDiet.toLowerCase() === diet.toLowerCase()
            )
          )
        );
      }
      if (filters.difficulty) {
        results = results.filter(recipe =>
          recipe.difficulty && recipe.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
        );
      }
      if (filters.maxCookingTime) {
        const maxTime = parseInt(filters.maxCookingTime);
        results = results.filter(recipe =>
          recipe.cookingTime && recipe.cookingTime <= maxTime
        );
      }
      if (filters.maxCalories) {
        const maxCals = parseInt(filters.maxCalories);
        results = results.filter(recipe =>
          recipe.nutrition && recipe.nutrition.calories <= maxCals
        );
      }
      if (filters.cuisine) {
        results = results.filter(recipe =>
          recipe.cuisine && recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
        );
      }
    return {
      recipes: results,
      total: results.length,
    };
  }
}

export const recipeService = new RecipeService();
