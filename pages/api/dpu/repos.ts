import { NextApiRequest, NextApiResponse } from "next";
import { getUserRepositoriesByTopic } from "../../../utils/db/repos";
import { RepoIdentifier } from "../../../types/repository";

const reposHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const jsonBody = req.body;
    if (!jsonBody.topic_id || jsonBody.topic_id.length == 0) {
        res.status(400).json({ error: 'Invalid get request body' });
		return;
    }
    const topicId = jsonBody.topic_id;
    const repoList: RepoIdentifier[] = await getUserRepositoriesByTopic(topicId);
	if (repoList.length == 0) {
		return res.status(500).json({error: 'Unable to get repo list'});
	}
	return res.status(200).json({repoList: repoList});
}

export default reposHandler;