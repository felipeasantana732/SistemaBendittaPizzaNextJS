import { NextResponse } from 'next/server';
import { clientes_benditta as Cliente } from '@prisma/client'; 
import { createClient } from '@/app/utils/supabase/server'; // Ajuste o caminho se necessário
import prisma from '@/lib/prisma'; // Ajuste o caminho se necessário

interface ClienteAPI {
  id: string; 
  created_at: Date ;
  nomeCliente: string | null;
  telefoneCliente: string | null;
  enderecoCliente: string | null;
  idMensagem: string | null;
  sesionID: string | null; 
}

export async function GET(request: Request,
    { params }: {params: {id: string}}
) { // 'request' pode ser usado para query params, etc.
  const supabase = await createClient();

  try {

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("API /api/users: Acesso não autorizado (sem sessão).");
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    // --- Opcional: Verificação de Role (Autorização) ---
    // Se apenas funcionários/admins podem ver todos os clientes
    /*
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
        console.error("API /api/users: Erro ao buscar perfil para usuário:", user.id, profileError);
        return NextResponse.json({ message: 'Erro ao verificar permissões.' }, { status: 500 });
    }

    const allowedRoles = ['funcionario', 'super-admin'];
    if (!allowedRoles.includes(profile.role)) {
        console.warn(`API /api/users: Acesso negado para usuário ${user.id} com role ${profile.role}.`);
        // Retorna erro 403 Forbidden se o role não for permitido
        return NextResponse.json({ message: 'Acesso negado.' }, { status: 403 });
    }
    */
    // --- Fim da Verificação de Role Opcional ---

    const clientId:string = params.id ;

    console.log("API /api/users/id: Buscando clientes com ID =", clientId);

    let idAsBigInt:bigint;
    try {
        idAsBigInt = BigInt(clientId);
      } catch (e) {
        console.warn(`API /api/users/[id]: ID inválido fornecido: ${clientId}`);
        return NextResponse.json({ message: `ID de cliente inválido. erro: ${e}` }, { status: 400 }); // Bad Request
      }

    const cliente: Cliente | null = await prisma.clientes_benditta.findUnique({
        where: {
          id: idAsBigInt, // Usa o ID convertido para BigInt
        },
      });

    if(!cliente){
        return NextResponse.json({ message: `Cliente não foi encontrado` }, { status: 400 }); // Bad Request
    }


    const clienteById: ClienteAPI = {
        ...cliente, // Espalha as propriedades do objeto do banco
        id: cliente.id.toString(), // Converte o BigInt 'id' para string
        // Se houver outros campos BigInt, converta-os aqui também
        // Exemplo: outroCampoBigInt: clienteFromDB.outroCampoBigInt.toString(),
      };

    console.log(`Esse é o Sr. ${clienteById.nomeCliente} `);

    // 7. Retorne os dados usando NextResponse.json
    return NextResponse.json(clienteById, { status: 200 });

  } catch (error) {
    // 8. Trate outros erros (ex: erro do Prisma)
    console.error("API /api/users: Erro ao buscar clientes com Prisma:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar clientes.", error: (error as Error).message },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name } = body;

  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
