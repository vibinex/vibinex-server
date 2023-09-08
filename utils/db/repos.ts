import conn from '.';
import type { RepoIdentifier } from '../../types/repository';
import { convert } from './converter';

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