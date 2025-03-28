import AutoScroll from 'embla-carousel-auto-scroll'
import Image from 'next/image'
import Carousel from '../components/Carousel'
import BillNoteLogo from '../public/BillNote-logo.png'
import BugbaseLogo from '../public/Bugbase-logo-white.svg'
import CoverForceLogo from '../public/CoverForce-Logo.png'
import KhiladiProLogo from '../public/KPro_Logo.svg'
import SupplyNoteLogo from '../public/SupplyNote-logo.png'
import VyapLogo from '../public/Vyap-Logo.png'
import AbleJobsLogo from '../public/able_logo.png'
import BlanceLogo from '../public/blance-full-logo-new.png'
import BlitzLogo from '../public/blitz_logo_black.png'
import LifioLogo from '../public/lifio-logo.png'
import RevRagLogo from '../public/revrag_logo.png'
import TagMangoLogo from '../public/tagmango_logo.svg'
import SimplifyMoneyLogo from '../public/simplifymoney-logo.png'
import { getPreferredTheme } from '../utils/theme'

const data = [
	{ logo: AbleJobsLogo, heading: 'Able' },
	{ logo: BillNoteLogo, heading: 'BillNote' },
	{ logo: BlanceLogo, heading: 'Blance' },
	{ logo: BlitzLogo, heading: 'Blitz' },
	{ logo: BugbaseLogo, heading: 'Bugbase' },
	{ logo: CoverForceLogo, heading: 'CoverForce', customClass: 'py-2' },
	{ logo: KhiladiProLogo, heading: 'Khiladi Pro' },
	{ logo: LifioLogo, heading: 'Lifio' },
	{ logo: RevRagLogo, heading: 'RevRag' },
	{ logo: SimplifyMoneyLogo, heading: 'SimplifyMoney' },
	{ logo: SupplyNoteLogo, heading: 'SupplyNote' },
	{ logo: TagMangoLogo, heading: 'TagMango' },
	{ logo: VyapLogo, heading: 'Vyap' },
]

const Customers = () => {
	const currentTheme = getPreferredTheme();
	return (
		<div id='customers' className='w-full text-center py-12'>
			<h2 className='px-4 font-bold text-[2rem] relative'>
				{'Trusted by '}
				<span className='relative text-transparent bg-clip-text bg-gradient-to-r from-secondary to-[#6f117b]'>
					fast-moving
				</span>
				{' teams'}
			</h2>
			<div className='w-full mt-8 flex flex-row justify-center items-center place-content-between mx-auto flex-wrap xl:flex-nowrap sm:gap-y-4'>
				<Carousel opts={{ loop: true }} plugins={[AutoScroll({ playOnInit: true })]} controls='none' itemClassNames="!shrink !min-w-fit">
					{data.map((item) => (
						<Image
							priority
							src={item.logo}
							alt={item.heading}
							key={item.heading}
							title={item.heading}
							className={`${item.customClass ?? ''} h-16 md:h-12 object-contain px-4 py-4 sm:py-2 xl:py-1 w-fit mx-auto
							${currentTheme === 'dark' ? 'grayscale invert-[0.85] mix-blend-luminosity' : ''}`}
						/>
					))}
				</Carousel>
			</div>
		</div>
	)
}

export default Customers
