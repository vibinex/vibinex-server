import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const topicName = process.env.TOPIC_NAME;
  if (topicName) {
    const data = {
      'repository_provider': 'bitbucket',
      'installation_code': req.query.code};
    const msgtype = 'install_callback';
    console.info("Recieved installation code for bitbucket, published to ", topicName);
    try {
      await publishMessage(topicName, data, msgtype);
    } catch (error) {
      console.error('Error publishing message:', error);
      res.status(500).json({ error: 'Failed to publish message. Data must be in the form of a Buffer.' });
    }
  } else {
    console.error('TOPIC_NAME not set');
    res.status(500).json({ error: 'Failed to publish message'});
  }
  res.redirect('/u');
}

export default handler;