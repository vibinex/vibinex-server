import Image from "next/image";
interface QuoteProps {
	data: {
	  title: string;
	  body: string;
	  author: string;
	};
}

const Quote = ({ data }: QuoteProps) => {
	const { title, body, author } = data;

	return (
	  <div className="flex flex-col items-center mx-12 lg:mx-0 py-44">
		{title && <h2 className="my-4">{title}</h2>}
		<div className="relative text-center">
		<Image
			src="/blog-quote-begin.svg"
			alt="Quote begin image"
		/>
		  <p className="px-6 py-1 text-lg italic">{body}</p>
		  <Image
			src="/blog-quote-end.svg"
			alt="Quote end image"
		/>
		</div>
		<span className="w-12 h-1 my-2 rounded-lg dark:bg-violet-400"></span>
		{author ? <p>{author}</p> : "unknown"}
	  </div>
	);
}

export default Quote;