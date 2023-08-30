import type { RepoProvider } from "../utils/providerAPI";

export type RepoIdentifier = { repo_provider: RepoProvider, repo_owner: string, repo_name: string }