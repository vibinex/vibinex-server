import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { CloudBuildStatus, createTopicNameInGcloud, triggerBuildUsingGcloudApi, pollBuildStatus } from '../../../utils/pubsub/pubsubClient';
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
        try {
            await saveTopicNameInUsersTable(jsonBody.user_id, topicName);
        } catch (error) {
            console.error("[pubsubHandler] Unable to save topic name in db, ", error);
            return res.status(500).json({ "error": "Internal server error" });
        }
    }
    console.info("[pubsubHandler] topic name created successfully and saved in db: ", topicName);

    //check if already a build exists in users table for the user, if yes? check status else continue
    
    const buildStatus : CloudBuildStatus = await triggerBuildUsingGcloudApi(jsonBody.user_id, topicName);
    console.info("[pubsubHandler] build status: ", buildStatus);
    if (!buildStatus.success) {
        console.error('[pubsubHandler] Error triggering build:', buildStatus.message);
        return res.status(500).json({ "error": buildStatus.message, success: false });
    }
    const projectId: string | undefined = process.env.PROJECT_ID;
    const location: string | undefined = process.env.CLOUD_BUILD_LOCATION;
    if (!projectId || !location) {
        console.error('[pubsubHandler] Environment variables for projectId and location must be set');
        res.status(500).json({"error": "env variables must be set", success: false});
        return;
    }
    const buildId = buildStatus.buildDetails?.id;
    if (!buildId) {
        console.error('[pubsubHandler] No build ID found in buildDetails');
        return res.status(500).json({ error: 'No build ID found', success: false });
    }
    const finalBuildStatus = await pollBuildStatus(projectId, location, buildId);
    if (finalBuildStatus === 'SUCCESS') {
        return res.status(200).json({ message: 'Build completed successfully', success: true });
    } else {
        console.error(`[pubsubHandler] Build failed with status: ${finalBuildStatus}`);
        return res.status(500).json({ error: `Build failed with status: ${finalBuildStatus}`, success: false });
    }
}

export default pubsubHandler;
