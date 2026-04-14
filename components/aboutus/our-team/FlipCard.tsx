import { BsLinkedin, BsGithub } from "react-icons/bs";
import Image from "next/image";

interface Member {
	image: string;
	name: string;
	role: string;
	github: string;
	linkedIn: string;
	highlights: string[];
}

const FlipCard = ({ member }: { member: Member }) => {
	return (
		<div className="flex flex-col md:flex-row justify-start bg-gradient-to-r from-[#3f4041] to-[#253d4d] rounded-lg p-4 shadow-lg w-[28rem] text-white font-lato gap-4">
			<div className="flex flex-col justify-between min-w-[11rem]">
				<div className="relative w-28 h-28 mx-auto mb-3">
					<Image
						src={member.image}
						alt={member.name}
						fill
						className="rounded-full object-cover"
					/>
				</div>
				<div className="text-center">
					<h3 className="text-xl font-semibold">{member.name}</h3>
					<p className="text-sm font-normal text-[#1EEBBA]">{member.role}</p>
				</div>
				<div className="flex gap-4 mt-3 justify-center">
					<a href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
						<BsLinkedin size={20} />
					</a>
					<a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
						<BsGithub size={20} />
					</a>
				</div>
			</div>
			<ul className="flex flex-col justify-center gap-2 text-sm list-disc list-outside pl-4 text-gray-200">
				{member.highlights.map((h, i) => (
					<li key={i}>{h}</li>
				))}
			</ul>
		</div>
	);
};

export default FlipCard;
