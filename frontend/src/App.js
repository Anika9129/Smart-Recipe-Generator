import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import FilterPanel from './components/FilterPanel';
import LoadingSpinner from './components/LoadingSpinner';
import { recipeService } from './services/recipeService';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    position: relative;
    top: auto;
  }
`;

const ResultsSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.08);
  min-height: 500px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2, #ff7eb3);
    border-radius: 20px 20px 0 0;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 12px;
  color: #c00;
  margin: 10px 0;
`;

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [filters, setFilters] = useState({
    dietary: [],
    difficulty: '',
    maxCookingTime: '',
    maxCalories: '',
    cuisine: ''
  });

  const handleIngredientsChange = (ingredients) => {
    setSelectedIngredients(ingredients);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const searchRecipes = async () => {
    if (selectedIngredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use combined search that applies both ingredients and current filters
      const response = await recipeService.searchWithFilters(selectedIngredients, filters);
      setRecipes(response.recipes);
      
      if (response.recipes.length === 0) {
        setError('No recipes found with the selected ingredients and filters. Try different ingredients or adjust your filters.');
      }
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use combined search that applies both current ingredients and filters
      const response = await recipeService.searchWithFilters(selectedIngredients, filters);
      setRecipes(response.recipes);
      
      if (response.recipes.length === 0) {
        const hasIngredients = selectedIngredients.length > 0;
        const hasFilters = Object.values(filters).some(f => 
          Array.isArray(f) ? f.length > 0 : f !== ''
        );
        
        if (hasIngredients && hasFilters) {
          setError('No recipes match your ingredients and filter criteria. Try different ingredients or adjust your filters.');
        } else if (hasFilters) {
          setError('No recipes match your filter criteria. Try adjusting your filters.');
        } else {
          setError('No recipes found.');
        }
      }
    } catch (err) {
      setError('Failed to filter recipes. Please try again.');
      console.error('Filter error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-apply filters when ingredients change
  const handleIngredientsChangeWithFilter = (ingredients) => {
    setSelectedIngredients(ingredients);
    
    // Auto-search if we have ingredients
    if (ingredients.length > 0) {
      setTimeout(() => {
        searchRecipesWithCurrentState(ingredients, filters);
      }, 300); // Small debounce
    } else {
      setRecipes([]);
      setError(null);
    }
  };

  // Auto-apply search when filters change
  const handleFiltersChangeWithSearch = (newFilters) => {
    setFilters(newFilters);
    
    // Auto-filter if we have active filters or ingredients
    const hasActiveFilters = Object.values(newFilters).some(f => 
      Array.isArray(f) ? f.length > 0 : f !== ''
    );
    
    if (hasActiveFilters || selectedIngredients.length > 0) {
      setTimeout(() => {
        searchRecipesWithCurrentState(selectedIngredients, newFilters);
      }, 300); // Small debounce
    }
  };

  // Helper function to search with current state
  const searchRecipesWithCurrentState = async (ingredients, currentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await recipeService.searchWithFilters(ingredients, currentFilters);
      setRecipes(response.recipes);
      
      if (response.recipes.length === 0) {
        const hasIngredients = ingredients.length > 0;
        const hasFilters = Object.values(currentFilters).some(f => 
          Array.isArray(f) ? f.length > 0 : f !== ''
        );
        
        if (hasIngredients && hasFilters) {
          setError('No recipes match your ingredients and filter criteria. Try different ingredients or adjust your filters.');
        } else if (hasIngredients) {
          setError('No recipes found with the selected ingredients. Try different ingredients.');
        } else if (hasFilters) {
          setError('No recipes match your filter criteria. Try adjusting your filters.');
        }
      }
    } catch (err) {
      setError('Failed to search recipes. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await recipeService.getAllRecipes();
      setRecipes(response.recipes);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <AppContainer>
        <Header />
        <MainContent>
          <Routes>
            <Route path="/" element={
              <>
                <ContentGrid>
                  <SearchSection>
                    <IngredientInput
                      selectedIngredients={selectedIngredients}
                      onIngredientsChange={handleIngredientsChangeWithFilter}
                      onSearch={searchRecipes}
                    />
                    
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFiltersChangeWithSearch}
                      onFilter={filterRecipes}
                      onShowAll={loadAllRecipes}
                    />
                  </SearchSection>
                  
                  <ResultsSection>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    
                    {loading ? (
                      <LoadingSpinner />
                    ) : (
                      <RecipeList recipes={recipes} />
                    )}
                  </ResultsSection>
                </ContentGrid>
              </>
            } />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
}

export default App;
