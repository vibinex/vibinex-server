import React, { useState } from 'react'
import Navbar from '../views/Navbar';
import Footer from '../components/Footer';
import { BsToggleOn } from 'react-icons/bs';

const Settings = () => {

	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";

	const list = [
		{
			name: 'Enable coverage comments',
			discription: `If enabled, you'll get coverage comments on each PR`,
			type: 'toggle',
			flag: false,

		},
		{
			name: 'Enable auto assignment',
			discription: 'If enabled, it automatically sets the reviewers for each PR',
			type: 'toggle',
			flag: false

		},

	];

	const [settingsList, setSettingsList] = useState(list);

	const toggleFlag = (name: string) => {
		const updatedSettings = settingsList.map((setting) => {
			if (setting.name === name) {
				return { ...setting, flag: !setting.flag };
			}
			return setting;
		});
		setSettingsList(updatedSettings);
	};


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
									<div onClick={() => toggleFlag(item.name)} className='cursor-pointer sm:pt-2 '>
										{item.flag ?
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