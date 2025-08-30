import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { 
  FaClock, FaUsers, FaStar, FaArrowLeft, FaLeaf, FaPrint, FaShare, 
  FaPlay, FaPause, FaStop, FaPlus, FaMinus, FaCheck, FaCopy,
  FaFire, FaBreadSlice, FaDrumstickBite, FaSeedling, FaHeart,
  FaBookmark, FaChevronLeft, FaChevronRight, FaUtensils, FaGlobeAmericas,
  FaCheckCircle, FaRegCheckCircle
} from 'react-icons/fa';
import ReactRating from 'react-rating-stars-component';
import { recipeService } from '../services/recipeService';
import LoadingSpinner from './LoadingSpinner';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Print styles
const PrintStyles = styled.div`
  @media print {
    .no-print {
      display: none !important;
    }
    
    body {
      background: white;
      color: black;
    }
    
    .print-recipe {
      max-width: 100%;
      margin: 0;
      box-shadow: none;
      border-radius: 0;
    }
    
    .print-header {
      background: white !important;
      color: black !important;
    }
    
    .print-section {
      page-break-inside: avoid;
    }
  }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2, #ff7eb3, #667eea);
    background-size: 300% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateX(-5px);
  }
`;

const HeroSection = styled.div`
  height: 400px;
  background: linear-gradient(
    135deg, 
    rgba(102, 126, 234, 0.9) 0%, 
    rgba(118, 75, 162, 0.9) 100%
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 70%, rgba(255, 119, 198, 0.3) 0%, transparent 70%),
      radial-gradient(circle at 70% 30%, rgba(120, 219, 255, 0.3) 0%, transparent 70%);
    z-index: 1;
  }
`;

const RecipeImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const HeroOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  color: white;
  padding: 40px;
  z-index: 2;
  text-align: center;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
  z-index: 3;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a5568;
  font-size: 18px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: white;
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const FavoriteButton = styled(ActionButton)`
  ${props => props.isFavorite && css`
    background: #ff6b6b;
    color: white;
    animation: ${pulse} 0.6s ease;
  `}
`;

const RecipeTitle = styled.h1`
  margin: 0 0 15px 0;
  font-size: 36px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.8s ease-out;
`;

const RecipeDescription = styled.p`
  margin: 0 0 25px 0;
  font-size: 18px;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeIn} 1s ease-out 0.2s both;
`;

const StatsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 25px;
  margin: 30px auto;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 1s ease-out 0.4s both;
`;

const RecipeStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
  }
  
  svg {
    font-size: 24px;
    color: #667eea;
    margin-bottom: 8px;
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
`;

const DifficultyBadge = styled.span`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;
  
  ${props => props.difficulty === 'easy' && css`
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  `}
  
  ${props => props.difficulty === 'medium' && css`
    background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
    box-shadow: 0 4px 12px rgba(237, 137, 54, 0.3);
  `}
  
  ${props => props.difficulty === 'hard' && css`
    background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
    box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
  `}
`;

const ContentSection = styled.div`
  padding: 30px 40px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #2d3748;
  font-size: 20px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 10px;
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 8px;
`;

const IngredientItem = styled.li`
  background: #f7fafc;
  padding: 10px 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-weight: 500;
`;

const InstructionsList = styled.ol`
  padding-left: 0;
  margin: 0 0 30px 0;
`;

const InstructionItem = styled.li`
  background: #f9f9f9;
  margin: 0 0 15px 0;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #48bb78;
  line-height: 1.6;
  counter-increment: step-counter;
  
  &::before {
    content: counter(step-counter);
    background: #48bb78;
    color: white;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 50%;
    margin-right: 12px;
    font-size: 14px;
    min-width: 24px;
    text-align: center;
    display: inline-block;
  }
`;

const DietaryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const DietaryTag = styled.span`
  background: #e6fffa;
  color: #234e52;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RatingSection = styled.div`
  border-top: 2px solid #e2e8f0;
  padding-top: 20px;
  text-align: center;
`;

const RatingTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #4a5568;
`;

const CurrentRating = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  color: #4a5568;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 20px;
  color: #c00;
  text-align: center;
  margin: 20px;
`;

// Nutritional Information Components
const NutritionSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const NutritionItem = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NutritionValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
`;

const NutritionLabel = styled.div`
  font-size: 12px;
  color: #718096;
  text-transform: uppercase;
  font-weight: 500;
`;

// Serving Size Calculator Components
const ServingCalculator = styled.div`
  background: #e6f3ff;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ServingControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ServingButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #5a67d8;
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

const ServingDisplay = styled.div`
  font-weight: 600;
  color: #4a5568;
  min-width: 80px;
  text-align: center;
`;

// Timer Components
const TimerSection = styled.div`
  background: #fff5f5;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  text-align: center;
