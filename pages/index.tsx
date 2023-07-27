import React from 'react'
import type { Session } from 'next-auth'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import Hero from '../views/Hero'
import WhyUs from '../views/WhyUs'
import Features from '../views/Features'
import TrustUs from '../views/TrustUs'
import RudderContext from '../components/RudderContext'
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize'
import JoinSlack from '../views/JoinSlack'
import { useSession } from 'next-auth/react'
import { getAuthUserId, getAuthUserName, getAuthUserEmail } from '../utils/auth'

export default function Home() {
	const session: Session | null = useSession().data;
	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";
	const { rudderEventMethods } = React.useContext(RudderContext);

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		let userId = getAuthUserId(session)
		let userName = getAuthUserName(session)
		let userEmail = getAuthUserEmail(session)

		rudderEventMethods?.identify(userId, userName, userEmail, anonymousId);
		rudderEventMethods?.track(userId, "Landing page", { type: "page", page: "Landing page", name: userName }, anonymousId)
	}, [rudderEventMethods, session]);

	return (
		<div className='overflow-hidden'>
			<Navbar ctaLink={chromeExtensionLink} transparent={true} />
			<Hero ctaLink={chromeExtensionLink} />
			<WhyUs />
			<Features />
			<TrustUs />
			<JoinSlack />
			<Footer />
		</div>
	)
}