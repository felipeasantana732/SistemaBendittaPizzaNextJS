import { notFound } from 'next/navigation';
import { ClienteAPI } from '@/app/types/Cliente';

interface ClientePageProps {
  params: {
    id: string;
  };
}

async function getClienteById(id: string): Promise<ClienteAPI | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Erro ao buscar cliente com ID ${id}:`, res.status);
      return null;
    }

    const data = await res.json();
    return data as ClienteAPI;
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    return null;
  }
}

export default async function ClientePage({ params }: ClientePageProps) {
  const cliente = await getClienteById(params.id);

  if (!cliente) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-4">Detalhes do Cliente</h1>

      <div className="space-y-4">
        <div>
          <strong>ID:</strong> {cliente.id}
        </div>
        <div>
          <strong>Nome:</strong> {cliente.nomeCliente ?? 'N/A'}
        </div>
        <div>
          <strong>Telefone:</strong> {cliente.telefoneCliente ?? 'N/A'}
        </div>
        <div>
          <strong>Endereço:</strong> {cliente.enderecoCliente ?? 'N/A'}
        </div>
        <div>
          <strong>Data de Cadastro:</strong> {new Date(cliente.created_at).toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  );
}
