import { supportedProviders, type RepoProvider } from "../utils/providerAPI";
import type { RepoConfig } from "./RepoConfig";

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
	config: RepoConfig,
	install_id: string[],
	aliases: string[],
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
	config: RepoConfig
}