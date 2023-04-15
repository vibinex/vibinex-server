import { signIn } from 'next-auth/react';
import Button from '../components/Button'
import Image from "next/image";
import { getAuthUserImage, getAuthUserName, logout } from '../utils/auth';
import { useSession } from 'next-auth/react';
import { useState } from "react";

export default function LoginLogout() {
	const [showMenu, setShowMenu] = useState(false);
	const { data: session, status } = useSession();
	console.log(`[MainAppBar] status: ${status}, session: ${JSON.stringify(session)}`)
	if (session) return (
		<>
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
		</>
	)
	else return (
		<Button variant='contained' onClick={signIn} className="rounded bg-inherit sm:bg-primary-main text-secondary-main py-2 px-4 font-semibold">
			Login/Signup
		</Button>
	)
};