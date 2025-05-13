import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.section`
  background-color: var(--color-gray-benditta);
  padding: 100px 0;
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AboutText = styled.div`
  flex: 1;
  padding-right: 50px;
  
  @media (max-width: 992px) {
    padding-right: 0;
    margin-bottom: 40px;
  }
`;

const AboutImage = styled.div`
  flex: 1;
  
  img {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
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
    left: 0;
    width: 60px;
    height: 3px;
    background-color: var(--color-accent-yellow-benditta);
    
    @media (max-width: 992px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const AboutDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 20px;
  color: var(--color-dark-gray-benditta);
`;

const HighlightBox = styled.div`
  background-color: var(--color-primary-benditta);
  color: var(--color-white-benditta);
  padding: 20px;
  border-radius: 5px;
  margin-top: 30px;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: var(--color-accent-yellow-benditta);
  }
  
  p {
    font-size: 1rem;
  }
`;

const About: React.FC = () => {
  return (
    <AboutContainer id="sobre">
      <AboutContent>
        <AboutText>
          <SectionTitle>Sobre a Benditta Pizza</SectionTitle>
          <AboutDescription>
            A Benditta Pizza nasceu da paixão pela autêntica pizza italiana. Nossa missão é proporcionar uma experiência gastronômica única, com ingredientes selecionados, massa tradicional italiana fermentada por 48 horas e entrega o mais rapida possivel.
          </AboutDescription>
          <AboutDescription>
            Cada pizza é preparada com carinho e atenção aos detalhes, seguindo receitas que combinam tradição e inovação. Nosso compromisso é com a qualidade e a satisfação dos nossos clientes.
          </AboutDescription>
          <HighlightBox>
            <h3>Massa Tradicional Italiana</h3>
            <p>Nossa massa passa pelo tradicional processo de fermentação de 48 horas, resultando em uma textura leve, crocante por fora e macia por dentro, com sabor inigualável.</p>
          </HighlightBox>
        </AboutText>
        <AboutImage>
          <Image
            src="/img/bendittaPizza/sobreNos.jpg"
            alt='Benditta Pizza Por Dentro'
            height={600}
            width={800}
            //className="object-cover"
            className="max-w-full h-auto rounded-lg shadow-md"
            />
        </AboutImage>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;
