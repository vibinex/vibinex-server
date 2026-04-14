import Image from "next/image";

const principles = [
	{
		img: "/User.svg",
		title: "User Centricity",
		body: "Every decision starts with the developer. We build for the people who write and review code every day.",
	},
	{
		img: "/focus.svg",
		title: "Focus",
		body: "We build one thing well. Deep understanding of code changes — not a feature list, but a solved problem.",
	},
	{
		img: "/rocket.svg",
		title: "Feedback",
		body: "Fast, honest feedback loops — inside the product and inside the team. We improve by listening.",
	},
	{
		img: "/efficiency.svg",
		title: "Efficiency",
		body: "Respect for people's time is built into everything we make. Less noise, more signal.",
	},
	{
		img: "/introspection.svg",
		title: "Introspection",
		body: "We think carefully about what we build and why. Good software starts with good questions.",
	},
];

const OurPrinciples = () => {
	return (
		<div className="flex flex-col items-center p-10 min-h-screen">
			<div>
				<h1 className="font-medium text-5xl tracking-normal font-lato">
					Our <span className="text-[#6B4CFF]">Core Principles</span>
				</h1>
			</div>
			<div className="w-5xl flex flex-wrap justify-center gap-14 items-center pt-0 md:pt-28">
				{principles.map((item) => (
					<div
						key={item.title}
						className="flex flex-col justify-between items-center h-[500px] w-96 p-5"
					>
						<div className="relative glow-effect h-72 w-72 md:h-96 md:w-96">
							<Image src={item.img} alt={item.title} fill={true} />
						</div>
						<div className="flex flex-col gap-4 justify-center items-center">
							<div className="font-semibold text-3xl text-[#1EEBBA] font-lato glow">
								{item.title}
							</div>
							<div className="text-xl text-justify font-lato">{item.body}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default OurPrinciples;
