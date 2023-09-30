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
	const user_auth_search_result = await conn.query(user_auth_search_q).catch(err => {
		console.error(`[getUserByProvider] Could not get the ${provider} user for account id: ${providerAccountId}`, { pg_query: user_auth_search_q }, err);
		throw new Error("Error in running the query on the database", err);
	});;
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
		console.error(`[users/getUserByAlias] Query failed: Select from users where aliases contain ${alias_email}`, { pg_query: user_alias_search_q }, err);
	});

	if (user_alias_search_result?.rowCount) {
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
			console.error('[createUser] Insert user failed', { user, pg_query: insert_user_q }, err);
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
		console.error(`[createUpdateUserObj] Could not get the user for user-id: ${userId}`, { pg_query: user_q }, err)
		throw new Error("Error in running the query on the database", err);
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
				diffObj.auth_info = calculateAuthDiff(currUser.auth_info, user.auth_info);
				break;
			default:
				console.warn("[updateUser] Not implemented. Field: " + key);
				break;
		}
	}
	return diffObj;
}

const calculateAuthDiff = (currAuthInfo: AuthInfo, newAuthInfo?: AuthInfo) => {
	const diffAuth = currAuthInfo;
	for (const provider in newAuthInfo) {
		if (!Object.keys(currAuthInfo).includes(provider)) {
			diffAuth[provider] = newAuthInfo[provider];
			continue;
		}
		for (const providerAccountId in newAuthInfo[provider]) {
			if (!Object.keys(currAuthInfo[provider]).includes(providerAccountId)) {
				diffAuth[provider][providerAccountId] = newAuthInfo[provider][providerAccountId];
				continue;
			}
			const currAuthObj = currAuthInfo[provider][providerAccountId];
			const newAuthObj = newAuthInfo[provider][providerAccountId];

			if (!(newAuthObj.expires_at && currAuthObj.expires_at && newAuthObj.expires_at < currAuthObj.expires_at)) {
				diffAuth[provider][providerAccountId] = newAuthObj;
			}
			if (newAuthObj.handle != currAuthObj?.handle) {
				diffAuth[provider][providerAccountId] = newAuthObj;
			}
		}
	}
	return diffAuth;
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
			console.error('[updateUser] Update user failed', { pg_query: update_user_q }, { userId, user }, err);
			return;
		});
}

export const getUserEmails = async (email: string): Promise<Set<string>> => {
	const emails = new Set<string>();
	try {
		const users: DbUser[] | undefined = await getUserByAlias(email);
		if (users) {
			for (const dbUser of users) {
				if (dbUser.aliases) {
					for (const email of dbUser.aliases) {
						emails.add(email);
					}
				}
				if (dbUser.auth_info) {
					for (const provider in dbUser.auth_info) {
						for (const account in dbUser.auth_info[provider]) {
							const auth = dbUser.auth_info[provider][account];
							if (auth.email) {
								emails.add(auth.email);
							}
						}
					}
				}
			}
		}
	}
	catch (err) {
		console.error(`Unable to get user aliases for ${email}, error = ${err}`);
	}
	return emails;
}