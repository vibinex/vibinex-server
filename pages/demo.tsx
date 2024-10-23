
import React, { useEffect, useState } from 'react'
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'
import ProductDemo from '../views/Demo'
import type { Session } from 'next-auth';
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize';
import RudderContext from '../components/RudderContext';
import { getAuthUserEmail, getAuthUserId, getAuthUserName } from '../utils/auth';

const Demo = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [anonymousId, setAnonymousId] = useState<string>("");
	const { rudderEventMethods } = React.useContext(RudderContext);

	useEffect(() => {
		fetch("/api/auth/session", { cache: "no-store" }).then(async (res) => {
			const sessionVal: Session | null = await res.json();
			setSession(sessionVal);
		}).catch((err) => {
			console.error(`[docs] Error in getting session`, err);
		});
	}, [])

	React.useEffect(() => {
		setAnonymousId(getAndSetAnonymousIdFromLocalStorage());
		rudderEventMethods?.track(getAuthUserId(session), "demo page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId)
	}, [rudderEventMethods, session]);

	useCalendlyEventListener({
		onEventTypeViewed: () => rudderEventMethods?.track(getAuthUserId(session), "calendly_event_type_viewed", { type: "interaction", eventStatusFlag: 1, source: "demo-page", name: getAuthUserName(session) }, anonymousId),
		onDateAndTimeSelected: () => rudderEventMethods?.track(getAuthUserId(session), "calendly_date_time_selected", { type: "interaction", eventStatusFlag: 1, source: "demo-page", name: getAuthUserName(session) }, anonymousId),
		onEventScheduled: (e) => rudderEventMethods?.track(getAuthUserId(session), "calendly_demo_scheduled", { type: "interaction", eventStatusFlag: 1, source: "demo-page", name: getAuthUserName(session), payload: e.data.payload }, anonymousId),
	});

	return (
		<div>
			<Navbar transparent={false} />
			<ProductDemo />
			<div className='w-full text-center py-12'>
				<h2 className='font-bold text-[2rem]'>Book a <span className='text-[2rem] text-secondary font-bold'>Live Demo</span> with the Founder</h2>
				<div className='w-full md:w-2/3 m-auto'>
					<InlineWidget
						url="https://calendly.com/avikalp-gupta/30min"
						pageSettings={{
							hideEventTypeDetails: true,
						}}
						prefill={{
							email: getAuthUserEmail(session),
							name: session ? getAuthUserName(session) : undefined, // don't add "User" if session is null
						}}
					/>
				</div>
			</div>
			<Footer />
		</div>
	)
}

export default Demo
