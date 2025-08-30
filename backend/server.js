const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const recipeController = require('../controllers/recipeController');
const ingredientService = require('../services/ingredientService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (images)
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Load recipes data
let recipes = [];
try {
  const recipesPath = path.join(__dirname, '../database/recipes.json');
  const rawData = fs.readFileSync(recipesPath);
  recipes = JSON.parse(rawData).recipes;
  console.log(`Loaded ${recipes.length} recipes from database`);
} catch (error) {
  console.error('Error loading recipes:', error);
}

// Initialize services
ingredientService.initialize(recipes);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Recipe Generator API',
    version: '1.0.0',
    endpoints: [
      'GET /api/recipes - Get all recipes',
      'GET /api/recipes/:id - Get specific recipe',
      'POST /api/recipes/search - Search recipes by ingredients',
      'GET /api/recipes/filter - Filter recipes by criteria',
      'POST /api/recipes/:id/rate - Rate a recipe',
      'GET /api/ingredients/suggestions - Get ingredient suggestions',
      'POST /api/recipes/recommendations - Get recipe recommendations'
    ]
  });
});

// Recipe routes
app.get('/api/recipes', recipeController.getAllRecipes);
app.get('/api/recipes/:id', recipeController.getRecipeById);
app.post('/api/recipes/search', recipeController.searchRecipesByIngredients);
app.get('/api/recipes/filter', recipeController.filterRecipes);
app.post('/api/recipes/:id/rate', recipeController.rateRecipe);
app.post('/api/recipes/recommendations', recipeController.getRecommendations);

// Ingredient routes
app.get('/api/ingredients/suggestions', (req, res) => {
  const suggestions = ingredientService.getIngredientSuggestions(req.query.input);
  res.json(suggestions);
});

// User data (in memory for demo - would use database in production)
app.locals.userRatings = {};
app.locals.userFavorites = {};
app.locals.recipes = recipes;

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/`);
});

module.exports = app;
