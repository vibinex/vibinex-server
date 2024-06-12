"use client";

import Image from 'next/image';
import { RxCross1 } from "react-icons/rx";
import Button from './Button';

interface ChipProps {
	name: string;
	disabled: boolean;
	disabledText?: string;
	className?: string;
	onDelete?: () => void;
	onClick?: () => void;
	selected?: boolean;
	circleColor?: string; // Make circleColor optional
	avatar?: string; // Make avatar optional
}

const Chip: React.FC<ChipProps> = ({ name, disabled = false, disabledText = '', className, onDelete, onClick, selected = false, circleColor, avatar }) => (
	<div
		className={`flex min-w-fit items-center space-x-1 outline outline-1 rounded-full py-1 px-3 m-1 ${className} ${disabled ? 'opacity-50 bg-action-inactive' : ''} ${selected ? 'outline-2' : 'outline-slate-500'}`}
		title={disabled ? disabledText : ''}
		onClick={!disabled && onClick ? onClick : undefined}  // Handle click event only if not disabled and onClick is defined
	>
		{avatar ? (
			<Image
				src={avatar}
				alt={`${name}'s avatar`}
				width={24} height={24}
				className="h-6 rounded-full"
			/>
		) : (
			<div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: circleColor || 'gray' }}></div>
		)}
		<span className="text-md">{name}</span>
		{(!disabled && onDelete) && (
			<Button variant='text' onClick={onDelete} aria-label={`Delete ${name}`} className='!p-0'>
				<RxCross1 className='hover:text-red-600 cursor-pointer' />
			</Button>
		)}
	</div>
);

export default Chip;
