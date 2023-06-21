import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import Navbar from '../views/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import RudderContext from '../components/RudderContext';
import { getAndSetAnonymousIdFromLocalStorage } from '../utils/url_utils';
import { getAuthUserId, getAuthUserName } from '../utils/auth';

const monthlyBasePriceUSD = 10;

const pricingPlan = [
	{
		pricingName: 'Free',
		duration: '',
		pricing: 'for open source projects',
		features: ['Access of all features', 'Unlimited team size', 'For both Github and Bitbucket'],
		buttonText: 'Add a Repo',
		link: '/docs'

	},
	{
		pricingName: 'Standard',
		duration: 'per user/month',
		pricing: undefined, // will be populated by formula
		features: ['Access of all features', 'Direct support through Slack', 'Free-of-cost setup assistance'],
		buttonText: 'Start your 30 day trial',
		link: '/u' // temp. adding user profile page link, need to replace it with payment link

	},
	{
		pricingName: 'Enterprise',
		duration: '',
		pricing: 'custom pricing',
		features: ['Everything in Standard plan', 'On-call support', 'Upto 2 custom features'],
		buttonText: 'Contact Us',
		link: 'https://api.whatsapp.com/send/?phone=918511557566&text&type=phone_number&app_absent=0'

	},

]


const Pricing = () => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;
	const [isYearly, setIsYearly] = useState(false); // false for monthly
	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";
	let heading = [
		{ name: "Monthly", flag: isYearly },
		{ name: "Yearly", flag: !isYearly },
	]

	const getPriceString = (currency: '$' | '₹', isYearly: boolean) => {
		const priceDecimal = (isYearly ? (10 / 12) : 1) * monthlyBasePriceUSD;
		const price = Math.round(priceDecimal * 100) / 100;
		return (<>  {currency} <span className='text-4xl'>{price} </span ></>);
	}

	const pricingStartDate = new Date(2023, 6, 1); // 1st July 2023
	const today = new Date();

	React.useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()
		rudderEventMethods?.track(getAuthUserId(session), "pricing-page", { type: "page", eventStatusFlag: 1, name: getAuthUserName(session) }, anonymousId) //Anonymous Id is set in local storage as soon as the user lands on the webiste.
	}, [rudderEventMethods]);

	return (
		<div>
			<div className='mb-16'>
				<Navbar ctaLink={chromeExtensionLink} transparent={true} />
			</div>
			<div id='pricing' className='w-full py-12 bg-primary-light'>
				<h2 className='font-bold text-center text-[2rem]'>Pricing <span className='text-[2rem] text-primary-main font-bold'>Plans</span></h2>
				{(today <= pricingStartDate) ? (<p className='text-center -mt-2'><small>(Applicable after July 1, 2023)</small></p>) : null}

				<div className='flex m-auto w-4/5 md:w-1/2 justify-center rounded-xl mt-8 bg-gray-100'>
					{heading.map((item, index) => {
						return (
							<div
								key={index}
								onClick={() => {setIsYearly(item.name === 'Yearly'); rudderEventMethods?.track(getAuthUserId(session), "pricing-changed", { type: "button", eventStatusFlag: 1, isYearly: isYearly, name: getAuthUserName(session) }, getAndSetAnonymousIdFromLocalStorage())}}
								className={`text-center p-4 w-full rounded-xl cursor-pointer ${item.flag ? null : 'bg-primary-main border-2 border-primary-dark'}`}>
								<h2 className={`sm:text-2xl font-bold ${item.flag ? 'text-secondary-dark' : 'text-secondary-main'}`}
								>{item.name}{item.name === 'Yearly' ?
									<span className='font-light text-sm whitespace-nowrap'>
										{' (2 months free)'}
									</span> : null}</h2>
							</div>
						)
					})}
				</div>

				<div className='m-auto md:grid w-4/5 mt-3 md:p-4 grid-cols-3 gap-5 h-fit'>
					{
						pricingPlan.map((item, index) => {
							return (
								<div key={index} className="md:p-5 p-3 rounded-lg border-2 mt-7 w-full m-auto border-primary-main bg-primary-light shadow-md flex flex-col h-full">
									<h2 className='mx-auto font-semibold text-2xl text-center'>{item.pricingName}</h2>

									<div className='text-center h-16'>
										<p className='mt-2 font-medium text-xl text-primary-main'>{(item.pricing) ? item.pricing : getPriceString("$", isYearly)}</p>
										<p className='text-base'>{item.duration}</p>
									</div>

									<ul className='mt-3.5 grow'>
										{item.features.map((feature, index) => {
											return (
												<li key={index} className='text-lg ml-1 mb-2'>
													<AiOutlineCheckCircle className='text-primary-main w-5 inline mr-1' size={20} />
													{feature}
												</li>
											)
										})}
									</ul>
									<Button variant='contained' href={item.link} target='_blank' className='w-full py-4 text-xl'>
										{item.buttonText}
									</Button>
								</div>


							)
						})
					}
				</div>
			</div>
			<Footer />
		</div>
	)
}
export default Pricing