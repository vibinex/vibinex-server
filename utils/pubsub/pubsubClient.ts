import { PubSub } from '@google-cloud/pubsub';
import PubSubMessage from '../../types/PubSubMessage';

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