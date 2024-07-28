import { BsLinkedin } from "react-icons/bs";
import { BiEnvelope } from "react-icons/bi";
import { BsGithub } from "react-icons/bs";
import Image from "next/image";

interface Member {
  image: string;
  name: string;
  role: string;
  github: string;
  linkedIn: string;
  mailId: string;
}

const FlipCard = ({ member }: { member: Member }) => {
  return (
    <div
      className={`flex justify-start bg-gradient-to-r from-[#3f4041] to-[#253d4d] rounded-lg p-2.5 shadow-lg w-[25rem] h-[12rem] text-white font-lato`}
    >
      <div className="flex flex-col justify-between px-[1.2rem] py-[1rem] w-56">
        <div className="flex-2">
          <h3 className="text-[1.7rem] font-semibold m-0">{member.name}</h3>
          <p className="text-[1rem] font-normal m-0  text-[#1EEBBA]">
            {member.role}
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 hover:opacity-45"
          >
            <BsLinkedin size={20} />
          </a>
          <a
            href={member.mailId}
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 hover:opacity-45"
          >
            <BiEnvelope size={20} />
          </a>
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 hover:opacity-45"
          >
            <BsGithub size={20} />
          </a>
        </div>
      </div>
      <div className="relative w-[16rem] h-[17.3rem] -mr-[18rem] -mt-[5.5rem] shadow-lg box-shadow">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default FlipCard;
