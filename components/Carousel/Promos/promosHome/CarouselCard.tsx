import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Promotion } from "@/types/Promocao";

type CarouselCardProps = {
  promo: Promotion;
};

export function CarouselCard({ promo }: CarouselCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="relative px-2 flex flex-col h-full z-10">
        <div className="relative w-full aspect-[9/16] mb-2 overflow-hidden rounded-md">
          <Image
            src={promo.image || "/placeholder.svg"}
            alt={promo?.title ?? "Sem descrição"}
            className="object-cover"
            fill
            priority
          />
        </div>
        <h3 className="text-2xl font-semibold mb-2">{promo.title}</h3>
        <p className="text-muted-foreground flex-grow mb-2">
          {promo.description}
        </p>
        <div className="= flex items-center justify-between gap-8">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground line-through">
              <div className="text-md">R$    {promo.originalPrice},00</div> 
            </span>
            <span className="text-3xl font-bold underline text-red-700 decoration-black">
              <div className="text-md">R$    {promo.discountedPrice},00</div> 
              
            </span>
          </div>
          <Button className="flex-1 mt-1">Confira</Button>
        </div>
      </CardContent>
    </Card>
  );
}
