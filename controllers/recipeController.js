const Fuse = require('fuse.js');
const ingredientService = require('../services/ingredientService');

class RecipeController {
  static getAllRecipes(req, res) {
    try {
      const { limit, page = 1 } = req.query;
      const recipes = req.app.locals.recipes;
      
      if (limit) {
        const startIndex = (page - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedRecipes = recipes.slice(startIndex, endIndex);
        
        return res.json({
          recipes: paginatedRecipes,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: recipes.length,
            pages: Math.ceil(recipes.length / parseInt(limit))
          }
        });
      }
      
      res.json({ recipes });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipes', message: error.message });
    }
  }

  static getRecipeById(req, res) {
    try {
      const recipeId = parseInt(req.params.id);
      const recipes = req.app.locals.recipes;
      const recipe = recipes.find(r => r.id === recipeId);
      
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }
      
      // Add average rating if available
      const userRatings = req.app.locals.userRatings[recipeId] || [];
      const averageRating = userRatings.length > 0 
        ? userRatings.reduce((sum, rating) => sum + rating, 0) / userRatings.length 
        : null;
      
      res.json({
        recipe: {
          ...recipe,
          averageRating,
          totalRatings: userRatings.length
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipe', message: error.message });
    }
  }

  static searchRecipesByIngredients(req, res) {
    try {
      const { ingredients, exactMatch = false } = req.body;
      const recipes = req.app.locals.recipes;
      
      if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Please provide ingredients as an array' });
      }
      
      const matchingRecipes = ingredientService.findRecipesByIngredients(
        recipes, 
        ingredients, 
        exactMatch
      );
      
      // Sort by ingredient match percentage
      const sortedRecipes = matchingRecipes.sort((a, b) => b.matchScore - a.matchScore);
      
      res.json({
        recipes: sortedRecipes,
        searchCriteria: { ingredients, exactMatch },
        totalMatches: sortedRecipes.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to search recipes', message: error.message });
    }
  }
  
  static filterRecipes(req, res) {
    try {
      const {
        dietary,
        difficulty,
        maxCookingTime,
        minCalories,
        maxCalories,
        cuisine,
        tags
      } = req.query;
      
      let filteredRecipes = [...req.app.locals.recipes];
      
      // Filter by dietary restrictions
      if (dietary) {
        const dietaryRestrictions = Array.isArray(dietary) ? dietary : [dietary];
        filteredRecipes = filteredRecipes.filter(recipe =>
          dietaryRestrictions.some(diet => recipe.dietary.includes(diet))
        );
      }
      
      // Filter by difficulty
      if (difficulty) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.difficulty === difficulty
        );
      }
      
      // Filter by cooking time
      if (maxCookingTime) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.cookingTime <= parseInt(maxCookingTime)
        );
      }
      
      // Filter by calorie range
      if (minCalories || maxCalories) {
        filteredRecipes = filteredRecipes.filter(recipe => {
          const calories = recipe.nutrition.calories;
          const aboveMin = !minCalories || calories >= parseInt(minCalories);
          const belowMax = !maxCalories || calories <= parseInt(maxCalories);
          return aboveMin && belowMax;
        });
      }
      
      // Filter by cuisine
      if (cuisine) {
        filteredRecipes = filteredRecipes.filter(recipe => 
          recipe.cuisine.toLowerCase().includes(cuisine.toLowerCase())
        );
      }
      
      // Filter by tags
      if (tags) {
        const tagList = Array.isArray(tags) ? tags : [tags];
        filteredRecipes = filteredRecipes.filter(recipe =>
          tagList.some(tag => recipe.tags.includes(tag.toLowerCase()))
        );
      }
      
      res.json({
        recipes: filteredRecipes,
        filters: req.query,
        totalResults: filteredRecipes.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to filter recipes', message: error.message });
    }
  }

  static rateRecipe(req, res) {
    try {
      const recipeId = parseInt(req.params.id);
      const { rating, userId = 'anonymous' } = req.body;
      
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }
      
      // Initialize ratings array if it doesn't exist
      if (!req.app.locals.userRatings[recipeId]) {
        req.app.locals.userRatings[recipeId] = [];
      }
      
      // Add rating (in production, would check for duplicate user ratings)
      req.app.locals.userRatings[recipeId].push(rating);
      
      // Calculate new average
      const ratings = req.app.locals.userRatings[recipeId];
      const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      
      res.json({
        success: true,
        recipeId,
        averageRating,
        totalRatings: ratings.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to rate recipe', message: error.message });
    }
  }

  static getRecommendations(req, res) {
    try {
      const { 
        userId = 'anonymous', 
        availableIngredients = [], 
        dietaryPreferences = [],
        limit = 5 
      } = req.body;
      
      const recipes = req.app.locals.recipes;
      const userRatings = req.app.locals.userRatings;
      
      // Get recipes with high ratings
      const recipesWithRatings = recipes.map(recipe => {
        const ratings = userRatings[recipe.id] || [];
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
          : 3; // Default rating for unrated recipes
        
        return { ...recipe, avgRating };
      });
      
      // Filter by dietary preferences if provided
      let filteredRecipes = recipesWithRatings;
      if (dietaryPreferences.length > 0) {
        filteredRecipes = recipesWithRatings.filter(recipe =>
          dietaryPreferences.some(pref => recipe.dietary.includes(pref))
        );
      }
      
      // Score recipes based on available ingredients and ratings
      const scoredRecipes = filteredRecipes.map(recipe => {
        const ingredientScore = ingredientService.calculateIngredientMatch(
          recipe.ingredients.map(ing => ing.name),
          availableIngredients
        );
        
        // Combined score: 40% ingredient match + 60% user rating
        const totalScore = (ingredientScore * 0.4) + (recipe.avgRating * 0.6 / 5);
        
        return {
          ...recipe,
          matchScore: ingredientScore,
          recommendationScore: totalScore
        };
      });
      
      // Sort by recommendation score and limit results
      const recommendations = scoredRecipes
        .sort((a, b) => b.recommendationScore - a.recommendationScore)
        .slice(0, parseInt(limit));
      
      res.json({
        recommendations,
        criteria: {
          availableIngredients,
          dietaryPreferences,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get recommendations', message: error.message });
    }
  }
}

module.exports = RecipeController;
