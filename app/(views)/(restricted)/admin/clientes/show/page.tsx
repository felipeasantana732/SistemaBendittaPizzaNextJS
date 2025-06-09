"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {ClienteAPI} from "@/types/Cliente";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";



export default function ListUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<ClienteAPI[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<ClienteAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


 
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/users'); 
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data as ClienteAPI[]); 
        setFilteredUsers(data as ClienteAPI[]); 
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao buscar usuários.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  
  useEffect(() => {
    let result = [...users]; 

   
    if (nameFilter) {
      result = result.filter((user) =>
        user.nomeCliente?.toLowerCase().includes(nameFilter.toLowerCase()) 
      );
    }

 
    if (idFilter) {
      result = result.filter((user) => user.id.includes(idFilter));
    }

    setFilteredUsers(result);
  }, [users, nameFilter, idFilter]);


  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <Button asChild size="lg" className="bg-green-500"> 
            <Link href="/admin/clientes/add">
              <span className="flex items-center">
                <PlusSquare className="mr-2 h-5 w-5" />
                Novo Cliente
              </span>
            </Link>
          </Button>
        </div>

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
                  <TableRow 
                    key={user.id}
                    onClick={() => router.push(`/admin/clientes/show/${user.id}`)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.nomeCliente ?? 'N/A'}</TableCell> 
                    <TableCell className="hidden md:table-cell">{user.enderecoCliente ?? 'N/A'}</TableCell> 
                    <TableCell className="hidden md:table-cell">{user.telefoneCliente ?? 'N/A'}</TableCell> 
                    <TableCell>{formatDate(user.created_at)}</TableCell> 
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">Nenhum usuário encontrado com os filtros aplicados.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
};
