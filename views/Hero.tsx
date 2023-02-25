import Link from "next/link";
import React from "react";

const Hero = () => {
	return (
		<div className='flex items-center justify-center h-screen mb-12 bg-fixed bg-center bg-cover'
			style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80')" }}
		>
			{/*Overlay*/}
			<div className='absolute top-0 right-0 bottom-0 left-0 bg-black/70 z-[2]' />
			<section className='p-5 text-primary-light z-[2] m-auto'>

				<article className="m-auto w-[60%]">
					<h1 className='sm:text-[80px] text-[50px] font-bold'>Get context for</h1>
					<h1 className='text-primary-main font-bold mt-[-20px] sm:text-[80px] text-[50px]'>
						Pull Requests
					</h1>
				</article>

				<article className='sm:text-[25px] text-[25px] w-[60%] m-auto mt-6 mb-6 text-gray-300'>
					<p className="mt-20 mb-10">like never before! With <span className="text-primary-main">Vibinex</span> you can quickly know which code-changes need your attention</p>
				</article>

				<Link href='/login' className='bg-primary-main block text-center m-auto w-[60%] sm:p-5 p-3 pl-20 pr-20 rounded-lg font-bold sm:text-[25px] text-[20px] mt-5'>Get Started</Link>
			</section>

		</div>
	)
}
export default Hero;
