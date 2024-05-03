import Image from "next/image";

const Loader = () => {
	return (
		<div className="absolute inset-0 flex items-center justify-center z-50  bg-opacity-40 bg-gray-500">
			<output>
				<Image
					src="/blog-loader.svg"
					alt="Loading..."
					className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-400"
				/>
				<span className="sr-only">Loading...</span>
			</output>
		</div>
	);
}

export default Loader;