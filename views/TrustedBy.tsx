import React from 'react'
import Image from 'next/image'
import BillNoteLogo from '../public/BillNote-F.jpg'
import SupplyNoteLogo from '../public/SupplyNote-logo.png'
import VyapLogo from '../public/Vyap-Logo.png'
import BlitzLogo from '../public/blitz_logo_black.png'
import AbleJobsLogo from '../public/Able-Jobs-logo.png'

const data = [
	{ logo: BillNoteLogo, heading: 'BillNote'},
	{ logo: BlitzLogo, heading: 'Blitz' },
	{ logo: AbleJobsLogo, heading: 'AbleJobs' },
	{ logo: VyapLogo, heading: 'Vyap' },
	{ logo: SupplyNoteLogo, heading: 'SupplyNote' },
]

const Customers = () => {
	return (
		<div id='customers' className='w-full text-center py-12'>
			<h2 className='font-bold text-[2rem]'>Trusted by</h2>
			<div className='md:w-2/3 w-[90%] mt-3 p-4 flex flex-col md:flex-row md:justify-center items-center gap-8 mx-auto'>
				{data.map((item) => (
					<div className='sm:w-[50%] w-[100%] mt-8 rounded-md sm:ml-6' key={item.heading}>
						<Image 
							priority 
							src={item.logo} 
							alt={item.heading} 
							className='rounded-md object-left-bottom object-cover w-full px-8' 
							style={{objectFit: "contain"}}
						/>
					</div>
				))}
			</div>
		</div>
	)
}

export default Customers
