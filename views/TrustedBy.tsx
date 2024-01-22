import React from 'react'

const data = [
	{ logo: '/ablejobs.svg', heading: 'Ablejobs'},
	{ logo: '/blance.png', heading: 'Blance'},
	{ logo: '/supplynote.svg', heading: 'SupplyNote'},
]

const TrustedBy = () => {
	return (
		<div id='trusted_by' className='w-full text-center py-12 bg-secondary-main'>
			<h2 className='font-bold text-[2rem]'>Trusted by</h2>
			<div className='md:w-2/3 w-[90%] mt-3 p-4 flex flex-col md:flex-row md:justify-center items-center gap-8 mx-auto'>
				{data.map((item) => (
					<div key={item.heading} className="flex flex-row md:flex-col md:p-5 p-3 rounded-lg border-2 md:mt-7 m-auto border-primary-main w-full md:w-1/3 md:h-96 md:gap-4">
						<div className='w-10 md:w-3/4 xl:w-1/2 md:mx-auto'>
                            <img src={`${item.logo}`} alt={item.heading} className='m-auto' />
                        </div>
						<div className='mx-auto w-full'>
							<h2 className='font-semibold text-[1.5rem]'>{item.heading}</h2>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
export default TrustedBy
