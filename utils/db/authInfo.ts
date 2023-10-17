import conn from '.';
import AuthInfo from '../../types/AuthInfo';

export const saveAuthInfoToDb = async function (userId: string, authInfo: AuthInfo) {
    const update_user_authinfo_q = `UPDATE users 
        SET auth_info = $1
        WHERE id = $2`;
    const params = [authInfo, userId];
    await conn.query(update_user_authinfo_q, params)
        .then((result) => {
            console.info(`[saveAuthInfoToDb] Successfully updated AuthInfo in the database for user ${userId}`);
            console.debug("[saveAuthInfoToDb] authinfo update result = ", result);
        })
        .catch((error) => {
            console.error(`[saveAuthInfoToDb] Error in saving authInfo to the database`,
                { pg_query: update_user_authinfo_q }, error);
        });
}

export const getAuthInfoFromDb = async function (user_id: string): Promise<AuthInfo | null> {
    const user_auth_search_q = `SELECT auth_info
		FROM users
		WHERE id = $1`;
    const params = [user_id];
    const authinfo_promise = await conn.query(user_auth_search_q, params)
        .then((result): { authInfo: AuthInfo | null } => {
            // Assuming the auth_info is in the first row of the result
            if (result.rows && result.rows.length > 0) {
                return { authInfo: result.rows[0].auth_info };
            } else {
                return { authInfo: null };
            }
        })
        .catch((error): { authInfo: AuthInfo | null } => {
            console.error(`[getAuthInfoFromDb] Error in getting authInfo from the database`,
                { pg_query: user_auth_search_q }, error);
            return { authInfo: null };
        });
    return authinfo_promise.authInfo;
}