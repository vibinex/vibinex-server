import { useEffect, useState } from 'react';
import Link from 'next/link'
import { BsFacebook, BsLinkedin, BsInstagram, BsTwitter, BsWhatsapp, BsSlack, BsCalendarDate } from 'react-icons/bs'
import { FiMail } from "react-icons/fi";
import { PopupButton } from "react-calendly";

const legal = [
	{ name: 'Privacy Policy', link: '/privacy' },
	{ name: 'Terms & Conditions', link: '/terms' },
]

const quickLinks = [
	{ name: "Documentation", link: '/docs' },
	{ name: "Contribute", link: 'https://github.com/Alokit-Innovations' },
	{ name: "Pricing", link: '/pricing' },
]

const contactUs = [
	{ name: 'contact@vibinex.com', icon: FiMail, link: 'mailto:contact@vibinex.com' },
	{ name: '85115 57566', icon: BsWhatsapp, link: 'https://wa.me/918511557566' },
	{ name: 'Join Slack', icon: BsSlack, link: 'https://join.slack.com/t/vibinex/shared_invite/zt-1sysjjso3-1ftC6deRcOgQXW9hD4ozWg' },
]

const Footer = (props: { className?: string }) => {
	const [rootElement, setRootElement] = useState<HTMLElement>()
	useEffect(() => {
		setRootElement(document.getElementById('__root__')!);
	}, [])
	return (
		<footer className={'bg-secondary-main p-10 w-full mt-20 ' + props.className}>
			<div className='flex gap-x-40 gap-y-5 my-10 flex-wrap'>
				{/* Social  */}
				<div>
					<div className='flex gap-6 hover:cursor-pointer'>
						<Link href={'https://www.facebook.com/vibinex'}><BsFacebook size={35} /></Link>
						<Link href={'https://www.linkedin.com/company/vibinex/'}><BsLinkedin size={35} /></Link>
						<Link href={'https://www.instagram.com/vibinex/'}><BsInstagram size={35} /></Link>
						<Link href={'https://twitter.com/Vibinex'}><BsTwitter size={35} /></Link>
					</div>
				</div>

				{/* legal */}
				<div>
					<h2 className='font-bold text-[22px] mb-3 sm:mt-0 mt-7'>Legal</h2>
					<div>
						{
							legal.map((item) => {
								return (
									<div key={item.link} className='mt-3 text-[18px]'>
										<Link href={item.link}><h2>{item.name}</h2></Link>
									</div>
								)
							})
						}

					</div>
				</div>

				{/* Quick Links */}
				<div>
					<h2 className='font-bold text-[22px] mb-3 sm:mt-0 mt-7'>Go to</h2>
					<div>
						{
							quickLinks.map((item) => {
								return (
									<div key={item.name} className='mt-3 text-[18px]'>
										<Link href={item.link}><h2>{item.name}</h2></Link>
									</div>
								)
							})
						}

					</div>
				</div>

				{/* Contact Us*/}
				<div>
					<h2 className='font-bold text-[22px] mb-3 sm:mt-0 mt-7'>Contact Us</h2>
					<div>
						{
							contactUs.map((item) => {
								return (
									<Link key={item.name} href={item.link} className='mt-3 text-[18px] block'>
										<item.icon className='h-full inline mr-2' />
										{item.name}
									</Link>
								)
							})
						}
					</div>
					<div className='mt-3 flex'>
						<BsCalendarDate />
						{(rootElement) ?
							<PopupButton
								url='https://calendly.com/avikalp-gupta/30min'
								text='Meet Us'
								rootElement={rootElement}
								className='rounded-lg text-md text-secodary-black ml-2 mt-[-3px]'
							/> : null}
					</div>
				</div>
			</div>

			<div className='sm:mt-0 mt-7'>
				<h2>&copy; Alokit&trade; Innovations Private Limited 2023</h2>
			</div>
		</footer>
	)
}

export default Footer