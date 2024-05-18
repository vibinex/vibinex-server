import React, { useRef, useState } from 'react';
import Chip from './Chip';

const DELIMITER_KEYS = [',', ';', ' ', 'Tab', 'Enter'];
const DELETION_KEYS = ['Backspace', 'Delete'];

export interface ChipData {
	text: string;
	avatar: string;
}

interface ChipInputProps {
	onAdd: (value: ChipData) => void;
	onRemove: (value: ChipData) => void;
	defaultValues?: ChipData[];
	placeholder?: string;
	disabled?: boolean;
	getAvatarFromValue?: (value: string) => string;
	className?: string;
}

const defaultGetAvatarFromValue = (_: string) => {
	return '/dummy-profile-pic-female-300n300.jpeg';
}

const ChipInput: React.FC<ChipInputProps> = ({
	onAdd,
	onRemove,
	defaultValues = [],
	placeholder = '',
	disabled = false,
	getAvatarFromValue = defaultGetAvatarFromValue,
	className = '',
}) => {
	const [values, setValues] = useState<ChipData[]>(defaultValues);
	const [inputValue, setInputValue] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (DELIMITER_KEYS.includes(event.key) && inputValue.trim() !== '') {
			event.preventDefault();
			// check if the new value is a duplicate
			const isDuplicate = values.some((chipData) => chipData.text === inputValue.trim());
			if (isDuplicate) {
				console.warn('Duplicate values are not allowed');
				setInputValue('');
				return;
			}

			const newChipData: ChipData = {
				text: inputValue.trim(),
				avatar: getAvatarFromValue(inputValue.trim()),
			};
			onAdd(newChipData);
			setValues([...values, newChipData]);
			setInputValue('');
		}

		if (DELETION_KEYS.includes(event.key) && inputValue.trim() === '') {
			const lastChipData = values[values.length - 1];
			onRemove(lastChipData);
			setValues(values.slice(0, values.length - 1));
		}
	};

	const handleChipRemove = (chipData: ChipData) => {
		onRemove(chipData);
		setValues(values.filter((value) => value.text !== chipData.text));
	};

	const handleInputFocus = () => {
		inputRef.current?.focus();
	};

	return (
		<div
			className={`flex items-center gap-0 border border-gray-300 rounded-md p-2 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500 ${className}`}
			onClick={handleInputFocus}
		>
			{values.map((chipData) => (
				<Chip
					key={chipData.text}
					name={chipData.text}
					avatar={chipData.avatar}
					disabled={disabled}
					onDelete={() => handleChipRemove(chipData)}
				/>
			))}
			<input
				ref={inputRef}
				placeholder={placeholder}
				value={inputValue}
				onChange={handleInputChange}
				onKeyDown={handleInputKeyDown}
				disabled={disabled}
				className="outline-none flex-grow border-none focus:ring-0 px-1"
			/>
		</div>
	);
};

export default ChipInput;
