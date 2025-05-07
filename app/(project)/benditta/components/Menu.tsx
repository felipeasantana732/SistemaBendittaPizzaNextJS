import React from 'react';
import styled from 'styled-components';
import PDFViewer from './PDFViewer';

const MenuContainer = styled.section`
  padding: 100px 0;
`;

const MenuContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--color-accent-yellow-benditta);
  }
`;

const MenuDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 40px;
  color: var(--color-dark-gray-benditta);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const MenuPDFContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpecialOffer = styled.div`
  background-color: var(--color-accent-yellow-benditta);
  color: var(--color-primary-benditta);
  padding: 20px;
  border-radius: 10px;
  margin-top: 50px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  
  h3 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 0;
  }
`;

const Menu: React.FC = () => {
  return (
    <MenuContainer id="cardapio">
      <MenuContent>
        <SectionTitle>Nosso Cardápio</SectionTitle>
        <MenuDescription>
          Conheça nossas deliciosas opções de pizzas, preparadas com ingredientes selecionados e nossa exclusiva massa tradicional italiana com 48 horas de fermentação.
        </MenuDescription>
        
        <MenuPDFContainer>
          <PDFViewer />
        </MenuPDFContainer>
        
        <SpecialOffer>
          <h3>Pizza do Dia - R$ 45,00</h3>
          <p>Disponível todos os dias da semana! Solicite o sabor do dia com nossos atendentes.</p>
        </SpecialOffer>
      </MenuContent>
    </MenuContainer>
  );
};

export default Menu;
