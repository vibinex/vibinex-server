import { PropsWithChildren } from "react";

const AppBar = (props: PropsWithChildren<{
	position: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky',
	className?: string,
}>) => {
	const heightClassNames = "h-14 landscape:h-12 md:h-16";
	return (
		<>
			<header className={props.position + " flex flex-col w-full box-border z-20 top-0 right-0 left-auto bg-primary-main shrink-0 print:absolute"}>
				<div className={"relative flex items-center px-2 " + heightClassNames + " " + props.className}>
					{props.children}
				</div>
			</header>
			{
				((props.position === 'fixed') || ((props.position === 'absolute'))) ?
					(<div className={heightClassNames}></div>) :
					null
			}
		</>
	)
}

export default AppBar;