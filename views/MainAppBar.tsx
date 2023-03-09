import { useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react"
import Link from 'next/link';
import Avatar from '../public/avatar/icon2.jpg';

export default function MainAppBar({ isLoggedIn }: { isLoggedIn?: boolean }) {

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div
			className={
				'fixed left-0 top-0 w-full z-10 ease-in duration-300 border-b-secondary-dark border-b-2  bg-primary-light'
			}
		>

			{/* // Navbar Content */}
			<div className={'max-w-[1240px] m-auto flex justify-between items-center p-4 text-secondary-dark'
			}>
				<Link href='/'>
					<h1 className='font-bold text-4xl'>
						Vibinex
					</h1>
				</Link>
				<div onClick={() => setIsOpen(prev => !prev)} className='cursor-pointer hidden sm:block'>
					<Image src={Avatar} className='w-[2%] h-[50%] rounded-full absolute top-5 object-contain' alt='user profile pic' />
				</div>

				{/* Mobile Button */}
				<div
					className={
						'block sm:hidden z-10 text-secondary-dark'
					}
				>
					<div onClick={() => setIsOpen(prev => !prev)} className='cursor-pointer'>
						<Image src={Avatar} className='w-[10%] h-[50%] rounded-full absolute top-5 object-contain right-3' alt='user profile pic' />
					</div>
				</div>
			</div>

			{/* Log out Pop up  */}
			{isOpen ?
				<div className='w-[40%] sm:w-[15%] p-3 rounded-md absolute  right-5 sm:right-10 top-20 border-2 bg-primary-light'>
					<div className='bg-primary-main p-2 text-center rounded-md cursor-pointer' onClick={() => signOut()}>
						<h2 className='text-primary-light'>Logout</h2>
					</div>
				</div>
				:
				null
			}
		</div>
	);
};