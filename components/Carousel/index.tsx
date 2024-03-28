"use client";

import * as React from "react"
import {
	Carousel,
	CarouselBaseProps,
	useCarousel,
} from "./CarouselBase"
import { CarouselContent, CarouselItem } from "./CarouselContent";
import { CarouselNext, CarouselPrevious } from "./CarouselArrowButtons";
import { CarouselDot, useCarouselDot } from "./CarouselDotButton";

const CarouselControls = ({ controls, autoMovementPlugins }: { controls?: 'none' | 'arrows' | 'dots', autoMovementPlugins: string[] }): JSX.Element | null => {
	const { api: emblaApi } = useCarousel()
	const { selectedIndex, scrollSnaps, onDotButtonClick } = useCarouselDot()
	const onAnyButtonClick = React.useCallback(
		(callback: () => void) => {
			if (autoMovementPlugins.includes('autoplay')) {
				const autoplay = emblaApi?.plugins()?.autoplay
				if (!autoplay) return

				const resetOrStop = autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop
				resetOrStop()
			}
			if (autoMovementPlugins.includes('autoScroll')) {
				const autoScroll = emblaApi?.plugins()?.autoScroll
				if (!autoScroll) return

				const resetOrStop = autoScroll.options.stopOnInteraction === false ? autoScroll.reset : autoScroll.stop
				resetOrStop()
			}
			callback()
		},
		[emblaApi, autoMovementPlugins]
	)

	switch (controls) {
		case 'arrows':
			return <>
				<CarouselPrevious variant="outlined" />
				<CarouselNext variant="outlined" />
			</>
		case 'dots': {
			return <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
				{scrollSnaps.map((scrollSnap, index) => (
					<CarouselDot
						key={scrollSnap}
						variant="text"
						onClick={() => onAnyButtonClick(() => onDotButtonClick(index))}
						className={'bg-transparent touch-manipulation inline-flex flex-col cursor-pointer border-0 p-0 m-0 w-10 h-10 items-center justify-center rounded-full after:border after:border-solid after:border-primary-text after:w-4 after:h-4 after:rounded-full after:flex after:items-center'.concat(
							index === selectedIndex ? ' after:bg-primary-text' : ''
						)}
					></CarouselDot>
				))}
			</div>
		}
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
	// check for autoplay or autoscroll plugins
	const autoMovePlugins: string[] = restprops.plugins
		?.filter(plugin => plugin.name === 'autoplay' || plugin.name === 'autoScroll')
		.map(plugin => plugin.name) ?? [];

	return (
		<Carousel {...restprops} className="w-full">
			<CarouselContent className="w-full">
				{children.map((component) => (
					<CarouselItem key={component.key} className={itemClassNames ?? ''}>
						{component}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselControls controls={controls} autoMovementPlugins={autoMovePlugins} />
		</Carousel >
	)
}

export default CarouselWrapper;