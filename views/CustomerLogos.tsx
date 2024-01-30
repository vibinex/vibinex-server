import React from 'react'
import Image from 'next/image'
import BillNoteLogo from '../public/BillNote-F.jpg'
import SupplyNoteLogo from '../public/SupplyNote-logo.png'
import VyapLogo from '../public/Vyap-Logo.png'
import BlitzLogo from '../public/blitz_logo_black.png'
import AbleJobsLogo from '../public/Able-Jobs-logo.png'

const data = [
	{ logo: SupplyNoteLogo, heading: 'SupplyNote' },
	{ logo: AbleJobsLogo, heading: 'AbleJobs' },
	{ logo: BlitzLogo, heading: 'Blitz' },
	{ logo: BillNoteLogo, heading: 'BillNote' },
	{ logo: VyapLogo, heading: 'Vyap' },
]

const Customers = () => {
	return (
		<div id='customers' className='w-full text-center py-12'>
			<h2 className='px-4 font-bold text-[2rem] relative'>
				{'Trusted by '}
				<span className='relative text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-[#6f117b]'>
					fast-moving
				</span>
				{' teams'}
			</h2>
			<div className='w-[90%] lg:w-2/3 mt-8 flex flex-row justify-center items-center place-content-between mx-auto flex-wrap lg:flex-nowrap'>
				{data.map((item) => (
					<Image
						priority
						src={item.logo}
						alt={item.heading}
						key={item.heading}
						className='w-1/2 sm:w-1/5 lg:w-full h-20 sm:16 md:h-12 sm:mt-2 lg:ml-6 object-contain px-4 py-1'
					/>
				))}
			</div>
		</div>
	)
}

export default Customers
