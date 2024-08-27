import React, { useState } from 'react';
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
	
	const handleCopyClick = () => {
		setIsButtonDisabled(true);
	};

	const handleCopy = () => {
		setIsCopied(true);
		setIsButtonDisabled(false);
	};

	return (
		<div className='relative bg-gray-900 p-4 my-4'>
			<Markdown remarkPlugins={[remarkGfm]}>
				{text}
			</Markdown>
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
