import conn from ".";

export const saveHealthStatusToDB = async (healthStatus: string, ts: Date, topicId: string) => {
	const healthStatusQuery = `
	UPDATE users
	SET health_status = $1,
		dpu_health_status_updated_at = $2
	WHERE topic_name = $3;
	`;
	// TODO - convert ts into actual timestamp from string
	// const timestamp = new Date(ts).toISOString();
	try {
		console.log(`[saveHealthStatusToDB] saving health status for ${topicId}:`, ts);
		const rows  = await conn.query(healthStatusQuery, [healthStatus, ts, topicId]);
		console.log(`[saveHealthStatusToDB] rows = ${JSON.stringify(rows)}`)
	} catch (err) {
		console.error(`[saveHealthStatusToDB] error in saving dpu health status for ${topicId}:`, err);
		throw new Error("Error saving health status to the database");
	}
}

export const getHealthStatusFromDB = async (user_id: string) => {
	const healthStatusQuery = `
	SELECT health_status, dpu_health_status_updated_at
	FROM users
	WHERE users.id = $1
	`;
	try {
		const { rows } = await conn.query(healthStatusQuery, [user_id]);
		return rows[0];
	} catch (err) {
		console.error(`[getHealthStatusFromDB] error in getting dpu health status for ${user_id}:`, err);
		throw new Error("Error getting aliases from the database");
	}
}
