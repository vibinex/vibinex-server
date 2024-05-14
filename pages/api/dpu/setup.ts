import { NextApiRequest, NextApiResponse } from 'next';
import { removeRepoConfigForInstallIdForOwner } from '../../../utils/db/repos';
import { removePreviousInstallations, saveSetupReposInDb, SetupReposArgs } from '../../../utils/db/setupRepos';
import { getUserIdByTopicName } from '../../../utils/db/users';
import { publishMessage } from '../../../utils/pubsub/pubsubClient';
import rudderStackEvents from '../events';

const setupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	console.info("[setupHandler]Saving setup info in db...");
	const jsonBody = req.body;

	// get user_id for the given install_id
	const userId = await getUserIdByTopicName(jsonBody.installationId).catch((error: any) => {
		console.error("[setupHandler/getUserIdByTopicName] Failed to fetch userId from the database.", error);
	});
	if (!userId) {
		console.error(`[setupHandler/getUserIdByTopicName] NO userId found for topic name: ${jsonBody.installationId} from database.`);
		const eventProperties = { ...jsonBody.info, response_status: 404 };
		rudderStackEvents.track("", "", 'setup', { type: 'setup-repos', eventStatusFlag: 0, eventProperties })
		res.status(404).json({ "error": "No userId found for given installationId" });
		return;
	}
	if (!Array.isArray(jsonBody.info)) {
		console.error("[setupHandler] Invalid request body, 'info' is missing or not an array");
		res.status(400).json({ "error": "Invalid request body" });
		const eventProperties = { ...jsonBody.info, response_status: 400 };
		rudderStackEvents.track(userId, "", 'setup', { type: 'setup-repos', eventStatusFlag: 0, eventProperties })
		return;
	}

	try {
		await removePreviousInstallations(jsonBody.installationId, jsonBody.info[0].provider);
	} catch (err) {
		console.error(`[setupHandler] Unable to remove previous installations for ${jsonBody.installationId}`, err);
		const eventProperties = { ...jsonBody.info, response_status: 500 };
		rudderStackEvents.track("", "", 'setup', { type: 'setup-repos', eventStatusFlag: 0, eventProperties })
		res.status(500).json({ "error": "Internal Server Error" });
		return;
	}
	const allSetupReposPromises = [];
	for (const ownerInfo of jsonBody.info) {
		let setupReposArgs: SetupReposArgs = {
			repo_owner: ownerInfo.owner,
			repo_provider: ownerInfo.provider,
			repo_names: ownerInfo.repos,
			install_id: jsonBody.installationId
		}
		try {
			await removeRepoConfigForInstallIdForOwner(jsonBody.installationId, ownerInfo.repos, ownerInfo.owner, ownerInfo.provider, userId);
		} catch (err) {
			console.error(`[setupHandler] Unable to remove previous repo configurations for ${jsonBody.installationId}`, err);
			const eventProperties = { ...jsonBody.info, response_status: 500 };
			rudderStackEvents.track("", "", 'setup', { type: 'setup-repos', eventStatusFlag: 0, eventProperties })
			res.status(500).json({ "error": "Internal Server Error" });
			return;
		}
		const saveSetupReposPromises = saveSetupReposInDb(setupReposArgs, userId)
			.catch((err) => {
				console.error("[setupHandler] Unable to save setup info, ", err);
			});
		allSetupReposPromises.push(saveSetupReposPromises);
	}
	await Promise.all(allSetupReposPromises).then(async () => {
		console.info("[setupHandler] All setup info saved succesfully...")
		if (jsonBody.isPublish) {
			const res = await publishMessage(jsonBody.installationId, jsonBody.info, "PATSetup");
			console.info(`[setupHandler] Published msg to ${jsonBody.installationId}`, res);
		}
		const eventProperties = { ...jsonBody.info, response_status: 200 };
		rudderStackEvents.track(userId, "", 'setup', { type: 'setup-repos', eventStatusFlag: 1, eventProperties })
		res.status(200).send("Ok");
		return;
	}).catch((error) => {
		console.error("[setupHandler] Unable to save all setup info in db, error: ", error);
		const eventProperties = { ...jsonBody.info, response_status: 500 };
		rudderStackEvents.track("", "", 'setup', { type: 'setup-repos', eventStatusFlag: 0, eventProperties })
		res.status(500).json({ "error": "Unable to save setup info" });
		return;
	});
}

export default setupHandler;
