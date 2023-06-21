import conn from ".";
import AuthInfo from "../../types/AuthInfo";
import { DbUser, createUpdateUserObj } from "./users";

const TEST_USERID = 'f0aab7ff-f241-4eb4-9d3f-672fa2f6d979'
const RANDOM_UID = '2893hdf9qss-jdhf9q3f982q34hrh0-2dfhq'

describe('unit testing updateUser object creation (except auth_info)', () => {
	it("changing id", async () => {
		const new_user: DbUser = { id: RANDOM_UID }
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user).catch(err => {
			console.error("[Test] function call failed.", err)
		});

		expect(actual_output?.id).toBe(undefined); // id should not change anything
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(0);
	})

	it("changing name", async () => {
		const new_user: DbUser = { name: `dummyuser_${Math.random().toString().substring(2)}` };
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user).catch(err => {
			console.error("[Test] function call failed.", err)
		});

		expect(actual_output?.name).toBe(new_user.name);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("changing photo", async () => {
		const new_user: DbUser = { profile_url: `${Math.random().toString().substring(2)}.png` };
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user).catch(err => {
			console.error("[Test] function call failed.", err)
		});

		expect(actual_output?.profile_url).toBe(new_user.profile_url);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("changing name and photo", async () => {
		const new_user: DbUser = {
			name: `dummyuser_${Math.random().toString().substring(2)}`,
			profile_url: `${Math.random().toString().substring(2)}.png`
		};
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user).catch(err => {
			console.error("[Test] function call failed.", err)
		});

		expect(actual_output?.name).toBe(new_user.name);
		expect(actual_output?.profile_url).toBe(new_user.profile_url);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(2);
	})

	it("repeating same aliases", async () => {
		const new_user: DbUser = { aliases: ["contact@vibinex.com", "test@vibinex.com", "129674662+Vibinextest@users.noreply.github.com"] };
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user).catch(err => {
			console.error("[Test] function call failed.", err)
		});

		expect(actual_output?.aliases).toBe(undefined);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(0);
	})

	it("only adding new aliases", async () => {
		const new_user: DbUser = { aliases: ["different@somedomain.com", "newemail@example.com"] };
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user).catch(err => {
			console.error("[Test] function call failed.", err)
		});

		expect(actual_output?.aliases?.length).toBe(5);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		new_user.aliases?.forEach(alias => expect(actual_output?.aliases).toContain(alias));
	})

	it("adding and repeating aliases", async () => {
		const new_user: DbUser = { aliases: ["contact@vibinex.com", "newemail@example.com"] };
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user).catch(err => {
			console.error("[Test] function call failed.", err)
		});

		expect(actual_output?.aliases?.length).toBe(4);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		new_user.aliases?.forEach(alias => expect(actual_output?.aliases).toContain(alias));
	})
})

describe('unit testing auth-info updates in updateUser object creation', () => {
	const getOriginalAuthInfo = async (userId: string): Promise<AuthInfo> => {
		const user_q = `SELECT * FROM users WHERE id = '${userId}'`;
		const user_result = await conn.query(user_q);
		if (user_result.rowCount == 0) {
			console.error("[getOriginalAuthInfo] No user found for the given userId: " + userId);
			return {};
		}
		return user_result.rows[0].auth_info;
	}

	it("repeating auth", async () => {
		const original_auth_info = await getOriginalAuthInfo(TEST_USERID);
		const new_user: DbUser = {
			auth_info: JSON.parse(JSON.stringify(original_auth_info))
		};
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user);

		expect(actual_output?.auth_info).toStrictEqual(new_user.auth_info);
		expect(actual_output?.auth_info).toStrictEqual(original_auth_info);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("repeating auth with updated details", async () => {
		const original_auth_info = await getOriginalAuthInfo(TEST_USERID);
		const new_user: DbUser = {
			auth_info: {
				"github": {
					"129674662": {
						"type": "oauth",
						"scope": "read:user,user:email",
						"access_token": "gho_AKL890fj3jkaLJF09j34flkjlKJF0uLkjgf9"
					}
				}
			}
		};
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user);

		expect(actual_output?.auth_info).toStrictEqual(new_user.auth_info);
		expect(actual_output?.auth_info).not.toStrictEqual(original_auth_info);
		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
	})

	it("repeating auth provider with new id", async () => {
		const original_auth_info = await getOriginalAuthInfo(TEST_USERID);
		const new_user: DbUser = {
			auth_info: {
				"github": {
					"129674663": {
						"type": "oauth",
						"scope": "read:user,user:email",
						"access_token": "gho_AKL890fj3jkaLJF09j34flkjlKJF0uLkjgf9"
					}
				}
			}
		};
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user);

		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		expect(actual_output?.auth_info).not.toStrictEqual(original_auth_info);
		expect(actual_output?.auth_info?.github).toHaveProperty('129674662');
		expect(actual_output?.auth_info?.github['129674662']).toStrictEqual(original_auth_info.github['129674662']);
		expect(actual_output?.auth_info?.github).toHaveProperty('129674663');
		expect(actual_output?.auth_info?.github['129674663']).toStrictEqual(new_user.auth_info?.github['129674663']);
	})

	it("adding new auth provider", async () => {
		const original_auth_info = await getOriginalAuthInfo(TEST_USERID);
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
		const actual_output = await createUpdateUserObj(TEST_USERID, new_user);

		if (actual_output)
			expect(Object.keys(actual_output).length).toBe(1);
		expect(actual_output?.auth_info).not.toStrictEqual(original_auth_info);
		expect(actual_output?.auth_info).toHaveProperty('google');
		expect(actual_output?.auth_info?.google).toStrictEqual(new_user.auth_info?.google);
		expect(actual_output?.auth_info).toHaveProperty('github');
		expect(actual_output?.auth_info?.github).toStrictEqual(original_auth_info.github);
	})
})