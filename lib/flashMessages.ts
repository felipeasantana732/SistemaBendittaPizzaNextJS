import { NextResponse } from 'next/server';

const FLASH_COOKIE_NAME = 'flash_message';

interface FlashMessage {
  type: 'success' | 'error';
  message: string;
}

/**
 * Define um cookie de flash message na resposta.
 * A mensagem será lida e removida pelo cliente.
 * @param response - O objeto NextResponse onde o cookie será definido.
 * @param type - O tipo da mensagem ('success' ou 'error').
 * @param message - O texto da mensagem.
 */
export function setFlashMessageCookie(
  response: NextResponse,
  type: FlashMessage['type'],
  message: string
): void {
  const flashMessage: FlashMessage = { type, message };
  const cookieValue = JSON.stringify(flashMessage);

  response.cookies.set(FLASH_COOKIE_NAME, cookieValue, {
    path: '/', // Disponível em todo o site
    httpOnly: false, 
    maxAge: 10, 
    sameSite: 'lax', 
    secure: process.env.NODE_ENV === 'production', // Use 'secure' em produção (HTTPS)
  });
}

