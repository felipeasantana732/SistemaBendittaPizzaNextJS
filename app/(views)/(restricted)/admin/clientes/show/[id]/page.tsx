"use client";

import userDetail from "@/types/Zod/UserSchemas";
import z from "zod";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useParams } from "next/navigation";

type userDetailType = z.infer<typeof userDetail>;

export default function ShowUser() {
  const params = useParams();
  const userID = params.id as string;

  const [user, setUser] = useState<userDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userID) return; // Aguarda o userID estar disponível

    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/${userID}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data);

        const parsed = userDetail.safeParse(data);

        if (!parsed.success) {
          console.error("Erro de validação Zod:", parsed.error);
          console.error("Detalhes dos erros:", parsed.error.flatten());

          // Mostrar onde exatamente falhou
          parsed.error.issues.forEach((issue, index) => {
            console.error(`Erro ${index + 1}:`, issue.path, "-", issue.message);
          });

          throw new Error(
            "Resposta inválida do servidor. Veja os logs para detalhes."
          );
        }

        console.log("Dados parseados com sucesso:", parsed.data);
        setUser(parsed.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userID]);

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-4">Detalhes do Cliente</h1>

      {isLoading && (
        <div className="container mx-auto py-6 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <ReloadIcon className="h-4 w-4 animate-spin" />
            Carregando...
          </div>
        </div>
      )}

      {error && <p className="text-red-500">Erro: {error}</p>}

      {!isLoading && !error && user == null && (
        <p>Cliente não encontrado</p>
      )}

      {!isLoading && !error && user != null && (
        <div className="space-y-4">
          <div>
            <strong>ID:</strong> {user.id}
          </div>
          <div>
            <strong>Nome:</strong> {user.nomeCliente ?? "N/A"}
          </div>
          <div>
            <strong>Telefone:</strong> {user.telefoneCliente ?? "N/A"}
          </div>
          <div>
            <strong>Endereço:</strong> {user.enderecoCliente ?? "N/A"}
          </div>
          <div>
            <strong>Data de Cadastro:</strong>{" "}
            {new Date(user.created_at).toLocaleString("pt-BR")}
          </div>
        </div>
      )}
    </div>
  );
}