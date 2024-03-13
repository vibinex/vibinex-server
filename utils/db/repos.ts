import { Session } from 'next-auth';
import conn from '.';
import type { DbRepo, RepoIdentifier } from '../../types/repository';
import { convert } from './converter';

export const getRepos = async (allRepos: RepoIdentifier[], session: Session) => {
	const userId = session.user.id;
	if (!userId) {
		console.error("[getRepos] No user id in session", session);
		return {
			repos: [],
			failureRate: 1.01
		};
	}
	const batchSize = 50;
	const allDbReposPromises = [];
	for (let index = 0; index < allRepos.length; index += batchSize) {
		const allReposSubset = allRepos.slice(index, index + batchSize);
		const allReposFormattedAsTuples = allReposSubset.map(repo => `(${convert(repo.repo_provider)}, ${convert(repo.repo_owner)}, ${convert(repo.repo_name)})`).join(',');
		const repo_list_q = `SELECT 
			r.id AS id,
			r.repo_provider AS repo_provider,
			r.repo_owner AS repo_owner,
			r.repo_name AS repo_name,
			r.auth_info AS auth_info,
			r.git_url AS git_url,
			r.metadata AS metadata,
			r.created_at AS created_at,
			json_build_object(
				'auto_assign', rc.auto_assign,
				'comment', rc.comment_setting
			) AS config
		FROM 
			repos r
		JOIN 
			repo_config rc ON r.id = rc.repo_id
		WHERE 
			rc.user_id = '${userId}' AND
			(repo_provider, repo_owner, repo_name) IN (${allReposFormattedAsTuples})
		ORDER BY 
			r.repo_provider, r.repo_owner, r.repo_name;`;
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
			failureRate: (allDbReposPromises.length === 0) ? 1.01 : (numFailedPromises / allDbReposPromises.length),
		};
	})

	return allDbRepos;
}

export const setRepoConfig = async (repo: RepoIdentifier, userId: string, configType: 'auto_assign' | 'comment', value: boolean) => {
	const configTypeColumn = configType === 'comment'? 'comment_setting' : 'auto_assign';
	const update_repo_config_q = `UPDATE repo_config
	SET 
		comment = CASE WHEN ${configTypeColumn} = 'comment_setting' THEN ${convert(value)} ELSE comment_setting END,
		auto_assign = CASE WHEN ${configTypeColumn} = 'auto_assign' THEN ${convert(value)} ELSE auto_assign END
	WHERE 
		repo_id = (
			SELECT id FROM public.repos 
			WHERE repo_name = ${convert(repo.repo_name)}
			AND repo_owner = ${convert(repo.repo_owner)}
			AND repo_provider = ${convert(repo.repo_provider)}
		)
		AND user_id = ${convert(userId)}`;
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
		select json_build_object(
			'auto_assign', rc.auto_assign,
			'comment', rc.comment_setting
		) AS config
		from repo_config rc
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
