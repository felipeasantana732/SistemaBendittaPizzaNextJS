'use server'
// Exemplo na sua função login (Server Action)
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient} from '@/app/utils/supabase/server'; // Seu cliente Supabase para Actions


export async function login(formData: FormData) {
  const supabase = createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    if (!email || !password) {
      // Redireciona de volta para /login com mensagem de erro via query param
      return redirect('/login?error=' + encodeURIComponent('E-mail e senha são obrigatórios.'));
    }
  }

  const { error } = await (await supabase).auth.signInWithPassword({ email, password });


  if (error) {

    if(error?.message=="Email not confirmed"){
      redirect('/login/confirm');
    } else  {
    console.error("Erro de login Supabase:", error.message);
    return redirect('/login?error=' + encodeURIComponent(error.message));
    }
  }

  // Success
  revalidatePath('/', 'layout');
  redirect('/admin/dashboard?flash_success=Login+realizado+com+sucesso!');

}

// Para exibir mensagens de SUCESSO de forma confiável após um redirect de Server Action,
// passar via query param pode ser mais simples: redirect('/dashboard?flash_success=Login+realizado+com+sucesso!');
// E o hook useFlashMessage leria tanto o cookie quanto o query param.

export async function signup(formData: FormData) {
  const supabase = createClient(); // Cria cliente para actions/server
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Validação básica (adicione mais validações se necessário, ex: força da senha)
   if (!email || !password) {
     return redirect('/login?error=' + encodeURIComponent('E-mail e senha são obrigatórios para cadastro.'));
   }
   if (password.length < 6) { // Exemplo: validação mínima de senha
       return redirect('/login?error=' + encodeURIComponent('A senha deve ter pelo menos 6 caracteres.'));
   }


  // Tenta cadastrar o usuário
  const { error } = await (await supabase).auth.signUp({ email, password });

  // Se houver erro no cadastro
  if (error) {
    console.error("Erro de cadastro Supabase:", error.message);
     // Redireciona de volta para /login com mensagem de erro via query param
    return redirect('/login?error=' + encodeURIComponent(error.message));
  }

  // Sucesso no cadastro
  revalidatePath('/', 'layout'); // Revalida o cache

  // Redireciona para o dashboard ou para uma página de "verifique seu email"
  // se a confirmação estiver habilitada no Supabase.
  // Para simplificar, redirecionaremos para o dashboard.
  // Considere adicionar uma mensagem de sucesso via query param se desejar.
  redirect('/login/confirm');
}