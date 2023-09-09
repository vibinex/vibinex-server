import type { RepoProvider } from "../utils/providerAPI";

export type RepoIdentifier = { repo_provider: RepoProvider, repo_owner: string, repo_name: string }

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