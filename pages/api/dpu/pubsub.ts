import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { CloudBuildStatus, createTopicNameInGcloud, triggerBuildUsingGcloudApi } from '../../../utils/pubsub/pubsubClient';
import { DbUser, getUserById } from '../../../utils/db/users';

const pubsubHandler = async (req: NextApiRequest, res: NextApiResponse) => { // To be removed, only used for testing the functions
    console.info("[pubsubHandler] pub sub setup info in db...");
    const jsonBody = req.body;
    if (!jsonBody.user_id) {
        console.error("[pubsubHandler] Invalid request body");
        res.status(400).json({"error": "Invalid request body"});
        return;
    }
    const user_data: DbUser = await getUserById(jsonBody.user_id);
    if (!user_data){
        console.error(`[pubsubHandler] cannot get user_data`);
        res.status(500).json({"error": "Internal server error"});
        return;        
    }
    if (user_data.topic_name !== null && user_data.topic_name !== undefined){
        console.error(`[pubsubHandler] topic already exist for user_id: ${user_data.id} and topic_name: ${user_data.topic_name}`);
        res.status(500).json({"error": "Topic already exist"});
        return;        
    }
    const topicName = await createTopicName(jsonBody.user_id);
    if (!topicName){
        console.error(`[pubsubHandler] error in creating topic name`);
        res.status(500).json({"error": "Internal server error"});
        return;
    }
    const topic = await createTopicNameInGcloud(jsonBody.user_id, topicName)
    if (!topic){
        console.error(`[pubsubHandler] error in creating topic in google cloud`);
        res.status(500).json({"error": "Internal server error"});
        return;
    }
    await saveTopicNameInUsersTable(jsonBody.user_id, topicName).catch((error) => {
        console.error("[pubsubHandler] Unable to save topic name in db, ", error);
        res.status(500).json({"error": "Internal server error"});
        return;
    });
    console.info("[pubsubHandler] topic name created successfully and saved in db: ", topicName);
    
    const buildStatus : CloudBuildStatus = await triggerBuildUsingGcloudApi(jsonBody.user_id, topicName);
    console.info("[pubsubHandler] build status: ", buildStatus);
    return res.status(200).json(buildStatus);
}

export default pubsubHandler;
