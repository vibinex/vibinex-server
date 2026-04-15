import Image from "next/image";
import Link from "next/link";
import { BsLinkedin, BsGithub } from "react-icons/bs";
import Footer from "../../components/Footer";
import MainAppBar from "../../views/MainAppBar";

const teamMembers = [
	{
		name: "Avikalp Gupta",
		role: "CEO",
		image: "/team/avikalp-gupta.jpg",
		github: "https://github.com/avikalpg",
		linkedIn: "https://www.linkedin.com/in/avikalp-gupta",
		highlights: [
			"8 years building commercial AI products",
			"Frequent speaker at developer events",
			"Built GetMega's fairplay-bot — saved $300K",
		],
		credentials: ["IIT Kanpur", "Microsoft Research", "Stanford"],
	},
	{
		name: "Tapish Rathore",
		role: "CTO",
		image: "/team/tapish-rathore.jpg",
		github: "https://github.com/tapishr",
		linkedIn: "https://www.linkedin.com/in/tapishr",
		highlights: [
			"10 years building across US and India",
			"Expertise in AI, cybersecurity & data engineering",
			"Patented AI agritech solution based on vision models",
		],
		credentials: ["AWS", "Netskope", "UC Merced"],
	},
];

const principles = [
	{
		icon: "👤",
		title: "User Centricity",
		body: "Every decision starts with the developer. We build for people who write and review code every day.",
	},
	{
		icon: "🎯",
		title: "Focus",
		body: "We build one thing well — deep understanding of code changes, not a feature list.",
	},
	{
		icon: "🔄",
		title: "Feedback",
		body: "Fast, honest feedback loops inside the product and inside the team. We improve by listening.",
	},
	{
		icon: "⚡",
		title: "Efficiency",
		body: "Respect for people's time is built into everything we make. Less noise, more signal.",
	},
	{
		icon: "🔍",
		title: "Introspection",
		body: "Good software starts with good questions. We think carefully about what we build and why.",
	},
];

