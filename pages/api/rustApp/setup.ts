import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicName } from '../../../utils/db/relevance';

const setupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("Saving setup info in db...");
    const jsonBody = req.body;
    for (const idx in jsonBody.info) {
        let ownerInfo = jsonBody.info[idx];
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
