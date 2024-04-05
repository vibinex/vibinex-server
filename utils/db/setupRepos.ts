import conn from '.';
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
        SELECT repo_name, ARRAY[$4]::INT[], $1, $2
        FROM unnest($3::TEXT[]) AS t(repo_name)
        ON CONFLICT (repo_name) DO UPDATE
            SET install_ids = CASE
            WHEN NOT (repos.install_id && ARRAY[$4]::INT[]) -- user's install_id not present
            THEN repos.install_id || $4 -- append user's install_id
            ELSE repos.install_id -- no update needed
            END,
            repo_owner = $1,
            repo_provider = $2
        RETURNING id AS repo_id;
    `;
    try {
        await conn.query('BEGIN');
        const { rowCount: reposRowCount, rows } = await conn.query(insertReposQuery, [repo_owner, repo_provider, repo_names, install_id]);
        if (reposRowCount === 0) {
            await conn.query('ROLLBACK');
            console.error(`[saveSetupRepos] No repositories were inserted or updated for: ${install_id}, ${repo_names}`);
            return false;
        }
    
        const repoIds = rows.map((row) => row.repo_id);
        const insertRepoConfigSuccess = await insertRepoConfig(userId, repoIds);
    
        if (!insertRepoConfigSuccess) {
            await conn.query('ROLLBACK');
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
