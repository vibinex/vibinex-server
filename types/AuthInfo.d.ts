type AuthInfo = {
	[provider: string]: {
		[id: string]: {
			type?: string,
			expires_at?: number,
			handle?: string | null,
			[key: string]: any
		}
	}
}

export default AuthInfo;