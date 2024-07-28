import Image from "next/image";

const OurCommunity = () => {
  return (
    <div className="flex flex-col p-10 min-h-screen items-center gap-10">
      <div className="flex absolute justify-between w-[100vw] h-[100vh] overflow-hidden">
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
      </div>
      <div>
        <h1 className="font-medium text-5xl tracking-normal font-lato">
          Our <span className="text-[#6B4CFF]">Community</span>
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center gap-20 w-[90%] pt-10">
        <div className="max-w-4xl">
          <p className="font-lato font-normal text-3xl text-justify">
            Vibinex is a community of tech enthusiasts. There are three main
            participants in the community:
          </p>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-[90%]">
          <ul className="flex flex-col gap-6 max-w-full md:max-w-4xl font-lato font-normal text-3xl text-justify">
            <li>
              Senior software architects and engineers, engineering managers and
              CTOs.
            </li>
            <li>
              <b>Co-reviewers club:</b> Independent hackers and hobby developers
              (especially of open-source projects) who like to receive inputs
              and feedback from others on their code.
            </li>
            <li>Contributors to the Vibinex project.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OurCommunity;
