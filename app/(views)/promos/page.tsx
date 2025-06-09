import ListPromos from "./components/ListPromos";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Pizzas em promo',
  description:
    "As melhores pizzas de Goiânia, com preços imperdiveis! Tem pizza grande, individual, com borda recheada, pizza doce, tudo em promoção! Pelo melhor preço já visto, Confira já!",
};
export default function MainPromos(){

  return(
    <>
    <ListPromos/>
    </>
  )
}
