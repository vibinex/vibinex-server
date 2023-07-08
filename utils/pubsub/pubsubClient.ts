import { PubSub } from '@google-cloud/pubsub';

// Set up authentication and initialize PubSub client
const pubsub = new PubSub({ projectId: process.env.PROJECT_ID });


export function publishMessage(topicName: string, data: any, msgtype: string) {
  const topic = pubsub.topic(topicName);
  const message = {
      data: Buffer.from(JSON.stringify(data)),
      attributes: {
          msgtype: msgtype
      }
  };
  return topic.publishMessage(message);

}