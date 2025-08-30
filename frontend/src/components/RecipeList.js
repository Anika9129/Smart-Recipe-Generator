import React from 'react';
import styled from 'styled-components';
import { FaClock, FaUsers, FaStar, FaLeaf } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const RecipeCard = styled(Link)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
    pointer-events: none;
    transition: opacity 0.3s ease;
    opacity: 0;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }
`;

const RecipeImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff7eb3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '🍽️';
    font-size: 52px;
    opacity: 0.8;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%);
    pointer-events: none;
  }
`;

const RecipeImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const DifficultyBadge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${props => {
    switch(props.difficulty) {
      case 'easy': return 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
      case 'medium': return 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)';
      case 'hard': return 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)';
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
`;

const CardContent = styled.div`
  padding: 25px;
  position: relative;
`;

const RecipeName = styled.h3`
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  margin: 0 0 15px 0;
  color: #718096;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const RecipeStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  font-size: 13px;
  color: #4a5568;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #2d3748;
  
  svg {
    color: #667eea;
  }
`;

const DietaryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
`;

const DietaryTag = styled.span`
  background: #e6fffa;
  color: #234e52;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MatchingIngredients = styled.div`
  margin-bottom: 10px;
`;

const MatchLabel = styled.div`
  font-size: 12px;
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 6px;
`;

const IngredientsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const IngredientTag = styled.span`
  background: #f0f4f8;
  color: #2d3748;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
`;


const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #a0aec0;
  
  .icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: #4a5568;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const RecipeList = ({ recipes = [] }) => {
  if (recipes.length === 0) {
    return (
      <EmptyState>
        <div className="icon">🔍</div>
        <h3>No recipes to display</h3>
        <p>Add some ingredients to find matching recipes!</p>
      </EmptyState>
    );
  }

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getRating = (recipe) => {
    const rating = recipe.averageRating || recipe.rating || 0;
    return Math.round(rating * 10) / 10;
  };

  const getRecipeImage = (recipe) => {
    // Try multiple image path possibilities
    const imagePaths = [
      recipe.image, // If image URL is stored in recipe data
      `/images/recipes/${recipe.id}.jpg`,
      `/images/recipes/${recipe.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      `/images/recipes/recipe-${recipe.id}.jpg`,
    ].filter(Boolean);
    
    return imagePaths[0]; // Return first available path
  };

  return (
    <Container>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} to={`/recipe/${recipe.id}`}>
          <RecipeImage>
            {getRecipeImage(recipe) && (
              <RecipeImg 
                src={getRecipeImage(recipe)} 
                alt={recipe.name}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <DifficultyBadge difficulty={recipe.difficulty}>
              {recipe.difficulty}
            </DifficultyBadge>
          </RecipeImage>
          
          <CardContent>
            <RecipeName>{recipe.name}</RecipeName>
            <Description>{recipe.description}</Description>
            
            <RecipeStats>
              <Stat>
                <FaClock />
                {formatTime(recipe.totalTime || recipe.cookingTime || 30)}
              </Stat>
              <Stat>
                <FaUsers />
                {recipe.servings || 4} servings
              </Stat>
              <Stat>
                <FaStar />
                {getRating(recipe)}
              </Stat>
            </RecipeStats>
            
            {recipe.dietary && recipe.dietary.length > 0 && (
              <DietaryTags>
                {recipe.dietary.map((diet, index) => (
                  <DietaryTag key={index}>
                    <FaLeaf />
                    {diet}
                  </DietaryTag>
                ))}
              </DietaryTags>
            )}
            
            {recipe.matchingIngredients && recipe.matchingIngredients.length > 0 && (
              <MatchingIngredients>
                <MatchLabel>
                  Matching ingredients ({recipe.matchingIngredients.length}/{recipe.ingredients?.length || 0}):
                </MatchLabel>
                <IngredientsList>
                  {recipe.matchingIngredients.slice(0, 8).map((ingredient, index) => (
                    <IngredientTag key={index}>
                      {ingredient}
                    </IngredientTag>
                  ))}
                  {recipe.matchingIngredients.length > 8 && (
                    <IngredientTag>+{recipe.matchingIngredients.length - 8} more</IngredientTag>
                  )}
                </IngredientsList>
              </MatchingIngredients>
            )}
          </CardContent>
        </RecipeCard>
      ))}
    </Container>
  );
};

export default RecipeList;
