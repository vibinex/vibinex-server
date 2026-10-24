jest.mock('..', () => ({
	__esModule: true,
	default: { query: jest.fn() },
}));

import conn from '..';
import { getTopicNameFromDB } from '../relevance';

const mockedQuery = conn.query as jest.Mock;

describe('getTopicNameFromDB', () => {
	beforeEach(() => {
		mockedQuery.mockReset();
	});

	it('uses positional parameters for externally supplied repository identifiers', async () => {
		mockedQuery.mockResolvedValueOnce({ rows: [{ install_id: ['topic-1'] }] } as any);
		const repoName = "repo' OR '1'='1";

		await expect(getTopicNameFromDB('github', 'owner', repoName)).resolves.toEqual(['topic-1']);

		expect(mockedQuery).toHaveBeenCalledWith(
			expect.stringContaining('repo_provider = $1'),
			['github', 'owner', repoName],
		);
		const [query] = mockedQuery.mock.calls[0];
		expect(query).not.toContain(repoName);
	});
});
