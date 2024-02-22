import conn from '.';
import { AliasMap, AliasProviderMap, HandleMap } from '../../types/AliasMap';
import { supportedProviders } from '../providerAPI';

export const saveUserAliasesToRepo = async (repo_name: string, repo_owner: string, repo_provider: string, aliases: string[]) => {
    // Filter out empty strings and null values
    const filteredAliases = aliases.filter(alias => alias && alias.trim() !== "");

    // Filter out duplicates
    const uniqueAliases = filteredAliases.filter((value, index, self) => self.indexOf(value) === index);

    // Convert unique aliases array to a comma-separated string enclosed in curly braces
    const aliasesString = `{${uniqueAliases.join(',')}}`;

    const query = `
        UPDATE repos 
        SET aliases = array(
            SELECT DISTINCT unnest(aliases || '${aliasesString}')
        )
        WHERE repo_name = '${repo_name}'
            AND repo_owner = '${repo_owner}'
            AND repo_provider = '${repo_provider}'
    `;
    await conn.query(query).catch(err => {
        console.error(`[saveUserAliasesToDb] Error saving aliases for repo ${repo_name} and owner ${repo_owner}:`, err);
        throw new Error("Error saving aliases to the database");
    })
};

export const getUserAliasesFromRepo = async (repo_name: string, repo_owner: string, repo_provider: string) => {
    let handleColumn = repo_provider === 'github' ? 'github' : 'bitbucket';

    const query = `
        SELECT a.git_alias, a.${handleColumn}
        FROM aliases a
        INNER JOIN repos r ON a.git_alias = ANY(r.aliases)
        WHERE r.repo_name = $1
            AND r.repo_owner = $2
            AND r.repo_provider = $3;
    `;
    const { rows } = await conn.query(query, [repo_name, repo_owner, repo_provider]).catch(err => {
        console.error(`[getUserAliasesFromDb] Error getting aliases for repo ${repo_name} and owner ${repo_owner}:`, err);
        throw new Error("Error getting aliases from the database");
    })
    const aliases = rows.map(row => ({
        git_alias: row.git_alias,
        [handleColumn]: row[handleColumn]
    }));
    return aliases;
};

export const getGitEmailAliasesFromDB = async (user_id: string): Promise<AliasProviderMap> =>  {
    console.error("[getGitEmailAliasesFromDB] user_id = ", user_id);
    const query = `
    SELECT 
        git_alias,
        COALESCE(
            ARRAY(SELECT DISTINCT github FROM unnest(github) AS github WHERE github IS NOT NULL),
            ARRAY[]::text[]
        ) AS github_handles,
        COALESCE(
            ARRAY(SELECT DISTINCT bitbucket FROM unnest(bitbucket) AS bitbucket WHERE bitbucket IS NOT NULL),
            ARRAY[]::text[]
        ) AS bitbucket_handles
    FROM (
        SELECT 
            repo_alias AS git_alias,
            a.github,
            a.bitbucket
        FROM 
            (SELECT unnest(r.aliases) AS repo_alias FROM repos r
            LEFT JOIN users u ON u.topic_name = ANY(r.install_id)
            WHERE u.id = $1 OR u.id IS NULL) AS repo_aliases
        LEFT JOIN 
            aliases a ON repo_aliases.repo_alias = a.git_alias
        GROUP BY 
            repo_alias, a.github, a.bitbucket
    ) AS final_result;
    `;
    const { rows } = await conn.query(query, [user_id]).catch(err => {
        console.error(`[getGitEmailAliasesFromDB] Error getting aliases for user ${user_id}:`, err);
        throw new Error("Error getting aliases from the database");
    })
    console.info(`[getGitEmailAliasesFromDB] Got aliases for user: ${user_id}, rows = ${rows}`);
    const providerMaps: AliasMap[] = [];
    // Loop through each row and populate the map
    rows.forEach(row => {
        const aliasMap: AliasMap = {
            alias: row.git_alias,
            handleMaps: [
                { provider: 'github', handles: row.github_handles },
                { provider: 'bitbucket', handles: row.bitbucket_handles }
            ]
        };        
        providerMaps.push(aliasMap);
    });
    const aliasProvider: AliasProviderMap = { providerMaps: providerMaps};
    return aliasProvider;
}

export const saveGitAliasMapToDB = async (aliasProviderMap: AliasProviderMap) => {
    console.error(`[saveGitAliasMapToDB] hmap = ${aliasProviderMap}`)
    const values: string[] = [];
    for (const aliasMap of aliasProviderMap.providerMaps) {
        const { alias, handleMaps } = aliasMap;
        let githubHandle = null;
        let bitbucketHandle = null;

        for (const handleMap of handleMaps) {
            if (handleMap.provider === 'github' && handleMap.handles.length > 0) {
                githubHandle = handleMap.handles.join("','");
            } else if (handleMap.provider === 'bitbucket' && handleMap.handles.length > 0) {
                bitbucketHandle = handleMap.handles.join("','");
            }
        }

        if (githubHandle !== null || bitbucketHandle !== null) {
            values.push(`('${alias}', ${githubHandle !== null ? `ARRAY['${githubHandle}']` : 'NULL'}, ${bitbucketHandle !== null ? `ARRAY['${bitbucketHandle}']` : 'NULL'})`);
        }
    }

    if (values.length <= 0) {
        console.info(`[saveGitAliasMapToDB] No new values to insert.`);
    }
    const valuesClause = values.join(', ');
    const query = `
        INSERT INTO aliases (git_alias, github, bitbucket)
        VALUES ${valuesClause}
        ON CONFLICT (git_alias) DO UPDATE SET 
            github = (
                SELECT ARRAY(SELECT DISTINCT UNNEST(aliases.github || excluded.github))
                FROM aliases
                WHERE aliases.git_alias = excluded.git_alias
            ),
            bitbucket = (
                SELECT ARRAY(SELECT DISTINCT UNNEST(aliases.bitbucket || excluded.bitbucket))
                FROM aliases
                WHERE aliases.git_alias = excluded.git_alias
            );
    `;

    await conn.query(query)
    .then(() => {
        console.info(`[saveGitAliasMapToDB] Saved entries.`);
    })
    .catch((error) => {
        console.error(`[saveGitAliasMapToDB] Error saving entries to the database:`, error);
    });
};

