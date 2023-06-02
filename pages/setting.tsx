import React, { useEffect, useState } from 'react'
import Navbar from '../views/Navbar';
import Footer from '../components/Footer';
import { BsToggleOn } from 'react-icons/bs';

const Settings = () => {

	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";

	async function apiCall(type: string, user_id: number, bodyData: string) {
		const url = type == 'get' ? 'https://gcscruncsql-k7jns52mtq-el.a.run.app/settings' : 'https://gcscruncsql-k7jns52mtq-el.a.run.app/settings/update';
		const body = type == 'get' ? { user_id } : { user_id, settings: bodyData };

		console.log('calling server ', body, '\n [url]', url);

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
				.then((response) => response.json())
				.then((data) => dataFromAPI = data);
			console.log('[API SUCESS]', dataFromAPI)
			return dataFromAPI;
		} catch (e) {
			console.error(`[vibinex] Error while getting data from API. URL: ${url}, payload: ${JSON.stringify(body)}`, e);
		}
	}

	const list = [

		{
			name: 'Enable coverage comments',
			discription: `If enabled, you'll get coverage comments on each PR`,
			type: 'toggle',
			urlBody: 'auto_assign'

		},
		{
			name: 'Enable auto assignment',
			discription: 'If enabled, it automatically sets the reviewers for each PR',
			type: 'toggle',
			urlBody: 'coverage_comment'

		},

	];

	const [settingsList, setSettingsList] = useState(list);
	const [updateList, setUpdateList] = useState(['']);
	const tempUserId = 5;

	const toggleFlag = (urlBody: string) => {
		setUpdateList((prevUpdateList) => {
			const updatedList = [...prevUpdateList];
			const index = updatedList.indexOf(urlBody);

			if (index === -1) {
				updatedList.push(urlBody);
			} else {
				updatedList.splice(index, 1);
			}
			return updatedList;
		});
	};

	async function getSettings(userId: number) {
		const apiResponse = await apiCall('get', userId, '');
		// after response need to set setSettingsList . but unble to do so cuz of temp. api error
		console.log('[API RESPONSE]', apiResponse);
	}

	useEffect(() => {
		// need to fetch the userid ; 
		getSettings(tempUserId);
	}, []);

	useEffect(() => {
		let obj: any = {};
		list.forEach((item) => {
			obj[item.urlBody] = updateList.includes(item.urlBody);
		}
		);
		apiCall('post', tempUserId, obj); // calling api for every time button clicked
	}, [updateList]);

	return (
		<div>
			<div className='mb-16'>
				<Navbar ctaLink={chromeExtensionLink} transparent={true} />
			</div>
			<div id='pricing' className='w-full py-12 bg-primary-light'>
				<h2 className='font-bold text-center text-[2rem] mb-4'>Settings</h2>

				<div className='sm:w-[70%] w-[90%] m-auto sm:p-8 p-4 rounded-lg border-2'>

					{
						settingsList.map((item, index) => {
							return (
								<div key={index}
									className={`flex justify-between ${index === 0 ? '' : 'border-t-[0.1rem]'} sm:mb-4 mb-2 sm:mt-4 mt-4 sm:p-4 p-4`}
								>
									<div>
										<h1 className='sm:text-[1.3rem] text-[1rem] font-semibold'>{item.name}</h1>
										<p className='sm:text-[0.9rem] text-[0.8rem] font-light mt-1 w-[90%]'>{item.discription}</p>
									</div>
									<div onClick={() => toggleFlag(item.urlBody)} className='cursor-pointer sm:pt-2 '>
										{updateList.includes(item.urlBody) ?
											<BsToggleOn size={38} color='#2196F3' />
											:
											<BsToggleOn size={38} color='#c4c4c4' className='rotate-180' />
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