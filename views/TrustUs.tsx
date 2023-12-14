import React from 'react'
import { BiCodeBlock, BiWindowOpen } from 'react-icons/bi'
import { BsShieldLock } from 'react-icons/bs'
import { IconContext } from 'react-icons'

const data = [
	{ icon: <BiCodeBlock />, heading: 'Zero onboarding', content: 'Vibinex brings insights to your GitHub or Bitbucket code-review page' },
	{ icon: <BsShieldLock />, heading: 'Data privacy', content: 'Your code and other sensitive data never leaves your infrastructure' },
	{ icon: <BiWindowOpen />, heading: 'Open source', content: '100% transparency means 100% trust' },
]

const TrustUs = () => {
	return (
		<div id='trust' className='w-full text-center py-12 bg-secondary-main'>
			<h2 className='font-bold text-[2rem]'>Stay calm and get <span className='text-[2rem] text-primary-main font-bold'>Vibinex</span></h2>
			<div className='sm:w-2/3 w-[90%] mt-3 p-4 flex flex-col sm:flex-row sm:justify-center items-center gap-8 mx-auto'>
				{data.map((item) => (
					<div key={item.heading} className="flex flex-row sm:flex-col sm:p-5 p-3 rounded-lg border-2 sm:mt-7 m-auto border-primary-main w-full sm:w-1/3 sm:h-96 sm:gap-4">
						<div className='w-10 sm:w-3/4 sm:mx-auto'>
							<IconContext.Provider value={{ size: '100%', className: 'm-auto' }}>
								{item.icon}
							</IconContext.Provider>
						</div>
						<div className='mx-auto w-full'>
							<h2 className='font-semibold text-[1.5rem]'>{item.heading}</h2>
							<p className='w-[80%] sm:w-full m-auto'>{item.content}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
export default TrustUs
