import React from 'react'
import Link from 'next/link'
import { BsSlack } from 'react-icons/bs'

const JoinSlack = () => {
	return (
		<div id='joinSlack' className='w-full text-center py-12  bg-black mb-[-5%]'>
			<h2 className='font-bold text-[2rem] text-white'> Slack Community</h2>
			<div className='w-[100%] mt-1 p-4 text-white'>
				<p className='text-[1.2rem]'>
					Join our active slack community for further support and your feedback.
				</p>
			</div>

			<Link href={'https://www.google.com'} target='blank'>
				<div className='flex justify-center items-center'>
					<div className='bg-primary-main	 m-auto w-[50%] sm:p-5 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5' >
						<div className='flex text-primary-light justify-center items-center'>
							<h2 className='sm:text-[1.5rem] text-[1rem] mr-4'>Join Now</h2>
							<BsSlack size={20} />
						</div>
					</div>
				</div>
			</Link>


		</div>
	)
}
export default JoinSlack