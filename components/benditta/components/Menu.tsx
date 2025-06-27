//import { Promotion } from "@/app/types/Promotion"
import styled from "styled-components";
import PDFViewer from "./PDFViewer";
import Link from "next/link";
import Carousel from "@/components/Carousel/Promos/promosHome/Carousel";
import styles from "../styleBenditta.module.css";
import { Promocao, Promotion, CategoriaPromocoes } from "@/types/Promocao";
import { useEffect, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import Insta from "./Insta";

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
  background-color: var(--color-gray-benditta);
  padding: 100px 0 20px 0;
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
  const [promocao, setPromocao] = useState<Promotion[]>([]);
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
        const categoriasArray = Object.values(
          data.categorias
        ) as CategoriaPromocoes[];

        /*for (let index = 0; index < categoriasArray.length; index++) {
          for (let index2 = 0; index2 < categoriasArray[index].promocoes.length; index++) {
            const promocoesArray = categoriasArray[index].promocoes[index2].map(mapApiPromo);
            
          }
        } Opção com muito sofrimento Opção para mapear de categoriaPromocoes mais facil: flatmap

        array.flatMap(callback)
        Para cada item do array:
        Executa a função callback e espera que ela retorne um array ou um valor.
        Junta todos os resultados em um único array, mas sem criar arrays aninhados.
       */

        const promocoesArray = categoriasArray.flatMap((categoria) =>
          categoria.promocoes.map(mapApiPromo)
        );

        //Aqui usando FlatMap, iterei em todos valores de categorias e dentro de cada categoria
        //fui em categoria.promocoes e mapeei usando a minha função

        setPromocao(promocoesArray);

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
          promocao.length > 0 &&
              <Carousel items={promocao} />
        }
      </main>
      <ViewAllPromosLink href="/promos">
        Ver todas as promoções
      </ViewAllPromosLink>
      <Insta />
    </MenuContainer>
  );
};

export default Menu;
