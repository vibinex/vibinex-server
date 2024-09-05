import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from "react-icons/md";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CodeWithCopyButtonProps {
	text: string;
}

const CodeWithCopyButton: React.FC<CodeWithCopyButtonProps> = ({ text }) => {
	const [isCopied, setIsCopied] = useState<boolean>(false);
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

	// Function to clean up the text before displaying
	const cleanUpText = (text: string) => {
		// Make sure that backslashes are properly escaped for Markdown
		return text.replace(/\\/g, '\\\\');
	};

	const handleCopyClick = () => {
		setIsButtonDisabled(true);
	};

	const handleCopy = () => {
		setIsCopied(true);
		setIsButtonDisabled(false);
	};

	useEffect(() => {
 		let timer: NodeJS.Timeout;
 		if (isCopied) {
 			timer = setTimeout(() => {
 				setIsCopied(false);
				setIsButtonDisabled(false);
 			}, 2000); // Reset after 2 seconds
 		}
 		return () => clearTimeout(timer);
 	}, [isCopied]);
 
	return (
		<div className='relative border p-4 my-4'>
			<pre style={{ whiteSpace: 'pre-wrap' }}>
				<Markdown remarkPlugins={[remarkGfm]}>
					{cleanUpText(text)}
				</Markdown>
			</pre>
			<CopyToClipboard text={text} onCopy={handleCopy}>
				<button
					className="absolute top-0 right-0 p-1 cursor-pointer bg-transparent border-none"
					onClick={handleCopyClick}
					disabled={isButtonDisabled}
				>
					<MdContentCopy />
				</button>
			</CopyToClipboard>
			{isCopied && <span className="absolute top-15 right-10 transform translate-x-1/2 -translate-y-full text-green-500">Copied!</span>}
		</div>
	);
};

export default CodeWithCopyButton;
