import { withPendingHandle } from './GitAliasListItem';

describe('withPendingHandle', () => {
	it('includes a typed handle that has not yet been converted to a chip', () => {
		expect(withPendingHandle(['existing-user'], ' new-user ')).toEqual([
			'existing-user',
			'new-user',
		]);
	});

	it('does not add blank or duplicate pending handles', () => {
		expect(withPendingHandle(['existing-user', ''], 'existing-user')).toEqual(['existing-user']);
		expect(withPendingHandle(['existing-user', ''], '   ')).toEqual(['existing-user']);
	});
});
