import React from 'react'
import FamewallEmbed from 'react-famewall'
import { getPreferredTheme } from '../utils/theme'
import { motion } from 'framer-motion'

const Testimonials = () => {
	const [theme, setTheme] = React.useState('light');

	React.useEffect(() => {
		setTheme(getPreferredTheme());
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
			id='testimonials'
			className='w-full text-center py-12 bg-primary'
		>
			<motion.h2
				initial={{ y: -20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				viewport={{ once: true }}
				className='font-bold text-[2rem]'
			>
				Loved by developers
			</motion.h2>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				whileInView={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				viewport={{ once: true }}
				className='md:w-2/3 w-[90%] mt-3 p-4 flex flex-col md:flex-row md:justify-center items-center gap-8 mx-auto'
			>
				<FamewallEmbed wallUrl="vibinex" cardTheme={theme} />
			</motion.div>
		</motion.div>
	)
}
export default Testimonials