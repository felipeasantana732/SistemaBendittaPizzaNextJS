export interface itens_promo{
    id_promo : string;
    id_item : string;
}

export interface itensCardapio {
    id : string ;
    nome : string,
    tipo : string,   // Tipos: "bebida", "pizza", "borda_recheada", "calzone"...
    tamanho : string | null ;    // Caso seja bebida
    preco : string | null ;// Caso seja bebida
    preco_grande : string | null ;   // Caso seja pizza ou borda
    preco_individual : string | null ;    // Caso seja pizza ou borda
    ativo : boolean | null;
    criado_em : Date | null; 
    categoria_pizza : string | null ;
}


 
  
