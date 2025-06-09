import { NextResponse } from "next/server";
import { promos, itens_cardapio } from "@prisma/client";
import prismaSingleton from "@/lib/prisma";
import { PromocaoSchema, ItensCardapio } from "@/types/Zod/ItemSchema";

// Função para formatar item_cardapio
function formatarItemCardapio(item: itens_cardapio): ItensCardapio {
  return {
    ...item,
    preco: item.preco?.toString() ?? null,
    preco_grande: item.preco_grande?.toString() ?? null,
    criado_em: item.criado_em?.toString() ?? null,
    preco_individual: item.preco_individual?.toString() ?? null,
    ativo: item.ativo ?? null,
  };
}

export async function GET() {
  try {
    const promocoesFromDB: promos[] = await prismaSingleton.promos.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    if (!promocoesFromDB.length) {
      return NextResponse.json(
        { message: "Nenhuma promoção encontrada." },
        { status: 404 }
      );
    }

    const promoIDs = promocoesFromDB.map((promo) => promo.id);

    const relacoesPromoItens = await prismaSingleton.itens_promo.findMany({
      where: {
        promo_id: { in: promoIDs },
      },
      include: {
        itens_cardapio: true,
      },
    });

    // Agrupa os itens por promoção
    const itensPorPromo: Record<string, ItensCardapio[]> = {};

    for (const relacao of relacoesPromoItens) {
      const idPromo = relacao.promo_id;
      if (!itensPorPromo[idPromo]) {
        itensPorPromo[idPromo] = [];
      }
      const itemFormatado = formatarItemCardapio(relacao.itens_cardapio);
      itensPorPromo[idPromo].push(itemFormatado);
    }

    // Formata as promoções
    const promosAPI: PromocaoSchema[] = promocoesFromDB.map((promo) => ({
      ...promo,
      created_at: promo.created_at?.toString() ?? null,
      expiration_date: promo.expiration_date?.toString() ?? null,
      preco_original: promo.preco_original?.toString() ?? null,
      preco_promo: promo.preco_promo?.toString() ?? null,
      itensCardapio: itensPorPromo[promo.id] || [],
    }));

    // Busca todas as relações categoria <-> promo
    const relacoesCategoriaPromo = await prismaSingleton.relacao_categoria_promo.findMany({
      where: {
        promo_id: { in: promoIDs },
      },
      include: {
        categorias_promo: true,
      },
    });

    // Agrupa as promoções por categoria
    const categoriasComPromocoes: Record<string, {
      id: string;
      nome: string | null;
      descricao: string | null;
      rank: number | null;
      promocoes: PromocaoSchema[];
    }> = {};

    for (const relacao of relacoesCategoriaPromo) {
      const categoria = relacao.categorias_promo;
      const categoriaID = categoria.id;

      if (!categoriasComPromocoes[categoriaID]) {
        categoriasComPromocoes[categoriaID] = {
          id: categoriaID,
          nome: categoria.nome ?? null,
          descricao: categoria.descricao ?? null,
          rank: categoria.rank ?? null,
          promocoes: [],
        };
      }

      const promocao = promosAPI.find((p) => p.id === relacao.promo_id);
      if (promocao) {
        categoriasComPromocoes[categoriaID].promocoes.push(promocao);
      }
    }

    return NextResponse.json({ categorias: categoriasComPromocoes }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
