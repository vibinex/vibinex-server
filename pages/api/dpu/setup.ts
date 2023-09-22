import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicName } from '../../../utils/db/relevance';

const setupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[setupHandler]Saving setup info in db...");
    const jsonBody = req.body;
    const allTopicPromises = [];
    for (const ownerInfo of jsonBody.info) {
        const saveTopicPromises = saveTopicName(ownerInfo.owner, 
            ownerInfo.provider, 
            jsonBody.installationId, ownerInfo.repos)
        .catch((err) => {
            console.error("[setupHandler] Unable to save setup info, ", err);
        });
        allTopicPromises.push(saveTopicPromises);
    }
    await Promise.all(allTopicPromises).then((values) => {
        console.info("[setupHandler] All setup info saved succesfully...")
        res.status(200).send("Ok");
        return;
    }).catch((error) => {
        console.error("[setupHandler] Unable to save all setup info in db, error: ", error);
        res.status(500).json({"error": "Unable to save setup info"});
        return;
    });
}

export default setupHandler;
