import axios from "axios";
import {getAuthInfoFromDb, saveAuthInfoToDb} from '../db/authInfo';
import AuthInfo from "../../types/AuthInfo";


export const bitbucketAccessToken = async function(providerAccountId: string, userId: string): Promise<string | null> {
    const provider = "bitbucket";
	// get authinfo from db
	const authInfo: AuthInfo | null = await getAuthInfoFromDb(userId).catch(_ => {
        console.error("[bitbucketAccessToken] Failed to fetch auth info from the database.");
        return null;
    });
	if (!authInfo || !authInfo[provider] || !authInfo[provider][providerAccountId]) {
        console.error("[bitbucketAccessToken] Invalid or empty auth info: ", authInfo);
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
        console.error("[bitbucketAccessToken] No refresh token available.");
        return null;
    }
	const newAuthInfo = await bitbucketRefreshToken(account.refresh_token, authInfo, providerAccountId);
	if (!newAuthInfo || !newAuthInfo[provider] || !newAuthInfo[provider][providerAccountId]) {
		console.error("[bitbucketAccessToken] No new access token returned from refresh token api", JSON.stringify(newAuthInfo!));
		return null;
	}
	// save new auth info to db
	await saveAuthInfoToDb(userId, newAuthInfo);
	return newAuthInfo[provider][providerAccountId].access_token!;
}

const bitbucketRefreshToken = async function (refreshToken: string, authInfoDb: AuthInfo, providerAccountId: string): Promise<AuthInfo | null> {
    console.info("Refreshing bitbucket token...", providerAccountId, refreshToken, JSON.stringify(authInfoDb));
    const tokenUrl = 'https://bitbucket.org/site/oauth2/access_token';
    const clientId = process.env.BITBUCKET_CLIENT_ID;
    const clientSecret = process.env.BITBUCKET_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        console.error('[bitbucketRefreshToken] BITBUCKET_CLIENT_ID and BITBUCKET_CLIENT_SECRET must be set');
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
		console.error(`[bitbucketRefreshToken] Error during token refresh: ${error}`);
		return null;
	});
	if (!response || response.status !== 200) {
		console.error(`[bitbucketRefreshToken] Failed to get refresh token, status: ${JSON.stringify(response)}`);
		return null;
	}
    const provider = "bitbucket";
    if (!authInfoDb[provider] || !authInfoDb[provider][providerAccountId]) {
		console.error("[bitbucketRefreshToken] No new access token returned from refresh token api", JSON.stringify(authInfoDb));
		return null;
	}
    authInfoDb[provider][providerAccountId].access_token = response.data.access_token;
    authInfoDb[provider][providerAccountId].expires_at = response.data.expires_at;
    authInfoDb[provider][providerAccountId].refresh_token = response.data.refresh_token;
    authInfoDb[provider][providerAccountId].handle = response.data.handle;
    console.debug(`[bitbucketRefreshToken] Updated authinfo = ${JSON.stringify(authInfoDb)}`)
	return authInfoDb;
}