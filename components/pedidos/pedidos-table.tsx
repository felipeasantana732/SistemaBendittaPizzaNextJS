"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusSquare, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import  PedidoAPI  from "@/types/Zod/PedidoSchema"
import { z } from "zod"

type PedidoAPIType = z.infer<typeof PedidoAPI>

// Tipo para resposta paginada
interface PedidosPaginados {
  pedidos: PedidoAPIType[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

interface PedidosTableProps {
  initialData: PedidosPaginados
}

export default function PedidosTable({ initialData }: PedidosTableProps) {
  const router = useRouter()
  const [data, setData] = useState<PedidosPaginados>(initialData)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [numeroFilter, setNumeroFilter] = useState("")
  const [clienteFilter, setClienteFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar dados paginados
  const fetchPedidos = async (page: number = currentPage, limit: number = itemsPerPage) => {
    setIsRefreshing(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(numeroFilter && { numero: numeroFilter }),
        ...(clienteFilter && { cliente: clienteFilter }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/pedidos?${params}`)
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }
      const newData = await response.json()
      setData(newData)
      setCurrentPage(page)
    } catch (err) {
      console.error("Error fetching pedidos:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar pedidos")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Aplicar filtros (refetch com filtros)
  const applyFilters = () => {
    setCurrentPage(1) // Reset para primeira página
    fetchPedidos(1, itemsPerPage)
  }

  // Limpar filtros
  const clearFilters = () => {
    setNumeroFilter("")
    setClienteFilter("")
    setStatusFilter("")
    setCurrentPage(1)
    fetchPedidos(1, itemsPerPage)
  }

  // Mudança de página
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= data.pagination.totalPages) {
      fetchPedidos(newPage, itemsPerPage)
    }
  }

  // Mudança de itens por página
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
    fetchPedidos(1, newLimit)
  }

  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return 'N/A'
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch (e) {
      console.error("Erro ao formatar data:", e)
      return 'Data inválida'
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { variant: "secondary" as const, label: "Pendente" },
      processando: { variant: "default" as const, label: "Processando" },
      concluido: { variant: "outline" as const, label: "Concluído" },
      cancelado: { variant: "destructive" as const, label: "Cancelado" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button asChild size="lg" className="bg-green-500">
            <Link href="/admin/pedidos/add">
              <PlusSquare className="mr-2 h-5 w-5" />
              Novo Pedido
            </Link>
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          {data.pagination.totalItems} pedidos no total
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroFilter">Número do Pedido</Label>
              <Input
                id="numeroFilter"
                placeholder="Filtrar por número"
                value={numeroFilter}
                onChange={(e) => setNumeroFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clienteFilter">Cliente</Label>
              <Input
                id="clienteFilter"
                placeholder="Filtrar por cliente"
                value={clienteFilter}
                onChange={(e) => setClienteFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statusFilter">Status</Label>
              <select
                id="statusFilter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="processando">Processando</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button onClick={applyFilters} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Aplicar Filtros
            </Button>
            
            {(numeroFilter || clienteFilter || statusFilter) && (
              <Button variant="ghost" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controle de itens por página */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="itemsPerPage">Itens por página:</Label>
          <select
            id="itemsPerPage"
            className="px-3 py-1 border border-gray-300 rounded-md"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          Mostrando {((data.pagination.currentPage - 1) * data.pagination.itemsPerPage) + 1} a{' '}
          {Math.min(data.pagination.currentPage * data.pagination.itemsPerPage, data.pagination.totalItems)}{' '}
          de {data.pagination.totalItems} pedidos
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Data do Pedido</TableHead>
              <TableHead className="hidden lg:table-cell">Última Atualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pedidos.length > 0 ? (
              data.pedidos.map((pedido) => (
                <TableRow 
                  key={pedido.id}
                  onClick={() => router.push(`/admin/pedidos/show/${pedido.id}`)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell className="font-medium">
                    {pedido.id}
                  </TableCell>
                  <TableCell>{pedido.nomeCliente ?? 'N/A'}</TableCell>
                  <TableCell>{pedido.telefonePrincipal ?? 'N/A'}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(Number(pedido.valor) || 0)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(pedido.status || 'pendente')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(pedido.created_at)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatDate(pedido.last_att)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-gray-500">
                    <p className="text-lg mb-2">Nenhum pedido encontrado</p>
                    <p className="text-sm">
                      {numeroFilter || clienteFilter || statusFilter 
                        ? "Tente ajustar os filtros ou " 
                        : ""}
                      <Link 
                        href="/admin/pedidos/add" 
                        className="text-blue-600 hover:underline"
                      >
                        cadastre o primeiro pedido
                      </Link>
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(data.pagination.currentPage - 1)}
            disabled={!data.pagination.hasPrevPage || isRefreshing}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>
          
          <span className="text-sm text-gray-600 mx-4">
            Página {data.pagination.currentPage} de {data.pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(data.pagination.currentPage + 1)}
            disabled={!data.pagination.hasNextPage || isRefreshing}
          >
            Próxima
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Navegação rápida para páginas */}
        {data.pagination.totalPages > 1 && (
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === data.pagination.currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isRefreshing}
                >
                  {pageNum}
                </Button>
              )
            })}
            {data.pagination.totalPages > 5 && (
              <>
                <span className="text-gray-400">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(data.pagination.totalPages)}
                  disabled={isRefreshing}
                >
                  {data.pagination.totalPages}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}