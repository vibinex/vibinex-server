import conn from '.';

export const saveUserAliasesToDb = async (repo_name: string, repo_owner: string, repo_provider: string, aliases: string[]) => {
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

export const getUserAliasesFromDb = async (repo_name: string, repo_owner: string, repo_provider: string) => {
    let handleColumn = repo_provider === 'github' ? 'github' : 'bitbucket';

    const query = `
        SELECT a.git_alias, a.${handleColumn}
        FROM aliases a
        INNER JOIN repos r ON a.git_alias = ANY(r.aliases)
        WHERE r.repo_name = $1
            AND r.repo_owner = $2
            AND r.repo_provider = $3;
    `;
    try {
        const { rows } = await conn.query(query, [repo_name, repo_owner, repo_provider]);
        const aliases = rows.map(row => ({
            git_alias: row.git_alias,
            [handleColumn]: row[handleColumn]
        }));
        return aliases;
    } catch (error) {
        console.error(`Error getting aliases for repo ${repo_name} and owner ${repo_owner}:`, error);
        throw new Error("Error getting aliases from the database");
    }
};