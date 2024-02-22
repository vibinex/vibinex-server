import { NextApiRequest, NextApiResponse } from "next";
import { getGitEmailAliasesFromDB, saveGitAliasMapToDB } from "../../utils/db/aliases";
import { AliasProviderMap, HandleMap, AliasMap } from "../../types/AliasMap";
import { log } from "console";

const aliasHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;
    console.error(`[aliasHandler] method = ${method}, query = ${query} body = ${body}`);
    
    try {
        if (method === 'GET') {
            const user_id = query.user_id as string;
            if (!user_id) {
                throw new Error("User ID is required for the GET method.");
            }
            const aliasProviderMap = await getGitEmailAliases(user_id);
            res.status(200).json({ aliasProviderMap });
        } else if (method === 'POST') {
            const aliasmap: AliasProviderMap = JSON.parse(body);
            await saveGitAliasMap(aliasmap);
            res.status(200).send('Git alias map saved successfully.');
        } else {
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error('Error handling alias request:', error);
        res.status(500).send('Internal Server Error');
    }
}


const getGitEmailAliases = async (userId: string): Promise<AliasProviderMap> => {
    // Validate that userId is provided
    console.error("[getGitEmailAliases] userId = ", userId);
    if (!userId) {
        throw new Error("User ID is required to fetch Git email aliases.");
    }

    // Call the database function to get Git email aliases
    return await getGitEmailAliasesFromDB(userId);
}

const saveGitAliasMap = async (aliasProviderMap: AliasProviderMap): Promise<void> => {
    // Validate that aliasMap is provided
    if (!aliasProviderMap) {
        throw new Error("Alias Provider map is required to save Git email aliases.");
    }
    const hMapArray = aliasProviderMap.aliases;
    hMapArray.forEach(async (hMap) => {
        await saveGitAliasMapToDB(hMap);
    });
}


export default aliasHandler;