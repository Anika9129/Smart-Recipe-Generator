import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaTimes, FaSearch } from 'react-icons/fa';
import { recipeService } from '../services/recipeService';

const Container = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '🥕';
    font-size: 24px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 50px 15px 16px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
  }
`;

const AddButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background: #5a67d8;
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

const SuggestionsDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const SuggestionItem = styled.div`
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f7fafc;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f7fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SelectedIngredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const IngredientChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 14px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.2s ease;
  animation: slideIn 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #fbb6ce;
  }
`;

const SearchButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const IngredientInput = ({ selectedIngredients = [], onIngredientsChange, onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length > 1) {
        try {
          const response = await recipeService.getIngredientSuggestions(inputValue);
          setSuggestions(response.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

  const addIngredient = (ingredient) => {
    const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.name;
    if (ingredientName && !selectedIngredients.includes(ingredientName)) {
      onIngredientsChange([...selectedIngredients, ingredientName]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeIngredient = (ingredient) => {
    onIngredientsChange(selectedIngredients.filter(item => item !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addIngredient(inputValue.trim());
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    addIngredient(suggestion);
  };

  return (
    <Container>
      <Title>Available Ingredients</Title>
      
      <InputContainer>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type an ingredient (e.g., chicken, tomato, rice...)"
          onFocus={() => inputValue.length > 1 && setShowSuggestions(true)}
        />
        <AddButton 
          onClick={() => addIngredient(inputValue)}
          disabled={!inputValue.trim()}
        >
          <FaPlus />
        </AddButton>
        
        {showSuggestions && suggestions.length > 0 && (
          <SuggestionsDropdown>
            {suggestions.slice(0, 8).map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {typeof suggestion === 'string' ? suggestion : suggestion.name}
              </SuggestionItem>
            ))}
          </SuggestionsDropdown>
        )}
      </InputContainer>

      {selectedIngredients.length > 0 && (
        <SelectedIngredients>
          {selectedIngredients.map((ingredient, index) => (
            <IngredientChip key={index}>
              {ingredient}
              <RemoveButton onClick={() => removeIngredient(ingredient)}>
                <FaTimes />
              </RemoveButton>
            </IngredientChip>
          ))}
        </SelectedIngredients>
      )}

      <SearchButton 
        onClick={onSearch}
        disabled={selectedIngredients.length === 0}
      >
        <FaSearch />
        Find Recipes
      </SearchButton>
    </Container>
  );
};

export default IngredientInput;
