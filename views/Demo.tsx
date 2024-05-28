import React from 'react'
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

const ProductDemo = () => {
	return (
		<div id='demo' className='w-full text-center py-12'>
			<h2 className='font-bold text-[2rem]'>Vibinex <span className='text-[2rem] text-secondary font-bold'>Demo</span> for GitHub</h2>
			<div className='w-full md:w-2/3 mt-8 m-auto px-2'>
				<LiteYouTubeEmbed id="Mennyfd5KNU" title="Vibinex Code Review Demo for GitHub" />
			</div>
		</div>
	)
}
export default ProductDemo