import {  getPedidosPaginados } from "@/lib/actions/pedidos";
import { z } from "zod";
import PedidoAPI from "@/types/Zod/PedidoSchema";
import { NextResponse } from "next/server";

export const PaginacaoParams = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10), // máximo 100 por página
});

export const PedidosPaginados = z.object({
  pedidos: z.array(PedidoAPI),
  pagination: z.object({
    currentPage: z.number(),
    totalPages: z.number(),
    totalItems: z.number(),
    itemsPerPage: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
});

export type PedidosPaginadosType = z.infer<typeof PedidosPaginados>;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Validar parâmetros de paginação
    const { page, limit } = PaginacaoParams.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!page || !limit) {
      return NextResponse.json(
        { message: "Erro de paginação." },
        { status: 404 }
      );
    }

    const resultado = await getPedidosPaginados(page, limit);

    if (!resultado) {
      return NextResponse.json(
        { message: "Erro de ao Buscar pedidos." },
        { status: 200 }
      );
    }

    const resultadoValidado = PedidosPaginados.safeParse(resultado);

    if (!resultadoValidado.success) {
      return NextResponse.json(
        { message: `Erro de ao Buscar pedidos: ${resultadoValidado.error.message}`, },
        { status: 200 }
      );
    }

    return Response.json(resultadoValidado);
    
  } catch (error) {
    console.error("Erro na rota GET /pedidos:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
