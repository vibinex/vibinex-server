import * as React from "react"

import {
	Carousel,
	CarouselBaseProps,
} from "./CarouselBase"
import { CarouselContent, CarouselItem } from "./CarouselContent";
import { CarouselNext, CarouselPrevious } from "./CarouselArrowButtons";

interface CarouselProps extends CarouselBaseProps {
	children: React.ReactElement[];
	itemClassNames?: string;
	controls?: 'none' | 'arrows' | 'dots';
}

const CarouselWrapper: React.FC<CarouselProps> = ({ children, itemClassNames, controls: controls = 'arrows', ...restprops }: CarouselProps) => {
	return (
		<Carousel {...restprops} className="w-full">
			<CarouselContent className="w-full">
				{children.map((component) => (
					<CarouselItem key={component.key} className={itemClassNames ?? ''}>
						{component}
					</CarouselItem>
				))}
			</CarouselContent>
			{(controls === 'arrows') ? (<>
				<CarouselPrevious variant="outlined" />
				<CarouselNext variant="outlined" />
			</>) : null}
		</Carousel>
	)
}

export default CarouselWrapper;