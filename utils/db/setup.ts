import conn from '.';

export const getSetupReposFromDbForOwner = async (owner: string, provider: string): Promise<string[]> => {
	console.log(`[getSetupReposFromDbForOwner] Getting setup repos from db for owner ${owner} and provider ${provider}`);
	const query = `SELECT repos.repo_name
        FROM repos
        WHERE repos.repo_owner = $1 AND repos.repo_provider = $2;
    `;
	const result = await conn.query(query, [owner, provider]).catch(err => {
		console.error(`[getSetupReposFromDbForOwner] Could not get the github repos for owner ${owner} and provider ${provider}`, { pg_query: query }, err);
		throw new Error("Error in running the query on the database" + err.message);
	});
	if (result.rows.length === 0) {
		throw new Error('No repos found');
	}
	return result.rows.map(row => row.repo_name);
}
