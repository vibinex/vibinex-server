"use client";

import React from "react";
import { useCarousel } from "./CarouselBase";

const CarouselContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { carouselRef, orientation } = useCarousel()

	return (
		<div ref={carouselRef} className="overflow-hidden">
			<div
				ref={ref}
				className={"flex " +
					(orientation === "horizontal" ? "-mx-4 " : "-mt-4 flex-col ") +
					className
				}
				{...props}
			/>
		</div>
	)
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { orientation } = useCarousel()

	return (
		<div
			ref={ref}
			role="group"
			aria-roledescription="slide"
			className={className +
				" min-w-0 shrink-0 grow-0 basis-full" +
				(orientation === "horizontal" ? " pl-4 " : " pt-4 ")
			}
			{...props}
		/>
	)
})
CarouselItem.displayName = "CarouselItem"

export {
	CarouselContent,
	CarouselItem,
}