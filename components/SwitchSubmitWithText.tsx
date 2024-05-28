type Option = {
	value: string;
	label: string;
	disabled?: boolean;
}

function SwitchSubmitWithText(props: Readonly<{
	optionsList: Option[],
	selectedOption: string,
	setSelectedOption: (option: string) => void
}>) {
	const { optionsList, selectedOption, setSelectedOption } = props;
	return (
		<div className='flex items-center w-full rounded-xl bg-primary'>
			{optionsList.map((item) => {
				return (
					<button
						key={item.value}
						onClick={() => { setSelectedOption(item.value) }}
						className={`text-center p-2 w-full rounded-xl cursor-pointer m-2 ${selectedOption === item.value ? 'bg-secondary shadow shadow-slate-700' : null}`}
					>
						<h2 className={`sm:text-lg font-semibold ${selectedOption === item.value ? 'text-secondary-foreground' : 'text-primary-foreground'}`}>
							{item.label}
						</h2>
					</button>
				)
			})}
		</div>
	);
}

export default SwitchSubmitWithText;