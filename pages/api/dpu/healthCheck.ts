import { NextApiRequest, NextApiResponse } from "next";
import { setDpuHealthCheckStatusOnline } from "../../../utils/db/healthCheck";
import { dpuHealthCheck } from "../../../utils/dpuHealthCheck";

const healthCheckHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'POST') {
		await updateHealthCheckStatus(req, res);
	} else if (req.method == 'GET') {
		await getHealthCheckStatus(req, res);
	}
}

async function getHealthCheckStatus(req: NextApiRequest, res: NextApiResponse) {
	if (req.body?.topicId) {
		const topic = req.body.topicId;
		try {
			const status = await dpuHealthCheck(topic);
			res.status(200).json({ healthCheckStatus: status });
		} catch (err) {
			console.error(
				`[getHealthCheckStatus] Error in getting health check status for ${topic}`, err);
			res.status(500).json({ "error": "Unable to get health check status" });
		}
	} else { res.status(400).json({ "error": "Invalid request body" }); }
}


async function updateHealthCheckStatus(req: NextApiRequest, res: NextApiResponse) {
	if (req.body?.topicId) {
		setDpuHealthCheckStatusOnline(req.body.topicId as string, true);
	} else { res.status(400).json({ "error": "Invalid request body" }); }
}

export default healthCheckHandler;