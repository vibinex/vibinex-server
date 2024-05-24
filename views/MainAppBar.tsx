import { useEffect, useState } from 'react';
import AppBar from '../components/AppBar'
import LoginLogout from '../components/LoginLogout';
import { PopupButton } from "react-calendly";
import Image from 'next/image';
import VibinexDarkLogo from '../public/vibinex-dark-logo.png';
import Link from 'next/link';

export default function MainAppBar() {
	const [rootElement, setRootElement] = useState<HTMLElement>()
	useEffect(() => {
		setRootElement(document.getElementById('__root__')!);
	}, [])

	return (
		<AppBar position='fixed' className='mx-auto py-2 px-10 justify-between items-center max-w-7xl' backdropClassName='bg-background'>
			<Link href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<Image src={VibinexDarkLogo} alt="Vibinex logo" className="inline w-10 mr-2" priority></Image>
				<h1 className='font-bold text-3xl sm:text-4xl font-sans tracking-wider'>
					Vibinex
				</h1>
			</Link>
			<span className='flex-grow'></span>
			{(rootElement) ?
				<PopupButton
					url='https://calendly.com/avikalp-gupta/30min'
					text='Book Demo'
					rootElement={rootElement}
					className='mr-4 px-2 py-1 rounded-lg text-sm text-secondary font-semibold'
				/> : null}
			<LoginLogout />
		</AppBar>
	)
};