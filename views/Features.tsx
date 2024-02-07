import React from 'react'
import Image from 'next/image'
import PRprioritization from '../public/highlightPR.png'
import HunkLevelHighlight from '../public/highlightFile.png'
import CarouselWrapper from '../components/Carousal'

const FeatureList = [
	{ src: PRprioritization, text: 'PR Prioritization' },
	{ src: HunkLevelHighlight, text: 'Personalized Line Highlight' },
]

const Features = () => {
	return (
		<div id='features' className='w-full text-center py-12 bg-secondary-main'>
			<h2 className='font-bold text-[2rem]'>Vibinex  <span className='text-[2rem] text-primary-main font-bold'>Features</span></h2>
			<div className='sm:flex sm:w-[95%] w-[100%] m-auto'>
				<CarouselWrapper>
					{FeatureList.map((item) => (
						<div className='flex flex-col lg:flex-row' key={item.text}>
							<div className='grow lg:grow-0 lg:w-full mt-8 rounded-md ml-6 lg:ml-0'>
								<h3 className='block lg:hidden font-bold text-[1.3rem] mb-4'>{item.text}</h3>
								<Image priority src={item.src} alt={item.text} className='rounded-md object-left-bottom object-cover w-full px-8 h-screen-1/2' />
							</div>
							<div className='grow lg:grow-0 lg:w-full mt-8 rounded-md ml-6 lg:ml-0'>
								<h3 className='hidden lg:block font-bold text-[1.3rem] my-4'>{item.text}</h3>
								<p className='text-pretty text-center mx-4 '>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
							</div>
						</div>
					))}
				</CarouselWrapper>
			</div>
		</div>
	)
}
export default Features