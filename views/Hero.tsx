import React from "react";
import Button from "../components/Button";
import Image from "next/image";
import highlightPR from '../public/highlightPR.png'
import highlightFile from '../public/highlightFile.png'
import chromeLogo from '../public/chrome-logo.png'
import Link from "next/link";

const Hero = (props: { ctaLink: string }) => {
	return (
		<div className='flex items-center justify-center h-screen bg-fixed bg-center bg-cover w-full'
			style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80')" }}
		>
			{/*Overlay*/}
			<div className='absolute top-0 right-0 bottom-0 left-0 bg-black/75 z-[2]' />
			<section className='p-5 text-primary-light z-[2] md:mt-[5%] pt-1 md:w-[50%]'>
				<article className="text-center">
					<h1 className='text-[35px] sm:text-[48px] lg:text-[60px] font-bold'>{'Personalization for'}
						<span className='text-primary-main font-bold block'>
							Code Reviews
						</span>
					</h1>
					<p className="text-xl sm:text-2xl mt-15 mb-10 text-gray-300">
						Know which code-changes need your <span className="text-primary-main">attention</span> while also maximizing <span className="text-primary-main">code-review coverage</span>
					</p>
					<div className="w-full flex space-x-4">
						<Button variant="contained" href={props.ctaLink} target="_blank" className='text-center w-[45%] p-3 sm:p-4 px-20 rounded-lg font-bold text-[20px] sm:text-[25px] mt-5'>
							<Image src={chromeLogo} alt="chrome extension logo" className="w-10 inline mr-2 border border-white rounded-full"></Image>
							Add to Chrome
						</Button>
						<Button variant="outlined" href="https://calendly.com/avikalp-gupta/30min" target="_blank" className='text-center w-[45%] sm:p-4 p-3 px-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5'>
							Book demo
						</Button>
					</div>
					<Link href="https://www.producthunt.com/posts/vibinex-code-review?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-vibinex&#0045;code&#0045;review" target="_blank"
						className="block mt-10 w-64 h-14 border border-white rounded-lg m-auto">
						<img
							src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=394365&theme=dark"
							alt="Vibinex&#0032;Code&#0045;Review - A&#0032;distributed&#0032;process&#0032;for&#0032;reviewing&#0032;pull&#0032;requests | Product Hunt"
							className="w-full h-full" width="250" height="54" />
					</Link>
				</article>
			</section>

			<section className='mt-[20%] h-screen items-center lg:block hidden z-[2]'>
				<Image priority alt='see your relevant files in the PR highlighted' src={highlightFile} className='w-[80%] sm:h-[50%] border-2 border-primary-light' />
				<Image priority alt='see your relevant PRs highlighted' src={highlightPR} className='w-[80%] sm:h-[50%] mt-[-30%] ml-24 outline outline-2 outline-primary-light' />
			</section>
		</div>
	)
}
export default Hero;
