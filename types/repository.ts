import { supportedProviders, type RepoProvider } from "../utils/providerAPI";

export type RepoIdentifier = { repo_provider: RepoProvider, repo_owner: string, repo_name: string }

/* This is a "Type Guard" function. It is useful for runtime type checking, like from user input, API calls etc.*/
export const isRepoIdentifier = (x: any): x is RepoIdentifier => {
	return x && (supportedProviders.includes(x.repo_provider)) && (typeof x.repo_owner === "string") && (typeof x.repo_name === "string");
}

export type DbRepo = {
	id: number,
	repo_provider: RepoProvider,
	repo_owner: string,
	repo_name: string,
	auth_info: {
		access_token: string,
		expires_at: string,
	},
	git_url: string[],
	metadata: object,
	created_at: Date,
	config: {
		auto_assign: boolean,
		comment: boolean,
	}
}

export type DbRepoSerializable = {
	id: number,
	repo_provider: RepoProvider,
	repo_owner: string,
	repo_name: string,
	auth_info: {
		access_token: string,
		expires_at: string,
	},
	git_url: string[],
	metadata: object,
	created_at: string,
	config: {
		auto_assign: boolean,
		comment: boolean,
	}
}