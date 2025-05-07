import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Importa o helper de cookies
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rota de API para lidar com o callback de autenticação do Supabase.
 * Troca o código de autorização por uma sessão e define os cookies.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/'; // Redireciona para '/' por padrão
  let errorMessage: string | null = null; // Variável para armazenar a mensagem de erro

  console.log(`Auth Callback: Received code - ${code ? 'Yes' : 'No'}, next - ${next}`);

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              console.warn(`Note: cookieStore.setAll failed partially in Route Handler, relying on exchangeCodeForSession response modification.`);
            }
          },
        },
      }
    );

    // Troca o código por uma sessão.
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code); // Renomeia para evitar conflito de escopo

    if (!exchangeError) {
      // Sucesso na troca
      console.log('Auth Callback: Session exchanged successfully. Redirecting to:', `${origin}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      // Erro na troca - Usa a variável 'exchangeError' explicitamente
      // para definir a mensagem de erro que será usada no redirect.
      errorMessage = exchangeError instanceof Error ? exchangeError.message : 'Ocorreu um erro desconhecido durante a autenticação.';
      console.error('Auth Callback: Error exchanging code for session:', errorMessage);
      console.error('Supabase Error Details:', exchangeError);
      // O fluxo continua para o redirect de erro abaixo, onde errorMessage será usado
    }
  } else {
      errorMessage = 'Código de autorização ausente na URL.';
      console.warn('Auth Callback:', errorMessage);
  }

  // Redireciona para uma página de erro
  console.log('Auth Callback: Redirecting to auth-code-error');
  const errorUrl = new URL('/auth/auth-code-error', origin);
  // Adiciona a mensagem de erro como parâmetro se ela existir
  // Agora 'errorMessage' depende diretamente do 'exchangeError' (ou da falta de 'code')
  if (errorMessage) {
    errorUrl.searchParams.set('error_description', errorMessage);
  }
  return NextResponse.redirect(errorUrl);
}
