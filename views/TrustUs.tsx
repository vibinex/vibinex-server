import React from 'react'
import { BiCodeBlock } from 'react-icons/bi'
import { IconContext } from 'react-icons'
import { IoSpeedometerOutline } from "react-icons/io5";
import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import { motion } from 'framer-motion';

const data = [
	{ icon: <IoSpeedometerOutline />, heading: 'Zero onboarding', content: 'Vibinex brings insights to your GitHub or Bitbucket code-review page' },
	{ icon: <RiGitRepositoryPrivateLine />, heading: 'Data privacy', content: 'Your code and other sensitive data never leaves your infrastructure' },
	{ icon: <BiCodeBlock />, heading: 'Open source', content: '100% transparency means 100% trust' },
]

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.3
		}
	}
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 100
		}
	}
};

const TrustUs = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
			id='trust'
			className='w-full text-center py-12 bg-primary'
		>
			<motion.h2
				initial={{ y: -20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				viewport={{ once: true }}
				className='font-bold text-[2rem]'
			>
				Stay calm and get <span className='text-[2rem] text-secondary font-bold'>Vibinex</span>
			</motion.h2>
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className='md:w-2/3 w-[90%] mt-3 p-4 flex flex-col md:flex-row md:justify-center items-center gap-8 mx-auto'
			>
				{data.map((item, index) => (
					<motion.div
						key={item.heading}
						variants={itemVariants}
						whileHover={{ scale: 1.05 }}
						className="flex flex-row md:flex-col md:p-5 p-3 rounded-lg border-2 md:mt-7 m-auto border-secondary w-full md:w-1/3 md:h-96 md:gap-4"
						style={{ transition: 'transform 0.2s' }}
					>
						<motion.div
							initial={{ rotate: -10, scale: 0.9 }}
							whileInView={{ rotate: 0, scale: 1 }}
							transition={{ duration: 0.5, delay: index * 0.2 }}
							className='w-10 md:w-3/4 xl:w-1/2 md:mx-auto'
						>
							<IconContext.Provider value={{ size: '100%', className: 'm-auto' }}>
								{item.icon}
							</IconContext.Provider>
						</motion.div>
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
							className='mx-auto w-full'
						>
							<h2 className='font-semibold text-[1.5rem]'>{item.heading}</h2>
							<p className='w-[80%] md:w-full md:mt-2 m-auto xl:mt-4'>{item.content}</p>
						</motion.div>
					</motion.div>
				))}
			</motion.div>
		</motion.div>
	)
}
export default TrustUs