const AboutUs = () => {
	return (
		<div className="overflow-x-hidden">
			<MainAppBar />

			{/* Hero */}
			<section className="relative pt-32 pb-20 px-6 text-center">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<Image src="/AboutUsDesignGradientFull.svg" alt="" aria-hidden fill className="object-cover opacity-30" />
				</div>
				<div className="relative max-w-3xl mx-auto space-y-6">
					<p className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">About Vibinex</p>
					<h1 className="text-5xl md:text-6xl font-bold leading-tight text-foreground">
						To reduce the cost of{" "}
						<span className="text-[#6B4CFF]">innovation</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						We believe the bottleneck in software development is no longer writing code — it&apos;s understanding it.
						Vibinex exists to close that gap.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
						<Link href="https://github.com/vibinex" target="_blank"
							className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
							<BsGithub size={18} />
							View on GitHub
						</Link>
						<Link href="/docs/contributor-guide"
							className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg font-medium hover:bg-primary transition-colors">
							Contributor Guide →
						</Link>
					</div>
				</div>
			</section>

			{/* Vision */}
			<section className="relative py-16 px-6">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<Image src="/AboutUsDesignCircles.svg" alt="" aria-hidden fill className="object-cover opacity-10" />
				</div>
				<div className="relative max-w-4xl mx-auto text-center space-y-4">
					<h2 className="text-3xl font-bold text-foreground">Product Vision</h2>
					<p className="text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
						Make every developer genuinely understand the code they work with — so software teams can build faster, safer, and with greater confidence.
					</p>
				</div>
			</section>

			{/* Why contribute */}
			<section className="py-16 px-6 bg-primary">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-foreground mb-12">Why contribute to Vibinex?</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: "🔬",
								title: "Hard, meaningful problem",
								body: "Code understanding at scale is an unsolved problem at the intersection of AI, compilers, and human cognition. You'll work on something genuinely hard.",
							},
							{
								icon: "🌐",
								title: "Open-source & privacy-first",
								body: "Everything we build is open. Your contributions benefit the entire developer community, not just one company.",
							},
							{
								icon: "🚀",
								title: "Early-stage leverage",
								body: "Small team, fast iteration. Your PRs ship in days, not quarters. You'll see real impact on how developers work.",
							},
						].map((item) => (
							<div key={item.title} className="space-y-3">
								<span className="text-4xl">{item.icon}</span>
								<h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
								<p className="text-muted-foreground">{item.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Principles */}
			<section className="py-16 px-6">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Core Principles</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{principles.map((p) => (
							<div key={p.title} className="border border-border rounded-xl p-6 hover:border-[#6B4CFF] transition-colors space-y-2">
								<span className="text-3xl">{p.icon}</span>
								<h3 className="text-lg font-semibold text-[#1EEBBA]">{p.title}</h3>
								<p className="text-muted-foreground text-sm">{p.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Team */}
			<section className="relative py-16 px-6 bg-primary">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<Image src="/AboutUsDesignEcllipseHalf.svg" alt="" aria-hidden fill className="object-cover opacity-10" />
				</div>
				<div className="relative max-w-5xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-foreground mb-4">The Team</h2>
					<p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
						Engineers who have shipped AI products at scale — and are building the tools they wish they&apos;d had.
					</p>
					<div className="flex flex-col md:flex-row gap-8 justify-center">
						{teamMembers.map((member) => (
							<div key={member.name}
								className="flex flex-col sm:flex-row gap-6 border border-border rounded-2xl p-6 bg-background max-w-md w-full">
								<div className="flex-shrink-0">
									<div className="relative w-20 h-20 rounded-full overflow-hidden">
										<Image src={member.image} alt={member.name} fill className="object-cover" />
									</div>
								</div>
								<div className="space-y-3 flex-1">
									<div>
										<h3 className="text-xl font-bold text-foreground">{member.name}</h3>
										<p className="text-[#1EEBBA] font-medium">{member.role}</p>
									</div>
									<ul className="space-y-1 text-sm text-muted-foreground">
										{member.highlights.map((h, i) => (
											<li key={i} className="flex gap-2">
												<span className="text-[#6B4CFF] mt-0.5">•</span>
												<span>{h}</span>
											</li>
										))}
									</ul>
									<div className="flex gap-3 pt-1">
										<a href={member.linkedIn} target="_blank" rel="noopener noreferrer"
											aria-label={`${member.name} on LinkedIn`}
											className="text-muted-foreground hover:text-secondary transition-colors">
											<BsLinkedin size={18} />
										</a>
										<a href={member.github} target="_blank" rel="noopener noreferrer"
											aria-label={`${member.name} on GitHub`}
											className="text-muted-foreground hover:text-foreground transition-colors">
											<BsGithub size={18} />
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Investors */}
			<section className="py-16 px-6">
				<div className="max-w-3xl mx-auto text-center space-y-6">
					<h2 className="text-3xl font-bold text-foreground">Backed By</h2>
					<p className="text-muted-foreground">
						Supported by investors who believe in the future of developer tooling.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-6">
						<a href="https://firstcheque.vc" target="_blank" rel="noopener noreferrer"
							className="inline-flex items-center justify-center bg-white rounded-xl px-8 py-4 shadow-md hover:shadow-lg transition-shadow">
							<span className="text-black font-bold text-xl tracking-tight">
								FIRST/<span className="text-orange-500">CHEQUE</span>
							</span>
						</a>
						<p className="text-muted-foreground text-sm max-w-xs">
							+ angel investors and advisors in developer tools, AI, and enterprise software
						</p>
					</div>
				</div>
			</section>

			{/* Community */}
			<section className="py-16 px-6 bg-primary">
				<div className="max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold text-center text-foreground mb-10">Our Community</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
						{[
							{
								icon: "🏗️",
								title: "Engineering Leaders",
								body: "Senior engineers, EMs, and CTOs who want their teams to build with shared ownership and fewer regressions.",
							},
							{
								icon: "🤝",
								title: "Open-Source Reviewers",
								body: "Hackers and OSS contributors who value thoughtful code review and enjoy getting feedback from peers.",
							},
							{
								icon: "⚙️",
								title: "Contributors",
								body: "Developers building and improving Vibinex itself. Open-source, privacy-first, community-driven.",
							},
						].map((item) => (
							<div key={item.title} className="space-y-3 p-6 border border-border rounded-xl">
								<span className="text-4xl">{item.icon}</span>
								<h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
								<p className="text-muted-foreground text-sm">{item.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="relative py-20 px-6 text-center overflow-hidden">
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<Image src="/AboutUsDesignGradient.svg" alt="" aria-hidden fill className="object-cover opacity-20" />
				</div>
				<div className="relative max-w-2xl mx-auto space-y-6">
					<h2 className="text-4xl font-bold text-foreground">Help us change how developers work</h2>
					<p className="text-muted-foreground text-lg">
						Whether you write code, design systems, or have ideas — start by joining the conversation.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Link href="https://discord.gg/Jama3fB2" target="_blank"
							className="inline-flex items-center gap-2 bg-[#6B4CFF] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
							Join our Discord
						</Link>
						<Link href="https://github.com/vibinex" target="_blank"
							className="inline-flex items-center gap-2 border border-border px-8 py-3 rounded-lg font-medium hover:bg-primary transition-colors">
							<BsGithub size={18} />
							View on GitHub
						</Link>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default AboutUs;
