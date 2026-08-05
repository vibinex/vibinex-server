import conn from ".";

export const saveHealthStatusToDB = async (healthStatus: string, topicId: string): Promise<Date | null> => {
	const healthStatusQuery = `
	UPDATE users
	SET health_status = $1,
		dpu_health_status_updated_at = NOW()
	WHERE topic_name = $2
	RETURNING dpu_health_status_updated_at;
	`;
	try {
		const { rows } = await conn.query(healthStatusQuery, [healthStatus, topicId]);
		return rows[0]?.dpu_health_status_updated_at ?? null;
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

export type DpuHealthState = "healthy" | "stale" | "never-seen" | "error";

export const classifyHealthStatus = (
	healthStatus: string | null | undefined,
	updatedAt: Date | string | null | undefined,
	now = new Date(),
	staleAfterMs = 5 * 60 * 1000,
): DpuHealthState => {
	if (!healthStatus || !updatedAt) return "never-seen";
	const timestamp = new Date(updatedAt);
	if (Number.isNaN(timestamp.getTime())) return "error";
	if (healthStatus !== "SUCCESS") return "error";
	if (now.getTime() - timestamp.getTime() > staleAfterMs) return "stale";
	return "healthy";
};
