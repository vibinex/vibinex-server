import { PropsWithChildren } from "react";
import * as Switch from '@radix-ui/react-switch';

const SwitchSubmit = (props: PropsWithChildren<{
	id?: string,
	className?: string,
	disabled?: boolean,
	toggleFunction: (checked: boolean) => void,
	checked: boolean
}>) => {
	return (
		<Switch.Root
			className={`w-[42px] h-[25px] ${props.disabled ? "bg-action-inactiveDisabled" : "bg-action-inactive"} rounded-full relative ${props.disabled ? "data-[state=checked]:bg-action-activeDisabled" : "data-[state=checked]:bg-action-active"} ` + props.className}
			id={props.id}
			checked={props.checked}
			onCheckedChange={props.toggleFunction}
		>
			<Switch.Thumb className="block w-[21px] h-[21px] bg-secondary-main rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
		</Switch.Root>
	)
}

export default SwitchSubmit;