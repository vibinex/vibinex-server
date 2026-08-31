jest.mock('..', () => ({
	__esModule: true,
	default: {
		query: jest.fn(),
	},
}));

jest.mock('../users', () => ({
	getUserById: jest.fn(),
}));

import conn from '..';
import { updateAliasesForUser } from '../aliases';
import { getUserById } from '../users';

describe('updateAliasesForUser', () => {
	it('updates all aliases and provider handles with one query', async () => {
		(getUserById as jest.Mock).mockResolvedValue({
			auth_info: {
				github: { '1': { handle: 'octocat' } },
				bitbucket: { '2': { handle: 'bb-user' } },
			},
		});
		(conn.query as jest.Mock).mockResolvedValue({ rowCount: 2 });

		await updateAliasesForUser(['first@example.com', 'second@example.com'], 'user-1');

		expect(conn.query).toHaveBeenCalledTimes(1);
		const [query, values] = (conn.query as jest.Mock).mock.calls[0];
		expect(query).toContain('jsonb_to_recordset($2::jsonb)');
		expect(query).toContain('INSERT INTO aliases (git_alias, github, bitbucket)');
		expect(values).toEqual([
			['first@example.com', 'second@example.com'],
			JSON.stringify([
				{ provider: 'github', handle: 'octocat' },
				{ provider: 'bitbucket', handle: 'bb-user' },
			]),
		]);
	});
});
