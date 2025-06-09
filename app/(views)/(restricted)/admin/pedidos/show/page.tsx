import { getPedidosPaginados } from '@/lib/actions/pedidos'
import PedidosTable from '@/components/pedidos/pedidos-table'

interface PedidosPageProps {
  searchParams: {
    page?: string
    limit?: string
  }
}

export default async function PedidosPage({ searchParams }: PedidosPageProps) {
  // Pegar parâmetros da URL ou usar valores padrão
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10

  // Dados iniciais carregados no servidor (melhor performance)
  const pedidosData = await getPedidosPaginados(page, limit)
     
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
      </div>
             
      {/* Componente cliente que recebe dados paginados */}
      <PedidosTable initialData={pedidosData} />
    </div>
  )
}