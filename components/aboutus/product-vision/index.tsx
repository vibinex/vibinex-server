import React from "react";
import Image from "next/image";

const ProductVision = () => {
  return (
    <div className="flex flex-col items-center p-10 min-h-screen gap-6">
      <div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden -left-[10%]">
        <Image
          src="/AboutUsDesignCircles.svg"
          alt="aboutus"
          fill={true}
          className="absolute -top-[20%] "
        />
      </div>
      <div>
        <h1 className="font-medium text-5xl tracking-normal font-lato">
          Product <span className="text-[#6B4CFF]">Vision</span>
        </h1>
      </div>
      <p className="font-lato text-center text-2xl w-[40%] px-10">
        To revolutionize the way software is being built to reduce the cost of
        innovation.
      </p>
    </div>
  );
};

export default ProductVision;
