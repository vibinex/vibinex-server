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
    SELECT git_alias,
        ARRAY_AGG(github) AS github_handles,
        ARRAY_AGG(bitbucket) AS bitbucket_handles
    FROM aliases
    WHERE git_alias IN (
        SELECT UNNEST(aliases)
        FROM repos
        WHERE install_id = (
            SELECT topic_name
            FROM users
            WHERE user_id = $1
        )
    )
    GROUP BY git_alias;
    `;
    const { rows } = await conn.query(query, [user_id]).catch(err => {
        console.error(`[getGitEmailAliasesFromDB] Error getting aliases for user ${user_id}:`, err);
        throw new Error("Error getting aliases from the database");
    })
    console.info(`[getGitEmailAliasesFromDB] Got aliases for user: ${user_id}`);
    const aliasesMap = new Map();

    // Loop through each row and populate the map
    const githubHandles: AliasMap[] = [];
    const bitbucketHandles: AliasMap[] = [];
    rows.forEach(row => {
        if (row.github_handles) {
            const githubMap: AliasMap = { alias: row.git_alias, handles: row.github_handles};
            githubHandles.push(githubMap);
        }
        if (row.bitbucket_handles) {
            const bitbucketMap: AliasMap = { alias: row.git_alias, handles: row.bitbucket_handles};
            bitbucketHandles.push(bitbucketMap);
        }
    });
    const aliasProvider: AliasProviderMap = { aliases: [
        {provider: supportedProviders[0], handles: githubHandles},
        {provider: supportedProviders[1], handles: bitbucketHandles}
    ]};
    return aliasProvider;
}

export const saveGitAliasMapToDB = async (hMap: HandleMap) => {
    try {
        // Construct the values array for multiple inserts or updates
        const columnName = hMap.provider;
        const values = hMap.handles.map(
            (alias_map) => 
            `('${alias_map.alias}', ARRAY(SELECT DISTINCT UNNEST(${columnName} || ${JSON.stringify(alias_map.handles)})))`).join(', ');

        // Query to insert or update multiple rows
        const query = `
            INSERT INTO aliases (git_alias, ${columnName})
            VALUES ${values}
            ON CONFLICT (git_alias) DO UPDATE SET ${columnName} = ARRAY(SELECT DISTINCT UNNEST(EXCLUDED.${columnName} || ${columnName}));
        `;

        // Execute the query
        await conn.query(query);
        console.info(`[saveGitAliasMapToDB] Saved ${hMap.handles.length} entries for ${hMap.provider}.`);
    } catch (error) {
        console.error(`[saveGitAliasMapToDB] Error saving entries to the database:`, error);
        // Handle the error as per your application's requirements
    }
}

