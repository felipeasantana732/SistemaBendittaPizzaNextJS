import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server'; // Ou seu caminho

export async function getUserOrRedirect() {
  const supabase = await createClient();
  const { data: { user }, error } =  await supabase.auth.getUser();

  if (error || !user) {
    console.log('Usuário não autenticado, redirecionando para /login');
    redirect('/login');
  }
  // Retorna o usuário se encontrado, para uso na página
  return user;
}