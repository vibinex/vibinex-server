import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import rudderStackEvents from "../events";
import { classifyHealthStatus, getHealthStatusFromDB } from "../../../utils/db/healthStatus";

const getDpuHealth = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user?.id) {
		const eventProperties = { response_status: 401 };
		rudderStackEvents.track("absent", "", 'user-repos-from-providers', { type: 'HTTP-401', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ error: 'Unauthenticated' });
	}
	const user_id = session.user.id as string;
	try {
		const healthStatus = await getHealthStatusFromDB(user_id);
		const healthTs = healthStatus?.dpu_health_status_updated_at ?? null;
		res.status(200).json({
			healthState: classifyHealthStatus(healthStatus?.health_status, healthTs),
			healthStatus: healthStatus?.health_status ?? null,
			healthTs,
		});
	} catch (error) {
		console.error(`[getDpuHealth] Failed to retrieve health status for user ${user_id}`);
		res.status(500).json({ healthState: "error", error: "Unable to retrieve DPU health" });
	}
};

export default getDpuHealth;
