import {
	Select as SelectBase,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./SelectBase";

interface SelectProps<T extends string> {
	optionsType: string;
	options: {value: T; label: string; disabled?: boolean}[];
	onValueChange: (value: T) => void;
	defaultValue?: T;
	className?: string;
  }

const Select = <T extends string>({ optionsType, options, onValueChange, defaultValue, className }: SelectProps<T>) => {
	return (
		<div className={className}>
			<SelectBase onValueChange={onValueChange} defaultValue={defaultValue}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder={`Select ${optionsType.toLowerCase()}`} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value} disabled={option.disabled}>{option.label}</SelectItem>
					))}
				</SelectContent>
			</SelectBase>
		</div>
	);
};

export default Select;