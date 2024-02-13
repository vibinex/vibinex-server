import { NextApiRequest, NextApiResponse } from 'next';
import { saveUserAliasesToDb } from '../../../utils/db/aliases';

const aliasesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.info("[newEndpointHandler] Processing new endpoint request...");
    const jsonBody = req.body;
    
    // Validate the JSON body
    if (!jsonBody || !jsonBody.repo_name || !jsonBody.repo_owner || !jsonBody.repo_provider
        || !Array.isArray(jsonBody.aliases)) {
        console.error("[aliasesHandler] Invalid request body", jsonBody);
        res.status(400).json({ "error": "Invalid request body" });
        return;
    }

    // Save users to the database
    await saveUserAliasesToDb(
        jsonBody.repo_name, jsonBody.repo_owner, jsonBody.repo_provider, jsonBody.aliases
    ).then(() => {
        console.info("[aliasesHandler] Aliases saved to DB successfully");
        res.status(200).send("OK");
        return;
    }).catch((error) => {
        console.error("[aliasesHandler] Unable to save users to DB, error: ", error);
        res.status(500).json({ "error": "Unable to save users to DB" });
        return;
    });
};

export default aliasesHandler;
