import React, { useState, useEffect } from 'react'
import Footer from '../components/Footer';
import { BsToggleOn } from 'react-icons/bs';
import RudderContext from '../components/RudderContext';
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import { useSession } from "next-auth/react";
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize';
import LoadingOverlay from '../components/LoadingOverlay';
import MainAppBar from '../views/MainAppBar';

const Settings = () => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const settingList = [

		{
			name: 'Enable coverage comments',
			discription: `If enabled, you'll get coverage comments on each PR`,
			type: 'toggle',
			item_id: 'coverage_comment'
		},
		{
			name: 'Enable auto assignment',
			discription: 'If enabled, it automatically sets the reviewers for each PR',
			type: 'toggle',
			item_id: 'auto_assign'
		},

	];

	const [settings, setSettings] = useState<{ [setting: string]: boolean }>({});
	const [loading, setLoading] = useState(false);// while loading user can't send another api request to change setting
	const { data: session, status } = useSession();
	const userId = getAuthUserId(session);

	async function apiCall(type: 'get' | 'update', user_id: string, updatedSettings?: { [setting: string]: boolean }) {
		const serverDomain = 'https://gcscruncsql-k7jns52mtq-el.a.run.app';
		if (type === 'update' && !updatedSettings) {
			console.error(`ERROR: settings update API call requires you to specify the updated settings`);
		}
		const url = type == 'get' ? `${serverDomain}/settings` : `${serverDomain}/settings/update`;
		const body = type == 'get' ? { user_id } : { user_id, settings: updatedSettings };
		try {
			let dataFromAPI;
			await fetch(url, {
				method: "POST",
				headers: {
					"Access-Control-Allow-Origin": "chrome-extension://jafgelpkkkopeaefadkdjcmnicgpcncc",
					"Content-Type": "application/json",
					"Accept": "application/json",
				},
				body: JSON.stringify(body)
			})
				.then((response) => type == 'get' ? response.json() : null)
				.then((data) => dataFromAPI = data)
			return dataFromAPI;
		} catch (e) {
			console.error(`[vibinex] Error while getting data from API. URL: ${url}, payload: ${JSON.stringify(body)}`, e);
		}
	};

	async function getSettings() {
		const currentUserSettings: { [setting: string]: boolean } = await apiCall('get', userId) ?? {};
		setSettings(currentUserSettings);
	}

	const toggleFlag = (item_id: string) => {
		setLoading(true);
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()

		const newSettings = { ...settings }
		newSettings[item_id] = !newSettings[item_id]

		apiCall('update', userId, newSettings)
			.then(() => {
				rudderEventMethods?.track(userId, "settings-changed", { type: 'setting', eventStatusFlag: 1, name: getAuthUserName(session), eventProperties: newSettings }, anonymousId);
				setSettings(newSettings);
				setLoading(false);
			})
			.catch(err => {
				rudderEventMethods?.track(userId, "settings-changed", { type: 'setting', eventStatusFlag: 0, name: getAuthUserName(session), eventProperties: newSettings }, anonymousId);
				console.error("Failed to update settings", err);
				setLoading(false);
			})
	};

	useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage();
		if (status === 'authenticated') {
			getSettings();
		}
		rudderEventMethods?.track(userId, "settings-page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId)
	}, [rudderEventMethods, session]);

	useEffect(() => {
		if (status === 'unauthenticated') {
			import('next/router').then(({ default: router }) => {
				router.push('/');
			});
		}
	}, [status]);

	return (
		<div>
			{(status === 'loading') ? (<LoadingOverlay />)
				: (status === 'unauthenticated') ? (<LoadingOverlay text="You are not authenticated. Redirecting..." />)
					: (Object.keys(settings).length == 0) ? (<LoadingOverlay text="Loading your settings..." />)
						: null}
			<div className='mb-16'>
				<MainAppBar />
			</div>
			<div id='pricing' className='w-full py-12 bg-primary-light'>
				<h2 className='font-bold text-center text-[2rem] mb-4'>Settings</h2>

				<div className='sm:w-[70%] w-[90%] m-auto sm:p-8 p-4 rounded-lg border-2'>

					{
						settingList.map((settingItem, index) => {
							return (
								<div key={settingItem.item_id}
									className={`flex justify-between ${index === 0 ? '' : 'border-t-[0.1rem]'} sm:mb-4 mb-2 sm:mt-4 mt-4 sm:p-4 p-4`}
								>
									<div>
										<h1 className='sm:text-[1.3rem] text-[1rem] font-semibold'>{settingItem.name}</h1>
										<p className='sm:text-[0.9rem] text-[0.8rem] font-light mt-1 w-[90%]'>{settingItem.discription}</p>
									</div>
									<div onClick={() => loading ? null : toggleFlag(settingItem.item_id)} className='cursor-pointer sm:pt-2 '>
										{settings[settingItem.item_id] ?
											<BsToggleOn size={38} className={loading ? "text-action-activeDisabled" : "text-action-active"} />
											:
											<BsToggleOn size={38} className={'rotate-180 ' + (loading ? 'text-action-inactiveDisabled' : 'text-action-inactive')} />
										}
									</div>
								</div>
							)

						})
					}

				</div>

			</div>
			<Footer />
		</div>
	)
}
export default Settings