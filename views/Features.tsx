import React from 'react'
import Image from 'next/image'
import RelevanceComment from '../public/relevanceComment.png'
import PRprioritization from '../public/highlightPR.png'
import HunkLevelHighlight from '../public/highlightFile.png'
import CarouselWrapper from '../components/Carousal'

const FeatureList = [
	{
		src: RelevanceComment,
		text: 'Accurate reviewer assignment',
		description: "When you raise a pull request, you see a list \
		of the team-members who are best suited to review it, along \
		with the percentage relevance of the reviewer to the pull request.\
		They are also automatically assigned as reviewers in the PR. \
		Individually assigning the reviewers leads to faster response."
	},
	{
		src: HunkLevelHighlight,
		text: 'Personalized file & line highlighting',
		description: 'The browser extension automatically highlights the \
		parts of the pull request file-changes that you had last contributed to.\
		You can use this to navigate the pull request by remembering the context \
		of the highlighted code and starting your review from the PR from there.' },
	{
		src: PRprioritization,
		text: 'Pull request prioritization',
		description: 'For engineers who like to stay on top of all the \
		changes in their modules, Vibinex highlights the pull requests \
		of the repository that affect the code that you have personally worked on.'
	},
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
								<p className='text-pretty text-center mx-4 '>{item.description}</p>
							</div>
						</div>
					))}
				</CarouselWrapper>
			</div>
		</div>
	)
}
export default Features