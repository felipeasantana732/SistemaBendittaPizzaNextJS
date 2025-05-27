import { Promocao, PromocaoDetail } from "@/app/types/Promocao";
import { useEffect, useState } from "react";

function mapApiPromo(apiPromo: Promocao): PromocaoDetail {
  return {
    id: apiPromo.id,
    nome: apiPromo.nome,
    descricao: apiPromo.descricao ?? null,
    imagem_url_small: apiPromo.imagem_url ?? null,
    preco_original: apiPromo.preco_original ?? null,
    preco_promo: apiPromo.preco_promo ?? null,
    expiration_date: apiPromo.expiration_date ?? null,
    categoria_promo: apiPromo.categoriaPromo ?? null,
  };
}

const HomePromos: React.FC = () => {
  const [promocoes, setPromocoes] = useState<PromocaoDetail[]>([]);
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
          const rawPromos = data.promosAPI; // de acordo com seu exemplo
  
          const formatted = rawPromos.map((promo: Promocao) =>
            mapApiPromo(promo)
          );
          setPromocoes(formatted);
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">🔥 Promoções Imperdíveis</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Aproveite nossas ofertas especiais e economize em seus pratos favoritos!
          </p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* As Queridinhas */}
        <SecaoPromocoes
          titulo="❤️ As Queridinhas"
          promocoes={promocoes.queridinhas}
          descricao="Os pratos mais amados pelos nossos clientes com preços especiais"
        />

        {/* Pra Galera - Combos */}
        <SecaoPromocoes
          titulo="👥 Pra Galera - Combos"
          promocoes={promocoes.combos}
          descricao="Combos perfeitos para compartilhar com família e amigos"
        />

        {/* Pra Matar a Fome - Individuais */}
        <SecaoPromocoes
          titulo="🍽️ Pra Matar a Fome - Individuais"
          promocoes={promocoes.individuais}
          descricao="Opções individuais saborosas para satisfazer sua fome"
        />
      </div>

      {/* Footer da página */}
      <div className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">⏰ Promoções válidas por tempo limitado. Não perca!</p>
        </div>
      </div>
    </div>
  );
}

export default HomePromos;