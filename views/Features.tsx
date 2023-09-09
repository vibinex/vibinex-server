import React from 'react'
import Image from 'next/image'
import PRprioritization from '../public/highlightPR.png'
import HunkLevelHighlight from '../public/highlightFile.png'

const FeatureList = [
	{ src: PRprioritization, text: 'PR Prioritization' },
	{ src: HunkLevelHighlight, text: 'Personalized Line Highlight' },
]

const Features = () => {
	return (
		<div id='features' className='w-full text-center py-12'>
			<h2 className='font-bold text-[2rem]'>Vibinex  <span className='text-[2rem] text-primary-main font-bold'>Features</span></h2>
			<div className='sm:flex sm:w-[95%] w-[100%] m-auto'>
				{FeatureList.map((item) => (
					<div className='sm:w-[50%] w-[100%] mt-8 rounded-md sm:ml-6' key={item.text}>
						<Image priority src={item.src} alt={item.text} className='rounded-md object-left-bottom object-cover w-full px-8 h-screen-1/2' />
						<h3 className='font-bold text-[1.3rem] mt-4'>{item.text}</h3>
					</div>
				))}
			</div>
		</div>
	)
}
export default Features