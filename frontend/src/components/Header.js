import React from 'react';
import styled from 'styled-components';
import { FaUtensils, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 20px 0;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 1px 4px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 0 15px;
    flex-direction: column;
    gap: 10px;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  text-decoration: none;
  color: #4a5568;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    @media (max-width: 768px) {
      font-size: 22px;
    }
  }
`;

const LogoIcon = styled(FaUtensils)`
  font-size: 32px;
  color: #667eea;
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  animation: rotate 20s linear infinite;
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Tagline = styled.p`
  margin: 0;
  color: #718096;
  font-size: 14px;
  font-weight: 500;
  font-style: italic;
  
  @media (max-width: 768px) {
    font-size: 12px;
    text-align: center;
  }
`;

const GitHubLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4a5568;
  text-decoration: none;
  padding: 12px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  font-weight: 600;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }
  
  svg {
    font-size: 16px;
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 16px;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon />
          <div>
            <h1>Smart Recipe Generator</h1>
            <Tagline>Find recipes based on your available ingredients</Tagline>
          </div>
        </Logo>
        
        <GitHubLink 
          href="https://github.com/your-username/smart-recipe-generator" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaGithub />
          View on GitHub
        </GitHubLink>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
