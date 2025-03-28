import React from "react";
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import Button from "../components/Button";
import RudderContext from "../components/RudderContext";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName } from "../utils/auth";
import ProviderLogo from "../components/ProviderLogo";
import { motion } from "framer-motion";
import { getPreferredTheme, Theme } from "../utils/theme";

const Hero = (props: { ctaLink: string }) => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;
	const [currentTheme, setCurrentTheme] = React.useState<Theme>('light');

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

	React.useEffect(() => {
		setCurrentTheme(getPreferredTheme());
	}, [])

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='flex items-center justify-center h-fit bg-primary'
		>
			<section className='p-5 text-primary-foreground my-auto pt-1 md:w-2/3 xl:w-1/2 text-center'>
				<motion.h1
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.7, delay: 0.2 }}
					className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 mt-8'
				>
					{'Understand code changes'}
					<motion.span
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className='text-secondary font-bold block'
					>
						10x faster
					</motion.span>
				</motion.h1>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.7, delay: 0.7 }}
					className="text-xl sm:text-2xl"
				>
					Navigate file-changes <span className="text-secondary">graphically</span> and see a code review interface <span className="text-secondary">personalized to you</span>.
				</motion.p>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.7, delay: 0.9 }}
					className="w-full flex space-x-4 my-5 justify-center"
				>
					<Button id="cta-btn" variant="contained" href={props.ctaLink} className='text-center w-[45%] p-3 sm:p-4 px-20 rounded-lg font-bold text-[20px] sm:text-[25px] hover:scale-105 transition-transform'>
						Get Started
					</Button>
					<Button id="book-demo-btn" variant="outlined" href="/demo" className='text-center w-[45%] sm:p-4 p-3 px-20 rounded-lg font-semibold sm:text-[25px] text-[20px] hover:scale-105 transition-transform !border-action-active text-action-active'>
						Watch Demo
					</Button>
				</motion.div>
				<motion.p
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.7, delay: 1.1 }}
					className="text-lg sm:text-lg mb-10"
					title="100% privacy & data protection"
				>
					Your code <span className="text-secondary">never leaves your systems</span> by design
				</motion.p>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.7, delay: 1.3 }}
					className="my-10 w-full relative"
				>
					<div className='absolute bg-primary/50 z-10 h-full w-full' />
					<p>Supported Providers:</p>
					<div className="flex gap-4 mt-2 justify-center">
						<motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
							<ProviderLogo provider="github" theme={currentTheme} className="w-10 h-12 hover:scale-105" />
						</motion.div>
						<motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
							<ProviderLogo provider="bitbucket" theme={currentTheme} className="w-10 h-12 hover:scale-105" />
						</motion.div>
					</div>
				</motion.div>
			</section>
		</motion.div>
	)
}
export default Hero;
