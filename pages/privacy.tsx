import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../views/Navbar'

const Policy = () => {
	return (
		<>
			<Navbar transparent={false} ctaLink='https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc' />
			<div className='p-5 w-[90%] m-auto'>
				<h2 className="my-1 font-bold text-4xl">Privacy Policy</h2>
				<div>
					<small>Last modified: October 7th, 2018.</small>
					<h4 className='font-semibold'> Vibinex™ is committed to protecting and respecting your privacy. This Privacy Policy sets out how we collect and process personal information about you when you visit the website alokit.in, when you use our products and services (our “Services”), or when you otherwise do business or make contact with us.</h4>
					<h4>Please read this policy carefully to understand how we handle and treat your personal information.</h4>

					<h2 className='font-semibold text-xl mt-4 mb-2'>WHAT INFORMATION DO WE COLLECT?</h2>
					<h4>We may collect and process the following personal information from you:</h4>
					<ul className='list-disc ml-4'>
						<li>Information you provide to us: We collect personal information when you voluntarily provide us with such information in the course of using our website or Services. For example, when you register to use our Services, we will collect your name, email address and organization information. We also collect personal information from you when you subscribe to our newsletter, or respond to a survey. If you make an enquiry through our website, or contact us in any other way, we will keep a copy of your communications with us.</li>
						<li>Information we collect when you do business with us: We may process your personal information when you do business with us – for example, as a customer or prospective customer, or as a vendor, supplier, consultant or other third party. For example, we may hold your business contact information and financial account information (if any) and other communications you have with us for the purposes of maintaining our business relations with you.</li>
						<li>Information we automatically collect: We may also collect certain technical information by automatic means when you visit our website, such as IP address, browser type and operating system, referring URLs, your use of our website, and other clickstream data. We collect this information automatically through the use of various technologies, such as cookies.</li>
						<li>Personal information where we act as a data processor: We also process personal information on behalf of our customers in the context of supporting our products and services. Where a customer subscribes to our Services for their website, game or app, they will be the ones who control what event data is collected and stored on our systems. For example, they may ask us to log basic user data (e.g. email address or username), device identifiers, IP addresses, event type, and related source code. In such cases, we are data processors acting in accordance with the instructions of our customers. You will need to refer to the privacy policies of our customers to find out more about how such information is handled by them.</li>
					</ul>

					<h2 className='font-semibold text-xl mt-4 mb-2'>WHAT DO WE USE YOUR INFORMATION FOR?</h2>
					<h4>The personal information we collect from you may be used in one of the following ways:</h4>
					<ul className='list-disc ml-4'>
						<li>To deal with your inquiries and requests</li>
						<li>To create and administer records about any online account that you register with us</li>
						<li>To provide you with information and access to resources that you have requested from us</li>
						<li>To provide you with technical support (your information helps us to better respond to your individual needs)</li>
						<li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you), including to improve the navigation and content of our sites</li>
						<li>For website and system administration and security</li>
						<li>For general business purposes, including to improve customer service (your information helps us to more effectively respond to your customer service requests and support needs), to help us improve the content and functionality of our Services, to better understand our users, to protect against wrongdoing, to enforce our Terms of Service, and to generally manage our business</li>
						<li>To process transactions and to provide Services to our customers and end-users</li>
					</ul>

				</div>


			</div>
			<Footer />
		</>
	)
}

export default Policy