import Image from "next/image";
import { Investors } from "../../../utils/about";

const OurInvestors = () => {
  return (
    <div className="flex flex-col p-10 items-center gap-10">
      <div>
        <h1 className="font-medium text-5xl tracking-normal font-lato">
          Our <span className="text-[#6B4CFF]">Investors</span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-20 w-[90%]">
        <div className="max-w-4xl">
          <p className="font-lato font-normal text-3xl text-center">
            We are backed by a group of visionary investors who believe in our
            mission and support our growth and innovation in the field of code
            review automation.
          </p>
        </div>
        <div className="flex flex-wrap justify-evenly gap-60UA p-5">
          {Investors.map((member) => (
            <div key={member.id} className="flex relative h-48 w-52">
              <Image
                src={member.img}
                alt={`investor ${member.id}`}
                fill={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurInvestors;
