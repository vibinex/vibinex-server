import { RepoProvider } from "../utils/providerAPI"

type HandleMap = {
	provider: RepoProvider,
    handles: string[],
}

export type AliasMap = {
    alias: string,
    handleMaps: HandleMap[],
}

export type AliasProviderMap = {
    providerMaps: AliasMap[],
}
