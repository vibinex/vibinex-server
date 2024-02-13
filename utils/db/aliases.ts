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
