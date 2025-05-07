"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 1. Defina uma interface para o objeto de usuário,
// correspondendo aos dados que sua API /api/users retorna.
// Baseado na interface ClienteAPI do Canvas api-user-by-id-route.
interface User {
  id: string; // Vem como string da API após a conversão do BigInt
  created_at: string | Date; // A API retorna string JSON para datas
  nomeCliente: string | null;
  telefoneCliente: string | null;
  enderecoCliente: string | null;
  // Adicione outros campos se sua API /api/users (a que lista todos) os retornar
  // idMensagem: string | null;
  // sessionID: string | null;
}

export default function ListUsers() {
  // 2. Use a interface User para tipar os estados
  const [users, setUsers] = useState<User[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users'); // Rota que lista todos os usuários
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data as User[]); // Faz um type assertion, idealmente a API já retorna o tipo correto
        setFilteredUsers(data as User[]); // Inicializa filteredUsers com todos os usuários
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao buscar usuários.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Apply filters when users, nameFilter, or idFilter changes
  useEffect(() => {
    let result = [...users]; // Começa com a lista original de usuários

    // Apply name filter (case insensitive)
    if (nameFilter) {
      result = result.filter((user) =>
        user.nomeCliente?.toLowerCase().includes(nameFilter.toLowerCase()) // 3. Usa nomeCliente
      );
    }

    // Apply ID filter (exact match)
    if (idFilter) {
      // O ID é string, então a comparação direta funciona.
      // Se o ID fosse número, seria user.id === Number(idFilter)
      result = result.filter((user) => user.id.includes(idFilter));
    }

    setFilteredUsers(result);
  }, [users, nameFilter, idFilter]);

  // Format date to Brazilian format
  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      // Tenta criar um objeto Date. Se já for Date, ótimo. Se for string, tenta parsear.
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return 'Data inválida';
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-6 px-4 text-center">Carregando usuários...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-6 px-4 text-center text-red-600">Erro: {error}</div>;
  }

  return (
    <>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Usuários do Sistema</h1>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameFilter">Nome do Cliente</Label>
                <Input
                  id="nameFilter"
                  placeholder="Filtrar por nome"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idFilter">ID</Label>
                <Input
                  id="idFilter"
                  placeholder="Filtrar por ID"
                  value={idFilter}
                  onChange={(e) => setIdFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                {/* <TableHead>Tipo</TableHead> Removido, pois não há 'type' na interface User */}
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead>Cadastrado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.nomeCliente ?? 'N/A'}</TableCell> {/* 3. Usa nomeCliente */}
                    {/* <TableCell>{user.type === "customer" ? "Cliente" : "Funcionário"}</TableCell> */}
                    <TableCell className="hidden md:table-cell">{user.enderecoCliente ?? 'N/A'}</TableCell> {/* 3. Usa enderecoCliente */}
                    <TableCell className="hidden md:table-cell">{user.telefoneCliente ?? 'N/A'}</TableCell> {/* 3. Usa telefoneCliente */}
                    <TableCell>{formatDate(user.created_at)}</TableCell> {/* 3. Usa created_at */}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4"> {/* Ajusta colSpan */}
                    Nenhum usuário encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
};
