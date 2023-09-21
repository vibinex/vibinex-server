type AuthInfo = {
	[provider: string]: {
		[id: string]: {
			type?: string,
			expires_at?: number,
			[key: string]: any
		}
	}
}
export default AuthInfo