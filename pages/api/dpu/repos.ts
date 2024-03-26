import { NextApiRequest, NextApiResponse } from "next";
import { getUserRepositoriesByTopic } from "../../../utils/db/repos";
import { RepoIdentifier } from "../../../types/repository";

const reposHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { topicId, provider } = req.query;
    if (!topicId || !provider 
        || Array.isArray(topicId) || Array.isArray(provider)
        || topicId.length === 0 || provider.length === 0) {
        res.status(400).json({ error: 'Invalid get request body' });
		return;
    }
    const repoList: RepoIdentifier[] | null = await getUserRepositoriesByTopic(topicId, provider).catch((err) => {
        console.error(`[reposHandler] Unable to get user repos for topic ${topicId}`);
        return null;
    });
    if (repoList == null) {
        res.status(500).json({"error": "Unable to get user repos from db"});
        return;
    }
	res.status(200).json({repoList: repoList});
    return;
}

export default reposHandler;