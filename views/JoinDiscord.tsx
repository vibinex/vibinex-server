import React from 'react'
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { BsDiscord } from "react-icons/bs";
import RudderContext from '../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize';
import { getAuthUserId, getAuthUserName } from '../utils/auth'
import { motion } from 'framer-motion';

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
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
			id='joinDiscord'
			className='w-full text-center py-12 bg-black'
		>
			<motion.h2
				initial={{ y: -20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				viewport={{ once: true }}
				className='font-bold text-[2rem] text-white'
			>
				Discord Community
			</motion.h2>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				viewport={{ once: true }}
				className='w-[100%] mt-1 p-4 text-white'
			>
				<p className='text-[1.2rem]'>
					Connect with us for any help or support.<br />Join our Discord community.
				</p>
			</motion.div>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				whileInView={{ scale: 1, opacity: 1 }}
				whileHover={{ scale: 1.05 }}
				transition={{ duration: 0.5, delay: 0.6 }}
				viewport={{ once: true }}
			>
				<Link
					id='join-discord'
					href={'https://discord.gg/caVSraCvpk'}
					target='blank'
					className='bg-secondary m-auto w-[50%] sm:p-5 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5 flex text-primary-light justify-center items-center hover:bg-opacity-90 transition-all'
				>
					<motion.h2
						initial={{ x: -10 }}
						animate={{ x: 0 }}
						className='sm:text-[1.5rem] text-[1rem] mr-4'
					>
						Join Now
					</motion.h2>
					<motion.div
						animate={{
							rotate: [0, 10, -10, 0],
						}}
						transition={{
							duration: 1,
							repeat: Infinity,
							repeatType: "reverse"
						}}
					>
						<BsDiscord size={20} />
					</motion.div>
				</Link>
			</motion.div>
		</motion.div>
	)
}

export default JoinDiscord