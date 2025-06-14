import prisma from "@/lib/prisma";
import {
  HistoricoSchemaType,
  validarHistorico,
} from "@/types/Zod/HistoricoSchema";
//import {itensPorPedidoHistoricoType,safeParseItensPedidoHistorico,} from "@/types/Zod/HistoricoSchema";

export async function getPedidos() {
  try {
    const data = await prisma.pedido.findMany({
      include: {
        clientes_benditta: {
          select: {
            nomeCliente: true,
          },
        },
        telefone_cliente: {
          select: {
            numero_telefone: true,
          },
          where: {
            principal: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return data;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw new Error("Erro ao carregar pedidos");
  }
}

export async function getPedidosPaginados(
  page: number = 1,
  limit: number = 10
) {
  try {
    const skip = (page - 1) * limit;

    // Buscar o total de registros
    const totalItems = await prisma.pedido.count();

    // Buscar os pedidos da página atual
    const pedidos = await prisma.pedido.findMany({
      select: {
        id: true,
        created_at: true,
        last_update: true,
        valor_pedido: true,
        status_pedido: {
          select: {
            nome: true,
          },
        },
        clientes_benditta: {
          select: {
            nomeCliente: true,
          },
        },
        telefone_cliente: {
          select: {
            numero_telefone: true,
          },
          where: {
            principal: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      skip: skip,
      take: limit,
    });

    // Calcular informações de paginação
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Transformar os dados
    const pedidosTransformados = pedidos.map((pedido) => ({
      id: pedido.id,
      nomeCliente: pedido.clientes_benditta?.nomeCliente || null,
      telefonePrincipal: pedido.telefone_cliente?.numero_telefone || null,
      created_at: pedido.created_at.toISOString(),
      last_att: pedido.last_update?.toISOString() ?? null,
      status: pedido.status_pedido?.nome ?? null,
      valor: pedido.valor_pedido.toNumber(),
    }));

    return {
      pedidos: pedidosTransformados,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar pedidos paginados:", error);
    throw new Error("Erro ao carregar pedidos");
  }
}

export async function getHistoricoPedidosById(
  page: number = 1,
  limit: number = 5,
  id: string
) {
  try {
    const skip = (page - 1) * limit;

    const totalItems = await prisma.pedido.count({
      where: { id_cliente: id },
    });

    const pedidos = await prisma.pedido.findMany({
      where: { id_cliente: id },
      select: {
        id: true,
        created_at: true,
        last_update: true,
        valor_pedido: true,
        status_pedido: {
          select: {
            nome: true,
          },
        },
        clientes_benditta: {
          select: {
            nomeCliente: true,
          },
        },
        telefone_cliente: {
          select: {
            numero_telefone: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      skip: skip,
      take: limit,
    });

    const pedidosTransformados = await Promise.all(
      pedidos.map(async (pedido) => {
        // Buscar os itens específicos deste pedido
        const itensPorPedido = await prisma.item_pedido.findMany({
          where: { id_pedido: pedido.id }, // Assumindo que existe uma FK pedido_id
          select: {
            preco_item: true,
            quantidade: true,
            observacao: true,
            borda_recheada: true,
            item_pedido_partes: {
              select: {
                itens_cardapio: {
                  select: {
                    nome: true,
                  },
                },
              },
            },
            promos: {
              select: {
                nome: true,
                itens_promo: {
                  select: {
                    itens_cardapio: {
                      select: {
                        nome: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { last_update: "desc" },
        });

        //console.log(JSON.stringify(itensPorPedido, null, 2));

        return {

          id: pedido.id,
          nomeCliente: pedido.clientes_benditta?.nomeCliente || null,
          telefonePrincipal: pedido.telefone_cliente?.numero_telefone || null,
          created_at: pedido.created_at.toISOString(),
          last_att: pedido.last_update?.toISOString() ?? null,
          status: pedido.status_pedido?.nome ?? "",
          valor: pedido.valor_pedido.toNumber(),
          itensDoPedido: itensPorPedido.map((item) => {
            return {
              quantidade: item.quantidade,
              preco_item: item.preco_item.toNumber(), // Convertendo Decimal para number
              observacao: item.observacao,
              borda_recheada: item.borda_recheada
                ? {
                    id: item.borda_recheada.id,
                    nome: item.borda_recheada.nome,
                    preco_grande:
                      item.borda_recheada.preco_grande?.toNumber() || 0, // Convertendo Decimal para number
                    preco_individual:
                      item.borda_recheada.preco_individual?.toNumber() || 0, // Convertendo Decimal para number
                  }
                : null,
              // Ajustado nome da propriedade
              item_pedido_partes:
                item.item_pedido_partes?.map((parte) => ({
                  itens_cardapio: parte.itens_cardapio
                    ? {
                        nome: parte.itens_cardapio.nome ?? null,
                      }
                    : null,
                })) || [],
              promos: item.promos
                ? {
                    nome: item.promos.nome,
                    itens_promo:
                      item.promos.itens_promo?.map((itemPromo) => ({
                        itens_cardapio: {
                          nome: itemPromo.itens_cardapio.nome ?? null,
                        },
                      })) || [],
                  }
                : null,
            };
          }),
        };
      })
    );

    const historicoValidadoAntesDeMandarProGet: HistoricoSchemaType = {
      historico_pedidos_com_itens: pedidosTransformados,
      total_pedidos_feitor: totalItems,
    };

    const historicoValidadoAntesDeMandarProGetParseados = validarHistorico(
      historicoValidadoAntesDeMandarProGet
    );

    if (!historicoValidadoAntesDeMandarProGetParseados.success) {
      console.log(
        "KRLLLLLLLL",
        historicoValidadoAntesDeMandarProGetParseados.error
      );
      return {
        historico_pedidos_com_itens: [],
        total_pedidos_feitor: totalItems,
      };
    }

    return historicoValidadoAntesDeMandarProGetParseados.data;
  } catch (error) {
    console.error("Erro ao buscar pedidos paginados:", error);
    throw new Error("Erro ao carregar pedidos");
  }
}

export async function getPedidoById(id: string) {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        clientes_benditta: {
          select: {
            id: true,
            nomeCliente: true,
            email: true,
          },
        },
        status_pedido: {
          select: { 
            id: true,
            nome: true },
        },
        endereco_cliente: {
          select: { endereco: true, ponto_referencia: true },
        },
        telefone_cliente: {
          // Talvez não precise se já vai buscar separado
          select: { numero_telefone: true },
        },
        item_pedido: {
          include: {
            borda_recheada: true,
            item_pedido_partes: {
              include: {
                itens_cardapio: true,
              },
            },
            promos: {
              include: {
                itens_promo: {
                  include: {
                    itens_cardapio: {
                      select: {
                        tipo: true,
                        nome: true,
                        preco: true,
                        preco_grande: true,
                        preco_individual: true,
                        tamanho: true,
                        categoria_pizza: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { created_at: "asc" },
        },
      },
    });

    if (!pedido) {
      return null;
    }

    const idCliente = pedido.clientes_benditta?.id;

    let telefones_cliente: { numero_telefone: string | null }[] = [];

    if (idCliente) {
      telefones_cliente = await prisma.telefone_cliente.findMany({
        where: { cliente_id: idCliente },
        select: { numero_telefone: true },
      });
    } else {
      console.warn("Cliente não informado no pedido:", pedido.id);
    }

    return {
      id: pedido.id,
      created_at: pedido.created_at.toISOString(),
      last_att: pedido.last_update?.toISOString() ?? null,
      status: pedido.status_pedido?.nome ?? null,
      statusId: pedido.status_pedido?.id ?? null,
      valor: pedido.valor_pedido,
      desconto: pedido.desconto,
      taxa_entrega: pedido.taxa_entrega,
      cliente: {
        id: pedido.clientes_benditta?.id ?? null,
        nomeCliente: pedido.clientes_benditta?.nomeCliente ?? null,
        email: pedido.clientes_benditta?.email ?? null,
        endereco: pedido.endereco_cliente?.endereco ?? null,
        ponto_referencia: pedido.endereco_cliente?.ponto_referencia ?? null,
        telefones: telefones_cliente.map((tel) => tel.numero_telefone),
      },
      itens: pedido.item_pedido.map((item) => ({
        id: item.id,
        created_at: item.created_at.toISOString(),
        last_update: item.last_update?.toISOString() ?? null,
        quantidade: item.quantidade,
        preco_item: item.preco_item,
        observacao: item.observacao,
        borda: item.borda_recheada,
        id_promo: item.promos?.id ?? null,
        nome: item.promos?.nome ?? null,
        expiration_date: item.promos?.expiration_date?.toISOString() ?? null,
        active: item.promos?.active ?? null,
        preco_original: item.promos?.preco_original ?? null,
        preco_promos: item.promos?.preco_promo ?? null,
        itens_promo:
          item.promos?.itens_promo.map((itemPromo) => ({
            item_cardapio: itemPromo.itens_cardapio
              ? {
                  tipo: itemPromo.itens_cardapio.tipo,
                  nome: itemPromo.itens_cardapio.nome,
                  preco: itemPromo.itens_cardapio.preco,
                  preco_grande: itemPromo.itens_cardapio.preco_grande,
                  preco_individual: itemPromo.itens_cardapio.preco_individual,
                  tamanho: itemPromo.itens_cardapio.tamanho,
                  categoria_pizza: itemPromo.itens_cardapio.categoria_pizza,
                }
              : null,
          })) ?? [],
        partes: item.item_pedido_partes.map((parte) => ({
          id: parte.id,
          tipo_parte: parte.tipo_parte,
          posicao: parte.posicao,
          preco_parte: parte.preco_parte,
          item_cardapio: parte.itens_cardapio
            ? {
                tipo: parte.itens_cardapio.tipo,
                nome: parte.itens_cardapio.nome,
                preco: parte.itens_cardapio.preco,
                preco_grande: parte.itens_cardapio.preco_grande,
                preco_individual: parte.itens_cardapio.preco_individual,
                tamanho: parte.itens_cardapio.tamanho,
                categoria_pizza: parte.itens_cardapio.categoria_pizza,
              }
            : null,
        })),
      })),
    };
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    throw error;
  }
}



export async function updateStatusPedido(
  id: string, 
  novoStatusId: string
) {
  try {
    // Verificar se o pedido existe
    const pedidoExistente = await prisma.pedido.findUnique({
      where: { id },
      select: { id: true, status_pedido: { select: { nome: true } } }
    });

    if (!pedidoExistente) {
      throw new Error(`Pedido com ID ${id} não encontrado`);
    }

    // Verificar se o status existe
    const statusExistente = await prisma.status_pedido.findUnique({
      where: { id: novoStatusId },
      select: { id: true, nome: true }
    });

    if (!statusExistente) {
      throw new Error(`Status com ID ${novoStatusId} não encontrado`);
    }

    // Atualizar o pedido
    const pedidoAtualizado = await prisma.pedido.update({
      where: { id },
      data: {
        id_status: novoStatusId,
        last_update: new Date(),
      },
      select: {
        id: true,
        last_update: true,
        status_pedido: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    return {
      success: true,
      data: {
        id: pedidoAtualizado.id,
        last_update: pedidoAtualizado.last_update?.toISOString(),
        status: {
          id: pedidoAtualizado.status_pedido?.id,
          nome: pedidoAtualizado.status_pedido?.nome,
        },
      },
    };
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    throw error;
  }
}