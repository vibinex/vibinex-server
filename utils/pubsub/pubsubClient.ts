import { PubSub } from '@google-cloud/pubsub';
import PubSubMessage from '../../types/PubSubMessage';
import axios from 'axios';
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

interface CloudBuildApiResponse {
    metadata: {
        "@type": string;
        build: {
            id: string;
            status: string;
            source: {
                gitSource: {
                    url: string;
                    revision: string;
                };
            };
            createTime: string;
            timeout: string;
            projectId: string;
            buildTriggerId: string;
            queueTtl: string;
            name: string;
        };
    };
}

interface BuildStatusResponse {
	status: string;
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

export async function createTopicNameInGcloud(topicName: string) {  
	try {
		const [topic] = await pubsub.createTopic(topicName);
		console.log(`[createTopicNameInGcloud] Topic ${topic.name} created.`);
        return topic.name;
	} catch (error) {
		console.error('[createTopicNameInGcloud] Failed to create topic name in gcloud:', error);
		return null;
    }
}

async function getAccessTokenFromMetaServerForGcloudApi(): Promise<string>{
	console.info(`[getAccessTokenFromMetaServerForGcloudApi] getting access token from meta server for gcloud trigger api`)
	const response = await axios.get('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
    headers: { 'Metadata-Flavor': 'Google' }
	});
	if (!response.data) {
		console.error('[getAccessTokenFromMetaServerForGcloudApi] Failed to retrieve access token');
		return response.statusText;
	}

	const data = response.data as AccessTokenApiResponse;
    console.info(`[getAccessTokenFromMetaServerForGcloudApi] retreived access token from meta server for gcloud trigger api, data: ${JSON.stringify(data)}`);
	return data.access_token;
}

export async function triggerBuildUsingGcloudApi(user_id: string, topic_name: string): Promise<CloudBuildStatus> {
	console.info(`[triggerBuildUsingGcloudApi] triggering cloudbuild for topic_name ${topic_name} and user_id ${user_id}`);

	const projectId: string | undefined = process.env.PROJECT_ID;
	const triggerId: string | undefined = process.env.CLOUD_BUILD_TRIGGER_ID;
	const location: string | undefined = process.env.CLOUD_BUILD_LOCATION;
	const triggerBranchName: string | undefined = process.env.CLOUD_BUILD_BRANCH_NAME;

	if (!projectId || !triggerId || !location || !triggerBranchName) {
		console.error('[triggerBuildUsingGcloudApi] Environment variables for projectId and triggerId must be set');
		return { success: false, message: 'Missing projectId, triggerId, trigger location or trigger branch name in environment variables.' };
	}

	// Build the substitutions object using environment variables
	const substitutions: { [key: string]: string } = {
        _BITBUCKET_BASE_URL: process.env.BITBUCKET_BASE_URL ?? '',
        _BITBUCKET_CLIENT_ID: process.env.BITBUCKET_CLIENT_ID ?? '',
        _BITBUCKET_CLIENT_SECRET: process.env.BITBUCKET_CLIENT_SECRET ?? '',
        _GCP_CREDENTIALS: process.env.GCP_CREDENTIALS ?? '',
        _GITHUB_APP_CLIENT_ID: process.env.GITHUB_APP_CLIENT_ID ?? '',
        _GITHUB_APP_CLIENT_SECRET: process.env.GITHUB_APP_CLIENT_SECRET ?? '',
        _GITHUB_APP_ID: process.env.GITHUB_APP_ID ?? '',
        _GITHUB_BASE_URL: process.env.GITHUB_BASE_URL ?? '',
        _INSTALL_ID: topic_name ?? '',
        _SERVER_URL: process.env.SERVER_URL ?? '',
		_USER_ID: user_id
	};

	const accessToken = await getAccessTokenFromMetaServerForGcloudApi();
    const url = `https://cloudbuild.googleapis.com/v1/projects/${projectId}/locations/${location}/triggers/${triggerId}:run`;

	const response = await axios.post(url, {
        projectId,
        triggerId,
        source: {
            projectId,
            substitutions,
            branchName: triggerBranchName
        }
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    });

    if (!response.data) {
        console.error('[triggerBuildUsingGcloudApi] Error triggering build: ', response.statusText);
        return { success: false, message: 'Error triggering build', buildDetails: response.statusText };
    }

    const buildDetails = response.data.metadata.build;
    console.debug(`[triggerBuildUsinggcloudAPi] ${buildDetails.buildTriggerId} ${buildDetails.status} ${buildDetails.id}`);
    console.info(`[triggerBuildUsingGcloudApi] build triggered for topic_name: ${topic_name} and user_id: ${user_id}`);
    return { success: true, message: response.statusText, buildDetails: buildDetails };
}

export async function pollBuildStatus(projectId: string, location: string, buildId: string): Promise<string> { //Instead of constant status polling from client[-side, I decided to do the polling in the api itself to avoid setting up websocket or another functionality for polling from client side. We can discuss on it whether we want user to see each and every build status or simply a success or failure response?!
    const url = `https://cloudbuild.googleapis.com/v1/projects/${projectId}/locations/${location}/builds/${buildId}`;
    let attempts = 0;
    const maxAttempts = 30; // we can adjust this as per our maximum build time
    const delay = 10000; // Delay between attempts

	const accessToken = await getAccessTokenFromMetaServerForGcloudApi();
    while (attempts < maxAttempts) {
        const response = await axios.get(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.data) {
            console.error('[pollBuildStatus] Failed to fetch build status:', response.statusText);
            return 'ERROR';
        }

        const data: BuildStatusResponse = await response.data;
        if (['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT', 'CANCELLED', 'EXPIRED', 'STATUS_UNKNOWN'].includes(data.status)) {
            return data.status; // These above states are considered as Final state
        }

        // In-progress states
        if (['PENDING', 'QUEUED', 'WORKING'].includes(data.status)) {
            await new Promise(resolve => setTimeout(resolve, delay));
            attempts++;
            continue;
        }

        console.error(`[pollBuildStatus] Unexpected build status: ${data.status}`);
        return 'ERROR';
    }
	console.error('[pollBuildStatus] Build status check exceeded maximum attempts');
    return 'TIMEOUT'; // Indicate a timeout in build status check
}