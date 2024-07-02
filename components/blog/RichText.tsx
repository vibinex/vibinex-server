import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichTextProps {
	data: {
		body: string;
	};
}

const RichText: React.FC<RichTextProps> = ({ data }: RichTextProps	) => {
	return (
		<div className="rich-text py-6 ">
			<Markdown remarkPlugins={[remarkGfm]}>
				{data.body}
			</Markdown>
		</div>
	);
}

export default RichText;