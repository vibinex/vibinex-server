type AuthInfo = {
	[provider: string]: {
		[id: string]: {
			type?: string,
			expires_at?: number,
			scope?: string,
			access_token?: string,
			expires_at?: string,
			refresh_token?: string,
			handle: string | null,
			[key: string]: any
		}
	}
}
export default AuthInfo;