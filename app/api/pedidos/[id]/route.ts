import { getHistoricoPedidosById, getPedidoById, updateStatusPedido } from "@/lib/actions/pedidos";
import { z } from "zod";
import { NextResponse } from "next/server";
import {
  //HistoricoCompletoPedidosType,
  PedidoFrontSchema,
  //validatePedidoCompleto,
  //safeParseHistoricoComItensSchema,
  validatePedidoFront,
} from "@/types/Zod/PedidoDetalheSchema";
import { validarHistorico } from "@/types/Zod/HistoricoSchema";


export async function GET(
  request: Request 
) {

  try{
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop() // pega o último segmento

  if (!id) {
    return NextResponse.json({ message: 'ID não fornecido corretamente' }, { status: 400 })
  }

    const pedidoId = id;


    // 1. Buscar o pedido principal
    let pedido: z.infer<typeof PedidoFrontSchema>;

    try {
      const pedidoResult = await getPedidoById(pedidoId);

      if (!pedidoResult) {
        return NextResponse.json(
          { message: `Nenhum registro encontrado para o pedido: ${pedidoId}` },
          { status: 404 } // 404 para não encontrado
        );
      }

      pedido = validatePedidoFront(pedidoResult);
    } catch (error) {
      console.error(`Erro ao consultar pedido na database: ${error}`);
      return NextResponse.json(
        { message: "Erro ao consultar pedido na database" },
        { status: 500 } // 500 para erro interno
      );
    }

    // 2. Buscar histórico de pedidos do cliente
    let historico:unknown;

    try {
      const clienteId = pedido.cliente.id;

      if (clienteId) {
        const historicoResult = await getHistoricoPedidosById(1, 5, clienteId);
        //console.log(historicoResult, clienteId);

        if (historicoResult && historicoResult.total_pedidos_feitor > 0) {
          //console.log(historicoResult)

         /* historico = {
            historico_pedidos_com_itens: historicoResult.historico_pedidos_com_itens,
            total_pedidos_feitor: historicoResult.total_pedidos_feitor,
          };*/

          const historicoValidado = validarHistorico(historicoResult);

          if(historicoValidado.success){
            const HistoricoValidadoData = historicoValidado.data;

            historico = {
              historico_pedidos_com_itens: HistoricoValidadoData.historico_pedidos_com_itens, // Array de pedidos
              total_pedidos_feitor: HistoricoValidadoData.total_pedidos_feitor,
            };
          } else{
            console.log("Animal do krl");
            console.log(historicoValidado.error.message);
            historico = {
              historico_pedidos_com_itens: [], // Array de pedidos
              total_pedidos_feitor: 0,
            };
          }

        } else {
          historico = {
            historico_pedidos_com_itens: [],
            total_pedidos_feitor: 0,
          };
        }
      }
    } catch (error) {
      console.error(`Erro ao buscar histórico de pedidos: ${error}`);
      // Não retorna erro aqui, apenas log, pois o histórico é opcional
      historico = {
        historico_pedidos_com_itens: [],
        total_pedidos_feitor: 0,
      };
    }

   /* const pedidoComHistorico = {
      pedido: pedidoValidado,
      historico: historico,
    }*/

    //const dadosValidados = validatePedidoCompleto(pedidoComHistorico)

    // 3. Retornar a resposta final
      //console.log(`${pedido}${historico} testando no back`)
    return NextResponse.json(
      {
        pedido,
        historico
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na rota GET /pedidos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

  

export async function PATCH(
  request: Request
) {
  try {
    const url = new URL(request.url)
    const pedidoId = url.pathname.split('/').pop() // pega o último segmento

  if (!pedidoId) {
    return NextResponse.json({ message: 'ID do pedido é obrigatório' }, { status: 400 })
  }

    const id = pedidoId;
  

    // Validar o body da requisição
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.log("Erro ao validar body", error);
      return NextResponse.json(
        {
          message: "Formato do body inválido. JSON esperado.",
        },
        { status: 400 }
      );
    }

    const UpdateStatusSchema = z.object({
      status: z.string().min(1, "ID do status é obrigatório"),
   });

    // Validar os dados do body usando Zod
    const validationResult = UpdateStatusSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log("Validation Result errior")
      return NextResponse.json(
        {
          message: "Dados inválidos",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { status } = validationResult.data;

    // Tentar atualizar o status do pedido
    try {
      const resultado = await updateStatusPedido(id, status);

      if (resultado.success) {
        return NextResponse.json(
          {
            message: "Status do pedido atualizado com sucesso",
            data: resultado.data,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Erro ao atualizar status do pedido",
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      
      // Tratar erros específicos
      if (error instanceof Error) {
        if (error.message.includes("não encontrado")) {
          return NextResponse.json(
            {
              message: error.message,
            },
            { status: 404 }
          );
        }
      }

      return NextResponse.json(
        {
          message: "Erro interno do servidor ao atualizar pedido",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro na rota PATCH /pedidos:", error);
    return NextResponse.json(
      {
        message: "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}