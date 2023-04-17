import React from 'react'
import Footer from '../components/Footer'
import TitleBar from '../views/TitleBar'

const Terms = () => {
	return (
		<>
			<TitleBar />
			<div className='p-5 w-[90%] m-auto'>
				<h2 className="my-1 font-bold text-4xl">Terms and Conditions</h2>
				<p>These are the terms and conditions of using Vibinex:</p>
				<ul>
					<li>Vibinex delivers the software as is and is not liable for any loss or damage caused by using its software</li>
					<li>
						Contributing to the codebase of Vibinex does not entitle the contributor to any profits or monetary compensation.
						Although, Vibinex might choose to compensate specific contributors or contributions on its own descretion.
					</li>
				</ul>
			</div>
			<Footer />
		</>
	)
}

export default Terms