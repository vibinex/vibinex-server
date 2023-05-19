import React, { useState } from 'react'
import {
	AiOutlineCheckCircle, AiOutlineCodeSandbox, AiOutlineGift, AiOutlineBlock
} from 'react-icons/ai'
import Navbar from '../views/Navbar';
import Footer from '../components/Footer';

const pricingPlan = [
	{
		pricingName: 'Free',
		duration: '.',
		pricing: 'for open source projects',
		features: ['Access of all features', 'Unlimited team size', 'For both Github and Bitbucket'],
		buttonText: 'Add a Repo',
		link: ''

	},
	{
		pricingName: 'Standard',
		duration: 'per user/month',
		pricing: '$100',
		features: ['Access of all features', 'personal team support for setting up'],
		buttonText: 'Start your 30/day trial',
		link: ''

	},
	{
		pricingName: 'Enterprise',
		duration: '.',
		pricing: 'custom pricing',
		features: ['Good for large teams', 'personal team support for setting up', 'upto 2 custom features'],
		buttonText: 'Contact Us',
		link: ''

	},

]


const Pricing = () => {
	const [priceDuration, setPriceDuration] = useState(false); // false for monthly and true for yearly
	const [pricePlans, setPricePlans] = useState(pricingPlan);
	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";

	let heading = [
		{ name: "Monthly", flag: priceDuration },
		{ name: "Yearly", flag: !priceDuration },
	]

	function HandleDuration() {
		let value = !priceDuration;
		setPriceDuration(value);
		if (value) {
			let features = ['Access of all features', 'personal team support for setting up'];
			let temp = pricePlans;
			temp[1] = { ...temp[1], pricingName: 'Plus', pricing: '$85', features, };
			console.log(temp);
			setPricePlans(prev => prev = temp);
		} else {
			let features = ['Access of all features', 'personal team support for setting up'];
			let temp = pricePlans;
			temp[1] = { ...temp[1], pricingName: 'Standard', pricing: '$100', features, buttonText: 'Start your 30 day trial', };
			setPricePlans(prev => prev = temp);
		}
	}

	return (
		<div>
			<div className='mb-16'>
				<Navbar ctaLink={chromeExtensionLink} transparent={true} />
			</div>
			<div id='pricing' className='w-full  py-12  bg-primary-light'>
				<h2 className='font-bold text-center text-[2rem]'>Pricing <span className='text-[2rem] text-primary-main font-bold'>Plans</span></h2>

				<div className='flex m-auto sm:w-[33%] w:[50%] justify-center rounded-md border-2 border-primary-dark mt-8'>
					{heading.map((item, index) => {
						return (
							<div
								key={index}
								onClick={() => HandleDuration()}
								className='text-center p-4 w-[100%] bg-primary-light cursor-pointer'
								style={{ backgroundColor: item.flag ? "white" : "rgb(33 150 243)" }}>
								<h2 className='text-[1.2rem] font-bold'
									style={{ color: item.flag ? "black" : "white" }}
								>{item.name == 'Yearly' ? <p className='text-[1.2rem]'>{item.name}<span className='text-[0.9rem]'> {'   (2 months free)'}</span></p> : item.name}</h2>
							</div>
						)
					})}
				</div>

				<div className='m-auto sm:flex w-[80%] mt-3 p-4 '>
					{
						pricePlans.map((item, index) => {
							return (
								<div key={index} className="sm:p-5 p-3 rounded-lg border-2 mt-7 sm:w-[40%] w-[80%] m-auto ml-10 border-primary-main  bg-primary-light shadow-md">

									<div className='flex justify-between'>
										<h2 className='mx-auto font-semibold text-[1.5rem]'>{item.pricingName}</h2>
									</div>

									<div>
										<div className='text-center'>
											<p className='mt-4 font-semibold text-[1.3rem] text-primary-main'>{item.pricing}</p>
											<p className='mt-2 text-[1.1rem]'>{item.duration}</p>
										</div>

										<div className='ml-[2%] mt-10 h-28'>
											{item.features.map((items, index) => {
												return (
													<div key={index} className='flex align-'>
														<AiOutlineCheckCircle color='rgb(33 150 243)' size={20} />
														<p className='text-[1.1rem] ml-1 mb-2'>{items}</p>
													</div>
												)
											})}
										</div>
										<div className='text-center border-2 bg-primary-main mt-5 p-4 rounded-lg cursor-pointer hover:bg-primary-light  hover:text-primary-dark  text-primary-light'>
											<p className='font-bold'>{item.buttonText}</p>
										</div>
									</div>

								</div>


							)
						})
					}
				</div>


				<p className='ml-[15%] text-red text-red-600 font-semibold mt-4'>*Pricing will start after 1 June 2023</p>
			</div>
			<Footer />
		</div>
	)
}
export default Pricing