`;

const TimerDisplay = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #e53e3e;
  margin: 10px 0;
`;

const TimerControls = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

const TimerButton = styled.button`
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  
  &:hover {
    background: #c53030;
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

// Enhanced Visual Components
const RecipeMetaInfo = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.8s ease-out;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  }
  
  svg {
    color: #667eea;
    font-size: 20px;
  }
`;

const MetaLabel = styled.div`
  font-size: 14px;
  color: #718096;
  font-weight: 500;
`;

const MetaValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #2d3748;
`;

// Enhanced Ingredient Item with Checkbox
const EnhancedIngredientItem = styled.li`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 15px 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  margin-bottom: 10px;
  
  ${props => props.checked && css`
    opacity: 0.7;
    text-decoration: line-through;
    background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
    border-left-color: #48bb78;
    transform: scale(0.98);
  `}
  
  &:hover {
    background: ${props => props.checked 
      ? 'linear-gradient(135deg, #d4edda 0%, #c6f6d5 100%)' 
      : 'linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%)'};
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #48bb78;
  cursor: pointer;
`;

// Enhanced Instructions
const EnhancedInstructionItem = styled.li`
  background: linear-gradient(135deg, #f9f9f9 0%, #f1f5f9 100%);
  margin: 0 0 20px 0;
  padding: 20px;
  border-radius: 15px;
  border-left: 5px solid #48bb78;
  line-height: 1.7;
  counter-increment: step-counter;
  position: relative;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateX(5px);
    box-shadow: 0 8px 25px rgba(72, 187, 120, 0.15);
  }
  
  &::before {
    content: counter(step-counter);
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    font-weight: bold;
    padding: 8px 12px;
    border-radius: 50%;
    margin-right: 15px;
    font-size: 14px;
    min-width: 30px;
    height: 30px;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
  }
`;

// Action Bar Components
const ActionBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeIn} 0.8s ease-out;
`;

const UtilityButton = styled.button`
  background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 12px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }
  
  svg {
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.2);
  }
`;

// Enhanced Section Styling
const EnhancedSectionTitle = styled.h3`
  margin: 40px 0 25px 0;
  color: #2d3748;
  font-size: 24px;
  font-weight: 700;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::before {
    content: '';
    width: 4px;
    height: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px;
  }
  
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, #e2e8f0, transparent);
    margin-left: 15px;
  }
`;

// Recipe Info Cards
const InfoCard = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 15px;
  padding: 25px;
  margin: 20px 0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }
`;

// Cuisine and Tags Section
const TagsSection = styled.div`
  margin: 20px 0;
  animation: ${fadeIn} 1s ease-out 0.6s both;
