import { NextApiRequest, NextApiResponse } from "next";
import rudderStackEvents from "../events";

const events = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "OPTIONS") {
		res.status(200).send("Ok");
		return;
	}
	// For normal requests
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}
	if (!req.body.userId) {
		rudderStackEvents.track("absent", "", 'chrome_extension_event', { type: "HTTP-400", eventStatusFlag: 0, ...req.body });
		return res.status(400).json({ message: 'Missing userId in request body' });
	}

	const userId = req.body.userId;
	rudderStackEvents.track(userId, "", 'chrome_extension_event', { type: "HTTP-200", eventStatusFlag: 1, ...req.body });
	res.status(200).json({ message: "success" });
}

export default events;