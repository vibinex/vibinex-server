import React, {
	useCallback,
	useEffect,
	useState,
	forwardRef
} from 'react'
import type { EmblaCarouselType } from 'embla-carousel'
import Button from '../Button'
import { useCarousel } from './CarouselBase'

type UseDotButtonType = {
	selectedIndex: number
	scrollSnaps: number[]
	onDotButtonClick: (index: number) => void
}

const useCarouselDot = (): UseDotButtonType => {
	const { api: emblaApi } = useCarousel()
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

	const onDotButtonClick = useCallback(
		(index: number) => {
			if (!emblaApi) return
			emblaApi.scrollTo(index)
		},
		[emblaApi]
	)

	const onInit = useCallback((emblaApi: EmblaCarouselType) => {
		setScrollSnaps(emblaApi.scrollSnapList())
	}, [])

	const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
		setSelectedIndex(emblaApi.selectedScrollSnap())
	}, [])

	useEffect(() => {
		if (!emblaApi) return

		onInit(emblaApi)
		onSelect(emblaApi)
		emblaApi.on('reInit', onInit)
		emblaApi.on('reInit', onSelect)
		emblaApi.on('select', onSelect)
	}, [emblaApi, onInit, onSelect])

	return {
		selectedIndex,
		scrollSnaps,
		onDotButtonClick
	}
}

const CarouselDot = forwardRef<
	HTMLButtonElement,
	React.ComponentProps<typeof Button>
>(({ className, variant = "outlined", ...props }, ref) => {
	const { children, ...restProps } = props

	return (
		<Button
			isNotBasic
			variant={variant}
			className={className}
			{...restProps}
		>
			{children}
		</Button>
	)
})
CarouselDot.displayName = 'CarouselDot';

export {
	CarouselDot,
	useCarouselDot
}