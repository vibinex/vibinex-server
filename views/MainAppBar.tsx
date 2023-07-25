import { useEffect, useState } from 'react';
import AppBar from '../components/AppBar'
import LoginLogout from '../components/LoginLogout';
import { PopupButton } from "react-calendly";

export default function MainAppBar() {
	const [rootElement, setRootElement] = useState<HTMLElement>()
	useEffect(() => {
		setRootElement(document.getElementById('__root__')!);
	}, [])

	return (
		<AppBar position='fixed' offset={true} className='mx-auto py-2 px-10 justify-between items-center max-w-7xl' backdropClassName='bg-primary-light'>
			<a href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<h1 className='font-bold text-3xl sm:text-4xl'>
					Vibinex
				</h1>
			</a>
			<span className='flex-grow'></span>
			{(rootElement) ?
				<PopupButton
					url='https://calendly.com/avikalp-gupta/30min'
					text='Book Demo'
					rootElement={rootElement}
					className='mr-4 px-2 py-1 rounded-lg text-sm text-primary-main font-semibold'
				/> : null}
			<LoginLogout />
		</AppBar>
	)
};