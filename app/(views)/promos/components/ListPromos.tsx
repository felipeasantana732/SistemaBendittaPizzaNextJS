"use client";

import { useEffect, useState } from "react";
import SecaoPromocoes from "../../../../components/Carousel/Promos/promosPage/SecaoPromocoes";
import { z } from "zod";
import CatPromoSchema, {
  CategoriaPromoSchema,
} from "@/types/Zod/ItemSchema";
import { ReloadIcon } from "@radix-ui/react-icons";

const ListPromos: React.FC = () => {
  const [categorias, setCategorias] = useState<CategoriaPromoSchema[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromocoes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/promos");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dados recebidos da API:", data);

        const cats = Object.values(data?.categorias ?? {});
        console.log("Categorias extraídas:", cats);

        const parsed = z.array(CatPromoSchema).safeParse(cats);

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

        setCategorias(parsed.data);
      } catch (err) {
        console.error("Error fetching promos:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromocoes();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🔥 Promoções Imperdíveis
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Aproveite nossas ofertas especiais e economize em seus pratos
            favoritos!
          </p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {isLoading && (
          <div className="container mx-auto py-6 px-4 text-center">
            <>
              <ReloadIcon className="mr-auto h-4 w-4 animate-spin ml-auto" />
            </>
            Carregando...
          </div>
        )}
        {error && <p>Erro: {error}</p>}
        {!isLoading &&
          !error &&
          categorias.length > 0 &&
          categorias.map((categoria) => (
            <div key={categoria.id}>
              <SecaoPromocoes
                titulo={categoria.nome}
                promocoes={categoria.promocoes}
                descricao={categoria.descricao}
              />
            </div>
          ))}
      </div>

      {/* Footer da página */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            ⏰ Promoções válidas por tempo limitado. Não perca!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListPromos;
