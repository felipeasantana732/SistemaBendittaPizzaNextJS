export interface ClienteAPI {
  id: string; 
  created_at: Date; 
  nomeCliente: string | null;
  telefoneCliente: string | null;
  enderecoCliente: string | null;
  idMensagem: string | null;
  sesionID: string | null;
}
