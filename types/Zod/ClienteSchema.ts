import z from "zod";


export const clienteFront = z.object({
    id: z.string(),
    created_at: z.string(),
    nomeCliente: z.string().nullable(),
    telefone_cliente: z.array(z.object({
        numero_telefone: z.string().nullable()
    })).nullable(),
});

export type clienteFrontSchema = z.infer< typeof clienteFront >;

export function validarClienteFromList(data: unknown) {
            const ParsedData = clienteFront.safeParse(data);
     return ParsedData
  }