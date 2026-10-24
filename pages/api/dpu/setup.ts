import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import conn from '../../../utils/db';
import { removeRepoConfigForInstallIdForOwner } from '../../../utils/db/repos';
import { SetupReposArgs, removePreviousInstallations, saveSetupReposInDb } from '../../../utils/db/setupRepos';
import { getUserIdByTopicName } from '../../../utils/db/users';
import { publishMessage } from '../../../utils/pubsub/pubsubClient';
import { authOptions } from '../auth/[...nextauth]';
import rudderStackEvents from '../events';

type SetupInfo = {
	owner: string;
	provider: string;
	repos: string[];
};

type SetupRequest = {
	installationId: string;
	info: SetupInfo[];
	isPublish?: boolean;
};

const isSetupRequest = (body: unknown): body is SetupRequest => {
	if (!body || typeof body !== 'object') return false;
	const candidate = body as Partial<SetupRequest>;
	return typeof candidate.installationId === 'string'
		&& Array.isArray(candidate.info)
		&& candidate.info.length > 0
		&& candidate.info.every((entry) => entry
			&& typeof entry.owner === 'string'
			&& typeof entry.provider === 'string'
			&& Array.isArray(entry.repos)
			&& entry.repos.every((repo) => typeof repo === 'string'))
		&& (candidate.isPublish === undefined || typeof candidate.isPublish === 'boolean');
};

const setupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	const session = await getServerSession(req, res, authOptions);
	if (!session?.user?.id) {
		const eventProperties = { response_status: 401 };
		rudderStackEvents.track('absent', '', 'dpu-setup', { type: 'HTTP-401', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ error: 'Unauthenticated' });
	}
	if (!isSetupRequest(req.body)) {
		const eventProperties = { response_status: 400 };
		rudderStackEvents.track(session.user.id, '', 'dpu-setup', { type: 'HTTP-400', eventStatusFlag: 0, eventProperties });
		return res.status(400).json({ error: 'Invalid request body' });
	}

	const { installationId, info, isPublish = false } = req.body;
	const eventProperties = {
		repo_provider: info[0].provider,
		topic_name: installationId,
		repos: '',
		repo_owner: '',
		is_pat: isPublish,
	};

	const userId = await getUserIdByTopicName(installationId).catch((error: unknown) => {
		console.error('[setupHandler] Failed to fetch installation owner', error);
		return null;
	});
	if (!userId) {
		const eventPropertiesWithStatus = { ...eventProperties, response_status: 404 };
		rudderStackEvents.track(session.user.id, '', 'dpu-setup', { type: 'HTTP-404', eventStatusFlag: 0, eventProperties: eventPropertiesWithStatus });
		return res.status(404).json({ error: 'No user found for given installationId' });
	}
	if (userId !== session.user.id) {
		const eventPropertiesWithStatus = { ...eventProperties, response_status: 403 };
		rudderStackEvents.track(session.user.id, '', 'dpu-setup', { type: 'HTTP-403', eventStatusFlag: 0, eventProperties: eventPropertiesWithStatus });
		return res.status(403).json({ error: 'Forbidden' });
	}

	const client = await conn.connect();
	try {
		await client.query('BEGIN');

		// Remove stale configuration before clearing the installation ID it uses for lookup.
		for (const ownerInfo of info) {
			await removeRepoConfigForInstallIdForOwner(installationId, ownerInfo.repos, ownerInfo.owner, ownerInfo.provider, userId, client);
		}

		for (const provider of Array.from(new Set(info.map((ownerInfo) => ownerInfo.provider)))) {
			await removePreviousInstallations(installationId, provider, client);
		}

		for (const ownerInfo of info) {
			if (ownerInfo.repos.length === 0) continue;
			const setupReposArgs: SetupReposArgs = {
				repo_owner: ownerInfo.owner,
				repo_provider: ownerInfo.provider,
				repo_names: ownerInfo.repos,
				install_id: installationId,
			};
			const saved = await saveSetupReposInDb(setupReposArgs, userId, client);
			if (!saved) throw new Error('Unable to save repository setup');
		}

		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK').catch(() => undefined);
		console.error('[setupHandler] Unable to save setup information', error);
		const eventPropertiesWithStatus = { ...eventProperties, response_status: 500 };
		rudderStackEvents.track(userId, '', 'dpu-setup', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties: eventPropertiesWithStatus });
		return res.status(500).json({ error: 'Unable to save setup information' });
	} finally {
		client.release();
	}

	try {
		if (isPublish) {
			await publishMessage(installationId, info, 'PATSetup');
		}
	} catch (error) {
		console.error('[setupHandler] Unable to publish setup information', error);
		const eventPropertiesWithStatus = { ...eventProperties, response_status: 500 };
		rudderStackEvents.track(userId, '', 'dpu-setup', { type: 'HTTP-500', eventStatusFlag: 0, eventProperties: eventPropertiesWithStatus });
		return res.status(500).json({ error: 'Unable to publish setup information' });
	}

	const eventPropertiesWithStatus = { ...eventProperties, response_status: 200 };
	rudderStackEvents.track(userId, '', 'dpu-setup', { type: 'HTTP-200', eventStatusFlag: 1, eventProperties: eventPropertiesWithStatus });
	return res.status(200).send('Ok');
};

export default setupHandler;
