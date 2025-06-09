import z from "zod"

const userDetail = z.object({
    id: z.string(),
    created_at: z.coerce.string(),
    nomeCliente: z.string().nullable(),
    telefoneCliente : z.string().nullable(),   
    idMensagem : z.string().nullable(),    
    sesionID : z.string().nullable(),
    enderecoCliente: z.string().nullable(),  
});

export default userDetail;
