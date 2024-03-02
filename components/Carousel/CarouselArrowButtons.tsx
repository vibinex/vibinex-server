"use client";

import React from 'react';
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import Button from "../Button";
import { useCarousel } from './CarouselBase';

const CarouselPrevious = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof Button>
>(({ className, variant = "outlined", ...props }, ref) => {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel()

	return (
		<Button
			ref={ref}
			variant={variant}
			className={"relative align-middle h-8 w-8 rounded-full " +
				(orientation === "horizontal"
					? "-left-8 top-4 "
					: "-top-12 left-1/2 -translate-x-1/2 rotate-90 ") +
				className
			}
			isNotBasic
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			{...props}
		>
			<LuArrowLeft className="h-4 w-4 mx-auto" />
			<span className="sr-only">Previous slide</span>
		</Button>
	)
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof Button>
>(({ className, variant = "outlined", ...props }, ref) => {
	const { orientation, scrollNext, canScrollNext } = useCarousel()

	return (
		<Button
			ref={ref}
			variant={variant}
			className={"relative align-middle h-8 w-8 rounded-full " +
				(orientation === "horizontal"
					? "-right-12 top-4 "
					: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90 ") +
				className
			}
			isNotBasic
			disabled={!canScrollNext}
			onClick={scrollNext}
			{...props}
		>
			<LuArrowRight className="h-4 w-4 mx-auto" />
			<span className="sr-only">Next slide</span>
		</Button>
	)
})
CarouselNext.displayName = "CarouselNext"

export {
	CarouselNext, CarouselPrevious
};
