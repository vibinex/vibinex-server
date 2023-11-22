import { PubSub } from '@google-cloud/pubsub';
import PubSubMessage from '../../types/PubSubMessage';

// Set up authentication and initialize PubSub client
const pubsub = new PubSub({ projectId: process.env.PROJECT_ID , keyFilename: process.env.PUB_SUB_JSON});


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