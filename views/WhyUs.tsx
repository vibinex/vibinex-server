import { AiOutlineApartment, AiOutlineFileSearch } from 'react-icons/ai'
import { VscSettings } from 'react-icons/vsc'
import { motion } from 'framer-motion'

const data = [
	{ icon: <AiOutlineApartment size={40} />, heading: 'Quality Control', content: 'Always stay informed if someone overwrites your code.' },
	{ icon: <AiOutlineFileSearch size={40} />, heading: 'Know your code', content: 'You should review every PR. But do you? Now you can!' },
	{ icon: <VscSettings size={40} />, heading: 'Reduce noise', content: 'Not everything needs your attention, focus on what matters the most.' },
]

const cardVariants = {
	offscreen: {
		y: 50,
		opacity: 0
	},
	onscreen: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			bounce: 0.4,
			duration: 0.8
		}
	}
};

const WhyUs = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
			id='whyus'
			className='w-full text-center py-12 bg-primary'
		>
			<motion.h2
				initial={{ y: -20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				viewport={{ once: true }}
				className='font-bold text-[2rem]'
			>
				Why <span className='text-[2rem] text-secondary font-bold'>Vibinex?</span>
			</motion.h2>
			<div className='w-[100%] mt-3 p-4'>
				{data.map((item, index) => (
					<motion.div
						initial="offscreen"
						whileInView="onscreen"
						viewport={{ once: true, amount: 0.8 }}
						variants={cardVariants}
						whileHover={{ scale: 1.02 }}
						key={item.heading}
						className="flex sm:p-5 p-3 rounded-lg border-2 mt-7 sm:w-[50%] w-[90%] m-auto border-secondary"
						style={{ transition: 'transform 0.2s' }}
					>
						<motion.div
							initial={{ rotate: -10 }}
							whileInView={{ rotate: 0 }}
							transition={{ duration: 0.5, delay: index * 0.2 }}
							className=''
						>
							{item.icon}
						</motion.div>
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							whileInView={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
							className='mx-auto'
						>
							<h2 className='font-semibold text-[1.5rem]'>{item.heading}</h2>
							<p className='w-[80%] m-auto'>{item.content}</p>
						</motion.div>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}
export default WhyUs