import { countArrayElements, centralLimit } from './data';

describe('unit testing countArrayElements', () => {
	it("count string elements", () => {
		const lang_array = ['javascript', 'javascript', 'javascript', 'python', 'python'];
		const actual_output = countArrayElements(lang_array);

		expect(actual_output).toHaveProperty('javascript');
		expect(actual_output).toHaveProperty('python');
		expect(actual_output['javascript']).toBe(3);
		expect(actual_output['python']).toBe(2);
		expect(Object.keys(actual_output).length).toBe(2);
	})

	it("null check", () => {
		const arr = null;
		const out = countArrayElements(arr);

		expect(typeof out).toBe('object');
		expect(Object.keys(out).length).toBe(0);
	})
})

describe('unit testing centralLimit', () => {
	it('average of 1 elements', () => {
		expect(centralLimit('avg', [42])).toBe(42);
	})

	it('average of 2 elements', () => {
		expect(centralLimit('avg', [42, 20])).toBeCloseTo(31);
	})

	it('average of 3 elements', () => {
		expect(centralLimit('avg', [11, 42, 20])).toBeCloseTo(24.33);
	})

	it('median of 1 elements', () => {
		expect(centralLimit('median', [42])).toBe(42);
	})

	it('median of 2 elements', () => {
		expect(centralLimit('median', [42, 20])).toBeCloseTo(31);
	})

	it('median of 3 elements', () => {
		expect(centralLimit('median', [11, 42, 20])).toBeCloseTo(20);
	})

	it('mode of 1 elements', () => {
		expect(centralLimit('mode', [42])).toBe(42);
	})

	it('mode of 2 elements', () => {
		expect(centralLimit('mode', [42, 20])).toBeNull();
	})

	it('mode of 4 elements', () => {
		expect(centralLimit('mode', [11, 42, 20, 11])).toBeCloseTo(11);
	})
})