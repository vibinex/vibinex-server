import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import rudderStackEvents from "../events";
import { getHealthStatusFromDB } from "../../../utils/db/healthStatus";

const getDpuHealth = async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getServerSession(req, res, authOptions);
	if (!session || !session.user.id) {
		const eventProperties = { response_status: 401 };
		rudderStackEvents.track("absent", "", 'user-repos-from-providers', { type: 'HTTP-401', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ error: 'Unauthenticated' });
	}
    const user_id = session.user.id as string;
    const healthStatus = await getHealthStatusFromDB(user_id);
    res.status(200).json({healthStatus: healthStatus.health_status, healthTs: healthStatus.timestamp});
}

export default getDpuHealth;