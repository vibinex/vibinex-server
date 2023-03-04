import conn from '.';

export type DbUser = {
	id: number,
	name: string,
	profile_url: string,
	role: string,
	auth_info: object,
	aliases: Array<string>,
	org: string,
	code_url: Array<string>,
	social_url: Array<string>,
	repos: Array<number>,
}

export const getUserByProvider = async (provider: string, providerAccountId: string) => {
	const user_auth_search_q = `SELECT *
		FROM users
		WHERE (auth_info -> '${provider}' ->> 'id') = '${providerAccountId}'`
	const user_auth_search_result = await conn.query(user_auth_search_q);
	if (user_auth_search_result.rowCount) {
		if (user_auth_search_result.rowCount > 1) {
			console.warn("[getUser] Multiple users exist with same auth", { provider, providerAccountId });
		}
		console.log("already signed up with these credentials")
		return user_auth_search_result.rows[0];
	}
	return undefined;
}

export const getUserByAlias = async (alias_email: string) => {
	const user_alias_search_q = `SELECT *
		FROM users
		WHERE '${alias_email}' = ANY(aliases)`;
	const user_alias_search_result = await conn.query(user_alias_search_q);

	if (user_alias_search_result.rowCount) {
		console.debug(`${user_alias_search_result.rowCount} user(s) exist with this email as an alias.`);
		return user_alias_search_result.rows;
	}
	return undefined;
}