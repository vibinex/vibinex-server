import { PropsWithChildren, useEffect, useRef, useState } from "react";
import Banner, { BannerHeightType } from "./Banner";

const AppBar = (props: PropsWithChildren<{
	position: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky',
	offset: boolean,
	className?: string,
	backdropClassName?: string,
}>) => {
	const appbarRef = useRef<HTMLDivElement>(null);
	const offsetRef = useRef<HTMLDivElement>(null);
	const [bannerHeight, setBannerHeight] = useState<BannerHeightType>();

	useEffect(() => {
		if (props.offset && appbarRef.current && offsetRef.current) {
			offsetRef.current.style.height = `${appbarRef.current.clientHeight}px`;
		}
	})

	return (
		<>
			<header className={props.position + " w-full box-border z-20 top-0 right-0 left-auto shrink-0 print:absolute border-b-secondary-dark border-b-2 " + props.backdropClassName}>
				<Banner bannerHeight={bannerHeight} setBannerHeight={setBannerHeight} />
				<div ref={appbarRef} className={"relative flex items-center px-2 " + props.className}>
					{props.children}
				</div>
			</header>
			<div className={`${bannerHeight}`}></div>
			{(props.offset && (props.position === 'fixed') || ((props.position === 'absolute'))) &&
				<div ref={offsetRef} className='relative'></div>}
		</>
	)
}

export default AppBar;