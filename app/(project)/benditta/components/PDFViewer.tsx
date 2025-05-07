import React from 'react';
import styled from 'styled-components';

const PDFViewerContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--color-white-benditta);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const PDFPreview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const PDFPage = styled.div`
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
  
  @media (min-width: 768px) {
    margin: 0;
  }
`;

const DownloadButton = styled.a`
  display: inline-block;
  background-color: var(--color-primary-benditta);
  color: var(--color-white-benditta);
  font-weight: 700;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.3s ease;
  margin-top: 20px;
  width: 100%;
  max-width: 300px;
  
  &:hover {
    background-color: var(--color-accent-yellow);
    color: var(--color-primary);
    transform: translateY(-3px);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PDFViewer: React.FC = () => {
  return (
    <PDFViewerContainer>
      <PDFPreview>
        <PDFPage>
          <a href="/img/bendittaPizza/cardapio1.jpg" target="_blank" rel="noopener noreferrer">
            <img src="/img/bendittaPizza/cardapio1.jpg" alt="Cardápio Benditta Pizza - Página 1" />
          </a>
        </PDFPage>
        <PDFPage>
          <a href="/img/bendittaPizza/cardapio1.jpg" target="_blank" rel="noopener noreferrer">
          <img src="/img/bendittaPizza/cardapio2.jpg" alt="Cardápio Benditta Pizza - Página 2" />
          </a>
        </PDFPage>
      </PDFPreview>
      
      <ButtonContainer>
        <DownloadButton 
          href='/assets/benditta/cardapio.zip' 
          download
          rel="noopener noreferrer"
        >
          Baixar Cardápio Completo
        </DownloadButton>
      </ButtonContainer>
    </PDFViewerContainer>
  );
};

export default PDFViewer;
