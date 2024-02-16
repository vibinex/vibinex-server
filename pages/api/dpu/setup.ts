import { NextApiRequest, NextApiResponse } from 'next';
import { saveTopicName } from '../../../utils/db/relevance';
import { SetupReposArgs } from '../../../utils/db/setupRepos';
import saveSetupReposInDb from '../../../utils/db/setupRepos';

const setupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	console.info("[setupHandler]Saving setup info in db...");
	const jsonBody = req.body;
	if (!Array.isArray(jsonBody.info)) {
		console.error("[setupHandler] Invalid request body, 'info' is missing or not an array");
		res.status(400).json({ "error": "Invalid request body" });
		return;
	}
	const allTopicPromises = [];
	for (const ownerInfo of jsonBody.info) {
		let setupReposArgs: SetupReposArgs = {
			repo_owner: ownerInfo.owner,
			repo_provider:  ownerInfo.provider,
			repo_names: ownerInfo.repos,
			install_id: jsonBody.installationId
		}
		const saveSetupReposPromises = saveSetupReposInDb(setupReposArgs)
			.catch((err) => {
				console.error("[setupHandler] Unable to save setup info, ", err);
			});
		allTopicPromises.push(saveSetupReposPromises);
	}
	await Promise.all(allTopicPromises).then((values) => {
		console.info("[setupHandler] All setup info saved succesfully...")
		res.status(200).send("Ok");
		return;
	}).catch((error) => {
		console.error("[setupHandler] Unable to save all setup info in db, error: ", error);
		res.status(500).json({ "error": "Unable to save setup info" });
		return;
	});
}

export default setupHandler;
