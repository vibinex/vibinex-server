import conn from '.';
import AuthInfo from '../../types/AuthInfo';
import { convert } from './converter';
import { v4 as uuidv4 } from 'uuid';

export interface DbUser {
	id?: string,
	name?: string,
	profile_url?: string,
	auth_info?: AuthInfo,
	aliases?: Array<string>,
	org?: string,
	code_url?: Array<string>,
	social_url?: Array<string>,
	repos?: Array<number>,
}

export const getUserByProvider = async (provider: string, providerAccountId: string) => {
	const user_auth_search_q = `SELECT *
		FROM users
		WHERE (auth_info -> '${provider}' -> '${providerAccountId}') IS NOT NULL`
	const user_auth_search_result = await conn.query(user_auth_search_q);
	if (user_auth_search_result.rowCount) {
		if (user_auth_search_result.rowCount > 1) {
			console.warn("[getUser] Multiple users exist with same auth", { provider, providerAccountId });
		}
		return user_auth_search_result.rows[0];
	}
	return undefined;
}

export const getUserByAlias = async (alias_email: string): Promise<DbUser[] | undefined> => {
	const user_alias_search_q = `SELECT *
		FROM users
		WHERE '${alias_email}' = ANY(aliases)`;
	const user_alias_search_result = await conn.query(user_alias_search_q).catch(err => {
		console.error(`[users/getUserByAlias] Query failed: Select from users where aliases contain ${alias_email}`, err);
	});

	if (user_alias_search_result && user_alias_search_result.rowCount) {
		console.debug(`${user_alias_search_result.rowCount} user(s) exist with this email as an alias.`);
		return user_alias_search_result.rows;
	}
	return undefined;
}

export const createUser = async (user: DbUser) => {
	const { ...others } = user;
	const id = uuidv4()
	const insert_obj = [...Object.entries(others), ['id', id]].filter(([k, v]) => v);
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

/**
 * @param userId The id of the user in the database, that needs to be updated
 * @param user updated user object (please only include fields that have changed)
 */
export const createUpdateUserObj = async (userId: string, user: DbUser) => {
	const user_q = `SELECT * FROM users WHERE id = ${convert(userId)}`;
	const user_result = await conn.query(user_q).catch(err => {
		throw Error("Error in running the query on the database", err);
	});
	if (user_result.rowCount == 0) return;

	const currUser: DbUser = user_result.rows[0];
	const diffObj: DbUser = {};
	for (const key in user) {
		switch (key) {
			case 'id':
				break;
			case 'name': case 'profile_url':
				if (currUser[key] != user[key]) {
					diffObj[key] = user[key];
				}
				break;
			case 'aliases':
				// this only adds additional aliases. Create a separate function to
				// replace or delete aliases, so that old aliases are not lost by mistake
				const newAliases: string[] = [];
				for (const alias of user.aliases!) {
					if (!currUser.aliases?.includes(alias)) {
						newAliases.push(alias);
					}
				}
				if (newAliases.length > 0) diffObj.aliases = currUser.aliases?.concat(newAliases);
				break;
			case 'auth_info':
				if (!currUser.auth_info) {
					diffObj.auth_info = user.auth_info;
					break;
				}
				const diffAuth = currUser.auth_info;
				for (const provider in user.auth_info) {
					if (Object.keys(currUser.auth_info).includes(provider)) {
						for (const providerAccountId in user.auth_info[provider]) {
							if (Object.keys(currUser.auth_info[provider]).includes(providerAccountId)) {
								const currAuthObj = currUser.auth_info[provider][providerAccountId];
								const newAuthObj = user.auth_info[provider][providerAccountId];

								if (!(newAuthObj.expires_at && currAuthObj.expires_at && newAuthObj.expires_at < currAuthObj.expires_at)) {
									diffAuth[provider][providerAccountId] = newAuthObj;
								}
								if ((newAuthObj.handle && !currAuthObj.handle) || (newAuthObj.handle != currAuthObj.handle)) {
									diffAuth[provider][providerAccountId] = newAuthObj;
								}
							} else {
								diffAuth[provider][providerAccountId] = user.auth_info[provider][providerAccountId];
							}
						}
					} else {
						diffAuth[provider] = user.auth_info[provider];
					}
				}
				diffObj.auth_info = diffAuth;
				break;
			default:
				console.warn("[updateUser] Not implemented. Field: " + key);
				break;
		}
	}
	return diffObj;
}

/**
 * Uses the `createUpdateUserObj` function to update the user in the database
 * @param userId The id of the user in the database, that needs to be updated
 * @param user updated user object (please only include fields that have changed)
 */
export const updateUser = async (userId: string, user: DbUser) => {
	const diffObj = await createUpdateUserObj(userId, user).catch(err => {
		console.error(`[createUpdateUserObj] Something went wrong`, err);
	});
	if (!diffObj || Object.keys(diffObj).length == 0) return;
	const update_user_q = `UPDATE users
		SET ${Object.entries(diffObj).map(([key, value]) => `${key} = ${convert(value)}`).join(", ")}
		WHERE id = ${convert(userId)} `;
	conn.query(update_user_q)
		.then(update_user_result => {
			if (update_user_result.rowCount == 1) {
				console.debug('[updateUser] User updated successfully', { userId, user });
			} else {
				console.warn('[updateUser] Something went wrong', { userId, user })
			}
		})
		.catch(err => {
			console.error('[updateUser] Update user failed', { userId, user }, err);
			return;
		});
}