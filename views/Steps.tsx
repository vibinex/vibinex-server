import React, { useState } from 'react'
import { BiWindowOpen,BiDownload,BiIntersect} from 'react-icons/bi'
import{GrInstall} from 'react-icons/gr'

const Steps = () => {

	const [github, setGithub] = useState(false);
	const gitHubSteps = [
		{ step: "1. Download Chrome Extension", icon: <BiDownload size={40} /> },
		{ step: "2. Install Github app", icon: <GrInstall size={40} /> },
		{ step: "3. Setup Github app", icon: <BiIntersect size={40} /> },
	]
	const bitBucket = [
		{ step: "1. Downald Chrome Extension", icon: <BiDownload size={40} /> },
		{ step: "2. Install Github app", icon: <GrInstall size={40} /> },
		{ step: "3. Setup bitbucket pipeline", icon: <BiIntersect size={40} /> },
	]

	let steps = github ? gitHubSteps : bitBucket;

	let heading = [
		{ name: "Github", flag: github },
		{ name: "BitBucket", flag: !github },
	]

	return (
		<div id='whyus' className='w-full text-center py-12  bg-secondary-main'>
			<h2 className='font-bold text-[2rem]'>Steps to<span className='text-[2rem] text-primary-main font-bold'> Download</span></h2>

			<div className='flex bg-cyan-300 m-auto sm:w-[40%] w:[60%] justify-center rounded-md border-2 border-primary-dark mt-4'>
				{heading.map((item, index) => {
					return (
						<div
							key={index}
							onClick={() => item.name == 'Github' ? setGithub(prev => prev = true) : setGithub(prev => prev = false)}
							className='p-4 w-[100%] bg-primary-light cursor-pointer'
							style={{ backgroundColor: item.flag ? "rgb(33 150 243)" : "white" }}>
							<h2 className='text-[1.3rem] font-bold'
							style={{ color: item.flag ? "white" : "black" }}
							>{item.name}</h2>
						</div>
					)
				})}
			</div>

			<div className='w-[100%] mt-3 p-4'>
				{
					steps.map((item, index) => {
						return (
							<div key={index} className="flex sm:p-5 p-3 rounded-lg border-2 mt-7 sm:w-[50%]  w-[90%] m-auto border-primary-main">
								<div>
									{item.icon}
								</div>
								<div className='mx-auto'>
									<h2 className='text-[1.5rem]'>{item.step}</h2>
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}
export default Steps