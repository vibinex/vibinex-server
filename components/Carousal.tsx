import * as React from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselBaseProps,
} from "./CarousalBase"

interface CarouselProps extends CarouselBaseProps {
    children: React.ReactElement[]
  }

const CarouselWrapper: React.FC<CarouselProps> = ({children, ...restprops}: CarouselProps) => {
  return (
    <Carousel {...restprops} className="w-full">
      <CarouselContent className="w-full">
        {children.map((component) => (
          <CarouselItem key={component.key}>
            {component}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant="outlined"/>
      <CarouselNext variant="outlined"/>
    </Carousel>
  )
}

export default CarouselWrapper;