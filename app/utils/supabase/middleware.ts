import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          // Note: Changed the loop to ensure response object is updated correctly
          // before setting cookies on it.
          const response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
          // Assign the updated response object back to supabaseResponse
          supabaseResponse = response;
        },
      },
    }
  )

  // IMPORTANT: Avoid writing code between createServerClient and supabase.auth.getUser().
  // Issues like random logouts can occur if this is not followed.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define rotas públicas que não exigem login
  const publicPaths = ['/', '/login', '/auth']; // Adicione outras rotas públicas aqui (ex: '/sobre')

  // Verifica se o usuário NÃO está logado E se a rota atual NÃO é uma das públicas
  if (
    !user &&
    !publicPaths.some(path => request.nextUrl.pathname === path || (path !== '/' && request.nextUrl.pathname.startsWith(path)))
    // Explicação da condição acima:
    // 1. !user: Garante que só aplicamos isso a usuários não logados.
    // 2. !publicPaths.some(...): Verifica se o caminho atual NÃO está na lista de caminhos públicos.
    //    - request.nextUrl.pathname === path: Verifica correspondência exata (importante para '/')
    //    - (path !== '/' && request.nextUrl.pathname.startsWith(path)): Para outros caminhos como '/login', '/auth', permite sub-rotas (ex: /auth/callback)
  ) {
    // Redireciona o usuário não logado para a página de login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    console.log(`Redirecting unauthenticated user from ${request.nextUrl.pathname} to /login`); // Log para debug
    return NextResponse.redirect(url)
  }

   // Opcional: Redirecionar usuário logado se tentar acessar /login
   if (user && request.nextUrl.pathname === '/login') {
       const url = request.nextUrl.clone();
       url.pathname = '/dashboard'; // Ou sua página principal após login
       console.log(`Redirecting authenticated user from /login to /dashboard`); // Log para debug
       return NextResponse.redirect(url);
   }


  // IMPORTANT: Retorna a resposta do Supabase (que contém os cookies atualizados)
  return supabaseResponse
}
