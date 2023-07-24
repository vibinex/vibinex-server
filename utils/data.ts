
// input: ['javascript', 'javascript', 'javascript', 'python', 'python']
// output: { 'javascript': 3, 'python': 2 }
const countArrayElements = (arr: Array<string | number> | null): { [key: string | number]: number } => {
	const counter: { [key: string | number]: number } = {}
	if (arr) {
		for (const element of arr) {
			counter[element] = (counter.hasOwnProperty(element)) ? counter[element] + 1 : 1;
		}
	}

	return counter;
}

const centralLimit = (type: 'avg' | 'median' | 'mode' | 'decay_avg' = 'avg', arr: Array<number>): number | null => {
	switch (type) {
		case 'avg':
			return arr.reduce((prev, curr, i) => (prev * i + curr) / (i + 1))
		case 'median':
			arr.sort((a, b) => (a - b));
			if (arr.length % 2 == 1)
				return arr[(arr.length - 1) / 2]
			else {
				const half_len = arr.length / 2;
				return (arr[half_len] + arr[half_len - 1]) / 2
			}
		case 'mode':
			const counts = countArrayElements(arr);
			let max_count = 0;
			let modes: Array<number> = [];
			for (const count_key of Object.keys(counts)) {
				const key = parseFloat(count_key);
				if (counts[key] > max_count) {
					max_count = counts[key];
					modes = [key];
				}
				else if (counts[key] == max_count) {
					modes.push(key);
				}
			}
			if (modes.length == 1)
				return modes[0];
			else {
				console.debug(`The array is multimodal. Max frequency: ${max_count}; modes: ${modes.toString()}`);
				return null;
			}
		default:
			throw Error(`Type not implemented: ${type}`);
	}
}

const normalize = (type: 'minmax' | 'gaussian', arr: Array<number>): Array<number> => {
	return arr;
}

/**
 * returns an HTML table with columns based on the first element.
 * @param data Array on objects that has to be displayed
 */
const renderObjAsTable = (data: Array<{ [k: string]: any }>) => {
	let output: string = "<table>";
	const headings = Object.keys(data[0]);

	// heading row
	output += "<thead>"
	for (const h of headings) {
		output += `<th>${h}</th>`
	}
	output += "</thead>"

	// adding all the data
	for (const row of data) {
		output += "<tr>";
		for (const h of headings) {
			output += `<td>${(typeof row[h] === "object") ? JSON.stringify(row[h]) : row[h]}</td>`
		}
		output += "</tr>";
	}
	output += "</table>"

	return output;
}

export { countArrayElements, centralLimit, renderObjAsTable };