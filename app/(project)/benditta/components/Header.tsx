import React from 'react';
import styled from 'styled-components';

// Interface para as props do HeaderContainer
interface HeaderProps {
  $scrolled: boolean;
}

// Styled component para o container do header
// Usa a interface HeaderProps e aplica estilos baseados na prop $scrolled
const HeaderContainer = styled.header<HeaderProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: ${props => props.$scrolled ? 'var(--color-primary-benditta)' : 'rgba(0, 0, 0, 0.7)'};
  transition: background-color 0.3s ease, padding 0.3s ease;
  padding: ${props => props.$scrolled ? '10px 0' : '20px 0'};
  box-shadow: ${props => props.$scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};

  /* --- CORREÇÃO AQUI --- */
  /* Altera a altura da imagem dentro do Logo baseado na prop $scrolled do HeaderContainer */
  .logo-img { /* Adicionamos uma classe à imagem para facilitar a seleção */
    height: ${props => props.$scrolled ? '50px' : '60px'}; /* Muda a altura com base no scroll */
    transition: height 0.3s ease;
  }
  /* --- FIM DA CORREÇÃO --- */
`;

// Styled component para o container da navegação interna
const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

// Styled component para a logo - Não precisa mais da lógica de altura condicional aqui
const Logo = styled.div`
  img {
    /* Mantém apenas estilos base da imagem */
    display: block;
  }
`;

// Styled component para os links de navegação (desktop)
const NavLinks = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

// Styled component para a lista de links
const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
`;

// Styled component para cada item da lista
const NavItem = styled.li`
  margin-left: 30px;

  &:first-child {
    margin-left: 0;
  }
`;

// Styled component para o link de navegação
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

// Styled component para o botão do menu mobile (ícone hambúrguer)
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--color-white-benditta);
  font-size: 24px;
  cursor: pointer;
  padding: 5px;

  @media (max-width: 768px) {
    display: block;
  }
`;

// Componente funcional Header
const Header: React.FC = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    console.log("Mobile menu toggled:", !mobileMenuOpen);
    // const event = new CustomEvent('toggleMobileMenu', { detail: !mobileMenuOpen });
    // document.dispatchEvent(event);
  };

  return (
    <HeaderContainer $scrolled={scrolled}>
      <NavContainer>
        <Logo>
          <a href="#home">
            {/* Adiciona a classe 'logo-img' para ser selecionada pelo CSS do HeaderContainer */}
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

      {/* {mobileMenuOpen && <MobileMenuComponent />} */}

    </HeaderContainer>
  );
};

export default Header;
