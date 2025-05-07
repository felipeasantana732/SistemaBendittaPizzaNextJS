"use client"; // Marca este como um Componente Cliente

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { createClient } from '@/app/utils/supabase/client'; // Cliente para componentes cliente
import { type User } from '@supabase/supabase-js';
import { logout } from '@/lib/actions/authAction'; // Importa a Server Action de logout

// --- Styled Components ---

const MenuContainer = styled.div`
  position: relative; /* Para posicionar o dropdown */
  display: inline-block; /* Ou ajuste conforme seu layout */
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: var(--color-white-benditta); /* Cor do texto/ícone */
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px; /* Espaço entre nome/ícone */

  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Leve destaque no hover */
  }
`;

const UserNameDisplay = styled.span`
  font-weight: 500;
  /* Estilos adicionais para o nome */
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%; /* Posiciona abaixo do botão */
  right: 0; /* Alinha à direita */
  background-color: var(--color-white); /* Fundo do dropdown */
  color: var(--color-primary-benditta); /* Cor do texto no dropdown */
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 10px 0; /* Padding vertical */
  min-width: 180px; /* Largura mínima */
  z-index: 1100; /* Acima de outros elementos */
  margin-top: 8px; /* Pequeno espaço do botão */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;

  &.open {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const DropdownItem = styled.div`
  padding: 10px 20px;
  font-size: 0.95rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: var(--color-secondary); /* Cor de destaque/perigo */
  cursor: pointer;
  padding: 10px 20px;
  text-align: left;
  width: 100%;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05); /* Leve destaque no hover */
  }
`;

// --- Componente ---

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient(); // Cria cliente Supabase no cliente
  const menuRef = useRef<HTMLDivElement>(null); // Ref para detectar cliques fora

  // Busca os dados do usuário ao montar o componente
  useEffect(() => {
    const getUserData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    getUserData();
  }, [supabase]); // Dependência do cliente Supabase

  // Efeito para fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    // Adiciona listener quando o menu está aberto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    // Limpa o listener ao desmontar ou quando o menu fecha
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Mostra um placeholder ou nada enquanto carrega o usuário
  if (!user) {
    return <MenuContainer>...</MenuContainer>; // Ou um ícone de usuário genérico
  }

  return (
    <MenuContainer ref={menuRef}>
      <MenuButton onClick={toggleMenu}>
        {/* Mostra o email ou um ícone de usuário */}
        <UserNameDisplay>{user.email ?? 'Usuário'}</UserNameDisplay>
        {/* Ícone de seta (exemplo) */}
        <span>{isOpen ? '▲' : '▼'}</span>
      </MenuButton>

      <DropdownMenu className={isOpen ? 'open' : ''}>
        <DropdownItem>
          Logado como: <br/> <strong>{user.email}</strong>
        </DropdownItem>
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '5px 0' }} />
        {/* Formulário que chama a Server Action de logout */}
        <form action={logout}>
          <LogoutButton type="submit">
            Sair
          </LogoutButton>
        </form>
      </DropdownMenu>
    </MenuContainer>
  );
}
