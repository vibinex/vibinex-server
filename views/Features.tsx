import React from 'react'
import Image from 'next/image'
import RelevanceComment from '../public/relevanceComment.png'
import PRprioritization from '../public/highlightPR.png'
import HunkLevelHighlight from '../public/highlightFile.png'
import DiffGraph from '../public/DiffGraph.png'
import Carousel from '../components/Carousel'
import Autoplay from 'embla-carousel-autoplay'
import { motion } from 'framer-motion'

const FeatureList = [
	{
		src: RelevanceComment,
		text: 'Accurate reviewer assignment',
		description: "When you raise a pull request, you see a list " +
			"of the team-members who are best suited to review it, along " +
			"with the percentage relevance of the reviewer to the pull request." +
			"They are also automatically assigned as reviewers in the PR. " +
			"Individually assigning the reviewers leads to faster response."
	},
	{
		src: DiffGraph,
		text: 'DiffGraph: function-call changes',
		description: "Vibinex adds a comment to the pull request with a " +
			"color-coded graph of the changes in the function calls in the pull request. " +
			"This helps you understand the changes in the pull request at a function-call level, " +
			"which is more granular than the line-level changes."
	},
	{
		src: HunkLevelHighlight,
		text: 'Personalized file & line highlighting',
		description: 'The browser extension automatically highlights the ' +
			'parts of the pull request file-changes that you had last contributed to. ' +
			'You can use this to navigate the pull request by remembering the context ' +
			'of the highlighted code and starting your review from the PR from there.'
	},
	{
		src: PRprioritization,
		text: 'Pull request prioritization',
		description: 'For engineers who like to stay on top of all the ' +
			'changes in their modules, Vibinex highlights the pull requests ' +
			'of the repository that affect the code that you have personally worked on.'
	},
]

const Features = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
			id='features'
			className='w-full text-center py-12 bg-primary'
		>
			<motion.h2
				initial={{ y: -20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				viewport={{ once: true }}
				className='font-bold text-[2rem]'
			>
				Vibinex <span className='text-[2rem] text-secondary font-bold'>Features</span>
			</motion.h2>
			<div className='w-full lg:w-4/5 m-auto'>
				<Carousel opts={{ loop: true }} plugins={[Autoplay({ playOnInit: true, delay: 3000 })]} controls='dots'>
					{FeatureList.map((item) => (
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className='flex flex-col lg:flex-row'
							key={item.text}
						>
							<motion.div
								whileHover={{ scale: 1.02 }}
								transition={{ type: "spring", stiffness: 400, damping: 10 }}
								className='grow lg:grow-0 lg:w-full mt-8 rounded-md lg:mx-0 pl-4'
							>
								<h3 className='block lg:hidden font-bold text-[1.3rem] mb-4'>{item.text}</h3>
								<Image priority src={item.src} alt={item.text} className='rounded-md object-left-top object-cover w-full h-72 lg:h-screen-1/2 mx-auto max-w-2xl' />
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								viewport={{ once: true }}
								className='grow lg:grow-0 lg:w-full mt-8 rounded-md lg:ml-0 flex flex-col items-center justify-normal'
							>
								<h3 className='hidden lg:block font-bold text-[1.3rem] my-4 lg:text-2xl xl:text-3xl'>{item.text}</h3>
								<p className='text-center mx-4 lg:text-lg xl:text-xl'>{item.description}</p>
							</motion.div>
						</motion.div>
					))}
				</Carousel>
			</div>
		</motion.div>
	)
}
export default Features