"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/app/hooks/useMobile"
import { cn } from "@/lib/utils"
import { Promotion } from "@/app/types/Promotion"

type CarouselProps = {
  items: Promotion[]
  title?: string
}

export default function PromocoesCarousel({ items, title = "Promoções" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMobile()

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1))
  }

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Calculate indices for visible cards on desktop
  const getVisibleIndices = () => {
    const indices = []
    const totalCards = items.length

    // Add cards before current
    for (let i = currentIndex - 2; i < currentIndex; i++) {
      indices.push((i + totalCards) % totalCards)
    }

    // Add current card
    indices.push(currentIndex)

    // Add cards after current
    for (let i = currentIndex + 1; i <= currentIndex + 2; i++) {
      indices.push(i % totalCards)
    }

    return indices
  }

  // Get position class based on index relative to current
  const getPositionClass = (index: number, visibleIndices: number[]):string => {
    const position = visibleIndices.indexOf(index)

    switch (position) {
      case 0:
        return "left-far"
      case 1:
        return "left-near"
      case 2:
        return "center"
      case 3:
        return "right-near"
      case 4:
        return "right-far"
      default:
        return "hidden"
    }
  }

  return (
    <div className="relative w-full py-8">
      {/* Main title */}
      <h2 className="text-3xl font-bold text-center mb-8 md:mb-12">{title}</h2>

      {/* Mobile Carousel */}
      {isMobile && (
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((promo) => (
              <div key={promo.id} className="w-full flex-shrink-0">
                <Card className="mx-auto max-w-md flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="relative w-full aspect-[9/16] mb-4 overflow-hidden">
                      <Image
                        src={promo.image || "/placeholder.svg"}
                        alt={promo.title}
                        fill
                        className="object-cover object-center rounded-md"
                        priority
                      />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{promo.title}</h3>
                    <p className="text-muted-foreground flex-grow">{promo.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="text-xl font-bold text-primary">{promo.price}</div>
                      <Button className="flex-1">Aproveitar</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Carousel */}
      {!isMobile && (
        <div className="relative h-[600px] mx-auto max-w-7xl">
          {items.map((promo, index) => {
            const visibleIndices = getVisibleIndices()
            const position = getPositionClass(index, visibleIndices)
            const isVisible = visibleIndices.includes(index)

            if (!isVisible) return null

            return (
              <div
                key={promo.id}
                className={cn("absolute top-0 transition-all duration-500 ease-in-out w-full max-w-md", {
                  "left-[10%] z-10 opacity-60 scale-75 blur-sm": position === "left-far",
                  "left-[25%] z-20 opacity-80 scale-85 blur-[2px]": position === "left-near",
                  "left-1/2 -translate-x-1/2 z-30 scale-100": position === "center",
                  "right-[25%] z-20 opacity-80 scale-85 blur-[2px]": position === "right-near",
                  "right-[10%] z-10 opacity-60 scale-75 blur-sm": position === "right-far",
                })}
              >
                <Card className="flex flex-col h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="relative w-full aspect-[9/16] mb-4 overflow-hidden">
                      <Image
                        src={promo.image || "/placeholder.svg"}
                        alt={promo.title}
                        fill
                        className="object-cover object-center rounded-md"
                        priority
                      />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{promo.title}</h3>
                    <p className="text-muted-foreground flex-grow">{promo.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="text-xl font-bold text-primary">{promo.price}</div>
                      <Button className="flex-1">Aproveitar</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      )}

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
        <span className="sr-only">Anterior</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
        <span className="sr-only">Próximo</span>
      </Button>

      {/* Dots indicator */}
      <div className="flex justify-center mt-8 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}