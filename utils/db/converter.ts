export const convert = (value: any): string => {
	switch (value.constructor.name) {
		case 'Number':
			return `${value}`
		case 'String':
			return `'${value}'`
		case 'Boolean':
			return `${value}`
		case 'Array':
			return `ARRAY [${value.map((x: string | number) => convert(x)).join(', ')}]`
		case 'Object':
			return `'${JSON.stringify(value)}'`
		default:
			return `'${value}`
	}
}