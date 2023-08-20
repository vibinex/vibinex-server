import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const topicName = 'rtapish-fromserver';
  const jsonbody = req.body;
  const data = {
    'repository_provider': 'bitbucket',
    'event_payload': jsonbody};
  const msgtype = 'webhook_callback';

  try {
    console.log(JSON.stringify(data));
    await publishMessage(topicName, data, msgtype);
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ error: 'Failed to publish message. Data must be in the form of a Buffer' });
  }
  res.status(200);
  res.send("Success");
}