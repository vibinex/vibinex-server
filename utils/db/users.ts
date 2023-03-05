import conn from '.';
import { convert } from './converter';

export type DbUser = {
	id: number | undefined,
	name: string | undefined,
	profile_url: string | undefined,
	auth_info: object | undefined,
	aliases: Array<string> | undefined,
	org: string | undefined,
	code_url: Array<string> | undefined,
	social_url: Array<string> | null,
	repos: Array<number> | null,
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

export const createUser = async (user: DbUser) => {
	const { id, ...others } = user;
	const insert_obj = Object.entries(others).filter(([k, v]) => v);
	const keys = insert_obj.map(x => x[0]);
	const values = insert_obj.map(x => convert(x[1]));

	const insert_user_q = `INSERT INTO users (${keys.join(', ')}) VALUES (${values.join(', ')})`
	conn.query(insert_user_q)
		.then(insert_user_result => {
			if (insert_user_result.rowCount == 1) {
				console.debug('[createUser] User created successfully', { user });
			} else {
				console.warn('[createUser] Something went wrong', { user })
			}
		})
		.catch(err => {
			console.error('[createUser] Insert user failed', { user }, err);
			return;
		});
}