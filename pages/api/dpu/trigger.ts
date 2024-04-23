import { NextApiRequest, NextApiResponse } from "next";
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { CloudBuildStatus, createTopicNameInGcloud, triggerBuildUsingGcloudApi, pollBuildStatus, triggerCloudPatBuildUsingGcloudApi } from '../../../utils/pubsub/pubsubClient';
import { DbUser, getUserById } from '../../../utils/db/users';

const triggerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	console.info("[triggerHandler] pub sub setup info in db...");
	const jsonBody = req.body;
	let topicName: string;
	if (!jsonBody.selectedProvider || !jsonBody.selectedInstallationType || !jsonBody.selectedHosting || !jsonBody.userId) {
		console.error("[triggerHandler] Invalid request body");
		return res.status(400).json({ "error": "Invalid request body" });
	}
	
	if (jsonBody.selectedProvider === 'github' && jsonBody.selectedInstallationType === 'individual' && jsonBody.selectedHosting === 'cloud') {
		if(!jsonBody.github_pat){
			console.error("[triggerHandler] Missing GitHub Personal Access Token");
			return res.status(400).json({ "error": "Missing GitHub Personal Access Token" });
		}
	}

	const userData: DbUser | null = await getUserById(jsonBody.userId).catch(err => {
		console.error(`[triggerHandler] error in getting user data`, err);
		return null;
	});
	if (!userData) {
		res.status(500).json({ "error": "Internal server error" });
		return;
	}
	if (userData.topic_name !== null && userData.topic_name !== undefined) {
		topicName = userData.topic_name;
	} else {
		const generatedTopic = await createTopicName(jsonBody.userId).catch(err => {
			console.error(`[triggerHandler] error in creating topic name`, err);
			return;
		});
		if (!generatedTopic) {
			res.status(500).json({ "error": "Internal server error" });
			return;
		}
		const gcloudTopic = await createTopicNameInGcloud(generatedTopic).catch(err => {
			console.error(`[triggerHandler] error in creating topic in google cloud`, err);
			return;
		})
		if (!gcloudTopic) {
			res.status(500).json({ "error": "Internal server error" });
			return;
		}
		topicName = generatedTopic;
		try {
			await saveTopicNameInUsersTable(jsonBody.userId, topicName);
		} catch (error) {
			console.error("[triggerHandler] Unable to save topic name in db, ", error);
			return res.status(500).json({ "error": "Internal server error" });
		}
	}
	console.info("[triggerHandler] topic name created successfully and saved in db: ", topicName);

	//check if already a build exists in users table for the user, if yes? check status else continue
	let buildStatus: CloudBuildStatus;
	if (jsonBody.selectedProvider === 'github' && jsonBody.selectedInstallationType === 'individual' && jsonBody.selectedHosting === 'cloud'){
		buildStatus = await triggerCloudPatBuildUsingGcloudApi(jsonBody.userId, topicName, jsonBody.github_pat, jsonBody.selectedProvider).catch(err => {
			console.error(`[triggerHandler] error in triggering build`, err);
			return { success: false, message: 'Unable to trigger build using GCloud API' };
		});
		console.info("[triggerHandler] build status: ", buildStatus);
	
	} else {
		buildStatus = await triggerBuildUsingGcloudApi(jsonBody.userId, topicName).catch(err => {
			console.error(`[triggerHandler] error in triggering build`, err);
			return { success: false, message: 'Unable to trigger build using GCloud API' };
		});
		console.info("[triggerHandler] build status: ", buildStatus);
	}
	if (!buildStatus.success) {
		console.error('[triggerHandler] Error triggering build:', buildStatus.message);
		return res.status(500).json({ "error": buildStatus.message, success: false });
	}
	const projectId: string | undefined = process.env.PROJECT_ID;
	const location: string | undefined = process.env.CLOUD_BUILD_LOCATION;
	if (!projectId || !location) {
		console.error('[triggerHandler] Environment variables for projectId and location must be set');
		res.status(400).json({ "error": "env variables must be set", success: false });
		return;
	}
	const buildId = buildStatus.buildDetails?.id;
	if (!buildId) {
		console.error('[triggerHandler] No build ID found in buildDetails');
		return res.status(500).json({ error: 'No build ID found', success: false });
	}
	const finalBuildStatus = await pollBuildStatus(projectId, location, buildId).catch(err => {
		console.error(`[triggerHandler] error in polling build status`, err);
		return 'ERROR';
	});
	if (finalBuildStatus === 'SUCCESS') {
		return res.status(200).json({ message: 'Build completed successfully', success: true });
	} else {
		console.error(`[triggerHandler] Build failed with status: ${finalBuildStatus}`);
		return res.status(500).json({ error: `Build failed with status: ${finalBuildStatus}`, success: false });
	}
}

export default triggerHandler;