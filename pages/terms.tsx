import React from 'react'
import Footer from '../components/Footer'
import TitleBar from '../views/TitleBar'
import TermsMD from "./terms.mdx";

const Terms = () => {
	return (
		<>
			<TitleBar />
			<div className='p-5 md:w-4/5 m-auto'>
				<TermsMD />
			</div>
			<Footer />
		</>
	)
}

export default Terms