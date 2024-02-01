import React from 'react'
import Image from 'next/image'
import BillNoteLogo from '../public/BillNote-F.jpg'
import SupplyNoteLogo from '../public/SupplyNote-logo.png'
import VyapLogo from '../public/Vyap-Logo.png'
import BlitzLogo from '../public/blitz_logo_black.png'
import AbleJobsLogo from '../public/Able-Jobs-logo.png'
import CoverForceLogo from '../public/CoverForce-Logo.png'

const data = [
	{ logo: SupplyNoteLogo, heading: 'SupplyNote' },
	{ logo: AbleJobsLogo, heading: 'AbleJobs' },
	{ logo: CoverForceLogo, heading: 'CoverForce', customClass: 'py-2' },
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
			<div className='w-[90%] lg:w-2/3 mt-8 flex flex-row justify-center items-center place-content-between mx-auto flex-wrap xl:flex-nowrap sm:gap-y-4'>
				{data.map((item) => (
					<Image
						priority
						src={item.logo}
						alt={item.heading}
						key={item.heading}
						className={`${item.customClass ?? ''} w-1/2 sm:w-1/3 xl:w-full h-20 sm:h-16 md:h-12 xl:ml-6 object-contain px-4 py-1`}
					/>
				))}
			</div>
		</div>
	)
}

export default Customers
