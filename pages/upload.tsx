import React, { useReducer, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import LoadingOverlay from '../components/LoadingOverlay';
import DropZone from '../components/DropZone'
import DropZoneData from '../components/DropZone/DropZoneData';
import DropZoneAction from '../components/DropZone/DropZoneAction';
import wowMan from '../public/wowMan v1.png'
import MainAppBar from "../views/MainAppBar";

// Windows Instructions Gifs
import windowsStep2 from '../public/windows_instruction/wstep2.gif';
import windowsStep3 from '../public/windows_instruction/wstep3.gif';
import windowsStep4 from '../public/windows_instruction/wstep4.gif';
import windowsStep5 from '../public/windows_instruction/wstep5.gif';
import windowsStep6 from '../public/windows_instruction/wstep6.gif';
import windowsStep7 from '../public/windows_instruction/wstep7.gif';

// Linux Instructions Gifs
import linuxStep2 from '../public/linux_instruction/lstep2.gif';
import linuxStep3 from '../public/linux_instruction/lstep3.gif';
import linuxStep4 from '../public/linux_instruction/lstep4.gif';
import linuxStep5 from '../public/linux_instruction/lstep5.gif';
import linuxStep6 from '../public/linux_instruction/lstep6.gif';
import linuxStep7 from '../public/linux_instruction/lstep7.gif';
import linuxStep8 from '../public/linux_instruction/lstep8.gif';

// windows Instructions Gifs
import macStep1 from '../public/mac_instruction/mstep1.gif';
import macStep2 from '../public/mac_instruction/mstep2.gif';
import macStep3 from '../public/mac_instruction/mstep3.gif';
import macStep4 from '../public/mac_instruction/mstep4.gif';
import macStep5 from '../public/mac_instruction/mstep5.gif';
import macStep6 from '../public/mac_instruction/mstep6.gif';
import macStep7 from '../public/mac_instruction/mstep7.gif';

const windowsInstructions = [
	{ image: windowsStep2, step: 'Unzip the downloaded .gz file (Softwares like 7-zip (https://www.7-zip.org/) can be used)' },
	{ image: windowsStep3, step: 'Run the extracted .exe file by double clicking on it' },
	{ image: windowsStep4, step: 'Enter path of the directory where your git repositories reside' },
	{ image: windowsStep5, step: 'Select the desired repos from the list of existing repos and scan them' },
	{ image: windowsStep6, step: 'Select your aliases from the list of all aliases found in the scanned repositories' },
	{ image: windowsStep7, step: 'After the program finishes, you should see a file named `devprofile.jsonl.gz` in the directory containing devprofiler. ' },
]

const macInstructions = [
	{ image: macStep1, step: 'Tap repo in brew on terminal by running `brew tap Alokit-Innovations/tap`' },
	{ image: macStep2, step: 'Install the application using `brew install devprofiler`' },
	{ image: macStep3, step: 'Run the application using `devprofiler` in a terminal' },
	{ image: macStep4, step: 'Enter path of the directory where your git repositories reside' },
	{ image: macStep5, step: 'Select the desired repos from the list of existing repos and scan them' },
	{ image: macStep6, step: 'Select your aliases from the list of all aliases found in the scanned repositories' },
	{ image: macStep7, step: 'After the program finishes, you should see a file named `devprofile.json.gz` in your directory. Upload it below' },
]

const linuxInstructions = [
	{ image: linuxStep2, step: 'Unzip the binary using gunzip - `gunzip filename.deb.gz`' },
	{ image: linuxStep3, step: 'Install the binary - `sudo apt install ./filename.deb`' },
	{ image: linuxStep4, step: 'Run the application - `devprofiler`' },
	{ image: linuxStep5, step: 'Enter path of the directory where your git repositories reside' },
	{ image: linuxStep6, step: 'Select the desired repos from the list of existing repos and scan them' },
	{ image: linuxStep7, step: 'Select your aliases from the list of all aliases found in the scanned repositories' },
	{ image: linuxStep8, step: 'After the program finishes, you should see a file named `devprofile.jsonl.gz` in your directory. Upload it below' },
]

const Upload = () => {
	const { data: session, status } = useSession();
	if (status === 'unauthenticated') {
		window && window.location.assign("/");
	}

	const cardStyle = 'm-5 p-4 border-2 rounded-lg shadow-lg'

	// reducer function to handle state changes
	const reducer: React.Reducer<DropZoneData, DropZoneAction> = (state: DropZoneData, action: DropZoneAction) => {
		switch (action.type) {
			case "setDropZone":
				return { ...state, inDropZone: action.inDropZone };
			case "addFileToList":
				if (action.files)
					return { ...state, fileList: state.fileList.concat(action.files) };
				else
					console.error("[Upload] Action type is `addFileToList` but no files found.");
				return state;
			default:
				return state;
		}
	}

	// destructuring state and dispatch, initializing fileList to empty array
	const [data, dispatch] = useReducer(reducer, {
		inDropZone: false,
		fileList: [],
	});
	const [os, setOs] = useState('Mobile Device')
	const [instructions, setInstructions] = useState(windowsInstructions)

	// detecting client os
	useEffect(() => {
		let os = navigator.userAgent;
		let finalOs = "";
		if (os.search('Windows') !== -1) {
			finalOs = "Windows";
		}
		else if (os.search('Mac') !== -1) {
			finalOs = "MacOS";
			setInstructions(prev => prev = macInstructions)
		}
		else if (os.search('X11') !== -1 && !(os.search('Linux') !== -1)) {
			finalOs = "UNIX";
		}
		else if (os.search('Linux') !== -1 && os.search('X11') !== -1) {
			finalOs = "Linux"
			setInstructions(prev => prev = linuxInstructions)
		} else if (/android/i.test(os) || /iPad|iPhone|iPod/.test(os)) {
			finalOs = "mobile";
		}
		setOs(finalOs)
	}, [])

	return (
		<div className='h-screen p-4'>
			{(status === 'loading') ? (<LoadingOverlay />)
				: (status === 'unauthenticated') ? (<LoadingOverlay text="You are not authenticated. Redirecting..." />)
					: null}
			<MainAppBar />
			{
				os === 'mobile' ?
					(
						<div className='w-[90%] m-auto mt-[25%]' >
							<Image src={wowMan} alt='Standing Man Image' className='w-[50%] m-auto' />
							<div className='p-3 border rounded-lg'>
								<h2 className='font-semibold text-[1.2rem] mb-2'>Not Supported in Mobile Devices</h2>
								<p>
									devProfile is not available for mobile devices. You can see the complete list of executables here.
								</p>
								<Link href={'/download'}>
									<h2 className='font-bold bg-primary-main text-center p-2 text-primary-light rounded-lg mt-3'>
										Download
									</h2>
								</Link>
							</div>
						</div>
					)
					:
					(
						<div className='md:w-[80%] lg:w-[60%] m-auto'>
							<h1 className="sm:text-4xl text-3xl text-center font-semibold mt-10 mb-10 ">
								Getting started in just<span className="text-blue-500"> 3 </span>Steps
							</h1>
							<div className='flex justify-center'>
								{/* Writing down the steps */}
								<div>
									<div className={cardStyle}>
										<h2 className='font-semibold text-[20px] mb-3'>Download the CLI</h2>
										<ul>
											<li>➡️ Click <Link href={'/'}><span className='text-primary-main'>here</span> </Link>to download the supported versions of cli</li>
											<li>for your <span className='font-semibold'>{os} </span>operating system</li>
											<li>➡️ Or visit our <Link href={'/download'}><span className='text-primary-main'> download </span></Link>page for installation</li>
										</ul>
									</div>
									<div className={cardStyle}>
										<h2 className='font-semibold text-[20px] mb-3'>Create your dev-contribution report completely offline</h2>
										{instructions.map((item, index) => {
											return (
												<div key={index}>
													<hr />
													<h4 className='mb-3'>➡️ {index + 1}. {item.step}</h4>
													<Image src={item.image} alt='demo gif' className='rounded-lg mb-4' />
												</div>
											)
										})
										}
									</div>
									<div className={cardStyle}>
										<h2 className='font-semibold text-[20px] mb-3'>Upload your report</h2>
										<DropZone data={data} dispatch={dispatch} />
									</div>
								</div>
							</div>
						</div>
					)
			}
		</div>
	)
}

export default Upload
