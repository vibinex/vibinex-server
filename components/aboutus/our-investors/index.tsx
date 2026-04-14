import Image from "next/image";

const investors = [
	{
		id: "firstcheque",
		name: "FirstCheque",
		logo: "/investor-firstcheque.png",
		url: "https://firstcheque.vc",
		type: "institutional",
	},
];

const angels = [
	"Leading angel investors and industry advisors in developer tools, AI, and enterprise software.",
];

const OurInvestors = () => {
	return (
		<div className="flex flex-col p-10 min-h-screen items-center gap-10">
			<div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden">
				<Image
					src="/AboutUsDesignGradientFull.svg"
					alt="background gradient"
					height={800}
					width={800}
					className="absolute -left-[20%]"
				/>
				<Image
					src="/AboutUsDesignStarBig.svg"
					alt="background stars"
					height={600}
					width={600}
					className="absolute -right-[5%]"
				/>
			</div>
			<h1 className="font-medium text-5xl tracking-normal font-lato">
				Our <span className="text-[#6B4CFF]">Investors</span>
			</h1>
			<div className="flex flex-col justify-center items-center gap-16 w-[90%] max-w-4xl">
				<p className="font-lato font-normal text-2xl text-center">
					We are backed by investors who believe deeply in the future of developer tooling and AI-assisted software development.
				</p>

				{/* Institutional investor */}
				<div className="flex flex-col items-center gap-4">
					<h2 className="font-lato text-xl font-semibold text-muted-foreground uppercase tracking-widest">Institutional</h2>
					<a
						href="https://firstcheque.vc"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center bg-white rounded-xl px-8 py-4 shadow-md hover:shadow-lg transition-shadow"
					>
						<span className="text-black font-bold text-2xl tracking-tight">FIRST/<span className="text-orange-500">CHEQUE</span></span>
					</a>
				</div>

				{/* Angel investors note */}
				<div className="flex flex-col items-center gap-4 text-center">
					<h2 className="font-lato text-xl font-semibold text-muted-foreground uppercase tracking-widest">Angel Investors &amp; Advisors</h2>
					{angels.map((note, i) => (
						<p key={i} className="font-lato text-xl text-muted-foreground">{note}</p>
					))}
				</div>
			</div>
		</div>
	);
};

export default OurInvestors;
