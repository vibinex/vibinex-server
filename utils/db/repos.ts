import conn from '.';
import type { DbRepo, RepoIdentifier } from '../../types/repository';
import { convert } from './converter';

export const getRepos = async (allRepos: RepoIdentifier[]) => {
	const batchSize = 50;
	const allDbReposPromises = [];
	for (let index = 0; index < allRepos.length; index += batchSize) {
		const allReposSubset = allRepos.slice(index, index + batchSize);
		const allReposFormattedAsTuples = allReposSubset.map(repo => `(${convert(repo.repo_provider)}, ${convert(repo.repo_owner)}, ${convert(repo.repo_name)})`).join(',');
		const repo_list_q = `SELECT *
			FROM repos 
			WHERE (repo_provider, repo_owner, repo_name) IN (${allReposFormattedAsTuples})
			ORDER BY repo_provider, repo_owner, repo_name`;
		const DbRepoSubsetPromise: Promise<{ rows: DbRepo[] }> = conn.query(repo_list_q).catch(err => {
			console.error(`[getRepos] Error in getting repository-list from the database`, { pg_query: repo_list_q }, err);
			throw new Error(`Error in getting repository-list from the database. Batch: ${index}:${index + batchSize - 1}. Error: ${err.message}`);
		});
		allDbReposPromises.push(DbRepoSubsetPromise);
	}

	const allDbRepos = await Promise.allSettled(allDbReposPromises).then(results => {
		let numFailedPromises = 0;
		const allDbRepoLists = results.map((result) => {
			if (result.status !== 'fulfilled') {
				console.error(`[getRepos]`, result.reason);
				numFailedPromises++;
				return [];
			}
			return result.value.rows;
		})
		return {
			repos: allDbRepoLists.flat(),
			failureRate: (allDbReposPromises.length === 0) ? 0 : (numFailedPromises / allDbReposPromises.length),
		};
	})

	return allDbRepos;
}

export const setRepoConfig = async (repo: RepoIdentifier, configType: 'auto_assign' | 'comment', value: boolean) => {
	const update_repo_config_q = `UPDATE repos 
	SET config = jsonb_set(config::jsonb, '{${configType}}', to_jsonb(${convert(value)}))
	WHERE repo_provider = ${convert(repo.repo_provider)}
		AND repo_owner = ${convert(repo.repo_owner)}
		AND repo_name = ${convert(repo.repo_name)}`;
	const queryIsSuccessful = await conn.query(update_repo_config_q)
		.then((dbResponse) => {
			if (dbResponse.rowCount == 0) {
				return false;
			}
			return true;
		})
		.catch((err: Error) => {
			console.error(`[db/setRepoConfig] Could not update config of this repository: ${repo}`, { pg_query: update_repo_config_q }, err);
			return false;
		})
	return queryIsSuccessful;
};

export const getRepoConfig = async (repo: RepoIdentifier) => {
    const get_repo_config_q = `
        SELECT config 
        FROM repos 
        WHERE repo_provider = $1
            AND repo_owner = $2
            AND repo_name = $3`;

	const config = await conn.query(get_repo_config_q, [repo.repo_provider, repo.repo_owner, repo.repo_name])
        .then((dbResponse) => {
            if (dbResponse.rowCount == 0) {
                throw new Error(`Repository not found: ${JSON.stringify(repo)}`);
            }
            return dbResponse.rows[0].config;
        })
        .catch((err: Error) => {
            console.error(`[db/getRepoConfig] Could not retrieve config of this repository: ${repo}`, { pg_query: get_repo_config_q }, err);
            throw err;
        });

    return config;
};
