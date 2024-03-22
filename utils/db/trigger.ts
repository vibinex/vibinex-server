import conn from ".";

export const getUserInfoFromDb = async (email: string) => {
	console.info(`[getUserInfoFromDb] Getting user info from db ${email}`);
	const query = `
    SELECT id, topic_name 
    FROM users
    WHERE '${email}' = ANY(aliases)
  `;
	const result = await conn.query(query).catch(err => {
		console.error(`[getUserInfoFromDb] Could not get user info for: ${email}`, { pg_query: query }, err);
		throw new Error("Error in running the query on the database", err);
	});
	if (result.rows.length === 0) {
		throw new Error('No user found');
	}
    const userId: string = result.rows[0].id;
    const topicName: string = result.rows[0].topic_name;
	return {
        userId,
        topicName,
    };
}

export const getUserRepoConfig = async (provider: string, repoName: string, repoOwner: string, userId: string) => {
    console.info(`[getUserRepoConfig] Getting repo config for user: ${userId} and repo: ${repoName}`);
    const query = `
    SELECT json_build_object(
        'auto_assign', rc.auto_assign,
        'comment', rc.comment_setting
    ) AS config
    FROM repo_config rc
    WHERE rc.user_id = '${userId}' AND
        repo_id = (SELECT r.id FROM repos r WHERE r.repo_name = '${repoName}' AND r.repo_owner = '${repoOwner}' AND r.repo_provider = '${provider}')
    `;
    const result = await conn.query(query).catch(err => {
		console.error(`[getUserRepoConfig] Could not get repo config for: ${userId}, ${repoName}`,
            { pg_query: query }, err);
		throw new Error("Error in running the query on the database", err);
	});
	if (result.rows.length === 0) {
		throw new Error('No repo config found');
	}
	return result.rows[0].config;
}