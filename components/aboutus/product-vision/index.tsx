import React from "react";
import Image from "next/image";

const ProductVision = () => {
	return (
		<div className="flex flex-col items-center p-10 min-h-screen gap-6">
			<div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden -left-[10%]">
				<Image
					src="/AboutUsDesignCircles.svg"
					alt="background circles"
					fill={true}
					className="absolute -top-[20%]"
				/>
			</div>
			<div>
				<h1 className="font-medium text-5xl tracking-normal font-lato">
					Product <span className="text-[#6B4CFF]">Vision</span>
				</h1>
			</div>
			<p className="font-lato text-center text-2xl w-full md:w-[50%] px-10">
				Make every developer genuinely understand the code they work with —
				so that software teams can build faster, safer, and with greater confidence.
			</p>
		</div>
	);
};

export default ProductVision;
