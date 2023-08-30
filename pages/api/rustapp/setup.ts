import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicName } from '../../../utils/db/relevance';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("Saving setup info...");
    const jsonbody = req.body;
    for (const idx in jsonbody.info) {
        let owner_info = jsonbody.info[idx];
        try {
            await saveTopicName(owner_info.owner, owner_info.provider, 
                jsonbody.installation_id, owner_info.repos);
        } catch(err) {
            console.error("Unable to save setup info, ", err);
            res.status(500).send({"error": "Unable to save setup info"});
        }
    }
    res.status(200).send("Ok");
}

export default handler;