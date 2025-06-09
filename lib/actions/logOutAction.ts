"use server"; 

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server'; 

export async function logout() {
  const supabase = createClient();

  // Tenta deslogar o usuário
  const { error } = await (await supabase).auth.signOut();

  if (error) {
    console.error('Erro ao fazer logout:', error);
    return redirect('/login?error=' + encodeURIComponent('Erro ao tentar sair.'));
  }

  console.log('Logout bem-sucedido, redirecionando para /login');
  return redirect('/login/?flash_success=LogOut+realizado+com+sucesso!'); 
}
