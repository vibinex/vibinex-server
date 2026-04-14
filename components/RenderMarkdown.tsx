import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const RenderMarkdown = (props: { markdownText: string }) => {
	const { markdownText } = props;
	return (
		<div className='rich-text'>
			<Markdown remarkPlugins={[remarkGfm]}>
				{markdownText}
			</Markdown>
		</div>
	);
}