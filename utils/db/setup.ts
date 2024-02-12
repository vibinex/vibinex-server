import conn from '.';

export const getGithubReposFromDbForUserId = async (user_id: string, org: string, provider: string): Promise<string[]> => {
	console.log(`[getGithubReposFromDbForUserId] Getting github repos from db for ${user_id} and org ${org}`);
	const query = `SELECT repos.repo_name
        FROM repos
        JOIN users ON users.topic_name = repos.install_id
        WHERE users.user_id = $1 AND repos.repo_owner = $2 AND repos.repo_provider = $3;
    `;
	const result = await conn.query(query, [user_id, org, provider]).catch(err => {
		console.error(`[getGithubreposFromDbForUserId] Could not get the github repos for user with id ${user_id} for org ${org}`, { pg_query: query }, err);
		throw new Error("Error in running the query on the database", err);
	});
	if (result.rows.length === 0) {
		throw new Error('No repos found');
	}
	return result.rows.map(row => row.repo_name);
}
