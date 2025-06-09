import {z} from 'zod';

const itensCardapio = z.object({
    id: z.string(),
    nome: z.string(),
    tipo : z.string(),   // Tipos: "bebida", "pizza", "borda_recheada", "calzone"...
    tamanho : z.string().nullable(),    // Caso seja bebida
    preco : z.string().nullable(),// Caso seja bebida
    preco_grande : z.string().nullable(),  // Caso seja pizza ou borda
    preco_individual : z.string().nullable(),   // Caso seja pizza ou borda
    ativo : z.boolean().nullable(),
    criado_em : z.string().nullable(),
    categoria_pizza : z.string().nullable(),
});

const PromocaoSchema = z.object({
    id: z.string(),
    nome: z.string(),
    descricao: z.string().nullable(),
    imagem_url: z.string().nullable(),
    image_url_small: z.string().nullable(),
    created_at: z.string().nullable(),
    expiration_date: z.string().nullable(),
    active : z.boolean().nullable(), 
    preco_original: z.string().nullable(),
    preco_promo: z.string().nullable(),
    pessoas: z.string().nullable(),
    itensCardapio : z.array(itensCardapio).nullable(),
});

const CatPromoSchema = z.object({
    id: z.string(),
    nome: z.string().nullable(),
    descricao: z.string().nullable(),
    rank: z.number().int().min(1).max(20).nullable(),
    promocoes: z.array(PromocaoSchema).nullable(),
});

export default CatPromoSchema;

export type ItensCardapio = z.infer<typeof itensCardapio>;
export type PromocaoSchema = z.infer<typeof PromocaoSchema>;
export type CategoriaPromoSchema = z.infer<typeof CatPromoSchema>;