import React from 'react'
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { BsDiscord } from "react-icons/bs";
import RudderContext from '../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize';
import { getAuthUserId, getAuthUserName } from '../utils/auth'

const JoinDiscord = () => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		
		const handleJoinDiscord = () => {
			rudderEventMethods?.track(getAuthUserId(session), "join discord", { type: "button", eventStatusFlag: 1, source: "landing page banner", name: getAuthUserName(session) }, anonymousId)
		}

		const joinDiscordLink = document.getElementById('join-discord');
		joinDiscordLink?.addEventListener('click', handleJoinDiscord);

		return () => {
			joinDiscordLink?.removeEventListener('click', handleJoinDiscord);
		}

	}, [rudderEventMethods, session])

	return (
		<div id='joinDiscord' className='w-full text-center py-12  bg-black mb-[-5%]'>
			<h2 className='font-bold text-[2rem] text-white'>Discord Community</h2>
			<div className='w-[100%] mt-1 p-4 text-white'>
				<p className='text-[1.2rem]'>
					Connect with us for any help or support.<br />Join our Discord community.
				</p>
			</div>

			{/* TODO: Instead of a forever link, use this: https://github.com/thesandlord/SlackEngine */}
			<Link id='join-discord' href={'https://discord.gg/caVSraCvpk'} target='blank'>
				<div className='flex justify-center items-center'>
					<div className='bg-secondary m-auto w-[50%] sm:p-5 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5' >
						<div className='flex text-primary-light justify-center items-center'>
							<h2 className='sm:text-[1.5rem] text-[1rem] mr-4'>Join Now</h2>
							<BsDiscord size={20} />
						</div>
					</div>
				</div>
			</Link>


		</div>
	)
}

export default JoinDiscord