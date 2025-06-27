"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Phone, MapPin, Clock, Package, CheckCircle, XCircle, Truck, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import useToast from "react-hook-toast"

import {ClienteFront, ItemPedidoFront, PedidoFrontCompletoSchemaType, validatePedidoCompleto} from "../../types/Zod/PedidoDetalheSchema"
import { HistoricoSchemaType, ItemHistorico } from "@/types/Zod/HistoricoSchema"

const statusOptions = [
  { value: "preparando", label: "Preparando", icon: Clock, color: "bg-yellow-500", id:"03ef1cd1-cdd3-4892-b4d6-046d9683f420" },
  { value: "cancelado", label: "Cancelado", icon: XCircle, color: "bg-red-500", id: "0c6ab690-ff1b-42d5-86d5-e3ca0110c81f"},
  { value: "pronto", label: "Pronto", icon: CheckCircle, color: "bg-green-500", id: "ae536a57-3cd0-46a9-bf1c-5b50277ffc61" },
  { value: "entregue", label: "Entregue", icon: Package, color: "bg-blue-500", id: "6920dbba-453c-4bac-93ad-ff5eeca73fae" },
  { value: "em-rota", label: "Em rota", icon: Truck, color: "bg-purple-500", id: "64316b1f-d5b1-40d0-9fac-55b35e747894" },
  { value: "aguardando-retirada", label: "Aguardando retirada", icon: AlertCircle, color: "bg-orange-500", id: "467cb5a1-c93a-41a7-b5c7-d3ce05f8f764" },
]

