import prisma from "@/lib/prisma";

export async function getClientesPaginados(
  page: number = 1,
  limit: number = 10
) {
  try {
    const skip = (page - 1) * limit;

    // Buscar o total de clientes
    const totalItems = await prisma.clientes_benditta.count();

    // Buscar os pedidos da página atual
    const clientes = await prisma.clientes_benditta.findMany({
      select: {
        id: true,
        created_at: true,
        nomeCliente: true,
        created_by: true,
        
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

    const clientesValidados = validarClienteFromList();





    // Transformar os dados
    return {
      clientes: clientes,
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