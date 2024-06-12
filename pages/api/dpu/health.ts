import { NextApiRequest, NextApiResponse } from "next";
import { saveHealthStatusToDB } from "../../../utils/db/healthStatus";

const healthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[healthHandler] Saving dpu health info...");
	const jsonBody = req.body;
    try {
        await saveHealthStatusToDB(jsonBody.status, jsonBody.timestamp, jsonBody.topic);
    } catch (error) {
        res.status(500);
        console.error(`[healthHandler] Failed to save to db`, jsonBody);
    }
    res.status(200).json({"status":"Success"});
}

export default healthHandler;