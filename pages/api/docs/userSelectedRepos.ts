import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { SetupReposArgs, removePreviousSelections, saveSelectedReposInDb } from "../../../utils/db/setupRepos";
import { publishMessage } from "../../../utils/pubsub/pubsubClient";
import { authOptions } from "../auth/[...nextauth]";
import rudderStackEvents from "../events";

const UserSelectedRepos = async (req: NextApiRequest, res: NextApiResponse) => {
	console.info("[UserSelectedRepos] Saving setup info in db...");
	const jsonBody = req.body;
	const session = await getServerSession(req, res, authOptions);
	if (!session?.user?.id) {
		const eventProperties = { response_status: 401 };
		rudderStackEvents.track("absent", "", 'user-selected-repos', { type: 'HTTP-401', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ error: 'Unauthenticated' });
	}
	const userId = session.user.id;
	const provider = jsonBody.info.length > 0 ? jsonBody.info[0].provider : null;
	if (!Array.isArray(jsonBody.info) || !jsonBody.installationId || !provider) {
		console.error("[UserSelectedRepos] Invalid request body", jsonBody);
		res.status(400).json({ error: "Invalid request body" });
		const eventProperties = { response_status: 400 };
		rudderStackEvents.track(userId, "", 'user-selected-repos', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return;
	}
	const event_properties = {
		repo_provider: provider,
		topic_name: jsonBody.installationId || "",
		is_pat: jsonBody.isPublish || false,
	};

	try {
		await removePreviousSelections(jsonBody.installationId, provider);
	} catch (err) {
		console.error(`[UserSelectedRepos] Unable to remove previous installations for ${jsonBody.installationId}`, err);
		res.status(500).json({ "error": "Internal Server Error" });
		const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track(userId, "", 'user-selected-repos', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties });
		return;
	}
	const allSelectedReposPromises = [];
	for (const ownerInfo of jsonBody.info) {
		const setupReposArgs: SetupReposArgs = {
			repo_owner: ownerInfo.owner,
			repo_provider: provider,
			repo_names: ownerInfo.repos,
			install_id: jsonBody.installationId
		}
		const saveSelectedReposPromises = saveSelectedReposInDb(setupReposArgs, userId)
			.catch((err) => {
				console.error("[UserSelectedRepos] Unable to save setup info, ", err);
				const eventProperties = { ...event_properties, repo_owner: ownerInfo.owner, repos: ownerInfo.repos };
				rudderStackEvents.track(userId, "", 'user-selected-repos', { type: 'saveSelectedReposInDb-error', eventStatusFlag: 0, eventProperties });
			});
		allSelectedReposPromises.push(saveSelectedReposPromises);
	}
	await Promise.all(allSelectedReposPromises).then(async () => {
		console.info("[UserSelectedRepos] All selected repos saved succesfully...")
		if (jsonBody.isPublish) {
			const res = await publishMessage(jsonBody.installationId, jsonBody.info, "PATSetup");
			console.info(`[UserSelectedRepos] Published msg to ${jsonBody.installationId}`, res);
			const eventProperties = { ...event_properties, response_status: 500 };
			rudderStackEvents.track(userId, "", 'user-selected-repos', { type: 'HTTP-500', eventStatusFlag: 1, eventProperties });
		}
		res.status(200).send("Ok");
		const eventProperties = { ...event_properties, response_status: 200 };
		rudderStackEvents.track(userId, "", 'user-selected-repos', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties })
		return;
	}).catch((error) => {
		console.error("[UserSelectedRepos] Unable to save all selected repo in db, error: ", error);
		res.status(500).json({ "error": "Unable to save setup info" });
		const eventProperties = { ...event_properties, response_status: 500 };
		rudderStackEvents.track(userId, "", 'user-selected-repos', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties })
		return;
	});
}

export default UserSelectedRepos;