import { NextApiRequest, NextApiResponse } from "next";
import { getGitAliasesWithHandlesFromDB, saveGitAliasMapToDB } from "../../utils/db/aliases";
import type { AliasMap, AliasProviderMap } from "../../types/AliasMap";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import rudderStackEvents from "./events";

const aliasHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;
    const session = await getServerSession(req, res, authOptions);
	if (!session) {
        const eventProperties = { response_status: 401 };
        rudderStackEvents.track("absent", "", 'alias-handler', { type: 'user-auth', eventStatusFlag: 0, eventProperties });
		return res.status(401).json({ message: 'Unauthenticated' });
	}
    if (method === 'GET') {
        const userId = session.user.id;
        if (!userId) {
            const eventProperties = { response_status: 500 };
            rudderStackEvents.track("absent", "", 'alias-handler', { type: 'user-id', eventStatusFlag: 0, eventProperties });    
            res.status(500).json({error: "No user id in session"});
            return;
        }
        // check if query object has the expanded element and if it does, then check if it is true or false
        if (query?.expanded && query?.expanded !== "true" && query?.expanded !== "false") {
            const eventProperties = { ...query, response_status: 400 };
            rudderStackEvents.track(userId, "", 'alias-handler', { type: 'invalid-query-params', eventStatusFlag: 0, eventProperties });    
            res.status(400).json({ error: "Invalid parameters in query: `expanded` must be true or false." });
            return;
        }
        const expanded: boolean = query?.expanded === "true";
        await getGitEmailAliases(userId, expanded)
        .then((aliasProviderMap) => {
            const eventProperties = { ...query, response_status: 200 };
            rudderStackEvents.track(userId, "", 'alias-handler', { type: 'get-git-email-aliases', eventStatusFlag: 1, eventProperties });    
            res.status(200).json({ aliasProviderMap });
        }).catch((error) => {
            const eventProperties = { ...query, response_status: 500 };
            rudderStackEvents.track(userId, "", 'alias-handler', { type: 'get-git-email-aliases', eventStatusFlag: 0, eventProperties });    
            res.status(500).json({error: error});
        });
    } else if (method === 'POST') {
        const aliasHandleMap: AliasMap = body.aliasHandleMap;
        await saveGitAliasMap(aliasHandleMap)
        .then(() => {
            const eventProperties = { response_status: 200 };
            rudderStackEvents.track("absent", "", 'alias-handler', { type: 'save-git-email-aliases', eventStatusFlag: 1, eventProperties });    
            res.status(200).send('Git alias map saved successfully.');
        }).catch((error) => {
            console.error(`[aliasHandler] Error saving Git alias map: ${error}`);
            const eventProperties = { response_status: 500 };
            rudderStackEvents.track("absent", "", 'alias-handler', { type: 'save-git-email-aliases', eventStatusFlag: 0, eventProperties });    
            res.status(500).json({error: error});
        });
    } else {
        res.status(405).send('Method Not Allowed');
    }
}


const getGitEmailAliases = async (userId: string, expanded?: boolean): Promise<AliasProviderMap> => {
    // Validate that userId is provided
    if (!userId) {
        throw new Error("User ID is required to fetch Git email aliases.");
    }

    // Call the database function to get Git email aliases
    const allGitAliasMap = await getGitAliasesWithHandlesFromDB(userId);
    if (expanded) return allGitAliasMap;
    return {
        providerMaps: allGitAliasMap.providerMaps.filter((providerMap) => {
            const hasHandles = providerMap.handleMaps && providerMap.handleMaps.some(handleMap => handleMap.handles.length > 0);
            return !hasHandles;
        })
    }
}

const saveGitAliasMap = async (aliasHandleMap: AliasMap): Promise<void> => {
    // Validate that aliasMap is provided
    if (!aliasHandleMap) {
        throw new Error("Alias Provider map is required to save Git email aliases.");
    }
    await saveGitAliasMapToDB(aliasHandleMap);
}


export default aliasHandler;