import { PropsWithChildren } from "react";

const AppBar = (props: PropsWithChildren<{
	// all positions 
	position: 'absolute' | 'fixed' | 'relative' | 'static' | 'sticky',
	className?: string,
}>) => {

	return (
		<>
			{/* removded the header  */}
			{
				((props.position === 'fixed') || ((props.position === 'absolute'))) ?
					(<div className={heightClassNames}></div>) :
					null
			}
		</>
	)
}

export default AppBar;