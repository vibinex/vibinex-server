import conn from ".";

export const dpuHealthCheckStatus = async (topicId: string): Promise<boolean> => {
	console.debug(`[dpuHealthCheckStatus] Getting health check status for topic ${topicId}`);
	const query = `SELECT dpu.online
		FROM dpu
		WHERE dpu.topic_id = $1;
	`;
	const result = await conn.query(query, [topicId]).catch(err => {
		console.error(
			`[dpuHealthCheckStatus] Could not get the health check for ${topicId}`, { pg_query: query }, err);
		throw new Error("Error in getting health check info from database" + err.message);
	});
	if (result.rows.length === 0) {
		throw new Error('No topicId found');
	}
	return result.rows[0].online as boolean;
}

export const setDpuHealthCheckStatus = async (topicId: string, status: boolean) => {
	console.debug(`[setDpuHealthCheckStatusOnline] Setting health check status for topic ${topicId} to ${status}`);
	const query = `UPDATE dpu
		SET online = $1
		WHERE dpu.topic_id = $2;
	`;
	const result = await conn.query(query, [status, topicId]).catch(err => {
		console.error(
			`[dpuHealthCheckStatus] Could not set health check to true for ${topicId}`, { pg_query: query }, err);
		throw new Error("Error in setting health check to true from database" + err.message);
	});
}