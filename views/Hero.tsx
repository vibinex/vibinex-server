import React from "react";
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import Button from "../components/Button";
import Image from "next/image";
import highlightPR from '../public/highlightPR.png'
import highlightFile from '../public/highlightFile.png'
import chromeLogo from '../public/chrome-logo.png'
import Link from "next/link";
import RudderContext from "../components/RudderContext";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName } from "../utils/auth";

const Hero = (props: { ctaLink: string }) => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		// Track the "Add to Chrome" event
		const handleAddToChrome = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Add to chrome button", { type: "button", eventStatusFlag: 1, source: "landing-hero", name: getAuthUserName(session) }, anonymousId)
		};

		// Track the "Book Demo" event
		const handleBookDemo = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Book demo button", { type: "button", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId)
		};

		const addToChromeButton = document.getElementById('add-to-chrome-btn');
		const bookDemoButton = document.getElementById('book-demo-btn');

		addToChromeButton?.addEventListener('click', handleAddToChrome);
		bookDemoButton?.addEventListener('click', handleBookDemo);

		return () => {
			addToChromeButton?.removeEventListener('click', handleAddToChrome);
			bookDemoButton?.removeEventListener('click', handleBookDemo);
		};
	}, [rudderEventMethods, session]);
	return (
		<div className='flex items-center justify-center h-screen bg-fixed bg-center bg-cover'
			style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80')" }}
		>
			{/*Overlay*/}
			<div className='absolute h-full w-full bg-black/75 z-0' />
			<section className='p-5 text-primary-light z-10 my-auto lg:mt-[10%] pt-1 lg:w-1/2'>
				<article className="text-center">
					<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold mb-4'>{'Personalization for'}
						<span className='text-primary-main font-bold block'>
							Code Reviews
						</span>
					</h1>
					<p className="text-xl sm:text-2xl text-gray-300">
						Automatic <span className="text-primary-main">reviewer</span> assignment • Better <span className="text-primary-main">quality</span> reviews
					</p>
					<p className="text-lg sm:text-lg mb-10 text-gray-300">
						Open source • <span className="text-primary-main">100% code privacy</span>
					</p>
					<div className="w-full flex space-x-4">
						<Button id="add-to-chrome-btn" variant="contained" href={props.ctaLink} target="_blank" className='text-center w-[45%] p-3 sm:p-4 px-20 rounded-lg font-bold text-[20px] sm:text-[25px] mt-5'>
							<Image src={chromeLogo} alt="chrome extension logo" className="w-10 inline mr-2 border border-white rounded-full"></Image>
							Add to Chrome
						</Button>
						<Button id="book-demo-btn" variant="outlined" href="https://calendly.com/avikalp-gupta/30min" target="_blank" className='text-center w-[45%] sm:p-4 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5'>
							Book demo
						</Button>
					</div>
					<Link href="https://www.producthunt.com/posts/vibinex-code-review?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vibinex&#0045;code&#0045;review" target="_blank"
						className="block mt-10 w-64 h-14 border border-white rounded-lg m-auto">
						<img
							src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=394365&theme=dark"
							alt="Vibinex&#0032;Code&#0045;Review - A&#0032;distributed&#0032;process&#0032;for&#0032;reviewing&#0032;pull&#0032;requests | Product Hunt"
							className="w-full h-full" width="250" height="54" />
					</Link>
				</article>
			</section>

			<section className='mt-[20%] h-screen items-center lg:block hidden z-10'>
				<Image priority alt='see your relevant files in the PR highlighted' src={highlightPR} className='w-[80%] sm:h-[50%] border-2 border-primary-light' />
				<Image priority alt='see your relevant PRs highlighted' src={highlightFile} className='w-[80%] sm:h-[50%] mt-[-30%] ml-24 outline outline-2 outline-primary-light' />
			</section>
		</div>
	)
}
export default Hero;
