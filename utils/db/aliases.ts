import conn from '.';
import { AliasMap, AliasProviderMap } from '../../types/AliasMap';
import { convert } from './converter';
import { DbUser, getUserById } from './users';

export const saveUserAliasesToRepo = async (repoName: string, repoOwner: string, repoProvider: string, aliases: string[]) => {
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
        WHERE repo_name = '${repoName}'
            AND repo_owner = '${repoOwner}'
            AND repo_provider = '${repoProvider}'
    `;
    await conn.query(query).catch(err => {
        console.error(`[saveUserAliasesToDb] Error saving aliases for repo ${repoName} and owner ${repoOwner}:`, err);
        throw new Error("Error saving aliases to the database");
    })
};

export const getUserAliasesFromRepo = async (repoName: string, repoOwner: string, repoProvider: string) => {
    let handleColumn = repoProvider === 'github' ? 'github' : 'bitbucket';

    const query = `
        SELECT a.git_alias, a.${handleColumn}
        FROM aliases a
        INNER JOIN repos r ON a.git_alias = ANY(r.aliases)
        WHERE r.repo_name = $1
            AND r.repo_owner = $2
            AND r.repo_provider = $3;
    `;
    const { rows } = await conn.query(query, [repoName, repoOwner, repoProvider]).catch(err => {
        console.error(`[getUserAliasesFromDb] Error getting aliases for repo ${repoName} and owner ${repoOwner}:`, err);
        throw new Error("Error getting aliases from the database");
    })
    const aliases = rows.map(row => ({
        git_alias: row.git_alias,
        [handleColumn]: row[handleColumn]
    }));
    return aliases;
};

export const getGitAliasesWithHandlesFromDB = async (userId: string): Promise<AliasProviderMap> => {
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
        FROM (
            SELECT unnest(r.aliases) AS repo_alias FROM repos r
            JOIN users u ON u.topic_name = ANY(r.install_id)
            WHERE u.id = $1 OR u.id IS NULL
        ) AS repo_aliases
        LEFT JOIN 
            aliases a ON repo_aliases.repo_alias = a.git_alias
        GROUP BY 
            repo_alias, a.github, a.bitbucket
    ) AS final_result;
    `;
    const { rows } = await conn.query(query, [userId]).catch(err => {
        console.error(`[getGitEmailAliasesFromDB] Error getting aliases for user ${userId}:`, err);
        throw new Error("Error getting aliases from the database");
    })
    console.info(`[getGitEmailAliasesFromDB] Got aliases for user: ${userId}, rows = ${JSON.stringify(rows)}`);
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

export const saveGitAliasMapToDB = async (aliasMap: AliasMap) => {
    const { alias, handleMaps } = aliasMap;
    let githubHandle = null;
    let bitbucketHandle = null;

    for (const handleMap of handleMaps) {
        if (handleMap.provider === 'github' && handleMap.handles.length > 0) {
            githubHandle = convert(handleMap.handles)
        } else if (handleMap.provider === 'bitbucket' && handleMap.handles.length > 0) {
            bitbucketHandle = convert(handleMap.handles)
        }
    }
    const aliasesRowValue = `('${alias}', ${githubHandle}, ${bitbucketHandle})`;
    const query = `
        INSERT INTO aliases (git_alias, github, bitbucket)
        VALUES ${aliasesRowValue}
        ON CONFLICT (git_alias) DO UPDATE SET 
            github = (
                SELECT ARRAY(SELECT DISTINCT UNNEST(excluded.github))
                FROM aliases
                WHERE aliases.git_alias = excluded.git_alias
            ),
            bitbucket = (
                SELECT ARRAY(SELECT DISTINCT UNNEST(excluded.bitbucket))
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

const updateOrInsertAliasInAliasesTable = async (alias: string, provider: string, handle: string) => {
	if (!handle || handle === '') {
        console.error(`[updateOrInsertAliasInAliasesTable] Empty handle value`);
        return;
    }
    const query = `
		INSERT INTO aliases (git_alias, ${provider})
		VALUES ($1, ARRAY[$2::text])
		ON CONFLICT (git_alias) DO UPDATE
		SET ${provider} = ARRAY(
			SELECT DISTINCT unnest(aliases.${provider} || ARRAY[$2::text])
		)
		`;
	
	await conn.query(query, [alias, handle]).catch(error => {
		console.error(`[updateOrInsertAliasInAliasesTable] Error saving entries to the database:`, error);
	})
	console.info(`[updateOrInsertAliasInAliasesTable] Successfully updated ${provider} handle for alias ${alias} in aliases table in db.`);
};
  
  
export const updateAliasesForUser = async (aliases: Array<string>, userId: string) => {
	const userData: DbUser | null = await getUserById(userId).catch((err) => {
		console.error(`[updateAliasesForUser/getUserById] Error in getting user data`, err);
		return null;
	});
	if (!userData) {
		console.error(`[updateAliasesForUser/getUserById] userData is empty for user with id: ${userId}`);
		return;
	}
	const auth_info = userData.auth_info

	if (!auth_info) {
		console.error(`[updateAliasesForUser] Auth_info should be defined for user with id: ${userId}`);
		return;
	}

	const tasks = [];
	for (const alias of aliases) {
		for (const [provider, accounts] of Object.entries(auth_info)) {
			for (const account of Object.values(accounts)) {
				const handle = account.handle;
				if (handle) {
					tasks.push(updateOrInsertAliasInAliasesTable(alias, provider, handle));
				} else {
					console.info(`[updateAliasesForUser/getUserById] handle is not present for provider: ${provider} for user with id: ${userId}`);
				}
			}
		}
	}
  
	Promise.all(tasks)
	.then(() => console.info(`[updateAliasesForUser] All aliases have been updated successfully`))
	.catch(error => console.error(`[updateAliasesForUser] An error occurred while updating aliases`, error));
};
