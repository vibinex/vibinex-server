import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from '../components/Button';
import chromeLogo from '../public/chrome-logo.png'
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import RudderContext from "./RudderContext";
import { getAndSetAnonymousIdFromLocalStorage } from "../utils/rudderstack_initialize";
import { getAuthUserId, getAuthUserName } from "../utils/auth";

export type BannerHeightType = "h-12" | "h-24" | "h-32" | "h-40" | "h-44" | undefined;
type BannerSituation = "extension-not-installed" | "incompatible-browser" | "incompatible-device" | null; // DO NOT EDIT THESE NAMES (They are also the name of the events)

const Banner = () => {
	const { rudderEventMethods } = React.useContext(RudderContext);
	const session: Session | null = useSession().data;

	const chromeExtensionLink = "https://chrome.google.com/webstore/detail/vibinex/jafgelpkkkopeaefadkdjcmnicgpcncc";
	const [bannerHTML, setBannerHTML] = useState((<></>));
	const [bannerHeight, setBannerHeight] = useState<BannerHeightType>();

	useEffect(() => {
		const setBanner = (situation: BannerSituation) => {
			switch (situation) {
				case "extension-not-installed":
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
							<Image src={chromeLogo} alt="chrome extension logo" className={`w-12 inline mr-8 m-6 border border-white rounded-full`}></Image>
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
							<p className='text-center text-sm sm:text-xl w-fit sm:max-w-1/2 h-fit my-auto p-1'>
								Browser extensions are not supported on this device. Try Vibinex on a laptop or a desktop computer.
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

		const determineSituation = (): BannerSituation => {
			const isUnsupportedDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			// currently, this is the best way to check if browser extensions are supported. Ref: https://stackoverflow.com/a/60927213/4677052
			if ('chrome' in window && !isUnsupportedDevice) {
				return null;
			} else if (isUnsupportedDevice) {
				return "incompatible-device";
			} else {
				return "incompatible-browser";
			}
		}

		const situation = determineSituation();
		if (situation) {
			const anonymousId = getAndSetAnonymousIdFromLocalStorage();
			rudderEventMethods?.track(getAuthUserId(session), situation, { type: "detection", eventStatusFlag: 0, source: "banner", name: getAuthUserName(session) }, anonymousId);
		}
		setBanner(situation);
	}, [setBannerHeight])

	useEffect(() => {
		const anonymousId = getAndSetAnonymousIdFromLocalStorage()

		const handleDownloadClick = () => {
			rudderEventMethods?.track(getAuthUserId(session), "Add to chrome button", { type: "link", eventStatusFlag: 1, source: "banner", name: getAuthUserName(session) }, anonymousId)
		};
		const downloadLink = document.getElementById('add-to-chrome-btn');
		downloadLink?.addEventListener('click', handleDownloadClick);

		return () => {
			downloadLink?.removeEventListener('click', handleDownloadClick);
		};
	}, [rudderEventMethods, session, bannerHTML]);

	return (<div className={`w-full ${bannerHeight} bg-primary-main flex justify-center align-middle text-primary-light`} >
		{(bannerHeight) ? bannerHTML : null}
	</div>)
}

export default Banner;