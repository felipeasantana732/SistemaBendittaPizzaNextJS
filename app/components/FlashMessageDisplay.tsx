"use client"; 

import React, { useEffect, useState } from 'react'; 
import { useFlashMessage } from '@/app/hooks/useFlashMessage'; 
import styled, { css } from 'styled-components'; 


const FlashMessageContainer = styled.div<{ type: 'success' | 'error'; $isVisible: boolean }>`
  position: fixed; 
  top: 20px; 
  right: 20px; 
  padding: 12px 20px; 
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  z-index: 9999; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: ${props => props.$isVisible ? 1 : 0}; 
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'}; 
  transition: opacity 0.5s ease-out, visibility 0.5s ease-out; 
  display: flex; 
  align-items: center; 
  gap: 15px; 
  max-width: 400px; 
  width: auto; 

  
  ${({ type }) =>
    type === 'success' &&
    css`
      background-color: #28a745; 
    `}

  ${({ type }) =>
    type === 'error' &&
    css`
      background-color: #dc3545;
    `}
`;

// Estilo para o botão de fechar
const CloseButton = styled.button`
  background: none;
  border: none;
  color: white; /* Cor do X */
  font-size: 22px; /* Tamanho do X ligeiramente maior */
  font-weight: bold;
  line-height: 1; /* Garante que o X não tenha altura extra */
  cursor: pointer;
  padding: 0; /* Remove padding extra */
  margin: 0; /* Remove margem extra */
  opacity: 0.7;
  transition: opacity 0.2s ease;
  flex-shrink: 0; /* Impede que o botão encolha */
  margin-left: auto; /* Empurra o botão para a direita (alternativa ao gap/order) */


  &:hover {
    opacity: 1;
  }
`;

// Estilo para o texto da mensagem
const MessageText = styled.span`
  flex-grow: 1; /* Permite que o texto ocupe o espaço restante */
  text-align: left; /* Garante alinhamento à esquerda */
  /* Propriedades para garantir a quebra de linha */
  word-wrap: break-word; /* Quebra palavras longas (legado) */
  overflow-wrap: break-word; /* Quebra palavras longas (padrão) */
  white-space: normal; /* Garante que o espaço em branco permita quebras */
`;


/**
 * Componente para exibir mensagens flash lidas do hook useFlashMessage.
 */
export default function FlashMessageDisplay() {
  const { flashMessage } = useFlashMessage();
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<typeof flashMessage>(null);
  const visibilityTimerRef = React.useRef<NodeJS.Timeout | null>(null); // Ref para o timer

  useEffect(() => {
    // Limpa timer anterior se a mensagem mudar rapidamente
    if (visibilityTimerRef.current) {
      clearTimeout(visibilityTimerRef.current);
    }

    if (flashMessage) {
      setCurrentMessage(flashMessage);
      setIsVisible(true);

      // Define um timer para esconder a mensagem após 10 segundos
      visibilityTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 5000); // 5 segundos

    } else {
      // Garante que esteja invisível se não houver flash message inicial
      setIsVisible(false);
    }

    // Limpa o timer ao desmontar
    return () => {
      if (visibilityTimerRef.current) {
        clearTimeout(visibilityTimerRef.current);
      }
    };
  }, [flashMessage]); // Re-executa apenas quando a flashMessage do hook muda

  // Função para fechar manually ao clicar no X
  const handleClose = () => {
      if (visibilityTimerRef.current) {
          clearTimeout(visibilityTimerRef.current); // Cancela o timer de 10s
      }
      setIsVisible(false); // Esconde imediatamente
  }

  if (!currentMessage) {
    return null;
  }

  return (
    <FlashMessageContainer type={currentMessage.type} $isVisible={isVisible}>
      {/* Mensagem (vem primeiro no JSX) */}
      <MessageText>{currentMessage.message}</MessageText>
      {/* Botão de Fechar (vem depois no JSX) */}
      <CloseButton onClick={handleClose} aria-label="Fechar mensagem">
        &times; {/* Caractere HTML para 'X' */}
      </CloseButton>
    </FlashMessageContainer>
  );
}
