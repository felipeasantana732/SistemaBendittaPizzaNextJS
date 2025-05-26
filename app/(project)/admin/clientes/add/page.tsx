"use client"; // Marca como Componente Cliente para interatividade e hooks

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para navegação
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Para endereço, se for multilinha
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'; // Ícones

// Interface para os dados do formulário (o que o usuário digita)
interface ClienteFormData {
  nomeCliente: string;
  telefoneCliente: string;
  enderecoCliente: string;
  idMensagem: string; // Se você tiver esses campos no formulário
  sesionID: string;   // Se você tiver esses campos no formulário
}

export default function AddUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ClienteFormData>({
    nomeCliente: '',
    telefoneCliente: '',
    enderecoCliente: '',
    idMensagem: '',
    sesionID: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previne o comportamento padrão de submissão do formulário
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Prepara os dados para enviar
    // A API espera os campos com os nomes corretos (nomeCliente, telefoneCliente, etc.)
    // e lida com a conversão para null se estiverem vazios.
    const payload = {
      nomeCliente: formData.nomeCliente,
      telefoneCliente: formData.telefoneCliente || null,
      enderecoCliente: formData.enderecoCliente || null,
      idMensagem: formData.idMensagem || null,
      sesionID: formData.sesionID || null,
    };

    try {
      // Faz a requisição POST para a sua API /api/users
      const response = await fetch('/api/users', { // Certifique-se que este é o caminho correto da sua API POST
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // Se a API retornar erros de validação (ex: do Zod), eles podem estar em result.errors ou result.details
        const errorMessage = result.details || result.message || `Erro HTTP: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Sucesso!
      setSuccess("Cliente adicionado com sucesso!");
      console.log("Cliente criado:", result);

      // Limpa o formulário
      setFormData({
        nomeCliente: '', telefoneCliente: '', enderecoCliente: '',
        idMensagem: '', sesionID: '',
      });

      // Opcional: redirecionar após um tempo
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timer = setTimeout(() => {
        router.push('/admin/clientes/show?flash_success=Cliente+adicionado!'); // Ajuste o caminho para sua lista de usuários
      }, 2000);
      // return () => clearTimeout(timer); // Não precisa retornar em handleSubmit

    } catch (err) {
      console.error("Erro ao adicionar cliente:", err);
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        {/* O formulário agora chama handleSubmit no onSubmit */}
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Adicionar Novo Cliente</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar um novo cliente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Exibição de mensagens de erro/sucesso */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" /> {error}
              </div>
            )}
            {success && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" /> {success}
                </div>
            )}

            {/* Campo Nome do Cliente */}
            <div className="space-y-2">
              <Label htmlFor="nomeCliente">Nome do Cliente*</Label>
              <Input
                id="nomeCliente"
                name="nomeCliente"
                value={formData.nomeCliente}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Campo Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefoneCliente">Telefone</Label>
              <Input
                id="telefoneCliente"
                name="telefoneCliente"
                type="tel"
                placeholder="(XX) XXXXX-XXXX"
                value={formData.telefoneCliente}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Campo Endereço */}
            <div className="space-y-2">
              <Label htmlFor="enderecoCliente">Endereço Completo</Label>
              <Textarea
                id="enderecoCliente"
                name="enderecoCliente"
                placeholder="Rua Exemplo, 123, Bairro, Cidade - UF, CEP"
                rows={3}
                value={formData.enderecoCliente}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Adicionar Cliente"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
