import { saveNewAuthorAliasesFromHunkData } from '../relevance';
import conn from "..";
import type { DPUHunkInfo } from '../../../pages/api/hunks';
import { convert } from '../converter';

describe('saveNewAuthorAliasesFromHunkData', () => {
	const hunkInfo: DPUHunkInfo = {
		repo_provider: 'bitbucket',
		repo_owner: 'dummyOwner',
		repo_name: 'dummyRepo',
		db_key: 'dummykey',
		prhunkvec: [{
			pr_number: '100',
			author: 'dummyauthor',
			blamevec: [
				{ "author": "dummyalias1@example.com", "timestamp": "1681420228", "line_start": "5", "line_end": "7", "filepath": "382511290c75d1fe8efdb35a12c35d449f6f0c0905853baf034926199062e8fc" },
				{ "author": "dummyalias2@example.com", "timestamp": "1697450406", "line_start": "8", "line_end": "14", "filepath": "382511290c75d1fe8efdb35a12c35d449f6f0c0905853baf034926199062e8fc" }
			]
		}]
	}
	const expectedAliases = ['dummyalias1@example.com', 'dummyalias2@example.com'];

	/**
	 * Check that the database has the aliases after the function is called
	 */
	async function checkFinalStateInDatabase() {
		// check that the aliases were added to the aliases table
		const aliases = await conn.query(
			`SELECT git_alias FROM aliases WHERE git_alias = ANY(${convert(expectedAliases)})`
		);
		expect(aliases.rows.map(row => row.git_alias)).toEqual(expectedAliases);

		// check that the aliases were added to the repos table
		const aliasesInRepos = await conn.query(
			`SELECT aliases FROM repos WHERE repo_provider = 'bitbucket' AND repo_owner = 'dummyOwner' AND repo_name = 'dummyRepo'`
		);
		const resultAliases = aliasesInRepos.rows[0].aliases;
		expect(resultAliases).toEqual(expectedAliases);
	}

	/**
	 * Clean up database after each test
	 * @returns {Promise<void>}
	 */
	async function cleanUpDatabase() {
		// clean up the dummy rows created in the database
		await conn.query(
			`DELETE FROM repos WHERE repo_provider = 'bitbucket' AND repo_owner = 'dummyOwner' AND repo_name = 'dummyRepo'`
		);
		await conn.query(
			`DELETE FROM aliases WHERE git_alias = ANY(${convert(expectedAliases)})`
		);
	}

	afterEach(async () => {
		// clean up the dummy rows created in the database
		await cleanUpDatabase();
	});

	afterAll(async () => {
		// Close database connection
		await conn.end();
	});

	it('should create new rows in aliases table and add items in aliases column of repos table', async () => {
		// create dummy data in database to add information
		await conn.query(
			`INSERT INTO repos (repo_provider, repo_owner, repo_name) 
			VALUES ('bitbucket', 'dummyOwner', 'dummyRepo')`
		);

		await saveNewAuthorAliasesFromHunkData(hunkInfo);

		await checkFinalStateInDatabase();
	});

	it('should not add duplicate aliases to the aliases table, but add aliases in repos table', async () => {
		// create dummy data in database to add information
		await conn.query(
			`INSERT INTO repos (repo_provider, repo_owner, repo_name)
			VALUES ('bitbucket', 'dummyOwner', 'dummyRepo')`
		);
		await conn.query(
			`INSERT INTO aliases (git_alias)
			VALUES ('dummyalias1@example.com'), ('dummyalias2@example.com')`
		);

		await saveNewAuthorAliasesFromHunkData(hunkInfo);

		await checkFinalStateInDatabase();
	});

	it('should not add duplicate aliases in repos table, but add aliases in aliases table', async () => {
		// create dummy data in database to add information
		await conn.query(
			`INSERT INTO repos (repo_provider, repo_owner, repo_name, aliases)
			VALUES ('bitbucket', 'dummyOwner', 'dummyRepo', '{dummyalias1@example.com, dummyalias2@example.com}')`
		);
		await conn.query(
			`INSERT INTO aliases (git_alias)
			VALUES ('dummyalias1@example.com')`
		);

		await saveNewAuthorAliasesFromHunkData(hunkInfo);

		await checkFinalStateInDatabase();
	});

	it('should not add duplicate aliases in repos table or in aliases table', async () => {
		// create dummy data in database to add information
		await conn.query(
			`INSERT INTO repos (repo_provider, repo_owner, repo_name, aliases)
			VALUES ('bitbucket', 'dummyOwner', 'dummyRepo', '{dummyalias1@example.com, dummyalias2@example.com}')`
		);
		await conn.query(
			`INSERT INTO aliases (git_alias)
			VALUES ('dummyalias1@example.com'), ('dummyalias2@example.com')`
		);

		await saveNewAuthorAliasesFromHunkData(hunkInfo);

		await checkFinalStateInDatabase();
	});
});
