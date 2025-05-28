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

export async function GET(request: Request) { 
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop() // pega o último segmento

  if (!id) {
    return NextResponse.json({ message: 'ID não fornecido corretamente' }, { status: 400 })
  }

  const supabase = await createClient();

  try {

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("API /api/users: Acesso não autorizado (sem sessão).");
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const clientId:string = id ;

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

    if(!cliente || cliente===null){
        return NextResponse.json({ message: `Cliente não foi encontrado` }, { status: 400 }); // Bad Request
    }


    const clienteById: ClienteAPI = {
        ...cliente, 
        id: cliente.id.toString(), 
      };

    console.log(`Esse é o Sr. ${clienteById.nomeCliente} `);

    
    return NextResponse.json(clienteById, { status: 200 });

  } catch (error) {
 
    console.error("API /api/users: Erro ao buscar clientes com Prisma:", error);
    return NextResponse.json(
      { message: "Erro interno ao buscar clientes.", error: (error as Error).message },
      { status: 500 }
    );
  }
}



export async function POST(request: Request) {
  
  const body = await request.json();
  const { name } = body;

  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
