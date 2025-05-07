"use client"; // Marca este arquivo como contendo Componentes Cliente

import styled from 'styled-components';

// Move a definição do styled component para cá
export const AdminHeaderContainer = styled.header`
  background-color: var(--color-primary-benditta); /* Ajuste as variáveis se necessário */
  color: var(--color-white-benditta);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Adicione outros estilos que você tinha */
`;

// Você pode definir outros styled components usados no layout aqui também
export const AdminMainContent = styled.main`
  padding: 20px;
`;

// Exporte outros componentes estilizados conforme necessário...
