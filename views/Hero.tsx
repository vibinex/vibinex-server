import React from "react";
import Button from "../components/Button";
import { login } from "../utils/auth";
import Image from "next/image";
import highlightPR from '../public/highlightPR.png'
import highlightFile from '../public/highlightFile.png'

const Hero = () => {
	return (
		<div className='flex items-center justify-center h-screen bg-fixed bg-center bg-cover'
			style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80')" }}
		>
			{/*Overlay*/}
			<div className='absolute top-0 right-0 bottom-0 left-0 bg-black/70 z-[2]' />
			<section className='p-5 text-primary-light z-[2] sm:mt-[10%] sm:pt-1 pt-24 sm:w-[50%]'>
				<article className="text-center">
					<h1 className='sm:text-[60px] text-[35px] font-bold'>{'Get context for'}
						<span className='text-primary-main font-bold block'>
							Pull Requests
						</span>
					</h1>
					<p className="text-[25px] mt-20 mb-10 text-gray-300">
						With <span className="text-primary-main">Vibinex</span> you can quickly know which code-changes need your attention
					</p>
					<Button variant="text" onClick={() => login()} className='bg-primary-main block text-center m-auto w-[90%] sm:p-5 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5'>Get Started</Button>
				</article>
			</section>

			<section className='mt-[20%] h-screen items-center sm:block hidden z-[2]'>
				<Image alt='see your relevant files in the PR highlighted' src={highlightFile} className='sm:w-[95%] w-[90%]  sm:h-[50%] z-10 border-2' />
				<Image alt='see your relevant PRs highlighted' src={highlightPR} className='sm:w-[95%] w-[90%] sm:h-[50%]  mt-[-30%] border-2 border-r-2 ml-4 border-primary-light' />
			</section>
		</div>
	)
}
export default Hero;
