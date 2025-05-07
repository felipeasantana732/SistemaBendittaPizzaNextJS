import React from 'react';
import styled from 'styled-components';

// Interface para o botão de voltar ao topo
interface ScrollButtonProps {
  visible: boolean;
}

// Interface para o menu mobile
interface MobileMenuProps {
  isOpen: boolean;
}

// Componente para criar um botão de WhatsApp flutuante
const WhatsAppButton = styled.a`
  position: fixed;
  width: 60px;
  height: 60px;
  bottom: 40px;
  right: 40px;
  background-color: #25D366;
  color: #FFF;
  border-radius: 50px;
  text-align: center;
  font-size: 30px;
  box-shadow: 2px 2px 3px #999;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #128C7E;
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    right: 20px;
    bottom: 20px;
    font-size: 25px;
  }
`;

// Componente para criar um botão de voltar ao topo
const ScrollToTopButton = styled.button<ScrollButtonProps>`
  position: fixed;
  width: 50px;
  height: 50px;
  bottom: 40px;
  left: 40px;
  background-color: var(--color-primary-benditta);
  color: var(--color-white-benditta);
  border-radius: 50px;
  text-align: center;
  font-size: 20px;
  box-shadow: 2px 2px 3px #999;
  z-index: 100;
  display: ${props => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--color-accent-yellow-benditta);
    color: var(--color-primary-benditta);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    left: 20px;
    bottom: 20px;
    font-size: 16px;
  }
`;

// Componente para criar um menu mobile
const MobileMenu = styled.div<MobileMenuProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-benditta);
  z-index: 1001;
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
`;

const MobileMenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  text-align: center;
`;

const MobileMenuItem = styled.li`
  margin: 20px 0;
`;

const MobileMenuLink = styled.a`
  color: var(--color-white-benditta);
  font-size: 24px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--color-accent-yellow-benditta);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--color-white-benditta);
  font-size: 30px;
  cursor: pointer;
`;

// Componente principal que contém os elementos de UI responsivos
const ResponsiveUI = () => {
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Função para controlar a visibilidade do botão de voltar ao topo
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Escuta eventos do Header para abrir/fechar o menu mobile
  React.useEffect(() => {
    const handleToggleMobileMenu = (event: Event) => {
      const customEvent = event as CustomEvent;
      setMobileMenuOpen(customEvent.detail);
      if (customEvent.detail) {
        document.body.style.overflow = 'hidden'; // Impede o scroll da página quando o menu está aberto
      } else {
        document.body.style.overflow = 'auto'; // Restaura o scroll da página
      }
    };
    
    document.addEventListener('toggleMobileMenu', handleToggleMobileMenu);
    
    return () => {
      document.removeEventListener('toggleMobileMenu', handleToggleMobileMenu);
    };
  }, []);
  
  // Função para rolar para o topo da página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Função para fechar o menu mobile
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto'; // Restaura o scroll da página
  };
  
  return (
    <>
      {/* Botão de WhatsApp flutuante */}
      <WhatsAppButton 
        href="https://wa.me/5562985703845?text=Olá! Gostaria de fazer um pedido na Benditta Pizza." 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contato WhatsApp"
      >
        📱
      </WhatsAppButton>
      
      {/* Botão de voltar ao topo */}
      <ScrollToTopButton 
        visible={showScrollButton} 
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        ↑
      </ScrollToTopButton>
      
      {/* Menu mobile */}
      <MobileMenu isOpen={mobileMenuOpen}>
        <CloseButton onClick={closeMobileMenu} aria-label="Fechar menu">
          ✕
        </CloseButton>
        <MobileMenuList>
          <MobileMenuItem>
            <MobileMenuLink href="#home" onClick={closeMobileMenu}>Home</MobileMenuLink>
          </MobileMenuItem>
          <MobileMenuItem>
            <MobileMenuLink href="#sobre" onClick={closeMobileMenu}>Sobre</MobileMenuLink>
          </MobileMenuItem>
          <MobileMenuItem>
            <MobileMenuLink href="#cardapio" onClick={closeMobileMenu}>Cardápio</MobileMenuLink>
          </MobileMenuItem>
          <MobileMenuItem>
            <MobileMenuLink href="#contato" onClick={closeMobileMenu}>Contato</MobileMenuLink>
          </MobileMenuItem>
        </MobileMenuList>
      </MobileMenu>
    </>
  );
};

export default ResponsiveUI;
