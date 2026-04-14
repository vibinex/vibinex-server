import Image from "next/image";

const OurCommunity = () => {
	return (
		<div className="flex flex-col p-10 min-h-screen items-center gap-10">
			<div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden">
				<Image
					src="/AboutUsDesignEcllipseFull.svg"
					alt="background ellipse"
					height={800}
					width={800}
					className="absolute -right-[10%]"
				/>
				<Image
					src="/AboutUsDesignGradientFull.svg"
					alt="background gradient"
					height={800}
					width={800}
					className="absolute -right-[10%]"
				/>
			</div>
			<h1 className="font-medium text-5xl tracking-normal font-lato">
				Our <span className="text-[#6B4CFF]">Community</span>
			</h1>
			<div className="flex flex-col justify-center items-center gap-20 w-[90%] pt-10">
				<div className="max-w-4xl">
					<p className="font-lato font-normal text-3xl text-justify">
						Vibinex is built for and with a community of developers who care about code quality. Three groups make up the Vibinex community:
					</p>
				</div>
				<div className="flex flex-col justify-center items-center w-full md:w-[90%]">
					<ul className="flex flex-col gap-6 max-w-full md:max-w-4xl font-lato font-normal text-2xl text-justify">
						<li>
							<b>Engineering leaders:</b> Senior engineers, engineering managers, and CTOs who want their teams to build with greater quality and shared ownership.
						</li>
						<li>
							<b>Co-reviewers club:</b> Independent hackers and open-source contributors who value thoughtful code review and enjoy getting feedback from others.
						</li>
						<li>
							<b>Contributors:</b> Developers who build and improve Vibinex itself — open-source, privacy-first, and community-driven.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default OurCommunity;
