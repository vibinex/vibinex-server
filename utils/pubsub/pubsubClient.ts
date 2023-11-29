import { PubSub } from '@google-cloud/pubsub';
import PubSubMessage from '../../types/PubSubMessage';
import { CloudBuildClient } from "@google-cloud/cloudbuild";

export interface CloudBuildStatus {
  success: boolean;
  message: string;
  buildDetails?: any;
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

export async function triggerBuildUsingGcloudApi(user_id: string, topic_name: string): Promise<CloudBuildStatus> {
  console.info(`[triggerBuildUsingGcloudApi] triggering cloudbuild for topic_name ${topic_name} and user_id ${user_id}`);

  const client = new CloudBuildClient();

  const projectId: string | undefined = process.env.PROJECT_ID;
  const triggerId: string | undefined = process.env.CLOUD_BUILD_TRIGGER_ID;

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

  return client.runBuildTrigger({
      projectId,
      triggerId,
      source: {
          projectId,
          branchName: 'tr/docs-ci', // or your specific branch
          substitutions,
      },
  })
  .then(([operation]) => operation.promise())
  .then(([build]) => {
    console.info('[triggerBuildUsingGcloudApi] Build triggered with variables from environment.');
    if (build.status === 'SUCCESS') {
      return { success: true, message: 'Build completed successfully.', buildDetails: build };
    } else {
        return { success: false, message: `Build failed with status: ${build.status}`, buildDetails: build };
    }
  })
  .catch((error) => {
      console.error('[triggerBuildUsingGcloudApi] Error triggering build: ', error);
      return { success: false, message: `Error triggering build: ${error.message}` };
  });
}
