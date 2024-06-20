import { NextApiRequest, NextApiResponse } from "next";
import { saveTopicNameInUsersTable, createTopicName } from '../../../utils/db/relevance';
import { createTopicNameInGcloud } from '../../../utils/pubsub/pubsubClient';
import { CloudBuildStatus, triggerCloudProjectBuildUsingGcloudApi, pollBuildStatus, triggerCloudPatBuildUsingGcloudApi } from './../../../utils/trigger';
import { DbUser, getUserById, getUserIdByTopicName } from '../../../utils/db/users';
import rudderStackEvents from '../events';

const triggerHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	console.info("[triggerHandler] pub sub setup info in db...");
	const jsonBody = req.body;
	let topicName: string;

	const event_properties = {
		repo_owner: jsonBody.repo_owner || "",
		repo_provider: jsonBody.selectedProvider || "",
		installation_type: jsonBody.selectedInstallationType || "",
		hosting: "cloud",
	};

	if (!jsonBody.selectedProvider || !jsonBody.selectedInstallationType || !jsonBody.userId) { //TODO: Get userId from req auth
		console.error("[triggerHandler] Invalid request body");
		res.status(400).json({ "error": "Invalid request body" });
		const eventProperties = { ...event_properties, response_status: 400 };
		rudderStackEvents.track(jsonBody?.userId ?? "absent", "", 'dpu-trigger', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return;
	}

	if (jsonBody.selectedProvider === 'github' && jsonBody.selectedInstallationType === 'pat' ) {
		if (!jsonBody.github_pat) {
			console.error("[triggerHandler] Missing GitHub Personal Access Token");
			res.status(400).json({ "error": "Missing GitHub Personal Access Token" });
			const eventProperties = { ...event_properties, response_status: 400 };
			rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
			return;
		}
	}

	const userData: DbUser | null = await getUserById(jsonBody.userId).catch(err => {
		console.error(`[triggerHandler] error in getting user data`, err);
		return null;
	});
	if (!userData) {
		res.status(500).json({ "error": "Internal server error" });
		const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
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
			const eventProperties = { ...event_properties, response_status: 500 };
			rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
			return;
		}
		const gcloudTopic = await createTopicNameInGcloud(generatedTopic).catch(err => {
			console.error(`[triggerHandler] error in creating topic in google cloud`, err);
			return;
		})
		if (!gcloudTopic) {
			res.status(500).json({ "error": "Internal server error" });
			const eventProperties = { ...event_properties, response_status: 500 };
			rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
			return;
		}
		topicName = generatedTopic;
		try {
			await saveTopicNameInUsersTable(jsonBody.userId, topicName);
		} catch (error) {
			console.error("[triggerHandler] Unable to save topic name in db, ", error);
			res.status(500).json({ "error": "Internal server error" });
			const eventProperties = { ...event_properties, topic_name: topicName, response_status: 500 };
			rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
			return;
		}
	}
	console.info("[triggerHandler] topic name created successfully and saved in db: ", topicName);

	//check if already a build exists in users table for the user, if yes? check status else continue
	let buildStatus: CloudBuildStatus;
	if (jsonBody.selectedProvider === 'github' && jsonBody.selectedInstallationType === 'pat' ) {
		buildStatus = await triggerCloudPatBuildUsingGcloudApi(jsonBody.userId, topicName, jsonBody.github_pat, jsonBody.selectedProvider).catch(err => {
			console.error(`[triggerHandler] error in triggering build`, err);
			return { success: false, message: 'Unable to trigger build using GCloud API' };
		});
		console.info("[triggerHandler] build status: ", buildStatus);

	} else if (jsonBody.selectedInstallationType === 'app' ) {
		buildStatus = await triggerCloudProjectBuildUsingGcloudApi(jsonBody.userId, topicName).catch(err => {
			console.error(`[triggerHandler] error in triggering build`, err);
			return { success: false, message: 'Unable to trigger build using GCloud API' };
		});
		console.info("[triggerHandler] build status: ", buildStatus);
	} else {
		console.error('[triggerHandler] Invalid provider, installation type, or hosting combination');
		res.status(400).json({ "error": "Invalid provider, installation type, or hosting combination", success: false });
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 400 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return;
	}
	if (!buildStatus.success) {
		console.error('[triggerHandler] Error triggering build:', buildStatus.message);
		res.status(500).json({ "error": buildStatus.message, success: false });
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 500 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return
	}
	const projectId: string | undefined = process.env.PROJECT_ID;
	const location: string | undefined = process.env.CLOUD_BUILD_LOCATION;
	if (!projectId || !location) {
		console.error('[triggerHandler] Environment variables for projectId and location must be set');
		res.status(400).json({ "error": "env variables must be set", success: false });
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 400 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return;
	}
	const buildId = buildStatus.buildDetails?.id;
	if (!buildId) {
		console.error('[triggerHandler] No build ID found in buildDetails');
		res.status(500).json({ error: 'No build ID found', success: false });
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 500 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return;
	}
	const finalBuildStatus = await pollBuildStatus(projectId, location, buildId).catch(err => {
		console.error(`[triggerHandler] error in polling build status`, err);
		return 'ERROR';
	});
	if (finalBuildStatus === 'SUCCESS') {
		res.status(200).json({ message: 'Build completed successfully', success: true });
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 200 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties });
		return;
	} else {
		console.error(`[triggerHandler] Build failed with status: ${finalBuildStatus}`);
		res.status(500).json({ error: `Build failed with status: ${finalBuildStatus}`, success: false });
		const eventProperties = { ...event_properties, topic_name: topicName, response_status: 500 };
		rudderStackEvents.track(jsonBody.userId, "", 'dpu-trigger', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return;
	}
}

export default triggerHandler;