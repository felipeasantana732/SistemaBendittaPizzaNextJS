import { Promocao,  } from "@/app/types/Promocao";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge, Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";

type CarouselCardProps = {
    promocao : Promocao
};

function calcularDesconto(preco_inicial: string | null, preco_promo : string | null){
    const preco_inicial_number =  Number(preco_inicial)  ;
    const preco_promo_number =  Number(preco_promo)  ;
    const quantidadeDesconto =  preco_inicial_number - preco_promo_number ;

    const porcentagemDesconto = (quantidadeDesconto / preco_inicial_number) * 100;

    return porcentagemDesconto.toString() ; 

}

function PromocaoCard({ promocao }: CarouselCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={promocao.imagem_url || "/placeholder.svg"}
            alt={promocao.nome}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{calcularDesconto(promocao.preco_original, promocao.preco_promo)}%</Badge>
          <Button size="icon" variant="outline" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{promocao.categoria}</Badge>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-muted-foreground">{promocao.avaliacao}</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg line-clamp-1">{promocao.nome}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{promocao.descricao}</p>
          {promocao.pessoas && <p className="text-xs text-blue-600 font-medium">{promocao.pessoas}</p>}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-600">R$ {promocao.precoPromocional.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground line-through">R$ {promocao.precoOriginal.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  )
}