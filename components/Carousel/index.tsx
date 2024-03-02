"use client";

import * as React from "react"
import {
	Carousel,
	CarouselBaseProps,
} from "./CarouselBase"
import { CarouselContent, CarouselItem } from "./CarouselContent";
import { CarouselNext, CarouselPrevious } from "./CarouselArrowButtons";
import { CarouselDot, useCarouselDot } from "./CarouselDotButton";

const CarouselControls = ({ controls }: { controls?: 'none' | 'arrows' | 'dots' }): JSX.Element | null => {
	switch (controls) {
		case 'arrows':
			return <>
				<CarouselPrevious variant="outlined" />
				<CarouselNext variant="outlined" />
			</>
		case 'dots':
			const { selectedIndex, scrollSnaps, onDotButtonClick } = useCarouselDot()
			return <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
				{scrollSnaps.map((_, index) => (
					<CarouselDot
						key={index}
						variant="text"
						onClick={() => onDotButtonClick(index)}
						className={'bg-transparent touch-manipulation inline-flex flex-col cursor-pointer border-0 p-0 m-0 w-10 h-10 items-center justify-center rounded-full after:border after:border-solid after:border-primary-text after:w-4 after:h-4 after:rounded-full after:flex after:items-center'.concat(
							index === selectedIndex ? ' after:bg-primary-text' : ''
						)}
					></CarouselDot>
				))}
			</div>
		case 'none':
			return null
		default:
			console.error('Invalid value for "controls" prop. Valid values are "none", "arrows", "dots".')
			return null
	}
}

interface CarouselProps extends CarouselBaseProps {
	children: React.ReactElement[];
	itemClassNames?: string;
	controls?: 'none' | 'arrows' | 'dots';
}

const CarouselWrapper: React.FC<CarouselProps> = ({ children, itemClassNames, controls = 'arrows', ...restprops }: CarouselProps) => {
	return (
		<Carousel {...restprops} className="w-full">
			<CarouselContent className="w-full">
				{children.map((component) => (
					<CarouselItem key={component.key} className={itemClassNames ?? ''}>
						{component}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselControls controls={controls} />
		</Carousel >
	)
}

export default CarouselWrapper;