import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicName } from '../../../utils/db/relevance';

const setupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("Saving setup info in db...");
    const jsonBody = req.body;
    if (!Array.isArray(jsonBody.info)) {
        console.error("[setupHandler] Invalid request body, 'info' is missing or not an array");
        res.status(400).json({"error": "Invalid request body"});
        return;
    }
    const allTopicPromises = [];
    for (const ownerInfo of jsonBody.info) {
        try {
            await saveTopicName(ownerInfo.owner, ownerInfo.provider, 
                jsonBody.installationId, ownerInfo.repos);
        } catch(err) {
            console.error("Unable to save setup info, ", err);
            res.status(500).send({"error": "Unable to save setup info"});
        }
    }
    res.status(200).send("Ok");
}

export default setupHandler;
