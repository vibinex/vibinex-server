import conn from '.';

export const getSetupReposFromDbForOrg = async (org: string, provider: string): Promise<string[]> => {
	console.log(`[getSetupReposFromDbForOrg] Getting setup repos from db for org ${org} and provider ${provider}`);
	const query = `SELECT repos.repo_name
        FROM repos
        WHERE repos.repo_owner = $1 AND repos.repo_provider = $2; 
    `; // TODO: Yet to handle use-case of recognising active repos. Right now, we only use this as a way to check if DPU is set and working on a repo
	const result = await conn.query(query, [org, provider]).catch(err => {
		console.error(`[getSetupReposFromDbForOrg] Could not get the github repos for org ${org} and provider ${provider}`, { pg_query: query }, err);
		throw new Error("Error in running the query on the database" + err.message);
	});
	if (result.rows.length === 0) {
		throw new Error('No repos found');
	}
	return result.rows.map(row => row.repo_name);
}
