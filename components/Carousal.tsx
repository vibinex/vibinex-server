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
	children: React.ReactElement[];
	itemClassNames?: string;
	showControls?: boolean;
}

const CarouselWrapper: React.FC<CarouselProps> = ({ children, itemClassNames, showControls = true, ...restprops }: CarouselProps) => {
	return (
		<Carousel {...restprops} className="w-full">
			<CarouselContent className="w-full">
				{children.map((component) => (
					<CarouselItem key={component.key} className={itemClassNames ?? ''}>
						{component}
					</CarouselItem>
				))}
			</CarouselContent>
			{(showControls) ? (<>
				<CarouselPrevious variant="outlined" />
				<CarouselNext variant="outlined" />
			</>) : null}
		</Carousel>
	)
}

export default CarouselWrapper;