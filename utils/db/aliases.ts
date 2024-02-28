import conn from '.';
import { AliasMap, AliasProviderMap } from '../../types/AliasMap';
import { DbUser } from './users';

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

export const getGitEmailAliasesFromDB = async (userId: string): Promise<AliasProviderMap> =>  {
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
    const { rows } = await conn.query(query, [userId]).catch(err => {
        console.error(`[getGitEmailAliasesFromDB] Error getting aliases for user ${userId}:`, err);
        throw new Error("Error getting aliases from the database");
    })
    console.info(`[getGitEmailAliasesFromDB] Got aliases for user: ${userId}, rows = ${rows}`);
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
            const ghValue = githubHandle !== null ? `ARRAY['${githubHandle}']` : 'NULL';
            const bbValue = bitbucketHandle !== null ? `ARRAY['${bitbucketHandle}']` : 'NULL';
            values.push(`('${alias}', ${ghValue}, ${bbValue})`);
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

// Function to process and update alias information in the database
const processProviderInfoForAliasPopulation = async (alias: string, handle: string, provider: string) => {
	const column = provider === 'github' ? 'github' : 'bitbucket';
  
	// Check if the alias exists and update or insert accordingly
	await conn.query('SELECT alias FROM aliases WHERE alias = $1', [alias])
	.then(async (result) => {
		if (result.rows.length > 0) {
			// Alias exists, update it
			const query = `
			UPDATE aliases SET ${column} = array_append(${column}, $1) 
			WHERE alias = $2 AND NOT (${column} @> ARRAY[$1]::TEXT[])
			`
			await conn.query(query, [handle, alias])
			.then(() => {
				console.info(`[processProviderInfoForAliasPopulation] Aliases are updated in aliases table.`);
			})
			.catch((error) => {
				console.error(`[processProviderInfoForAliasPopulation] Error updating aliases to the database:`, error);
			});
		} else {
			// Alias does not exist, insert a new one
			const query = `
			INSERT INTO aliases (alias, ${column}) VALUES ($1, ARRAY[$2]::TEXT[])
			`
			await conn.query(query, [alias, handle])
			.then(() => {
				console.info(`[processProviderInfoForAliasPopulation] New aliases are inserted in aliases table.`);
			})
			.catch((error) => {
				console.error(`[processProviderInfoForAliasPopulation] Error inserting aliases to the database:`, error);
			});

		}
	})
	.catch(error => {
		console.error(`[processProviderInfoForAliasPopulation] Failed to process provider info for alias: ${alias}`, error);
	})
  };
  
export const updateAliasesTableFromUsersTableOnLogin = async (userObj: DbUser) => {
	console.log(`[updateAliasesTableFromUsersTableOnLogin] userObj: ${userObj}`);
	const { aliases, auth_info } = userObj;
	const providers = ['github', 'bitbucket'];

	if (!aliases || !auth_info) {
		console.info(`[updateAliasesTableFromUsersTableOnLogin] Both aliases and auth_info should be defined for user: ${userObj}`);
		return;
	}

	const tasks = aliases.flatMap(alias => {
		return Object.entries(auth_info).flatMap(([provider, accounts]) => {
			if (providers.includes(provider)) {
				return Object.values(accounts).map(account => {
					const handle = account.handle;
					if (handle && typeof handle === 'string') {
						return processProviderInfoForAliasPopulation(alias, handle, provider)
						.catch(error => console.error(`[updateAliasesTableFromUsersTableOnLogin] Error updating alias ${alias} for provider ${provider}`, error));
					} else {
						console.info(`[updateAliasesTableFromUsersTableOnLogin] Provider handle is not defined for user: ${userObj.id} with  provider: ${provider}`);
					}
				});
			}
			return [];
		});
	});
  
	Promise.all(tasks)
	.then(() => console.info(`[updateAliasesTableFromUsersTableOnLogin] All aliases have been updated successfully`))
	.catch(error => console.error(`[updateAliasesTableFromUsersTableOnLogin] An error occurred while updating aliases`, error));
};
