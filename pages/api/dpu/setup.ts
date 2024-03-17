import { NextApiRequest, NextApiResponse } from 'next';
import { SetupReposArgs, removePreviousInstallations, saveSetupReposInDb } from '../../../utils/db/setupRepos';

const setupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	console.info("[setupHandler]Saving setup info in db...");
	const jsonBody = req.body;
	if (!Array.isArray(jsonBody.info)) {
		console.error("[setupHandler] Invalid request body, 'info' is missing or not an array");
		res.status(400).json({ "error": "Invalid request body" });
		return;
	}
	// delete previous installations
	let installsRemoved = true;
	await removePreviousInstallations(jsonBody.installationId).catch(err => {
		console.error(`[setupHandler] Unable to remove previous installations for ${jsonBody.installationId}`, err);
		res.status(500).json({"error": "Internal Server Error"});
		installsRemoved = false;
		return;
	});
	if (!installsRemoved) {
		return;
	}
	const allSetupReposPromises = [];
	console.log(`dpu/[setupHandler] ${JSON.stringify(jsonBody)}`);
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
		allSetupReposPromises.push(saveSetupReposPromises);
	}
	await Promise.all(allSetupReposPromises).then((values) => {
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
