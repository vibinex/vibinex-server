import conn from ".";

export const getUserInfoFromDb = async (email: string) => {
	console.log(`[getUserInfoFromDb] Getting user info from db ${email}`);
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
		throw new Error('No topic found');
	}
    const userId: string = result.rows[0].id;
    const topicName: string = result.rows[0].topic_name;
	return {
        userId,
        topicName,
    };
}