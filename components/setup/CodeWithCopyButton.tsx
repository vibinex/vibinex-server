import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentCopy } from "react-icons/md";

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
		<div style={{ position: 'relative' }}>
			<pre>{text}</pre>
			<CopyToClipboard text={text} onCopy={handleCopy}>
				<button
					style={{
						position: 'absolute',
						top: '0px',
						right: '0px',
						cursor: 'pointer',
						background: 'none',
						border: 'none',
					}}
					onClick={handleCopyClick}
					disabled={isButtonDisabled}
				>
					<MdContentCopy />
				</button>
			</CopyToClipboard>
			{isCopied && <span style={{ position: 'absolute', top: '0', right: '50%', transform: 'translate(50%, -100%)', color: 'green' }}>Copied!</span>}
		</div>
	);
};

export default CodeWithCopyButton;
