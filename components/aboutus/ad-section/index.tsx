import Image from "next/image";

const AdSec = () => {
  return (
    <div className="flex justify-center items-center p-10 gap-28">
      <div className="w-2/5 font-lato text-5xl font-normal tracking-normal leading-tight">
        <p>All of our work and vision is defined by phrase</p>
        <span className="text-[#1EEBBA] font-bold">{`"Being Productive"`}</span>
      </div>
      <div className="w-96 h-96">
        {/* <Image src="./Workflow.svg" alt="altImg" fill={true} /> */}
        <img src="/Workflow.svg" alt="" />
      </div>
    </div>
  );
};

export default AdSec;