`;

const CuisineTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: 600;
  margin-right: 15px;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
  
  svg {
    font-size: 16px;
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: white;
    transform: scale(1.05);
  }
`;

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [adjustedServings, setAdjustedServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await recipeService.getRecipeById(id);
        setRecipe(response.recipe);
        setAdjustedServings(response.recipe.servings || 4);
      } catch (err) {
        setError('Failed to load recipe details');
        console.error('Recipe fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  // Timer effect
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const handleRating = async (rating) => {
    try {
      await recipeService.rateRecipe(id, rating);
      setUserRating(rating);
      // Refresh recipe data to get updated average rating
      const response = await recipeService.getRecipeById(id);
      setRecipe(response.recipe);
    } catch (err) {
      console.error('Rating error:', err);
    }
  };

  // Serving size calculator functions
  const adjustServings = (newServings) => {
    if (newServings >= 1 && newServings <= 20) {
      setAdjustedServings(newServings);
    }
  };

  const getScaledAmount = (originalAmount) => {
    const scale = adjustedServings / (recipe.servings || 4);
    const scaled = originalAmount * scale;
    return Math.round(scaled * 100) / 100; // Round to 2 decimal places
  };

  // Ingredient checkbox functions
  const toggleIngredientCheck = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Timer functions
  const startTimer = (minutes) => {
    setTimerTime(minutes * 60);
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimerTime(prev => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          clearInterval(interval);
          alert('Timer finished! 🍳');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const pauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerRunning(false);
    setTimerTime(0);
  };

  const resumeTimer = () => {
    if (timerTime > 0) {
      setIsTimerRunning(true);
      const interval = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            clearInterval(interval);
            alert('Timer finished! 🍳');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    }
  };

  // Utility functions
  const printRecipe = () => {
    window.print();
  };

  const shareRecipe = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: recipe.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  const getRecipeImage = (recipe) => {
    const imagePaths = [
      `/images/recipes/${recipe.id}.jpg`,
      `/images/recipes/${recipe.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
      `/images/recipes/recipe-${recipe.id}.jpg`,
    ];
    return imagePaths[0];
  };

  const formatTimerDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!recipe) {
    return <ErrorMessage>Recipe not found</ErrorMessage>;
  }

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <PrintStyles>
      <BackButton to="/" className="no-print">
        <FaArrowLeft />
        Back to Recipes
      </BackButton>
      
      <Container className="print-recipe">
        {/* Enhanced Hero Section */}
        <HeroSection>
          <RecipeImg 
            src={recipe.image || getRecipeImage(recipe)} 
            alt={recipe.name}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <ActionButtons className="no-print">
            <FavoriteButton title="Add to Favorites">
              <FaHeart />
            </FavoriteButton>
            <ActionButton title="Bookmark Recipe">
              <FaBookmark />
            </ActionButton>
            <ActionButton onClick={shareRecipe} title="Share Recipe">
              <FaShare />
            </ActionButton>
            <ActionButton onClick={printRecipe} title="Print Recipe">
              <FaPrint />
            </ActionButton>
          </ActionButtons>
          
          <HeroOverlay>
            <RecipeTitle>{recipe.name}</RecipeTitle>
            <RecipeDescription>{recipe.description}</RecipeDescription>
            
            {/* Cuisine and Tags */}
            <TagsSection>
              {recipe.cuisine && (
                <CuisineTag>
                  <FaGlobeAmericas />
                  {recipe.cuisine} Cuisine
                </CuisineTag>
              )}
              
              {recipe.tags && (
                <TagsList>
                  {recipe.tags.map((tag, index) => (
                    <Tag key={index}>#{tag}</Tag>
                  ))}
                </TagsList>
              )}
            </TagsSection>
          </HeroOverlay>
        </HeroSection>

        {/* Enhanced Stats Container */}
        <StatsContainer>
          <RecipeStats>
            <Stat>
              <FaClock />
              <StatLabel>Cook Time</StatLabel>
              <StatValue>{formatTime(recipe.totalTime || recipe.cookingTime || 30)}</StatValue>
            </Stat>
            <Stat>
              <FaUsers />
              <StatLabel>Servings</StatLabel>
              <StatValue>{recipe.servings || 4}</StatValue>
            </Stat>
            <Stat>
              <FaStar />
              <StatLabel>Rating</StatLabel>
              <StatValue>{Math.round((recipe.averageRating || 4.2) * 10) / 10}/5</StatValue>
            </Stat>
            <Stat>
              <FaUtensils />
              <StatLabel>Difficulty</StatLabel>
              <DifficultyBadge difficulty={recipe.difficulty}>
                {recipe.difficulty}
              </DifficultyBadge>
            </Stat>
          </RecipeStats>
          
          {/* Dietary Information */}
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
        </StatsContainer>

        <ContentSection>
          {/* Enhanced Action Bar */}
          <ActionBar className="no-print">
            <UtilityButton onClick={printRecipe}>
              <FaPrint />
              Print Recipe
            </UtilityButton>
            <UtilityButton onClick={shareRecipe}>
              <FaShare />
              Share Recipe
            </UtilityButton>
            <UtilityButton onClick={() => startTimer(recipe.cookingTime || 30)}>
              <FaClock />
              Start Cooking Timer
            </UtilityButton>
          </ActionBar>

          {/* Enhanced Serving Calculator */}
          <InfoCard className="no-print">
            <RecipeMetaInfo>
              <MetaItem>
                <FaUsers />
                <div>
                  <MetaLabel>Serving Size</MetaLabel>
                  <ServingControls>
                    <ServingButton 
                      onClick={() => adjustServings(adjustedServings - 1)}
                      disabled={adjustedServings <= 1}
                    >
                      <FaMinus />
                    </ServingButton>
                    <ServingDisplay>{adjustedServings} servings</ServingDisplay>
                    <ServingButton 
                      onClick={() => adjustServings(adjustedServings + 1)}
                      disabled={adjustedServings >= 20}
                    >
                      <FaPlus />
                    </ServingButton>
                  </ServingControls>
                </div>
              </MetaItem>
            </RecipeMetaInfo>
          </InfoCard>

          {/* Enhanced Cooking Timer */}
          {timerTime > 0 && (
            <InfoCard className="no-print">
              <EnhancedSectionTitle>
                <FaClock />
                Cooking Timer
              </EnhancedSectionTitle>
              <TimerDisplay>{formatTimerDisplay(timerTime)}</TimerDisplay>
              <TimerControls>
                {!isTimerRunning ? (
                  <TimerButton onClick={resumeTimer}>
                    <FaPlay />
                    Resume Timer
                  </TimerButton>
                ) : (
                  <TimerButton onClick={pauseTimer}>
                    <FaPause />
                    Pause Timer
                  </TimerButton>
                )}
                <TimerButton onClick={stopTimer}>
                  <FaStop />
                  Stop Timer
                </TimerButton>
              </TimerControls>
            </InfoCard>
          )}

          {/* Enhanced Nutrition Information */}
          {recipe.nutrition && (
            <InfoCard>
              <EnhancedSectionTitle>
                <FaFire />
                Nutritional Information
                <small style={{fontSize: '14px', fontWeight: 'normal', color: '#718096'}}>per serving</small>
              </EnhancedSectionTitle>
              <NutritionGrid>
                <NutritionItem>
                  <NutritionValue>
                    <FaFire style={{ color: '#e53e3e', marginRight: '5px' }} />
                    {Math.round(recipe.nutrition.calories / (recipe.servings || 4))}
                  </NutritionValue>
                  <NutritionLabel>Calories</NutritionLabel>
                </NutritionItem>
                <NutritionItem>
                  <NutritionValue>
                    <FaDrumstickBite style={{ color: '#c53030', marginRight: '5px' }} />
                    {Math.round(recipe.nutrition.protein / (recipe.servings || 4))}g
                  </NutritionValue>
                  <NutritionLabel>Protein</NutritionLabel>
                </NutritionItem>
                <NutritionItem>
                  <NutritionValue>
                    <FaBreadSlice style={{ color: '#d69e2e', marginRight: '5px' }} />
                    {Math.round(recipe.nutrition.carbs / (recipe.servings || 4))}g
                  </NutritionValue>
                  <NutritionLabel>Carbs</NutritionLabel>
                </NutritionItem>
                <NutritionItem>
                  <NutritionValue>
                    <FaSeedling style={{ color: '#38a169', marginRight: '5px' }} />
                    {Math.round(recipe.nutrition.fat / (recipe.servings || 4))}g
                  </NutritionValue>
                  <NutritionLabel>Fat</NutritionLabel>
                </NutritionItem>
                {recipe.nutrition.fiber && (
                  <NutritionItem>
                    <NutritionValue>
                      <FaLeaf style={{ color: '#38a169', marginRight: '5px' }} />
                      {Math.round(recipe.nutrition.fiber / (recipe.servings || 4))}g
                    </NutritionValue>
                    <NutritionLabel>Fiber</NutritionLabel>
                  </NutritionItem>
                )}
              </NutritionGrid>
            </InfoCard>
          )}

          {/* Enhanced Ingredients Section */}
          <InfoCard>
            <EnhancedSectionTitle>
              <FaUtensils />
              Ingredients
              <small style={{fontSize: '14px', fontWeight: 'normal', color: '#718096'}}>for {adjustedServings} servings</small>
            </EnhancedSectionTitle>
            <IngredientsList>
              {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
                <EnhancedIngredientItem 
                  key={index}
                  checked={checkedIngredients[index]}
                  onClick={() => toggleIngredientCheck(index)}
                >
                  <Checkbox 
                    type="checkbox"
                    checked={checkedIngredients[index] || false}
                    onChange={() => toggleIngredientCheck(index)}
                  />
                  <span>
                    <strong>{getScaledAmount(ingredient.amount)} {ingredient.unit}</strong> {ingredient.name}
                  </span>
                </EnhancedIngredientItem>
              ))}
            </IngredientsList>
          </InfoCard>

          {/* Enhanced Instructions Section */}
          <InfoCard>
            <EnhancedSectionTitle>
              <FaCheckCircle />
              Cooking Instructions
            </EnhancedSectionTitle>
            <InstructionsList>
              {recipe.instructions && recipe.instructions.map((instruction, index) => (
                <EnhancedInstructionItem key={index}>
                  {instruction}
                </EnhancedInstructionItem>
              ))}
            </InstructionsList>
          </InfoCard>

          {/* Enhanced Rating Section */}
          <InfoCard>
            <EnhancedSectionTitle>
              <FaStar />
              Rate This Recipe
            </EnhancedSectionTitle>
            <RatingSection>
              <CurrentRating>
                <span>Current Rating:</span>
                <FaStar style={{ color: '#ffd700', fontSize: '18px' }} />
                <strong>{Math.round((recipe.averageRating || 4.2) * 10) / 10} / 5</strong>
                {recipe.totalRatings && (
                  <span style={{ fontSize: '14px', color: '#718096' }}>
                    ({recipe.totalRatings || 12} {(recipe.totalRatings || 12) === 1 ? 'rating' : 'ratings'})
                  </span>
                )}
              </CurrentRating>
              
              <ReactRating
                count={5}
                onChange={handleRating}
                size={35}
                activeColor="#ffd700"
                inactiveColor="#e2e8f0"
                value={userRating}
              />
            </RatingSection>
          </InfoCard>
        </ContentSection>
      </Container>
    </PrintStyles>
  );
};

export default RecipeDetail;
