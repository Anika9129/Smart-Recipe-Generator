import React from 'react';
import styled from 'styled-components';
import { FaFilter, FaEye, FaTimes } from 'react-icons/fa';
import Select from 'react-select';

const Container = styled.div`
  margin-top: 30px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
    margin-bottom: 25px;
  }
  
  padding-top: 25px;
`;

const Title = styled.h3`
  margin: 0 0 25px 0;
  color: #2d3748;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '🔍';
    font-size: 22px;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  font-size: 14px;
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
    font-style: italic;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid rgba(226, 232, 240, 0.8);
  border-radius: 10px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: #a0aec0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const FilterButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(102, 126, 234, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-1px);
    box-shadow: 0 5px 16px rgba(102, 126, 234, 0.4);
  }
`;

const ShowAllButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(72, 187, 120, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
    transform: translateY(-1px);
    box-shadow: 0 5px 16px rgba(72, 187, 120, 0.4);
  }
`;

const ClearButton = styled.button`
  background: #e53e3e;
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
    background: #c53030;
  }
`;

const ActiveFiltersCount = styled.span`
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 8px;
`;

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    border: '2px solid #e2e8f0',
    borderColor: state.isFocused ? '#667eea' : '#e2e8f0',
    borderRadius: '6px',
    padding: '2px',
    fontSize: '14px',
    '&:hover': {
      borderColor: '#667eea',
    },
    boxShadow: 'none',
  }),
  multiValue: (provided) => ({
    ...provided,
    background: '#667eea',
    borderRadius: '12px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
    fontSize: '12px',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      background: '#5a67d8',
      color: 'white',
    },
  }),
};

const dietaryOptions = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'mediterranean', label: 'Mediterranean' }
];

const cuisineOptions = [
  { value: '', label: 'All Cuisines' },
  { value: 'italian', label: 'Italian' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'indian', label: 'Indian' },
  { value: 'french', label: 'French' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'thai', label: 'Thai' },
  { value: 'american', label: 'American' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'middle-eastern', label: 'Middle Eastern' }
];

const FilterPanel = ({ filters, onFiltersChange, onFilter, onShowAll }) => {
  const handleInputChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleDietaryChange = (selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    handleInputChange('dietary', values);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dietary: [],
      difficulty: '',
      maxCookingTime: '',
      maxCalories: '',
      cuisine: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dietary && filters.dietary.length > 0) count++;
    if (filters.difficulty) count++;
    if (filters.maxCookingTime) count++;
    if (filters.maxCalories) count++;
    if (filters.cuisine) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Container>
      <Title>
        <FaFilter />
        Filters
        {activeFiltersCount > 0 && (
          <ActiveFiltersCount>{activeFiltersCount}</ActiveFiltersCount>
        )}
        {activeFiltersCount > 0 && (
          <ClearButton onClick={clearAllFilters} title="Clear all filters">
            <FaTimes />
          </ClearButton>
        )}
      </Title>

      <FilterGroup>
        <FilterLabel>Dietary Preferences</FilterLabel>
        <Select
          isMulti
          options={dietaryOptions}
          value={dietaryOptions.filter(option => filters.dietary && filters.dietary.includes(option.value))}
          onChange={handleDietaryChange}
          styles={customSelectStyles}
          placeholder="Select dietary preferences..."
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Difficulty Level</FilterLabel>
        <FilterSelect
          value={filters.difficulty}
          onChange={(e) => handleInputChange('difficulty', e.target.value)}
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </FilterSelect>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Maximum Cooking Time (minutes)</FilterLabel>
        <FilterInput
          type="number"
          min="5"
          max="600"
          step="5"
          value={filters.maxCookingTime}
          onChange={(e) => handleInputChange('maxCookingTime', e.target.value)}
          placeholder="e.g., 60"
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Maximum Calories</FilterLabel>
        <FilterInput
          type="number"
          min="100"
          max="2000"
          step="50"
          value={filters.maxCalories}
          onChange={(e) => handleInputChange('maxCalories', e.target.value)}
          placeholder="e.g., 500"
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Cuisine Type</FilterLabel>
        <FilterSelect
          value={filters.cuisine}
          onChange={(e) => handleInputChange('cuisine', e.target.value)}
        >
          {cuisineOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FilterSelect>
      </FilterGroup>

      <ButtonGroup>
        <FilterButton onClick={onFilter}>
          <FaFilter />
          Apply Filters
        </FilterButton>
        <ShowAllButton onClick={onShowAll}>
          <FaEye />
          Show All
        </ShowAllButton>
      </ButtonGroup>
    </Container>
  );
};

export default FilterPanel;
