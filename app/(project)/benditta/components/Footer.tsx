import React from 'react';
import styled from 'styled-components';



const FooterContainer = styled.footer`
  background-color: var(--color-primary-benditta);
  color: var(--color-white-benditta);
  padding: 60px 0 30px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterLogo = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 30px;
  
  img {
    width: 120px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
  }
  
  p {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #ccc;
  }
`;

const FooterLinks = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 30px;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--color-accent-yellow-benditta);
      
      @media (max-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
  }
  
  a {
    color: #ccc;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--color-accent-yellow-benditta);
    }
  }
`;

const FooterContact = styled.div`
  flex: 1;
  min-width: 250px;
  margin-bottom: 30px;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    position: relative;
    display: inline-block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: var(--color-accent-yellow-benditta);
      
      @media (max-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  
  p {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  
  span {
    margin-left: 10px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #333;
    border-radius: 50%;
    margin-right: 10px;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: var(--color-accent-yellow-benditta);
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #333;
  font-size: 0.9rem;
  color: #999;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLogo>
          <img src="/img/bendittaPizza/bendittaLogoSVG.svg" alt="Benditta Pizza" />
          <p>Massa tradicional italiana com 48 horas de fermentação. Sabor inigualável e ingredientes selecionados para proporcionar a melhor experiência.</p>
        </FooterLogo>
        
        <FooterLinks>
          <h3>Links Rápidos</h3>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#cardapio">Cardápio</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </FooterLinks>
        
        <FooterContact>
          <h3>Contato</h3>
          <p>
            📱 <span>(62) 98570-3845</span>
          </p>
          <p>
            📱 <span>(62) 99231-3037</span>
          </p>
          <p>
            📍 <span>         Av.Vista Alegre, 925 <br/> Bairro São Francisco Goiânia - GO</span>
          </p>
          <p>
            🕒 <span>Terça a Domingo: 19:00 - 23:00</span>
          </p>
          
          <SocialLinks>
            <a href="https://www.instagram.com/benditta_pizza/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              📷
            </a>
            <a href="https://wa.me/5562985703845" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              📱
            </a>
          </SocialLinks>
        </FooterContact>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {new Date().getFullYear()} Benditta Pizza. Todos os direitos reservados.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
