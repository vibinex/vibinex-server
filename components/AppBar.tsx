import { PropsWithChildren, useEffect, useRef, useState } from "react";
import Banner, { BannerHeightType } from "./Banner";

const AppBar = (props: PropsWithChildren<{
	position: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky',
	offset: boolean,
	className?: string,
	backdropClassName?: string,
}>) => {
	const headerRef = useRef<HTMLDivElement>(null);
	const appbarRef = useRef<HTMLDivElement>(null);
	const offsetRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (headerRef.current && offsetRef.current) {
			const offsetHeight = headerRef.current.clientHeight - ((!props.offset && appbarRef.current) ? appbarRef.current.clientHeight : 0);
			offsetRef.current.style.height = `${offsetHeight}px`;
		}
	})

	return (
		<>
			<header ref={headerRef} className={props.position + " w-full box-border z-20 top-0 right-0 left-auto shrink-0 print:absolute border-b-secondary-dark border-b-2 " + props.backdropClassName}>
				<Banner />
				<div ref={appbarRef} className={"relative flex items-center px-2 " + props.className}>
					{props.children}
				</div>
			</header>
			<div ref={offsetRef} className='relative'></div>
		</>
	)
}

export default AppBar;