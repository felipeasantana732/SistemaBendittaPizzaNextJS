import { itensCardapio } from "./ItemCardapio";

export interface Promocao {
    id: string ,
    nome: string , 
    descricao: string | null,
    imagem_url: string | null,
    created_at: Date ,
    expiration_date:Date | null,
    active : boolean | null,
    preco_original: string | null ,
    preco_promo: string | null,
    itensCardapio : itensCardapio[];
  }

  export interface Promotion{
    id: string,
    title: string | null,
    description: string | null,
    image: string | null,
    originalPrice: string | null,
    discountedPrice: string | null,
  }