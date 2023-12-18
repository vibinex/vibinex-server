import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { createTopicNameInGcloud } from '../../../utils/pubsub/pubsubClient';
import { DbUser, getUserById } from '../../../utils/db/users';

const pubsubHandler = async (req: NextApiRequest, res: NextApiResponse) => { // To be removed, only used for testing the functions
    console.info("[pubsubHandler] pub sub setup info in db...");
    const jsonBody = req.body;
    let topicName : string;
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
        topicName = user_data.topic_name;       
    } else {
        const generated_topic = await createTopicName(jsonBody.user_id);
        if (!generated_topic){
            console.error(`[pubsubHandler] error in creating topic name`);
            res.status(500).json({"error": "Internal server error"});
            return;
        }
        const gcloudTopic = await createTopicNameInGcloud(jsonBody.user_id, generated_topic)
        if (!gcloudTopic){
            console.error(`[pubsubHandler] error in creating topic in google cloud`);
            res.status(500).json({"error": "Internal server error"});
            return;
        }
        topicName = generated_topic;
        saveTopicNameInUsersTable(jsonBody.user_id, topicName)
        .then(() => { console.info("[pubsubHandler] Topic saved in db"); })
        .catch((error) => {
            console.error("[pubsubHandler] Unable to save topic name in db, ", error);
        })
    }
    console.info("[pubsubHandler] topic name created successfully and saved in db: ", topicName);
    return res.status(200).json({"install_id": topicName});
}

export default pubsubHandler;
