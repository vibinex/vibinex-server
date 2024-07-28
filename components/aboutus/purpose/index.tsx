import React from "react";
import Image from "next/image";

const PurposeOfCompany = () => {
  return (
    <div className="flex flex-col items-center justify-start md:justify-center min-h-screen gap-6">
      <div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden">
        <Image
          src="/AboutUsDesignGradientFull.svg"
          alt="aboutus"
          height={800}
          width={800}
          className="absolute -top-[20%] -left-[10%]"
        />

        <Image
          src="/AboutUsDesignEcllipseFull.svg"
          alt="aboutus"
          height={800}
          width={800}
          className="absolute -right-[10%] "
        />
        <Image
          src="/AboutUsDesignGradientFull.svg"
          alt="aboutus"
          height={800}
          width={800}
          className="absolute -right-[10%]  "
        />
        <Image
          src="/AboutUsDesignStars.svg"
          alt="aboutus"
          height={75}
          width={75}
          className="absolute left-[15%] bottom-[15%] md:bottom-[25%]"
        />
      </div>
      <div className="pt-28 md:pt-0">
        <h1 className="font-medium p-10 md:p-0 text-7xl tracking-normal font-lato">
          Purpose of <span className="text-[#6B4CFF]">the Company</span>
        </h1>
      </div>
      <p className="font-lato text-center text-2xl w-[90%] md:w-[40%] px-10">
        To revolutionize the way software is being built to reduce the cost of
        innovation.
      </p>
    </div>
  );
};

export default PurposeOfCompany;
