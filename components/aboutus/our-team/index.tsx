import React, { useState } from "react";
import FlipCard from "./FlipCard";
import { teamMembers } from "../../../utils/about";

const OurTeam = () => {
  return (
    <>
      <div className="text-4xl text-center font-bold mt-10">
        Our
        <span className="text-blue-500"> Team</span>
      </div>
      <div className="text-lg text-center mt-4">
        We are a team of passionate individuals who are working towards a common
        goal
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {teamMembers.map((member) => (
          <FlipCard key={member.name} member={member} />
        ))}
      </div>
    </>
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
