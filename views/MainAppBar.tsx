import AppBar from '../components/AppBar'
import Button from '../components/Button'
import Image from "next/image";
import { getAuthUserImage, getAuthUserName, logout } from '../utils/auth';
import { useSession } from 'next-auth/react';
import { useState } from "react";

export default function MainAppBar() {
	const [showMenu, setShowMenu] = useState(false);
	const { data: session } = useSession();
	return (
		<AppBar position='fixed' className='w-full py-2 px-10 flex flex-row bg-primary-light border-b-2 border-b-secondary-dark'>
			<a href="/" className="mr-16 h-full overflow-clip flex flex-row items-center">
				<h1 className='font-bold text-3xl sm:text-4xl'>
					Vibinex
				</h1>
			</a>
			<span className='flex-grow'></span>
			<Image src={getAuthUserImage(session)} onClick={() => setShowMenu(prev => !prev)} alt="Display picture" title={getAuthUserName(session)} width={300} height={300} className="h-full w-auto hover:cursor-pointer rounded-xl cursor-pointer" />
			{/* Log out Pop up  */}
			{showMenu ?
				<ol className='w-[40%] sm:w-[15%] p-1 rounded-md absolute  right-5 sm:right-10 top-16 border-2 bg-primary-light'>
					<li className='border-b-2 border-b-gray-200 p-2 text-center'>
						<Button variant='text' href='https://github.com/Alokit-Innovations/' target='_blank' className='cursor-pointer w-full'>Contribute</Button>
					</li>
					<li className='bg-primary-main m-2 p-2 text-center rounded-md cursor-pointer' onClick={() => logout()}>
						<h2 className='text-primary-light'>Logout</h2>
					</li>
				</ol>
				:
				null
			}
		</AppBar>
	)
};