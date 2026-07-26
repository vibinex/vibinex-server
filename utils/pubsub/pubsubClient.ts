import { PubSub } from '@google-cloud/pubsub';
import PubSubMessage from '../../types/PubSubMessage';
import { enqueueDpuJob } from '../db/dpuJobs';

// Set up authentication and initialize PubSub client
const pubsub = new PubSub({ projectId: process.env.PROJECT_ID });


export async function publishMessage(topicName: string, data: PubSubMessage, msgType: string): Promise<string> {
	if (process.env.DPU_QUEUE_TRANSPORT === 'http' || process.env.DPU_QUEUE_TRANSPORT === 'postgres') {
		return enqueueDpuJob(topicName, msgType, data);
	}
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
	if (process.env.DPU_QUEUE_TRANSPORT === 'http' || process.env.DPU_QUEUE_TRANSPORT === 'postgres') {
		return topicName;
	}
	try {
		const [topic] = await pubsub.createTopic(topicName);
		console.log(`[createTopicNameInGcloud] Topic ${topic.name} created.`);
        return topic.name;
	} catch (error) {
		console.error('[createTopicNameInGcloud] Failed to create topic name in gcloud:', error);
		return null;
    }
}
