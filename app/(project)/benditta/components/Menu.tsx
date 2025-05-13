import { Promotion } from "@/app/types/Promotion"
import styled from "styled-components";
import PDFViewer from "./PDFViewer";
import Link from "next/link";
import Carousel from "@/app/components/CarouselPromos/Carousel";
import styles from "../styleBenditta.module.css";

const promotions: Promotion[] = [
  {
    id: 1,
    title: "Promo de terça",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 2,
    title: "Promo de quarta",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 3,
    title: "Promo de quinta",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 4,
    title: "Promo de sexta",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 5,
    title: "Promo de Sabado",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 6,
    title: "Promo de Domingo",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 7,
    title: "Promo de Borda",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 8,
    title: "Promo de Refri",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  {
    id: 9,
    title: "Promo de teste",
    description: "Descontos toda terça com até 30% off.",
    image: "/img/bendittaPizza/pizza-do-dia-frango.png?height=720&width=1280",
    originalPrice: "R$ 42,90",
    discountedPrice: "R$ 29,90",
  },
  // ...
]

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

 
        <main className={`${styles.container } mx-auto `}>
          <Carousel items={promotions} />
        </main>
        <ViewAllPromosLink href="/promos">
          Ver todas as promoções
        </ViewAllPromosLink>

    </MenuContainer>
    
  );
};

export default Menu;
