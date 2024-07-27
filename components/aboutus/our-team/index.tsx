import React from "react";
import FlipCard from "./FlipCard";
import { teamMembers } from "../../../utils/about";
import Image from "next/image";

const OurTeam = () => {
  return (
    <div className="flex flex-col items-center min-h-screen pt-20 p-10">
      <div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden">
        <Image
          src="/AboutUsDesignEcllipseHalf.svg"
          alt="aboutus"
          height={500}
          width={500}
          className="absolute left-0 -top-[5%]"
        />
        <Image
          src="/AboutUsDesignGradient.svg"
          alt="aboutus"
          height={500}
          width={500}
          className="absolute right-0 -top-[5%]"
        />
      </div>
      <div>
        <h1 className="font-medium text-5xl tracking-normal font-lato">
          Our <span className="text-[#6B4CFF]">Team</span>
        </h1>
      </div>
      <div className="font-lato font-normal text-3xl text-center mt-10">
        We are a team of passionate individuals who are working towards a common
        goal.
      </div>
      <div className="w-full flex flex-wrap justify-center gap-48 items-center p-5 mt-24">
        {teamMembers.map((member) => (
          <FlipCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
};

export default OurTeam;

// import React from "react";

// const OurTeam = () => {
//   const teamMembers = [
//     {
//       name: "John Doe",
//       role: "CEO",
//       image: "https://via.placeholder.com/150",
//       github: "",
//       linkedIn: "",
//       mailid: "",
//     },
//     {
//       name: "Jane Doe",
//       role: "CTO",
//       image: "https://via.placeholder.com/150",
//       github: "",
//       linkedIn: "",
//       mailid: "",
//     },
//   ];
//   return (
//     <div>
//       {teamMembers.map((member) => (
//         <div key={member.name} className="flex">
//           <div>
//             <img src={member.image} alt={member.name} />
//           </div>
//           <div className="flex flex-col justify-center gap-2">
//             <div>
//               <div>{member.name}</div>
//               <div>{member.role}</div>
//             </div>
//             <div className="flex">
//               <div>{member.github}</div>
//               <div>{member.linkedIn}</div>
//               <div>{member.mailid}</div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OurTeam;
