import React from 'react'
import Link from 'next/link'
import { BsFacebook, BsLinkedin, BsInstagram, BsTwitter, BsWhatsapp } from 'react-icons/bs'
import { FiMail } from "react-icons/fi";

const legal = [
	{ name: 'Privacy Policy', link: '/privacy' },
	{ name: 'Terms & Conditions', link: '/terms' },
]

const quickLinks = [
	{ name: "Home", link: '/' },
	{ name: "Docs", link: '/docs/setup' },
]

const contactUs = [
	{ name: 'contact@vibinex.com', icon: FiMail, link: 'mailto:contact@vibinex.com' },
	{ name: '85115 57566', icon: BsWhatsapp, link: 'https://wa.me/918511557566' },
]

const Footer = () => {
	return (
		<div className='sm:h-[20rem] h-[45rem] bg-secondary-main p-10'>
			<div className='sm:flex gap-40 mt-10'>
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
							legal.map((item, index) => {
								return (
									<div key={index} className='mt-3 text-[18px]'>
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
							quickLinks.map((item, index) => {
								return (
									<div key={index} className='mt-3 text-[18px]'>
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
							contactUs.map((item, index) => {
								return (
									<Link key={index} href={item.link} className='mt-3 text-[18px] block'>
										<item.icon className='h-full inline mr-2' />
										{item.name}
									</Link>
								)
							})
						}
					</div>
				</div>
			</div>

			<div className='sm:mt-0 mt-7'>
				<h2>&copy; Alokit&trade; Innovations Private Limited 2023</h2>
			</div>

		</div>
	)
}

export default Footer