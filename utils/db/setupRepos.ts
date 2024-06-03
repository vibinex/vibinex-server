import conn from '.';
import { convert } from './converter';
import { insertRepoConfig } from './repos';

export interface SetupReposArgs {
    repo_owner: string;
    repo_provider: string;
    repo_names: string[];
    install_id: string;
}

export const saveSetupReposInDb = async (args: SetupReposArgs, userId: string): Promise<boolean> => {
    const { repo_owner, repo_provider, repo_names, install_id } = args;
    const insertReposQuery = `
		INSERT INTO repos (repo_name, install_id, repo_owner, repo_provider)
		SELECT repo_name, ARRAY[${convert(install_id)}], ${convert(repo_owner)}, ${convert(repo_provider)}
		FROM unnest(${convert(repo_names)}::TEXT[]) AS t(repo_name)
		ON CONFLICT (repo_name, repo_owner, repo_provider) DO UPDATE
			SET install_id = CASE
			WHEN NOT (repos.install_id && ARRAY[${convert(install_id)}]) -- user's install_id not present
			THEN repos.install_id || ARRAY[${convert(install_id)}] -- append user's install_id
			ELSE repos.install_id -- no update needed
			END,
			repo_owner = ${convert(repo_owner)},
			repo_provider = ${convert(repo_provider)}
		RETURNING id AS repo_id;
	`;
    try {
        await conn.query('BEGIN');
        console.debug(`[saveSetupReposInDb] insert query: `, insertReposQuery);
        const { rowCount: reposRowCount, rows } = await conn.query(insertReposQuery)
            .catch(err => {
                console.error(`[saveSetupReposInDb] Could not insert repos for user (${userId}) in the ${args.repo_owner} workspace on ${args.repo_provider}`, { pg_query: insertReposQuery }, err);
                throw err;
            });
        if (reposRowCount === 0) {
            await conn.query('ROLLBACK');
            console.error(`[saveSetupRepos] No repositories were inserted or updated for: ${install_id}, ${repo_names}`);
            return false;
        }

        const repoIds = rows.map((row) => row.repo_id);
        const insertRepoConfigSuccess = await insertRepoConfig(userId, repoIds);

        if (!insertRepoConfigSuccess) {
            await conn.query('ROLLBACK');
            console.error(`[saveSetupRepos] Could not insert repo configs for: ${install_id}, ${repo_names}`);
            return false;
        }
        await conn.query('COMMIT');
        console.debug(`[saveSetupRepos] setup repos info saved successfully in db`)
        return true;
    } catch (err) {
        await conn.query('ROLLBACK');
        console.error(`[saveSetupRepos] Could not save setup repos for: ${install_id}, ${repo_names}`, { pg_query: insertReposQuery }, err);
        return false;
    }
};

export const saveSelectedReposInDb = async (args: SetupReposArgs, userId: string): Promise<boolean> => {
    const { repo_owner, repo_provider, repo_names, install_id } = args;
    const insertReposQuery = `
		INSERT INTO repos (repo_provider, repo_owner, repo_name, user_selected)
		SELECT ${convert(repo_provider)}, ${convert(repo_owner)}, repo_name, ARRAY[${convert(install_id)}]}}
		FROM unnest(${convert(repo_names)}::TEXT[]) AS t(repo_name)
		ON CONFLICT (repo_provider, repo_owner, repo_name) DO UPDATE
			SET user_selected = CASE
			WHEN NOT (repos.user_selected && ARRAY[${convert(install_id)}]) -- user's install_id not present
			THEN repos.user_selected || ARRAY[${convert(install_id)}] -- append user's install_id
			ELSE repos.user_selected -- no update needed
			END,
			repo_provider = ${convert(repo_provider)},
			repo_owner = ${convert(repo_owner)}
		RETURNING id AS repo_id;
	`;
    try {
        await conn.query('BEGIN');
        console.debug(`[saveSelectedReposInDb] insert query: `, insertReposQuery);
        const { rowCount: reposRowCount, rows } = await conn.query(insertReposQuery)
            .catch(err => {
                console.error(`[saveSelectedReposInDb] Could not insert selected repos for user (${userId}) in the ${args.repo_owner} workspace on ${args.repo_provider}`, { pg_query: insertReposQuery }, err);
                throw err;
            });
        if (reposRowCount === 0) {
            await conn.query('ROLLBACK');
            console.error(`[saveSelectedReposInDb] No repositories were inserted or updated for: ${install_id}, ${repo_names}`);
            return false;
        }

        await conn.query('COMMIT');
        console.debug(`[saveSelectedReposInDb] setup repos info saved successfully in db`)
        return true;
    } catch (err) {
        await conn.query('ROLLBACK');
        console.error(`[saveSelectedReposInDb] Could not save setup repos for: ${install_id}, ${repo_names}`, { pg_query: insertReposQuery }, err);
        return false;
    }
};

export const removePreviousInstallations = async (install_id: string, provider: string) => {
    const query = `UPDATE repos
	SET install_id = array_remove(install_id, '${install_id}')
	WHERE '${install_id}' = ANY (install_id) AND repo_provider = '${provider}';
	`;
    await conn.query(query).catch(err => {
        console.error(`[removePreviousInstallations] Could not remove previous repos for ${install_id}`);
        throw new Error('Failed to remove previous repos');
    });
    console.debug(`[removePreviousInstallations] Previous installations removed for ${install_id}`);
}

export const removePreviousSelections = async (install_id: string, provider: string) => {
    const query = `UPDATE repos
	SET user_selected = array_remove(install_id, '${install_id}')
	WHERE '${install_id}' = ANY (user_selected) AND repo_provider = '${provider}';
	`;
    await conn.query(query).catch(err => {
        console.error(
            `[removePreviousSelections] Could not remove previous repo selections for ${install_id}`);
        throw new Error('Failed to remove previous repos');
    });
    console.debug(`[removePreviousSelections] Previous selections removed for ${install_id}`);
}
