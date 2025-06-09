
import React from 'react';
import styled from 'styled-components';
import WhatsAppIcon from '@/components/icons/whatsapp-icon.svg'
import Image from 'next/image';


// --- INTERFACES ---
interface HeaderProps {
  $scrolled: boolean;
}

interface ScrollButtonProps {
  $visible: boolean;
}

interface MobileMenuProps {
  $isOpen: boolean;
}

// --- STYLED COMPONENTS ---
const HeaderContainer = styled.header<HeaderProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Abaixo do menu mobile que terá z-index maior */
  background-color: ${props => props.$scrolled ? 'var(--color-primary-benditta)' : 'rgba(0, 0, 0, 0.7)'};
  transition: background-color 0.3s ease, padding 0.3s ease;
  padding: ${props => props.$scrolled ? '10px 0' : '20px 0'};
  box-shadow: ${props => props.$scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};

  .logo-img {
    height: ${props => props.$scrolled ? '50px' : '60px'};
    transition: height 0.3s ease;
  }
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.div`
  img {
    display: block;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-left: 30px;

  &:first-child {
    margin-left: 0;
  }
`;

const NavLink = styled.a`
  color: #FFFFFF;
  font-weight: 500;
  font-size: 16px;
  position: relative;
  text-decoration: none;
  padding-bottom: 8px;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-accent-yellow-benditta);
    transition: width 0.3s ease;
  }

  &:hover:after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--color-white-benditta); /* Ajuste a cor se necessário */
  font-size: 24px;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`;


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
  z-index: 1000; // Mesmo z-index do header, ou ajuste conforme necessário
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

const ScrollToTopButton = styled.button<ScrollButtonProps>`
  position: fixed;
  width: 50px;
  height: 50px;
  bottom: 110px; /* Ajustado para não sobrepor o WhatsAppButton */
  right: 40px; /* Alinhado com WhatsAppButton, ou ajuste conforme preferir */
  background-color: var(--color-primary-benditta);
  color: var(--color-white-benditta);
  border-radius: 50px;
  text-align: center;
  font-size: 20px;
  box-shadow: 2px 2px 3px #999;
  z-index: 1000;
  display: ${props => props.$visible ? 'flex' : 'none'};
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
    right: 20px;
    bottom: 80px; /* Ajustado para não sobrepor o WhatsAppButton */
    font-size: 16px;
  }
`;


const MobileMenuContainer = styled.div<MobileMenuProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-primary-benditta); /* Ou outra cor de fundo desejada */
  z-index: 1001; /* Acima do HeaderContainer */
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease; /* Pode ajustar a transição */
  opacity: ${props => props.$isOpen ? 1 : 0};
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


// --- COMPONENTE  HEADER ---
const Header: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [$mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showScrollButton, setShowScrollButton] = React.useState(false); 

 
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
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

  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto'; 
  };
  
  // Abrir/fechar o menu mobile
  const toggleMobileMenu = () => {
    const newMenuState = !$mobileMenuOpen;
    setMobileMenuOpen(newMenuState);
    if (newMenuState) {
      document.body.style.overflow = 'hidden'; // Impede o scroll da página quando o menu está aberto
    } else {
      document.body.style.overflow = 'auto'; // Restaura o scroll da página
    }
  };

  return (
    <React.Fragment> {/* Usamos Fragment para agrupar o Header e os botões fixos */}
      <HeaderContainer $scrolled={scrolled}>
        <NavContainer>
          <Logo>
            <a href="#home">
              <img src="/img/bendittaPizza/bendittaLogoSVG.svg" alt="Benditta Pizza" className="logo-img" />
            </a>
          </Logo>

          <NavLinks>
            <NavList>
              <NavItem>
                <NavLink href="#home">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#sobre">Sobre</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#cardapio">Cardápio</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#contato">Contato</NavLink>
              </NavItem>
            </NavList>
          </NavLinks>

          <MobileMenuButton
            aria-label="Abrir menu"
            onClick={toggleMobileMenu}
          >
            ☰
          </MobileMenuButton>
        </NavContainer>
      </HeaderContainer>

      {/* Menu mobile renderizado aqui */}
      {$mobileMenuOpen && (
         <MobileMenuContainer $isOpen={$mobileMenuOpen}>
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
        </MobileMenuContainer>
      )}

      {/* Botão de WhatsApp flutuante */}
      <WhatsAppButton 
        href="https://wa.me/5562985703845?text=Olá! Gostaria de fazer um pedido na Benditta Pizza." // Substitua pelo seu número
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contato WhatsApp"
      >
      <Image src={WhatsAppIcon} alt="WppIcon" width={36} height={36} />
         {/* 📱 Você pode usar um ícone SVG aqui se preferir */}
      </WhatsAppButton>
      
      {/* Botão de voltar ao topo */}
      <ScrollToTopButton 
        $visible={showScrollButton} 
        onClick={scrollToTop}
        aria-label="Voltar ao topo"
      >
        ↑
      </ScrollToTopButton>
    </React.Fragment>
  );
};

export default Header;