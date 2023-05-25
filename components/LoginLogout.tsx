import Button from '../components/Button'
import Image from "next/image";
import { getAuthUserImage, getAuthUserName, logout, login } from '../utils/auth';
import { useEffect, useState } from "react";
import type { Session } from 'next-auth';
import Link from 'next/link';

export default function LoginLogout() {
	const [showMenu, setShowMenu] = useState(false);
	const [session, setSession] = useState<Session | null>(null);

	// FIXME: Ideally, this should have been automatically accomplished using useSession provided by NextAuth. But that is not working.
	useEffect(() => {
		fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
			const sessionVal = await res.json();
			setSession(sessionVal);
		});
	}, []);

	if (session && session.user) return (
		<>
			<Image src={getAuthUserImage(session)} onClick={() => setShowMenu(prev => !prev)} alt="Display picture" title={getAuthUserName(session)} width={300} height={300} className="h-full w-auto hover:cursor-pointer rounded-xl cursor-pointer max-h-8 mx-auto" />
			{/* Log out Pop up  */}
			{showMenu ?
				<ol className='w-[40%] sm:w-[15%] rounded-md absolute right-5 sm:right-10 top-16 border-2 bg-primary-light text-primary-darktext'>
					<li className='border-b-2 border-b-gray-200 p-2 text-center'>
						<Link href='/u' className='cursor-pointer w-full'>Profile</Link>
					</li>
					<li className='border-b-2 border-b-gray-200 p-2 text-center'>
						<Link href='https://github.com/Alokit-Innovations/' target='_blank' className='cursor-pointer w-full'>Contribute</Link>
					</li>
					<li className='p-2 text-center cursor-pointer' onClick={() => logout()}>
						Logout
					</li>
				</ol>
				:
				null
			}
		</>
	)
	else return (
		<Button variant='contained' onClick={() => login()} className="rounded bg-inherit sm:bg-primary-main text-secondary-main py-2 px-4 font-semibold">
			Login/Signup
		</Button>
	)
};