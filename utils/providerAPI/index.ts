import axios from "axios";

export type RepoProvider = 'github' | 'bitbucket' | 'gitlab';

export const supportedProviders: RepoProvider[] = [
	'github',
	'bitbucket',
	'gitlab'
]

export const baseURL = {
	'github': "https://api.github.com",
	'bitbucket': "https://api.bitbucket.org/2.0",
	'gitlab': "https://gitlab.com/api/v4",
}

export const getBitbucketData = async <T>(endpoint: string, accessKey: string, authId?: string): Promise<T> => {
	const response = await axios.get<T>(`${baseURL['bitbucket']}${endpoint}`, {
		headers: {
			'Accept': 'application/json',
			'Authorization': `Bearer ${accessKey}`
		}
	}).catch(err => {
		console.error(`[getBitbucketData] axios GET call failed for endpoint: ${endpoint} :: for auth-ID ${authId})`, err)
		throw new Error(err);
	});
	if (response.status !== 200) {
		throw new Error(`Bitbucket API request failed (${endpoint} :: for auth-ID ${authId}) - Status ${response.status}\nERROR: ${JSON.stringify(response.data)}`);
	}
	return response.data;
};

/**
 * Make sure to only run it for paginated APIs. Otherwise use getBitbucketData().
 * @param endpoint Endpoint from which paginated response will be received.
 * @param accessKey Updated access key for authenticating API calls
 * @param authId (optional) auth-ID for identifying the affected user in the error reporting.
 * @returns a concatenated list of items from all the pages
 */
export const retrieveAllPagesBitbucket = async <T>(endpoint: string, accessKey: string, authId?: string): Promise<T[]> => {
	let results: T[] = [];
	let nextPageEndpoint = endpoint;

	while (nextPageEndpoint) {
		const pageData = await getBitbucketData<{ values: T[], next: string }>(nextPageEndpoint, accessKey, authId);
		results = [...results, ...pageData.values];
		nextPageEndpoint = (pageData.next) ? pageData.next.split(baseURL['bitbucket'])[1] : "";
	}
	return results;
};