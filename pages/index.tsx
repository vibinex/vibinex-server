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
import { useSession } from 'next-auth/react'
import { getAuthUserId, getAuthUserName, getAuthUserEmail } from '../utils/auth'
import Customers from '../views/CustomerLogos'
import Testimonials from '../views/Testimonials'
import JoinDiscord from '../views/JoinDiscord'
import RotatingQuotes from '../views/RotatingQuotes'

const quotes = [
	{
		text: "You are preparing the antidote to vibe coding",
		author: "Vikas Kumar",
		title: "Founder, DataviCloud",
	},
	{
		text: "AI adoption for coding boosts perceived productivity but reduces delivery throughput",
		author: "DORA Research @ Google",
		title: "October 2024: Accelerate State of DevOps"
	},
	{
		text: "AI agents will bullshit you if you can't call them out",
		author: "Jared Freidman",
		title: "Managing Partner, Y Combinator",
		subtitle: "In the video titled 'Vibe Coding Is The Future'"
	}
	// Add more quotes here as needed
];

export default function Home() {
	const session: Session | null = useSession().data;
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
			<Navbar transparent={true} />
			<Hero ctaLink={'/docs/setup/providerLogin'} />
			<RotatingQuotes quotes={quotes} className='!hidden md:!flex' />
			<Features />
			<Customers />
			<WhyUs />
			<TrustUs />
			<Testimonials />
			<JoinDiscord />
			<Footer className='!mt-0' />
		</div>
	)
}
