type HandleMap = {
	provider: string,
    handles: string[],
}

export type AliasMap = {
    alias: string,
    handleMaps: HandleMap[],
}

export type AliasProviderMap = {
    providerMaps: AliasMap[],
}
