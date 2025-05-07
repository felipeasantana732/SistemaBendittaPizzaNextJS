import { NextResponse } from "next/server";
import { clientes_benditta as Cliente, Prisma } from "@prisma/client";
import { createClient } from "@/app/utils/supabase/server"; // Ajuste o caminho se necessário
import prisma from "@/lib/prisma"; // Ajuste o caminho se necessário

/*interface Endereco {
  id: string;
  rua: string;
  latitude: string;
  longitude: string;
} */

interface ClienteAPI {
  id: string;
  created_at: Date;
  nomeCliente: string | null;
  telefoneCliente: string | null;
  enderecoCliente: string | null;
  idMensagem: string | null;
  sesionID: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("API /api/users: Acesso não autorizado (sem sessão).");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    console.log(
      "API /api/users: Buscando clientes via Prisma para usuário:",
      user.id
    );

    const clientes: Cliente[] = await prisma.clientes_benditta.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    const clientesAPI: ClienteAPI[] = clientes.map((cliente) => ({
      ...cliente,
      id: cliente.id.toString(),
    }));

    console.log(`API /api/users: Encontrados ${clientesAPI.length} clientes.`);

    return NextResponse.json(clientesAPI, { status: 200 });
  } catch (error) {
    console.error("API /api/users: Erro ao buscar clientes com Prisma:", error);

    return NextResponse.json(
      {
        message: "Erro interno ao buscar clientes.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

//POST -> Cadastrar um novo cliente (clienteForm /admin/clientes/add.tsx)
export async function POST(request: Request) {
  const supabase = await createClient();

  type CreateClienteInput = Omit<
    Prisma.clientes_bendittaCreateInput,
    "id" | "created_at"
  >;

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn("API /api/users: Acesso não autorizado (sem sessão).");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const {
      nomeCliente,
      telefoneCliente,
      enderecoCliente,
      idMensagem,
      sesionID, // Corrigido para sesionID se for o nome no schema
    }: Partial<CreateClienteInput> = body;

    if (!nomeCliente) {
      return NextResponse.json({ message: "Nome do cliente é obrigatório." }, { status: 400 });
    }
  
    const novoClienteData: Prisma.clientes_bendittaCreateInput = {
      nomeCliente,
      telefoneCliente: telefoneCliente || null, // Garante null se undefined
      enderecoCliente: enderecoCliente || null,
      idMensagem: idMensagem || null,
      sesionID: sesionID || null,
      // created_at é definido por @default(now()) no schema Prisma
    };
    const clienteCriado = await prisma.clientes_benditta.create({
      data: novoClienteData,
    });

    const clienteResposta: ClienteAPI = {
      ...clienteCriado,
      id: clienteCriado.id.toString(),
      sesionID: clienteCriado.sesionID
    }

    return new Response(JSON.stringify(clienteResposta), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "API /api/users: Erro ao inserir clientes com Prisma:",
      error
    );

    return NextResponse.json(
      {
        message: "Erro interno ao Criar clientes.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
  // Parse the request body
}
