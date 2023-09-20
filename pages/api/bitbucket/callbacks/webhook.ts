import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../..//utils/db/repos'; // Make sure to import the getRepoConfig function

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonBody = req.body;
  const owner = jsonBody.repository.owner.username; 
  const provider = "bitbucket";
  const name = jsonBody.repository.name;
  const topicName = await getTopicNameFromDB(owner, name, provider);

  // Fetch the repository configuration
  const repoConfig = await getRepoConfig({
    repo_provider: provider,
    repo_owner: owner,
    repo_name: name
  });

  const data = {
    repositoryProvider: 'bitbucket',
    eventPayload: jsonBody,
    repoConfig: repoConfig // Add the fetched configuration to the data object
  };
  
  const msgType = 'webhook_callback';
  
  console.info("Received bitbucket webhook event for ", name);
  console.debug(`data = ${JSON.stringify(jsonBody)}`)
  console.debug(`topicname = ${topicName}`)
  console.debug(`repoConfig = ${JSON.stringify(repoConfig)}`)
  
  try {
    await publishMessage(topicName, data, msgType);
    res.status(200);
    res.send("Success");
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).json({ error: 'Failed to publish message. Data must be in the form of a Buffer' });
  }
}

export default webhookHandler;
