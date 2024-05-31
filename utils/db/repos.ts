import type { Session } from 'next-auth';
import conn from '.';
import type { DbRepo, RepoIdentifier } from '../../types/repository';
import { convert } from './converter';
import { BitbucketRepoObj } from '../providerAPI/getUserRepositories';

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
			) AS config,
			r.install_id AS install_id,
			r.aliases AS aliases
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

export const getUserRepositoriesByTopic = async (topicId: string, provider: string) => {
	const getRepoQuery = `SELECT repo_name, repo_owner, repo_provider
	FROM repos
	WHERE repo_provider = ${convert(provider)} AND ${convert(topicId)} = ANY(install_id)`;
	const repos: RepoIdentifier[] = await conn.query(getRepoQuery)
		.then((dbResponse) => {
			return dbResponse.rows.map((row) => ({
				repo_name: row.repo_name,
				repo_owner: row.repo_owner,
				repo_provider: row.repo_provider,
			}));
		})
		.catch((err: Error) => {
			console.error(`[db/getUserRepositoriesByTopic] Could not get repos for topic id ${topicId}, query - ${getRepoQuery}`, err);
			throw new Error("Unable to get user repos by topic");
		});
	return repos;
}

export const setRepoConfig = async (repo: RepoIdentifier, userId: string, configType: 'auto_assign' | 'comment', value: boolean) => {
	const configTypeColumn = configType === 'comment' ? 'comment_setting' : 'auto_assign';
	const update_repo_config_q = `UPDATE repo_config
	SET 
		comment_setting = CASE WHEN '${configTypeColumn}' = 'comment_setting' THEN ${convert(value)} ELSE comment_setting END,
		auto_assign = CASE WHEN '${configTypeColumn}' = 'auto_assign' THEN ${convert(value)} ELSE auto_assign END
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
		WHERE rc.repo_id = (SELECT id FROM repos WHERE repo_provider = $1
			AND repo_owner = $2
			AND repo_name = $3)`;

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

export const getRepoConfigByUserAndRepo = async (provider: string, repoName: string, repoOwner: string, userId: string) => {
	console.info(`[getRepoConfig] Getting repo config for user: ${userId} and repo: ${repoName}`);
	const query = `
	SELECT json_build_object(
		'auto_assign', rc.auto_assign,
		'comment', rc.comment_setting
	) AS config,
	rc.user_id AS user_id
	FROM repo_config rc
	WHERE repo_id = (SELECT r.id FROM repos r 
		WHERE r.repo_name = '${repoName}' AND
		r.repo_owner = '${repoOwner}' AND
		r.repo_provider = '${provider}')
	`;
	const result = await conn.query(query).catch(err => {
		console.error(`[getRepoConfigByUserAndRepo] Could not get repo config for: ${userId}, ${repoName}`,
			{ pg_query: query }, err);
		throw new Error("Error in running the query on the database", err);
	});
	if (result.rows.length === 0) {
		throw new Error('No repo config found');
	}
	if (result.rows.length === 1) {
		return result.rows[0].config;
	}
	const userRows = result.rows.filter((rowVal) => rowVal.user_id === userId);
	if (userRows.length === 0) {
		// return some default
		console.error(`[getRepoConfigByUserAndRepo] Repo config not found for user: ${userId}. Sending default configuration: {auto_assign: false, comment: false}.`);
		return { auto_assign: false, comment: false };
	}
	return userRows[0].config;
}

export const insertRepoConfig = async (userId: string, repoIds: number[]) => {
	const query = `
		INSERT INTO repo_config (repo_id, user_id, auto_assign, comment_setting)
		SELECT id, $1, true, true
		FROM unnest($2::INT[]) AS t(id)
		ON CONFLICT DO NOTHING
		`;
	const params = [userId, repoIds];

	const isQuerySuccessful = await conn.query(query, params)
		.then((dbResponse) => {
			if (dbResponse.rowCount == 0) {
				console.info(`[db/insertRepoConfig] No new repo config added for user: ${userId}. Either the repo is already configured for the user or the insert query failed`);
			}
			return true;
		})
		.catch((err: Error) => {
			console.error(`[db/insertRepoConfigOnSetup] Could not insert repo config for the repos: ${repoIds}`, { pg_query: query }, err);
			return false;
		})
	return isQuerySuccessful;
}

export const removeRepoConfigForInstallIdForOwner = async (installId: string, repoNamesToBeRetained: string[], repoOwner: string, repoProvider: string, userId: string) => {
	const deleteRepoConfigQuery = `
		DELETE FROM repo_config
		WHERE repo_id IN (
			SELECT id
			FROM repos
			WHERE install_id && ARRAY[$1]
				AND repo_name NOT IN (SELECT unnest($2::TEXT[]))
				AND repo_owner = $3
				AND repo_provider = $4
			)
		AND user_id = $5;
	`;

	const result = await conn.query(deleteRepoConfigQuery, [installId, repoNamesToBeRetained, repoOwner, repoProvider, userId])
		.catch((err) => {
			console.error(`[removeRepoConfig] Could not remove repo config for: ${userId}, ${repoNamesToBeRetained}`, { pg_query: deleteRepoConfigQuery }, err);
			throw new Error("Error in running the query on the database", err);
		});
	if (result.rowCount === 0) {
		console.error(`[removeRepoConfig] No repo config found to remove`);
	}
	console.debug(`[removeRepoConfig] Previous repoConfig removed for ${installId} and ${userId}`);
}

export const saveBitbucketReposInDb = async (repos: BitbucketRepoObj[]): Promise<boolean> => {
	const insertReposQuery = `
		INSERT INTO repos (
			repo_name,
			repo_owner,
			repo_provider,
			clone_ssh_url,
			is_private,
			project
		)
		SELECT 
			repo_obj->>'name' AS repo_name,
			repo_obj->'workspace'->>'slug' AS repo_owner,
			'bitbucket' AS repo_provider,
			(SELECT clone->>'href' 
			FROM jsonb_array_elements(repo_obj->'links'->'clone') AS clone 
			WHERE clone->>'name' = 'ssh') AS clone_ssh_url,
			(repo_obj->>'is_private')::BOOLEAN AS is_private,
			repo_obj->'project' AS project
		FROM 
			unnest(${convert(repos)}) AS t(repo_obj)
		ON CONFLICT (repo_name, repo_owner, repo_provider) DO NOTHING
		return id as repo_id;
	`
	try {
        await conn.query('BEGIN');
        console.debug(`[saveBitbucketReposInDb] insert query: `, insertReposQuery);
        const { rowCount: reposRowCount, rows } = await conn.query(insertReposQuery)
        .catch(err => {
            console.error(`[saveBitbucketReposInDb] Could not insert repos in the db`, { pg_query: insertReposQuery }, err);
            throw err;
        });
        if (reposRowCount === 0) {
            await conn.query('ROLLBACK');
            console.error(`[saveBitbucketReposInDb] No repositories were inserted or updated in db`);
            return false;
        }
    
        const repoIds = rows.map((row) => row.repo_id);
        await conn.query('COMMIT');
        console.debug(`[saveBitbucketReposInDb] repos info saved successfully in db`)
        return true;
    } catch (err) {
        await conn.query('ROLLBACK');
        console.error(`[saveBitbucketReposInDb] Could not save setup repos`, { pg_query: insertReposQuery }, err);
        return false;
    }
}