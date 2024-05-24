import React from 'react'
import { BiCodeBlock } from 'react-icons/bi'
import { IconContext } from 'react-icons'
import { IoSpeedometerOutline } from "react-icons/io5";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";

const data = [
	{ icon: <IoSpeedometerOutline />, heading: 'Zero onboarding', content: 'Vibinex brings insights to your GitHub or Bitbucket code-review page' },
	{ icon: <RiGitRepositoryPrivateLine />, heading: 'Data privacy', content: 'Your code and other sensitive data never leaves your infrastructure' },
	{ icon: <BiCodeBlock />, heading: 'Open source', content: '100% transparency means 100% trust' },
]

const TrustUs = () => {
	return (
		<div id='trust' className='w-full text-center py-12 bg-primary'>
			<h2 className='font-bold text-[2rem]'>Stay calm and get <span className='text-[2rem] text-primary-main font-bold'>Vibinex</span></h2>
			<div className='md:w-2/3 w-[90%] mt-3 p-4 flex flex-col md:flex-row md:justify-center items-center gap-8 mx-auto'>
				{data.map((item) => (
					<div key={item.heading} className="flex flex-row md:flex-col md:p-5 p-3 rounded-lg border-2 md:mt-7 m-auto border-primary-main w-full md:w-1/3 md:h-96 md:gap-4">
						<div className='w-10 md:w-3/4 xl:w-1/2 md:mx-auto'>
							<IconContext.Provider value={{ size: '100%', className: 'm-auto' }}>
								{item.icon}
							</IconContext.Provider>
						</div>
						<div className='mx-auto w-full'>
							<h2 className='font-semibold text-[1.5rem]'>{item.heading}</h2>
							<p className='w-[80%] md:w-full md:mt-2 m-auto xl:mt-4'>{item.content}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
export default TrustUs