function ClienteInfo({ cliente }: { cliente: ClienteFront }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Informações do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{cliente.nomeCliente}</h3>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="h-4 w-4" />
          {cliente.telefones && cliente.telefones.length > 0 ? (
            <span>{cliente.telefones[0]}</span>
          ) : (
            <span>Sem telefone cadastrado</span>
          )}
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5" />
          <div>
            <div>{cliente.endereco}</div>
            {cliente.ponto_referencia && (
              <div className="text-sm text-muted-foreground">Referência: {cliente.ponto_referencia}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PedidoItem({ item }: { item: ItemPedidoFront }) {
  // Determina o nome do item baseado nas partes
  const getNomeItem = () => {
    if (!item.partes || item.partes.length === 0) return item.nome || "Item sem nome";

    const tipoParte = item.partes[0]?.tipo_parte

    if (tipoParte?.includes("pizza")) {
      const tamanho = tipoParte.includes("grande")
        ? "Pizza Grande"
        : tipoParte.includes("individual")
          ? "Pizza Individual"
          : "Pizza"
      return tamanho
    }

    return item.partes[0]?.item_cardapio?.nome || "Item sem nome"
  }

  // Extrai os sabores das partes
  const getSabores = () => {
    if (!item.partes && !item.itens_promo) {
      return []
    }
    
    if (item.partes && item.partes.length > 0) {
      return item.partes.map((parte) => parte.item_cardapio?.nome).filter(Boolean)
    } 
    
    if (item.itens_promo && item.itens_promo.length > 0) {
      return item.itens_promo.map((saborPromo) => saborPromo.item_cardapio?.nome).filter(Boolean)
    }
    
    return []
  }

  const getSaboresPromos = () => {
    if (!item.itens_promo || item.itens_promo.length === 0) {
      return [];
    }
    return item.itens_promo.map((itemPromo) => itemPromo.item_cardapio?.nome).filter(Boolean)
  }

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium">
            {item.quantidade}x {getNomeItem()}
          </h4>

          {item.observacao && (
            <div className="text-sm text-muted-foreground mt-1">
              <strong>Observação:</strong> {item.observacao}
            </div>
          )}

          {item.borda && (
            <div className="text-sm text-muted-foreground">
              <strong>Borda:</strong> {item.borda.nome}
              {(item.borda.preco_grande > 0 || item.borda.preco_individual > 0) &&
                ` (+R$ ${(item.borda.preco_grande || item.borda.preco_individual).toFixed(2)})`}
            </div>
          )}

          {getSabores().length > 0 && (
            <div className="text-sm text-muted-foreground">
              <strong>Sabor{getSabores().length > 1 ? "es" : ""}:</strong> {getSabores().join(" + ")}
            </div>
          )}

          {getSaboresPromos().length > 0 && (
            <div className="text-sm text-muted-foreground">
              <strong>Promoção:</strong> {item.nome}
              <div className="ml-2">
                {getSaboresPromos().map((itemPromo, index) => (
                  <div key={index}>• {itemPromo || "Item da promoção"}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <span className="font-medium">R$ {item.preco_item.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function HistoricoPedidos({ historico }: { historico: HistoricoSchemaType }) {
  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find((s) => s.value === status.toLowerCase().replace(" ", "-"))
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>

    const Icon = statusConfig.icon
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    )
  }

  // Função para resumir os itens do pedido histórico
  const resumirItens = (itens: ItemHistorico[]) => {
    return itens.map((item) => {
      let nome = "Item sem nome"

      // Verifica se é uma promoção
      if (item.promos) {
        nome = item.promos.nome
      }
      // Verifica se tem partes (pizza)
      else if (item.item_pedido_partes && item.item_pedido_partes.length > 0) {
        nome = item.item_pedido_partes.map((parte) => parte.itens_cardapio?.nome).filter(Boolean).join(" + ")
      }

      return `${nome} (${item.quantidade})`
    }).join(", ")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data e Hora</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Itens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historico?.historico_pedidos_com_itens?.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{format(new Date(pedido.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>{getStatusBadge(pedido.status)}</TableCell>
                <TableCell>{resumirItens(pedido.itensDoPedido)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function StatusControl({
  currentStatus,
  onStatusChange,
  isUpdating,
}: {
  currentStatus: string
  onStatusChange: (newStatus: string, statusId: string) => void
  isUpdating: boolean
}) {
  // Normaliza o status atual para corresponder aos valores do select
  const normalizedStatus = currentStatus.toLowerCase().replace(" ", "-")
  const currentStatusConfig = statusOptions.find((s) => s.value === normalizedStatus) || {
    value: normalizedStatus,
    label: currentStatus,
    icon: Clock,
    color: "bg-gray-500",
    id: ""
  }

  const CurrentIcon = currentStatusConfig.icon

  const handleStatusChange = (newStatus: string) => {
    const statusConfig = statusOptions.find((s) => s.value === newStatus)
    if (statusConfig) {
      onStatusChange(newStatus, statusConfig.id)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${currentStatusConfig.color}`} />
        <span className="font-medium">Status atual:</span>
        <Badge variant="outline" className="flex items-center gap-1">
          <CurrentIcon className="h-3 w-3" />
          {currentStatusConfig.label}
        </Badge>
      </div>

      <Select value={normalizedStatus} onValueChange={handleStatusChange} disabled={isUpdating}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Alterar status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => {
            const Icon = status.icon
            return (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.color}`} />
                  <Icon className="h-4 w-4" />
                  {status.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

function PedidoSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-48" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function PedidoPage() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const [data, setData] = useState<PedidoFrontCompletoSchemaType | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true)
        setError(null)

        const pedidoID = params.id as string;
        console.log('Buscando pedido ID:', pedidoID)

        const response = await fetch(`/api/pedidos/${pedidoID}`)

        if (!response.ok) {
          throw new Error("Pedido não encontrado")
        }

        const responseData = await response.json()
        console.log("Dados recebidos da API:", responseData)

        try {
          const dataValidada = validatePedidoCompleto(responseData);
          console.log("Dados validados:", dataValidada)
          setData(dataValidada)
        } catch (validationError) {
          console.error("Erro na validação:", validationError)
          throw new Error("Dados do pedido inválidos")
        }

      } catch (err) {
        console.error("Erro ao buscar pedido:", err)
        const errorMessage = err instanceof Error ? err.message : "Erro ao carregar pedido"
        setError(errorMessage)
        
        // Toast com tratamento de erro mais seguro
        try {
          toast({
            title: "Não foi possível carregar os dados do pedido",
            type: "error",
            interval: 10
          })
        } catch (toastError) {
          console.error("Erro no toast:", toastError)
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPedido()
    } else {
      setLoading(false)
      setError("ID do pedido não encontrado")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]) // Removido toast das dependências dando loop
  

  const handleStatusChange = async (newStatus: string, statusId: string) => {
    if (!data?.pedido) return

    // Converte o valor do select para o formato esperado pela API
    const statusFormatado = newStatus
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    // Verifica se o pedido tem statusId ou usa status string
    const currentStatusId = data.pedido.statusId || data.pedido.status
    if (statusId === currentStatusId) return

    try {
      setUpdatingStatus(true)
      const response = await fetch(`/api/pedidos/${data.pedido.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: statusId }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar status")
      }

      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          pedido: {
            ...prev.pedido,
            status: statusFormatado,
            statusId: statusId // Atualiza o statusId se existir
          },
        }
      })

      toast({
        type: "success",
        title: `Pedido alterado para: ${statusOptions.find((s) => s.value === newStatus)?.label}`
      })
    } catch (err) {
      console.error("Erro ao atualizar status:", err)
      toast({
        type: "error",
        title: "Não foi possível atualizar o status do pedido",
        interval: 20,
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Debug dos estados
  useEffect(() => {
    console.log("Estados - Loading:", loading, "Data:", !!data, "Error:", error)
  }, [loading, data, error])

  if (loading) {
    return <PedidoSkeleton />
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Pedido não encontrado</h2>
          <p className="text-muted-foreground mb-4">{error || "O pedido solicitado não existe ou foi removido."}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const { pedido, historico } = data

  if (!pedido || !historico) {
    console.error("Dados incompletos - Pedido:", !!pedido, "Histórico:", !!historico)
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Dados incompletos</h2>
          <p className="text-muted-foreground mb-4">Os dados do pedido estão incompletos.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <StatusControl currentStatus={pedido.status} onStatusChange={handleStatusChange} isUpdating={updatingStatus} />
      </div>

      {/* Informações do Cliente */}
      <ClienteInfo cliente={pedido.cliente} />

      {/* Itens do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pedido.itens && pedido.itens.length > 0 ? (
            pedido.itens.map((item) => (
              <PedidoItem key={item.id} item={item} />
            ))
          ) : (
            <p className="text-muted-foreground">Nenhum item encontrado no pedido.</p>
          )}

          <Separator />

          {/* Resumo Financeiro */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>R$ {pedido.valor?.toFixed(2) || "0.00"}</span>
            </div>
            {pedido.desconto > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Desconto:</span>
                <span>-R$ {pedido.desconto.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxa de entrega:</span>
              <span>R$ {pedido.taxa_entrega?.toFixed(2) || "0.00"}</span>
            </div>
            
            <Separator />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>R$ {((pedido.valor || 0) + (pedido.taxa_entrega || 0) - (pedido.desconto || 0)).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Pedidos */}
      {historico.historico_pedidos_com_itens && historico.historico_pedidos_com_itens.length > 0 && (
        <HistoricoPedidos historico={historico} />
      )}
    </div>
  )
}