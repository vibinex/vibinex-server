import conn from '.';
import type { DbRepo, RepoIdentifier } from '../../types/repository';
import { convert } from './converter';

export const getReposFromNames = async (allRepos: RepoIdentifier[]) => {
	const allReposFormattedAsTuples = allRepos.map(repo => `(${convert(repo.repo_provider)}, ${convert(repo.repo_owner)}, ${convert(repo.repo_name)})`).join(',');
	const repo_list_q = `SELECT *
		FROM repos 
		WHERE (repo_provider, repo_owner, repo_name) IN (${allReposFormattedAsTuples})`;
	const result: { rows: DbRepo[] } = await conn.query(repo_list_q).catch(err => {
		console.error(`[RepoList] Error in getting repository-list from the database`, err);
		throw Error(err); // FIXME: handle this more elegantly
	});
	return result.rows
}

export const setRepoConfig = async (repo: RepoIdentifier, configType: 'auto_assign' | 'comment', value: boolean) => {
	const update_repo_config_q = `UPDATE repos 
	SET config = jsonb_set(config::jsonb, '{${configType}}', to_jsonb(${convert(value)}))
	WHERE repo_provider = ${convert(repo.repo_provider)}
		AND repo_owner = ${convert(repo.repo_owner)}
		AND repo_name = ${convert(repo.repo_name)}`;
	const dbResponse = await conn.query(update_repo_config_q).catch(err => {
		console.error(`[db/setRepoConfig] Could not update config of this repository: ${repo}`, err);
	})
	return dbResponse;
};