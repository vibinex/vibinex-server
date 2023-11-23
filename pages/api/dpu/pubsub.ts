import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { createTopicNameInGcloud } from '../../../utils/pubsub/pubsubClient';

const pubsubHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[pubsubHandler] pub sub setup info in db...");
    const jsonBody = req.body;
    // if (!jsonBody.user_id || !jsonBody.)) {
    //     console.error("[pubsubHandler] Invalid request body, 'info' is missing or not an array");
    //     res.status(400).json({"error": "Invalid request body"});
    //     return;
    // }
    const topicName = await createTopicName(jsonBody.user_id, jsonBody.provider, jsonBody.org_name);
    console.log("[pubsubhandler] topicName", topicName);
    if (!topicName){
        console.error(`[pubsubHanlder] error in creating topic name`);
        res.status(500).json({"error": "topicName creation error"});
        return;
    }
    const topic = await createTopicNameInGcloud(jsonBody.user_id, topicName)
    if (!topic){
        console.error(`[pubsubHanlder] error in creating topic in google cloud`);
        res.status(500).json({"error": "topic creation error in gcloud"});
        return;
    }
    console.log("[pubsubHandler] gcloud topic: ", topic);
    await saveTopicNameInUsersTable(jsonBody.user_id, topicName);
    console.log("[pubsubHandler] topic name created successfully and saved in db: ", topicName);
    return res.status(200).json({"success": "topic name created and saved successfully"});
}

export default pubsubHandler;
