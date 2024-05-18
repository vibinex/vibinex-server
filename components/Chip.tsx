"use client";

import Image from 'next/image';
import Button from './Button';
import { RxCross1 } from "react-icons/rx";

interface ChipProps {
	avatar: string;
	name: string;
	disabled: boolean;
	disabledText?: string;
	className?: string;
	onDelete?: () => void;
}

const Chip: React.FC<ChipProps> = ({ name, avatar, disabled = false, disabledText = '', className, onDelete }) => (
	<div
		className={`flex min-w-fit items-center space-x-1 outline outline-1 outline-slate-500 rounded-full py-1 px-3 m-1 ${className} ${disabled ? 'opacity-50 bg-action-inactive' : ''}`}
		title={disabled ? disabledText : ''}
	>
		<Image
			src={avatar}
			alt={`${name}'s avatar`}
			width={24} height={24} className="h-6 rounded-full"
		/>
		<span className="text-md">{name}</span>
		{ onDelete && (<Button variant='text' onClick={onDelete} className='!p-0'>
			<RxCross1 className='hover:text-red-600 cursor-pointer' />
		</Button>)}
	</div>
);

export default Chip;
