import { PropsWithChildren, useState } from "react";
import Banner, { BannerHeightType } from "./Banner";

const AppBar = (props: PropsWithChildren<{
	position: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky',
	offset: boolean,
	className?: string,
}>) => {
	const heightClassNames = "h-14 landscape:h-12 md:h-16";
	const [bannerHeight, setBannerHeight] = useState<BannerHeightType>();

	return (
		<>
			<header className={props.position + " w-full box-border z-20 top-0 right-0 left-auto shrink-0 print:absolute"}>
				<Banner bannerHeight={bannerHeight} setBannerHeight={setBannerHeight} />
				<div className={"relative flex items-center px-2 " + heightClassNames + " " + props.className}>
					{props.children}
				</div>
			</header>
			<div className={`${bannerHeight}`}></div>
			{
				(props.offset && (props.position === 'fixed') || ((props.position === 'absolute'))) ?
					(<div className={heightClassNames}></div>) :
					null
			}
		</>
	)
}

export default AppBar;