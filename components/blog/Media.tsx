import Image from "next/image";
import { getStrapiMedia } from "../../utils/blog/api-helpers";

interface MediaProps {
  file: {
	data: {
	  id: string;
	  attributes: {
		url: string;
		name: string;
		alternativeText: string;
	  };
	};
  };
}

const Media = ({data} : {data: MediaProps} ) => {
  const imgUrl = getStrapiMedia(data.file.data.attributes.url);
  if (!imgUrl) {
	console.error(`[blog/Media] imgUrl is null`);
	return <>Missing image</>;
  }
  return (
	<div className="flex items-center justify-center mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
	  <Image
		src={imgUrl ?? ""}
		alt={data.file.data.attributes.alternativeText || "none provided"}
		className="object-cover w-full h-full rounded-lg overflow-hidden"
		width={400}
		height={400}
	  />
	</div>
  );
}

export default Media;