import AutoScroll from 'embla-carousel-auto-scroll'
import Image from 'next/image'
import CarouselWrapper from '../components/Carousal'
import BillNoteLogo from '../public/BillNote-F.jpg'
import CoverForceLogo from '../public/CoverForce-Logo.png'
import SupplyNoteLogo from '../public/SupplyNote-logo.png'
import VyapLogo from '../public/Vyap-Logo.png'
import AbleJobsLogo from '../public/able_logo.png'
import BlanceLogo from '../public/blance-full-logo-new.png'
import BlitzLogo from '../public/blitz_logo_black.png'

const data = [
	{ logo: SupplyNoteLogo, heading: 'SupplyNote' },
	{ logo: AbleJobsLogo, heading: 'Able' },
	{ logo: CoverForceLogo, heading: 'CoverForce', customClass: 'py-2' },
	{ logo: BlanceLogo, heading: 'Blance' },
	{ logo: BlitzLogo, heading: 'Blitz' },
	{ logo: BillNoteLogo, heading: 'BillNote' },
	{ logo: VyapLogo, heading: 'Vyap' },
]

const Customers = () => {
	return (
		<div id='customers' className='w-full text-center py-12'>
			<h2 className='px-4 font-bold text-[2rem] relative'>
				{'Trusted by '}
				<span className='relative text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-[#6f117b]'>
					fast-moving
				</span>
				{' teams'}
			</h2>
			<div className='w-full mt-8 flex flex-row justify-center items-center place-content-between mx-auto flex-wrap xl:flex-nowrap sm:gap-y-4'>
				<CarouselWrapper opts={{ loop: true }} plugins={[AutoScroll({ playOnInit: true })]} showControls={false} itemClassNames="!shrink !min-w-fit">
				{data.map((item) => (
					<Image
						priority
						src={item.logo}
						alt={item.heading}
						key={item.heading}
						title={item.heading}
						className={`${item.customClass ?? ''} h-16 md:h-12 object-contain px-4 py-4 sm:py-2 xl:py-1 w-fit`}
					/>
				))}
				</CarouselWrapper>
			</div>
		</div>
	)
}

export default Customers
