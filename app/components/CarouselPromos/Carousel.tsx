"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/app/hooks/useMobile"
import { cn } from "@/lib/utils"
import { CarouselCard } from "./CarouselCard"
import { Promotion } from "@/app/types/Promocao"
import styled from "styled-components"

type CarouselProps = {
  items: Promotion[]
  title?: string
}

const CardTitle = styled.h2`
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

export default function Carousel({ items, title = "Promoções" }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMobile()

    const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {

    const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

    const interval = setInterval(() => nextSlide(), 5000)
    return () => clearInterval(interval)
  }, [items.length])

  const getVisibleIndices = () => {
    const total = items.length
    const indices: number[] = []

    for (let i = currentIndex - 2; i <= currentIndex + 2; i++) {
      indices.push((i + total) % total)
    }

    return indices
  }

  const getPositionClass = (index: number, visibleIndices: number[]): string => {
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

  const visibleIndices = getVisibleIndices()

  return (
    <div className="relative w-full  mt-10">

        <div className=" text-center ">
            <CardTitle className="text-3xl text-center ">{title}</CardTitle>
        </div>
     

      {isMobile ? (
        <div className="relative w-full overflow-hidden ">
          <div className="flex py-3 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {items.map((promo) => (
              <div key={promo.id} className="w-full flex-shrink-0">
                <CarouselCard promo={promo} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative h-[850px] max-h-7x1 mx-auto max-w-7xl ">
          {items.map((promo, index) => {
            const position = getPositionClass(index, visibleIndices)
            const isVisible = visibleIndices.includes(index)
            if (!isVisible) return null

            return (
              <div
                key={promo.id}
                className={cn("absolute top-0 transition-all duration-500 ease-in-out px-6 w-full max-w-md", {
                  "left-[10%] z-10 opacity-60 scale-65 blur-sm": position === "left-far",
                  "left-[20%] z-20 opacity-80 scale-75 blur-[2px]": position === "left-near",
                  "left-1/2 -translate-x-1/2 z-30 scale-90": position === "center",
                  "right-[20%] z-20 opacity-80 scale-75 blur-[2px]": position === "right-near",
                  "right-[10%] z-10 opacity-60 scale-65 blur-sm": position === "right-far",
                })}
              >
                <CarouselCard promo={promo} />
              </div>
            )
          })}
        </div>
      )}

      {/* Navigation */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-40"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm z-40"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="flex justify-center mt-8 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-primary" : "bg-muted"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
