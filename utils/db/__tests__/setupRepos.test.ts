jest.mock('..', () => ({
	__esModule: true,
	default: {
		query: jest.fn(),
	},
}));

import conn from '..';
import { removePreviousSelections } from '../setupRepos';

describe('removePreviousSelections', () => {
	it('removes the topic from user_selected without copying install_id', async () => {
		const queryMock = conn.query as jest.Mock;
		queryMock.mockResolvedValueOnce({ rowCount: 1 });

		await removePreviousSelections('topic-test', 'github');

		expect(queryMock).toHaveBeenCalledTimes(1);
		const [query, values] = queryMock.mock.calls[0] as [string, string[]];
		expect(query).toContain('SET user_selected = array_remove(user_selected, $1)');
		expect(query).toContain('WHERE $1 = ANY (user_selected) AND repo_provider = $2;');
		expect(values).toEqual(['topic-test', 'github']);
	});
});
