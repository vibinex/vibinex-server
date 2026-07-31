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
		const query = queryMock.mock.calls[0][0] as string;
		expect(query).toContain("SET user_selected = array_remove(user_selected, 'topic-test')");
		expect(query).not.toContain('array_remove(install_id');
	});
});
