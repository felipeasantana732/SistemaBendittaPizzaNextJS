import z from "zod";

export const itens_cardapio = z.object({
  nome: z.string().nullable(),
});

export const item_pedido_partes = z.object({
  itens_cardapio: z.array(itens_cardapio).max(2).nullable(),
});

export const borda_recehada_fromDb = z.object({
  id: z.string(),
  nome: z.string(),
  preco_grande: z.coerce.number(),
  preco_individual: z.coerce.number(),
});

export const promos = z.object({
  nome: z.string(),
  itens_promo: z.array(itens_cardapio),
});

export const ItemHistoricoSchema = z.object({
  preco_item: z.coerce.number(),
  quantidade: z.number(),

  observacao: z.string().nullable(),
  borda_recheada: borda_recehada_fromDb.nullable(),
  item_pedido_partes: z.array(z.object({
    itens_cardapio:  z.object({
        nome: z.string(),
    }).nullable(),
  })),
  promos: z.object({
    nome: z.string(),
    itens_promo: z.array(z.object({
        itens_cardapio:  z.object({
                 nome: z.string().nullable(),
        })
    })),
  }).nullable(),
});

// Schema para item do pedido
export const PedidoHistoricoSchema = z.object({
  id: z.string(),
  nomeCliente: z.string().nullable(),
  telefonePrincipal: z.coerce.string().nullable(),
  created_at: z.coerce.string(),
  last_att: z.coerce.string().nullable(),
  status: z.string(),
  valor: z.coerce.number(),
  itensDoPedido: z.array(ItemHistoricoSchema)
});

export const HistoricoSchema = z.object({
  historico_pedidos_com_itens: z.array(PedidoHistoricoSchema),
  total_pedidos_feitor: z.number(),
});

export type HistoricoSchemaType = z.infer< typeof HistoricoSchema >;
export type PedidoHistorico = z.infer< typeof PedidoHistoricoSchema >;
export type ItemHistorico = z.infer< typeof ItemHistoricoSchema >;

export function validarHistorico(data: unknown) {
            const ParsedData = HistoricoSchema.safeParse(data);
     return ParsedData
  }
