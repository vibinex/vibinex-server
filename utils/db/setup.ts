import conn from '.';

export const getSetupReposFromDbForUserId = async (userId: string, org: string, provider: string): Promise<string[]> => {
	console.log(`[getSetupReposFromDbForUserId] Getting setup repos from db for ${userId} and org ${org} and provider ${provider}`);
	const query = `SELECT repos.repo_name
        FROM repos
        JOIN users ON users.topic_name = repos.install_id
        WHERE users.id = $1 AND repos.repo_owner = $2 AND repos.repo_provider = $3;
    `;
	const result = await conn.query(query, [userId, org, provider]).catch(err => {
		console.error(`[getGithubreposFromDbForUserId] Could not get the github repos for user with id ${userId} for org ${org}`, { pg_query: query }, err);
		throw new Error("Error in running the query on the database" + err.message);
	});
	if (result.rows.length === 0) {
		throw new Error('No repos found');
	}
	return result.rows.map(row => row.repo_name);
}
