import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'
import type { Session } from 'next-auth'
import Link from 'next/link';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import LoginLogout from "../components/LoginLogout";
import chromeLogo from '../public/chrome-logo.png'
import Image from 'next/image';
import RudderContext from '../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/rudderstack_initialize';
import { getAuthUserId, getAuthUserName } from '../utils/auth';
import AppBar from '../components/AppBar';
import VibinexDarkLogo from '../public/vibinex-dark-logo.png';
import Button from '../components/Button';

const Navbar = (props: { transparent: boolean }) => {
	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;

	const [showNavbar, setShowNavbar] = useState(false);
	const [scrollDown, setScrollDown] = useState(!props.transparent);

	const changeNavbar = () => {
		setShowNavbar(!showNavbar);
	};
	useEffect(() => {
		const changeColor = () => {
			if (window.scrollY >= 90) {
				setScrollDown(true);
			} else {
				setScrollDown(false);
			}
		};
		window.addEventListener('scroll', changeColor);
	}, []);

	useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()

		const handleDownloadClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Add to chrome button", { type: "link", eventStatusFlag: 1, source: "navbar", name: getAuthUserName(session) }, anonymousId)
		};

		const handlePricingClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Pricing link clicked", { type: "link", eventStatusFlag: 1, source: "navbar", name: getAuthUserName(session) }, anonymousId)
		};

		const handleContributeClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Contribute link clicked", { type: "link", eventStatusFlag: 1, source: "navbar", name: getAuthUserName(session) }, anonymousId)
		};

		const handleLoginLogoutClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Login-Logout link clicked", { type: "link", eventStatusFlag: 1, source: "navbar", name: getAuthUserName(session) }, anonymousId)
		};

		const handleDocsClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Docs link clicked", { type: "link", eventStatusFlag: 1, source: "navbar", name: getAuthUserName(session) }, anonymousId)
		}

		const downloadLink = document.getElementById('download-link');
		const pricingLink = document.getElementById('pricing-link');
		const contributeLink = document.getElementById('contribute-link');
		const loginLogoutLink = document.getElementById('login-logout-link');
		const docsLink = document.getElementById('docs-link');

		downloadLink?.addEventListener('click', handleDownloadClick);
		pricingLink?.addEventListener('click', handlePricingClick);
		contributeLink?.addEventListener('click', handleContributeClick);
		loginLogoutLink?.addEventListener('click', handleLoginLogoutClick);
		docsLink?.addEventListener('click', handleDocsClick);

		return () => {
			downloadLink?.removeEventListener('click', handleDownloadClick);
			pricingLink?.removeEventListener('click', handlePricingClick);
			contributeLink?.removeEventListener('click', handleContributeClick);
			loginLogoutLink?.removeEventListener('click', handleLoginLogoutClick);
			docsLink?.removeEventListener('click', handleDocsClick);
		};
	}, [rudderEventMethods, session]);

	return (
		<AppBar position='fixed' className='mx-auto p-4 justify-between items-center max-w-7xl'
			backdropClassName={'ease-in duration-300' + (scrollDown || !props.transparent ? ' bg-primary-light text-secondary-dark' : ' bg-transparent text-primary-light')}
		>
			<Link href='/' className='flex items-center'>
				<Image src={VibinexDarkLogo} alt="Vibinex logo" className="inline w-10 mr-2" priority></Image>
				<h1 className='font-bold text-3xl sm:text-4xl'>
					Vibinex
				</h1>
			</Link>
			<ul className='hidden sm:flex sm:items-center sm:justify-evenly'>
				<li id="docs-link" className='p-3 lg:p-4'>
					<Link href='/docs'>Docs</Link>
				</li>
				<li id="contribute-link" className='p-3 lg:p-4'>
					<Link href='https://github.com/Alokit-Innovations' target='blank'>Contribute</Link>
				</li>
				<li className='p-3 lg:p-4' id='pricing-link'>
					<Link href='/pricing'>Pricing</Link>
				</li>
				<li className='hidden md:inline p-3 lg:p-4' id='download-link'>
					<Link href={chromeExtensionLink} target="_blank">
						Download
						<Image src={chromeLogo} alt="chrome extension logo" className="inline ml-1 w-6"></Image>
					</Link>
				</li>
				<li id='login-logout-link' className='p-3 lg:p-4'>
					<LoginLogout />
				</li>
			</ul>
			{/* Mobile Button */}
			<Button onClick={changeNavbar} variant='text'
				className={
					'block sm:hidden z-10' + (scrollDown || !props.transparent ? ' text-secondary-dark' : ' text-primary-light')
				}
			>
				{showNavbar ? (
					<AiOutlineClose size={20} />
				) : (
					<AiOutlineMenu size={20} />
				)}
			</Button>
			{/* Mobile Menu */}
			<div
				className={
					'sm:hidden absolute flex justify-center items-center w-full h-screen bg-secondary-dark text-center ease-in duration-300' +
					(showNavbar ? ' left-0 top-0 right-0 bottom-0' : ' left-[-100%] top-0 right-0 bottom-0')
				}
			>
				<ul>
					<li id="docs-link" className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
						<Link href='/docs'>Docs</Link>
					</li>
					<li id="contribute-link" className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
						<Link href='https://github.com/Alokit-Innovations' target='blank'>Contribute</Link>
					</li>
					<li id='pricing-link' className='p-4 text-4xl text-secondary-main hover:text-secondary-light'>
						<Link href='/pricing'>Pricing</Link>
					</li>
					<li id='login-logout-link' className='p-4 text-secondary-main hover:text-secondary-light'>
						<LoginLogout />
					</li>
				</ul>
			</div>
		</AppBar>
	);
};
export default Navbar;
