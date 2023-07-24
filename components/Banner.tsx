import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from '../components/Button';
import chromeLogo from '../public/chrome-logo.png'

export type BannerHeightType = "h-12" | "h-24" | "h-32" | "h-40" | "h-44" | undefined;
type BannerSituation = "not-installed" | "incompatible-browser" | "incompatible-device" | null;

const Banner = ({ bannerHeight, setBannerHeight }: {
	bannerHeight: BannerHeightType,
	setBannerHeight: React.Dispatch<React.SetStateAction<BannerHeightType>>
}) => {
	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";
	const [bannerHTML, setBannerHTML] = useState((<></>));

	const setBanner = (situation: BannerSituation) => {
		switch (situation) {
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
                        <div className="flex items-center m-6">
                            <Image src={chromeLogo} alt="chrome extension logo" className="w-12 h-12 border border-white rounded-full"></Image>
                            <p className='text-center font-bold text-xl w-fit sm:max-w-1/2 h-fit my-auto'>
                                Vibinex is only supported in Chromium browsers<br />
                                <span className='text-sm font-normal'>Google Chrome, Microsoft Edge, Opera, Chromium, Brave etc.</span>
                            </p>
                        </div>
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
	}

	useEffect(() => {
		const determineSituation = (): BannerSituation => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			if ('chrome' in window && !isMobile) {
				return null;
			} else if (isMobile) {
                return "incompatible-device";
            } else {
				return "incompatible-browser";
			}
			// TODO: [amankr] Determine if a banner needs to be shown. If yes, then which one
		}
		const situation = determineSituation();
		setBanner(situation);
	}, [])

	return (<div className={`w-full ${bannerHeight} bg-primary-main flex justify-center align-middle text-primary-light rounded-2xl`} >
		{(bannerHeight) ? bannerHTML : null}
	</div>)
}

export default Banner;