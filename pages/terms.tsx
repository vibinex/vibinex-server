import React from 'react'
import Footer from '../components/Footer'
import TermsMD from "./terms.mdx";
import Navbar from '../views/Navbar';

const Terms = () => {
	return (
		<>
			<Navbar transparent={false} ctaLink='https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc' />
			<div className='p-5 md:w-4/5 m-auto'>
				<TermsMD />
			</div>
			<Footer />
		</>
	)
}

export default Terms