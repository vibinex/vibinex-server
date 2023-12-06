import { PubSub } from '@google-cloud/pubsub';
import PubSubMessage from '../../types/PubSubMessage';
import fetch from 'node-fetch';
export interface CloudBuildStatus {
  success: boolean;
  message: string;
  buildDetails?: any;
}

interface AccessTokenApiResponse {
	expires_in: string;
	token_type: string;
	access_token: string;
}
// Set up authentication and initialize PubSub client
const pubsub = new PubSub({ projectId: process.env.PROJECT_ID });


export function publishMessage(topicName: string, data: PubSubMessage, msgType: string) {
	const topic = pubsub.topic(topicName);
	const message = {
		data: Buffer.from(JSON.stringify(data)),
		attributes: {
			msgtype: msgType
		}
	};
	return topic.publishMessage(message);

}

export async function createTopicNameInGcloud(userId: string, topicName: string) {  
	try {
		const [topic] = await pubsub.createTopic(topicName);
		console.log(`[createTopicNameInGcloud] Topic ${topic.name} created.`);
		return topic;
	} catch (error) {
		console.error('[createTopicNameInGcloud] Failed to create topic name in gcloud:', error);
		return null;
}}

async function getAccessTokenFromMetaServerForGcloudApi(): Promise<string>{
	console.info(`[getAccessTokenFromMetaServerForGcloudApi] getting access token from meta server for gcloud trigger api`)
	const response = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
		headers: { 'Metadata-Flavor': 'Google' }
	});

	if (!response.ok) {
		console.error('[getAccessTokenFromMetaServerForGcloudApi] Failed to retrieve access token');
		return response.statusText;
	}

	const data = (await response.json()) as AccessTokenApiResponse;
	console.info(`[getAccessTokenFromMetaServerForGcloudApi] retreived access token from meta server for gcloud trigger api, data: ${data}`);
	return data.access_token;
}

export async function triggerBuildUsingGcloudApi(user_id: string, topic_name: string): Promise<CloudBuildStatus> {
	console.info(`[triggerBuildUsingGcloudApi] triggering cloudbuild for topic_name ${topic_name} and user_id ${user_id}`);

	const projectId: string | undefined = process.env.PROJECT_ID;
	const triggerId: string | undefined = process.env.CLOUD_BUILD_TRIGGER_ID;
	const location: string = 'asia-south1';

	if (!projectId || !triggerId) {
		console.error('[triggerBuildUsingGcloudApi] Environment variables for projectId and triggerId must be set');
		return { success: false, message: 'Missing projectId or triggerId in environment variables.' };;
	}

	// Build the substitutions object using environment variables
	const substitutions: { [key: string]: string } = {
		_BITBUCKET_BASE_URL: process.env.BITBUCKET_BASE_URL || '',
		_BITBUCKET_CLIENT_ID: process.env.BITBUCKET_CLIENT_ID || '',
		_BITBUCKET_CLIENT_SECRET: process.env.BITBUCKET_CLIENT_SECRET || '',
		_GCP_CREDENTIALS: process.env.GCP_CREDENTIALS || '',
		_GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID || '',
		_GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET || '',
		_GITHUB_APP_ID: process.env.GITHUB_APP_ID || '',
		_GITHUB_BASE_URL: process.env.GITHUB_BASE_URL || '',
		_INSTALL_ID: topic_name || '',
		_SERVER_URL: process.env.SERVER_URL || ''
	};

	const accessToken = await getAccessTokenFromMetaServerForGcloudApi();
    const url = `https://cloudbuild.googleapis.com/v1/projects/${projectId}/locations/${location}/triggers/${triggerId}:run`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            projectId,
			triggerId,
            source: {
                projectId,
                substitutions
            }
        })
    });

    if (!response.ok) {
        console.error('[triggerBuildUsingGcloudApi] Error triggering build: ', response.statusText);
        return {success: false, message: 'Error triggering build', buildDetails: response};
    }
	console.info(`[triggerBuildUsingGcloudApi] build triggered for topic_name: ${topic_name} and user_id: ${user_id}`);
	return {success: true, message: response.statusText, buildDetails: response};

}
