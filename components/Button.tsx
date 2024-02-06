import { MouseEventHandler, PropsWithChildren } from "react";

const Button = (props: PropsWithChildren<{
	variant: 'contained' | 'text' | 'outlined',
	href?: string,
	target?: string,
	onClick?: Function,
	disabled?: boolean,
	className?: string,
	id?: string,
	ref?: React.ForwardedRef<HTMLButtonElement>,
	isNotBasic?: boolean,
}>) => {

	const clickBehaviour: MouseEventHandler = (event) => {
		const target = (props.target) ? props.target : '_self';
		if (props.href) {
			window.open(props.href, target);
		}
		else if (props.onClick) {
			props.onClick(event);
		}
	}
	const basicClass = 'inline-flex items-center justify-center relative cursor-pointer align-middle disabled:cursor-default box-border min-w-max py-1 px-4 rounded-md transition-all ';
	const variantClasses = {
		'contained': "bg-primary-main text-secondary-main disabled:bg-action-inactive disabled:hover:bg-transparent hover:bg-primary-dark ",
		'outlined': "border-secondary-main border-2 rounded ",
		'text': "",
	}

	return (
		<button ref={props.ref} id={props.id} onClick={clickBehaviour} disabled={props.disabled} className={(props.isNotBasic ? '': basicClass) + variantClasses[props.variant] + props.className}>
			<span className="w-full font-semibold">
				{props.children}
			</span>
		</button>
	)
}

export default Button;