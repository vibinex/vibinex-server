import conn from ".";
import { DbUser, createUpdateUserObj } from "./users";

describe('unit testing updateUser object creation (except auth_info)', () => {
	it("changing id", async () => {
		const new_user: DbUser = { id: 5 }
		const actual_output = await createUpdateUserObj(1, new_user);

		expect(actual_output?.id).toBe(undefined); // id should not change anything
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(0);
	})

	it("changing name", async () => {
		const new_user: DbUser = { name: `dummyuser_${Math.random().toString().substring(2)}` };
		const actual_output = await createUpdateUserObj(1, new_user);

		expect(actual_output?.name).toBe(new_user.name);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("changing photo", async () => {
		const new_user: DbUser = { profile_url: `${Math.random().toString().substring(2)}.png` };
		const actual_output = await createUpdateUserObj(1, new_user);

		expect(actual_output?.profile_url).toBe(new_user.profile_url);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("changing name and photo", async () => {
		const new_user: DbUser = {
			name: `dummyuser_${Math.random().toString().substring(2)}`,
			profile_url: `${Math.random().toString().substring(2)}.png`
		};
		const actual_output = await createUpdateUserObj(1, new_user);

		expect(actual_output?.name).toBe(new_user.name);
		expect(actual_output?.profile_url).toBe(new_user.profile_url);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(2);
	})

	it("repeating same aliases", async () => {
		const new_user: DbUser = { aliases: ["somone@somedomain.com", "someoneelse@domain.com"] };
		const actual_output = await createUpdateUserObj(1, new_user);

		expect(actual_output?.aliases).toBe(undefined);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(0);
	})

	it("only adding new aliases", async () => {
		const new_user: DbUser = { aliases: ["different@somedomain.com", "newemail@example.com"] };
		const actual_output = await createUpdateUserObj(1, new_user);

		expect(actual_output?.aliases?.length).toBe(4);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		new_user.aliases?.forEach(alias => expect(actual_output?.aliases).toContain(alias));
	})

	it("adding and repeating aliases", async () => {
		const new_user: DbUser = { aliases: ["somone@somedomain.com", "newemail@example.com"] };
		const actual_output = await createUpdateUserObj(1, new_user);

		expect(actual_output?.aliases?.length).toBe(3);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		new_user.aliases?.forEach(alias => expect(actual_output?.aliases).toContain(alias));
	})
})

describe('unit testing auth-info updates in updateUser object creation', () => {
	const getOriginalAuthInfo = async (userId: number) => {
		const user_q = `SELECT * FROM users WHERE id = ${userId}`;
		const user_result = await conn.query(user_q);
		if (user_result.rowCount == 0) {
			console.error("[getOriginalAuthInfo] No user found for the given userId: " + userId);
			return {
				'google': {
					"107703478642721836559": {
						"type": "oauth",
						"scope": "https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
						"access_token": "ya29.a0AVvZVsopfxREfEB_6VrUuWJ1egdOkxhSc2JC0Zav42oN3haqvwRhCNqeQYxrT2OCQKU5lqTse6rlkLi54nEUK5dekebL8mUaFUNORuYzC4ejOFdhiO_icIV6CMwWgRAYDWxxRe_6RjVm1XCrdhNGGmkSSqQUgwaCgYKAYMSARMSFQGbdwaIQ5HEvtcgb_n-jfztWhRRwg0165",
						"expires_at": 1678082911
					}
				}
			}
		}
		return user_result.rows[0].auth_info;
	}

	it("repeating auth", async () => {
		const original_auth_info = await getOriginalAuthInfo(3);
		const new_user: DbUser = {
			auth_info: JSON.parse(JSON.stringify(original_auth_info))
		};
		const actual_output = await createUpdateUserObj(3, new_user);

		expect(actual_output?.auth_info).toStrictEqual(new_user.auth_info);
		expect(actual_output?.auth_info).toStrictEqual(original_auth_info);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("repeating auth with updated details", async () => {
		const original_auth_info = await getOriginalAuthInfo(3);
		const new_user: DbUser = {
			auth_info: {
				'google': {
					"107703478642721836559": {
						"type": "oauth",
						"scope": "https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
						"access_token": "za29.a0AVvZVsopfxREfEB_6VrUuWJ1egdOkxhSc2JC0Zav42oN3haqvwRhCNqeQYxrT2OCQKU5lqTse6rlkLi54nEUK5dekebL8mUaFUNORuYzC4ejOFdhiO_icIV6CMwWgRAYDWxxRe_6RjVm1XCrdhNGGmkSSqQUgwaCgYKAYMSARMSFQGbdwaIQ5HEvtcgb_n-jfztWhRRwg0165",
						"expires_at": 3678082912
					}
				}
			}
		};
		const actual_output = await createUpdateUserObj(3, new_user);

		expect(actual_output?.auth_info).toStrictEqual(new_user.auth_info);
		expect(actual_output?.auth_info).not.toStrictEqual(original_auth_info);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("repeating auth provider with new id", async () => {
		const original_auth_info = await getOriginalAuthInfo(3);
		const new_user: DbUser = {
			auth_info: {
				'google': {
					"107703478642721836551": {
						"type": "oauth",
						"scope": "https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
						"access_token": "za29.a0AVvZVsopfxREfEB_6VrUuWJ1egdOkxhSc2JC0Zav42oN3haqvwRhCNqeQYxrT2OCQKU5lqTse6rlkLi54nEUK5dekebL8mUaFUNORuYzC4ejOFdhiO_icIV6CMwWgRAYDWxxRe_6RjVm1XCrdhNGGmkSSqQUgwaCgYKAYMSARMSFQGbdwaIQ5HEvtcgb_n-jfztWhRRwg0165",
						"expires_at": 1678082912
					}
				}
			}
		};
		const actual_output = await createUpdateUserObj(3, new_user);

		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		expect(actual_output?.auth_info).not.toStrictEqual(original_auth_info);
		expect(actual_output?.auth_info?.google).toHaveProperty('107703478642721836559');
		expect(actual_output?.auth_info?.google['107703478642721836559']).toStrictEqual(original_auth_info.google['107703478642721836559']);
		expect(actual_output?.auth_info?.google).toHaveProperty('107703478642721836551');
		expect(actual_output?.auth_info?.google['107703478642721836551']).toStrictEqual(new_user.auth_info?.google['107703478642721836551']);
	})

	it("adding new auth provider", async () => {
		const original_auth_info = await getOriginalAuthInfo(3);
		const new_user: DbUser = {
			auth_info: {
				'github': {
					"107703478642721836551": {
						"type": "oauth",
						"scope": "https://www.googleapis.com/auth/userinfo.email openid https://www.googleapis.com/auth/userinfo.profile",
						"access_token": "za29.a0AVvZVsopfxREfEB_6VrUuWJ1egdOkxhSc2JC0Zav42oN3haqvwRhCNqeQYxrT2OCQKU5lqTse6rlkLi54nEUK5dekebL8mUaFUNORuYzC4ejOFdhiO_icIV6CMwWgRAYDWxxRe_6RjVm1XCrdhNGGmkSSqQUgwaCgYKAYMSARMSFQGbdwaIQ5HEvtcgb_n-jfztWhRRwg0165",
						"expires_at": 1678082912
					}
				}
			}
		};
		const actual_output = await createUpdateUserObj(3, new_user);

		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		expect(actual_output?.auth_info).not.toStrictEqual(original_auth_info);
		expect(actual_output?.auth_info).toHaveProperty('google');
		expect(actual_output?.auth_info?.google).toStrictEqual(original_auth_info.google);
		expect(actual_output?.auth_info).toHaveProperty('github');
		expect(actual_output?.auth_info?.github).toStrictEqual(new_user.auth_info?.github);
	})
})