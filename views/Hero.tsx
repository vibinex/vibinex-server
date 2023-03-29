import React from "react";
import Button from "../components/Button";
import Image from "next/image";
import highlightPR from '../public/highlightPR.png'
import highlightFile from '../public/highlightFile.png'
import chromeLogo from '../public/chrome-logo.png'

const Hero = (props: { ctaLink: string }) => {
	return (
		<div className='flex items-center justify-center h-screen bg-fixed bg-center bg-cover'
			style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80')" }}
		>
			{/*Overlay*/}
			<div className='absolute top-0 right-0 bottom-0 left-0 bg-black/70 z-[2]' />
			<section className='p-5 text-primary-light z-[2] sm:mt-[10%] pt-1 sm:w-[50%]'>
				<article className="text-center">
					<h1 className='sm:text-[60px] text-[35px] font-bold'>{'Prioritization for'}
						<span className='text-primary-main font-bold block'>
							Pull Requests
						</span>
					</h1>
					<p className="text-[25px] mt-20 mb-10 text-gray-300">
						Know which code-changes need your <span className="text-primary-main">attention</span> while also maximizing <span className="text-primary-main">code-review coverage</span>
					</p>
					<Button variant="text" href={props.ctaLink} target="_blank" className='bg-primary-main block text-center m-auto w-[90%] sm:p-5 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5'>
						<Image src={chromeLogo} alt="chrome extension logo" className="w-12 inline mr-2"></Image>
						Download the Chrome Extension
					</Button>
				</article>
			</section>

			<section className='mt-[20%] h-screen items-center sm:block hidden z-[2]'>
				<Image alt='see your relevant files in the PR highlighted' src={highlightFile} className='w-[80%] sm:h-[50%] border-2 border-primary-light' />
				<Image alt='see your relevant PRs highlighted' src={highlightPR} className='w-[80%] sm:h-[50%] mt-[-30%] ml-24 outline outline-2 outline-primary-light' />
			</section>
		</div>
	)
}
export default Hero;
