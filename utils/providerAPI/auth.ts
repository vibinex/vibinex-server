import axios from "axios";
import {getAuthInfoFromDb, saveAuthInfoToDb} from '../db/authInfo';
import AuthInfo from "../../types/AuthInfo";


export const bitbucketAccessToken = async function(providerAccountId: string, userId: string): Promise<string | null> {
	const provider = "bitbucket";
	// get authinfo from db
	const authInfo: AuthInfo | null = await getAuthInfoFromDb(userId).catch(_ => {
        console.error("Failed to fetch auth info from the database.");
        return null;
    });
	if (!authInfo || !authInfo[provider] || !authInfo[provider][providerAccountId]) {
        console.error("Invalid or empty auth info: ", authInfo);
        return null;
    }
	const account = authInfo[provider][providerAccountId];
	// Check if token has expired.
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds.
    if (account.expires_at && account.expires_at > currentTime) {
        return account.access_token!; // Token is still valid.
    }
	// If it has expired, use the refresh token to obtain a new access token.
	if (!account.refresh_token) {
        console.error("No refresh token available.");
        return null;
    }
	const newAuthInfo = await bitbucketRefreshToken(account.refresh_token);
	if (!newAuthInfo) {
		console.error("No new access token returned from refresh token api");
		return null;
	}
	// save new auth info to db
	await saveAuthInfoToDb(userId, newAuthInfo);
	return newAuthInfo[provider][providerAccountId].access_token!;
}

const bitbucketRefreshToken = async function (refreshToken: string): Promise<AuthInfo | null> {
    const tokenUrl = 'https://bitbucket.org/site/oauth2/access_token';
    const clientId = process.env.BITBUCKET_CLIENT_ID;
    const clientSecret = process.env.BITBUCKET_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        console.error('BITBUCKET_CLIENT_ID and BITBUCKET_CLIENT_SECRET must be set');
        return null;
    }
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const payload = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    };
	const response = await axios.post(tokenUrl, new URLSearchParams(payload).toString(), {
		headers: headers,
		auth: {
			username: clientId,
			password: clientSecret
		}
	})
	.catch((error) => {
		console.error(`Error during token refresh: ${error}`);
		return null;
	});
	if (!response || response.status !== 200) {
		console.error(`Failed to get refresh token, status: ${JSON.stringify(response)}`);
		return null;
	}
	console.debug(`response data = ${JSON.stringify(response.data)}`)
	return response.data as AuthInfo;
}