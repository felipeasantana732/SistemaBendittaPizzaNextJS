import React from 'react';
import styled from 'styled-components';

const HeroContainer = styled.section`
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/bendittaPizza/pizza-main.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white-benditta);
  text-align: center;
  padding-top: 80px;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 20px;
  display: flex;         
  flex-direction: column; 
  align-items: center;   
`;

const Logo = styled.img`
  width: 220px;
  height: 220px;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-accent-yellow-benditta);
  font-weight: 700;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--color-accent-yellow-benditta);
    transform: translateY(-3px);
    color: var(--color-primary);
  }
`;

const Hero: React.FC = () => {
  return (
    <HeroContainer id="home">
      <HeroContent>
        <Logo src='/img/bendittaPizza/bendittaLogo.png' alt="Benditta Pizza" />
        <Title>Benditta Pizza</Title>
        <Subtitle>Massa tradicional italiana com 48 horas de fermentação</Subtitle>
        <CTAButton href="#cardapio">Ver Cardápio</CTAButton>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
