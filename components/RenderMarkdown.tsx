import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const RenderMarkdown = (props: { markdownText: string }) => {
	const { markdownText } = props;
	return (<span className='rich-text'>
		{markdownText.split("\n").map((line: string, index: number) => {
			return (
				<Markdown remarkPlugins={[remarkGfm]} key={index}>
					{line}
				</Markdown>
			)
		})}
	</span>)
}