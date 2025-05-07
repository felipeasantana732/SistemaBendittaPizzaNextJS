"use client"; // Este hook só roda no cliente

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Importa a biblioteca js-cookie
import { useSearchParams, useRouter, usePathname } from 'next/navigation'; // Importa hooks de navegação

// Nome do cookie (ainda pode ser usado como fallback ou para outros casos)
const FLASH_COOKIE_NAME = 'flash_message';

// Estrutura da mensagem
interface FlashMessage {
  type: 'success' | 'error';
  message: string;
}

// Tipo de retorno do hook
interface UseFlashMessageReturn {
  flashMessage: FlashMessage | null;
  clearFlashMessage: () => void; // Mantém a função de limpar, caso necessário
}

/**
 * Hook customizado para ler flash messages de parâmetros de URL ou cookies.
 * Dá prioridade aos parâmetros de URL.
 * @returns Objeto contendo a mensagem flash atual (ou null) e uma função para limpá-la.
 */
export function useFlashMessage(): UseFlashMessageReturn {
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null);
  const searchParams = useSearchParams(); // Hook para ler query params
  const router = useRouter(); // Hook para manipulação do roteador (opcional, para limpar URL)
  const pathname = usePathname(); // Hook para obter o caminho atual (opcional, para limpar URL)

  useEffect(() => {
    // Verifica parâmetros de URL primeiro
    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('flash_success');

    let messageData: FlashMessage | null = null;
    let readFromUrl = false;

    if (errorParam) {
      messageData = { type: 'error', message: decodeURIComponent(errorParam) };
      readFromUrl = true;
    } else if (successParam) {
      messageData = { type: 'success', message: decodeURIComponent(successParam) };
      readFromUrl = true;
    }

    // Se não encontrou na URL, tenta ler do cookie (fallback)
    if (!messageData) {
      const cookieValue = Cookies.get(FLASH_COOKIE_NAME);
      if (cookieValue) {
        try {
          messageData = JSON.parse(cookieValue) as FlashMessage;
          // Limpa o cookie imediatamente após ler
          Cookies.remove(FLASH_COOKIE_NAME, { path: '/' });
        } catch (error) {
          console.error("Erro ao parsear ou limpar cookie de flash message:", error);
          Cookies.remove(FLASH_COOKIE_NAME, { path: '/' }); // Limpa mesmo com erro
        }
      }
    }

    // Define a mensagem no estado se encontrou alguma
    if (messageData) {
      setFlashMessage(messageData);

      // Opcional: Limpa os parâmetros da URL após ler a mensagem
      // Isso evita que a mensagem reapareça se o usuário recarregar a página.
      // No entanto, causa uma substituição no histórico do navegador.
      if (readFromUrl) {
         // Cria uma cópia dos parâmetros atuais
         const newSearchParams = new URLSearchParams(searchParams.toString());
         // Remove os parâmetros de flash message
         newSearchParams.delete('error');
         newSearchParams.delete('flash_success');
         // Substitui a URL atual sem os parâmetros de flash, sem recarregar a página
         router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
      }
    }

  }, [searchParams, pathname, router]); // Re-executa se os searchParams mudarem

  // Função para limpar manualmente a mensagem (útil para botões de fechar)
  const clearFlashMessage = () => {
    setFlashMessage(null);
    // Garante que o cookie seja removido se ainda existir
    Cookies.remove(FLASH_COOKIE_NAME, { path: '/' });
    // Poderia também limpar a URL aqui se desejado, mas já fazemos no useEffect
  };

  return { flashMessage, clearFlashMessage };
}
