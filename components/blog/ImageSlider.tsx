"use client";
import { Fade } from "react-slideshow-image";
import Image from "next/image";
import { getStrapiMedia } from "../../utils/blog/api-helpers";

interface Image {
  id: number;
  attributes: {
	alternativeText: string | null;
	caption: string | null;
	url: string;
  };
}

interface SlideShowProps {
  files: {
	data: Image[];
  };
}

const Slideshow = ({ data }: { data: SlideShowProps }) => {
  return (
	<div className="slide-container">
	  <Fade>
		{data.files.data.map((fadeImage: Image) => {
		  const imageUrl = getStrapiMedia(fadeImage.attributes.url);
		  if (imageUrl === null) {
			console.error(`[ImageSlider/Slideshow] imageUrl is null`);
			return <></>;
		  }
		  return (
			<div key={fadeImage.attributes.url}>
			  {imageUrl && <Image className="w-full h-96 object-cover rounded-lg" height={400} width={600} alt="alt text" src={imageUrl} />}
			</div>
		  );
		})}
	  </Fade>
	</div>
  );
}

export default Slideshow;