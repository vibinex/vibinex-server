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