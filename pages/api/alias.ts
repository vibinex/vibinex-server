import { NextApiRequest, NextApiResponse } from "next";
import { getGitEmailAliasesFromDB, saveGitAliasMapToDB } from "../../utils/db/aliases";
import { AliasProviderMap, HandleMap, AliasMap } from "../../types/AliasMap";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const aliasHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method, query, body } = req;
    console.log(`[aliasHandler] method = ${method}, query = ${query} body = ${JSON.stringify(body)}`);
    const session = await getServerSession(req, res, authOptions);
	if (!session) {
		return res.status(401).json({ message: 'Unauthenticated' });
	}
    if (method === 'GET') {
        const user_id = session.user.id
        if (!user_id) {
            
            throw new Error("User ID is required for the getting alias provider map.");
        }
        const aliasProviderMap = await getGitEmailAliases(user_id);
        res.status(200).json({ aliasProviderMap });
    } else if (method === 'POST') {
        const aliasProviderMap: AliasProviderMap = body.aliasProviderMap;
        await saveGitAliasMap(aliasProviderMap);
        res.status(200).send('Git alias map saved successfully.');
    } else {
        res.status(405).send('Method Not Allowed');
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
    await saveGitAliasMapToDB(aliasProviderMap);
}


export default aliasHandler;