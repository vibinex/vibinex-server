import React from 'react'
import FamewallEmbed from 'react-famewall'
import { getPreferredTheme } from '../utils/theme'

const Testimonials = () => {
	const [theme, setTheme] = React.useState('light');

	React.useEffect(() => {
		setTheme(getPreferredTheme());
	}, []);

	return (
		<div id='testimonials' className='w-full text-center py-12 bg-primary'>
			<h2 className='font-bold text-[2rem]'>Loved by developers</h2>
            <div className='md:w-2/3 w-[90%] mt-3 p-4 flex flex-col md:flex-row md:justify-center items-center gap-8 mx-auto'>
			    <FamewallEmbed wallUrl="vibinex" cardTheme={theme} />
            </div>
		</div>
	)
}
export default Testimonials