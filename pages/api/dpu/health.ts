import { NextApiRequest, NextApiResponse } from "next";

const healthHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[healthHandler] Saving dpu health info...");
	const jsonBody = req.body;
    
}