import { Promocao } from "@/app/types/Promocao";
import { itensCardapio } from "@/app/types/ItemCardapio";
import { NextResponse } from "next/server";
import { promos } from "@prisma/client";
import { itens_cardapio } from "@prisma/client";
import prismaSingleton from "@/lib/prisma";

//Rota Publica!

// Função para formatar item_cardapio
function formatarItemCardapio(item: itens_cardapio): itensCardapio {
  return {
    ...item,
    preco: item.preco?.toString() ?? null,
    preco_grande: item.preco_grande?.toString() ?? null,
    preco_individual: item.preco_individual?.toString() ?? null,
    ativo: item.ativo ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  

  try {
    const promocoesFromDB: promos[] = await prismaSingleton.promos.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    if (!promocoesFromDB) {
      return NextResponse.json(
        { message: "Nenhuma promoção encontrada." },
        { status: 401 }
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
    const itensPorPromo: Record<string, itensCardapio[]> = {};

    for (const relacao of relacoesPromoItens) {
      const idPromo = relacao.promo_id;
      if (!itensPorPromo[idPromo]) {
        itensPorPromo[idPromo] = [];
      }

      const itemFormatado = formatarItemCardapio(relacao.itens_cardapio);
      itensPorPromo[idPromo].push(itemFormatado);
    }

    const promosAPI: Promocao[] = promocoesFromDB.map((promo) => ({
      ...promo,
      preco_original: promo.preco_original?.toString() ?? null,
      preco_promo: promo.preco_promo?.toString() ?? null,
      itensCardapio: itensPorPromo[promo.id] || [],
    }));

    return NextResponse.json({ promosAPI }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
