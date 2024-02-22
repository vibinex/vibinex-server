type AliasMap = {
	alias: string,
    handles: String[],
}

export type HandleMap = {
    provider: string,
    handles: AliasMap[],
}

export type AliasProviderMap = {
    aliases: HandleMap[],
}
