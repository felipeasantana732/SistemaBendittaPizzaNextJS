import { z } from "zod";
import { borda_recehada_fromDb, HistoricoSchema } from "./HistoricoSchema";



// Item do cardapio
const ItemCardapioFrontSchema = z
  .object({
    tipo: z.string(),
    nome: z.string(),
    preco: z.coerce.number().nullable(),
    preco_grande: z.coerce.number().nullable(),
    preco_individual: z.coerce.number().nullable(),
    tamanho: z.coerce.string().nullable(),
    categoria_pizza: z.string().nullable(),
  })
  .nullable();

// Item de promoção (apenas para o front)
const ItemPromoFrontSchema = z.object({
  item_cardapio: ItemCardapioFrontSchema,
});

// Parte do item do pedido (apenas campos necessários no front)
const ParteItemFrontSchema = z.object({
  id: z.coerce.string(),
  tipo_parte: z.coerce.string(),
  posicao: z.coerce.string().nullable(),
  preco_parte: z.coerce.number(),
  item_cardapio: ItemCardapioFrontSchema,
});

// Item do pedido (apenas dados para o front)
const ItemPedidoFrontSchema = z.object({
  id: z.coerce.string(),
  created_at: z.coerce.string(), // ISO string
  last_update: z.coerce.string().nullable(), // ISO string
  quantidade: z.coerce.number(),
  preco_item: z.coerce.number(),
  observacao: z.coerce.string().nullable(),
  borda: borda_recehada_fromDb.nullable(),

  // Dados de promoção (quando aplicável)
  id_promo: z.coerce.string().nullable(),
  nome: z.coerce.string().nullable(), // nome da promo
  expiration_date: z.coerce.string().nullable(), // ISO string
  active: z.coerce.boolean().nullable(),
  preco_original: z.coerce.number().nullable(),
  preco_promos: z.coerce.number().nullable(),
  itens_promo: z.array(ItemPromoFrontSchema).nullable(),

  // Partes do item (pizza meio a meio, etc.)
  partes: z.array(ParteItemFrontSchema).nullable(),
});

// Cliente (apenas dados necessários no front)
const ClienteFrontSchema = z.object({
  id: z.coerce.string().nullable(),
  nomeCliente: z.coerce.string().nullable(),
  email: z.coerce.string().nullable(),
  endereco: z.coerce.string().nullable(),
  ponto_referencia: z.coerce.string().nullable(),
  telefones: z.array(z.coerce.string()).nullable(), // array de números
});

// Schema principal - Pedido para o front-end
export const PedidoFrontSchema = z.object({
  id: z.coerce.string(),
  created_at: z.coerce.string(), // ISO string
  last_att: z.coerce.string().nullable(), // ISO string
  status: z.coerce.string(), // nome do status
  statusId: z.coerce.string(),
  valor:  z.coerce.number(), // valor_pedido
  desconto: z.coerce.number(),
  taxa_entrega: z.coerce.number(),
  cliente: ClienteFrontSchema,
  itens: z.array(ItemPedidoFrontSchema),
});


export const PedidoFrontCompletoSchema = z.object({
  pedido: PedidoFrontSchema,
  historico: HistoricoSchema,
})

export type PedidoFrontCompletoSchemaType = z.infer<typeof PedidoFrontCompletoSchema>; // Validação para receber da api /pedidos/[id] recebendo pedido e historico

// Tipos TypeScript para usar no seu código
export type PedidoFront = z.infer<typeof PedidoFrontSchema>;
export type ItemPedidoFront = z.infer<typeof ItemPedidoFrontSchema>;
export type ClienteFront = z.infer<typeof ClienteFrontSchema>;
export type ParteItemFront = z.infer<typeof ParteItemFrontSchema>;
export type ItemCardapioFront = z.infer<typeof ItemCardapioFrontSchema>;
export type BordaRecheadaType = z.infer<typeof borda_recehada_fromDb>;
export type ItemPromoFrontType= z.infer<typeof ItemPromoFrontSchema>;

// Função para validar o pedido antes de enviar pro front
export function validatePedidoFront(data: unknown): PedidoFront {
  try{
  return PedidoFrontSchema.parse(data);
  }catch(e){
    console.log('Erro de Validação', e);
    throw new Error('Dados Inválidos.');
  }
}
export function validatePedidoCompleto(data: unknown): PedidoFrontCompletoSchemaType {
  try{
  return PedidoFrontCompletoSchema.parse(data);
  }catch(e){
    console.log('Erro de Validação', e);
    throw new Error('Dados Inválidos.');
  }
}

// Validação segura (não lança erro)
export function safeParsePedidoFront(data: unknown) {
  return PedidoFrontSchema.safeParse(data);
}
