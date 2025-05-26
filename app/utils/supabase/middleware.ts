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

 
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define rotas públicas que não exigem login
  const publicPaths = ['/', '/login', '/auth', '/api/promos' ]; 

  // Verifica se o usuário NÃO está logado E se a rota atual NÃO é uma das públicas
  if (
    !user &&
    !publicPaths.some(path => request.nextUrl.pathname === path || (path !== '/' && request.nextUrl.pathname.startsWith(path)))
    //Permite Sub Rotas "/login autoriza /login/callback por exemplo"
  ) {
    // Redireciona o usuário não logado para a página de login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    console.log(`Redirecting unauthenticated user from ${request.nextUrl.pathname} to /login`); // Log para debug
    return NextResponse.redirect(url)
  }

   // Redirecionar usuário logado se tentar acessar /login
   if (user && request.nextUrl.pathname === '/login') {
       const url = request.nextUrl.clone();
       url.pathname = '/admin/dashboard'; // Pag principal pos login
       console.log(`Redirecting authenticated user from /login to /admin/dashboard`); 
       return NextResponse.redirect(url);
   }


  // IMPORTANTE: Retorna a resposta do Supabase (que contém os cookies atualizados)
  return supabaseResponse
}
