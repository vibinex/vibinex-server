import React from "react";
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import Button from "../components/Button";
import Link from "next/link";
import RudderContext from "../components/RudderContext";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import ProviderLogo from "../components/ProviderLogo";

const Hero = (props: { ctaLink: string }) => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		// Track the "Get Started" event
		const handleCTAClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Primary CTA clicked", { type: "button", eventStatusFlag: 1, source: "landing-hero", name: getAuthUserName(session) }, anonymousId)
		};

		// Track the "Book Demo" event
		const handleBookDemo = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Book demo button", { type: "button", eventStatusFlag: 1, source: "landing-hero", name: getAuthUserName(session) }, anonymousId)
		};

		const primaryCTAButton = document.getElementById('cta-btn');
		const bookDemoButton = document.getElementById('book-demo-btn');

		primaryCTAButton?.addEventListener('click', handleCTAClick);
		bookDemoButton?.addEventListener('click', handleBookDemo);

		return () => {
			primaryCTAButton?.removeEventListener('click', handleCTAClick);
			bookDemoButton?.removeEventListener('click', handleBookDemo);
		};
	}, [rudderEventMethods, session]);
	return (
		<div className='flex items-center justify-center h-screen bg-fixed bg-center bg-cover bg-black'>
			<section className='p-5 text-primary-light my-auto lg:mt-[10%] pt-1 lg:w-1/2 text-center'>
				<h1 className='text-4xl sm:text-5xl lg:text-8xl font-bold mb-4'>{'Merge PRs with'}
					<span className='text-primary-main font-bold block'>Confidence</span>
				</h1>
				<p className="text-xl sm:text-2xl text-gray-300">
					Overlays <span className="text-primary-main">context</span> on the PR •
					Accurate <span className="text-primary-main">reviewer</span> selection
				</p>
				<p className="text-lg sm:text-lg mb-10 text-gray-300">
					Code <span className="text-primary-main">privacy</span> by design • Open source
				</p>
				<div className="w-full flex space-x-4">
					<Button id="cta-btn" variant="contained" href={props.ctaLink} className='text-center w-[45%] p-3 sm:p-4 px-20 rounded-lg font-bold text-[20px] sm:text-[25px] mt-5'>
						Get Started
					</Button>
					<Button id="book-demo-btn" variant="outlined" href="https://calendly.com/avikalp-gupta/30min" target="_blank" className='text-center w-[45%] sm:p-4 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5'>
						Book demo
					</Button>
				</div>
				<div className="mt-20">
					{/*Overlay*/}
					<div className='absolute h-full w-full bg-black/50 z-10' />
					<p>Supported Providers:</p>
					<div className="flex gap-4 mt-2 justify-center">
						<ProviderLogo provider="github" theme="light" className="w-10 h-12 mx-0" />
						<ProviderLogo provider="bitbucket" theme="dark" className="w-10 h-12 mx-0" />
					</div>
				</div>
			</section>
		</div>
	)
}
export default Hero;
