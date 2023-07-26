import Button from '../components/Button'
import Image from "next/image";
import { getAuthUserImage, getAuthUserName, logout, login, getAuthUserId } from '../utils/auth';
import { useEffect, useState, useContext } from "react";
import type { Session } from 'next-auth';
import Link from 'next/link';
import RudderContext from './RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize';

export default function LoginLogout() {
	const [showMenu, setShowMenu] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const { rudderEventMethods } = useContext(RudderContext);


	// FIXME: Ideally, this should have been automatically accomplished using useSession provided by NextAuth. But that is not working.
	useEffect(() => {
		fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
			const sessionVal = await res.json();
			setSession(sessionVal);
		});
	}, [])

	useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()

		const handleLogoutClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Logout link clicked", { type: "link", eventStatusFlag: 1, source: "profile popup", name: getAuthUserName(session) }, anonymousId)
		};

		const handleContributeClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Contribute link clicked", { type: "link", eventStatusFlag: 1, source: "profile-popup", name: getAuthUserName(session) }, anonymousId)
		};

		const handleSettingsClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Settings link clicked", { type: "link", eventStatusFlag: 1, source: "profile-popup", name: getAuthUserName(session) }, anonymousId)
		};

		const logoutLink = document.getElementById('logout-link');
		const contributeLink = document.getElementById('contribute-link');
		const settingsLink = document.getElementById('settings-link')

		logoutLink?.addEventListener('click', handleLogoutClick);
		contributeLink?.addEventListener('click', handleContributeClick);
		settingsLink?.addEventListener('click', handleSettingsClick);

		return () => {
			logoutLink?.removeEventListener('click', handleLogoutClick);
			contributeLink?.removeEventListener('click', handleContributeClick);
			settingsLink?.removeEventListener('click', handleSettingsClick)
		};
	}, [rudderEventMethods, session]);

	if (session && session.user) return (
		<>
			<Image src={getAuthUserImage(session)} onClick={() => setShowMenu(prev => !prev)} alt="Display picture" title={getAuthUserName(session)} width={300} height={300} className="h-full w-auto hover:cursor-pointer rounded-xl cursor-pointer max-h-8 mx-auto" />
			{/* Log out Pop up  */}
			{showMenu ?
				<ol className='w-[40%] sm:w-[15%] rounded-md absolute right-5 sm:right-10 top-16 border-2 bg-primary-light text-primary-darktext'>
					<li className='border-b-2 border-b-gray-200 p-2 text-center'>
						<Link href='/u' className='cursor-pointer w-full'>Profile</Link>
					</li>
					<li id='contribute-link' className='border-b-2 border-b-gray-200 p-2 text-center'>
						<Link href='https://github.com/Alokit-Innovations/' target='_blank' className='cursor-pointer w-full'>Contribute</Link>
					</li>
					<li id='settings-link' className='border-b-2 border-b-gray-200 p-2 text-center'>
						<Link href='/settings' className='cursor-pointer w-full'>Settings</Link>
					</li>
					<li id='logout-link' className='p-2 text-center cursor-pointer' onClick={() => (logout(getAuthUserId(session), getAuthUserName(session), getAndSetAnonymousIdFromLocalStorage(), (rudderEventMethods ? rudderEventMethods : null)))}>
						Logout
					</li>
				</ol>
				:
				null
			}
		</>
	)
	else return (
		<Button variant='contained' onClick={() => (login(getAndSetAnonymousIdFromLocalStorage(), (rudderEventMethods ? rudderEventMethods : null)))} className="rounded bg-inherit sm:bg-primary-main text-secondary-main py-2 px-4 font-semibold">
			Login/Signup
		</Button>
	)
};