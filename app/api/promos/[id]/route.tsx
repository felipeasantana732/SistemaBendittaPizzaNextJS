import { Promocao } from "@/types/Promocao";
import { itensCardapio } from "@/types/ItemCardapio";
import { NextResponse } from "next/server";
import { promos } from "@prisma/client";
import { itens_cardapio } from "@prisma/client";
import prismaSingleton from "@/lib/prisma";



//Rota Publica!

function formatarItemCardapio(item: itens_cardapio): itensCardapio {
  return {
    ...item,
    preco: item.preco?.toString() ?? null,
    preco_grande: item.preco_grande?.toString() ?? null,
    preco_individual: item.preco_individual?.toString() ?? null,
    ativo: item.ativo ?? null,
  };
}

export async function GET(request: Request) {
  
  const url = new URL(request.url)
  const id = url.pathname.split('/').pop() // pega o último segmento

  if (!id) {
    return NextResponse.json({ message: 'ID não fornecido corretamente' }, { status: 400 })
  }
  
  const promoID:string =  id ;
  try {
    const promocaoFromDB: promos | null = await prismaSingleton.promos.findUnique({
      where: {
        id: promoID,
      },
    });

    if (!promocaoFromDB) {
      return NextResponse.json(
        { message: "Nenhuma promoção encontrada com esse ID." },
        { status: 401 }
      );
    }

    const relacoesPromoItens = await prismaSingleton.itens_promo.findMany({
      where: {
        promo_id:  promoID ,
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

    const promoAPI: Promocao = {
      ...promocaoFromDB,
      preco_original: promocaoFromDB.preco_original?.toString() ?? null,
      preco_promo: promocaoFromDB.preco_promo?.toString() ?? null,
      itensCardapio: itensPorPromo[promocaoFromDB.id] || [],
    };

    return NextResponse.json({ promoAPI }, { status: 200 });

  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}
