import React from "react";
import FlipCard from "./FlipCard";
import Image from "next/image";

const teamMembers = [
	{
		name: "Avikalp Gupta",
		role: "CEO",
		image: "https://avatars.githubusercontent.com/u/7858932?v=4",
		github: "https://github.com/avikalpg",
		linkedIn: "https://www.linkedin.com/in/avikalp-gupta",
		highlights: [
			"8 years of experience building commercial AI",
			"Frequent speaker at large developer events",
			"Built GetMega's fairplay-bot that saved $300K",
		],
	},
	{
		name: "Tapish Rathore",
		role: "CTO",
		image: "https://avatars.githubusercontent.com/u/29672720?v=4",
		github: "https://github.com/tapishr",
		linkedIn: "https://www.linkedin.com/in/tapishr",
		highlights: [
			"10 years of building experience across US and India",
			"Expertise in AI, cybersecurity and data engineering",
			"Patented AI agritech solution based on vision models",
		],
	},
];

const OurTeam = () => {
	return (
		<div className="flex flex-col items-center min-h-screen pt-20 p-10">
			<div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden">
				<Image
					src="/AboutUsDesignEcllipseHalf.svg"
					alt="background ellipse"
					height={500}
					width={500}
					className="absolute left-0 -top-[5%]"
				/>
				<Image
					src="/AboutUsDesignGradient.svg"
					alt="background gradient"
					height={500}
					width={500}
					className="absolute -right-[10%] -top-[5%]"
				/>
			</div>
			<h1 className="font-medium text-5xl tracking-normal font-lato mb-4">
				Our <span className="text-[#6B4CFF]">Team</span>
			</h1>
			<p className="font-lato font-normal text-2xl text-center mt-4 mb-16 max-w-2xl">
				A team of passionate engineers building tools that help developers truly understand the code they work with.
			</p>
			<div className="w-full flex flex-wrap justify-center gap-10 md:gap-16 items-center p-5">
				{teamMembers.map((member) => (
					<FlipCard key={member.name} member={member} />
				))}
			</div>
		</div>
	);
};

export default OurTeam;
