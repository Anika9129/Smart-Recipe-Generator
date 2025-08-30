import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 80%, 100% { 
    transform: scale(0);
    opacity: 0.5;
  } 
  40% { 
    transform: scale(1);
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const Spinner = styled.div`
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

const DotsSpinner = styled.div`
  display: flex;
  gap: 4px;
  margin: 20px 0;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #667eea;
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay || '0s'};
`;

const LoadingText = styled.div`
  color: #4a5568;
  font-size: 16px;
  font-weight: 500;
`;

const SubText = styled.div`
  color: #718096;
  font-size: 14px;
  margin-top: 8px;
`;

const CookingIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  animation: ${spin} 3s linear infinite;
`;

const LoadingSpinner = ({ message = "Loading recipes...", subMessage = "Finding the perfect match for you" }) => {
  return (
    <Container>
      <CookingIcon>🍳</CookingIcon>
      
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      
      <LoadingText>{message}</LoadingText>
      {subMessage && <SubText>{subMessage}</SubText>}
      
      <DotsSpinner>
        <Dot delay="0s" />
        <Dot delay="0.2s" />
        <Dot delay="0.4s" />
      </DotsSpinner>
    </Container>
  );
};

export default LoadingSpinner;
