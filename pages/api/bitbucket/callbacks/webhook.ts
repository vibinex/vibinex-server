import { NextApiRequest, NextApiResponse } from 'next';
import { publishMessage } from '../../../../utils/pubsub/pubsubClient';
import { getTopicNameFromDB } from '../../../../utils/db/relevance';
import { getRepoConfig } from '../../../../utils/db/repos';

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonBody = req.body;
  const owner = jsonBody.repository.owner.username; 
  const provider = "bitbucket";
  const name = jsonBody.repository.name;
  const topicName = await getTopicNameFromDB(owner, name, provider).catch((error) => {
    console.error('[bitbucket/webookHandler] Failed to get repoConfig from db:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  const repoConfig = await getRepoConfig({
    repo_provider: provider,
    repo_owner: owner,
    repo_name: name
  }).catch((error) => {
    console.error('Failed to get repoConfig from db :', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  const data = {
    repositoryProvider: 'bitbucket',
    eventPayload: jsonBody,
    repoConfig: repoConfig
  };
  
  const msgType = 'webhook_callback';
  
  console.info("Received bitbucket webhook event for ", name);
  console.debug(`data = ${JSON.stringify(jsonBody)}`)
  console.debug(`topicname = ${topicName}`)
  console.debug(`repoConfig = ${JSON.stringify(repoConfig)}`)
  const topicName_str = topicName as string;
  await publishMessage(topicName_str, data, msgType).catch((error) => {
    console.error('Failed to get repoConfig from db :', error);
    res.status(500).json({ error: 'Internal Server Error' });
  });;
  console.info("Sending message to pubsub for ", name);
  res.status(200);
  res.send("Success");
}

export default webhookHandler;
