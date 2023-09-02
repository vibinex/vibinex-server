import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonBody = req.body;
  const owner = jsonBody.repository.owner.username; 
  const provider = "bitbucket";
  const name =jsonBody.repository.name;
  const topicName = await getTopicNameFromDB(owner, name, provider);
  const data = {
    'repository_provider': 'bitbucket',
    'event_payload': jsonBody};
  const msgType = 'webhook_callback';
  console.info("Received bitbucket webhook event for ", name);
  try {
    await publishMessage(topicName, data, msgType);
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ error: 'Failed to publish message. Data must be in the form of a Buffer' });
  }
  res.status(200);
  res.send("Success");
}

export default webhookHandler;