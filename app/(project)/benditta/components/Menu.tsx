//import { Promotion } from "@/app/types/Promotion"
import styled from "styled-components";
import PDFViewer from "./PDFViewer";
import Link from "next/link";
import Carousel from "@/app/components/CarouselPromos/Carousel";
import styles from "../styleBenditta.module.css";
import { Promocao, Promotion } from "@/app/types/Promocao";
import { useEffect, useState } from "react";

function mapApiPromo(apiPromo: Promocao): Promotion {
  return {
    id: apiPromo.id,
    title: apiPromo.nome,
    description: apiPromo.descricao ?? null,
    image: apiPromo.imagem_url ?? null,
    originalPrice: apiPromo.preco_original ?? null,
    discountedPrice: apiPromo.preco_promo ?? null,
  };
}

const MenuContainer = styled.section`
  padding: 100px 0;
`;

const ViewAllPromosLink = styled(Link)`
  display: block;
  margin-top: 20px;
  text-align: center;
  font-size: 1rem;
  color: var(--color-dark-gray-benditta-light);
  text-decoration: underline;
`;

const MenuContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: var(--color-accent-yellow-benditta);
  }
`;

const MenuDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 40px;
  color: var(--color-dark-gray-benditta);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const MenuPDFContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Menu: React.FC = () => {
  const [promocoes, setPromocoes] = useState<Promotion[]>([]);
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
    <MenuContainer id="cardapio">
      <MenuContent>
        <SectionTitle>Nosso Cardápio</SectionTitle>
        <MenuDescription>
          Conheça nossas deliciosas opções de pizzas, preparadas com
          ingredientes selecionados e nossa exclusiva massa tradicional italiana
          com 48 horas de fermentação.
        </MenuDescription>

        <MenuPDFContainer>
          <PDFViewer />
        </MenuPDFContainer>
      </MenuContent>

      <main className={`${styles.container} mx-auto `}>
        {isLoading && <p>Carregando promoções...</p>}
        {error && <p>Erro: {error}</p>}
        {!isLoading && !error && promocoes.length > 0 && (
          <Carousel items={promocoes} />
        )}
      </main>
      <ViewAllPromosLink href="/promos">
        Ver todas as promoções
      </ViewAllPromosLink>
    </MenuContainer>
  );
};

export default Menu;
