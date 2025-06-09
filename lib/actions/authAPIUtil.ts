import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; 
import type { User } from '@supabase/supabase-js'; 


interface AuthCheckResult {
  user: User | null;
  errorResponse: NextResponse | null;
}
/*
*
*    @returns {Promise<AuthCheckResult>} 
*
*/
export async function authenticateApiRequest(): Promise<AuthCheckResult> {
  const supabase = await createClient(); 

  
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.warn('API Request: Acesso não autorizado (sem sessão ou erro ao obter usuário). Detalhes do erro:', authError?.message);
    return {
      user: null,
      // Retorna um NextResponse com status 401 (Não Autorizado)
      errorResponse: NextResponse.json(
        { message: authError?.message || 'Não autorizado. Sessão inválida ou expirada.' },
        { status: 401 }
      ),
    };
  }

  // Se chegou aqui, o usuário está autenticado
  console.log('API Request: Usuário autenticado:', user.id);
  return {
    user: user, // Retorna o objeto do usuário
    errorResponse: null, // Nenhuma resposta de erro
  };
}
