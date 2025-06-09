import z from "zod"

const PedidoAPI = z.object({
    id: z.string(),
    nomeCliente: z.string().nullable(),
    telefonePrincipal: z.string().nullable(),
    created_at: z.coerce.string(),
    last_att: z.coerce.string().nullable(),
    status : z.string().nullable(),   
    valor : z.number().nullable(),     
});

export default PedidoAPI;
export type PedidoApiType = z.infer<typeof PedidoAPI>;

export const HistoricoPedidos = z.object({
  pedidos: z.array(PedidoAPI)
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
  })
})



export type HistoricoPedidosType = z.infer<typeof HistoricoPedidos>; 

// Função corrigida para validar o histórico antes de enviar pro front
export function validateHistoricoFront(data: unknown): HistoricoPedidosType {
    const validados = HistoricoPedidos.safeParse(data);
    
    if (validados.success) {
        return validados.data; // Retorna apenas os dados validados
    }
    
    // Se a validação falhar, lança um erro ou retorna um valor padrão
    throw new Error(`Erro ao validar dados do histórico: ${validados.error.message}`);
}

// Alternativa: função que retorna null em caso de erro (mais segura)
export function validateHistoricoFrontSafe(data: unknown): HistoricoPedidosType | null {
    const validados = HistoricoPedidos.safeParse(data);
    
    if (validados.success) {
        return validados.data;
    }
    
    console.error(`Erro ao validar dados do histórico: ${validados.error.message}`);
    return null;
}