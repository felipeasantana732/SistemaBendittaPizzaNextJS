import { NextResponse } from "next/server";
import { Prisma, clientes_benditta as PrismaCliente } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ClienteAPI } from "@/types/Cliente";
import { authenticateApiRequest } from "@/lib/actions/authAPIUtil";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const authResult = await authenticateApiRequest();

    if (authResult.errorResponse) {
      console.warn("API /api/users: Acesso não autorizado (sem sessão).");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    //const user = authResult.user;

  try{
    const clientesFromDB: PrismaCliente[] = await prisma.clientes_benditta.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    // Mapeia para o tipo ClienteAPI, convertendo o ID
    const clientesAPI: ClienteAPI[] = clientesFromDB.map((cliente) => ({
      ...cliente,
      id: cliente.id.toString(), // Converte BigInt para string
      // created_at já é Date, será stringificada pelo NextResponse.json
    }));

    console.log(`API /api/users: Encontrados ${clientesAPI.length} clientes.`);
    return NextResponse.json(clientesAPI, { status: 200 });

  } catch (error) {
    console.error("API /api/users GET: Erro ao buscar clientes com Prisma:", error);
    return NextResponse.json(
      {
        message: "Erro interno ao buscar clientes.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {

  const authResult = await authenticateApiRequest();

    if (authResult.errorResponse) {
      console.warn("API /api/users: Acesso não autorizado (sem sessão).");
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    //const user = authResult.user;

    


  type CreateClienteInput = Omit<
    Prisma.clientes_bendittaCreateInput,
    "id" | "created_at" // Omitindo os itens que são gerados pelo banco automaticamente
  >;

  try {
  
    const body = await request.json();

    const {
      nomeCliente,
      telefoneCliente,
      enderecoCliente,
      idMensagem,
      sesionID, 
    }: Partial<CreateClienteInput> = body; // Usa Partial para permitir campos opcionais no body

    if (!nomeCliente) {
      return NextResponse.json(
        { message: "Nome do cliente é obrigatório." },
        { status: 400 }
      );
    }

    const novoClienteData: Prisma.clientes_bendittaCreateInput = {
      nomeCliente,
      telefoneCliente: telefoneCliente || null,
      enderecoCliente: enderecoCliente || null,
      idMensagem: idMensagem || null,
      sesionID: sesionID || null
    };

    const clienteCriado = await prisma.clientes_benditta.create({
      data: novoClienteData,
    });

    // Mapeia para o tipo ClienteAPI para a resposta
    const clienteResposta: ClienteAPI = {
      ...clienteCriado,
      id: clienteCriado.id.toString(), // Converte BigInt para string
    };

    return NextResponse.json(clienteResposta, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("API POST /api/users: Erro ao criar cliente com Prisma:", error);
    if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json(
            { message: "Erro de validação nos dados fornecidos.", details: error.message },
            { status: 400 }
        );
    }
    return NextResponse.json(
      {
        message: "Erro interno ao criar cliente.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
