import { NextApiRequest, NextApiResponse } from "next";
import { getGitAliasesWithHandlesFromDB, saveGitAliasMapToDB } from "../../utils/db/aliases";
import { AliasProviderMap } from "../../types/AliasMap";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const aliasHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;
    const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Unauthenticated' });
	}
    if (method === 'GET') {
        const userId = session.user.id;
        if (!userId) {
            res.status(500).json({error: "No user id in session"});
            return;
        }
        // check if query object has the expanded element and if it does, then check if it is true or false
        if (query?.expanded && query?.expanded !== "true" && query?.expanded !== "false") {
            res.status(400).json({ error: "Invalid parameters in query: `expanded` must be true or false." });
            return;
        }
        const expanded: boolean = JSON.parse(String(query?.expanded) || "false");
        await getGitEmailAliases(userId, expanded)
        .then((aliasProviderMap) => {
            res.status(200).json({ aliasProviderMap });
        }).catch((error) => {
            res.status(500).json({error: error});
        });
    } else if (method === 'POST') {
        const aliasProviderMap: AliasProviderMap = body.aliasProviderMap;
        await saveGitAliasMap(aliasProviderMap)
        .then(() => {
            res.status(200).send('Git alias map saved successfully.');
        }).catch((error) => {
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

const saveGitAliasMap = async (aliasProviderMap: AliasProviderMap): Promise<void> => {
    // Validate that aliasMap is provided
    if (!aliasProviderMap) {
        throw new Error("Alias Provider map is required to save Git email aliases.");
    }
    await saveGitAliasMapToDB(aliasProviderMap);
}


export default aliasHandler;