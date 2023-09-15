import conn from '.';
import type { DbRepo, RepoIdentifier } from '../../types/repository';
import { convert } from './converter';

export const getRepos = async (allRepos: RepoIdentifier[]) => {
	const allReposFormattedAsTuples = allRepos.map(repo => `(${convert(repo.repo_provider)}, ${convert(repo.repo_owner)}, ${convert(repo.repo_name)})`).join(',');
	const repo_list_q = `SELECT *
		FROM repos 
		WHERE (repo_provider, repo_owner, repo_name) IN (${allReposFormattedAsTuples})
		ORDER BY repo_provider, repo_owner, repo_name`;
	const result: { rows: DbRepo[] } = await conn.query(repo_list_q).catch(err => {
		console.error(`[getRepos] Error in getting repository-list from the database`, { pg_query: repo_list_q }, err);
		throw new Error(err); // FIXME: handle this more elegantly
	});
	return result.rows
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