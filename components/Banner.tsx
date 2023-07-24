import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from '../components/Button';
import chromeLogo from '../public/chrome-logo.png'

export type BannerHeightType = "h-12" | "h-24" | "h-32" | "h-40" | "h-44" | undefined;

const Banner = ({ bannerHeight, setBannerHeight }: {
	bannerHeight: BannerHeightType,
	setBannerHeight: React.Dispatch<React.SetStateAction<BannerHeightType>>
}) => {
	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";
	const [bannerHTML, setBannerHTML] = useState((<></>));

	useEffect(() => {
		// TODO: [amankr] Put this in the condition where a banner needs to be shown
		const condition: "not-installed" | "incompatible-browser" | "incompatible-device" | null = 'not-installed';
		switch (condition) {
			case "not-installed":
				setBannerHeight(() => {
					const bannerHeight = 32;
					setBannerHTML((<>
						<p className='text-center text-xl w-fit sm:max-w-1/2 h-fit my-auto'>
							Browser extension is not installed
						</p>
						<Button id="add-to-chrome-btn" variant="outlined" href={chromeExtensionLink} target="_blank" className='h-fit text-center p-3 sm:p-4 px-20 rounded-lg font-bold text-[20px] my-auto ml-4'>
							<Image src={chromeLogo} alt="chrome extension logo" className={`w-10 inline mr-2 border border-white rounded-full`}></Image>
							Download the extension
						</Button>
					</>))
					return `h-${bannerHeight}`;
				})
				break;
			case "incompatible-browser":
				setBannerHeight(() => {
					const bannerHeight = 24;
					setBannerHTML((<>
						<Image src={chromeLogo} alt="chrome extension logo" className={`inline m-6 mr-8 border border-white rounded-full w-${bannerHeight - 12}`}></Image>
						<p className='text-center font-bold text-xl w-fit sm:max-w-1/2 h-fit my-auto'>
							Vibinex is only supported in Chromium browsers<br />
							<span className='text-sm font-normal'>Google Chrome, Microsoft Edge, Opera, Chromium, Brave etc.</span>
						</p>
					</>))
					return `h-${bannerHeight}`;
				})
				break;
			case "incompatible-device":
				setBannerHeight(() => {
					const bannerHeight = 12;
					setBannerHTML((<>
						<p className='text-center text-sm sm:text-xl w-fit sm:max-w-1/2 h-fit my-auto'>
							Browser extensions are not supported on this device.
						</p>
					</>))
					return `h-${bannerHeight}`;
				})
				break;
			default:
				// either user is not logged in, or Vibinex extension is already installed
				setBannerHeight(() => {
					setBannerHTML((<></>))
					return undefined;
				})
				break;
		}
	}, [])

	return (<div className={`w-full ${bannerHeight} bg-primary-main flex justify-center align-middle text-primary-light rounded-2xl`} >
		{(bannerHeight) ? bannerHTML : null}
	</div>)
}

export default Banner;